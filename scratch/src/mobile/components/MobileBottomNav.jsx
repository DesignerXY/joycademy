import React from 'react';
import { sound } from '../../utils/audio';
import { Compass, BookOpen, Award, BarChart3, Flame } from 'lucide-react';

export default function MobileBottomNav({ activeTab, onSelectTab, wrongCount = 0 }) {
  const tabs = [
    { id: 'map', label: '地图大厅', icon: Compass },
    { id: 'mistakes', label: '错题本', icon: BookOpen, badge: wrongCount > 0 ? wrongCount : null },
    { id: 'honors', label: '荣誉榜', icon: Award },
    { id: 'report', label: '学情报告', icon: BarChart3 },
    { id: 'relay', label: '火柴人接力', icon: Flame }
  ];

  return (
    <nav className="m-bottom-nav">
      {tabs.map(tab => {
        const IconComponent = tab.icon;
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            id={`m-nav-${tab.id}`}
            data-tab={tab.id}
            className={`m-nav-item m-pressable ${isActive ? 'active' : ''}`}
            onClick={() => {
              sound.playClick();
              onSelectTab(tab.id);
            }}
          >
            <div className="m-nav-icon-wrap">
              <IconComponent size={20} strokeWidth={isActive ? 2.5 : 2} />
              {tab.badge && <span className="m-nav-badge">{tab.badge}</span>}
            </div>
            <span className="m-nav-label">{tab.label}</span>
          </button>
        );
      })}
    </nav>
  );
}
