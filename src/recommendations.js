import { products, getProductById } from './products.js';
import { AGE_BUCKETS } from './utils/ageBucket.js';

const RULES = Object.freeze({
  [AGE_BUCKETS.TWENTIES]: ['direct-travel', 'medical-indemnity', 'direct-driver', 'direct-dental'],
  [AGE_BUCKETS.THIRTIES]: ['direct-driver', 'medical-indemnity', 'direct-fire', 'direct-dental'],
  [AGE_BUCKETS.FORTIES]: ['direct-cancer', 'comprehensive-health', 'direct-driver', 'direct-fire'],
  [AGE_BUCKETS.FIFTIES]: ['comprehensive-health', 'direct-cancer', 'direct-fire', 'direct-dental'],
  [AGE_BUCKETS.SIXTIES_PLUS]: ['senior-care', 'comprehensive-health', 'direct-cancer', 'direct-fire'],
  [AGE_BUCKETS.UNKNOWN]: ['direct-cancer', 'direct-driver', 'direct-fire'],
});

const FEMALE_INSERT_AFTER_HEALTH = Object.freeze([
  AGE_BUCKETS.TWENTIES,
  AGE_BUCKETS.THIRTIES,
  AGE_BUCKETS.FORTIES,
  AGE_BUCKETS.FIFTIES,
]);

const RECOMMENDATION_REASONS = Object.freeze({
  'direct-travel': {
    [AGE_BUCKETS.TWENTIES]: '20대는 여행과 이동 계획이 많아질 수 있어, 여행 중 생길 수 있는 변수를 준비하는 상품으로 추천합니다.',
    default: ({ ageLabel }) => `${ageLabel}에서도 여행 일정이 있다면 출발 전에 함께 확인하기 좋은 상품입니다.`,
  },
  'direct-driver': {
    [AGE_BUCKETS.TWENTIES]: '20대는 운전을 시작하거나 이동 범위가 넓어지는 경우가 많아, 운전 중 사고 이후 필요한 준비를 위해 추천합니다.',
    [AGE_BUCKETS.THIRTIES]: '30대는 출퇴근과 일상 이동으로 운전 시간이 늘어날 수 있어, 운전자 상품을 함께 추천합니다.',
    [AGE_BUCKETS.FORTIES]: '40대는 가족 이동과 업무 이동이 함께 늘어날 수 있어, 운전 중 생길 수 있는 상황을 준비하는 상품으로 추천합니다.',
    default: ({ ageLabel }) => `${ageLabel}에서도 운전이나 차량 이동이 잦다면 함께 확인하기 좋은 상품입니다.`,
  },
  'direct-dental': {
    [AGE_BUCKETS.TWENTIES]: '20대는 바쁜 일정으로 치과 관리를 미루기 쉬워, 치과 치료 부담을 살펴볼 수 있는 상품으로 추천합니다.',
    [AGE_BUCKETS.THIRTIES]: '30대는 일상 관리와 치료 일정이 함께 늘어날 수 있어, 치아 상품을 함께 추천합니다.',
    default: ({ ageLabel }) => `${ageLabel}에서는 치과 치료와 구강 관리 비용을 함께 살펴볼 수 있어 추천합니다.`,
  },
  'medical-indemnity': {
    [AGE_BUCKETS.TWENTIES]: '20대는 병원 이용이나 갑작스러운 치료비 부담을 먼저 준비해두면 좋아, 실손의료보험을 함께 추천합니다.',
    [AGE_BUCKETS.THIRTIES]: '30대는 일상 의료비와 가족 생활비를 함께 고려할 시기라, 실제 부담한 의료비를 살펴볼 수 있는 실손의료보험을 추천합니다.',
    default: ({ ageLabel }) => `${ageLabel}에서 병원비 부담을 기본으로 준비하고 싶을 때 함께 확인하기 좋은 상품입니다.`,
  },
  'direct-cancer': {
    [AGE_BUCKETS.FORTIES]: '40대부터는 주요 질병 대비를 더 구체적으로 살펴볼 수 있어, 암 상품을 우선 추천합니다.',
    [AGE_BUCKETS.FIFTIES]: '50대는 주요 질병 보장을 더 꼼꼼히 확인하는 경우가 많아, 암 상품을 우선 추천합니다.',
    [AGE_BUCKETS.SIXTIES_PLUS]: '60대 이상은 주요 질병 보장을 먼저 살펴보는 경우가 많아, 암 상품을 함께 추천합니다.',
    default: () => '건강 보장을 먼저 살펴보고 싶을 때 기본으로 확인하기 좋은 상품입니다.',
  },
  'signature-women-health': {
    default: () => '여성으로 선택되어 여성 질환과 여성암 관련 보장을 함께 살펴볼 수 있어 추천합니다.',
  },
  'direct-fire': {
    [AGE_BUCKETS.TWENTIES]: '20대는 자취·독립·이사처럼 주거 환경이 바뀔 수 있어, 생활 공간을 위한 화재 상품을 추천합니다.',
    [AGE_BUCKETS.THIRTIES]: '30대는 주거 공간과 생활 자산이 늘어나는 시기라, 주택화재 상품을 함께 추천합니다.',
    [AGE_BUCKETS.FORTIES]: '40대는 가족 생활 공간을 안정적으로 관리해야 하는 경우가 많아, 화재·생활위험 상품을 추천합니다.',
    default: ({ ageLabel }) => `${ageLabel}에서는 거주 공간의 화재와 생활위험을 함께 살펴볼 수 있어 추천합니다.`,
  },
  'comprehensive-health': {
    [AGE_BUCKETS.FORTIES]: '40대부터는 암·뇌·심장 같은 주요 질병을 함께 살펴볼 필요가 커져, 종합 건강 상품을 추천합니다.',
    [AGE_BUCKETS.FIFTIES]: '50대는 여러 건강 위험을 한 번에 점검하고 싶은 경우가 많아, 종합 건강 상품을 우선 추천합니다.',
    [AGE_BUCKETS.SIXTIES_PLUS]: '60대 이상은 주요 건강 위험을 폭넓게 살펴볼 수 있어, 종합 건강 상품을 우선 추천합니다.',
    default: ({ ageLabel }) => `${ageLabel}에서 건강 보장을 폭넓게 보고 싶을 때 함께 확인하기 좋은 상품입니다.`,
  },
  'senior-care': {
    [AGE_BUCKETS.SIXTIES_PLUS]: '60대 이상은 치료 이후의 간병비와 가족 부담까지 함께 생각하게 되는 시기라, 노후 간병 준비를 살펴볼 수 있는 상품으로 추천합니다.',
    default: ({ ageLabel }) => `${ageLabel}에서 간병비와 장기 치료 이후 생활 부담을 함께 살펴보고 싶을 때 추천합니다.`,
  },
  'direct-golf': {
    default: () => '골프 활동을 한다면 라운딩 중 생길 수 있는 비용성 상황을 준비할 수 있어 추천합니다.',
  },
});

