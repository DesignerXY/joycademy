// 游戏化学习进度与多学科多学段数据持久化存储引擎

const STORAGE_KEY = 'primary_all_subjects_game_data_v2';
const LEGACY_STORAGE_KEY = 'primary_math_game_data_v1';

const DEFAULT_PROFILE = {
  id: 'save_1',
  name: '智慧探险家',
  avatar: '🦁',
  grade: 3,
  subject: 'math',
  level: 1,
  exp: 0,
  coins: 50,
  pet: {
    type: 'dragon',
    name: '算术小神龙',
    level: 1,
    exp: 0,
    mood: 100
  },
  unitProgress: {}, // key 格式：`${subject}_g${grade}_${unitId}` 或向下兼容 `unit_1`
  wrongQuestions: [], // { id, subject, grade, unitId, question, userAns, rightAns, analysis, timestamp }
  badges: [], // [`badge_${subject}_g${grade}_${unitId}`, ...]
  studyStats: {
    totalQuestionsSolved: 0,
    correctCount: 0,
    bossDefeated: 0,
    continuousDays: 1,
    lastPlayDate: new Date().toISOString().split('T')[0]
  }
};

export const getStorageKey = (subject = 'math', grade = 3, unitId) => {
  return `${subject}_g${grade}_${unitId}`;
};

export const loadGameData = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      return JSON.parse(raw);
    }
    // 检查是否有旧版本数据并迁移
    const legacyRaw = localStorage.getItem(LEGACY_STORAGE_KEY);
    if (legacyRaw) {
      try {
        const oldData = JSON.parse(legacyRaw);
        saveGameData(oldData);
        return oldData;
      } catch (e) {}
    }
    const initialData = {
      currentProfileId: 'save_1',
      profiles: [DEFAULT_PROFILE]
    };
    saveGameData(initialData);
    return initialData;
  } catch (e) {
    console.error('Failed to load game data:', e);
    return {
      currentProfileId: 'save_1',
      profiles: [DEFAULT_PROFILE]
    };
  }
};

export const saveGameData = (data) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (e) {
    console.error('Failed to save game data:', e);
  }
};

export const getCurrentProfile = () => {
  const data = loadGameData();
  const profile = data.profiles.find(p => p.id === data.currentProfileId);
  return profile || data.profiles[0] || DEFAULT_PROFILE;
};

export const updateCurrentProfile = (updater) => {
  const data = loadGameData();
  const index = data.profiles.findIndex(p => p.id === data.currentProfileId);
  if (index !== -1) {
    const current = data.profiles[index];
    const updated = typeof updater === 'function' ? updater(current) : { ...current, ...updater };
    data.profiles[index] = updated;
    saveGameData(data);
    return updated;
  }
  return null;
};

// 获取特定单元的进度信息
export const getUnitProgress = (profile, subject, grade, unitId, isFirstUnit = false) => {
  const key = getStorageKey(subject, grade, unitId);
  // 同时兼容旧版本未带前缀的 unitId (对于三年级数学)
  return (
    profile?.unitProgress?.[key] ||
    (subject === 'math' && grade === 3 ? profile?.unitProgress?.[unitId] : null) || {
      stars: 0,
      unlocked: isFirstUnit,
      completed: false,
      badge: false,
      stepProgress: { step1: false, step2: false, step3: false, step4: false }
    }
  );
};

// 记录答题结果
export const recordQuestionResult = (
  subject = 'math',
  grade = 3,
  unitId,
  questionData,
  isCorrect,
  userAnswer
) => {
  return updateCurrentProfile(profile => {
    const newStats = { ...(profile.studyStats || {}) };
    newStats.totalQuestionsSolved = (newStats.totalQuestionsSolved || 0) + 1;
    if (isCorrect) {
      newStats.correctCount = (newStats.correctCount || 0) + 1;
    }

    let wrongs = [...(profile.wrongQuestions || [])];
    const qKey = `${subject}_${grade}_${questionData.id}`;

    if (!isCorrect) {
      const existIdx = wrongs.findIndex(w => (w.qKey === qKey || w.id === questionData.id));
      const wrongItem = {
        id: questionData.id,
        qKey,
        subject,
        grade,
        unitId,
        question: questionData.question,
        options: questionData.options,
        userAns: userAnswer,
        rightAns: questionData.answer,
        analysis: questionData.explanation,
        timestamp: Date.now()
      };
      if (existIdx >= 0) {
        wrongs[existIdx] = wrongItem;
      } else {
        wrongs.unshift(wrongItem);
      }
    } else {
      wrongs = wrongs.filter(w => w.qKey !== qKey && w.id !== questionData.id);
    }

    const gainedCoins = isCorrect ? 5 : 1;
    const gainedExp = isCorrect ? 15 : 5;
    const newCoins = (profile.coins || 0) + gainedCoins;
    const totalExp = (profile.exp || 0) + gainedExp;
    const newLevel = Math.floor(totalExp / 100) + 1;

    const petExp = (profile.pet?.exp || 0) + gainedExp;
    const petLevel = Math.floor(petExp / 120) + 1;

    return {
      ...profile,
      coins: newCoins,
      exp: totalExp,
      level: newLevel,
      wrongQuestions: wrongs,
      studyStats: newStats,
      pet: {
        ...profile.pet,
        exp: petExp,
        level: petLevel
      }
    };
  });
};

