import { PROFILE_TYPE_KEYS, PROFILE_TYPE_LABELS } from '../investorTest/constants';
import { CARD_KEYS } from './constants';

/**
 * 카드 본문 파싱 실패 시에만 사용 — `engine.js` BASE와 동일 성향 기본값
 */
const PROFILE_FALLBACK_BOUNDS = {
  [PROFILE_TYPE_KEYS.STABLE]: {
    takeProfitMinPct: 5,
    takeProfitMaxPct: 16,
    stopLossMinPct: 3,
    stopLossMaxPct: 8,
  },
  [PROFILE_TYPE_KEYS.GROWTH]: {
    takeProfitMinPct: 8,
    takeProfitMaxPct: 30,
    stopLossMinPct: 6,
    stopLossMaxPct: 12,
  },
  [PROFILE_TYPE_KEYS.AGGRESSIVE]: {
    takeProfitMinPct: 8,
    takeProfitMaxPct: 35,
    stopLossMinPct: 3,
    stopLossMaxPct: 12,
  },
};

const DEFAULT_PROFILE = PROFILE_TYPE_KEYS.GROWTH;

function fallbackBounds(profileType) {
  const pt =
    profileType && PROFILE_FALLBACK_BOUNDS[profileType] ? profileType : DEFAULT_PROFILE;
  return {
    profileType: pt,
    profileLabel: PROFILE_TYPE_LABELS[pt] ?? '성장형',
    ...PROFILE_FALLBACK_BOUNDS[pt],
    takeSource: 'fallback',
    stopSource: 'fallback',
  };
}

/**
 * 익절 카드 본문에서 +X%, +X~Y% 형태의 목표 상승률(%)을 읽습니다.
 * @returns {{ takeProfitMinPct: number, takeProfitMaxPct: number, rawMin: number, rawMax: number } | null}
 */
export function parseTakeProfitBoundsFromBody(body) {
  if (!body || typeof body !== 'string') return null;
  const values = [];

  const rangePlus = /\+(\d+(?:\.\d+)?)\s*[~～]\s*\+?\s*(\d+(?:\.\d+)?)\s*%/g;
  let m;
  while ((m = rangePlus.exec(body)) !== null) {
    values.push(Number(m[1]), Number(m[2]));
  }

  const singlePlus = /\+(\d+(?:\.\d+)?)\s*%/g;
  while ((m = singlePlus.exec(body)) !== null) {
    values.push(Number(m[1]));
  }

  if (values.length === 0) return null;

  const rawMin = Math.min(...values);
  const rawMax = Math.max(...values);
  const marginLow = Math.min(2.5, rawMin * 0.22);
  const marginHigh = Math.max(3, rawMax * 0.18);

  return {
    takeProfitMinPct: Math.max(0.5, rawMin - marginLow),
    takeProfitMaxPct: rawMax + marginHigh,
    rawMin,
    rawMax,
  };
}

/**
 * 손절 카드 본문에서 손실 폭(%)을 읽습니다. 비교는 진입가 대비 하락 폭(양수 %)에 맞춥니다.
 * @returns {{ stopLossMinPct: number, stopLossMaxPct: number, rawMin: number, rawMax: number } | null}
 */
export function parseStopLossBoundsFromBody(body) {
  if (!body || typeof body !== 'string') return null;
  const magnitudes = [];

  const negBoth = /-\s*(\d+(?:\.\d+)?)\s*%\s*[~～]\s*-\s*(\d+(?:\.\d+)?)\s*%/g;
  let m;
  while ((m = negBoth.exec(body)) !== null) {
    magnitudes.push(Number(m[1]), Number(m[2]));
  }

  const negMixed = /-\s*(\d+(?:\.\d+)?)\s*[~～]\s*(\d+(?:\.\d+)?)\s*%/g;
  while ((m = negMixed.exec(body)) !== null) {
    magnitudes.push(Number(m[1]), Number(m[2]));
  }

  const negSingle = /-\s*(\d+(?:\.\d+)?)\s*%/g;
  while ((m = negSingle.exec(body)) !== null) {
    magnitudes.push(Number(m[1]));
  }

  if (magnitudes.length === 0) return null;

  const rawMin = Math.min(...magnitudes);
  const rawMax = Math.max(...magnitudes);
  const marginLow = Math.min(1.5, rawMin * 0.2);
  const marginHigh = Math.min(2.5, rawMax * 0.2);

  return {
    stopLossMinPct: Math.max(0.5, rawMin - marginLow),
    stopLossMaxPct: rawMax + marginHigh,
    rawMin,
    rawMax,
  };
}

/**
 * 확정 스냅샷의 익절·손절 카드 문구를 우선하고, 비어 있거나 파싱 실패 시 성향 폴백.
 */
