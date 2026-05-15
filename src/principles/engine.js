import { PROFILE_TYPE_KEYS } from '../investorTest/constants';
import { CARD_KEYS } from './constants';

const { STABLE, GROWTH, AGGRESSIVE } = PROFILE_TYPE_KEYS;

function cloneCards(cards) {
  return cards.map((c) => ({ ...c }));
}

const BASE = {
  [STABLE]: {
    [CARD_KEYS.STOCK_STYLE]:
      '우량주·배당주·대형 인덱스 ETF 중심. 테마주·잡주 비중은 낮게 유지합니다.',
    [CARD_KEYS.ENTRY]:
      '분할 매수(2~3회)로 평단을 나눕니다. 급등 후 추격 매수는 피하고, 계획가 대비 -3% 이내에서만 1차 진입합니다.',
    [CARD_KEYS.TAKE_PROFIT]:
      '익절 기준: +10% 전후에서 1차 익절, 나머지는 +12% 부근에서 정리합니다. 목표 도달 시 욕심보다 원칙을 우선합니다.',
    [CARD_KEYS.STOP_LOSS]:
      '손절 기준: -5% 전후(종목 변동성에 따라 -4% ~ -7% 범위에서 사전 고정). 도달 시 이유를 적고 기계적으로 실행합니다.',
    [CARD_KEYS.POSITION]:
      '단일 종목 최대 15~20%, 섹터 최대 35%. 현금 비중 10% 이상을 기본으로 둡니다.',
    [CARD_KEYS.FORBIDDEN]:
      '전 재산 단일 종목 몰빵, 손절가 없이 보유, 뉴스·단톡방에 끌려 추격 매수, “한 번만”이라며 손절 미루기 금지.',
  },
  [GROWTH]: {
    [CARD_KEYS.STOCK_STYLE]:
      '퀄리티 성장주 + 일부 인덱스. 스토리만 있는 소형주 비중은 제한합니다.',
    [CARD_KEYS.ENTRY]:
      '추세·실적 확인 후 분할 진입. 첫 진입은 계획 금액의 40~50%, 확인 후 추가합니다.',
    [CARD_KEYS.TAKE_PROFIT]:
      '익절 기준: +15% 부근 1차, +20~25%에서 추가 익절. 남은 물량은 추세 이탈 시 정리합니다.',
    [CARD_KEYS.STOP_LOSS]:
      '손절 기준: -8% ~ -10% 또는 전략 무효(실적 가이던스 하향) 시 즉시 재평가 후 손절.',
    [CARD_KEYS.POSITION]:
      '핵심 5~8종, 단일 종목 최대 20~25%. 변동성 큰 종목은 비중을 절반으로 줄입니다.',
    [CARD_KEYS.FORBIDDEN]:
      '손절 없이 물타기만 반복하기, 익절가 없이 “더 오를 것”에만 의존하기, 레버리지로 손실 복구 시도 금지.',
  },
  [AGGRESSIVE]: {
    [CARD_KEYS.STOCK_STYLE]:
      '성장주·모멘텀 일부 허용. 단, 소형·고변동 종목은 포트폴리오의 일부 비중으로만 둡니다.',
    [CARD_KEYS.ENTRY]:
      '진입 전 손절가·익절가를 반드시 메모. 1차 진입은 소액으로 테스트 후 추가합니다.',
    [CARD_KEYS.TAKE_PROFIT]:
      '익절 기준: +20% 부근에서 반드시 분할 익절. 단기 과열 구간에서는 +12%에서도 일부 정리합니다.',
    [CARD_KEYS.STOP_LOSS]:
      '손절 기준: -7% ~ -10% 범위에서 사전 고정(단기는 -3~5%도 검토). 도달 시 감정 개입 없이 실행합니다.',
    [CARD_KEYS.POSITION]:
      '단일 종목 최대 20%, 데이트레이딩 시 하루 최대 손실 한도(예: 자본의 2%)를 정합니다.',
    [CARD_KEYS.FORBIDDEN]:
      '손절가를 멋대로 넓히기, 복수 매매, 수면 부족·음주 후 매매, “한 방” 올인 금지.',
  },
};

const GOAL_APPEND = {
  retirement: ' (목표: 현금흐름) 배당·우량 비중을 조금 더 올리고 거래 빈도는 줄입니다.',
  growth: ' (목표: 자산 증식) 성과가 나는 규칙을 반복하고 손실 규칙을 더 엄격히 지킵니다.',
  learning: ' (목표: 학습) 소액으로 규칙을 검증하고, 검증 전에는 레버리지를 쓰지 않습니다.',
};

const PERIOD_APPEND = {
  short: ' 기간이 짧을수록 손절·익절 범위를 좁히고 포지션 크기를 줄입니다.',
  mid: ' 중기라면 뉴스보다 실적·가격 구조를 기준으로 재진입 여부를 판단합니다.',
  long: ' 장기라면 거래 횟수를 줄이고, 분기마다 원칙 준수 여부만 점검합니다.',
};

const TITLES = {
  [CARD_KEYS.STOCK_STYLE]: '추천 종목 스타일',
  [CARD_KEYS.ENTRY]: '진입 원칙',
  [CARD_KEYS.TAKE_PROFIT]: '익절 원칙',
  [CARD_KEYS.STOP_LOSS]: '손절 원칙',
  [CARD_KEYS.POSITION]: '비중 관리 원칙',
  [CARD_KEYS.FORBIDDEN]: '금지 행동',
};

const ICONS = {
  [CARD_KEYS.STOCK_STYLE]: '📊',
  [CARD_KEYS.ENTRY]: '🚪',
  [CARD_KEYS.TAKE_PROFIT]: '🎯',
  [CARD_KEYS.STOP_LOSS]: '🛡️',
  [CARD_KEYS.POSITION]: '⚖️',
  [CARD_KEYS.FORBIDDEN]: '🚫',
};

const ORDER = [
  CARD_KEYS.STOCK_STYLE,
  CARD_KEYS.ENTRY,
  CARD_KEYS.TAKE_PROFIT,
  CARD_KEYS.STOP_LOSS,
  CARD_KEYS.POSITION,
  CARD_KEYS.FORBIDDEN,
];

/**
 * 규칙 기반 자동 생성 (추후 LLM 응답으로 치환 가능)
 */
export function generatePrincipleCards(profileType, investmentGoal, investmentPeriod) {
  const p = BASE[profileType] ?? BASE[GROWTH];
  const g = GOAL_APPEND[investmentGoal] ?? '';
  const t = PERIOD_APPEND[investmentPeriod] ?? '';

  return ORDER.map((key) => {
    let body = p[key];
    if (key === CARD_KEYS.STOCK_STYLE || key === CARD_KEYS.POSITION) {
      body += g;
    }
    body += t;
    return {
      key,
      title: TITLES[key],
      icon: ICONS[key],
      body,
      enabled: true,
      recommended: true,
      collapsed: false,
    };
  });
}

export function snapshotForBaseline(cards) {
  return cloneCards(cards);
}
