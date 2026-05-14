import { getMockTrades } from '../mock/trades';
import { mapTradingDataToReportTrades } from '../utils/tradingDataAdapter';

/** 기록장 데이터 우선, 없으면 시각화용 더미 */
export function getReportTrades() {
  const live = mapTradingDataToReportTrades();
  if (live.length > 0) return live;
  return getMockTrades();
}

export function reportUsesLiveData() {
  return mapTradingDataToReportTrades().length > 0;
}
