import { motion } from 'framer-motion';
import { getCategoryDisplayName, getChessIcon } from '../utils/countryToFlag';

interface LeaderboardTabsProps {
  categories: string[];
  activeCategory: string;
  onCategoryChange: (category: string) => void;
}

export function LeaderboardTabs({ categories, activeCategory, onCategoryChange }: LeaderboardTabsProps) {
  return (
    <div className="mb-8">
      <div className="flex flex-wrap gap-2 justify-center">
        {categories.map((category) => (
          <motion.button
            key={category}
            onClick={() => onCategoryChange(category)}
            className={`relative px-4 py-2 rounded-xl font-medium transition-all duration-300 flex items-center gap-2 ${
              activeCategory === category
                ? 'bg-amber-400 text-slate-900 shadow-lg shadow-amber-400/25'
                : 'bg-slate-800/80 text-slate-300 hover:bg-slate-700/80 hover:text-amber-400'
            }`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            layout
          >
            {activeCategory === category && (
              <motion.div
                className="absolute inset-0 bg-amber-400 rounded-xl"
                layoutId="activeTab"
                transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
              />
            )}
            <span className="relative z-10 text-lg">
              {getChessIcon(category)}
            </span>
            <span className="relative z-10 text-sm">
              {getCategoryDisplayName(category)}
            </span>
          </motion.button>
        ))}
      </div>
    </div>
  );
}