import { motion } from 'framer-motion';
import { WeatherType } from '@/types/game';
import { weathers } from '@/data/weather';

interface WeatherDisplayProps {
  weather: WeatherType;
}

const weatherIcons: Record<WeatherType, string> = {
  sunny: '☀️',
  rainy: '🌧️',
  cloudy: '☁️',
  windy: '🌪️',
  snowy: '❄️',
};

export default function WeatherDisplay({ weather }: WeatherDisplayProps) {
  const weatherData = weathers[weather];

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-lg shadow-lg p-4 flex items-center gap-3 border border-gray-100"
    >
      <div className="text-4xl">{weatherIcons[weather]}</div>
      <div>
        <h3 className="font-semibold text-gray-800">{weatherData.name}</h3>
        <p className="text-sm text-gray-600">{weatherData.description}</p>
      </div>
    </motion.div>
  );
} 