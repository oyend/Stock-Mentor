/** 위반 유형 → 표시 라벨 */
export const VIOLATION_TYPE_KEYS = {
  DELAYED_STOP: 'delayed_stop',
  IMPULSE_BUY: 'impulse_buy',
  OVERWEIGHT: 'overweight',
};

export const VIOLATION_LABELS = {
  [VIOLATION_TYPE_KEYS.DELAYED_STOP]: '손절 지연',
  [VIOLATION_TYPE_KEYS.IMPULSE_BUY]: '충동 매수',
  [VIOLATION_TYPE_KEYS.OVERWEIGHT]: '비중 초과',
};
