export default function ActivityHeatmap({ cells, dark }) {
  const tick = dark ? '#94a3b8' : '#64748b';
  if (!cells?.length) {
    return <div className="rp-chart-empty" style={{ color: tick }}>데이터 없음</div>;
  }

  const max = Math.max(1, ...cells.map((c) => (c.count == null ? 0 : c.count)));
  const rows = [];
  for (let i = 0; i < cells.length; i += 7) {
    const row = cells.slice(i, i + 7);
    while (row.length < 7) {
      row.push({ date: `pad-${i}-${row.length}`, count: null });
    }
    rows.push(row);
  }

  const intensity = (n) => {
    if (n == null) return 'transparent';
    const r = n / max;
    if (dark) return `rgba(56, 189, 248, ${0.12 + r * 0.88})`;
    return `rgba(37, 99, 235, ${0.12 + r * 0.85})`;
  };

  const dow = ['월', '화', '수', '목', '금', '토', '일'];

  return (
    <div className="rp-heat">
      <div className="rp-heat__dow">
        {dow.map((d) => (
          <span key={d} className="rp-heat__dow-cell">
            {d}
          </span>
        ))}
      </div>
      {rows.map((row, ri) => (
        <div key={ri} className="rp-heat__row">
          {row.map((cell) => (
            <div
              key={cell.date}
              className="rp-heat__cell"
              style={{
                background: intensity(cell.count),
                borderColor: cell.count == null ? 'transparent' : undefined,
              }}
              title={cell.count == null ? '' : `${cell.date} · ${cell.count}건`}
            />
          ))}
        </div>
      ))}
      <div className="rp-heat__legend" style={{ color: tick }}>
        <span>적음</span>
        <div className="rp-heat__grad" />
        <span>많음</span>
      </div>
    </div>
  );
}
