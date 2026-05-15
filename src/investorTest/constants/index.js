/** 투자 성향 테스트 — 공통 상수 (스토리지, 타입 키, UI 라벨) */

export const INVESTOR_TEST_STORAGE_KEY = 'stockMentorInvestorTestResult';

export const PROFILE_TYPE_KEYS = {
  STABLE: 'stable',
  GROWTH: 'growth',
  AGGRESSIVE: 'aggressive',
};

/** AI/백엔드 연동 시 스키마 버전 */
export const INVESTOR_TEST_RESULT_VERSION = 1;

export const PROFILE_TYPE_LABELS = {
  [PROFILE_TYPE_KEYS.STABLE]: '안정형',
  [PROFILE_TYPE_KEYS.GROWTH]: '성장형',
  [PROFILE_TYPE_KEYS.AGGRESSIVE]: '공격형',
};

export const SCORE_KEYS = ['stable', 'growth', 'aggressive'];
