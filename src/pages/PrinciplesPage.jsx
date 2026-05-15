import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { PROFILE_TYPE_LABELS } from '../investorTest/constants';
import { loadInvestorTestResult } from '../investorTest/persistence';
import { hasSavedPrinciples } from '../journey/access';
import { INVESTMENT_GOALS, INVESTMENT_PERIODS } from '../principles/constants';
import { usePrinciplesStore } from '../principles/principlesStore';
import { buildReportPrinciplesPayload } from '../principles/storage';
import './PrinciplesPage.css';

const TONE_BY_KEY = {
  stockStyle: 'style',
  entry: 'entry',
  takeProfit: 'profit',
  stopLoss: 'loss',
  position: 'pos',
  forbidden: 'ban',
};

function resolveProfileFromSources(locationState) {
  const fromNav = locationState?.profileType;
  if (fromNav && PROFILE_TYPE_LABELS[fromNav]) return fromNav;
  const test = loadInvestorTestResult();
  if (test?.profileType && PROFILE_TYPE_LABELS[test.profileType]) return test.profileType;
  return null;
}

export default function PrinciplesPage() {
  const location = useLocation();
  const [hydrated, setHydrated] = useState(() => usePrinciplesStore.persist.hasHydrated());

  const profileType = usePrinciplesStore((s) => s.profileType);
  const investmentGoal = usePrinciplesStore((s) => s.investmentGoal);
  const investmentPeriod = usePrinciplesStore((s) => s.investmentPeriod);
  const cards = usePrinciplesStore((s) => s.cards);
  const riskMessage = usePrinciplesStore((s) => s.riskMessage);
  const lastExplicitSaveAt = usePrinciplesStore((s) => s.lastExplicitSaveAt);

  const bootstrap = usePrinciplesStore((s) => s.bootstrap);
  const setInputs = usePrinciplesStore((s) => s.setInputs);
  const regenerate = usePrinciplesStore((s) => s.regenerate);
  const updateCardBody = usePrinciplesStore((s) => s.updateCardBody);
  const toggleCardEnabled = usePrinciplesStore((s) => s.toggleCardEnabled);
  const toggleCardCollapsed = usePrinciplesStore((s) => s.toggleCardCollapsed);
  const resetToBaseline = usePrinciplesStore((s) => s.resetToBaseline);
  const saveExplicit = usePrinciplesStore((s) => s.saveExplicit);
  const clearAll = usePrinciplesStore((s) => s.clearAll);

  const [toast, setToast] = useState('');
  const [savedGate, setSavedGate] = useState(() => hasSavedPrinciples());
  const [justSaved, setJustSaved] = useState(false);
  const [clearModalOpen, setClearModalOpen] = useState(false);
  const saveFlashTimerRef = useRef(null);

  useEffect(() => {
    if (usePrinciplesStore.persist.hasHydrated()) setHydrated(true);
    const unsub = usePrinciplesStore.persist.onFinishHydration(() => setHydrated(true));
    return unsub;
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    const fromSources = resolveProfileFromSources(location.state);
    if (!fromSources) return;

    const snap = usePrinciplesStore.getState();
    const goal = location.state?.investmentGoal ?? snap.investmentGoal;
    const period = location.state?.investmentPeriod ?? snap.investmentPeriod;
    const forceRegenerate = Boolean(
      location.state?.seedFromTest || location.state?.forceRegenerate
    );

    bootstrap({
      profileType: fromSources,
      investmentGoal: goal,
      investmentPeriod: period,
      forceRegenerate,
    });
  }, [hydrated, location.key, location.state, bootstrap]);

  useEffect(() => {
    return () => {
      if (saveFlashTimerRef.current) window.clearTimeout(saveFlashTimerRef.current);
    };
  }, []);

  const hasProfile = Boolean(profileType);
  const profileLabel = profileType ? PROFILE_TYPE_LABELS[profileType] : '';

  const handleSave = useCallback(() => {
    const payload = saveExplicit();
    if (payload) {
      buildReportPrinciplesPayload({
        profileType,
        investmentGoal,
        investmentPeriod,
        cards,
        lastExplicitSaveAt: payload.savedAt,
      });
      setToast(
        '내 투자 원칙이 확정 저장되었습니다. 이제 기록장과 리포트에서 같은 흐름으로 분석할 수 있어요.'
      );
      setSavedGate(true);
      setJustSaved(true);
      if (saveFlashTimerRef.current) window.clearTimeout(saveFlashTimerRef.current);
      saveFlashTimerRef.current = window.setTimeout(() => setJustSaved(false), 4200);
      window.setTimeout(() => setToast(''), 4800);
    }
  }, [saveExplicit, profileType, investmentGoal, investmentPeriod, cards]);

  const goalLabel = useMemo(
    () => INVESTMENT_GOALS.find((g) => g.id === investmentGoal)?.label ?? '',
    [investmentGoal]
  );
  const periodLabel = useMemo(
    () => INVESTMENT_PERIODS.find((p) => p.id === investmentPeriod)?.label ?? '',
    [investmentPeriod]
  );

  const resolvedProfile = useMemo(
    () => resolveProfileFromSources(location.state),
    [location.state]
  );

  const journeyHint =
    location.state?.journeyRedirect === 'need_principles_save'
      ? '기록장·리포트를 보시려면 아래에서 원칙을 확정 저장해 주세요.'
      : null;

  if (!hydrated) {
    return (
      <div className="principles-page">
        <div className="principles-page__shell">
          <p className="principles-page__empty">설정을 불러오는 중…</p>
        </div>
      </div>
    );
  }

  const bootstrapping =
    hydrated && Boolean(resolvedProfile) && !profileType && cards.length === 0;

  if (hydrated && !resolvedProfile && !loadInvestorTestResult()?.profileType) {
    return <Navigate to="/investor-test" replace />;
  }

  if (bootstrapping) {
    return (
      <div className="principles-page">
        <div className="principles-page__shell">
          <p className="principles-page__empty">성향 결과에 맞춰 원칙을 준비하는 중…</p>
        </div>
      </div>
    );
  }

  return (
    <div className="principles-page">
      <div className="principles-page__shell">
        <header className="principles-page__hero">
          <div className="principles-page__hero-row">
            <div className="principles-page__hero-icon" aria-hidden>
              🤖
            </div>
            <div>
              <h1>AI가 당신에게 맞는 투자 원칙을 생성했어요</h1>
              <p>
                감정이 아니라 <strong>원칙</strong>으로 움직일 수 있게, 진입·익절·손절·비중·금지 행동을
                한 장의 규칙표로 정리했습니다. 각 카드는 펼치고 접을 수 있으며, 직접 수정하면 자동으로
                저장됩니다.
              </p>
            </div>
          </div>
        </header>

        {journeyHint && (
          <div className="principles-page__journey-banner" role="status">
            {journeyHint}
          </div>
        )}

        {hasProfile && (
          <div className="principles-page__toolbar">
            <div className="principles-page__toolbar-grid">
              <div className="principles-page__field">
                <label htmlFor="goal">투자 목표</label>
                <select
                  id="goal"
                  value={investmentGoal}
                  onChange={(e) => setInputs({ investmentGoal: e.target.value })}
                >
                  {INVESTMENT_GOALS.map((g) => (
                    <option key={g.id} value={g.id}>
                      {g.label}
                    </option>
                  ))}
                </select>
              </div>
              <div className="principles-page__field">
                <label htmlFor="period">투자 기간</label>
                <select
                  id="period"
                  value={investmentPeriod}
                  onChange={(e) => setInputs({ investmentPeriod: e.target.value })}
                >
                  {INVESTMENT_PERIODS.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <p className="principles-page__toolbar-summary">
              현재 성향: <strong>{profileLabel}</strong> · 목표: {goalLabel} · 기간: {periodLabel}
            </p>
            <div className="principles-page__toolbar-actions">
              <div className="principles-page__toolbar-row">
                <button type="button" className="app-btn-primary" onClick={() => regenerate()}>
                  조건 반영해 다시 생성
                </button>
                <button type="button" className="app-btn-secondary" onClick={() => resetToBaseline()}>
                  AI 초안으로 초기화
                </button>
              </div>
              <button
                type="button"
                className="principles-page__toolbar-clear"
                onClick={() => setClearModalOpen(true)}
              >
                전체 비우기
              </button>
            </div>
          </div>
        )}

        {riskMessage && (
          <div className="principles-page__risk" role="status">
            {riskMessage}
          </div>
        )}

        {hasProfile && cards.length > 0 && (
          <section className="principles-page__cards" aria-label="투자 원칙 카드">
            {cards.map((card, idx) => (
              <article
                key={card.key}
                className={`principles-card${card.enabled ? '' : ' principles-card--disabled'}`}
                data-tone={TONE_BY_KEY[card.key] ?? 'style'}
                style={{ animationDelay: `${idx * 0.05}s` }}
              >
                <div
                  className="principles-card__head"
                  onClick={() => toggleCardCollapsed(card.key)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      toggleCardCollapsed(card.key);
                    }
                  }}
                  role="button"
                  tabIndex={0}
                >
                  <div className="principles-card__icon" aria-hidden>
                    {card.icon}
                  </div>
                  <div className="principles-card__titles">
                    <h2>{card.title}</h2>
                    <div className="principles-card__meta">
                      {card.recommended && <span className="principles-card__badge">AI 추천</span>}
                    </div>
                  </div>
                  <label
                    className="principles-card__switch"
                    onClick={(e) => e.stopPropagation()}
                    htmlFor={`en-${card.key}`}
                  >
                    사용
                    <input
                      id={`en-${card.key}`}
                      type="checkbox"
                      checked={card.enabled}
                      onChange={() => toggleCardEnabled(card.key)}
                    />
                  </label>
                  <span className="principles-card__chev" aria-hidden>
                    {card.collapsed ? '▼' : '▲'}
                  </span>
                </div>
                {!card.collapsed && (
                  <div className="principles-card__body">
                    <textarea
                      className="principles-card__textarea"
                      value={card.body}
                      disabled={!card.enabled}
                      onChange={(e) => updateCardBody(card.key, e.target.value)}
                      aria-label={card.title}
                    />
                  </div>
                )}
              </article>
            ))}
          </section>
        )}

        {hasProfile && cards.length > 0 && (
          <div className="principles-page__footer-actions">
            <button type="button" className="principles-page__save-main" onClick={handleSave}>
              내 투자 원칙 저장하기
            </button>
            {toast && (
              <div className="principles-page__save-toast" role="status" aria-live="polite">
                <span className="principles-page__save-toast__icon" aria-hidden>
                  ✓
                </span>
                {toast}
              </div>
            )}
            {lastExplicitSaveAt && (
              <div
                className={`principles-page__save-meta${justSaved ? ' principles-page__save-meta--flash' : ''}`}
                role="status"
                aria-live="polite"
              >
                <span className="principles-page__save-meta__check" aria-hidden>
                  ✓
                </span>
                <div className="principles-page__save-meta__text">
                  <span className="principles-page__save-meta__label">
                    {justSaved ? '방금 확정 저장되었습니다' : '마지막 확정 저장'}
                  </span>
                  <time className="principles-page__save-meta__time" dateTime={lastExplicitSaveAt}>
                    {new Date(lastExplicitSaveAt).toLocaleString('ko-KR')}
                  </time>
                </div>
              </div>
            )}
            {!(savedGate || hasSavedPrinciples()) && (
              <p className="principles-page__footer-hint" role="note">
                아래 「내 투자 원칙 저장하기」로 확정 저장하면 상단 메뉴에서 기록장·리포트로 이동할 수 있어요.
              </p>
            )}
          </div>
        )}
      </div>

      {clearModalOpen && (
        <div
          className="app-modal-backdrop"
          role="presentation"
          onClick={() => setClearModalOpen(false)}
        >
          <div
            className="app-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="principles-clear-title"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 id="principles-clear-title" className="app-modal__title">
              전체 비우기
            </h2>
            <p className="app-modal__lead">
              저장된 초안과 카드 편집을 모두 비울까요? 이 작업은 되돌릴 수 없습니다.
            </p>
            <div className="app-modal__actions app-modal__actions--row">
              <button
                type="button"
                className="app-modal__btn app-modal__btn--outline"
                onClick={() => setClearModalOpen(false)}
              >
                취소
              </button>
              <button
                type="button"
                className="app-modal__btn app-modal__btn--danger"
                onClick={() => {
                  clearAll();
                  setClearModalOpen(false);
                }}
              >
                모두 비우기
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
