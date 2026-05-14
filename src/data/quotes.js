/**
 * 투자 명언 데이터 — 트레이딩 기록장 멘토 Hero용
 * @typedef {{ id: string, quote: string, author: string, category: 'longTerm'|'emotion'|'risk'|'principles', quoteKo?: string }} InvestmentQuote
 */

export const QUOTE_CATEGORY_TABS = [
  { id: 'all', label: '전체' },
  { id: 'longTerm', label: '장기 투자' },
  { id: 'emotion', label: '감정 통제' },
  { id: 'risk', label: '리스크 관리' },
  { id: 'principles', label: '원칙 준수' },
];

/** @type {InvestmentQuote[]} */
export const INVESTMENT_QUOTES = [
  {
    id: 'wb-greedy',
    quote: 'Be fearful when others are greedy and greedy when others are fearful.',
    author: 'Warren Buffett',
    category: 'emotion',
    quoteKo: '남들이 탐욕스러울 때 두려워하고, 남들이 두려워할 때 탐욕스러워하라.',
  },
  {
    id: 'pl-own',
    quote: 'Know what you own, and know why you own it.',
    author: 'Peter Lynch',
    category: 'principles',
    quoteKo: '무엇을 갖고 있는지, 왜 갖고 있는지 알라.',
  },
  {
    id: 'bg-self',
    quote: "The investor's chief problem — and even his worst enemy — is likely to be himself.",
    author: 'Benjamin Graham',
    category: 'emotion',
    quoteKo: '투자자에게 가장 큰 문제는 바로 자기 자신일 가능성이 높다.',
  },
  {
    id: 'jm-time',
    quote: 'The stock market is a device for transferring money from the impatient to the patient.',
    author: 'Warren Buffett',
    category: 'longTerm',
    quoteKo: '주식 시장은 조급한 사람에게서 인내하는 사람으로 돈을 옮기는 장치다.',
  },
  {
    id: 'bg-margin',
    quote: 'The margin of safety is always dependent on the price paid.',
    author: 'Benjamin Graham',
    category: 'risk',
    quoteKo: '안전 마진은 항상 지불한 가격에 달려 있다.',
  },
  {
    id: 'hl-risk',
    quote: 'Risk comes from not knowing what you are doing.',
    author: 'Warren Buffett',
    category: 'risk',
    quoteKo: '리스크는 자기가 무엇을 하고 있는지 모를 때 생긴다.',
  },
  {
    id: 'jm-market',
    quote: 'In the short run, the market is a voting machine, but in the long run it is a weighing machine.',
    author: 'Benjamin Graham',
    category: 'longTerm',
    quoteKo: '단기적으로 시장은 투표기계이지만, 장기적으로는 저울이다.',
  },
  {
    id: 'pl-ten',
    quote: 'Far more money has been lost by investors preparing for corrections than has been lost in corrections themselves.',
    author: 'Peter Lynch',
    category: 'emotion',
    quoteKo: '조정을 대비하다 잃은 돈이, 조정 자체로 잃은 돈보다 훨씬 많다.',
  },
  {
    id: 'wb-price',
    quote: 'Price is what you pay. Value is what you get.',
    author: 'Warren Buffett',
    category: 'principles',
    quoteKo: '가격은 지불하는 것이고, 가치는 얻는 것이다.',
  },
  {
    id: 'ds-plan',
    quote: 'It is not the strongest of the species that survive, nor the most intelligent, but the one most responsive to change.',
    author: 'Charles Darwin (투자에 인용)',
    category: 'longTerm',
    quoteKo:
      '가장 강하거나 똑똑한 종이 살아남는 것이 아니라 변화에 가장 잘 적응하는 종이 살아남는다.',
  },
  {
    id: 'ht-rules',
    quote: 'The four most dangerous words in investing are: “This time it’s different.”',
    author: 'Sir John Templeton',
    category: 'principles',
    quoteKo: '투자에서 가장 위험한 네 단어는 “이번만은 다르다”이다.',
  },
  {
    id: 'rs-process',
    quote: 'We don’t have to be smarter than the rest. We have to be more disciplined than the rest.',
    author: 'Charlie Munger',
    category: 'principles',
    quoteKo: '남보다 똑똑할 필요는 없다. 남보다 규율 있을 필요가 있다.',
  },
  {
    id: 'jm-loss',
    quote: 'The essence of investment management is the management of risks, not the management of returns.',
    author: 'Benjamin Graham',
    category: 'risk',
    quoteKo: '투자 관리의 본질은 수익 관리가 아니라 리스크 관리다.',
  },
  {
    id: 'pl-stories',
    quote: 'Behind every stock is a company. Find out what it’s doing.',
    author: 'Peter Lynch',
    category: 'principles',
    quoteKo: '모든 주식 뒤에는 한 회사가 있다. 그 회사가 무엇을 하는지 알아보라.',
  },
  {
    id: 'wb-forever',
    quote: 'Our favorite holding period is forever.',
    author: 'Warren Buffett',
    category: 'longTerm',
    quoteKo: '우리가 가장 좋아하는 보유 기간은 영원이다.',
  },
  {
    id: 'cm-envy',
    quote: 'Envy is a really stupid sin because it’s the only one you could never have any fun at.',
    author: 'Charlie Munger',
    category: 'emotion',
    quoteKo:
      '질투는 즐거울 수 없는 어리석은 죄다. (남과 비교하지 말라는 투자 교훈으로도 읽힌다.)',
  },
  {
    id: 'ht-diversify',
    quote: 'Diversify. In stocks and bonds, as in much else, there is safety in numbers.',
    author: 'Sir John Templeton',
    category: 'risk',
    quoteKo: '분산하라. 주식과 채권에서도, 다른 많은 일에서도 숫자에 안전이 있다.',
  },
  {
    id: 'ko-park',
    quote: '장기적으로 좋은 회사를 싸게 사는 것이 투자의 전부에 가깝다.',
    author: '투자 멘토 (요지 인용)',
    category: 'longTerm',
  },
  {
    id: 'ko-emotion',
    quote: '시장은 단기적으로 감정의 투표기이니, 감정에 휘둘리지 말고 규칙을 먼저 세워라.',
    author: 'Stock Mentor',
    category: 'emotion',
  },
];

