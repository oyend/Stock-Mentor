import { PROFILE_TYPE_KEYS } from '../constants';

const { STABLE, GROWTH, AGGRESSIVE } = PROFILE_TYPE_KEYS;

/**
 * 성향별 결과 카피 (추천 원칙)
 * 추후 AI 생성 문구로 치환 시 이 객체를 보강하거나 API 응답으로 merge하면 된다.
 */
export const INVESTOR_TEST_RESULTS = {
  [STABLE]: {
    headline: '당신은 안정형 투자자입니다.',
    description:
      '원금 보존과 예측 가능한 흐름을 중시하며, 급격한 변동보다 꾸준한 방어에 가깝습니다. 감정적 결정을 줄이고 규칙을 지키는 것이 강점입니다.',
    recommendedStyle: '우량·배당 중심, 분산 투자, 인덱스/ETF 비중 확대',
    stopLossRule: '개별 종목 기준 -5% ~ -7% 이내에서 원칙적으로 손절',
    takeProfitRule: '+8% ~ +12% 구간에서 분할 익절로 심리적 안정 확보',
    investmentMethod: '월 적립식 + 리밸런싱(연 1~2회). 뉴스·채팅방보다 사업 보고서·현금흐름 위주로 점검',
  },
  [GROWTH]: {
    headline: '당신은 성장형 투자자입니다.',
    description:
      '적당한 리스크를 감수하며 성장 가능성을 추구하는 스타일입니다. 기회와 방어의 균형을 맞추면 장기적으로 가장 설득력 있는 궤적을 그릴 수 있습니다.',
    recommendedStyle: '성장주 + 퀄리티 밸런스, 섹터 분산, 핵심 5~8종 집중',
    stopLossRule: '포지션당 -8% ~ -10% 또는 전략 무효 시점(실적·가이던스 이탈)에서 손절',
    takeProfitRule: '+15% ~ +25% 구간 1차 익절, 나머지는 추세·목표가 재설정',
    investmentMethod: '스윙·분기 실적 시즌 중심 점검. 매매일지로 “계획 대비 실행”을 기록하는 것을 권장',
  },
  [AGGRESSIVE]: {
    headline: '당신은 공격형 투자자입니다.',
    description:
      '높은 변동성과 수익 기회를 적극적으로 탐색하는 경향이 있습니다. 수익과 함께 리스크 관리 규칙을 명문화하지 않으면 심리적 낙폭이 커질 수 있습니다.',
    recommendedStyle: '모멘텀·테마·고베타 비중 가능, 단 포지션 크기·레버리지 상한선 필수',
    stopLossRule: '진입 전 손절가 고정. 단기는 -3% ~ -5%, 스윙은 -7% ~ -10% 중 택일 후 기계적 실행',
    takeProfitRule: '목표 수익 도달 시 반드시 분할 청산. 추격 매수 금지 룰을 사전에 적어 두기',
    investmentMethod: '데이·스윙 모두 가능하나 “하루 최대 손실 한도”와 “일일 매매 횟수 상한”을 먼저 정할 것',
  },
};
