import { DogStats } from '@/store/gameStore';

interface StatusBarProps {
  stats: DogStats;
}

const StatusBar = ({ stats }: StatusBarProps) => {
  const getColor = (value: number) => {
    if (value >= 70) return 'bg-green-500';
    if (value >= 30) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const getEmoji = (key: keyof DogStats) => {
    switch (key) {
      case 'happiness':
        return '🧡';
      case 'energy':
        return '💤';
      case 'fullness':
        return '🥩';
      default:
        return '';
    }
  };

  const getLabel = (key: keyof DogStats) => {
    switch (key) {
      case 'happiness':
        return '快乐值';
      case 'energy':
        return '体力值';
      case 'fullness':
        return '饱腹感';
      default:
        return '';
    }
  };

  const getStatIcon = (stat: keyof DogStats) => {
    switch (stat) {
      case 'happiness':
        return '😊';
      case 'energy':
        return '⚡';
      case 'fullness':
        return '🥩';
      default:
        return '';
    }
  };

  return (
    <div className="space-y-2 p-4 bg-white rounded-lg shadow">
      {Object.entries(stats).map(([key, value]) => (
        <div key={key} className="flex items-center gap-2">
          <span className="w-8">{getEmoji(key as keyof DogStats)}</span>
          <span className="w-20 text-sm text-gray-600">{getLabel(key as keyof DogStats)}</span>
          <div className="flex-1 h-4 bg-gray-200 rounded-full overflow-hidden">
            <div
              className={`h-full ${getColor(value)} transition-all duration-300`}
              style={{ width: `${value}%` }}
            />
          </div>
          <span className="w-12 text-sm text-gray-600 text-right">{value}%</span>
        </div>
      ))}
    </div>
  );
};

export default StatusBar; 