export default function SummaryCards({
  totalReturnPct,
  winRatePct,
  adherencePct,
  avgHoldDays,
}) {
  const items = [
    { k: 'ret', label: '총 수익률', value: `${totalReturnPct.toFixed(2)}%`, hint: '체결 기준 복리 합성' },
    { k: 'win', label: '승률', value: `${winRatePct.toFixed(1)}%`, hint: '손익 플러스 거래 비율' },
    { k: 'rule', label: '원칙 준수율', value: `${adherencePct.toFixed(1)}%`, hint: '사전 규칙 준수 체결' },
    { k: 'hold', label: '평균 보유 기간', value: `${avgHoldDays.toFixed(1)}일`, hint: '체결~정리 기준' },
  ];

  return (
    <div className="rp-summary">
      {items.map((it) => (
        <div key={it.k} className="rp-summary__card">
          <span className="rp-summary__label">{it.label}</span>
          <strong className="rp-summary__value">{it.value}</strong>
          <span className="rp-summary__hint">{it.hint}</span>
        </div>
      ))}
    </div>
  );
}
