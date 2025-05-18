export type WeatherType = 'sunny' | 'rainy' | 'cloudy' | 'windy' | 'snowy';

export interface Weather {
  type: WeatherType;
  name: string;
  description: string;
  effect: {
    energy?: number;
    happiness?: number;
    fullness?: number;
  };
  eventProbability: {
    [key: string]: number;  // 影响不同事件出现的概率
  };
}

export interface Item {
  id: string;
  name: string;
  description: string;
  effect: {
    energy?: number;
    happiness?: number;
    fullness?: number;
  };
  usage: 'immediate' | 'passive';  // 立即使用或被动效果
  duration?: number;  // 被动效果持续时间（回合数）
}

export interface Scene {
  id: string;
  title: string;
  content: string;
  choices: {
    text: string;
    nextScene: string;
    effect?: {
      happiness?: number;
      energy?: number;
      fullness?: number;
    };
    distanceChange?: number;  // 新增：距离变化
    randomOutcome?: string;  // 新增：随机结果类型
    requiredItem?: string;  // 需要的道具
    weatherCondition?: WeatherType[];  // 特定天气才能触发
  }[];
  getRandomContent?: () => {  // 新增：随机内容生成器
    content: string;
    effect: {
      happiness: number;
      energy: number;
      fullness: number;
    };
  };
  weatherProbability?: number;  // 在特定天气下出现的概率
} 