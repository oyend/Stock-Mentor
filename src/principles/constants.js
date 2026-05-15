/** AI 투자 원칙 — 공통 상수 */

export const PRINCIPLES_PERSIST_KEY = 'stockMentorPrinciplesStore';

/** 대시보드·리포트 연동용 확정 저장 스냅샷 */
export const PRINCIPLES_SAVED_KEY = 'stockMentorPrinciplesSaved';

export const PRINCIPLES_SCHEMA_VERSION = 1;

export const CARD_KEYS = {
  STOCK_STYLE: 'stockStyle',
  ENTRY: 'entry',
  TAKE_PROFIT: 'takeProfit',
  STOP_LOSS: 'stopLoss',
  POSITION: 'position',
  FORBIDDEN: 'forbidden',
};

export const INVESTMENT_GOALS = [
  { id: 'retirement', label: '노후·안정 현금흐름' },
  { id: 'growth', label: '자산 증식' },
  { id: 'learning', label: '학습·소액 체험' },
];

export const INVESTMENT_PERIODS = [
  { id: 'short', label: '단기 (수일~수주)' },
  { id: 'mid', label: '중기 (수주~수개월)' },
  { id: 'long', label: '장기 (분기 이상)' },
];
