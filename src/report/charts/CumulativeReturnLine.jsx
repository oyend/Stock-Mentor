import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

export default function CumulativeReturnLine({ data, dark }) {
  const grid = dark ? '#334155' : '#e2e8f0';
  const tick = dark ? '#94a3b8' : '#64748b';

  if (!data?.length) {
    return <div className="rp-chart-empty" style={{ color: tick }}>데이터 없음</div>;
  }

  return (
    <ResponsiveContainer width="100%" height={240}>
      <LineChart data={data} margin={{ top: 8, right: 8, left: -18, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke={grid} vertical={false} />
        <XAxis dataKey="date" tick={{ fill: tick, fontSize: 11 }} axisLine={{ stroke: grid }} />
        <YAxis
          tick={{ fill: tick, fontSize: 11 }}
          axisLine={{ stroke: grid }}
          tickFormatter={(v) => `${v}%`}
        />
        <Tooltip
          formatter={(v) => [`${v}%`, '누적 수익률']}
          contentStyle={{
            background: dark ? '#1e293b' : '#fff',
            border: `1px solid ${dark ? '#334155' : '#e2e8f0'}`,
            borderRadius: 10,
            color: dark ? '#f1f5f9' : '#0f172a',
          }}
        />
        <Line
          type="monotone"
          dataKey="cumulative"
          stroke="var(--rp-line)"
          strokeWidth={2.5}
          dot={false}
          activeDot={{ r: 5, fill: 'var(--rp-line)' }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
