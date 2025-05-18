import { motion } from 'framer-motion';
import { Ending } from '@/data/endings';

interface EndingSceneProps {
  ending: Ending;
  onRestart: () => void;
}

const EndingScene = ({ ending, onRestart }: EndingSceneProps) => {
  // 根据结局类型设置不同的样式
  const getEndingStyle = (type: Ending['type']) => {
    switch (type) {
      case 'happy':
        return 'bg-gradient-to-br from-green-100 to-green-50 border-green-200';
      case 'sad':
        return 'bg-gradient-to-br from-red-100 to-red-50 border-red-200';
      case 'special':
        return 'bg-gradient-to-br from-purple-100 to-purple-50 border-purple-200';
      default:
        return 'bg-gradient-to-br from-blue-100 to-blue-50 border-blue-200';
    }
  };

  // 根据结局类型设置不同的图标
  const getEndingIcon = (type: Ending['type']) => {
    switch (type) {
      case 'happy':
        return '🎉';
      case 'sad':
        return '💔';
      case 'special':
        return '✨';
      default:
        return '🌟';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className={`p-8 rounded-xl shadow-xl border-2 ${getEndingStyle(ending.type)}`}
    >
      <div className="text-center mb-6">
        <span className="text-4xl mb-4 block">{getEndingIcon(ending.type)}</span>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">{ending.title}</h2>
      </div>
      
      <p className="text-gray-700 text-lg mb-8 text-center leading-relaxed">
        {ending.content}
      </p>
      
      <div className="flex justify-center">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onRestart}
          className="px-6 py-3 bg-purple-600 text-white rounded-lg font-semibold
                   hover:bg-purple-700 transition-colors shadow-md"
        >
          开始新的冒险
        </motion.button>
      </div>
    </motion.div>
  );
};

export default EndingScene; 