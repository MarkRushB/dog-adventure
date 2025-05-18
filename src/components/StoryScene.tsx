import { motion } from 'framer-motion';

interface Choice {
  text: string;
  nextScene: string;
  effect?: {
    happiness?: number;
    energy?: number;
    fullness?: number;
    friendliness?: number;
  };
}

interface StorySceneProps {
  title: string;
  content: string;
  choices: Choice[];
  onChoice: (choice: Choice) => void;
  lastChoice?: string;
}

const StoryScene = ({ title, content, choices, onChoice, lastChoice }: StorySceneProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-4 sm:space-y-6"
    >
      <h2 className="text-xl sm:text-2xl font-bold text-gray-800">{title}</h2>
      
      <div className="bg-white p-4 sm:p-6 rounded-lg shadow-lg border border-gray-100">
        {lastChoice && (
          <div className="mb-4 p-3 bg-gray-50 rounded-lg border border-gray-200">
            <p className="text-sm sm:text-base text-gray-600 italic">{lastChoice}</p>
          </div>
        )}
        <p className="text-sm sm:text-base text-gray-800 leading-relaxed">{content}</p>
      </div>

      <div className="space-y-2 sm:space-y-3">
        {choices.map((choice, index) => (
          <motion.button
            key={index}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            onClick={() => onChoice(choice)}
            className="w-full p-3 sm:p-4 text-left bg-white rounded-lg shadow hover:shadow-md transition-shadow
                     border border-gray-200 hover:border-gray-300 focus:outline-none focus:ring-2 
                     focus:ring-gray-400 focus:border-transparent text-sm sm:text-base text-gray-800 hover:bg-gray-50"
          >
            {choice.text}
          </motion.button>
        ))}
      </div>
    </motion.div>
  );
};

export default StoryScene; 