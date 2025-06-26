import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, User, Calendar, MapPin, Trophy, Clock } from 'lucide-react';
import { usePlayerSearch } from '../hooks/useChessApi';
import { LoadingSpinner } from './LoadingSpinner';
import { countryToFlag, formatRating, formatLastOnline } from '../utils/countryToFlag';

export function PlayerSearch() {
  const [searchTerm, setSearchTerm] = useState('');
  const { playerData, loading, error, searchPlayer } = usePlayerSearch();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      searchPlayer(searchTerm.trim());
    }
  };

  return (
    <div className="space-y-6">
      {/* Search Form */}
      <form onSubmit={handleSubmit} className="relative">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search for a Chess.com player..."
            className="w-full pl-12 pr-4 py-3 bg-slate-800/80 backdrop-blur-sm border border-slate-700 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-400/20 transition-all duration-300"
          />
        </div>
        <motion.button
          type="submit"
          disabled={loading || !searchTerm.trim()}
          className="absolute right-2 top-1/2 transform -translate-y-1/2 px-4 py-2 bg-amber-400 text-slate-900 rounded-lg font-medium hover:bg-amber-300 focus:outline-none focus:ring-2 focus:ring-amber-400/50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          {loading ? <LoadingSpinner size="sm" /> : 'Search'}
        </motion.button>
      </form>

      {/* Results */}
      <AnimatePresence mode="wait">
        {loading && (
          <motion.div
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex justify-center py-8"
          >
            <LoadingSpinner text="Searching player..." />
          </motion.div>
        )}

        {error && (
          <motion.div
            key="error"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-red-900/20 border border-red-500/30 rounded-xl p-4"
          >
            <p className="text-red-400 text-center">{error}</p>
          </motion.div>
        )}

        {playerData && !loading && (
          <motion.div
            key="player-data"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-slate-800/80 backdrop-blur-sm rounded-2xl p-6 border border-slate-700/50"
          >
            {/* Player Header */}
            <div className="flex items-start gap-4 mb-6">
              {playerData.profile.avatar ? (
                <img
                  src={playerData.profile.avatar}
                  alt={playerData.profile.username}
                  className="w-20 h-20 rounded-full border-4 border-amber-400/30"
                />
              ) : (
                <div className="w-20 h-20 rounded-full bg-slate-700 flex items-center justify-center border-4 border-amber-400/30">
                  <User className="w-10 h-10 text-slate-400" />
                </div>
              )}
              
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <h2 className="text-2xl font-bold text-white">
                    {playerData.profile.username}
                  </h2>
                  {playerData.profile.title && (
                    <span className="px-2 py-1 bg-amber-400/20 text-amber-400 rounded-lg text-sm font-medium">
                      {playerData.profile.title}
                    </span>
                  )}
                  {playerData.profile.verified && (
                    <span className="text-blue-400">✓</span>
                  )}
                </div>
                
                {playerData.profile.name && (
                  <p className="text-slate-300 mb-2">{playerData.profile.name}</p>
                )}
                
                <div className="flex flex-wrap items-center gap-4 text-sm text-slate-400">
                  {playerData.profile.country && (
                    <div className="flex items-center gap-1">
                      <span>{countryToFlag(playerData.profile.country)}</span>
                      <span>{playerData.profile.country}</span>
                    </div>
                  )}
                  
                  {playerData.profile.location && (
                    <div className="flex items-center gap-1">
                      <MapPin className="w-4 h-4" />
                      <span>{playerData.profile.location}</span>
                    </div>
                  )}
                  
                  <div className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    <span>Joined {new Date(playerData.profile.joined * 1000).toLocaleDateString()}</span>
                  </div>
                  
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    <span>{formatLastOnline(playerData.profile.last_online)}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {playerData.stats.chess_rapid && (
                <div className="bg-slate-700/50 rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Trophy className="w-5 h-5 text-amber-400" />
                    <h3 className="font-semibold text-white">Rapid</h3>
                  </div>
                  <p className="text-2xl font-bold text-amber-400">
                    {formatRating(playerData.stats.chess_rapid.last?.rating)}
                  </p>
                  <p className="text-sm text-slate-400">
                    Best: {formatRating(playerData.stats.chess_rapid.best?.rating)}
                  </p>
                </div>
              )}

              {playerData.stats.chess_blitz && (
                <div className="bg-slate-700/50 rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Trophy className="w-5 h-5 text-amber-400" />
                    <h3 className="font-semibold text-white">Blitz</h3>
                  </div>
                  <p className="text-2xl font-bold text-amber-400">
                    {formatRating(playerData.stats.chess_blitz.last?.rating)}
                  </p>
                  <p className="text-sm text-slate-400">
                    Best: {formatRating(playerData.stats.chess_blitz.best?.rating)}
                  </p>
                </div>
              )}

              {playerData.stats.chess_bullet && (
                <div className="bg-slate-700/50 rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Trophy className="w-5 h-5 text-amber-400" />
                    <h3 className="font-semibold text-white">Bullet</h3>
                  </div>
                  <p className="text-2xl font-bold text-amber-400">
                    {formatRating(playerData.stats.chess_bullet.last?.rating)}
                  </p>
                  <p className="text-sm text-slate-400">
                    Best: {formatRating(playerData.stats.chess_bullet.best?.rating)}
                  </p>
                </div>
              )}

              {playerData.stats.chess_daily && (
                <div className="bg-slate-700/50 rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Trophy className="w-5 h-5 text-amber-400" />
                    <h3 className="font-semibold text-white">Daily</h3>
                  </div>
                  <p className="text-2xl font-bold text-amber-400">
                    {formatRating(playerData.stats.chess_daily.last?.rating)}
                  </p>
                  <p className="text-sm text-slate-400">
                    Best: {formatRating(playerData.stats.chess_daily.best?.rating)}
                  </p>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}