import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { PROFILE_TYPE_KEYS } from '../investorTest/constants';
import { CARD_KEYS, PRINCIPLES_PERSIST_KEY, PRINCIPLES_SAVED_KEY } from './constants';
import { generatePrincipleCards, snapshotForBaseline } from './engine';
import { detectExcessiveStopLoss } from './riskGuards';
import { saveCanonicalPrinciples } from './storage';

function computeRiskFromCards(cards) {
  const row = cards.find((c) => c.key === CARD_KEYS.STOP_LOSS);
  return row ? detectExcessiveStopLoss(row.body) : null;
}

const initialState = {
  profileType: null,
  investmentGoal: 'growth',
  investmentPeriod: 'mid',
  cards: [],
  baselineSnapshot: [],
  riskMessage: null,
  lastExplicitSaveAt: null,
};

export const usePrinciplesStore = create(
  persist(
    (set, get) => ({
      ...initialState,

      /** 라우트·성향 테스트 저장소에서 프로필을 받아 초기화 */
      bootstrap: ({ profileType, investmentGoal, investmentPeriod, forceRegenerate }) => {
        const pt = profileType ?? get().profileType;
        if (!pt) return;

        const nextGoal = investmentGoal ?? get().investmentGoal ?? 'growth';
        const nextPeriod = investmentPeriod ?? get().investmentPeriod ?? 'mid';

        const prev = get();
        const shouldRegen =
          forceRegenerate ||
          prev.cards.length === 0 ||
          prev.profileType !== pt ||
          prev.investmentGoal !== nextGoal ||
          prev.investmentPeriod !== nextPeriod;

        if (!shouldRegen) {
          set({ profileType: pt, investmentGoal: nextGoal, investmentPeriod: nextPeriod });
          return;
        }

        const cards = generatePrincipleCards(pt, nextGoal, nextPeriod);
        set({
          profileType: pt,
          investmentGoal: nextGoal,
          investmentPeriod: nextPeriod,
          cards,
          baselineSnapshot: snapshotForBaseline(cards),
          riskMessage: computeRiskFromCards(cards),
        });
      },

      setInputs: (partial) =>
        set({
          investmentGoal: partial.investmentGoal ?? get().investmentGoal,
          investmentPeriod: partial.investmentPeriod ?? get().investmentPeriod,
        }),

      regenerate: () => {
        const { profileType, investmentGoal, investmentPeriod } = get();
        if (!profileType) return;
        const cards = generatePrincipleCards(profileType, investmentGoal, investmentPeriod);
        set({
          cards,
          baselineSnapshot: snapshotForBaseline(cards),
          riskMessage: computeRiskFromCards(cards),
        });
      },

      updateCardBody: (key, body) => {
        const cards = get().cards.map((c) => (c.key === key ? { ...c, body } : c));
        set({ cards, riskMessage: computeRiskFromCards(cards) });
      },

      toggleCardEnabled: (key) => {
        const cards = get().cards.map((c) =>
          c.key === key ? { ...c, enabled: !c.enabled } : c
        );
        set({ cards });
      },

      toggleCardCollapsed: (key) => {
        const cards = get().cards.map((c) =>
          c.key === key ? { ...c, collapsed: !c.collapsed } : c
        );
        set({ cards });
      },

      resetToBaseline: () => {
        const snap = get().baselineSnapshot;
        if (!snap?.length) return;
        const cards = snapshotForBaseline(snap);
        set({ cards, riskMessage: computeRiskFromCards(cards) });
      },

      /** 확정 저장 — 대시보드·리포트 연동용 */
      saveExplicit: () => {
        const slice = get();
        if (!slice.profileType || !slice.cards.length) return null;
        const payload = saveCanonicalPrinciples({
          profileType: slice.profileType,
          investmentGoal: slice.investmentGoal,
          investmentPeriod: slice.investmentPeriod,
          cards: slice.cards,
        });
        set({ lastExplicitSaveAt: payload.savedAt });
        return payload;
      },

      /** 전체 초기화 (페이지 이탈 후 다시 구성) */
      clearAll: () => {
        try {
          localStorage.removeItem(PRINCIPLES_PERSIST_KEY);
          localStorage.removeItem(PRINCIPLES_SAVED_KEY);
        } catch {
          /* ignore */
        }
        set({ ...initialState });
      },
    }),
    {
      name: PRINCIPLES_PERSIST_KEY,
      storage: createJSONStorage(() => localStorage),
      partialize: (s) => ({
        profileType: s.profileType,
        investmentGoal: s.investmentGoal,
        investmentPeriod: s.investmentPeriod,
        cards: s.cards,
        baselineSnapshot: s.baselineSnapshot,
        lastExplicitSaveAt: s.lastExplicitSaveAt,
      }),
    }
  )
);