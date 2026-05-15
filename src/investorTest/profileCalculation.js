import { INVESTOR_TEST_QUESTIONS } from './questions';
import { INVESTOR_TEST_RESULTS } from './results';
import { INVESTOR_TEST_RESULT_VERSION, PROFILE_TYPE_KEYS, SCORE_KEYS } from './constants';

const { STABLE, GROWTH, AGGRESSIVE } = PROFILE_TYPE_KEYS;

function emptyScores() {
  return { [STABLE]: 0, [GROWTH]: 0, [AGGRESSIVE]: 0 };
}

/**
 * 선택한 optionId 배열(질문 순서)로 점수 합산
 * @param {string[]} selectedOptionIds 문항 수와 동일한 길이, 각 요소는 해당 문항 option id
 */
export function calculateScoresFromAnswers(selectedOptionIds) {
  const totals = emptyScores();
  INVESTOR_TEST_QUESTIONS.forEach((q, idx) => {
    const optionId = selectedOptionIds[idx];
    if (!optionId) return;
    const opt = q.options.find((o) => o.id === optionId);
    if (!opt) return;
    SCORE_KEYS.forEach((k) => {
      totals[k] += opt.scores[k] ?? 0;
    });
  });
  return totals;
}

/** 동점 시: 성장형을 우선해 중간 성향으로 수렴 (제품 정책으로 조정 가능) */
export function resolveProfileType(scores) {
  const max = Math.max(scores[STABLE], scores[GROWTH], scores[AGGRESSIVE]);
  const winners = [STABLE, GROWTH, AGGRESSIVE].filter((k) => scores[k] === max);
  if (winners.length === 1) return winners[0];
  const tiePriority = [GROWTH, STABLE, AGGRESSIVE];
  return tiePriority.find((k) => winners.includes(k)) ?? GROWTH;
}

/**
 * AI 투자 원칙 생성 API 연동용 페이로드
 * @param {{ profileType: string, scores: object, answers: { questionId: string, optionId: string }[], resultCopy: object }} snapshot
 */
export function buildAiPrincipleRequestPayload(snapshot) {
  return {
    kind: 'investor_profile_v1',
    version: INVESTOR_TEST_RESULT_VERSION,
    profileType: snapshot.profileType,
    scores: snapshot.scores,
    answers: snapshot.answers,
    /** 서버가 참고할 수 있는 현재 정적 추천 문구 */
    baselinePrinciples: snapshot.resultCopy,
    locale: 'ko-KR',
    service: 'Stock Mentor',
  };
}

export function getResultCopy(profileType) {
  return INVESTOR_TEST_RESULTS[profileType] ?? INVESTOR_TEST_RESULTS[GROWTH];
}