// 完成单元关卡步骤
export const completeUnitStep = (
  subject = 'math',
  grade = 3,
  unitId,
  stepIndex,
  extraData = {}
) => {
  return updateCurrentProfile(profile => {
    const unitProgress = { ...(profile.unitProgress || {}) };
    const key = getStorageKey(subject, grade, unitId);
    const legacyKey = unitId;

    const currentUnit =
      unitProgress[key] ||
      (subject === 'math' && grade === 3 ? unitProgress[legacyKey] : null) || {
        stars: 0,
        unlocked: true,
        completed: false,
        badge: false,
        stepProgress: { step1: false, step2: false, step3: false, step4: false }
      };

    const stepKey = `step${stepIndex}`;
    const newStepProgress = {
      ...currentUnit.stepProgress,
      [stepKey]: true
    };

    let stars = currentUnit.stars || 0;
    let completed = currentUnit.completed || false;
    let badge = currentUnit.badge || false;
    const badges = [...(profile.badges || [])];

    if (stepIndex === 3 && stars < 1) stars = 1;
    if (stepIndex === 4) {
      stars = 3;
      completed = true;
      badge = true;
      const badgeId = `badge_${key}`;
      if (!badges.includes(badgeId)) {
        badges.push(badgeId);
      }
      if (subject === 'math' && grade === 3) {
        badges.push(`badge_${unitId}`);
      }
    }

    const updatedUnitData = {
      ...currentUnit,
      stars,
      completed,
      badge,
      stepProgress: newStepProgress,
      ...extraData
    };

    unitProgress[key] = updatedUnitData;
    if (subject === 'math' && grade === 3) {
      unitProgress[legacyKey] = updatedUnitData;
    }

    // 顺次解锁下一单元
    const unitNumber = parseInt(unitId.replace(/[^\d]/g, ''), 10);
    if (!isNaN(unitNumber)) {
      const nextUnitId = `unit_${unitNumber + 1}`;
      const nextKey = getStorageKey(subject, grade, nextUnitId);
      if (!unitProgress[nextKey]) {
        unitProgress[nextKey] = {
          stars: 0,
          unlocked: true,
          completed: false,
          badge: false,
          stepProgress: { step1: false, step2: false, step3: false, step4: false }
        };
      }
    }

    return {
      ...profile,
      unitProgress,
      badges,
      coins: (profile.coins || 0) + (stepIndex === 4 ? 50 : 20),
      studyStats: {
        ...profile.studyStats,
        bossDefeated:
          stepIndex === 4
            ? (profile.studyStats?.bossDefeated || 0) + 1
            : profile.studyStats?.bossDefeated || 0
      }
    };
  });
};

// 喂养伴学灵宠（消耗 5 金币，增加经验）
export const feedPet = () => {
  return updateCurrentProfile(profile => {
    if ((profile.coins || 0) < 5) return profile;
    const pet = profile.pet || { type: 'dragon', name: '算术小神龙', level: 1, exp: 0 };
    const newCoins = Math.max(0, (profile.coins || 0) - 5);
    const newExp = (pet.exp || 0) + 25;
    const levelGain = Math.floor(newExp / 100);
    const newLevel = (pet.level || 1) + levelGain;
    const expRemainder = newExp % 100;

    return {
      ...profile,
      coins: newCoins,
      pet: {
        ...pet,
        level: newLevel,
        exp: expRemainder,
        mood: 100
      }
    };
  });
};

// 切换伴学灵宠
export const switchPetType = (typeId, petName) => {
  return updateCurrentProfile(profile => {
    const pet = profile.pet || { type: 'dragon', name: '算术小神龙', level: 1, exp: 0 };
    return {
      ...profile,
      pet: {
        ...pet,
        type: typeId,
        name: petName || pet.name
      }
    };
  });
};

// 抚摸伴学灵宠（免费互动，增加经验与心情）
export const patPet = () => {
  return updateCurrentProfile(profile => {
    const pet = profile.pet || { type: 'dragon', name: '算术小神龙', level: 1, exp: 0 };
    const newExp = (pet.exp || 0) + 10;
    const levelGain = Math.floor(newExp / 100);
    const newLevel = (pet.level || 1) + levelGain;
    const expRemainder = newExp % 100;

    return {
      ...profile,
      pet: {
        ...pet,
        level: newLevel,
        exp: expRemainder,
        mood: 100
      }
    };
  });
};


