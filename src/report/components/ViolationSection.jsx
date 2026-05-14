export default function ViolationSection({ items }) {
  const max = items.length ? Math.max(...items.map((x) => x.count)) : 1;

  return (
    <section className="rp-violations" aria-label="자주 위반한 원칙">
      <h2 className="rp-section-title">
        <span className="rp-section-title__icon" aria-hidden>
          ⚠️
        </span>
        가장 많이 위반한 원칙
      </h2>
      {!items.length ? (
        <p className="rp-muted">이 구간에서는 기록된 위반이 없습니다. 훌륭해요!</p>
      ) : (
        <ul className="rp-violations__list">
          {items.map((v) => (
            <li key={v.key} className="rp-violations__item">
              <div className="rp-violations__row">
                <span className="rp-violations__label">{v.label}</span>
                <span className="rp-violations__count">{v.count}회</span>
              </div>
              <div className="rp-violations__bar">
                <span style={{ width: `${(v.count / max) * 100}%` }} />
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
