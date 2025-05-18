import { Scene } from '@/types/game';

// 随机结果生成器
const getRandomResult = (min: number, max: number): number => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

// 随机事件结果
const randomOutcomes = {
  // 喝水可能的结果
  water: [
    { text: '狗狗喝得很开心！', effect: { energy: 15, happiness: 10, fullness: 5 } },
    { text: '水有点凉，狗狗不太喜欢...', effect: { energy: 5, happiness: -5, fullness: 0 } },
    { text: '狗狗喝得太急，呛到了！', effect: { energy: -5, happiness: -10, fullness: 0 } },
  ],
  // 玩耍可能的结果
  play: [
    { text: '玩得很尽兴！', effect: { energy: -15, happiness: 25, fullness: -10 } },
    { text: '玩得有点累...', effect: { energy: -25, happiness: 15, fullness: -15 } },
    { text: '玩得太兴奋，有点失控！', effect: { energy: -30, happiness: 30, fullness: -20 } },
  ],
  // 休息可能的结果
  rest: [
    { text: '休息得很好！', effect: { energy: 25, happiness: 5, fullness: -5 } },
    { text: '休息时遇到其他狗狗，有点兴奋...', effect: { energy: 15, happiness: 15, fullness: -10 } },
    { text: '休息时被蚊子咬了，有点烦躁...', effect: { energy: 10, happiness: -10, fullness: -5 } },
  ],
  // 遇到其他狗狗可能的结果
  meetDog: [
    // 遇到小琳达的结果
    { 
      text: '这只可爱的黄色短腿长毛小狗狗很友好，两只狗狗玩得很开心！', 
      effect: { energy: -15, happiness: 25, fullness: -10 },
      dog: '小琳达'
    },
    { 
      text: '这只小短腿狗狗蹦蹦跳跳的样子特别可爱，主人还给了零食！', 
      effect: { energy: 5, happiness: 20, fullness: 15 },
      dog: '小琳达'
    },
    // 遇到大辛巴的结果
    { 
      text: '这只威武的黑色拉布拉多看起来很友好，两只狗狗玩得很开心！', 
      effect: { energy: -15, happiness: 25, fullness: -10 },
      dog: '大辛巴'
    },
    { 
      text: '这只黑色拉布拉多突然变得很凶，它的体型让其他狗狗都害怕！', 
      effect: { energy: -20, happiness: -30, fullness: -15 },
      dog: '大辛巴'
    },
    { 
      text: '这只黑色拉布拉多被主人及时制止了，但你的狗狗还是有点害怕...', 
      effect: { energy: -10, happiness: -15, fullness: -5 },
      dog: '大辛巴'
    },
    // 遇到小古币的结果
    { 
      text: '这只可爱的白色迷你贵宾犬很友好，两只狗狗玩得很开心！', 
      effect: { energy: -15, happiness: 25, fullness: -10 },
      dog: '小古币'
    },
    { 
      text: '这只白色贵宾犬优雅的样子特别讨人喜欢，主人还给了零食！', 
      effect: { energy: 5, happiness: 20, fullness: 15 },
      dog: '小古币'
    },
    // 遇到大格里菲的结果
    { 
      text: '这只优雅的灰黑色伯恩山贵宾很友好，两只狗狗玩得很开心！', 
      effect: { energy: -15, happiness: 25, fullness: -10 },
      dog: '大格里菲'
    },
    { 
      text: '这只灰黑色伯恩山贵宾的毛发特别漂亮，主人还给了零食！', 
      effect: { energy: 5, happiness: 20, fullness: 15 },
      dog: '大格里菲'
    },
    // 遇到中佳玛的结果
    { 
      text: '这只活泼的哈士奇玩得太疯了，你的狗狗累得不行！', 
      effect: { energy: -35, happiness: 30, fullness: -20 },
      dog: '中佳玛'
    },
    { 
      text: '这只哈士奇玩得太兴奋，你的狗狗有点跟不上它的节奏...', 
      effect: { energy: -30, happiness: 20, fullness: -15 },
      dog: '中佳玛'
    },
  ],
  // 追猫咪可能的结果
  chaseCat: [
    { text: '追到猫咪了！但被挠了一下...', effect: { energy: -30, happiness: 20, fullness: -25 } },
    { text: '猫咪跑得太快，没追上...', effect: { energy: -20, happiness: -10, fullness: -15 } },
    { text: '猫咪跳上墙，狗狗够不着...', effect: { energy: -15, happiness: 5, fullness: -10 } },
  ],
};

