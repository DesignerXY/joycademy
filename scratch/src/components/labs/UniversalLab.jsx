import React, { useState } from 'react';
import { sound } from '../../utils/audio';
import { speech } from '../../utils/speech';
import { Sparkles, CheckCircle2, RefreshCw, Volume2, Move, Compass } from 'lucide-react';

export default function UniversalLab({ unit, onComplete }) {
  const labType = unit?.labType;

  switch (labType) {
    case 'makeTen':
      return <MakeTenLab unit={unit} onComplete={onComplete} />;
    case 'breakTen':
      return <BreakTenLab unit={unit} onComplete={onComplete} />;
    case 'pinyin':
      return <PinyinLab unit={unit} onComplete={onComplete} />;
    case 'hanzi':
      return <HanziLab unit={unit} onComplete={onComplete} />;
    case 'money':
      return <MoneyExchangeLab unit={unit} onComplete={onComplete} />;
    case 'multiTable':
      return <MultiTableLab unit={unit} onComplete={onComplete} />;
    case 'magnet':
      return <MagnetLab unit={unit} onComplete={onComplete} />;
    case 'angle':
      return <AngleLab unit={unit} onComplete={onComplete} />;
    case 'transform':
      return <TransformLab unit={unit} onComplete={onComplete} />;
    case 'thermalLab':
      return <ThermalLab unit={unit} onComplete={onComplete} />;
    case 'plantLab':
    case 'microscope':
      return <PlantLab unit={unit} onComplete={onComplete} />;
    case 'equationBalance':
      return <EquationBalanceLab unit={unit} onComplete={onComplete} />;
    case 'circleArea':
      return <CircleAreaLab unit={unit} onComplete={onComplete} />;
    case 'circuitLab':
      return <CircuitLab unit={unit} onComplete={onComplete} />;
    case 'foodChain':
      return <FoodChainLab unit={unit} onComplete={onComplete} />;
    case 'decimalShift':
      return <DecimalShiftLab unit={unit} onComplete={onComplete} />;
    case 'phonics':
    case 'wordMatch':
    case 'bodyParts':
    case 'animalKingdom':
      return <EnglishPhonicsLab unit={unit} onComplete={onComplete} />;
    case 'poetry':
    case 'literature':
    case 'waterCycle':
      return <PoetryLiteratureLab unit={unit} onComplete={onComplete} />;
    default:
      return <GenericExploreLab unit={unit} onComplete={onComplete} />;
  }
}

// 1. 凑十法互动工坊 (Grade 1 Math)
function MakeTenLab({ unit, onComplete }) {
  const [targetB, setTargetB] = useState(4); // 9 + 4
  const needForTen = 1;
  const rest = Math.max(0, targetB - needForTen);

  const handleB = (delta) => {
    sound.playClick();
    setTargetB(prev => Math.max(2, Math.min(8, prev + delta)));
  };

  return (
    <div className="lab-container">
      <div className="lab-mission-banner">
        <Sparkles size={20} className="text-amber" />
        <span>具象工坊 · “凑十法”魔法拆数计算台：9 + {targetB}</span>
      </div>

      <div className="make-ten-stage">
        <div className="math-decompose-box">
          <div className="split-num-card">
            <span className="big-num">9</span>
            <span className="plus-sign">+</span>
            <div className="split-target">
              <span className="big-num text-amber">{targetB}</span>
              <div className="split-branches">
                <span className="branch-val">{needForTen}</span>
                <span className="branch-val">{rest}</span>
              </div>
            </div>
          </div>

          <div className="step-arrows-box">
            <div className="step-chip">① 9 和 1 凑成 <strong>10</strong></div>
            <div className="step-chip">② 10 加上剩下的 {rest} 等于 <strong>{10 + rest}</strong></div>
          </div>
        </div>

        <div className="ten-beads-grid">
          <div className="bead-box box-nine">
            <div className="box-title">左边：9 颗蓝珠</div>
            <div className="beads-row">
              {Array.from({ length: 9 }).map((_, i) => (
                <span key={i} className="bead blue-bead">●</span>
              ))}
              <span className="bead red-bead animate-pulse" title="借来1颗凑成10">●</span>
            </div>
            <span className="box-tag">正好凑齐满十！</span>
          </div>

          <div className="bead-box box-rest">
            <div className="box-title">右边剩下的珠子</div>
            <div className="beads-row">
              {Array.from({ length: rest }).map((_, i) => (
                <span key={i} className="bead red-bead">●</span>
              ))}
            </div>
            <span className="box-tag">剩下 {rest} 颗</span>
          </div>
        </div>

        <div className="controls-row-center mt-3">
          <span>调整第二个加数：</span>
          <button className="chip-btn" onClick={() => handleB(-1)}>-1</button>
          <span className="val-display">{targetB}</span>
          <button className="chip-btn" onClick={() => handleB(1)}>+1</button>
          <button className="chip-btn primary ml-3" onClick={() => { sound.playCorrect(); if (onComplete) onComplete(); }}>
            领悟凑十神技！
          </button>
        </div>
      </div>
    </div>
  );
}

