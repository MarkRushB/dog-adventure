import { create } from 'zustand';
import { WeatherType, Item } from '@/types/game';
import { getNextWeather } from '@/data/weather';
import { items } from '@/data/items';

export interface DogStats {
  happiness: number;  // 快乐值
  energy: number;     // 体力值
  fullness: number;   // 饱腹感
}

interface ItemEffect {
  itemName: string;
  changes: Partial<DogStats>;
}

// 添加排行榜记录类型
interface LeaderboardEntry {
  id: number;
  ownerName: string;
  dogName: string;
  distance: number;
  createdAt: string;
  updatedAt: string;
}

interface GameState {
  dogName: string;
  ownerName: string;  // 添加遛狗人名字
  dogStats: DogStats;
  distance: number;   // 遛狗距离（米）
  currentWeather: WeatherType;  // 当前天气
  inventory: Item[];  // 道具栏
  activeItems: {  // 当前生效的道具
    item: Item;
    remainingTurns: number;
  }[];
  storyHistory: Array<{
    text: string;
    timestamp: number;
    statsChange?: Partial<DogStats>;
    distanceChange?: number;
    weatherChange?: WeatherType;  // 天气变化
    itemUsed?: Item;  // 使用的道具
  }>;
  leaderboard: LeaderboardEntry[];
  turnCount: number;  // 添加回合计数
  setDogName: (name: string) => void;
  setOwnerName: (name: string) => void;  // 添加设置遛狗人名字的函数
  updateStats: (changes: Partial<DogStats>) => Partial<DogStats>;
  addDistance: (meters: number) => void;
  addToHistory: (text: string, statsChange?: Partial<DogStats>, distanceChange?: number, weatherChange?: WeatherType, itemUsed?: Item) => void;
  updateWeather: () => WeatherType;  // 明确指定返回类型
  addItem: (item: Item) => void;  // 添加道具
  useItem: (item: Item) => void;  // 使用道具
  updateActiveItems: () => ItemEffect[];  // 修改返回类型
  resetGame: () => void;
  incrementTurn: () => void;  // 添加回合计数增加方法
  addToLeaderboard: (ownerName: string, dogName: string, distance: number) => Promise<void>;
  fetchLeaderboard: () => Promise<void>;
}

// 属性值的最大和最小值
const STATS_LIMITS = {
  min: 0,
  max: 100,
};

// 计算新的属性值，确保在限制范围内
const calculateNewStat = (current: number, change: number): number => {
  const newValue = current + change;
  return Math.min(Math.max(newValue, STATS_LIMITS.min), STATS_LIMITS.max);
};

// 格式化属性变化文本
const formatStatsChange = (changes: Partial<DogStats>): string => {
  const statsText = {
    happiness: '快乐值',
    energy: '体力值',
    fullness: '饱腹感',
  };

  return Object.entries(changes)
    .map(([key, value]) => {
      const statName = statsText[key as keyof DogStats];
      const sign = value > 0 ? '+' : '';
      return `${statName}${sign}${value}`;
    })
    .join('，');
};

