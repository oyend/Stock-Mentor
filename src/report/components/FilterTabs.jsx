import { TIME_RANGES } from '../utils/analytics';

const TABS = [
  { id: TIME_RANGES.WEEK, label: '주간' },
  { id: TIME_RANGES.MONTH, label: '월간' },
  { id: TIME_RANGES.ALL, label: '전체' },
];

export default function FilterTabs({ value, onChange }) {
  return (
    <div className="rp-tabs" role="tablist" aria-label="기간 필터">
      {TABS.map((t) => (
        <button
          key={t.id}
          type="button"
          role="tab"
          aria-selected={value === t.id}
          className={`rp-tabs__btn${value === t.id ? ' rp-tabs__btn--active' : ''}`}
          onClick={() => onChange(t.id)}
        >
          {t.label}
        </button>
      ))}
    </div>
  );
}
