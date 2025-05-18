import { Weather, WeatherType } from '@/types/game';

export const weathers: Record<WeatherType, Weather> = {
  sunny: {
    type: 'sunny',
    name: '晴天',
    description: '阳光明媚，是个遛狗的好天气！',
    effect: {
      energy: -5,  // 天气热，体力消耗更快
      happiness: 5,  // 阳光让人心情好
    },
    eventProbability: {
      water_break: 0.3,    // 更容易口渴
      play_ball: 0.4,      // 更容易想玩球
      meet_other_dog: 0.3, // 其他主人也喜欢带狗出来
      rain_start: 0,       // 不会下雨
      snow_start: 0,       // 不会下雪
    },
  },
  rainy: {
    type: 'rainy',
    name: '雨天',
    description: '下着小雨，地面有点湿滑...',
    effect: {
      energy: -10,   // 雨天走路更累
      happiness: -10, // 雨天心情不好
    },
    eventProbability: {
      water_break: 0.1,    // 不需要喝水
      play_ball: 0.1,      // 不想玩球
      meet_other_dog: 0.1, // 其他狗主人在家
      rain_start: 0.8,     // 更容易继续下雨
      snow_start: 0,       // 不会下雪
    },
  },
  cloudy: {
    type: 'cloudy',
    name: '多云',
    description: '天气凉爽，很适合遛狗。',
    effect: {
      energy: 0,     // 正常消耗
      happiness: 0,  // 正常心情
    },
    eventProbability: {
      water_break: 0.2,    // 正常口渴
      play_ball: 0.3,      // 正常想玩
      meet_other_dog: 0.3, // 正常遇到其他狗
      rain_start: 0.2,     // 可能下雨
      snow_start: 0,       // 不会下雪
    },
  },
  windy: {
    type: 'windy',
    name: '大风',
    description: '风有点大，树叶沙沙作响...',
    effect: {
      energy: -15,   // 逆风走路更累
      happiness: -5,  // 风大有点烦
    },
    eventProbability: {
      water_break: 0.2,    // 正常口渴
      play_ball: 0.1,      // 风大不想玩球
      meet_other_dog: 0.2, // 其他狗主人在家
      rain_start: 0.3,     // 可能下雨
      snow_start: 0,       // 不会下雪
    },
  },
  snowy: {
    type: 'snowy',
    name: '雪天',
    description: '下着雪，地面有点滑...',
    effect: {
      energy: -20,   // 雪地走路很累
      happiness: 15,  // 玩雪很开心
    },
    eventProbability: {
      water_break: 0.1,    // 不需要喝水
      play_ball: 0.5,      // 很想玩雪球
      meet_other_dog: 0.2, // 其他狗主人在家
      rain_start: 0,       // 不会下雨
      snow_start: 0.8,     // 更容易继续下雪
    },
  },
};

// 获取随机天气
export const getRandomWeather = (): WeatherType => {
  const weatherTypes = Object.keys(weathers) as WeatherType[];
  const weights = [0.4, 0.2, 0.2, 0.1, 0.1]; // 晴天40%，雨天20%，多云20%，大风10%，雪天10%
  
  const random = Math.random();
  let sum = 0;
  
  for (let i = 0; i < weights.length; i++) {
    sum += weights[i];
    if (random < sum) {
      return weatherTypes[i];
    }
  }
  
  return 'sunny'; // 默认晴天
};

// 根据当前天气获取下一个天气
export const getNextWeather = (currentWeather: WeatherType): WeatherType => {
  const weatherTypes = Object.keys(weathers) as WeatherType[];
  const currentWeatherData = weathers[currentWeather];
  
  // 根据当前天气的事件概率决定是否改变天气
  if (currentWeather === 'rainy' && Math.random() < 0.3) {
    return 'cloudy'; // 雨停转多云
  }
  if (currentWeather === 'snowy' && Math.random() < 0.3) {
    return 'cloudy'; // 雪停转多云
  }
  if (currentWeather === 'sunny' && Math.random() < 0.2) {
    return 'cloudy'; // 晴天转多云
  }
  if (currentWeather === 'cloudy') {
    if (Math.random() < 0.2) return 'rainy';
    if (Math.random() < 0.1) return 'windy';
    if (Math.random() < 0.05) return 'snowy';
    if (Math.random() < 0.3) return 'sunny';
  }
  if (currentWeather === 'windy' && Math.random() < 0.4) {
    return 'cloudy'; // 风停转多云
  }
  
  return currentWeather; // 保持当前天气
}; 