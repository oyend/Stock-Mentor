import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

export default function MonthlyReturnBar({ data, dark }) {
  const grid = dark ? '#334155' : '#e2e8f0';
  const tick = dark ? '#94a3b8' : '#64748b';

  if (!data?.length) {
    return <div className="rp-chart-empty" style={{ color: tick }}>데이터 없음</div>;
  }

  return (
    <ResponsiveContainer width="100%" height={240}>
      <BarChart data={data} margin={{ top: 8, right: 8, left: -18, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke={grid} vertical={false} />
        <XAxis dataKey="month" tick={{ fill: tick, fontSize: 11 }} axisLine={{ stroke: grid }} />
        <YAxis
          tick={{ fill: tick, fontSize: 11 }}
          axisLine={{ stroke: grid }}
          tickFormatter={(v) => `${v}%`}
        />
        <Tooltip
          formatter={(v) => [`${v}%`, '월 평균 손익률']}
          contentStyle={{
            background: dark ? '#1e293b' : '#fff',
            border: `1px solid ${dark ? '#334155' : '#e2e8f0'}`,
            borderRadius: 10,
            color: dark ? '#f1f5f9' : '#0f172a',
          }}
        />
        <Bar dataKey="avgPnl" fill="var(--rp-bar)" radius={[6, 6, 0, 0]} maxBarSize={48} />
      </BarChart>
    </ResponsiveContainer>
  );
}
