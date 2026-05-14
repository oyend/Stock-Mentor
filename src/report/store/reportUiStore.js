import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { TIME_RANGES } from '../utils/analytics';

const STORAGE_KEY = 'stockMentorReportUi';

export const useReportUiStore = create(
  persist(
    (set) => ({
      timeRange: TIME_RANGES.MONTH,
      darkMode: false,
      setTimeRange: (timeRange) => set({ timeRange }),
      toggleDarkMode: () => set((s) => ({ darkMode: !s.darkMode })),
    }),
    {
      name: STORAGE_KEY,
      storage: createJSONStorage(() => localStorage),
      partialize: (s) => ({ darkMode: s.darkMode, timeRange: s.timeRange }),
    }
  )
);
