/**
 * 손절 원칙 카드 등에서 과도한 손실 허용 문구 감지
 * 예: "-20%" → 경고
 */
export function detectExcessiveStopLoss(text) {
  if (!text || typeof text !== 'string') return null;
  const matches = text.match(/-\s*(\d+(?:\.\d+)?)\s*%/g);
  if (!matches) return null;
  let maxAbs = 0;
  matches.forEach((m) => {
    const n = parseFloat(m.replace(/%/g, ''));
    if (!Number.isNaN(n)) maxAbs = Math.max(maxAbs, Math.abs(n));
  });
  if (maxAbs >= 15) {
    return '과도한 손실 허용은 투자 리스크를 크게 증가시킬 수 있습니다.';
  }
  return null;
}