// 2. 破十法互动工坊 (Grade 1 Math)
function BreakTenLab({ unit, onComplete }) {
  const [minuend, setMinuend] = useState(13); // 13 - 9
  const sub = 9;
  const ones = minuend - 10;
  const tenMinusSub = 10 - sub; // 1
  const result = tenMinusSub + ones;

  return (
    <div className="lab-container">
      <div className="lab-mission-banner">
        <Sparkles size={20} className="text-amber" />
        <span>具象工坊 · “破十法”退位拆数台：{minuend} - {sub}</span>
      </div>

      <div className="break-ten-stage">
        <div className="break-formula-card">
          <div className="break-step">
            <strong>第一步（拆出十）：</strong> 把 {minuend} 分成 <strong>10</strong> 和 <strong>{ones}</strong>
          </div>
          <div className="break-step highlight">
            <strong>第二步（十去减）：</strong> 用 10 减去 {sub}，10 - {sub} = <strong>{tenMinusSub}</strong>
          </div>
          <div className="break-step">
            <strong>第三步（合剩数）：</strong> 剩下的 {tenMinusSub} 加上个位的 {ones}，{tenMinusSub} + {ones} = <strong>{result}</strong>
          </div>
        </div>

        <div className="controls-row-center mt-3">
          <span>调整十几被减数：</span>
          <button className="chip-btn" onClick={() => setMinuend(Math.max(11, minuend - 1))}>-1</button>
          <span className="val-display">{minuend}</span>
          <button className="chip-btn" onClick={() => setMinuend(Math.min(18, minuend + 1))}>+1</button>
          <button className="chip-btn primary ml-3" onClick={() => { sound.playCorrect(); if (onComplete) onComplete(); }}>
            破十秒算成功！
          </button>
        </div>
      </div>
    </div>
  );
}

