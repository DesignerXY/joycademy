import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { sound } from '../../utils/audio';
import { speech } from '../../utils/speech';
import { feedPet, patPet } from '../../utils/storage';
import { X, Heart, Sparkles, Volume2, Coins } from 'lucide-react';

const PET_TYPES = [
  { id: 'dragon', name: '算术小神龙', emoji: '🐲', title: '数理逻辑守护者' },
  { id: 'cat', name: '智慧魔法猫', emoji: '🐱', title: '博雅文采小书童' },
  { id: 'rabbit', name: '机械跳跳兔', emoji: '🐰', title: '万物科学探索先锋' },
  { id: 'canary', name: '双语金丝雀', emoji: '🐥', title: '英语口语留声机' }
];

export default function MobilePetWidget({ profile, onFeedPet }) {
  const [showDrawer, setShowDrawer] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [floatingHeart, setFloatingHeart] = useState(false);

  const petData = profile.pet || { name: '算术小神龙', level: 1, exp: 0, type: 'dragon' };
  const currentPet = PET_TYPES.find(p => p.id === petData.type) || PET_TYPES[0];

  const petSpeech = '今天也要元气满满地探索知识岛屿哦！按时复习错题，你就是最棒的小学霸！';

  const handleSpeak = () => {
    if (isSpeaking) {
      speech.stop();
      setIsSpeaking(false);
    } else {
      setIsSpeaking(true);
      speech.speak(petSpeech, {
        lang: 'zh-CN',
        onEnd: () => setIsSpeaking(false)
      });
    }
  };

  const handleFeed = () => {
    if ((profile.coins || 0) < 5) {
      sound.playWrong();
      alert('金币不足 5 枚哦！快去答题闯关赚取金币吧！🪙');
      return;
    }
    sound.playCoin();
    feedPet();
    if (onFeedPet) onFeedPet();
    setFloatingHeart(true);
    setTimeout(() => setFloatingHeart(false), 1200);

    if ((petData.exp || 0) + 25 >= 100) {
      sound.playLevelUp();
      try {
        confetti({ particleCount: 60, spread: 60, origin: { y: 0.8 } });
      } catch (e) {}
    }
  };

  const handlePat = () => {
    sound.playCorrect();
    patPet();
    if (onFeedPet) onFeedPet();
    setFloatingHeart(true);
    setTimeout(() => setFloatingHeart(false), 1000);
  };

  return (
    <>
      {/* 悬浮灵宠气泡 */}
      <div
        className="m-floating-pet-btn m-pressable"
        onClick={() => {
          sound.playClick();
          setShowDrawer(true);
        }}
        title="伴学小精灵"
      >
        <span className="m-pet-icon">{currentPet.emoji}</span>
        <span className="m-pet-badge">Lv.{petData.level || 1}</span>
      </div>

      {/* 底部交互抽屉 */}
      {showDrawer && (
        <div className="m-pet-drawer-sheet" onClick={() => setShowDrawer(false)}>
          <div className="m-sheet-panel" onClick={e => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <span style={{ fontSize: '2rem' }}>{currentPet.emoji}</span>
                <div>
                  <h4 style={{ fontSize: '1.05rem', fontWeight: 900, color: '#1E293B' }}>{petData.name || currentPet.name}</h4>
                  <span style={{ fontSize: '0.72rem', color: '#64748B', fontWeight: 700 }}>{currentPet.title}</span>
                </div>
              </div>
              <button className="m-modal-close-btn m-pressable" onClick={() => setShowDrawer(false)}>
                <X size={18} />
              </button>
            </div>

            {/* 等级与经验条 */}
            <div style={{ background: '#F8FAFC', padding: 12, borderRadius: 10, border: '1px solid #E2E8F0', marginBottom: 14 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', fontWeight: 800, color: '#475569', marginBottom: 6 }}>
                <span>成长等级 Lv.{petData.level || 1}</span>
                <span>经验: {petData.exp || 0} / 100</span>
              </div>
              <div style={{ width: '100%', height: 8, background: '#E2E8F0', borderRadius: 4, overflow: 'hidden' }}>
                <div style={{ height: '100%', width: `${petData.exp || 0}%`, background: 'linear-gradient(90deg, #10B981, #34D399)', transition: 'width 0.3s' }} />
              </div>
            </div>

            {/* 灵宠对话 */}
            <div style={{ background: '#FFFBEB', border: '1px solid #FDE68A', padding: 12, borderRadius: 10, marginBottom: 16 }}>
              <p style={{ fontSize: '0.85rem', color: '#92400E', fontWeight: 700, lineHeight: 1.5 }}>
                “{petSpeech}”
              </p>
              <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 8 }}>
                <button
                  className="m-pressable"
                  style={{ display: 'inline-flex', alignItems: 'center', gap: 4, fontSize: '0.72rem', fontWeight: 800, color: '#B45309', background: '#FEF3C7', padding: '3px 8px', borderRadius: 9999 }}
                  onClick={handleSpeak}
                >
                  <Volume2 size={12} />
                  <span>{isSpeaking ? '停止' : '听它说话'}</span>
                </button>
              </div>
            </div>

            {/* 互动按钮 */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
              <button
                className="m-quiz-opt-btn m-pressable"
                style={{ justifyContent: 'center', background: '#FEF3C7', borderColor: '#FDE68A', color: '#92400E' }}
                onClick={handleFeed}
              >
                <Coins size={16} />
                <span>喂食 (+25经验/5金币)</span>
              </button>
              <button
                className="m-quiz-opt-btn m-pressable"
                style={{ justifyContent: 'center', background: '#FFE4E6', borderColor: '#FECDD3', color: '#BE123C' }}
                onClick={handlePat}
              >
                <Heart size={16} />
                <span>抚摸互动</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
