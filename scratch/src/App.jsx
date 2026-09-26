import React, { useState, useEffect } from 'react';
import DesktopApp from './DesktopApp';
import MobileApp from './mobile/MobileApp';

const STORAGE_MODE_KEY = 'zhiqu_preferred_view_mode';

// 设备检测与偏好判断
function getInitialMode() {
  if (typeof window === 'undefined') return 'desktop';

  // 1. URL 参数强指定优先: ?mode=mobile 或 ?mode=desktop
  const params = new URLSearchParams(window.location.search);
  const queryMode = params.get('mode');
  if (queryMode === 'mobile' || queryMode === 'desktop') {
    return queryMode;
  }

  // 2. 本地存储的用户手动切换偏好
  const savedMode = localStorage.getItem(STORAGE_MODE_KEY);
  if (savedMode === 'mobile' || savedMode === 'desktop') {
    return savedMode;
  }

  // 3. 默认移动端 UA 或小屏幕检测 (<= 768px)
  const isMobileUA = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  const isSmallScreen = window.innerWidth <= 768;

  return (isMobileUA || isSmallScreen) ? 'mobile' : 'desktop';
}

export default function App() {
  const [viewMode, setViewMode] = useState(getInitialMode);

  // 监听窗口尺寸变化（仅在未手动偏好设置时生效）
  useEffect(() => {
    const handleResize = () => {
      const savedMode = localStorage.getItem(STORAGE_MODE_KEY);
      const params = new URLSearchParams(window.location.search);
      if (!savedMode && !params.get('mode')) {
        const isSmallScreen = window.innerWidth <= 768;
        setViewMode(isSmallScreen ? 'mobile' : 'desktop');
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleSwitchToMobile = () => {
    localStorage.setItem(STORAGE_MODE_KEY, 'mobile');
    setViewMode('mobile');
  };

  const handleSwitchToDesktop = () => {
    localStorage.setItem(STORAGE_MODE_KEY, 'desktop');
    setViewMode('desktop');
  };

  return viewMode === 'mobile' ? (
    <MobileApp onSwitchToDesktop={handleSwitchToDesktop} />
  ) : (
    <DesktopApp onSwitchToMobile={handleSwitchToMobile} />
  );
}
