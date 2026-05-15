import { useCallback, useEffect, useRef, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { INVESTOR_TEST_QUESTIONS } from '../investorTest/questions';
import {
  INVESTOR_TEST_RESULT_VERSION,
  PROFILE_TYPE_KEYS,
  PROFILE_TYPE_LABELS,
} from '../investorTest/constants';
import {
  buildAiPrincipleRequestPayload,
  calculateScoresFromAnswers,
  getResultCopy,
  resolveProfileType,
} from '../investorTest/profileCalculation';
import { loadInvestorTestResult, saveInvestorTestResult, clearInvestorTestResult } from '../investorTest/persistence';
import './InvestorTestPage.css';

const TOTAL = INVESTOR_TEST_QUESTIONS.length;

function emptyAnswers() {
  return Array(TOTAL).fill(null);
}

export default function InvestorTestPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [phase, setPhase] = useState('quiz');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState(emptyAnswers);
  const [result, setResult] = useState(null);
  const [clearPersistModalOpen, setClearPersistModalOpen] = useState(false);
  const advanceTimer = useRef(null);
  const answersRef = useRef(answers);
  answersRef.current = answers;

  const clearAdvanceTimer = () => {
    if (advanceTimer.current) {
      window.clearTimeout(advanceTimer.current);
      advanceTimer.current = null;
    }
  };

  const openSavedResult = useCallback(() => {
    const s = loadInvestorTestResult();
    if (!s?.profileType) return;
    const resultCopy = s.resultCopy || getResultCopy(s.profileType);
    const aiPayload =
      s.aiPayload ??
      buildAiPrincipleRequestPayload({
        profileType: s.profileType,
        scores: s.scores,
        answers: s.answers,
        resultCopy,
      });
    setResult({
      profileType: s.profileType,
      scores: s.scores,
      resultCopy,
      aiPayload,
    });
    setPhase('result');
  }, []);

  const restart = useCallback(() => {
    clearAdvanceTimer();
    setPhase('quiz');
    setCurrentIndex(0);
    setAnswers(emptyAnswers());
    setResult(null);
  }, []);

  const handleSelect = useCallback(
    (optionId) => {
      if (phase !== 'quiz') return;
      clearAdvanceTimer();

      setAnswers((prev) => {
        const next = [...prev];
        next[currentIndex] = optionId;
        return next;
      });

      advanceTimer.current = window.setTimeout(() => {
        if (currentIndex < TOTAL - 1) {
          setCurrentIndex((i) => i + 1);
        } else {
          setPhase('analyzing');
        }
      }, 420);
    },
    [currentIndex, phase]
  );

  useEffect(() => () => clearAdvanceTimer(), []);

  useEffect(() => {
    if (phase !== 'analyzing') return undefined;
    const arr = answersRef.current;
    if (!arr.every(Boolean)) {
      setPhase('quiz');
      return undefined;
    }

    const timer = window.setTimeout(() => {
      const scores = calculateScoresFromAnswers(arr);
      const profileType = resolveProfileType(scores);
      const resultCopy = getResultCopy(profileType);
      const answerRecords = INVESTOR_TEST_QUESTIONS.map((q, i) => ({
        questionId: q.id,
        optionId: arr[i],
      }));
      const aiPayload = buildAiPrincipleRequestPayload({
        profileType,
        scores,
        answers: answerRecords,
        resultCopy,
      });
      const stored = {
        version: INVESTOR_TEST_RESULT_VERSION,
        completedAt: new Date().toISOString(),
        profileType,
        scores,
        answers: answerRecords,
        resultCopy,
        aiPayload,
      };
      saveInvestorTestResult(stored);
      setResult({ profileType, scores, resultCopy, aiPayload });
      setPhase('result');
    }, 1650);

    return () => {
      window.clearTimeout(timer);
    };
  }, [phase]);

  const goBack = useCallback(() => {
    if (phase === 'result') return;
    if (phase === 'analyzing') return;
    clearAdvanceTimer();
    if (currentIndex > 0) {
      setCurrentIndex((i) => i - 1);
    }
  }, [currentIndex, phase]);

  const progressPercent =
    phase === 'quiz' ? ((currentIndex + 1) / TOTAL) * 100 : 100;

  const showSavedHint = phase === 'quiz' && currentIndex === 0 && !!loadInvestorTestResult();

  const q = INVESTOR_TEST_QUESTIONS[currentIndex];
  const badgeClass =
    result?.profileType === PROFILE_TYPE_KEYS.STABLE
      ? 'investor-test__badge--stable'
      : result?.profileType === PROFILE_TYPE_KEYS.AGGRESSIVE
        ? 'investor-test__badge--aggressive'
        : 'investor-test__badge--growth';

  const maxScore = result
    ? Math.max(result.scores.stable, result.scores.growth, result.scores.aggressive) || 1
    : 1;

  return (
    <div className="investor-test">
      <div className="investor-test__shell">
        <div className="investor-test__card">
          {location.state?.journeyRedirect === 'need_test' && (
            <p className="investor-test__journey-banner" role="status">
              기록장·리포트는 <strong>성향 테스트 완료 → AI 원칙 확정 저장</strong> 순서로 이용할 수 있어요.
              먼저 아래 질문에 답해 주세요.
            </p>
          )}
          <div className="investor-test__mentor-line">
            <div className="investor-test__mentor-avatar" aria-hidden>
              ✨
            </div>
            <div className="investor-test__mentor-bubble">
              {phase === 'quiz' && (
                <>
                  <strong>AI 투자 멘토</strong>가 {TOTAL}가지 질문으로 성향을 정리해 드릴게요. 편한 선택을
                  누르시면 자동으로 다음으로 넘어갑니다.
                </>
              )}
              {phase === 'analyzing' && (
                <>
                  응답을 바탕으로 <strong>리스크·기간·심리 패턴</strong>을 묶어서 성향을 계산하고 있어요.
                </>
              )}
              {phase === 'result' && result && (
                <>
                  분석이 끝났어요. 아래 원칙은 <strong>시작점</strong>이며, 추후 AI가 맞춤 문장으로
                  다듬을 수 있게 데이터 구조를 맞춰 두었습니다.
                </>
              )}
            </div>
          </div>

          <div className="investor-test__progress-wrap">
            <div className="investor-test__progress-label">
              <span>
                {phase === 'quiz'
                  ? `질문 ${currentIndex + 1} / ${TOTAL}`
                  : phase === 'analyzing'
                    ? '분석 중'
                    : '완료'}
              </span>
              <span>{Math.round(progressPercent)}%</span>
            </div>
            <div className="investor-test__progress-track">
              <div
                className="investor-test__progress-fill"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>

          {phase === 'quiz' && q && (
            <>
              {showSavedHint && (
                <div className="investor-test__saved-hint">
                  <button type="button" className="app-btn-secondary investor-test__btn-full" onClick={openSavedResult}>
                    지난 결과 보기
                  </button>
                </div>
              )}
              <h1 className="investor-test__q-title">{q.title}</h1>
              <div className="investor-test__options" role="list">
                {q.options.map((opt) => (
                  <button
                    key={opt.id}
                    type="button"
                    role="listitem"
                    className={`investor-test__option${
                      answers[currentIndex] === opt.id ? ' investor-test__option--selected' : ''
                    }`}
                    onClick={() => handleSelect(opt.id)}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
              <div className="investor-test__nav-row">
                <button
                  type="button"
                  className="app-btn-secondary investor-test__nav-back"
                  onClick={goBack}
                  disabled={currentIndex === 0}
                >
                  ← 이전 질문
                </button>
                <span className="investor-test__nav-hint">선택 시 자동 이동</span>
              </div>
            </>
          )}

          {phase === 'analyzing' && (
            <div className="investor-test__analyzing">
              <div className="investor-test__pulse" aria-hidden />
              <h2>성향을 정리하고 있어요</h2>
              <p>짧은 멘탈 모델로 응답을 요약합니다. 잠시만 기다려 주세요.</p>
              <div className="investor-test__dots" aria-hidden>
                <span />
                <span />
                <span />
              </div>
            </div>
          )}

          {phase === 'result' && result && (
            <>
              <div className="investor-test__result-hero">
                <div className={`investor-test__badge ${badgeClass}`}>
                  {PROFILE_TYPE_LABELS[result.profileType]} 투자자
                </div>
                <h1 className="investor-test__result-headline">{result.resultCopy.headline}</h1>
                <p className="investor-test__result-desc">{result.resultCopy.description}</p>
              </div>

              <div className="investor-test__score-bar" aria-label="성향 점수 비율">
                <div className="investor-test__score-seg investor-test__score-seg--stable">
                  <div
                    className="investor-test__score-seg-inner"
                    style={{ width: `${(result.scores.stable / maxScore) * 100}%` }}
                  />
                </div>
                <div className="investor-test__score-seg investor-test__score-seg--growth">
                  <div
                    className="investor-test__score-seg-inner"
                    style={{ width: `${(result.scores.growth / maxScore) * 100}%` }}
                  />
                </div>
                <div className="investor-test__score-seg investor-test__score-seg--aggressive">
                  <div
                    className="investor-test__score-seg-inner"
                    style={{ width: `${(result.scores.aggressive / maxScore) * 100}%` }}
                  />
                </div>
              </div>
              <div className="investor-test__score-labels">
                <span>안정 {result.scores.stable}</span>
                <span>성장 {result.scores.growth}</span>
                <span>공격 {result.scores.aggressive}</span>
              </div>

              <div className="investor-test__grid">
                <div className="investor-test__info-tile">
                  <div className="investor-test__info-label">추천 투자 스타일</div>
                  <div className="investor-test__info-value">{result.resultCopy.recommendedStyle}</div>
                </div>
                <div className="investor-test__info-tile">
                  <div className="investor-test__info-label">추천 손절 기준</div>
                  <div className="investor-test__info-value">{result.resultCopy.stopLossRule}</div>
                </div>
                <div className="investor-test__info-tile">
                  <div className="investor-test__info-label">추천 익절 기준</div>
                  <div className="investor-test__info-value">{result.resultCopy.takeProfitRule}</div>
                </div>
                <div className="investor-test__info-tile">
                  <div className="investor-test__info-label">추천 투자 방식</div>
                  <div className="investor-test__info-value">{result.resultCopy.investmentMethod}</div>
                </div>
              </div>

              <p className="investor-test__flow-hint">
                다음 단계: <strong>AI 투자 원칙</strong>에서 「내 투자 원칙 저장하기」까지 완료하면{' '}
                <strong>기록장</strong>과 <strong>투자 리포트</strong>가 열립니다.
              </p>
              <div className="investor-test__actions">
                <button
                  type="button"
                  className="app-btn-primary investor-test__btn-full"
                  onClick={() =>
                    navigate('/principles', {
                      state: {
                        profileType: result.profileType,
                        investmentGoal: 'growth',
                        investmentPeriod: 'mid',
                        seedFromTest: true,
                      },
                    })
                  }
                >
                  AI 투자 원칙 생성하기
                </button>
                <div className="investor-test__actions-row">
                  <button type="button" className="app-btn-secondary" onClick={restart}>
                    다시 테스트하기
                  </button>
                  <button type="button" className="app-btn-secondary" onClick={() => setClearPersistModalOpen(true)}>
                    저장 지우고 처음부터
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {clearPersistModalOpen && (
        <div
          className="app-modal-backdrop"
          role="presentation"
          onClick={() => setClearPersistModalOpen(false)}
        >
          <div
            className="app-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="investor-test-clear-title"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 id="investor-test-clear-title" className="app-modal__title">
              저장된 결과 지우기
            </h2>
            <p className="app-modal__lead">
              기기에 저장된 성향 테스트 결과를 삭제하고 처음부터 다시 시작할까요? 이 작업은 되돌릴 수 없습니다.
            </p>
            <div className="app-modal__actions app-modal__actions--row">
              <button
                type="button"
                className="app-modal__btn app-modal__btn--outline"
                onClick={() => setClearPersistModalOpen(false)}
              >
                취소
              </button>
              <button
                type="button"
                className="app-modal__btn app-modal__btn--danger"
                onClick={() => {
                  clearInvestorTestResult();
                  setClearPersistModalOpen(false);
                  restart();
                }}
              >
                지우고 시작
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
