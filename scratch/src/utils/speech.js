// 浏览器原生 Web Speech API 中英文智能双语朗读工具（防打断、防GC、多音色智能选择）

class SpeechReader {
  constructor() {
    this.synth = typeof window !== 'undefined' ? window.speechSynthesis : null;
    this.isSpeaking = false;
    this.activeUtterances = []; // 防止 Chromium GC 垃圾回收导致中断
    this.voices = [];

    if (this.synth) {
      this.loadVoices();
      if (typeof window !== 'undefined' && window.speechSynthesis) {
        window.speechSynthesis.onvoiceschanged = () => {
          this.loadVoices();
        };
      }
    }
  }

  loadVoices() {
    if (!this.synth) return;
    try {
      this.voices = this.synth.getVoices() || [];
    } catch (e) {
      console.warn('获取系统语音包失败:', e);
    }
  }

  // 判断文本是否主要为英文
  isEnglishText(text) {
    if (!text) return false;
    // 剔除标点和数字后，如果英文字符占比超过 40%，则判定为英文发音
    const englishChars = (text.match(/[a-zA-Z]/g) || []).length;
    const chineseChars = (text.match(/[\u4e00-\u9fa5]/g) || []).length;
    return englishChars > chineseChars;
  }

  getVoice(isEn = false) {
    if (!this.voices.length) {
      this.loadVoices();
    }
    if (isEn) {
      // 优选英文原声（如 US/UK 纯正口音）
      const enVoice =
        this.voices.find(v => v.lang === 'en-US' || v.lang === 'en_US') ||
        this.voices.find(v => v.lang.startsWith('en')) ||
        this.voices.find(v => v.name.includes('English') || v.name.includes('Natural'));
      return enVoice || null;
    } else {
      // 优选普通话中文声音
      const zhVoice =
        this.voices.find(v => v.lang === 'zh-CN' || v.lang === 'zh_CN' || v.lang === 'cmn-Hans-CN') ||
        this.voices.find(v => v.lang.startsWith('zh'));
      return zhVoice || null;
    }
  }

  speak(text, onEndCallback = null) {
    if (!this.synth) {
      console.warn('当前浏览器或系统不支持语音朗读 API');
      return;
    }

    try {
      if (this.synth.paused) {
        this.synth.resume();
      }
    } catch (e) {}

    // 停止当前播报
    this.stop();

    // 延迟 60ms 防止 Chromium 在同一宏任务中判为 interrupted
    setTimeout(() => {
      try {
        const isEn = this.isEnglishText(text);

        let cleanText = text;
        if (!isEn) {
          cleanText = text
            .replace(/[\(\)\[\]_]/g, ' ')
            .replace(/×/g, '乘')
            .replace(/÷/g, '除以')
            .replace(/\+/g, '加')
            .replace(/-/g, '减')
            .replace(/=/g, '等于')
            .replace(/○/g, '圆圈')
            .replace(/□/g, '方框')
            .replace(/△/g, '三角');
        }

        const utterance = new SpeechSynthesisUtterance(cleanText);
        utterance.lang = isEn ? 'en-US' : 'zh-CN';
        utterance.rate = isEn ? 0.9 : 0.95; // 英文稍慢便于小学生听清标准音标
        utterance.pitch = isEn ? 1.0 : 1.1;

        const matchedVoice = this.getVoice(isEn);
        if (matchedVoice) {
          utterance.voice = matchedVoice;
        }

        // 保存引用以抗垃圾回收
        this.activeUtterances.push(utterance);

        utterance.onstart = () => {
          this.isSpeaking = true;
        };

        const cleanup = () => {
          this.isSpeaking = false;
          const idx = this.activeUtterances.indexOf(utterance);
          if (idx !== -1) {
            this.activeUtterances.splice(idx, 1);
          }
        };

        utterance.onend = () => {
          cleanup();
          if (onEndCallback) onEndCallback();
        };

        utterance.onerror = (e) => {
          cleanup();
          if (e.error === 'interrupted' || e.error === 'canceled') {
            return;
          }
          console.warn('SpeechSynthesis error:', e.error);
        };

        this.synth.speak(utterance);
      } catch (err) {
        console.warn('语音播放执行异常:', err);
        this.isSpeaking = false;
      }
    }, 60);
  }

  stop() {
    if (this.synth) {
      try {
        this.synth.cancel();
      } catch (e) {}
    }
    this.isSpeaking = false;
    this.activeUtterances = [];
  }
}

export const speech = new SpeechReader();
