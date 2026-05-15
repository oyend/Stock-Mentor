import { useState } from 'react';

import { INVESTMENT_QUOTES } from '../../data/quotes';

import './MentorQuoteHero.css';

function pickRandomQuote(list) {
  if (!list.length) return null;
  return list[Math.floor(Math.random() * list.length)];
}

export default function MentorQuoteHero() {
  const [active] = useState(() => pickRandomQuote(INVESTMENT_QUOTES));
  const showKo = Boolean(active?.quoteKo);

  if (!active) return null;

  return (
    <section className="mentor-hero" aria-label="오늘의 투자 멘토 한마디">
      <figure className="mentor-hero__card">
        <blockquote className="mentor-hero__body mentor-hero__body--in">
          <p className="mentor-hero__quote" lang={showKo ? 'en' : 'ko'}>
            {active.quote}
          </p>
          {showKo ? (
            <p className="mentor-hero__quote-ko" lang="ko">
              {active.quoteKo}
            </p>
          ) : null}
        </blockquote>
        <figcaption className="mentor-hero__author">{active.author}</figcaption>
      </figure>
    </section>
  );
}
