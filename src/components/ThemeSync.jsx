import { useEffect } from 'react';
import { useReportUiStore } from '../report/store/reportUiStore';

/** 리포트 UI 스토어의 다크 모드를 `html[data-theme]`에 반영 — 전 페이지 토큰 연동 */
export default function ThemeSync() {
  const darkMode = useReportUiStore((s) => s.darkMode);

  useEffect(() => {
    document.documentElement.dataset.theme = darkMode ? 'dark' : 'light';
  }, [darkMode]);

  useEffect(() => {
    return useReportUiStore.persist.onFinishHydration(() => {
      const d = useReportUiStore.getState().darkMode;
      document.documentElement.dataset.theme = d ? 'dark' : 'light';
    });
  }, []);

  return null;
}
