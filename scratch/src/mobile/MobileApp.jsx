import React, { useState } from 'react';
import './mobile.css';
import { sound } from '../utils/audio';
import { getCurrentProfile, updateCurrentProfile } from '../utils/storage';
import { getCurriculumUnits } from '../data/curriculumData';

import MobileHeader from './components/MobileHeader';
import MobileBottomNav from './components/MobileBottomNav';
import MobileWorldMap from './components/MobileWorldMap';
import MobileLevelModal from './components/MobileLevelModal';
import MobileMistakes from './components/MobileMistakes';
import MobileHonors from './components/MobileHonors';
import MobileReport from './components/MobileReport';
import MobileRelay from './components/MobileRelay';
import MobilePetWidget from './components/MobilePetWidget';

export default function MobileApp({ onSwitchToDesktop }) {
  const [profile, setProfile] = useState(() => getCurrentProfile());
  const [activeTab, setActiveTab] = useState('map'); // 'map' | 'mistakes' | 'honors' | 'report' | 'relay'
  const [selectedUnit, setSelectedUnit] = useState(null);
  const [soundEnabled, setSoundEnabled] = useState(true);

  const refreshProfile = () => {
    setProfile(getCurrentProfile());
  };

  const handleToggleSound = () => {
    const isNowOn = sound.toggleSound();
    setSoundEnabled(isNowOn);
    return isNowOn;
  };

  const handleSelectGrade = (gradeId) => {
    updateCurrentProfile({ grade: gradeId });
    refreshProfile();
  };

  const handleSelectSubject = (subjId) => {
    updateCurrentProfile({ subject: subjId });
    refreshProfile();
  };

  const currentUnits = getCurriculumUnits(profile.subject || 'math', profile.grade || 3);
  const wrongCount = profile.wrongQuestions?.length || 0;

  return (
    <div className="mobile-app-root">
      {/* 移动端顶部轻量状态与学科/年级栏 */}
      <MobileHeader
        profile={profile}
        soundEnabled={soundEnabled}
        onToggleSound={handleToggleSound}
        onSelectGrade={handleSelectGrade}
        onSelectSubject={handleSelectSubject}
        onSwitchToDesktop={onSwitchToDesktop}
      />

      {/* 移动端主内容区域 */}
      <main className="m-content-container">
        {activeTab === 'map' && (
          <MobileWorldMap
            units={currentUnits}
            profile={profile}
            subject={profile.subject || 'math'}
            grade={profile.grade || 3}
            onSelectUnit={(unit) => setSelectedUnit(unit)}
          />
        )}

        {activeTab === 'mistakes' && (
          <MobileMistakes
            profile={profile}
            currentSubject={profile.subject || 'math'}
            currentGrade={profile.grade || 3}
            onProfileUpdated={refreshProfile}
          />
        )}

        {activeTab === 'honors' && (
          <MobileHonors
            profile={profile}
          />
        )}

        {activeTab === 'report' && (
          <MobileReport
            profile={profile}
            currentSubject={profile.subject || 'math'}
            currentGrade={profile.grade || 3}
          />
        )}

        {activeTab === 'relay' && (
          <MobileRelay
            currentGrade={profile.grade || 3}
            currentSubject={profile.subject || 'math'}
          />
        )}
      </main>

      {/* 移动端悬浮伴学小精灵 */}
      <MobilePetWidget profile={profile} onFeedPet={refreshProfile} />

      {/* 移动端全屏闯关模态窗 */}
      {selectedUnit && (
        <MobileLevelModal
          unit={selectedUnit}
          profile={profile}
          subject={profile.subject || 'math'}
          grade={profile.grade || 3}
          onClose={() => setSelectedUnit(null)}
          onProfileUpdated={refreshProfile}
        />
      )}

      {/* 移动端底部原生级导航栏 */}
      <MobileBottomNav
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        wrongCount={wrongCount}
      />
    </div>
  );
}