// 3. 汉语拼音互动拼读台 (Grade 1 Chinese)
function PinyinLab({ unit, onComplete }) {
  const [shengmu, setShengmu] = useState('b');
  const [yunmu, setYunmu] = useState('a');
  const [tone, setTone] = useState(1); // 1, 2, 3, 4

  const tonesMap = {
    a: ['ā', 'á', 'ǎ', 'à'],
    o: ['ō', 'ó', 'ǒ', 'ò'],
    e: ['ē', 'é', 'ě', 'è'],
    i: ['ī', 'í', 'ǐ', 'ì'],
    u: ['ū', 'ú', 'ǔ', 'ù'],
    ü: ['ǖ', 'ǘ', 'ǚ', 'ǜ']
  };

  const currentTonedYunmu = tonesMap[yunmu]?.[tone - 1] || yunmu;
  const pinyinStr = `${shengmu}${currentTonedYunmu}`;

  const speakPinyin = () => {
    sound.playClick();
    speech.speak(pinyinStr);
  };

  return (
    <div className="lab-container">
      <div className="lab-mission-banner">
        <Sparkles size={20} className="text-amber" />
        <span>具象工坊 · 声韵相撞与四声调拼读台</span>
      </div>

      <div className="pinyin-lab-body">
        <div className="pinyin-display-card">
          <span className="pinyin-big-text">{pinyinStr}</span>
          <button className="audio-speak-btn mt-2" onClick={speakPinyin}>
            <Volume2 size={16} /> 听拼音发音
          </button>
        </div>

        <div className="pinyin-controllers">
          <div className="ctrl-row">
            <span className="label">声母选择：</span>
            {['b', 'p', 'm', 'f', 'd', 't', 'n', 'l', 'g', 'k'].map(s => (
              <button
                key={s}
                className={`chip-btn ${shengmu === s ? 'active' : ''}`}
                onClick={() => { sound.playClick(); setShengmu(s); }}
              >
                {s}
              </button>
            ))}
          </div>

          <div className="ctrl-row">
            <span className="label">单韵母：</span>
            {['a', 'o', 'e', 'i', 'u', 'ü'].map(y => (
              <button
                key={y}
                className={`chip-btn ${yunmu === y ? 'active' : ''}`}
                onClick={() => { sound.playClick(); setYunmu(y); }}
              >
                {y}
              </button>
            ))}
          </div>

          <div className="ctrl-row">
            <span className="label">四声调号：</span>
            {[1, 2, 3, 4].map(t => (
              <button
                key={t}
                className={`chip-btn ${tone === t ? 'active' : ''}`}
                onClick={() => { sound.playClick(); setTone(t); }}
              >
                第{t}声 ({['一声平 ˉ', '二声扬 ˊ', '三声拐弯 ˇ', '四声降 ˋ'][t - 1]})
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// 4. 汉字魔法拆字工坊 (Chinese)
function HanziLab({ unit, onComplete }) {
  const [selectedPartA, setSelectedPartA] = useState('氵');
  const [selectedPartB, setSelectedPartB] = useState('工');

  const combinations = {
    '氵_工': { char: '江', pinyin: 'jiāng', meaning: '江河，长江，与水有关' },
    '氵_可': { char: '河', pinyin: 'hé', meaning: '河流，黄河，三点水表意' },
    '木_对': { char: '树', pinyin: 'shù', meaning: '大树，木字旁与树木有关' },
    '艹_化': { char: '花', pinyin: 'huā', meaning: '花朵，草字头表示花草植物' },
    '扌_丁': { char: '打', pinyin: 'dǎ', meaning: '打球、拍打，提手旁表手的动作' }
  };

  const key = `${selectedPartA}_${selectedPartB}`;
  const matched = combinations[key] || { char: '？', pinyin: '', meaning: '尝试拼合其他部件看看吧！' };

  return (
    <div className="lab-container">
      <div className="lab-mission-banner">
        <Sparkles size={20} className="text-amber" />
        <span>具象工坊 · 形声字偏旁部件拼合实验室</span>
      </div>

      <div className="hanzi-lab-body">
        <div className="hanzi-result-box">
          <div className="hanzi-magic-char">{matched.char}</div>
          <div className="hanzi-pinyin">{matched.pinyin}</div>
          <div className="hanzi-meaning">{matched.meaning}</div>
        </div>

        <div className="hanzi-selectors">
          <div className="part-col">
            <h4>左边形旁（表意）：</h4>
            {['氵(水)', '木(树)', '艹(草)', '扌(手)'].map(p => {
              const symbol = p.charAt(0);
              return (
                <button
                  key={p}
                  className={`chip-btn ${selectedPartA === symbol ? 'active' : ''}`}
                  onClick={() => { sound.playClick(); setSelectedPartA(symbol); }}
                >
                  {p}
                </button>
              );
            })}
          </div>

          <div className="part-col">
            <h4>右边声旁（表音/形）：</h4>
            {['工', '可', '对', '化', '丁'].map(p => (
              <button
                key={p}
                className={`chip-btn ${selectedPartB === p ? 'active' : ''}`}
                onClick={() => { sound.playClick(); setSelectedPartB(p); }}
              >
                {p}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// 5. 人民币元角分认领与找零工坊 (Math)
function MoneyExchangeLab({ unit, onComplete }) {
  const [payYuan, setPayYuan] = useState(10);
  const itemPrice = 6;
  const change = Math.max(0, payYuan - itemPrice);

  return (
    <div className="lab-container">
      <div className="lab-mission-banner">
        <Sparkles size={20} className="text-amber" />
        <span>具象工坊 · 文具小超市人民币找零计算</span>
      </div>

      <div className="money-lab-stage">
        <div className="supermarket-item">
          <span className="item-icon">📘</span>
          <div className="item-info">
            <strong>《小学生趣味数学》</strong>
            <span>售价：<strong>{itemPrice} 元</strong></span>
          </div>
        </div>

        <div className="money-exchange-card">
          <div className="cash-row">
            <span>放入钱币：</span>
            {[10, 20, 50, 100].map(val => (
              <button
                key={val}
                className={`chip-btn ${payYuan === val ? 'active' : ''}`}
                onClick={() => { sound.playClick(); setPayYuan(val); }}
              >
                ￥{val} 元纸币
              </button>
            ))}
          </div>

          <div className="calc-result-box mt-3">
            <p>支付：{payYuan} 元 - 售价：{itemPrice} 元 = 应找回：<span className="highlight-val text-amber">{change} 元</span></p>
            <div className="change-bills-showcase">
              {change >= 50 && <span className="bill-tag">1张50元</span>}
              {Math.floor((change % 50) / 20) > 0 && <span className="bill-tag">{Math.floor((change % 50) / 20)}张20元</span>}
              {Math.floor((change % 20) / 10) > 0 && <span className="bill-tag">{Math.floor((change % 20) / 10)}张10元</span>}
              {change % 10 > 0 && <span className="bill-tag">{change % 10}个1元硬币</span>}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// 6. 九九乘法口诀点阵工坊 (Math Grade 2)
function MultiTableLab({ unit, onComplete }) {
  const [row, setRow] = useState(6);
  const [col, setCol] = useState(7);

  const product = row * col;

  return (
    <div className="lab-container">
      <div className="lab-mission-banner">
        <Sparkles size={20} className="text-amber" />
        <span>具象工坊 · 九九乘法点阵消消乐：{row} × {col}</span>
      </div>

      <div className="multi-table-body">
        <div className="dot-matrix-canvas" style={{ display: 'grid', gridTemplateColumns: `repeat(${col}, 22px)` }}>
          {Array.from({ length: row * col }).map((_, i) => (
            <div key={i} className="matrix-dot" title={`点数 ${i + 1}`}>●</div>
          ))}
        </div>

        <div className="table-controls">
          <div className="control-slider">
            <label>行数（每份数量）：{row}</label>
            <div className="btn-row">
              {[2, 3, 4, 5, 6, 7, 8, 9].map(n => (
                <button key={n} className={`chip-btn ${row === n ? 'active' : ''}`} onClick={() => setRow(n)}>{n}</button>
              ))}
            </div>
          </div>

          <div className="control-slider mt-2">
            <label>列数（份数）：{col}</label>
            <div className="btn-row">
              {[2, 3, 4, 5, 6, 7, 8, 9].map(n => (
                <button key={n} className={`chip-btn ${col === n ? 'active' : ''}`} onClick={() => setCol(n)}>{n}</button>
              ))}
            </div>
          </div>

          <div className="product-card mt-3">
            <strong>算式：{row} × {col} = <span className="highlight-val">{product}</span></strong>
          </div>
        </div>
      </div>
    </div>
  );
}

// 7. 神奇磁铁两极实验台 (Science Grade 2)
function MagnetLab({ unit, onComplete }) {
  const [leftPole, setLeftPole] = useState('N'); // 'N' or 'S'
  const [rightPole, setRightPole] = useState('S'); // 'N' or 'S'

  const isAttract = leftPole !== rightPole; // 异极相吸，同极相斥

  const toggleLeft = () => {
    sound.playClick();
    setLeftPole(prev => (prev === 'N' ? 'S' : 'N'));
  };

  const toggleRight = () => {
    sound.playClick();
    setRightPole(prev => (prev === 'N' ? 'S' : 'N'));
  };

  return (
    <div className="lab-container">
      <div className="lab-mission-banner">
        <Sparkles size={20} className="text-amber" />
        <span>具象工坊 · 磁铁磁极相互作用：同名相斥，异名相吸！</span>
      </div>

      <div className="magnet-stage">
        <div className={`magnet-visual-pair ${isAttract ? 'attracting' : 'repelling'}`}>
          {/* 左侧条形磁铁 */}
          <div className="bar-magnet" onClick={toggleLeft} title="点击翻转磁极">
            <span className={`pole ${leftPole === 'N' ? 'pole-n' : 'pole-s'}`}>{leftPole}</span>
            <span className={`pole ${leftPole === 'N' ? 'pole-s' : 'pole-n'}`}>{leftPole === 'N' ? 'S' : 'N'}</span>
          </div>

          {/* 磁力线指示 */}
          <div className="magnetic-force-indicator">
            {isAttract ? (
              <div className="force-badge attract">🧲 异极相吸 ➔ 牢牢抱紧！</div>
            ) : (
              <div className="force-badge repel">⚡ 同极相斥 🡸 产生斥力推开！</div>
            )}
          </div>

          {/* 右侧条形磁铁 */}
          <div className="bar-magnet" onClick={toggleRight} title="点击翻转磁极">
            <span className={`pole ${rightPole === 'N' ? 'pole-n' : 'pole-s'}`}>{rightPole}</span>
            <span className={`pole ${rightPole === 'N' ? 'pole-s' : 'pole-n'}`}>{rightPole === 'N' ? 'S' : 'N'}</span>
          </div>
        </div>

        <p className="magnet-hint mt-3">💡 提示：点击任意磁铁即可调转方向，验证“南极(S)与北极(N)”的相吸与相斥！</p>
      </div>
    </div>
  );
}

// 8. 角的初步认识工坊 (Math Grade 2)
function AngleLab({ unit, onComplete }) {
  const [angleDeg, setAngleDeg] = useState(90);

  const getAngleType = (deg) => {
    if (deg < 90) return '锐角 (比直角小)';
    if (deg === 90) return '直角 (标准的直直角 90°)';
    return '钝角 (比直角大)';
  };

  return (
    <div className="lab-container">
      <div className="lab-mission-banner">
        <Sparkles size={20} className="text-amber" />
        <span>具象工坊 · 动态张合两臂量角器</span>
      </div>

      <div className="angle-stage">
        <svg viewBox="0 0 240 180" width="220" height="160" className="angle-svg">
          {/* 顶点 */}
          <circle cx="120" cy="140" r="6" fill="#F59E0B" />
          {/* 固定底边 */}
          <line x1="120" y1="140" x2="210" y2="140" stroke="#3B82F6" strokeWidth="4" strokeLinecap="round" />
          {/* 活动旋转边 */}
          <line
            x1="120"
            y1="140"
            x2={120 + 90 * Math.cos(((180 - angleDeg) * Math.PI) / 180)}
            y2={140 - 90 * Math.sin(((180 - angleDeg) * Math.PI) / 180)}
            stroke="#EF4444"
            strokeWidth="4"
            strokeLinecap="round"
          />
        </svg>

        <div className="angle-ctrl">
          <div className="angle-readout">
            当前角度：<strong>{angleDeg}°</strong> — <span className="text-indigo">{getAngleType(angleDeg)}</span>
          </div>
          <input
            type="range"
            min="30"
            max="150"
            value={angleDeg}
            onChange={(e) => setAngleDeg(parseInt(e.target.value, 10))}
            className="time-range-slider"
          />
          <div className="btn-row mt-2">
            <button className="chip-btn" onClick={() => setAngleDeg(45)}>45° 锐角</button>
            <button className="chip-btn primary" onClick={() => setAngleDeg(90)}>90° 直角</button>
            <button className="chip-btn" onClick={() => setAngleDeg(135)}>135° 钝角</button>
          </div>
        </div>
      </div>
    </div>
  );
}

// 9. 平移与旋转操纵工坊 (Math Grade 2)
function TransformLab({ unit, onComplete }) {
  const [transX, setTransX] = useState(0);
  const [rotateDeg, setRotateDeg] = useState(0);

  return (
    <div className="lab-container">
      <div className="lab-mission-banner">
        <Sparkles size={20} className="text-amber" />
        <span>具象工坊 · 图形平移与风车旋转操控板</span>
      </div>

      <div className="transform-stage">
        <div className="transform-viewbox">
          <div
            className="windmill-object"
            style={{
              transform: `translateX(${transX}px) rotate(${rotateDeg}deg)`,
              transition: 'transform 0.2s ease'
            }}
          >
            🎡
          </div>
        </div>

        <div className="transform-buttons-row">
          <div className="ctrl-box">
            <label>平移（方向不变，直线移动）：</label>
            <div className="btn-row">
              <button className="chip-btn" onClick={() => setTransX(prev => Math.max(-80, prev - 20))}>向左平移 ⇦</button>
              <button className="chip-btn" onClick={() => setTransX(0)}>回中位</button>
              <button className="chip-btn" onClick={() => setTransX(prev => Math.min(80, prev + 20))}>向右平移 ⇨</button>
            </div>
          </div>

          <div className="ctrl-box mt-2">
            <label>旋转（绕中心打转）：</label>
            <div className="btn-row">
              <button className="chip-btn" onClick={() => setRotateDeg(prev => prev - 45)}>逆时针旋转 45°</button>
              <button className="chip-btn" onClick={() => setRotateDeg(prev => prev + 45)}>顺时针旋转 45°</button>
              <button className="chip-btn" onClick={() => setRotateDeg(prev => prev + 360)}>旋转一整圈 360°</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// 10. 水的三态与温度计工坊 (Science Grade 3)
function ThermalLab({ unit, onComplete }) {
  const [temp, setTemp] = useState(25);

  const getState = (t) => {
    if (t <= 0) return { state: '固态（冰）', icon: '🧊', note: '0℃及以下开始凝固结冰' };
    if (t >= 100) return { state: '气态（水蒸气）', icon: '💨', note: '100℃水剧烈沸腾汽化' };
    return { state: '液态（水）', icon: '💧', note: '常温常态下的液态水' };
  };

  const current = getState(temp);

  return (
    <div className="lab-container">
      <div className="lab-mission-banner">
        <Sparkles size={20} className="text-amber" />
        <span>具象工坊 · 水的三态与水温计模拟器</span>
      </div>

      <div className="thermal-stage">
        <div className="state-visual-card">
          <span className="state-icon">{current.icon}</span>
          <h4>当前水的状态：<strong>{current.state}</strong></h4>
          <p>{current.note}</p>
        </div>

        <div className="thermometer-ctrl">
          <label>调节水温计水银刻度：<strong>{temp} ℃</strong></label>
          <input
            type="range"
            min="-10"
            max="110"
            value={temp}
            onChange={(e) => setTemp(parseInt(e.target.value, 10))}
            className="time-range-slider"
          />
          <div className="btn-row mt-2">
            <button className="chip-btn" onClick={() => setTemp(-5)}>零下 -5℃ (冰)</button>
            <button className="chip-btn" onClick={() => setTemp(25)}>常温 25℃ (水)</button>
            <button className="chip-btn" onClick={() => setTemp(100)}>沸腾 100℃ (水蒸气)</button>
          </div>
        </div>
      </div>
    </div>
  );
}

// 11. 植物叶片与器官工坊 (Science Grade 1)
function PlantLab({ unit, onComplete }) {
  return (
    <div className="lab-container">
      <div className="lab-mission-banner">
        <Sparkles size={20} className="text-amber" />
        <span>具象工坊 · 植物六大器官与叶脉微观观察</span>
      </div>
      <div className="plant-parts-grid">
        <div className="part-card">🌺 <strong>花朵：</strong> 吸引昆虫传粉，繁衍后代</div>
        <div className="part-card">🍃 <strong>叶片：</strong> 吸收阳光进行光合作用制造养料</div>
        <div className="part-card">🎋 <strong>茎：</strong> 支撑整个身体，向上输送水分养料</div>
        <div className="part-card">🌱 <strong>根：</strong> 牢牢固定在土壤中，吸收水和无机盐</div>
      </div>
    </div>
  );
}

// 12. 英语原声单词连读工坊 (English)
function EnglishPhonicsLab({ unit, onComplete }) {
  const speakWord = (w) => {
    sound.playClick();
    speech.speak(w);
  };

  const words = ['apple', 'panda', 'yellow', 'eye', 'nose', 'elephant', 'tiger', 'monkey'];

  return (
    <div className="lab-container">
      <div className="lab-mission-banner">
        <Sparkles size={20} className="text-amber" />
        <span>具象工坊 · English Native Phonics & Word Sound Station</span>
      </div>

      <div className="english-words-grid">
        {words.map(w => (
          <div key={w} className="english-word-card" onClick={() => speakWord(w)}>
            <span className="word-text">{w}</span>
            <span className="speak-tag"><Volume2 size={14} className="inline mr-1" />Listen</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// 13. 经典诗歌与文学工坊 (Chinese)
function PoetryLiteratureLab({ unit, onComplete }) {
  return (
    <div className="lab-container">
      <div className="lab-mission-banner">
        <Sparkles size={20} className="text-amber" />
        <span>具象工坊 · 诗词名句情境还原与意象赏析</span>
      </div>
      <div className="poetry-scene-card">
        <h3>📖 {unit.name}</h3>
        <p className="mt-2">{unit.knowledge?.concept}</p>
        <div className="formula-box mt-3">
          <strong>🌟 名句鉴赏：</strong>
          <div className="text-indigo mt-1">{unit.knowledge?.formula}</div>
        </div>
      </div>
    </div>
  );
}

// 14. 阿基米德天平解方程工坊 (Math Grade 5)
function EquationBalanceLab({ unit, onComplete }) {
  const [step, setStep] = useState(0); // 0: 2x + 6 = 16; 1: 2x = 10; 2: x = 5

  const reset = () => {
    sound.playClick();
    setStep(0);
  };

  return (
    <div className="lab-container">
      <div className="lab-mission-banner">
        <Sparkles size={20} className="text-amber" />
        <span>具象工坊 · 阿基米德天平解方程：两边同加减、同除乘</span>
      </div>

      <div className="balance-lab-stage">
        <div className="equation-math-header">
          {step === 0 && <span className="eq-text">初始方程：<strong>2x + 6 = 16</strong></span>}
          {step === 1 && <span className="eq-text">第二步（两边同减6）：<strong>2x = 10</strong></span>}
          {step === 2 && <span className="eq-text success">第三步（两边同除以2）：<strong>x = 5（解出未知数！）</strong></span>}
        </div>

        {/* 天平可视化 */}
        <div className="balance-scale-wrapper">
          <div className="scale-beam">
            <div className="scale-pan pan-left">
              <div className="pan-content">
                {step === 0 && (
                  <>
                    <span className="weight-block block-x">x</span>
                    <span className="weight-block block-x">x</span>
                    <span className="weight-block block-num">+6g</span>
                  </>
                )}
                {step === 1 && (
                  <>
                    <span className="weight-block block-x">x</span>
                    <span className="weight-block block-x">x</span>
                  </>
                )}
                {step === 2 && <span className="weight-block block-x">x</span>}
              </div>
              <div className="pan-plate">左盘</div>
            </div>

            <div className="scale-pivot">▲</div>

            <div className="scale-pan pan-right">
              <div className="pan-content">
                {step === 0 && <span className="weight-block block-weight">16g 砝码</span>}
                {step === 1 && <span className="weight-block block-weight">10g 砝码</span>}
                {step === 2 && <span className="weight-block block-weight">5g 砝码</span>}
              </div>
              <div className="pan-plate">右盘</div>
            </div>
          </div>
        </div>

        <div className="balance-ctrl-row mt-3">
          {step === 0 && (
            <button className="chip-btn primary" onClick={() => { sound.playClick(); setStep(1); }}>
              ① 天平两边同时拿掉 6g 砝码（两边同减 6）➔
            </button>
          )}
          {step === 1 && (
            <button className="chip-btn primary" onClick={() => { sound.playCorrect(); setStep(2); }}>
              ② 天平两边各留下一半（两边同除以 2）➔
            </button>
          )}
          {step === 2 && (
            <div className="flex gap-2">
              <span className="text-emerald font-bold">🎉 完美配平！解得 x = 5</span>
              <button className="chip-btn" onClick={reset}><RefreshCw size={14} /> 重新操作</button>
              <button className="chip-btn primary ml-2" onClick={() => { sound.playCorrect(); if (onComplete) onComplete(); }}>
                领悟代数方程本质！
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// 15. 祖冲之割圆术与圆面积推导工坊 (Math Grade 6)
function CircleAreaLab({ unit, onComplete }) {
  const [slices, setSlices] = useState(8); // 8, 16, 32

  return (
    <div className="lab-container">
      <div className="lab-mission-banner">
        <Sparkles size={20} className="text-amber" />
        <span>具象工坊 · 极限割圆转化长方形：推导 S = πr²</span>
      </div>

      <div className="circle-cut-stage">
        <div className="cut-visual-container">
          <div className="circle-shape-preview">
            <div className="circle-ring" style={{ '--slices': slices }}>
              <span className="center-dot"></span>
              <span className="radius-line">r</span>
            </div>
            <span className="cut-caption">半径为 r 的圆</span>
          </div>

          <div className="transform-arrow">
            ➔ 展开等分拼接 ➔
          </div>

          <div className="sliced-rect-preview">
            <div className="rect-teeth-container">
              {Array.from({ length: slices }).map((_, i) => (
                <div key={i} className={`teeth-pie ${i % 2 === 0 ? 'top' : 'bottom'}`} />
              ))}
            </div>
            <div className="rect-dims">
              <span className="dim-length">长 ≈ πr (圆周长的一半 C/2)</span>
              <span className="dim-width">宽 ≈ r</span>
            </div>
            <div className="formula-tag">面积 S = 长 × 宽 = πr × r = <strong>πr²</strong></div>
          </div>
        </div>

        <div className="controls-row-center mt-3">
          <span>选择割圆细分数（份数越多越接近完美长方形）：</span>
          {[8, 16, 32].map(n => (
            <button
              key={n}
              className={`chip-btn ${slices === n ? 'active' : ''}`}
              onClick={() => { sound.playClick(); setSlices(n); }}
            >
              割成 {n} 等份
            </button>
          ))}
          <button className="chip-btn primary ml-3" onClick={() => { sound.playCorrect(); if (onComplete) onComplete(); }}>
            融通圆面积化归！
          </button>
        </div>
      </div>
    </div>
  );
}

// 16. 闭合电路与小灯泡发光实验室 (Science Grade 4)
function CircuitLab({ unit, onComplete }) {
  const [isClosed, setIsClosed] = useState(false);

  const toggleSwitch = () => {
    if (!isClosed) {
      sound.playLevelUp();
    } else {
      sound.playClick();
    }
    setIsClosed(!isClosed);
  };

  return (
    <div className="lab-container">
      <div className="lab-mission-banner">
        <Sparkles size={20} className="text-amber" />
        <span>具象工坊 · 简易闭合回路：开关合上电流通，小灯泡亮起来！</span>
      </div>

      <div className="circuit-lab-stage">
        <div className={`circuit-board ${isClosed ? 'circuit-active' : 'circuit-open'}`}>
          {/* 电池 */}
          <div className="battery-component">
            <span className="component-title">🔋 1.5V 干电池</span>
            <div className="battery-poles">
              <span className="pos-pole">+ 正极</span>
              <span className="neg-pole">- 负极</span>
            </div>
          </div>

          {/* 导线回路 */}
          <div className="wires-flow">
            <div className={`wire-line wire-top ${isClosed ? 'flowing' : ''}`}></div>
            <div className={`wire-line wire-bottom ${isClosed ? 'flowing' : ''}`}></div>
          </div>

          {/* 开关控制 */}
          <div className="switch-component" onClick={toggleSwitch} title="点击闭合/断开开关">
            <span className="component-title">🕹️ 刀闸开关</span>
            <div className={`switch-lever ${isClosed ? 'lever-closed' : 'lever-open'}`}></div>
            <span className="switch-status">{isClosed ? '【已闭合回路】' : '【断开断路】'}</span>
          </div>

          {/* 小灯泡 */}
          <div className={`lamp-component ${isClosed ? 'lamp-lit' : 'lamp-dark'}`}>
            <div className="lamp-bulb">
              <span className="bulb-emoji">{isClosed ? '💡' : '💡'}</span>
              {isClosed && <div className="glow-halo"></div>}
            </div>
            <span className="component-title">{isClosed ? '✨ 灯丝发光发热！' : '💤 灯泡未通电'}</span>
          </div>
        </div>

        <div className="controls-row-center mt-3">
          <button className={`chip-btn ${isClosed ? 'active' : ''}`} onClick={toggleSwitch}>
            {isClosed ? '点击断开开关（断路）' : '点击闭合开关（通电）'}
          </button>
          <button className="chip-btn primary ml-3" onClick={() => { sound.playCorrect(); if (onComplete) onComplete(); }}>
            完成电路通断实验！
          </button>
        </div>
      </div>
    </div>
  );
}

// 17. 生态系统与食物网工坊 (Science Grade 5)
function FoodChainLab({ unit, onComplete }) {
  const [activeStep, setActiveStep] = useState(1);

  const chain = [
    { role: '🌱 绿色水草 (生产者)', desc: '吸收阳光与二氧化碳进行光合作用制造能量', level: 1 },
    { role: '🦐 小虾米 (初级消费者)', desc: '以浮游水草为食摄取植物能量', level: 2 },
    { role: '🐟 小鲫鱼 (次级消费者)', desc: '捕食小虾米，能量逐级向上传递', level: 3 },
    { role: '🦅 捕鱼苍鹰 (顶级消费者)', desc: '湖泊生态系统顶级霸主', level: 4 }
  ];

  return (
    <div className="lab-container">
      <div className="lab-mission-banner">
        <Sparkles size={20} className="text-amber" />
        <span>具象工坊 · 食物链与能量金字塔传递流动</span>
      </div>

      <div className="food-chain-stage">
        <div className="chain-nodes-flow">
          {chain.map((item, idx) => (
            <React.Fragment key={idx}>
              <div
                className={`chain-node-card ${activeStep >= item.level ? 'node-active' : 'node-dim'}`}
                onClick={() => { sound.playClick(); setActiveStep(item.level); }}
              >
                <h4>{item.role}</h4>
                <p>{item.desc}</p>
              </div>
              {idx < chain.length - 1 && (
                <div className={`chain-arrow ${activeStep > idx + 1 ? 'arrow-lit' : ''}`}>➔ 被吃 ➔</div>
              )}
            </React.Fragment>
          ))}
        </div>

        <div className="controls-row-center mt-3">
          <button className="chip-btn" onClick={() => setActiveStep(prev => Math.min(4, prev + 1))}>
            下一步：能量向上传递 ➔
          </button>
          <button className="chip-btn" onClick={() => setActiveStep(1)}>重置起点</button>
          <button className="chip-btn primary ml-3" onClick={() => { sound.playCorrect(); if (onComplete) onComplete(); }}>
            领会生态平衡！
          </button>
        </div>
      </div>
    </div>
  );
}

// 18. 小数点移动与数位变幻工坊 (Math Grade 4)
function DecimalShiftLab({ unit, onComplete }) {
  const [val, setVal] = useState(3.14);

  const shiftLeft = () => {
    sound.playClick();
    setVal(prev => parseFloat((prev / 10).toFixed(4)));
  };

  const shiftRight = () => {
    sound.playClick();
    setVal(prev => parseFloat((prev * 10).toFixed(2)));
  };

  return (
    <div className="lab-container">
      <div className="lab-mission-banner">
        <Sparkles size={20} className="text-amber" />
        <span>具象工坊 · 小数点跳跃魔法：右移一位扩大10倍，左移一位缩小到1/10</span>
      </div>

      <div className="decimal-shift-stage">
        <div className="decimal-large-card">
          <span className="decimal-val-display">{val}</span>
        </div>

        <div className="controls-row-center mt-3">
          <button className="chip-btn" onClick={shiftLeft}>⇦ 小数点左移一位（缩小10倍 ÷10）</button>
          <button className="chip-btn" onClick={() => setVal(3.14)}>复位 3.14</button>
          <button className="chip-btn" onClick={shiftRight}>小数点右移一位（扩大10倍 ×10）⇨</button>
          <button className="chip-btn primary ml-3" onClick={() => { sound.playCorrect(); if (onComplete) onComplete(); }}>
            掌握小数点移动律！
          </button>
        </div>
      </div>
    </div>
  );
}

// 通用备用探索
function GenericExploreLab({ unit, onComplete }) {
  return (
    <div className="lab-container">
      <div className="lab-mission-banner">
        <Sparkles size={20} className="text-amber" />
        <span>具象工坊 · {unit?.name} 概念探究实验室</span>
      </div>
      <div className="concept-explore-box">
        <p>{unit?.knowledge?.concept}</p>
        <div className="formula-highlight mt-2">{unit?.knowledge?.formula}</div>
        <button className="chip-btn primary mt-3" onClick={() => { sound.playCorrect(); if (onComplete) onComplete(); }}>
          已完成动手探索
        </button>
      </div>
    </div>
  );
}

