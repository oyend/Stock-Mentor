import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
} from 'recharts';

export default function DonutPrincipleChart({ data, dark }) {
  const tick = dark ? '#94a3b8' : '#64748b';
  if (!data?.length || data.every((d) => d.value === 0)) {
    return (
      <div className="rp-chart-empty" style={{ color: tick }}>
        이 구간에 표시할 거래가 없습니다.
      </div>
    );
  }

  const total = data.reduce((a, d) => a + d.value, 0);
  const ok = data.find((d) => d.name === '원칙 준수')?.value ?? 0;
  const okPct = total ? Math.round((ok / total) * 1000) / 10 : 0;

  return (
    <ResponsiveContainer width="100%" height={240}>
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          innerRadius={58}
          outerRadius={82}
          paddingAngle={2}
          dataKey="value"
          nameKey="name"
          stroke="none"
        >
          {data.map((entry) => (
            <Cell key={entry.name} fill={entry.fill} />
          ))}
        </Pie>
        <Tooltip
          contentStyle={{
            background: dark ? '#1e293b' : '#fff',
            border: `1px solid ${dark ? '#334155' : '#e2e8f0'}`,
            borderRadius: 10,
            color: dark ? '#f1f5f9' : '#0f172a',
          }}
        />
        <text
          x="50%"
          y="48%"
          textAnchor="middle"
          dominantBaseline="middle"
          fill={dark ? '#f8fafc' : '#0f172a'}
          fontSize={22}
          fontWeight={800}
        >
          {okPct}%
        </text>
        <text
          x="50%"
          y="58%"
          textAnchor="middle"
          dominantBaseline="middle"
          fill={tick}
          fontSize={11}
          fontWeight={600}
        >
          준수 비중
        </text>
      </PieChart>
    </ResponsiveContainer>
  );
}
