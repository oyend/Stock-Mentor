import { useReportUiStore } from '../report/store/reportUiStore';

export default function ThemeToggle({ className = '' }) {
  const darkMode = useReportUiStore((s) => s.darkMode);
  const toggleDarkMode = useReportUiStore((s) => s.toggleDarkMode);

  return (
    <button
      type="button"
      className={`app-theme-toggle${className ? ` ${className}` : ''}`}
      onClick={toggleDarkMode}
      aria-pressed={darkMode}
      aria-label={darkMode ? '라이트 모드로 전환' : '다크 모드로 전환'}
    >
      {darkMode ? '☀️' : '🌙'}
      <span className="app-theme-toggle__label">{darkMode ? ' 라이트' : ' 다크'}</span>
    </button>
  );
}