function unique(ids) {
  return [...new Set(ids)];
}

function normalizeGender(gender) {
  if (gender === 'female' || gender === 'male') return gender;
  return 'unknown';
}

function resolveReason(template, context) {
  return typeof template === 'function' ? template(context) : template;
}

export function recommend(profile) {
  const ageBucket = profile?.ageBucket || AGE_BUCKETS.UNKNOWN;
  const gender = normalizeGender(profile?.apparentGender || profile?.gender);
  let ids = [...(RULES[ageBucket] || RULES[AGE_BUCKETS.UNKNOWN])];

  if (gender === 'female' && FEMALE_INSERT_AFTER_HEALTH.includes(ageBucket)) {
    ids = ['signature-women-health', ...ids];
  }

  if (gender !== 'female') {
    ids = ids.filter((id) => getProductById(id)?.genderSpecific !== 'female');
  }

  const output = unique(ids)
    .map(getProductById)
    .filter(Boolean)
    .slice(0, 4);

  if (output.length < 2) {
    const fillers = products.filter((product) => !output.some((item) => item.id === product.id) && product.genderSpecific !== 'female');
    return [...output, ...fillers].slice(0, 2);
  }

  return output;
}

export function recommendationReason(product, profile) {
  const ageBucket = profile?.ageBucket || AGE_BUCKETS.UNKNOWN;
  const ageLabel = profile?.ageBucketLabel || '현재 연령대';
  const templates = RECOMMENDATION_REASONS[product.id];
  const template = templates?.[ageBucket] || templates?.default;

  if (template) {
    return resolveReason(template, { ageBucket, ageLabel, product });
  }

  return `${ageLabel}에서 ${product.category} 상품을 함께 살펴볼 수 있어 추천합니다.`;
}
