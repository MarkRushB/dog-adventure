import { Item, WeatherType } from '@/types/game';

// 定义道具在不同天气下的效果
interface WeatherEffect {
  energy?: number;
  happiness?: number;
  fullness?: number;
}

interface ItemWithWeatherEffects extends Item {
  weatherEffects?: {
    [key in WeatherType]?: WeatherEffect;
  };
}

export const items: Record<string, ItemWithWeatherEffects> = {
  water_bottle: {
    id: 'water_bottle',
    name: '水壶',
    description: '可以随时给狗狗喝水，恢复体力。',
    effect: {
      energy: 15,
      happiness: 5,
      fullness: 5,
    },
    usage: 'immediate',
    weatherEffects: {
      sunny: { energy: 20, happiness: 10 }, // 晴天喝水更解渴
      rainy: { energy: 10, happiness: 5 },  // 雨天不太需要喝水
      snowy: { energy: 15, happiness: 8 },  // 雪天喝水保持体温
    }
  },
  dog_treat: {
    id: 'dog_treat',
    name: '狗零食',
    description: '美味的狗零食，可以快速恢复饱腹感。',
    effect: {
      happiness: 20,
      fullness: 30,
    },
    usage: 'immediate',
    weatherEffects: {
      rainy: { happiness: 25, fullness: 35 }, // 雨天吃零食更开心
      snowy: { happiness: 25, fullness: 35 }, // 雪天吃零食更开心
    }
  },
  rain_coat: {
    id: 'rain_coat',
    name: '狗狗雨衣',
    description: '下雨天必备，可以保护狗狗不被淋湿，保持温暖。',
    effect: {
      energy: 15,
      happiness: 15,
    },
    usage: 'passive',
    duration: 3,
    weatherEffects: {
      rainy: { energy: 20, happiness: 20 },    // 雨天穿雨衣效果最好
      snowy: { energy: 10, happiness: 10 },    // 雪天穿雨衣也有一定效果
      sunny: { energy: -10, happiness: -15 },  // 晴天穿雨衣会太热
      cloudy: { energy: 5, happiness: 5 },     // 多云天气穿雨衣效果一般
      windy: { energy: 8, happiness: 8 },      // 大风天穿雨衣有一定保暖效果
    }
  },
  warm_jacket: {
    id: 'warm_jacket',
    name: '保暖外套',
    description: '冬天遛狗必备，让狗狗保持温暖。',
    effect: {
      energy: 15,
      happiness: 15,
    },
    usage: 'passive',
    duration: 3,
    weatherEffects: {
      snowy: { energy: 25, happiness: 25 },    // 雪天穿外套效果最好
      rainy: { energy: 15, happiness: 15 },    // 雨天穿外套也有保暖效果
      sunny: { energy: -15, happiness: -20 },  // 晴天穿外套会太热
      cloudy: { energy: 5, happiness: 5 },     // 多云天气穿外套效果一般
      windy: { energy: 20, happiness: 20 },    // 大风天穿外套效果很好
    }
  },
  toy_ball: {
    id: 'toy_ball',
    name: '玩具球',
    description: '可以随时和狗狗玩球，增加互动。',
    effect: {
      energy: -10,
      happiness: 25,
      fullness: -5,
    },
    usage: 'immediate',
    weatherEffects: {
      sunny: { energy: -15, happiness: 30 },   // 晴天玩球更开心但更累
      rainy: { energy: -5, happiness: 15 },    // 雨天不太想玩球
      snowy: { energy: -8, happiness: 35 },    // 雪天玩球特别开心
      cloudy: { energy: -10, happiness: 25 },  // 多云天气正常玩球
      windy: { energy: -12, happiness: 20 },   // 大风天玩球有点累
    }
  },
  dog_bag: {
    id: 'dog_bag',
    name: '拾便袋',
    description: '文明遛狗必备，可以清理狗狗的便便。',
    effect: {
      happiness: 5,
    },
    usage: 'passive',
    duration: 999,
    weatherEffects: {
      rainy: { happiness: 8 },    // 雨天保持环境整洁更重要
      snowy: { happiness: 8 },    // 雪天保持环境整洁更重要
    }
  },
  first_aid_kit: {
    id: 'first_aid_kit',
    name: '急救包',
    description: '可以处理一些小伤口，恢复体力。',
    effect: {
      energy: 30,
      happiness: 10,
    },
    usage: 'immediate',
    weatherEffects: {
      rainy: { energy: 25, happiness: 15 },  // 雨天受伤更难受
      snowy: { energy: 25, happiness: 15 },  // 雪天受伤更难受
    }
  },
  dog_boots: {
    id: 'dog_boots',
    name: '狗狗靴子',
    description: '雪天必备，防止狗狗脚掌受冻。',
    effect: {
      energy: 20,
      happiness: 10,
    },
    usage: 'passive',
    duration: 3,
    weatherEffects: {
      snowy: { energy: 30, happiness: 20 },    // 雪天穿靴子效果最好
      rainy: { energy: 15, happiness: 10 },    // 雨天穿靴子也有一定效果
      sunny: { energy: -10, happiness: -15 },  // 晴天穿靴子会太热
      cloudy: { energy: 5, happiness: 5 },     // 多云天气穿靴子效果一般
      windy: { energy: 10, happiness: 8 },     // 大风天穿靴子有一定保暖效果
    }
  },
  dog_hat: {
    id: 'dog_hat',
    name: '狗狗帽子',
    description: '可以遮阳，防止狗狗中暑。',
    effect: {
      energy: 10,
      happiness: 5,
    },
    usage: 'passive',
    duration: 3,
    weatherEffects: {
      sunny: { energy: 20, happiness: 15 },    // 晴天戴帽子效果最好
      rainy: { energy: -5, happiness: -10 },   // 雨天戴帽子会湿
      snowy: { energy: 15, happiness: 10 },    // 雪天戴帽子有保暖效果
      cloudy: { energy: 5, happiness: 5 },     // 多云天气戴帽子效果一般
      windy: { energy: 8, happiness: 8 },      // 大风天戴帽子有保暖效果
    }
  },
};

// 获取随机道具
export const getRandomItem = (): ItemWithWeatherEffects | null => {
  const itemIds = Object.keys(items);
  const randomIndex = Math.floor(Math.random() * itemIds.length);
  return items[itemIds[randomIndex]];
};

// 根据天气推荐道具
export const getRecommendedItems = (weatherType: string): ItemWithWeatherEffects[] => {
  const recommendations: Record<string, string[]> = {
    sunny: ['water_bottle', 'dog_hat', 'dog_bag'],
    rainy: ['rain_coat', 'dog_bag'],
    snowy: ['warm_jacket', 'dog_boots', 'dog_bag'],
    windy: ['dog_bag', 'first_aid_kit'],
    cloudy: ['dog_bag', 'toy_ball'],
  };

  return (recommendations[weatherType] || [])
    .map(id => items[id])
    .filter(Boolean);
}; 