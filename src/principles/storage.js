import { PRINCIPLES_SAVED_KEY, PRINCIPLES_SCHEMA_VERSION } from './constants';

export function saveCanonicalPrinciples(snapshot) {
  const payload = {
    version: PRINCIPLES_SCHEMA_VERSION,
    savedAt: new Date().toISOString(),
    ...snapshot,
  };
  localStorage.setItem(PRINCIPLES_SAVED_KEY, JSON.stringify(payload));
  return payload;
}

export function loadCanonicalPrinciples() {
  try {
    const raw = localStorage.getItem(PRINCIPLES_SAVED_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

/** 추후 투자 리포트·백엔드 전송용 */
export function buildReportPrinciplesPayload(storeSlice) {
  return {
    kind: 'principles_report_v1',
    version: PRINCIPLES_SCHEMA_VERSION,
    profileType: storeSlice.profileType,
    investmentGoal: storeSlice.investmentGoal,
    investmentPeriod: storeSlice.investmentPeriod,
    cards: storeSlice.cards?.map((c) => ({
      key: c.key,
      title: c.title,
      body: c.body,
      enabled: c.enabled,
      recommended: c.recommended,
    })),
    savedAt: storeSlice.lastExplicitSaveAt,
  };
}
