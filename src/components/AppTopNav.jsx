import { NavLink, Link } from 'react-router-dom';
import ThemeToggle from './ThemeToggle';
import './AppTopNav.css';

function stepClass(isActive) {
  return `app-top-nav__step${isActive ? ' app-top-nav__step--active' : ''}`;
}

export default function AppTopNav() {
  return (
    <nav className="app-top-nav" aria-label="주요 메뉴">
      <div className="app-top-nav__inner">
        <Link to="/" className="app-top-nav__logo">
          Stock Mentor
        </Link>
        <div className="app-top-nav__actions">
          <div className="app-top-nav__steps" aria-label="이용 순서">
            <NavLink to="/investor-test" className={({ isActive }) => stepClass(isActive)}>
              ① 성향 테스트
            </NavLink>
            <NavLink to="/principles" className={({ isActive }) => stepClass(isActive)}>
              ② AI 원칙
            </NavLink>
            <NavLink to="/dashboard" className={({ isActive }) => stepClass(isActive)}>
              ③ 기록장
            </NavLink>
            <NavLink to="/report" className={({ isActive }) => stepClass(isActive)}>
              ④ 리포트
            </NavLink>
          </div>
          <ThemeToggle />
        </div>
      </div>
    </nav>
  );
}