// 获取道具在不同天气下的描述
const getWeatherEffectDescription = (itemName: string, weatherType: WeatherType): string => {
  const descriptions: Record<string, Record<WeatherType, string>> = {
    '狗狗雨衣': {
      sunny: '晴天穿雨衣，狗狗感觉有点热呢...',
      rainy: '雨天穿雨衣，狗狗感觉很舒服！',
      snowy: '雪天穿雨衣，狗狗感觉暖暖的~',
      cloudy: '多云天气穿雨衣，狗狗感觉还不错',
      windy: '大风天穿雨衣，狗狗感觉暖和多了'
    },
    '保暖外套': {
      sunny: '晴天穿外套，狗狗热得直吐舌头...',
      rainy: '雨天穿外套，狗狗感觉暖暖的~',
      snowy: '雪天穿外套，狗狗感觉特别温暖！',
      cloudy: '多云天气穿外套，狗狗感觉刚刚好',
      windy: '大风天穿外套，狗狗感觉暖和多了'
    },
    '狗狗靴子': {
      sunny: '晴天穿靴子，狗狗感觉有点闷热...',
      rainy: '雨天穿靴子，狗狗的小脚丫保持干燥~',
      snowy: '雪天穿靴子，狗狗的小脚丫暖暖的！',
      cloudy: '多云天气穿靴子，狗狗感觉还不错',
      windy: '大风天穿靴子，狗狗的小脚丫暖暖的'
    },
    '狗狗帽子': {
      sunny: '晴天戴帽子，狗狗感觉凉快多了！',
      rainy: '雨天戴帽子，帽子都湿透了...',
      snowy: '雪天戴帽子，狗狗感觉暖暖的~',
      cloudy: '多云天气戴帽子，狗狗感觉还不错',
      windy: '大风天戴帽子，狗狗感觉暖和多了'
    },
    '玩具球': {
      sunny: '晴天玩球，狗狗玩得特别开心！',
      rainy: '雨天玩球，狗狗有点提不起劲...',
      snowy: '雪天玩球，狗狗玩得特别兴奋！',
      cloudy: '多云天气玩球，狗狗玩得很开心~',
      windy: '大风天玩球，狗狗有点累呢'
    },
    '水壶': {
      sunny: '晴天喝水，狗狗感觉特别解渴！',
      rainy: '雨天喝水，狗狗不太渴呢',
      snowy: '雪天喝水，狗狗感觉暖暖的~',
      cloudy: '多云天气喝水，狗狗感觉还不错',
      windy: '大风天喝水，狗狗感觉解渴了'
    },
    '狗零食': {
      sunny: '晴天吃零食，狗狗吃得特别香！',
      rainy: '雨天吃零食，狗狗感觉特别满足~',
      snowy: '雪天吃零食，狗狗吃得特别开心！',
      cloudy: '多云天气吃零食，狗狗吃得很开心',
      windy: '大风天吃零食，狗狗吃得特别香'
    },
    '拾便袋': {
      sunny: '晴天带着拾便袋，狗狗感觉很有安全感~',
      rainy: '雨天带着拾便袋，狗狗感觉特别安心！',
      snowy: '雪天带着拾便袋，狗狗感觉暖暖的~',
      cloudy: '多云天气带着拾便袋，狗狗感觉还不错',
      windy: '大风天带着拾便袋，狗狗感觉特别安心'
    }
  };

  // 如果没有找到对应的描述，返回空字符串而不是默认格式
  return descriptions[itemName]?.[weatherType] || '';
};

