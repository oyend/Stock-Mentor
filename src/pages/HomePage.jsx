import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import './HomePage.css';

export default function HomePage() {
  const [heroVisible, setHeroVisible] = useState({
    badge: false,
    title: false,
    para: false,
    btn: false,
  });
  const revealRootRef = useRef(null);

  useEffect(() => {
    const keys = ['badge', 'title', 'para', 'btn'];
    const timers = keys.map((key, index) =>
      setTimeout(() => {
        setHeroVisible((prev) => ({ ...prev, [key]: true }));
      }, 100 * (index + 1))
    );
    return () => timers.forEach(clearTimeout);
  }, []);

  useEffect(() => {
    const root = revealRootRef.current;
    if (!root) return undefined;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('active');
          }
        });
      },
      { threshold: 0.1 }
    );

    root.querySelectorAll('.reveal').forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <div className="home-page" ref={revealRootRef}>
      <header className="hero">
        <div className="container">
          <div className={`badge ${heroVisible.badge ? 'hero-visible' : ''}`}>
            원칙 기반 매매 기록 관리
          </div>
          <h1 className={heroVisible.title ? 'hero-visible' : ''}>
            흔들리는 감정은 빼고,
            <br />
            원칙을 지키는 투자
          </h1>
          <p className={heroVisible.para ? 'hero-visible' : ''}>
            종목 추천보다 중요한 건 내가 세운 계획을 지키는 것.
            <br />
            스멘이는 &apos;어떻게 지킬지&apos;에 집중하여 당신의 감정적 매매를 막아줍니다.
          </p>
          <Link
            to="/investor-test"
            className={`app-btn-primary home-page__cta ${heroVisible.btn ? 'home-page__cta--visible' : ''}`}
          >
            내 원칙 기록하러 가기
          </Link>
        </div>
      </header>

      <section className="problem reveal">
        <div className="container">
          <h2 className="section-title">왜 항상 계획대로 팔지 못할까요?</h2>
          <div className="problem-content">
            <p>
              공포와 탐욕 앞에서 무너지는 심리, 주식 투자자라면 누구나 경험합니다.
              <br />
              머리로는 익절가와 손절가를 알고 있어도, 정작{' '}
              <span className="highlight">실행의 순간에 손가락이 따라주지 않는 이유</span>는 무엇일까요?
              <br />
              <br />
              감정에 휘둘린 한 번의 뇌동매매는 수개월간의 수익을 단번에 앗아갑니다.
              <br />
              이제는 &apos;무엇을 살지&apos;가 아니라 <strong>&apos;세워둔 원칙을 어떻게 지킬지&apos;</strong>에 집중해야
              합니다.
            </p>
          </div>
        </div>
      </section>

      <section className="features">
        <div className="container">
          <div className="home-page__features-title-wrap">
            <h2 className="section-title reveal">스멘이가 제안하는 3단계 매매 습관</h2>
          </div>
          <div className="feature-grid">
            <div className="feature-card reveal">
              <div className="step-num">1</div>
              <h3>목표 설정</h3>
              <p>
                종목명, 진입가, 익절가, 손절가를 직접 입력하세요. 매수 전, 감정이 개입되기 전에 나만의 명확한
                시나리오를 먼저 세웁니다.
              </p>
            </div>
            <div className="feature-card reveal">
              <div className="step-num">2</div>
              <h3>현황 파악</h3>
              <p>
                복잡한 차트 해석 없이, 입력해 둔 목표가 대비 현재 진행 상황을 직관적인 수치와 수익률로 바로
                확인하며 대응합니다.
              </p>
            </div>
            <div className="feature-card reveal">
              <div className="step-num">3</div>
              <h3>습관 형성</h3>
              <p>
                성공과 실패의 이유를 원칙 준수 여부에서 찾으세요. 철저한 복기 기록을 통해 뇌동매매를 방지하고
                성장하는 투자자가 됩니다.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="footer-cta">
        <div className="container">
          <div className="reveal">
            <h2>더 이상 감정에 휘둘리지 마세요.</h2>
            <p>원칙을 지키는 것만으로도 투자는 성공에 가까워집니다.</p>
            <Link
              to="/investor-test"
              className="app-btn-secondary home-page__cta home-page__cta--visible home-page__cta--footer"
            >
              스멘이와 함께 매매 기록 시작하기
            </Link>
          </div>
          <footer>
            <p>© 2026 Stock Mentor. All rights reserved.</p>
          </footer>
        </div>
      </section>
    </div>
  );
}
