import { motion, AnimatePresence } from 'framer-motion';
import { Item } from '@/types/game';
import { useGameStore } from '@/store/gameStore';
import { soundManager } from '@/utils/sound';
import { useEffect } from 'react';

interface InventoryPanelProps {
  items: Item[];
  activeItems: { item: Item; remainingTurns: number }[];
}

export default function InventoryPanel({ items, activeItems }: InventoryPanelProps) {
  const { useItem } = useGameStore();

  useEffect(() => {
    console.log('InventoryPanel rendered:', {
      items,
      activeItems,
      itemsLength: items.length,
      activeItemsLength: activeItems.length
    });
  }, [items, activeItems]);

  const handleUseItem = (item: Item) => {
    soundManager.play('click');
    useItem(item);
  };

  console.log('InventoryPanel render:', {
    items,
    activeItems,
    itemsLength: items.length,
    activeItemsLength: activeItems.length
  });

  return (
    <div className="bg-white rounded-xl shadow-lg p-4 border border-gray-100">
      <h2 className="text-xl font-bold text-gray-800 mb-3">道具栏</h2>
      
      {/* 当前生效的道具 */}
      {activeItems.length > 0 && (
        <div className="mb-3">
          <h3 className="text-sm font-semibold text-gray-600 mb-1.5">生效中：</h3>
          <div className="space-y-1.5">
            {activeItems.map(({ item, remainingTurns }, index) => {
              console.log('Rendering active item:', { item, remainingTurns, index });
              return (
                <motion.div
                  key={`active-${item.id}-${index}`}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="flex items-center justify-between bg-gray-50 rounded-lg px-2.5 py-1.5 border border-gray-100"
                >
                  <div>
                    <span className="font-medium text-gray-700">{item.name}</span>
                    <span className="text-sm text-gray-500 ml-2">
                      (剩余{remainingTurns}回合)
                    </span>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      )}

      {/* 道具列表 */}
      <div className="space-y-1.5">
        <AnimatePresence>
          {items.map((item, index) => {
            console.log('Rendering inventory item:', { item, index });
            return (
              <motion.div
                key={`inventory-${item.id}-${index}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="flex items-center justify-between bg-gray-50 rounded-lg px-3 py-2 hover:bg-gray-100 transition-colors border border-gray-100"
              >
                <div>
                  <h3 className="font-medium text-gray-800">{item.name}</h3>
                  <p className="text-sm text-gray-600 mt-0.5">{item.description}</p>
                </div>
                <button
                  onClick={() => handleUseItem(item)}
                  className="px-2.5 py-1 bg-gray-800 text-white rounded-lg text-sm hover:bg-gray-700 transition-colors ml-3"
                >
                  使用
                </button>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {items.length === 0 && activeItems.length === 0 && (
        <p className="text-gray-500 text-center py-3">
          还没有道具，继续遛狗可能会获得道具！
        </p>
      )}
    </div>
  );
} 