import React, { useState } from 'react';
import { sound } from '../../utils/audio';
import { Compass, Navigation, MapPin, Sparkles, CheckCircle2 } from 'lucide-react';

const DIRECTIONS = [
  { id: 'N', name: '正北', angle: 0, x: 0, y: -1 },
  { id: 'NE', name: '东北', angle: 45, x: 1, y: -1 },
  { id: 'E', name: '正东', angle: 90, x: 1, y: 0 },
  { id: 'SE', name: '东南', angle: 135, x: 1, y: 1 },
  { id: 'S', name: '正南', angle: 180, x: 0, y: 1 },
  { id: 'SW', name: '西南', angle: 225, x: -1, y: 1 },
  { id: 'W', name: '正西', angle: 270, x: -1, y: 0 },
  { id: 'NW', name: '西北', angle: 315, x: -1, y: -1 }
];

const LANDMARKS = {
  center: { name: '阳光小学', icon: '🏫', desc: '中心基准点' },
  N: { name: '人民公园', icon: '🌳', dir: '正北' },
  NE: { name: '市科技馆', icon: '🚀', dir: '东北' },
  E: { name: '新华书店', icon: '📚', dir: '正东' },
  SE: { name: '游乐乐园', icon: '🎡', dir: '东南' },
  S: { name: '奥体中心', icon: '⚽', dir: '正南' },
  SW: { name: '植物博览园', icon: '🌺', dir: '西南' },
  W: { name: '中心医院', icon: '🏥', dir: '正西' },
  NW: { name: '高铁车站', icon: '🚄', dir: '西北' }
};

