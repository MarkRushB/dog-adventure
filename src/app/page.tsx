'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGameStore } from '@/store/gameStore';
import StatusBar from '@/components/StatusBar';
import StoryScene from '@/components/StoryScene';
import HistoryPanel from '@/components/HistoryPanel';
import SoundControl from '@/components/SoundControl';
import WeatherDisplay from '@/components/WeatherDisplay';
import InventoryPanel from '@/components/InventoryPanel';
import { soundManager } from '@/utils/sound';
import { scenes, getRandomEvent } from '@/data/storyScenes';
import { getRandomItem } from '@/data/items';
import { getRandomWeather, weathers } from '@/data/weather';
import { DogStats } from '@/store/gameStore';

interface ItemEffect {
  itemName: string;
  changes: Partial<DogStats>;
}

export default function Home() {
  const [dogName, setDogName] = useState('');
  const [ownerName, setOwnerName] = useState('');
  const [gameStarted, setGameStarted] = useState(false);
  const [currentSceneId, setCurrentSceneId] = useState('start');
  const [gameOver, setGameOver] = useState(false);
  const [lastChoice, setLastChoice] = useState<string>('');
  const [showLeaderboard, setShowLeaderboard] = useState(false);
  
  const { 
    dogStats, 
    updateStats, 
    addToHistory, 
    storyHistory, 
    distance, 
    addDistance, 
    resetGame,
    currentWeather,
    updateWeather,
    inventory,
    activeItems,
    addItem,
    useItem,
    updateActiveItems,
    turnCount,
    incrementTurn,
    setOwnerName: setStoreOwnerName,
    leaderboard,
    addToLeaderboard,
    fetchLeaderboard,
  } = useGameStore();

  // 添加调试日志
  useEffect(() => {
    console.log('Component mounted:', {
      inventory: useGameStore.getState().inventory,
      activeItems: useGameStore.getState().activeItems
    });
  }, []);

  useEffect(() => {
    console.log('Inventory or activeItems changed:', {
      inventory,
      activeItems
    });
  }, [inventory, activeItems]);

  useEffect(() => {
    // 组件卸载时停止所有音效
    return () => {
      soundManager.stop('background');
    };
  }, []);

  // 检查游戏是否结束
  useEffect(() => {
    if (gameStarted && !gameOver) {
      const isGameOver = Object.values(dogStats).some(stat => stat <= 0);
      if (isGameOver) {
        setGameOver(true);
        soundManager.play('success');
        addToHistory(`🏁 遛狗结束！总共走了 ${distance} 米！`);
        addToLeaderboard(ownerName, dogName, distance);
      }
    }
  }, [dogStats, gameStarted, gameOver, distance, addToHistory, ownerName, dogName, addToLeaderboard]);

  // 添加排行榜数据加载效果
  useEffect(() => {
    if (showLeaderboard) {
      fetchLeaderboard();
    }
  }, [showLeaderboard, fetchLeaderboard]);

  const handleStartGame = () => {
    if (dogName.trim() && ownerName.trim()) {
      setGameStarted(true);
      setGameOver(false);
      useGameStore.getState().setDogName(dogName);
      setStoreOwnerName(ownerName);
      
      // 初始化天气
      const initialWeather = getRandomWeather();
      useGameStore.setState({ currentWeather: initialWeather });
      const weatherData = weathers[initialWeather];
      addToHistory(`${ownerName}带着${dogName}开始遛狗！天气是${weatherData.name}。`, undefined, undefined, initialWeather);
      
      soundManager.play('success');
    }
  };

  const handleChoice = (choice: any) => {
    // 播放点击音效
    soundManager.play('click');
    
    // 增加回合计数
    incrementTurn();
    
    // 更新道具效果（每回合更新）
    const itemEffects: ItemEffect[] = updateActiveItems();
    
    let nextSceneId = choice.nextScene;
    let effect = choice.effect;
    let content = '';
    
    // 设置选择文本
    let choiceText = `${dogName}选择了：${choice.text}`;
    
    // 处理随机结果
    if (choice.randomOutcome) {
      const nextScene = scenes[nextSceneId];
      if (nextScene?.getRandomContent) {
        const randomResult = nextScene.getRandomContent();
        content = randomResult.content;
        effect = randomResult.effect;
        // 如果是遇到狗狗的场景，直接使用content，不添加玩家名字
        if (nextSceneId === 'meet_dog_result') {
          choiceText = content;
        } else {
          choiceText = `${dogName}${content}`;
        }
      }
    }

    // 合并场景效果和道具效果
    const combinedStatsChange = {
      ...effect,
      ...itemEffects.reduce((acc, effect) => {
        Object.entries(effect.changes).forEach(([key, value]) => {
          const statKey = key as keyof DogStats;
          acc[statKey] = (acc[statKey] || 0) + value;
        });
        return acc;
      }, {} as Partial<DogStats>)
    };

    // 构建完整的文本，包含场景效果和道具效果
    let fullText = choiceText;
    if (itemEffects.length > 0) {
      fullText += '\n' + itemEffects.map(effect => {
        const lines = effect.itemName.split('\n');
        return lines[1];
      }).join('\n');
    }

    // 记录到历史
    addToHistory(fullText, combinedStatsChange, choice.distanceChange);

    // 每3回合有30%概率改变天气
    if (turnCount > 0 && turnCount % 3 === 0 && Math.random() < 0.3) {
      const newWeatherType = updateWeather();
      const currentWeatherState = useGameStore.getState().currentWeather;
      const weatherData = weathers[currentWeatherState];
      addToHistory(`天气变成了${weatherData.name}！`, undefined, undefined, currentWeatherState);
    }

    // 随机获得道具（10%概率）
    if (Math.random() < 0.1) {
      const newItem = getRandomItem();
      if (newItem) {
        addItem(newItem);
        addToHistory(`发现了一个${newItem.name}！`, undefined, undefined, undefined, newItem);
      }
    }
    
    // 只设置选择内容给 StoryScene 显示
    setLastChoice(choiceText);

    // 更新状态
    updateStats(combinedStatsChange);
    
    // 更新距离
    if (choice.distanceChange) {
      addDistance(choice.distanceChange);
    }
    
    // 检查下一个场景
    if (nextSceneId === 'random_event') {
      nextSceneId = getRandomEvent();
    }
    
    if (scenes[nextSceneId]) {
      setCurrentSceneId(nextSceneId);
    } else {
      setCurrentSceneId('start');
    }
  };

  const handleRestart = () => {
    soundManager.play('click');
    resetGame();
    setGameStarted(false);
    setGameOver(false);
    setCurrentSceneId('start');
    setLastChoice('');
    setDogName('');
    setOwnerName('');
  };

  const currentScene = scenes[currentSceneId];

  // 如果场景不存在，显示错误信息
  if (gameStarted && !currentScene) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 p-4 flex items-center justify-center">
        <div className="bg-white rounded-xl shadow-xl p-8 max-w-md w-full text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">哎呀！</h2>
          <p className="text-gray-600 mb-6">这个场景似乎还没有准备好...</p>
          <button
            onClick={handleRestart}
            className="bg-gray-800 text-white px-6 py-2 rounded-lg hover:bg-gray-700 transition-colors"
          >
            重新开始
          </button>
        </div>
        <SoundControl />
        <HistoryPanel history={storyHistory} />
      </div>
    );
  }

  // 修改排行榜组件
  const LeaderboardPanel = () => (
    <div className="bg-white rounded-xl shadow-lg p-4 border border-gray-100">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-gray-800">遛狗排行榜</h2>
        <button
          onClick={() => setShowLeaderboard(false)}
          className="text-gray-500 hover:text-gray-700"
        >
          ✕
        </button>
      </div>
      <div className="space-y-2">
        {leaderboard.map((entry, index) => (
          <div key={entry.id} className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
            <div className="flex items-center">
              <span className="w-6 text-center font-bold text-gray-600">{index + 1}</span>
              <div className="ml-2">
                <div className="text-sm font-medium text-gray-800">{entry.ownerName}的{entry.dogName}</div>
                <div className="text-xs text-gray-500">
                  {new Date(entry.createdAt).toLocaleDateString('zh-CN')}
                </div>
              </div>
            </div>
            <span className="text-sm font-semibold text-gray-700">{entry.distance}米</span>
          </div>
        ))}
        {leaderboard.length === 0 && (
          <p className="text-center text-gray-500 py-4">还没有记录...</p>
        )}
      </div>
    </div>
  );

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 p-2 sm:p-4">
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-4 lg:gap-8">
        {/* 主要内容区域 */}
        <div className="w-full lg:flex-1">
          <AnimatePresence mode="wait">
            {!gameStarted ? (
              <motion.div
                key="start"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="mt-4 lg:mt-20 bg-white rounded-xl shadow-lg p-4 sm:p-8 border border-gray-100"
              >
                <h1 className="text-3xl sm:text-4xl font-bold text-center text-gray-800 mb-4 sm:mb-6">
                  遛狗模拟器 🐕
                </h1>
                <p className="text-sm sm:text-base text-gray-600 text-center mb-6 sm:mb-8">
                  给你的狗狗起个名字，开始遛狗吧！看看能走多远！
                </p>
                <div className="space-y-4">
                  <input
                    type="text"
                    value={ownerName}
                    onChange={(e) => setOwnerName(e.target.value)}
                    placeholder="输入遛狗人的名字..."
                    className="w-full px-3 sm:px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-gray-400 focus:border-transparent bg-white text-gray-900 placeholder-gray-400 text-sm sm:text-base"
                  />
                  <input
                    type="text"
                    value={dogName}
                    onChange={(e) => setDogName(e.target.value)}
                    placeholder="输入狗狗的名字..."
                    className="w-full px-3 sm:px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-gray-400 focus:border-transparent bg-white text-gray-900 placeholder-gray-400 text-sm sm:text-base"
                  />
                  <div className="flex gap-2">
                    <button
                      onClick={handleStartGame}
                      disabled={!dogName.trim() || !ownerName.trim()}
                      className="flex-1 bg-gray-800 text-white py-2 sm:py-3 rounded-lg font-semibold hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm sm:text-base"
                    >
                      开始遛狗
                    </button>
                    <button
                      onClick={() => setShowLeaderboard(true)}
                      className="px-4 bg-gray-100 text-gray-700 py-2 sm:py-3 rounded-lg font-semibold hover:bg-gray-200 transition-colors text-sm sm:text-base"
                    >
                      排行榜
                    </button>
                  </div>
                </div>
              </motion.div>
            ) : gameOver ? (
              <motion.div
                key="game-over"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="mt-4 lg:mt-20 bg-white rounded-xl shadow-lg p-4 sm:p-8 text-center border border-gray-100"
              >
                <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-3 sm:mb-4">
                  遛狗结束！
                </h2>
                <p className="text-xl sm:text-2xl text-gray-700 mb-4 sm:mb-6">
                  {ownerName}带着{dogName}总共走了 <span className="text-gray-800 font-bold">{distance}</span> 米
                </p>
                <div className="flex gap-4 justify-center">
                  <button
                    onClick={handleRestart}
                    className="bg-gray-800 text-white px-6 sm:px-8 py-2 sm:py-3 rounded-lg font-semibold hover:bg-gray-700 transition-colors text-sm sm:text-base"
                  >
                    再来一次
                  </button>
                  <button
                    onClick={() => setShowLeaderboard(true)}
                    className="bg-gray-100 text-gray-700 px-6 sm:px-8 py-2 sm:py-3 rounded-lg font-semibold hover:bg-gray-200 transition-colors text-sm sm:text-base"
                  >
                    查看排行榜
                  </button>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="game"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-4 sm:space-y-6 py-4 sm:py-8"
              >
                {/* 工具栏 */}
                <div className="flex justify-between items-center">
                  <div>
                    <h2 className="text-xl sm:text-2xl font-bold text-gray-800">
                      {dogName}的遛狗之旅
                    </h2>
                    <p className="text-sm sm:text-base text-gray-600">已走距离：{distance} 米</p>
                  </div>
                  <button
                    onClick={() => {
                      soundManager.play('click');
                      if (confirm('确定要重新开始吗？')) {
                        handleRestart();
                      }
                    }}
                    className="p-2 bg-white rounded-lg shadow hover:shadow-md transition-shadow
                             text-gray-600 hover:text-gray-800 border border-gray-200"
                    title="重新开始"
                  >
                    🔄
                  </button>
                </div>

                {/* 天气显示 */}
                <WeatherDisplay weather={currentWeather} />

                <StatusBar stats={dogStats} />
                
                <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6 border border-gray-100">
                  {currentScene && (
                    <StoryScene
                      title={currentScene.title}
                      content={currentScene.content === '...' ? '' : currentScene.content}
                      choices={currentScene.choices}
                      onChoice={handleChoice}
                      lastChoice={lastChoice}
                    />
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* 侧边栏 - 在移动端改为底部显示 */}
        <div className="w-full lg:w-80 lg:flex-shrink-0 space-y-4">
          <InventoryPanel items={inventory} activeItems={activeItems} />
          <HistoryPanel history={storyHistory} />
        </div>
      </div>

      {/* 排行榜弹窗 */}
      {showLeaderboard && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="w-full max-w-md">
            <LeaderboardPanel />
          </div>
        </div>
      )}

      {/* 音效控制 - 调整移动端位置 */}
      <div className="fixed bottom-4 right-4 z-50">
        <SoundControl />
      </div>
    </main>
  );
}


