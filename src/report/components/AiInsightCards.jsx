export default function AiInsightCards({ items }) {
  return (
    <section className="rp-insights" aria-label="AI 분석 리포트">
      <h2 className="rp-section-title">
        <span className="rp-section-title__icon" aria-hidden>
          ✨
        </span>
        AI 분석 리포트
      </h2>
      <div className="rp-insights__grid">
        {items.map((it, i) => (
          <article key={it.id} className="rp-insight-card" style={{ animationDelay: `${i * 0.05}s` }}>
            <span className="rp-insight-card__badge">AI 인사이트</span>
            <h3>{it.title}</h3>
            <p>{it.body}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