export const DAILY_TIPS = [
  '오늘은 원칙을 다시 점검해보세요.',
  '진입 전 손절가·익절가를 한 줄이라도 적어두면 마음이 가벼워집니다.',
  '뉴스 한 줄에 매매 버튼을 누르기 전에, “내 계획에 있던가?”를 스스로에게 물어보세요.',
  '오늘의 손실 한도를 정했다면, 그 이상은 시장과 싸우지 않는 것이 이깁니다.',
  '잠깐 자리를 비우고 돌아오면, 조급함이 줄어드는 경우가 많습니다.',
  '어제의 나와 오늘의 나를 비교하지 말고, “원칙을 지켰는가”만 비교해보세요.',
];

function hashDay(isoDate) {
  let h = 0;
  for (let i = 0; i < isoDate.length; i += 1) {
    h = (h << 5) - h + isoDate.charCodeAt(i);
    h |= 0;
  }
  return Math.abs(h);
}

/** YYYY-MM-DD 기준으로 하루 동안 같은 팁 */
export function getDailyTipForDate(isoDate = new Date().toISOString().slice(0, 10)) {
  if (!DAILY_TIPS.length) return '';
  const i = hashDay(isoDate) % DAILY_TIPS.length;
  return DAILY_TIPS[i];
}

/**
 * @param {InvestmentQuote[]} quotes
 * @param {string} categoryId
 */
export function filterQuotesByCategory(quotes, categoryId) {
  if (categoryId === 'all') return quotes;
  return quotes.filter((q) => q.category === categoryId);
}
