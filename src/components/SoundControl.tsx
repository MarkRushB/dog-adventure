import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { soundManager } from '@/utils/sound';

const SoundControl = () => {
  const [isMuted, setIsMuted] = useState(soundManager.isSoundMuted());

  useEffect(() => {
    // 开始播放背景音乐
    soundManager.play('background');
    
    // 组件卸载时停止背景音乐
    return () => {
      soundManager.stop('background');
    };
  }, []);

  const handleToggleMute = () => {
    const newMutedState = soundManager.toggleMute();
    setIsMuted(newMutedState);
  };

  return (
    <motion.button
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      onClick={handleToggleMute}
      className="fixed bottom-4 right-4 p-3 bg-white rounded-full shadow-lg
               hover:shadow-xl transition-shadow z-50"
      title={isMuted ? '开启声音' : '静音'}
    >
      {isMuted ? '🔇' : '🔊'}
    </motion.button>
  );
};

export default SoundControl; 