export default function CompassLab({ onComplete }) {
  const [selectedDir, setSelectedDir] = useState('N');
  const [visitedCount, setVisitedCount] = useState(new Set(['N']));

  const handleSelect = (dirId) => {
    sound.playClick();
    setSelectedDir(dirId);
    const next = new Set(visitedCount);
    next.add(dirId);
    setVisitedCount(next);

    if (next.size >= 4 && onComplete) {
      onComplete();
    }
  };

  const currentLandmark = LANDMARKS[selectedDir];
  const currentDirObj = DIRECTIONS.find(d => d.id === selectedDir) || DIRECTIONS[0];

  return (
    <div className="lab-container">
      <div className="lab-header">
        <div className="lab-badge">
          <Compass size={18} />
          <span>具象工坊 · 八方向罗盘与小镇探险地图</span>
        </div>
        <div className="visit-badge">已探访 {visitedCount.size} / 8 个方位</div>
      </div>

      <div className="lab-mission-banner">
        <Sparkles size={20} className="text-amber" />
        <span className="mission-text">
          地图绘制标准：<strong>【上北下南，左西右东】</strong>。点击指南针上的八个方位按钮，指引小探险家拜访小镇各个地标！
        </span>
      </div>

      <div className="compass-lab-body">
        {/* 动态指南针与小镇地图 */}
        <div className="town-map-grid">
          {/* NW */}
          <div className={`map-cell ${selectedDir === 'NW' ? 'active' : ''}`} onClick={() => handleSelect('NW')}>
            <span className="cell-icon">{LANDMARKS.NW.icon}</span>
            <span className="cell-name">{LANDMARKS.NW.name}</span>
            <span className="cell-dir">（西北）</span>
          </div>

          {/* N */}
          <div className={`map-cell ${selectedDir === 'N' ? 'active' : ''}`} onClick={() => handleSelect('N')}>
            <span className="cell-icon">{LANDMARKS.N.icon}</span>
            <span className="cell-name">{LANDMARKS.N.name}</span>
            <span className="cell-dir">（正北）</span>
          </div>

          {/* NE */}
          <div className={`map-cell ${selectedDir === 'NE' ? 'active' : ''}`} onClick={() => handleSelect('NE')}>
            <span className="cell-icon">{LANDMARKS.NE.icon}</span>
            <span className="cell-name">{LANDMARKS.NE.name}</span>
            <span className="cell-dir">（东北）</span>
          </div>

          {/* W */}
          <div className={`map-cell ${selectedDir === 'W' ? 'active' : ''}`} onClick={() => handleSelect('W')}>
            <span className="cell-icon">{LANDMARKS.W.icon}</span>
            <span className="cell-name">{LANDMARKS.W.name}</span>
            <span className="cell-dir">（正西）</span>
          </div>

          {/* CENTER */}
          <div className="map-cell center-school">
            <span className="cell-icon">{LANDMARKS.center.icon}</span>
            <span className="cell-name">{LANDMARKS.center.name}</span>
            <span className="cell-dir">【中心观察站】</span>
          </div>

          {/* E */}
          <div className={`map-cell ${selectedDir === 'E' ? 'active' : ''}`} onClick={() => handleSelect('E')}>
            <span className="cell-icon">{LANDMARKS.E.icon}</span>
            <span className="cell-name">{LANDMARKS.E.name}</span>
            <span className="cell-dir">（正东）</span>
          </div>

          {/* SW */}
          <div className={`map-cell ${selectedDir === 'SW' ? 'active' : ''}`} onClick={() => handleSelect('SW')}>
            <span className="cell-icon">{LANDMARKS.SW.icon}</span>
            <span className="cell-name">{LANDMARKS.SW.name}</span>
            <span className="cell-dir">（西南）</span>
          </div>

          {/* S */}
          <div className={`map-cell ${selectedDir === 'S' ? 'active' : ''}`} onClick={() => handleSelect('S')}>
            <span className="cell-icon">{LANDMARKS.S.icon}</span>
            <span className="cell-name">{LANDMARKS.S.name}</span>
            <span className="cell-dir">（正南）</span>
          </div>

          {/* SE */}
          <div className={`map-cell ${selectedDir === 'SE' ? 'active' : ''}`} onClick={() => handleSelect('SE')}>
            <span className="cell-icon">{LANDMARKS.SE.icon}</span>
            <span className="cell-name">{LANDMARKS.SE.name}</span>
            <span className="cell-dir">（东南）</span>
          </div>
        </div>

        {/* 动态指南针圆盘与方位报告 */}
        <div className="compass-control-panel">
          <div className="compass-rose-wrapper">
            <div className="compass-dial" style={{ transform: `rotate(${currentDirObj.angle}deg)` }}>
              <div className="needle-north">北</div>
              <div className="needle-south">南</div>
              <div className="needle-center"></div>
            </div>
            <div className="direction-buttons-circle">
              {DIRECTIONS.map(dir => (
                <button
                  key={dir.id}
                  className={`dir-btn dir-${dir.id.toLowerCase()} ${selectedDir === dir.id ? 'active' : ''}`}
                  onClick={() => handleSelect(dir.id)}
                >
                  {dir.name}
                </button>
              ))}
            </div>
          </div>

          <div className="direction-report-card">
            <div className="report-title">
              <Navigation size={18} className="text-indigo" />
              <span>方位定位报告</span>
            </div>
            <p className="report-body">
              以 <strong>阳光小学</strong> 为中心观察点：<br />
              朝 <strong>【{currentDirObj.name}】</strong> 方向出发，会到达：
            </p>
            <div className="target-landmark-preview">
              <span className="preview-icon">{currentLandmark.icon}</span>
              <span className="preview-name">{currentLandmark.name}</span>
            </div>
            <p className="relative-hint">
              💡 <strong>相对性思考：</strong> 反过来，阳光小学在 {currentLandmark.name} 的 <strong>【{getOppositeDir(currentDirObj.name)}】</strong> 方向！
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function getOppositeDir(name) {
  const map = {
    '正北': '正南',
    '正南': '正北',
    '正东': '正西',
    '正西': '正东',
    '东北': '西南',
    '西南': '东北',
    '东南': '西北',
    '西北': '东南'
  };
  return map[name] || '';
}
