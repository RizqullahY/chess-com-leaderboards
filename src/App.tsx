import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Crown, Search as SearchIcon, Trophy, Users } from 'lucide-react';
import { useLeaderboards } from './hooks/useChessApi';
import { Header } from './components/Header';
import { LeaderboardTabs } from './components/LeaderboardTabs';
import { LeaderboardGrid } from './components/LeaderboardGrid';
import { PlayerSearch } from './components/PlayerSearch';
import { LoadingSpinner, LeaderboardSkeleton } from './components/LoadingSpinner';

function App() {
  const { leaderboards, loading, error } = useLeaderboards();
  const [activeCategory, setActiveCategory] = useState('live_rapid');
  const [showSearch, setShowSearch] = useState(false);

  const availableCategories = leaderboards ? Object.keys(leaderboards).filter(
    category => leaderboards[category as keyof typeof leaderboards]?.length > 0
  ) : [];

  const currentPlayers = leaderboards && activeCategory ? 
    leaderboards[activeCategory as keyof typeof leaderboards] : [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Fixed Header */}
      <Header />

      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }} />
      </div>

      <div className="relative z-10 pt-20">
        {/* Hero Section */}
        <motion.section 
          className="text-center py-16 px-4"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="flex items-center justify-center gap-3 mb-6">
            <Crown className="w-12 h-12 text-amber-400" />
            <h1 className="text-5xl md:text-7xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-yellow-600 font-serif">
              Chess.com Leaderboards
            </h1>
            <Crown className="w-12 h-12 text-amber-400" />
          </div>
          <p className="text-xl md:text-2xl text-slate-300 font-serif max-w-3xl mx-auto mb-8">
            Witness the grandmasters and rising stars battle for supremacy across the realm of 64 squares
          </p>
          
          {/* Action Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-6">
            <motion.button
              onClick={() => setShowSearch(!showSearch)}
              className="flex items-center gap-3 px-8 py-4 bg-amber-400/20 hover:bg-amber-400/30 text-amber-400 rounded-xl font-medium transition-all duration-300 border border-amber-400/30 backdrop-blur-sm"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <SearchIcon className="w-5 h-5" />
              {showSearch ? 'Hide Player Search' : 'Search Players'}
            </motion.button>
            
            {leaderboards && (
              <div className="flex items-center gap-3 text-slate-400 bg-slate-800/30 px-6 py-4 rounded-xl backdrop-blur-sm border border-slate-700/50">
                <Users className="w-5 h-5" />
                <span className="font-medium">
                  {Object.values(leaderboards).reduce((sum, category) => sum + category.length, 0)} Elite Players
                </span>
              </div>
            )}
          </div>
        </motion.section>

        <div className="max-w-7xl mx-auto px-4 pb-12">
          {/* Player Search */}
          <AnimatePresence>
            {showSearch && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                className="mb-12"
              >
                <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-8 border border-slate-700/50">
                  <h2 className="text-3xl font-bold text-amber-400 mb-8 text-center font-serif">
                    🔍 Player Search & Profile
                  </h2>
                  <PlayerSearch />
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Main Content */}
          <AnimatePresence mode="wait">
            {loading && (
              <motion.div
                key="loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <div className="text-center mb-8">
                  <LoadingSpinner size="lg" text="Summoning the royal court..." />
                </div>
                <LeaderboardSkeleton />
              </motion.div>
            )}

            {error && (
              <motion.div
                key="error"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="text-center py-12"
              >
                <div className="bg-red-900/20 border border-red-500/30 rounded-2xl p-8 max-w-md mx-auto backdrop-blur-sm">
                  <Trophy className="w-12 h-12 text-red-400 mx-auto mb-4" />
                  <h3 className="text-xl font-bold text-red-400 mb-2">Quest Failed</h3>
                  <p className="text-red-300 mb-4">{error}</p>
                  <button
                    onClick={() => window.location.reload()}
                    className="px-6 py-2 bg-red-400/20 hover:bg-red-400/30 text-red-400 rounded-lg font-medium transition-colors duration-300"
                  >
                    Retry Quest
                  </button>
                </div>
              </motion.div>
            )}

            {leaderboards && !loading && (
              <motion.div
                key="leaderboards"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.6 }}
              >
                {/* Category Tabs */}
                <LeaderboardTabs
                  categories={availableCategories}
                  activeCategory={activeCategory}
                  onCategoryChange={setActiveCategory}
                />

                {/* Leaderboard Grid */}
                <LeaderboardGrid
                  players={currentPlayers}
                  category={activeCategory}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Footer */}
        <footer className="text-center py-12 px-4 border-t border-slate-800 bg-slate-900/50 backdrop-blur-sm">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center justify-center gap-2 mb-4">
              <Crown className="w-6 h-6 text-amber-400" />
              <p className="text-slate-300 font-serif text-lg">
                Crafted with passion for the Chess.com community
              </p>
              <Crown className="w-6 h-6 text-amber-400" />
            </div>
            <p className="text-slate-500 text-sm">
              Data provided by Chess.com Public API • Updated in real-time
            </p>
          </div>
        </footer>
      </div>
    </div>
  );
}

export default App;