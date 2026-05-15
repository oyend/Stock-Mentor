import { loadInvestorTestResult } from '../investorTest/persistence';
import { loadCanonicalPrinciples } from '../principles/storage';
import { PRINCIPLES_PERSIST_KEY } from '../principles/constants';

/** 1단계: 투자 성향 테스트 완료(저장된 결과 존재) */
export function hasCompletedInvestorTest() {
  const r = loadInvestorTestResult();
  return Boolean(r?.profileType);
}

/**
 * 2단계: AI 투자 원칙을 확정 저장함
 * (「내 투자 원칙 저장하기」로 canonical 저장된 경우만 인정)
 */
export function hasSavedPrinciples() {
  const c = loadCanonicalPrinciples();
  return Boolean(c?.profileType && Array.isArray(c.cards) && c.cards.length > 0);
}

/** 기록장·리포트 진입 가능 여부 = 성향 테스트 + 원칙 확정 저장 */
export function canAccessTradingTools() {
  return hasCompletedInvestorTest() && hasSavedPrinciples();
}

/** 디버그·UI용: 원칙 초안만 있고 확정 저장 전인지 */
export function hasPrinciplesDraftOnly() {
  if (hasSavedPrinciples()) return false;
  try {
    const raw = localStorage.getItem(PRINCIPLES_PERSIST_KEY);
    if (!raw) return false;
    const parsed = JSON.parse(raw);
    const st = parsed?.state ?? parsed;
    return Boolean(st?.profileType && Array.isArray(st.cards) && st.cards.length > 0);
  } catch {
    return false;
  }
}
