import { DogStats } from '@/store/gameStore';

export interface Ending {
  id: string;
  title: string;
  content: string;
  condition: (stats: DogStats) => boolean;
  type: 'happy' | 'sad' | 'neutral' | 'special';
}

// 检查属性是否达到阈值
const isStatHigh = (stat: number) => stat >= 90;
const isStatLow = (stat: number) => stat <= 10;
const isStatBalanced = (stats: DogStats) => {
  const values = Object.values(stats) as number[];
  const avg = values.reduce((a, b) => a + b, 0) / values.length;
  // 修改平衡条件：
  // 1. 所有属性值必须在 30-70 之间
  // 2. 属性值之间的差距不超过 20
  // 3. 至少经历过一次属性变化（通过检查是否有属性值不等于初始值 100）
  const isInRange = values.every(v => v >= 30 && v <= 70);
  const isClose = values.every(v => Math.abs(v - avg) <= 20);
  const hasChanged = values.some(v => v !== 100);
  return isInRange && isClose && hasChanged;
};

export const endings: Ending[] = [
  // 完美结局：所有属性都很高
  {
    id: 'perfect_ending',
    title: '完美的一天',
    content: '你的狗狗度过了完美的一天！它既开心又充满活力，肚子饱饱的。这真是最棒的冒险！',
    condition: (stats) => (Object.values(stats) as number[]).every(isStatHigh),
    type: 'happy',
  },
  
  // 开心结局：心情很高
  {
    id: 'happy_ending',
    title: '快乐的一天',
    content: '你的狗狗今天特别开心！虽然有点累，但它的笑容说明这一切都值得。',
    condition: (stats) => isStatHigh(stats.happiness),
    type: 'happy',
  },
  
  // 活力结局：精力充沛
  {
    id: 'energetic_ending',
    title: '活力四射',
    content: '你的狗狗今天精力充沛，玩得特别尽兴！虽然有点饿，但它的活力感染了周围的每个人。',
    condition: (stats) => isStatHigh(stats.energy) && isStatHigh(stats.happiness),
    type: 'happy',
  },
  
  // 平衡结局：所有属性都很平衡
  {
    id: 'balanced_ending',
    title: '平衡的一天',
    content: '你的狗狗度过了平静而充实的一天。它既不会太累，也不会太饿，心情也很平和。有时候，平衡就是最好的状态。',
    condition: isStatBalanced,
    type: 'neutral',
  },
  
  // 疲惫结局：精力耗尽
  {
    id: 'exhausted_ending',
    title: '疲惫不堪',
    content: '你的狗狗玩得太累了，现在需要好好休息。下次要记得让它适当休息，不要玩得太疯哦。',
    condition: (stats) => isStatLow(stats.energy),
    type: 'sad',
  },
  
  // 饥饿结局：饱食度太低
  {
    id: 'hungry_ending',
    title: '饥肠辘辘',
    content: '你的狗狗玩得太开心，忘记吃东西了。现在它饿得不行，得赶紧回家吃饭了。',
    condition: (stats) => isStatLow(stats.fullness),
    type: 'sad',
  },
  
  // 不开心结局：心情值太低
  {
    id: 'unhappy_ending',
    title: '心情低落',
    content: '你的狗狗今天似乎不太开心，可能是玩得太累了，或者没有遇到喜欢的事情。下次要更注意它的心情哦。',
    condition: (stats) => isStatLow(stats.happiness),
    type: 'sad',
  },
  
  // 特殊结局：极端状态
  {
    id: 'extreme_ending',
    title: '极限体验',
    content: '你的狗狗今天经历了极端的体验！它可能玩得太疯，或者遇到了特别的事情。这种经历让它学到了很多，但也需要好好休息了。',
    condition: (stats) => {
      const values = Object.values(stats) as number[];
      const hasHigh = values.some(isStatHigh);
      const hasLow = values.some(isStatLow);
      return hasHigh && hasLow;
    },
    type: 'special',
  },
];

// 获取当前状态对应的结局
export const getCurrentEnding = (stats: DogStats): Ending | null => {
  // 按优先级排序：特殊结局 > 完美结局 > 其他结局
  const sortedEndings = [...endings].sort((a, b) => {
    if (a.type === 'special') return -1;
    if (b.type === 'special') return 1;
    if (a.id === 'perfect_ending') return -1;
    if (b.id === 'perfect_ending') return 1;
    return 0;
  });

  return sortedEndings.find(ending => ending.condition(stats)) || null;
}; 