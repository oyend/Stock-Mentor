import { Navigate, useLocation } from 'react-router-dom';
import { hasCompletedInvestorTest, hasSavedPrinciples } from './access';

/** 성향 테스트 결과가 있어야 함 (AI 원칙 페이지) */
export function RequireInvestorTest({ children }) {
  const location = useLocation();
  if (!hasCompletedInvestorTest()) {
    return (
      <Navigate
        to="/investor-test"
        replace
        state={{ journeyRedirect: 'need_test', from: location.pathname }}
      />
    );
  }
  return children;
}

/**
 * 기록장·리포트: 성향 테스트 완료 + 원칙 확정 저장 완료
 */
export function RequireTradingTools({ children }) {
  const location = useLocation();
  if (!hasCompletedInvestorTest()) {
    return (
      <Navigate
        to="/investor-test"
        replace
        state={{ journeyRedirect: 'need_test', from: location.pathname }}
      />
    );
  }
  if (!hasSavedPrinciples()) {
    return (
      <Navigate
        to="/principles"
        replace
        state={{
          journeyRedirect: 'need_principles_save',
          from: location.pathname,
        }}
      />
    );
  }
  return children;
}
