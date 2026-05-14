/**
 * 더미 투자 체결 데이터 (시각화·리포트용)
 * 실서비스에서는 API / 로컬 저장소와 동일 스키마로 치환 가능
 */

import { VIOLATION_TYPE_KEYS } from './violationLabels';

const { DELAYED_STOP, IMPULSE_BUY, OVERWEIGHT } = VIOLATION_TYPE_KEYS;

const SYMBOLS = [
  '삼성전자',
  'SK하이닉스',
  'NAVER',
  '카카오',
  'LG에너지솔루션',
  '현대차',
  '셀트리온',
  '포스코홀딩스',
  'KB금융',
  '신한지주',
];

/** 간단 시드 PRNG — 동일 데이터 재현 */
function mulberry32(a) {
  return function seeded() {
    let t = (a += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function pad2(n) {
  return String(n).padStart(2, '0');
}

function isoDate(y, m, d) {
  return `${y}-${pad2(m)}-${pad2(d)}`;
}

/**
 * @returns {Array<{
 *   id: string,
 *   symbol: string,
 *   buyPrice: number,
 *   sellPrice: number,
 *   pnlPct: number,
 *   compliant: boolean,
 *   violationType: string | null,
 *   tradeDate: string,
 *   holdingDays: number
 * }>}
 */
export function generateMockTrades() {
  const rand = mulberry32(20260215);
  const trades = [];
  const start = new Date(2025, 7, 1);
  const end = new Date(2026, 1, 15);
  let id = 0;

  for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
    if (rand() > 0.42) continue;
    const y = d.getFullYear();
    const m = d.getMonth() + 1;
    const day = d.getDate();
    const dateStr = isoDate(y, m, day);

    const sym = SYMBOLS[Math.floor(rand() * SYMBOLS.length)];
    const buy = Math.round(30000 + rand() * 120000);
    const compliantRoll = rand();
    const compliant = compliantRoll > 0.28;
    let violationType = null;
    if (!compliant) {
      const v = rand();
      if (v < 0.35) violationType = DELAYED_STOP;
      else if (v < 0.7) violationType = IMPULSE_BUY;
      else violationType = OVERWEIGHT;
    }

    let pnlBase = (rand() - 0.38) * 14;
    if (!compliant) pnlBase -= rand() * 4;
    const pnlPct = Math.round(pnlBase * 100) / 100;
    const sell = Math.round(buy * (1 + pnlPct / 100));
    const holdingDays = 1 + Math.floor(rand() * 18);

    trades.push({
      id: `mt-${++id}`,
      symbol: sym,
      buyPrice: buy,
      sellPrice: sell,
      pnlPct,
      compliant,
      violationType,
      tradeDate: dateStr,
      holdingDays,
    });
  }

  return trades.sort((a, b) => a.tradeDate.localeCompare(b.tradeDate));
}

let _cache;
export function getMockTrades() {
  if (!_cache) _cache = generateMockTrades();
  return _cache;
}
