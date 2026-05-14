import {
  INVESTOR_TEST_RESULT_VERSION,
  INVESTOR_TEST_STORAGE_KEY,
} from './constants';

export function loadInvestorTestResult() {
  try {
    const raw = localStorage.getItem(INVESTOR_TEST_STORAGE_KEY);
    if (!raw) return null;
    const data = JSON.parse(raw);
    if (!data || data.version !== INVESTOR_TEST_RESULT_VERSION) return null;
    return data;
  } catch {
    return null;
  }
}

export function saveInvestorTestResult(payload) {
  localStorage.setItem(INVESTOR_TEST_STORAGE_KEY, JSON.stringify(payload));
}

export function clearInvestorTestResult() {
  localStorage.removeItem(INVESTOR_TEST_STORAGE_KEY);
}
