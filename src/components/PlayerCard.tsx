import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Crown, Trophy, Medal, User, Calendar, MapPin, Clock, ChevronDown, ChevronUp } from 'lucide-react';
import { Player } from '../types/chess';
import { countryToFlag, formatLastOnline } from '../utils/countryToFlag';
import { usePlayerDetails } from '../hooks/useChessApi';

interface PlayerCardProps {
  player: Player;
  rank: number;
  variant?: 'podium' | 'grid';
}

export function PlayerCard({ player, rank, variant = 'grid' }: PlayerCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const { playerData, loading, fetchPlayerDetails } = usePlayerDetails();

  const handleCardClick = () => {
    if (!isExpanded && !playerData) {
      fetchPlayerDetails(player.username);
    }
    setIsExpanded(!isExpanded);
  };

  const getRankStyle = (rank: number) => {
    switch (rank) {
      case 1:
        return {
          bg: 'from-yellow-400 to-yellow-600',
          icon: Crown,
          text: 'text-yellow-900',
          border: 'border-yellow-400/50',
          shadow: 'shadow-yellow-400/20',
          medal: '🥇'
        };
      case 2:
        return {
          bg: 'from-gray-300 to-gray-500',
          icon: Trophy,
          text: 'text-gray-900',
          border: 'border-gray-400/50',
          shadow: 'shadow-gray-400/20',
          medal: '🥈'
        };
      case 3:
        return {
          bg: 'from-amber-600 to-amber-800',
          icon: Medal,
          text: 'text-amber-100',
          border: 'border-amber-600/50',
          shadow: 'shadow-amber-600/20',
          medal: '🥉'
        };
      default:
        return {
          bg: 'from-slate-700 to-slate-800',
          icon: User,
          text: 'text-slate-100',
          border: 'border-slate-600/50',
          shadow: 'shadow-slate-900/20',
          medal: ''
        };
    }
  };

  const style = getRankStyle(rank);
  const Icon = style.icon;

  if (variant === 'podium' && rank <= 3) {
    return (
      <motion.div
        className={`relative bg-gradient-to-br ${style.bg} rounded-2xl p-6 ${style.shadow} shadow-2xl border ${style.border} overflow-hidden cursor-pointer`}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: rank * 0.1 }}
        whileHover={{ scale: 1.02, y: -5 }}
        onClick={handleCardClick}
        layout
      >
        {/* Rank Badge */}
        <div className="absolute top-4 right-4">
          <div className={`w-10 h-10 rounded-full bg-black/20 flex items-center justify-center ${style.text}`}>
            <span className="text-lg font-bold">#{rank}</span>
          </div>
        </div>

        {/* Medal */}
        <div className="absolute top-4 left-4">
          <span className="text-2xl">{style.medal}</span>
        </div>

        {/* Crown/Trophy Icon */}
        <div className="flex justify-center mb-4">
          <Icon className={`w-8 h-8 ${style.text}`} />
        </div>

        {/* Player Avatar */}
        <div className="flex justify-center mb-4">
          {player.avatar ? (
            <img
              src={player.avatar}
              alt={player.username}
              className="w-16 h-16 rounded-full border-4 border-white/20"
            />
          ) : (
            <div className="w-16 h-16 rounded-full bg-black/20 flex items-center justify-center">
              <User className={`w-8 h-8 ${style.text}`} />
            </div>
          )}
        </div>

        {/* Player Info */}
        <div className="text-center">
          <h3 className={`text-xl font-bold ${style.text} mb-1`}>
            {player.username}
          </h3>
          {player.title && (
            <p className={`text-sm ${style.text} opacity-80 mb-2`}>
              {player.title}
            </p>
          )}
          <div className="flex items-center justify-center gap-2 mb-3">
            {player.country && (
              <span className="text-lg">{countryToFlag(player.country)}</span>
            )}
            <span className={`text-lg font-bold ${style.text}`}>
              {player.score}
            </span>
          </div>
        </div>

        {/* Expand Indicator */}
        <div className="flex justify-center">
          <motion.div
            animate={{ rotate: isExpanded ? 180 : 0 }}
            transition={{ duration: 0.3 }}
          >
            <ChevronDown className={`w-5 h-5 ${style.text} opacity-60`} />
          </motion.div>
        </div>

        {/* Expanded Content */}
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="mt-4 pt-4 border-t border-white/20"
            >
              {loading ? (
                <div className="text-center">
                  <div className="animate-spin w-6 h-6 border-2 border-white/30 border-t-white rounded-full mx-auto" />
                </div>
              ) : playerData ? (
                <div className="space-y-2 text-sm">
                  {playerData.profile.name && (
                    <p className={`${style.text} opacity-80`}>
                      <strong>Name:</strong> {playerData.profile.name}
                    </p>
                  )}
                  {playerData.profile.location && (
                    <div className={`flex items-center gap-1 ${style.text} opacity-80`}>
                      <MapPin className="w-3 h-3" />
                      <span>{playerData.profile.location}</span>
                    </div>
                  )}
                  <div className={`flex items-center gap-1 ${style.text} opacity-80`}>
                    <Calendar className="w-3 h-3" />
                    <span>Joined {new Date(playerData.profile.joined * 1000).toLocaleDateString()}</span>
                  </div>
                  <div className={`flex items-center gap-1 ${style.text} opacity-80`}>
                    <Clock className="w-3 h-3" />
                    <span>{formatLastOnline(playerData.profile.last_online)}</span>
                  </div>
                </div>
              ) : (
                <p className={`text-sm ${style.text} opacity-60 text-center`}>
                  Click to load details
                </p>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Decorative Elements */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent pointer-events-none" />
      </motion.div>
    );
  }

  return (
    <motion.div
      className="bg-slate-800/80 backdrop-blur-sm rounded-xl border border-slate-700/50 hover:border-amber-400/30 transition-all duration-300 group cursor-pointer overflow-hidden"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      whileHover={{ scale: 1.02, y: -2 }}
      onClick={handleCardClick}
      layout
    >
      <div className="p-4">
        <div className="flex items-center gap-3 mb-3">
          {/* Rank */}
          <div className="flex-shrink-0 w-8 h-8 rounded-full bg-amber-400/20 flex items-center justify-center">
            <span className="text-amber-400 font-bold text-sm">#{rank}</span>
          </div>

          {/* Avatar */}
          {player.avatar ? (
            <img
              src={player.avatar}
              alt={player.username}
              className="w-10 h-10 rounded-full border-2 border-slate-600 group-hover:border-amber-400/50 transition-colors"
            />
          ) : (
            <div className="w-10 h-10 rounded-full bg-slate-700 flex items-center justify-center">
              <User className="w-5 h-5 text-slate-400" />
            </div>
          )}

          {/* Player Info */}
          <div className="flex-1 min-w-0">
            <h4 className="text-white font-semibold truncate group-hover:text-amber-400 transition-colors">
              {player.username}
            </h4>
            {player.title && (
              <p className="text-amber-400 text-xs font-medium">{player.title}</p>
            )}
          </div>

          {/* Expand Icon */}
          <motion.div
            animate={{ rotate: isExpanded ? 180 : 0 }}
            transition={{ duration: 0.3 }}
          >
            <ChevronDown className="w-4 h-4 text-slate-400 group-hover:text-amber-400 transition-colors" />
          </motion.div>
        </div>

        {/* Stats */}
        <div className="flex items-center justify-between text-sm mb-2">
          <div className="flex items-center gap-2">
            {player.country && (
              <span>{countryToFlag(player.country)}</span>
            )}
            <span className="text-slate-400">Rating:</span>
          </div>
          <span className="text-amber-400 font-bold">{player.score}</span>
        </div>
      </div>

      {/* Expanded Content */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="border-t border-slate-700/50 bg-slate-900/50"
          >
            <div className="p-4">
              {loading ? (
                <div className="flex justify-center py-4">
                  <div className="animate-spin w-6 h-6 border-2 border-amber-400/30 border-t-amber-400 rounded-full" />
                </div>
              ) : playerData ? (
                <div className="space-y-3">
                  {playerData.profile.name && (
                    <div>
                      <span className="text-slate-400 text-sm">Full Name:</span>
                      <p className="text-white font-medium">{playerData.profile.name}</p>
                    </div>
                  )}
                  
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    {playerData.profile.location && (
                      <div className="flex items-center gap-1 text-slate-300">
                        <MapPin className="w-3 h-3" />
                        <span>{playerData.profile.location}</span>
                      </div>
                    )}
                    
                    <div className="flex items-center gap-1 text-slate-300">
                      <Calendar className="w-3 h-3" />
                      <span>Joined {new Date(playerData.profile.joined * 1000).getFullYear()}</span>
                    </div>
                    
                    <div className="flex items-center gap-1 text-slate-300">
                      <Clock className="w-3 h-3" />
                      <span>{formatLastOnline(playerData.profile.last_online)}</span>
                    </div>
                    
                    <div className="flex items-center gap-1 text-slate-300">
                      <User className="w-3 h-3" />
                      <span>{playerData.profile.status}</span>
                    </div>
                  </div>

                  {/* Ratings */}
                  {playerData.stats && Object.keys(playerData.stats).length > 0 && (
                    <div>
                      <h5 className="text-amber-400 font-medium mb-2">Ratings</h5>
                      <div className="grid grid-cols-2 gap-2 text-xs">
                        {playerData.stats.chess_rapid && (
                          <div className="bg-slate-800/50 rounded p-2">
                            <span className="text-slate-400">Rapid:</span>
                            <span className="text-white font-bold ml-1">
                              {playerData.stats.chess_rapid.last?.rating || 'N/A'}
                            </span>
                          </div>
                        )}
                        {playerData.stats.chess_blitz && (
                          <div className="bg-slate-800/50 rounded p-2">
                            <span className="text-slate-400">Blitz:</span>
                            <span className="text-white font-bold ml-1">
                              {playerData.stats.chess_blitz.last?.rating || 'N/A'}
                            </span>
                          </div>
                        )}
                        {playerData.stats.chess_bullet && (
                          <div className="bg-slate-800/50 rounded p-2">
                            <span className="text-slate-400">Bullet:</span>
                            <span className="text-white font-bold ml-1">
                              {playerData.stats.chess_bullet.last?.rating || 'N/A'}
                            </span>
                          </div>
                        )}
                        {playerData.stats.chess_daily && (
                          <div className="bg-slate-800/50 rounded p-2">
                            <span className="text-slate-400">Daily:</span>
                            <span className="text-white font-bold ml-1">
                              {playerData.stats.chess_daily.last?.rating || 'N/A'}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <p className="text-slate-400 text-sm text-center py-2">
                  Failed to load player details
                </p>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}