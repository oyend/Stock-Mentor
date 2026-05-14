import { TRADING_DATA_STORAGE_KEY } from '../../constants/storageKeys';
import { VIOLATION_TYPE_KEYS } from '../mock/violationLabels';

const { DELAYED_STOP, IMPULSE_BUY, OVERWEIGHT } = VIOLATION_TYPE_KEYS;

function loadRawTradingData() {
  try {
    const raw = localStorage.getItem(TRADING_DATA_STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function inferComplianceAndViolation(item) {
  const memo = (item.memo || '').toLowerCase();
  if (memo.includes('위반') || memo.includes('충동') || memo.includes('미룸') || memo.includes('과매수')) {
    let violationType = IMPULSE_BUY;
    if (memo.includes('손절') || memo.includes('지연')) violationType = DELAYED_STOP;
    if (memo.includes('비중')) violationType = OVERWEIGHT;
    return { compliant: false, violationType };
  }
  return { compliant: true, violationType: null };
}

/**
 * 대시보드 `tradingData` → 리포트 차트용 거래 레코드
 */
export function mapTradingDataToReportTrades() {
  const list = loadRawTradingData();
  return list
    .filter((item) => item.status === 'completed')
    .map((item) => {
      const entry = Number(item.entry);
      const target = Number(item.target);
      const stop = Number(item.stop);
      const { compliant, violationType } = inferComplianceAndViolation(item);

      let pnlPct;
      if (item.exitType === 'profit') {
        const maxUp = ((target - entry) / entry) * 100;
        pnlPct = Math.min(Math.max(maxUp * 0.4, 0.5), maxUp * 0.95);
      } else {
        const maxDown = -((entry - stop) / entry) * 100;
        pnlPct = Math.max(Math.min(maxDown * 0.55, -0.3), maxDown * 0.92);
      }
      pnlPct = Math.round(pnlPct * 100) / 100;
      const sellPrice = Math.round(entry * (1 + pnlPct / 100));
      const tradeDate = new Date(item.id).toISOString().slice(0, 10);
      const holdingDays = Math.max(1, Math.min(45, 3 + (item.id % 17)));

      return {
        id: `dash-${item.id}`,
        symbol: item.name,
        buyPrice: entry,
        sellPrice,
        pnlPct,
        compliant,
        violationType,
        tradeDate,
        holdingDays,
      };
    })
    .sort((a, b) => a.tradeDate.localeCompare(b.tradeDate));
}