function resolveBoundsFromCanonical(canonical) {
  const cards = canonical?.cards;
  const profileType = canonical?.profileType;
  const fb = fallbackBounds(profileType);

  const takeCard = Array.isArray(cards) ? cards.find((c) => c.key === CARD_KEYS.TAKE_PROFIT) : null;
  const stopCard = Array.isArray(cards) ? cards.find((c) => c.key === CARD_KEYS.STOP_LOSS) : null;

  const takeEnabled = takeCard?.enabled !== false;
  const stopEnabled = stopCard?.enabled !== false;

  const takeParsed = takeEnabled ? parseTakeProfitBoundsFromBody(takeCard?.body ?? '') : null;
  const stopParsed = stopEnabled ? parseStopLossBoundsFromBody(stopCard?.body ?? '') : null;

  const skipTakeCheck = takeCard && takeCard.enabled === false;
  const skipStopCheck = stopCard && stopCard.enabled === false;

  return {
    profileLabel: fb.profileLabel,
    takeProfitMinPct: skipTakeCheck
      ? Number.NEGATIVE_INFINITY
      : takeParsed?.takeProfitMinPct ?? fb.takeProfitMinPct,
    takeProfitMaxPct: skipTakeCheck
      ? Number.POSITIVE_INFINITY
      : takeParsed?.takeProfitMaxPct ?? fb.takeProfitMaxPct,
    stopLossMinPct: skipStopCheck
      ? Number.NEGATIVE_INFINITY
      : stopParsed?.stopLossMinPct ?? fb.stopLossMinPct,
    stopLossMaxPct: skipStopCheck
      ? Number.POSITIVE_INFINITY
      : stopParsed?.stopLossMaxPct ?? fb.stopLossMaxPct,
    takeSource: skipTakeCheck ? 'skipped' : takeParsed ? 'card' : 'fallback',
    stopSource: skipStopCheck ? 'skipped' : stopParsed ? 'card' : 'fallback',
    takeCardSnippet: skipTakeCheck
      ? '익절 원칙 카드가 꺼져 있어 익절 비율은 검사하지 않았습니다'
      : takeParsed
        ? `익절 원칙 카드 기준 약 +${takeParsed.rawMin}% ~ +${takeParsed.rawMax}%`
        : '익절 원칙 카드에서 비율을 읽지 못해 성향 기본 구간을 썼습니다',
    stopCardSnippet: skipStopCheck
      ? '손절 원칙 카드가 꺼져 있어 손절 비율은 검사하지 않았습니다'
      : stopParsed
        ? `손절 원칙 카드 기준 약 -${stopParsed.rawMin}% ~ -${stopParsed.rawMax}%`
        : '손절 원칙 카드에서 비율을 읽지 못해 성향 기본 구간을 썼습니다',
  };
}

/**
 * @param {{ entry: number, target: number, stop: number, canonical: object|null }} p
 * @returns {{ ok: boolean, violations: Array<{ code: string, message: string }>, profileLabel: string|null, takePct: number, lossPct: number }}
 */
export function validateTradeAgainstCanonicalPrinciples({ entry, target, stop, canonical }) {
  if (!canonical || (!canonical.cards?.length && !canonical.profileType)) {
    return {
      ok: true,
      violations: [],
      profileLabel: null,
      takePct: 0,
      lossPct: 0,
    };
  }

  const takePct = ((target - entry) / entry) * 100;
  const lossPct = ((entry - stop) / entry) * 100;
  const bounds = resolveBoundsFromCanonical(canonical);
  const violations = [];

  if (takePct < bounds.takeProfitMinPct) {
    violations.push({
      code: 'take_too_low',
      message: `익절 목표(+${takePct.toFixed(2)}%)가 ${bounds.takeCardSnippet}에 비해 낮습니다. 카드에 적은 익절 기준과 어긋날 수 있으니, 너무 이른 청산은 아닌지 살펴보세요.`,
    });
  } else if (takePct > bounds.takeProfitMaxPct) {
    violations.push({
      code: 'take_too_high',
      message: `익절 목표(+${takePct.toFixed(2)}%)가 ${bounds.takeCardSnippet}에서 허용하는 상한을 넘습니다. 카드에 없는 과도한 목표는 리스크를 키울 수 있습니다.`,
    });
  }

  if (lossPct < bounds.stopLossMinPct) {
    violations.push({
      code: 'stop_too_tight',
      message: `손절폭(-${lossPct.toFixed(2)}%)이 ${bounds.stopCardSnippet}에 비해 좁습니다. 원칙 카드에서 정한 손실 폭보다 촘촘하면 작은 흔들림에 자주 걸립니다.`,
    });
  } else if (lossPct > bounds.stopLossMaxPct) {
    violations.push({
      code: 'stop_too_wide',
      message: `손절폭(-${lossPct.toFixed(2)}%)이 ${bounds.stopCardSnippet}보다 넓습니다. 카드에서 정한 한 번에 감내할 손실 범위를 벗어납니다.`,
    });
  }

  return {
    ok: violations.length === 0,
    violations,
    profileLabel: bounds.profileLabel,
    takePct,
    lossPct,
  };
}
