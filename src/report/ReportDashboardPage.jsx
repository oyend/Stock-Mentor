import { useEffect, useMemo, useState } from 'react';
import { PROFILE_TYPE_LABELS } from '../investorTest/constants';
import { loadInvestorTestResult } from '../investorTest/persistence';
import { loadCanonicalPrinciples } from '../principles/storage';
import { getReportTrades, reportUsesLiveData } from './data/reportDataSource';
import {
  filterTradesByRange,
  compoundTotalReturnPct,
  winRate,
  principleAdherenceRate,
  averageHoldingDays,
  donutPrincipleData,
  cumulativeReturnSeries,
  monthlyReturnBars,
  heatmapGridCells,
  topViolations,
  buildAiInsights,
} from './utils/analytics';
import { useReportUiStore } from './store/reportUiStore';
import ReportHeader from './components/ReportHeader';
import FilterTabs from './components/FilterTabs';
import SummaryCards from './components/SummaryCards';
import DonutPrincipleChart from './charts/DonutPrincipleChart';
import CumulativeReturnLine from './charts/CumulativeReturnLine';
import MonthlyReturnBar from './charts/MonthlyReturnBar';
import ActivityHeatmap from './charts/ActivityHeatmap';
import AiInsightCards from './components/AiInsightCards';
import ViolationSection from './components/ViolationSection';
import './ReportDashboardPage.css';

export default function ReportDashboardPage() {
  const [dataRev, setDataRev] = useState(0);
  const timeRange = useReportUiStore((s) => s.timeRange);
  const setTimeRange = useReportUiStore((s) => s.setTimeRange);
  const darkMode = useReportUiStore((s) => s.darkMode);

  useEffect(() => {
    const bump = () => setDataRev((n) => n + 1);
    window.addEventListener('focus', bump);
    window.addEventListener('storage', bump);
    return () => {
      window.removeEventListener('focus', bump);
      window.removeEventListener('storage', bump);
    };
  }, []);

  const allTrades = useMemo(() => getReportTrades(), [dataRev]);
  const live = useMemo(() => reportUsesLiveData(), [dataRev]);

  const meta = useMemo(() => {
    const test = loadInvestorTestResult();
    const canon = loadCanonicalPrinciples();
    return {
      profileLabel: test?.profileType ? PROFILE_TYPE_LABELS[test.profileType] : '',
      principlesSavedAt: canon?.savedAt ? new Date(canon.savedAt).toLocaleString('ko-KR') : '',
    };
  }, [dataRev]);

  const filtered = useMemo(
    () => filterTradesByRange(allTrades, timeRange),
    [allTrades, timeRange]
  );

  const summary = useMemo(() => {
    return {
      total: compoundTotalReturnPct(filtered),
      win: winRate(filtered),
      adhere: principleAdherenceRate(filtered),
      hold: averageHoldingDays(filtered),
    };
  }, [filtered]);

  const donutData = useMemo(() => donutPrincipleData(filtered), [filtered]);
  const lineData = useMemo(() => cumulativeReturnSeries(filtered), [filtered]);
  const barData = useMemo(() => monthlyReturnBars(filtered), [filtered]);
  const heatCells = useMemo(() => heatmapGridCells(filtered, 42), [filtered]);
  const violations = useMemo(() => topViolations(filtered, 6), [filtered]);
  const insights = useMemo(() => buildAiInsights(filtered), [filtered]);

  return (
    <div className="rp-root">
      <div className="rp-page">
        <ReportHeader />

        {(meta.profileLabel || meta.principlesSavedAt) && (
          <div className="rp-linked-data" role="status">
            {meta.profileLabel && (
              <span>
                성향 테스트: <strong>{meta.profileLabel}</strong>
              </span>
            )}
            {meta.principlesSavedAt && (
              <span>
                원칙 확정: <strong>{meta.principlesSavedAt}</strong>
              </span>
            )}
            <span>{live ? '기록장 체결 데이터 연동' : '샘플 데이터(기록장에 완료 매매를 쌓으면 자동 전환)'}</span>
          </div>
        )}

        <div className="rp-subbar">
          <FilterTabs value={timeRange} onChange={setTimeRange} />
          <p className="rp-trade-count">
            분석 거래 <strong>{filtered.length}</strong>건
            {live ? ' · 기록장과 동일 데이터' : ' · 시각화용 샘플 포함'}
          </p>
        </div>

        <SummaryCards
          totalReturnPct={summary.total}
          winRatePct={summary.win}
          adherencePct={summary.adhere}
          avgHoldDays={summary.hold}
        />

        <div className="rp-chart-grid">
          <section className="rp-panel">
            <h2 className="rp-panel__title">원칙 준수 vs 위반</h2>
            <DonutPrincipleChart data={donutData} dark={darkMode} />
            <div className="rp-donut-legend" aria-hidden>
              {donutData.map((d) => (
                <span key={d.name}>
                  <i style={{ background: d.fill }} />
                  {d.name} {d.value}건
                </span>
              ))}
            </div>
          </section>
          <section className="rp-panel rp-panel--wide">
            <h2 className="rp-panel__title">누적 수익률 변화</h2>
            <CumulativeReturnLine data={lineData} dark={darkMode} />
          </section>
          <section className="rp-panel">
            <h2 className="rp-panel__title">월별 평균 손익률</h2>
            <MonthlyReturnBar data={barData} dark={darkMode} />
          </section>
          <section className="rp-panel rp-panel--wide">
            <h2 className="rp-panel__title">투자 활동 빈도 (최근 6주)</h2>
            <ActivityHeatmap cells={heatCells} dark={darkMode} />
          </section>
        </div>

        <AiInsightCards items={insights} />
        <ViolationSection items={violations} />
      </div>
    </div>
  );
}
