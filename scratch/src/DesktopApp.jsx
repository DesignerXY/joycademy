import React, { useState } from 'react';
import { sound } from './utils/audio';
import { getCurrentProfile, updateCurrentProfile } from './utils/storage';
import { getCurriculumUnits, SUBJECTS, GRADES } from './data/curriculumData';

import Header from './components/Header';
import WorldMap from './components/WorldMap';
import LevelModal from './components/LevelModal';
import PetCompanion from './components/PetCompanion';
import MistakeBookModal from './components/MistakeBookModal';
import HonorModal from './components/HonorModal';
import ParentReportModal from './components/ParentReportModal';
import SubjectOverviewModal from './components/SubjectOverviewModal';
import StickmanRelayModal from './components/StickmanRelayModal';

export default function DesktopApp({ onSwitchToMobile }) {
  const [profile, setProfile] = useState(() => getCurrentProfile());
  const [selectedUnit, setSelectedUnit] = useState(null);
  const [soundEnabled, setSoundEnabled] = useState(true);

  // 弹窗状态
  const [showMistakes, setShowMistakes] = useState(false);
  const [showHonors, setShowHonors] = useState(false);
  const [showReport, setShowReport] = useState(false);
  const [showCurriculumOverview, setShowCurriculumOverview] = useState(false);
  const [showStickmanRelay, setShowStickmanRelay] = useState(false);

  // 刷新当前档案
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

  // 核心：动态获取当前选定学科与年级的全部可玩单元
  const currentUnits = getCurriculumUnits(profile.subject || 'math', profile.grade || 3);
  const activeSubjectObj = SUBJECTS.find(s => s.id === (profile.subject || 'math')) || SUBJECTS[0];
  const activeGradeObj = GRADES.find(g => g.id === (profile.grade || 3)) || GRADES[2];

  return (
    <div className="app-layout">
      {/* 顶部综合导航中枢 */}
      <Header
        profile={profile}
        soundEnabled={soundEnabled}
        onToggleSound={handleToggleSound}
        onOpenMistakes={() => setShowMistakes(true)}
        onOpenHonors={() => setShowHonors(true)}
        onOpenReport={() => setShowReport(true)}
        onOpenCurriculumOverview={() => setShowCurriculumOverview(true)}
        onOpenRelay={() => setShowStickmanRelay(true)}
        onSelectGrade={handleSelectGrade}
        onSelectSubject={handleSelectSubject}
        onSwitchToMobile={onSwitchToMobile}
      />

      {/* 主探险大世界视图 */}
      <main className="main-content-container">
        {/* 欢迎英雄横幅 */}
        <div className="hero-banner-card">
          <div className="hero-text-content">
            <span className="welcome-tag">
              ✨ 当前正在探险：{activeGradeObj.name} · {activeSubjectObj.name}（{activeSubjectObj.edition}）
            </span>
            <h2 className="hero-headline">
              欢迎回来，小探险家 <strong>{profile.name}</strong>！
            </h2>
            <p className="hero-description">
              今天我们要挑战哪座神秘知识岛屿呢？一至三年级【语文、数学、英语、科学】课本考点已全部就位！动手做教具实验、闯关血条对决、击败领主Boss，把每一个知识点学扎实！
            </p>
          </div>

          <div className="hero-quick-stats">
            <div className="quick-stat-box">
              <span className="stat-number">{profile.coins}</span>
              <span className="stat-label">💰 智慧金币</span>
            </div>
            <div className="quick-stat-box">
              <span className="stat-number">
                {Object.values(profile.unitProgress || {}).reduce((s, c) => s + (c?.stars || 0), 0)}
              </span>
              <span className="stat-label">⭐ 全科星级</span>
            </div>
            <div className="quick-stat-box">
              <span className="stat-number">{profile.badges?.length || 0}</span>
              <span className="stat-label">🏆 收集勋章</span>
            </div>
          </div>
        </div>

        {/* 动态岛屿冒险大地图 */}
        <WorldMap
          units={currentUnits}
          profile={profile}
          subject={profile.subject || 'math'}
          grade={profile.grade || 3}
          onSelectUnit={(unit) => setSelectedUnit(unit)}
        />
      </main>

      {/* 伴学萌宠灵宠小部件 */}
      <PetCompanion profile={profile} onFeedPet={refreshProfile} />

      {/* 关卡四阶闭环弹窗 */}
      {selectedUnit && (
        <LevelModal
          unit={selectedUnit}
          profile={profile}
          subject={profile.subject || 'math'}
          grade={profile.grade || 3}
          onClose={() => setSelectedUnit(null)}
          onProfileUpdated={refreshProfile}
        />
      )}

      {/* 错题复习本弹窗 */}
      {showMistakes && (
        <MistakeBookModal
          profile={profile}
          currentSubject={profile.subject || 'math'}
          currentGrade={profile.grade || 3}
          onClose={() => setShowMistakes(false)}
          onProfileUpdated={refreshProfile}
        />
      )}

      {/* 荣誉殿堂勋章弹窗 */}
      {showHonors && (
        <HonorModal
          profile={profile}
          currentSubject={profile.subject || 'math'}
          currentGrade={profile.grade || 3}
          onClose={() => setShowHonors(false)}
        />
      )}

      {/* 学情报告弹窗 */}
      {showReport && (
        <ParentReportModal
          profile={profile}
          currentSubject={profile.subject || 'math'}
          currentGrade={profile.grade || 3}
          onClose={() => setShowReport(false)}
        />
      )}

      {/* 全学科大纲总览弹窗 */}
      {showCurriculumOverview && (
        <SubjectOverviewModal
          onClose={() => setShowCurriculumOverview(false)}
        />
      )}

      {/* 火柴人荣耀接力弹窗 */}
      {showStickmanRelay && (
        <StickmanRelayModal
          currentGrade={profile.grade || 3}
          currentSubject={profile.subject || 'math'}
          onClose={() => setShowStickmanRelay(false)}
        />
      )}

      {/* 页脚版权与儿童友好提示 */}
      <footer className="app-footer">
        <p>智趣学堂 · 中国大陆小学生全学科游戏化学习系统 | 人教版数学 · 部编人教版语文 · 北师大版英语 · 教科版科学 一至六年级全覆盖</p>
        <p className="footer-sub">保护视力健康小贴士：每次学习闯关 30-40 分钟后，记得闭目或远眺绿色放松一下哦！👀🌿</p>
      </footer>
    </div>
  );
}