export const scenes: Record<string, Scene> = {
  start: {
    id: 'start',
    title: '开始遛狗',
    content: '准备好遛狗了吗？让我们出发吧！',
    choices: [
      {
        text: '出发！',
        nextScene: 'random_event',
        effect: {
          energy: -5,
          happiness: 10,
        },
        distanceChange: 50,
      },
    ],
  },

  random_event: {
    id: 'random_event',
    title: '遛狗路上',
    content: '继续前进...',
    choices: [
      {
        text: '继续前进',
        nextScene: 'random_event',
        effect: {
          energy: -10,
          happiness: 5,
          fullness: -5,
        },
        distanceChange: 100,
      },
      {
        text: '休息一下',
        nextScene: 'rest_result',
        effect: {
          energy: 0,  // 实际效果由随机结果决定
          happiness: 0,
          fullness: 0,
        },
        distanceChange: 0,
        randomOutcome: 'rest',  // 使用随机结果
      },
    ],
  },

  // 随机结果场景
  rest_result: {
    id: 'rest_result',
    title: '休息时间',
    content: '找个地方休息一下...',
    choices: [
      {
        text: '继续前进',
        nextScene: 'random_event',
        effect: {
          energy: -5,
          happiness: 5,
          fullness: -5,
        },
        distanceChange: 50,
      },
    ],
    getRandomContent: () => {
      const outcomes = randomOutcomes.rest;
      const result = outcomes[Math.floor(Math.random() * outcomes.length)];
      return {
        content: result.text,
        effect: result.effect,
      };
    },
  },

  // 随机事件场景
  meet_other_dog: {
    id: 'meet_other_dog',
    title: '遇到其他狗狗',
    content: '远处看到一只狗狗，让我们走近看看是谁呢？',
    choices: [
      {
        text: '过去看看',
        nextScene: 'meet_dog_result',
        effect: {
          energy: 0,  // 实际效果由随机结果决定
          happiness: 0,
          fullness: 0,
        },
        distanceChange: 30,
        randomOutcome: 'meetDog',  // 使用随机结果
      },
      {
        text: '绕道而行',
        nextScene: 'random_event',
        effect: {
          energy: -5,
          happiness: -10,
          fullness: -5,
        },
        distanceChange: 80,
      },
    ],
  },

  meet_dog_result: {
    id: 'meet_dog_result',
    title: '遇到其他狗狗',
    content: '...',
    choices: [
      {
        text: '继续前进',
        nextScene: 'random_event',
        effect: {
          energy: -5,
          happiness: 5,
          fullness: -5,
        },
        distanceChange: 50,
      },
    ],
    getRandomContent: () => {
      const outcomes = randomOutcomes.meetDog;
      
      // 根据不同的狗狗设置不同的权重
      const dogWeights: Record<string, number[]> = {
        '小琳达': [0.7, 0.3],  // 70%概率玩得开心，30%概率获得零食
        '大辛巴': [0.2, 0.6, 0.2],  // 20%友好，60%凶悍，20%被制止
        '小古币': [0.7, 0.3],  // 70%概率玩得开心，30%概率获得零食
        '大格里菲': [0.7, 0.3],  // 70%概率玩得开心，30%概率获得零食
        '中佳玛': [0.6, 0.4],  // 60%概率玩得太疯，40%概率跟不上节奏
      };

      // 随机选择一只狗狗
      const dogs = Object.keys(dogWeights);
      const selectedDog = dogs[Math.floor(Math.random() * dogs.length)];
      
      // 获取这只狗狗的所有可能结果
      const dogOutcomes = outcomes.filter(outcome => outcome.dog === selectedDog);
      const weights = dogWeights[selectedDog];
      
      // 根据权重选择结果
      const random = Math.random();
      let sum = 0;
      let selectedIndex = 0;
      
      for (let i = 0; i < weights.length; i++) {
        sum += weights[i];
        if (random < sum) {
          selectedIndex = i;
          break;
        }
      }
      
      const result = dogOutcomes[selectedIndex];
      // 修改文案，添加"啊，原来是xxx"的开头，但不包含玩家名字
      const newContent = `啊，原来是${selectedDog}！${result.text}`;
      return {
        content: newContent,
        effect: result.effect,
        skipPlayerName: true  // 添加标记，表示这个场景不需要显示玩家名字
      };
    },
  },

  water_break: {
    id: 'water_break',
    title: '喝水时间',
    content: '发现一个水龙头，可以给狗狗喝水。',
    choices: [
      {
        text: '喝点水',
        nextScene: 'water_result',
        effect: {
          energy: 0,  // 实际效果由随机结果决定
          happiness: 0,
          fullness: 0,
        },
        distanceChange: 30,
        randomOutcome: 'water',  // 使用随机结果
      },
      {
        text: '继续前进',
        nextScene: 'random_event',
        effect: {
          energy: -10,
          happiness: -5,
          fullness: -10,
        },
        distanceChange: 100,
      },
    ],
  },

  water_result: {
    id: 'water_result',
    title: '喝水时间',
    content: '...',
    choices: [
      {
        text: '继续前进',
        nextScene: 'random_event',
        effect: {
          energy: -5,
          happiness: 5,
          fullness: -5,
        },
        distanceChange: 50,
      },
    ],
    getRandomContent: () => {
      const outcomes = randomOutcomes.water;
      const result = outcomes[Math.floor(Math.random() * outcomes.length)];
      return {
        content: result.text,
        effect: result.effect,
      };
    },
  },

  play_ball: {
    id: 'play_ball',
    title: '玩球时间',
    content: '发现一个球！要不要玩一会？',
    choices: [
      {
        text: '玩球',
        nextScene: 'play_result',
        effect: {
          energy: 0,  // 实际效果由随机结果决定
          happiness: 0,
          fullness: 0,
        },
        distanceChange: 20,
        randomOutcome: 'play',  // 使用随机结果
      },
      {
        text: '继续前进',
        nextScene: 'random_event',
        effect: {
          energy: -5,
          happiness: -5,
          fullness: -5,
        },
        distanceChange: 100,
      },
    ],
  },

  play_result: {
    id: 'play_result',
    title: '玩球时间',
    content: '...',
    choices: [
      {
        text: '继续前进',
        nextScene: 'random_event',
        effect: {
          energy: -5,
          happiness: 5,
          fullness: -5,
        },
        distanceChange: 50,
      },
    ],
    getRandomContent: () => {
      const outcomes = randomOutcomes.play;
      const result = outcomes[Math.floor(Math.random() * outcomes.length)];
      return {
        content: result.text,
        effect: result.effect,
      };
    },
  },

  meet_cat: {
    id: 'meet_cat',
    title: '遇到猫咪',
    content: '路上遇到一只猫咪！',
    choices: [
      {
        text: '追猫咪',
        nextScene: 'chase_cat_result',
        effect: {
          energy: 0,  // 实际效果由随机结果决定
          happiness: 0,
          fullness: 0,
        },
        distanceChange: 200,
        randomOutcome: 'chaseCat',  // 使用随机结果
      },
      {
        text: '绕道而行',
        nextScene: 'random_event',
        effect: {
          energy: -5,
          happiness: -10,
          fullness: -5,
        },
        distanceChange: 50,
      },
    ],
  },

  chase_cat_result: {
    id: 'chase_cat_result',
    title: '追猫咪',
    content: '...',
    choices: [
      {
        text: '继续前进',
        nextScene: 'random_event',
        effect: {
          energy: -5,
          happiness: 5,
          fullness: -5,
        },
        distanceChange: 50,
      },
    ],
    getRandomContent: () => {
      const outcomes = randomOutcomes.chaseCat;
      const result = outcomes[Math.floor(Math.random() * outcomes.length)];
      return {
        content: result.text,
        effect: result.effect,
      };
    },
  },

  // 特殊事件
  rain_start: {
    id: 'rain_start',
    title: '开始下雨',
    content: '突然开始下雨了！',
    choices: [
      {
        text: '找个地方躲雨',
        nextScene: 'rest',
        effect: {
          energy: 10,
          happiness: -15,
          fullness: -5,
        },
        distanceChange: 0,
      },
      {
        text: '冒雨前进',
        nextScene: 'random_event',
        effect: {
          energy: -20,
          happiness: -20,
          fullness: -10,
        },
        distanceChange: 150,
      },
    ],
  },
};

// 随机事件列表
export const randomEvents = [
  'meet_other_dog',
  'water_break',
  'play_ball',
  'rain_start',
  'meet_cat',
];

// 获取随机事件
export const getRandomEvent = (): string => {
  const randomIndex = Math.floor(Math.random() * randomEvents.length);
  return randomEvents[randomIndex];
}; 