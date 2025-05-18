import { motion } from 'framer-motion';
import { useEffect, useRef } from 'react';

interface HistoryEntry {
  text: string;
  timestamp: number;
  statsChange?: {
    happiness?: number;
    energy?: number;
    fullness?: number;
    friendliness?: number;
  };
  distanceChange?: number;
  weatherChange?: string;
  itemUsed?: {
    name: string;
  };
}

interface HistoryPanelProps {
  history: HistoryEntry[];
}

const HistoryPanel = ({ history }: HistoryPanelProps) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  // 当历史记录更新时，滚动到顶部
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = 0;
    }
  }, [history]);

  // 格式化时间戳
  const formatTime = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('zh-CN', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
  };

  // 格式化属性变化
  const formatStatsChange = (changes?: HistoryEntry['statsChange']) => {
    if (!changes) return null;

    const statsText = {
      happiness: '快乐值',
      energy: '体力值',
      fullness: '饱腹感',
      friendliness: '友好度',
    };

    return Object.entries(changes)
      .map(([key, value]) => {
        if (value === undefined) return null;
        const statName = statsText[key as keyof typeof statsText];
        const sign = value > 0 ? '+' : '';
        return (
          <span
            key={key}
            className={`inline-block px-2 py-0.5 rounded text-xs mr-1 ${
              value > 0
                ? 'bg-green-100 text-green-800'
                : value < 0
                ? 'bg-red-100 text-red-800'
                : 'bg-gray-100 text-gray-800'
            }`}
          >
            {statName}{sign}{value}
          </span>
        );
      })
      .filter(Boolean);
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-4 border border-gray-100">
      <div className="mb-4">
        <h2 className="text-xl font-bold text-gray-800">冒险日志</h2>
      </div>
      
      <div 
        ref={scrollRef}
        className="h-[400px] overflow-y-auto pr-2 space-y-3 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100"
      >
        <div className="flex flex-col-reverse">
          {history.map((entry, index) => {
            // 只对最新的记录（第一条）使用动画
            const isLatest = index === 0;
            return (
              <motion.div
                key={`${entry.timestamp}-${index}`}
                initial={isLatest ? { opacity: 0, y: 10 } : false}
                animate={isLatest ? { opacity: 1, y: 0 } : false}
                transition={{ duration: 0.2 }}
                className="p-3 bg-gray-50 rounded-lg text-sm text-gray-800 border border-gray-100 mb-3"
              >
                <div className="flex justify-between items-start mb-1">
                  <span className="text-xs text-gray-500">{formatTime(entry.timestamp)}</span>
                  {entry.distanceChange && (
                    <span className="text-xs text-gray-600">
                      距离 {entry.distanceChange > 0 ? '+' : ''}{entry.distanceChange}米
                    </span>
                  )}
                </div>
                <div className="mb-1 whitespace-pre-line">{entry.text}</div>
                {entry.statsChange && (
                  <div className="flex flex-wrap gap-1 mt-1">
                    {formatStatsChange(entry.statsChange)}
                  </div>
                )}
                {entry.weatherChange && (
                  <div className="mt-1 text-xs text-gray-600">
                    天气变化：{entry.weatherChange}
                  </div>
                )}
                {entry.itemUsed && (
                  <div className="mt-1 text-xs text-gray-600">
                    使用道具：{entry.itemUsed.name}
                  </div>
                )}
              </motion.div>
            );
          })}
          
          {history.length === 0 && (
            <p className="text-gray-500 text-center py-4">
              还没有冒险记录...
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default HistoryPanel; 