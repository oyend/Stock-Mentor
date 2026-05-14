import { VIOLATION_LABELS, VIOLATION_TYPE_KEYS } from '../mock/violationLabels';

export const TIME_RANGES = {
  WEEK: 'week',
  MONTH: 'month',
  ALL: 'all',
};

function parseDate(s) {
  return new Date(`${s}T12:00:00`);
}

function maxTradeDate(trades) {
  if (!trades.length) return new Date();
  return trades.reduce((max, t) => {
    const d = parseDate(t.tradeDate);
    return d > max ? d : max;
  }, parseDate(trades[0].tradeDate));
}

export function filterTradesByRange(trades, range) {
  if (!trades?.length) return [];
  if (range === TIME_RANGES.ALL) return [...trades];

  const end = maxTradeDate(trades);
  const start = new Date(end);
  if (range === TIME_RANGES.WEEK) start.setDate(end.getDate() - 7);
  else start.setDate(end.getDate() - 30);

  return trades.filter((t) => {
    const d = parseDate(t.tradeDate);
    return d >= start && d <= end;
  });
}

/** 체결 기준 복리 수익률(%) */
export function compoundTotalReturnPct(trades) {
  const sorted = [...trades].sort((a, b) => a.tradeDate.localeCompare(b.tradeDate));
  let acc = 1;
  sorted.forEach((t) => {
    acc *= 1 + t.pnlPct / 100;
  });
  return sorted.length ? (acc - 1) * 100 : 0;
}

export function winRate(trades) {
  if (!trades.length) return 0;
  const wins = trades.filter((t) => t.pnlPct > 0).length;
  return (wins / trades.length) * 100;
}

export function principleAdherenceRate(trades) {
  if (!trades.length) return 0;
  const ok = trades.filter((t) => t.compliant).length;
  return (ok / trades.length) * 100;
}

export function averageHoldingDays(trades) {
  if (!trades.length) return 0;
  const sum = trades.reduce((a, t) => a + t.holdingDays, 0);
  return sum / trades.length;
}

export function donutPrincipleData(trades) {
  const ok = trades.filter((t) => t.compliant).length;
  const bad = trades.length - ok;
  return [
    { name: '원칙 준수', value: ok, fill: 'var(--rp-donut-ok)' },
    { name: '원칙 위반', value: bad, fill: 'var(--rp-donut-bad)' },
  ].filter((d) => d.value > 0);
}

export function cumulativeReturnSeries(trades) {
  const sorted = [...trades].sort((a, b) => a.tradeDate.localeCompare(b.tradeDate));
  let acc = 1;
  return sorted.map((t) => {
    acc *= 1 + t.pnlPct / 100;
    return {
      date: t.tradeDate.slice(5),
      cumulative: Math.round((acc - 1) * 10000) / 100,
    };
  });
}

export function monthlyReturnBars(trades) {
  const map = new Map();
  trades.forEach((t) => {
    const key = t.tradeDate.slice(0, 7);
    if (!map.has(key)) map.set(key, { sum: 0, n: 0 });
    const b = map.get(key);
    b.sum += t.pnlPct;
    b.n += 1;
  });
  return [...map.entries()]
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([month, { sum, n }]) => ({
      month: month.replace('-', '/'),
      avgPnl: Math.round((sum / n) * 100) / 100,
    }));
}

/** 최근 N일 일별 거래 건수 (히트맵용) */
export function dailyActivityCounts(trades, days = 56) {
  const end = maxTradeDate(trades);
  const start = new Date(end);
  start.setDate(end.getDate() - (days - 1));
  const counts = new Map();

  for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    counts.set(`${y}-${m}-${day}`, 0);
  }

  trades.forEach((t) => {
    const d = parseDate(t.tradeDate);
    if (d < start || d > end) return;
    const key = t.tradeDate;
    counts.set(key, (counts.get(key) ?? 0) + 1);
  });

  return counts;
}

export function topViolations(trades, limit = 5) {
  const freq = new Map();
  trades.forEach((t) => {
    if (t.compliant || !t.violationType) return;
    freq.set(t.violationType, (freq.get(t.violationType) ?? 0) + 1);
  });
  return [...freq.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit)
    .map(([key, count]) => ({
      key,
      label: VIOLATION_LABELS[key] ?? key,
      count,
    }));
}

export function heatmapGridCells(trades, totalDays = 42) {
  if (!trades.length) return [];
  const end = maxTradeDate(trades);
  const counts = dailyActivityCounts(trades, totalDays);
  const cells = [];
  const iter = new Date(end);
  iter.setDate(end.getDate() - (totalDays - 1));
  for (let i = 0; i < totalDays; i++) {
    const y = iter.getFullYear();
    const m = String(iter.getMonth() + 1).padStart(2, '0');
    const d = String(iter.getDate()).padStart(2, '0');
    const key = `${y}-${m}-${d}`;
    cells.push({ date: key, count: counts.get(key) ?? 0 });
    iter.setDate(iter.getDate() + 1);
  }
  return cells;
}

export function buildAiInsights(trades) {
  const compliant = trades.filter((t) => t.compliant);
  const violated = trades.filter((t) => !t.compliant);
  const avg = (arr) => (arr.length ? arr.reduce((a, t) => a + t.pnlPct, 0) / arr.length : 0);
  const ac = avg(compliant);
  const av = avg(violated);

  const insights = [];

  if (compliant.length && violated.length) {
    if (ac > av) {
      insights.push({
        id: 'i1',
        title: '원칙 준수와 수익',
        body: `원칙을 지킨 거래의 평균 수익률(${ac.toFixed(2)}%)이 위반 거래(${av.toFixed(2)}%)보다 높았습니다. 규칙이 감정을 대신할 때 결과가 좋아지는 경향이 보입니다.`,
      });
    } else {
      insights.push({
        id: 'i1',
        title: '원칙 점검',
        body: `이번 구간에서는 위반 거래의 평균 손익이 더 나았습니다. 우연일 수 있으니, 위반 유형(손절 지연·충동 매수 등)을 줄이는지 다음 기간에도 지켜보세요.`,
      });
    }
  }

  const delayed = trades.filter((t) => t.violationType === VIOLATION_TYPE_KEYS.DELAYED_STOP);
  if (delayed.length) {
    const avgLoss = avg(delayed);
    insights.push({
      id: 'i2',
      title: '손절 기준',
      body: `손절을 미룬 거래는 평균 ${avgLoss.toFixed(2)}% 손익을 기록했습니다. 사전에 정한 손절가를 지키면 손실 폭을 제한하는 데 도움이 됩니다.`,
    });
  }

  const rate = principleAdherenceRate(trades);
  insights.push({
    id: 'i3',
    title: '습관 요약',
    body: `이 기간 원칙 준수율은 ${rate.toFixed(1)}%입니다. “기록 → 복기 → 규칙 수정” 루프를 유지하면 감정적 매매가 줄어듭니다.`,
  });

  return insights.slice(0, 4);
}
