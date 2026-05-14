import { PROFILE_TYPE_KEYS } from '../constants';

const { STABLE, GROWTH, AGGRESSIVE } = PROFILE_TYPE_KEYS;

/**
 * 각 선택지는 안정형/성장형/공격형 점수를 누적한다.
 * 동일 가중(2점)으로 단순·해석 가능하게 유지.
 */
export const INVESTOR_TEST_QUESTIONS = [
  {
    id: 'q1',
    title: '투자한 종목이 하루 만에 -10% 하락했다면?',
    options: [
      { id: 'q1_stop', label: '바로 손절', scores: { [STABLE]: 2, [GROWTH]: 0, [AGGRESSIVE]: 0 } },
      { id: 'q1_wait', label: '조금 더 지켜본다', scores: { [STABLE]: 0, [GROWTH]: 2, [AGGRESSIVE]: 0 } },
      { id: 'q1_avg', label: '추가 매수 고려', scores: { [STABLE]: 0, [GROWTH]: 0, [AGGRESSIVE]: 2 } },
    ],
  },
  {
    id: 'q2',
    title: '더 중요한 것은?',
    options: [
      { id: 'q2_safe', label: '안정성', scores: { [STABLE]: 2, [GROWTH]: 0, [AGGRESSIVE]: 0 } },
      { id: 'q2_bal', label: '적당한 성장', scores: { [STABLE]: 0, [GROWTH]: 2, [AGGRESSIVE]: 0 } },
      { id: 'q2_high', label: '높은 수익률', scores: { [STABLE]: 0, [GROWTH]: 0, [AGGRESSIVE]: 2 } },
    ],
  },
  {
    id: 'q3',
    title: '하루에 주식 앱 확인 빈도는?',
    options: [
      { id: 'q3_rare', label: '거의 안 봄', scores: { [STABLE]: 2, [GROWTH]: 0, [AGGRESSIVE]: 0 } },
      { id: 'q3_some', label: '가끔 확인', scores: { [STABLE]: 0, [GROWTH]: 2, [AGGRESSIVE]: 0 } },
      { id: 'q3_often', label: '계속 확인', scores: { [STABLE]: 0, [GROWTH]: 0, [AGGRESSIVE]: 2 } },
    ],
  },
  {
    id: 'q4',
    title: '선호 투자 기간은?',
    options: [
      { id: 'q4_long', label: '장기 투자', scores: { [STABLE]: 2, [GROWTH]: 0, [AGGRESSIVE]: 0 } },
      { id: 'q4_swing', label: '중기 스윙', scores: { [STABLE]: 0, [GROWTH]: 2, [AGGRESSIVE]: 0 } },
      { id: 'q4_short', label: '단기 매매', scores: { [STABLE]: 0, [GROWTH]: 0, [AGGRESSIVE]: 2 } },
    ],
  },
  {
    id: 'q5',
    title: '감당 가능한 손실 범위는?',
    options: [
      { id: 'q5_5', label: '5% 이하', scores: { [STABLE]: 2, [GROWTH]: 0, [AGGRESSIVE]: 0 } },
      { id: 'q5_10', label: '10% 정도', scores: { [STABLE]: 0, [GROWTH]: 2, [AGGRESSIVE]: 0 } },
      { id: 'q5_15', label: '15% 이상 가능', scores: { [STABLE]: 0, [GROWTH]: 0, [AGGRESSIVE]: 2 } },
    ],
  },
  {
    id: 'q6',
    title: '시장 전체가 불안할 때 나는?',
    options: [
      { id: 'q6_cash', label: '현금 비중을 늘리고 관망한다', scores: { [STABLE]: 2, [GROWTH]: 0, [AGGRESSIVE]: 0 } },
      { id: 'q6_trim', label: '포트폴리오 일부만 조정한다', scores: { [STABLE]: 0, [GROWTH]: 2, [AGGRESSIVE]: 0 } },
      { id: 'q6_buy', label: '낙폭을 기회로 보고 적극 매수한다', scores: { [STABLE]: 0, [GROWTH]: 0, [AGGRESSIVE]: 2 } },
    ],
  },
  {
    id: 'q7',
    title: '투자 판단에 가장 많이 쓰는 정보는?',
    options: [
      { id: 'q7_official', label: '공시·재무제표·책 등 검증된 자료', scores: { [STABLE]: 2, [GROWTH]: 0, [AGGRESSIVE]: 0 } },
      { id: 'q7_mix', label: '뉴스와 재무를 함께 본다', scores: { [STABLE]: 0, [GROWTH]: 2, [AGGRESSIVE]: 0 } },
      { id: 'q7_sns', label: 'SNS·커뮤니티·촉이 많이 간다', scores: { [STABLE]: 0, [GROWTH]: 0, [AGGRESSIVE]: 2 } },
    ],
  },
  {
    id: 'q8',
    title: '계획한 수익이 빨리 났을 때 나는?',
    options: [
      { id: 'q8_take', label: '원칙대로 일부는 바로 확정한다', scores: { [STABLE]: 2, [GROWTH]: 0, [AGGRESSIVE]: 0 } },
      { id: 'q8_plan', label: '목표가를 다시 점검하고 분할한다', scores: { [STABLE]: 0, [GROWTH]: 2, [AGGRESSIVE]: 0 } },
      { id: 'q8_more', label: '더 오를 것 같아 대부분 유지한다', scores: { [STABLE]: 0, [GROWTH]: 0, [AGGRESSIVE]: 2 } },
    ],
  },
  {
    id: 'q9',
    title: '한 종목에 넣을 수 있는 최대 비중은?',
    options: [
      { id: 'q9_low', label: '자산의 10% 미만이 적당하다', scores: { [STABLE]: 2, [GROWTH]: 0, [AGGRESSIVE]: 0 } },
      { id: 'q9_mid', label: '10~20%까지는 가능하다', scores: { [STABLE]: 0, [GROWTH]: 2, [AGGRESSIVE]: 0 } },
      { id: 'q9_high', label: '20% 이상도 감당할 수 있다', scores: { [STABLE]: 0, [GROWTH]: 0, [AGGRESSIVE]: 2 } },
    ],
  },
  {
    id: 'q10',
    title: '손실이 났을 때 가장 먼저 드는 생각은?',
    options: [
      { id: 'q10_rule', label: '미리 정한 손절·규칙부터 확인한다', scores: { [STABLE]: 2, [GROWTH]: 0, [AGGRESSIVE]: 0 } },
      { id: 'q10_why', label: '왜 틀렸는지 원인을 정리한다', scores: { [STABLE]: 0, [GROWTH]: 2, [AGGRESSIVE]: 0 } },
      { id: 'q10_fix', label: '빨리 만회하려 다른 매매를 본다', scores: { [STABLE]: 0, [GROWTH]: 0, [AGGRESSIVE]: 2 } },
    ],
  },
];