export const useGameStore = create<GameState>((set, get) => ({
  dogName: '',
  ownerName: '',  // 添加遛狗人名字初始值
  dogStats: {
    happiness: 100,
    energy: 100,
    fullness: 100,
  },
  distance: 0,
  currentWeather: 'sunny',
  inventory: [],
  activeItems: [],
  storyHistory: [],
  leaderboard: [],
  turnCount: 0,
  
  setDogName: (name) => set({ dogName: name }),
  setOwnerName: (name) => set({ ownerName: name }),  // 添加设置遛狗人名字的函数
  
  updateStats: (changes: Partial<DogStats>): Partial<DogStats> => {
    const state = get();
    const newStats = { ...state.dogStats };
    const activeItems = state.activeItems;
    const totalChanges: Partial<DogStats> = {}; // 用于存储合并后的变化

    // 计算道具效果
    const itemEffects = activeItems.reduce((acc, { item }) => {
      if (item.effect) {
        Object.entries(item.effect).forEach(([key, value]) => {
          acc[key as keyof DogStats] = (acc[key as keyof DogStats] || 0) + value;
        });
      }
      return acc;
    }, {} as Partial<DogStats>);

    // 应用场景变化和道具效果
    Object.entries(changes).forEach(([key, value]) => {
      const statKey = key as keyof DogStats;
      const itemEffect = itemEffects[statKey] || 0;
      const changeAmount = (value || 0) + itemEffect; // 计算合并变化量
      totalChanges[statKey] = changeAmount; // 记录合并变化量
      const newValue = newStats[statKey] + changeAmount;
      newStats[statKey] = calculateNewStat(newStats[statKey], changeAmount);
    });
    
    // 处理只有道具效果而没有场景变化的属性
    Object.entries(itemEffects).forEach(([key, value]) => {
      const statKey = key as keyof DogStats;
      if (totalChanges[statKey] === undefined) { // 如果这个属性没有场景变化
         const changeAmount = value; // 道具效果就是总变化量
         totalChanges[statKey] = changeAmount; // 记录合并变化量
         const newValue = newStats[statKey] + changeAmount;
         newStats[statKey] = calculateNewStat(newStats[statKey], changeAmount);
      }
    });

    set({ dogStats: newStats });
    return totalChanges; // 返回合并后的变化
  },
  
  addDistance: (meters) =>
    set((state) => ({
      distance: state.distance + meters,
    })),
  
  addToHistory: (
    text: string,
    statsChange?: Partial<DogStats>,
    distanceChange?: number,
    weatherChange?: WeatherType,
    itemUsed?: Item,
  ) =>
    set((state) => ({
      storyHistory: [
        ...state.storyHistory,
        {
          text,
          timestamp: Date.now(),
          statsChange,
          distanceChange,
          weatherChange,
          itemUsed,
        },
      ],
    })),
  
  updateWeather: () => {
    const state = get();
    const newWeather = getNextWeather(state.currentWeather);
    // 确保状态更新是同步的
    set((state) => ({ currentWeather: newWeather }));
    return newWeather;
  },

  addItem: (item) =>
    set((state) => ({
      inventory: [...state.inventory, item],
    })),

  useItem: (item) => {
    // 先获取当前状态
    const state = get();
    const newInventory = state.inventory.filter(i => i.id !== item.id);
    const currentWeather = state.currentWeather;
    
    // 获取道具在当前天气下的效果
    const itemWithWeather = items[item.id];
    const weatherEffect = itemWithWeather?.weatherEffects?.[currentWeather];
    const finalEffect = weatherEffect || item.effect;
    
    // 获取道具效果描述
    const effectDescription = getWeatherEffectDescription(item.name, currentWeather);
    
    // 处理道具效果
    if (item.usage === 'passive') {
      // 被动道具：添加到激活道具列表，并记录当前天气
      set({
        inventory: newInventory,
        activeItems: [...state.activeItems, { 
          item: { ...item, effect: finalEffect }, 
          remainingTurns: item.duration || 3 
        }],
      });
    } else {
      // 立即使用道具：直接应用效果
      // 先更新属性
      const newStats = { ...state.dogStats };
      Object.entries(finalEffect).forEach(([key, value]) => {
        const statKey = key as keyof DogStats;
        newStats[statKey] = calculateNewStat(newStats[statKey], value);
      });
      
      // 更新状态
      set({
        inventory: newInventory,
        dogStats: newStats,
        storyHistory: [
          ...state.storyHistory,
          {
            text: `使用了${item.name}\n${effectDescription}`,
            timestamp: Date.now(),
            statsChange: finalEffect,
            distanceChange: 0,
            weatherChange: undefined,
            itemUsed: item,
          },
        ],
      });
    }
  },

  updateActiveItems: () => {
    const state = get();
    const effects: ItemEffect[] = [];
    const currentWeather = state.currentWeather;
    
    const updatedItems = state.activeItems
      .map(({ item, remainingTurns }) => {
        // 获取道具在当前天气下的效果
        const itemWithWeather = items[item.id];
        const weatherEffect = itemWithWeather?.weatherEffects?.[currentWeather];
        const finalEffect = weatherEffect || item.effect;
        
        // 获取道具效果描述
        const effectDescription = getWeatherEffectDescription(item.name, currentWeather);
        
        // 收集道具效果
        if (finalEffect) {
          effects.push({
            itemName: `${item.name}\n${effectDescription}`,
            changes: finalEffect
          });
        }
        return {
          item: { ...item, effect: finalEffect },
          remainingTurns: remainingTurns - 1,
        };
      })
      .filter(({ remainingTurns }) => remainingTurns > 0);

    set({ activeItems: updatedItems });
    return effects;
  },
  
  resetGame: () => {
    // 添加调试日志
    console.log('Resetting game state:', {
      beforeReset: {
        inventory: get().inventory,
        activeItems: get().activeItems
      }
    });

    set({
      dogName: '',
      ownerName: '',
      dogStats: {
        happiness: 100,
        energy: 100,
        fullness: 100,
      },
      distance: 0,
      currentWeather: 'sunny',
      inventory: [],
      activeItems: [],
      storyHistory: [],
      turnCount: 0,
    });

    // 添加调试日志
    console.log('Game state reset:', {
      afterReset: {
        inventory: get().inventory,
        activeItems: get().activeItems
      }
    });
  },

  incrementTurn: () => set((state) => ({ turnCount: state.turnCount + 1 })),  // 增加回合计数

  addToLeaderboard: async (ownerName: string, dogName: string, distance: number) => {
    try {
      // 调用 API 添加记录
      const response = await fetch('/api/leaderboard', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ownerName, dogName, distance }),
      });

      if (!response.ok) {
        throw new Error('添加排行榜记录失败');
      }

      // 重新获取排行榜数据
      await get().fetchLeaderboard();
    } catch (error) {
      console.error('Error adding to leaderboard:', error);
    }
  },

  fetchLeaderboard: async () => {
    try {
      const response = await fetch('/api/leaderboard');
      if (!response.ok) {
        throw new Error('获取排行榜数据失败');
      }
      const entries = await response.json();
      set({ leaderboard: entries });
    } catch (error) {
      console.error('Error fetching leaderboard:', error);
    }
  },
})); 