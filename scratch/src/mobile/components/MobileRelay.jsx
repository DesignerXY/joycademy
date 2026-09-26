import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { sound } from '../../utils/audio';
import { Flame, Trophy, RotateCcw, ArrowRight } from 'lucide-react';
import StickmanRelayModal from '../../components/StickmanRelayModal';

export default function MobileRelay({ currentGrade = 3, currentSubject = 'math' }) {
  const [showFullModal, setShowFullModal] = useState(false);

  return (
    <div className="m-subview-wrapper">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
        <h3 style={{ fontSize: '1.05rem', fontWeight: 900, color: '#1E293B', display: 'flex', alignItems: 'center', gap: 6 }}>
          <Flame size={20} className="text-amber-500" />
          <span>火柴人荣耀火炬接力</span>
        </h3>
      </div>

      <div style={{ background: '#FFFBEB', border: '1px solid #FDE68A', padding: 12, borderRadius: 10, marginBottom: 16 }}>
        <p style={{ fontSize: '0.82rem', color: '#92400E', fontWeight: 700, lineHeight: 1.5 }}>
          由纯正木质火柴拼成的智慧小勇士，在星空赛道上跨越学科与年级，传递真理圣火！
        </p>
      </div>

      <div style={{ textAlign: 'center', padding: '24px 16px', background: '#F8FAFC', borderRadius: 12, border: '1px solid #E2E8F0' }}>
        <div style={{ fontSize: '3.5rem', marginBottom: 10, animation: 'mFloat 2s ease-in-out infinite' }}>
          🔥🏃‍♂️💨
        </div>
        <h4 style={{ fontSize: '1.1rem', fontWeight: 900, color: '#1E293B', marginBottom: 6 }}>
          火炬接力仪式准备就绪
        </h4>
        <p style={{ fontSize: '0.8rem', color: '#64748B', marginBottom: 16 }}>
          点击下方按钮进入全景赛场，观摩第一棒与第二棒火柴人的交接与圣火点燃！
        </p>

        <button
          className="m-enter-btn m-pressable"
          style={{ width: '100%', justifyContent: 'center', padding: '12px 0', fontSize: '0.95rem' }}
          onClick={() => {
            sound.playClick();
            setShowFullModal(true);
          }}
        >
          <Flame size={18} />
          <span>观摩火炬交接仪式</span>
        </button>
      </div>

      {showFullModal && (
        <StickmanRelayModal
          currentGrade={currentGrade}
          currentSubject={currentSubject}
          onClose={() => setShowFullModal(false)}
        />
      )}
    </div>
  );
}
