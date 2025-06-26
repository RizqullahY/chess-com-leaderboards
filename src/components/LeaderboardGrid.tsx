import { useState, useEffect, useRef, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Player } from '../types/chess';
import { PlayerCard } from './PlayerCard';
import { PlayerSkeleton } from './LoadingSpinner';

interface LeaderboardGridProps {
  players: Player[];
  category: string;
}

const ITEMS_PER_PAGE = 20;

export function LeaderboardGrid({ players, category }: LeaderboardGridProps) {
  const [visiblePlayers, setVisiblePlayers] = useState<Player[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const observerRef = useRef<HTMLDivElement>(null);

  // Reset when category changes
  useEffect(() => {
    setPage(1);
    setVisiblePlayers(players.slice(0, ITEMS_PER_PAGE));
  }, [players, category]);

  // Load more items
  const loadMore = useCallback(() => {
    if (loading || visiblePlayers.length >= players.length) return;

    setLoading(true);
    setTimeout(() => {
      const nextPage = page + 1;
      const newItems = players.slice(0, nextPage * ITEMS_PER_PAGE);
      setVisiblePlayers(newItems);
      setPage(nextPage);
      setLoading(false);
    }, 500); // Simulate loading delay
  }, [loading, visiblePlayers.length, page, players]);

  // Intersection Observer for infinite scroll
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !loading && visiblePlayers.length < players.length) {
          loadMore();
        }
      },
      { threshold: 0.1 }
    );

    if (observerRef.current) {
      observer.observe(observerRef.current);
    }

    return () => observer.disconnect();
  }, [loadMore, loading, visiblePlayers.length, players.length]);

  if (!players.length) {
    return (
      <div className="text-center py-12">
        <p className="text-slate-400">No players found for this category.</p>
      </div>
    );
  }

  const topThree = players.slice(0, 3);
  const remainingPlayers = visiblePlayers.slice(3);

  return (
    <div className="space-y-8">
      {/* Top 3 Podium */}
      {topThree.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h3 className="text-2xl font-bold text-amber-400 mb-6 text-center font-serif">
            👑 Royal Podium
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {topThree.map((player) => (
              <PlayerCard
                key={player.player_id}
                player={player}
                rank={player.rank}
                variant="podium"
              />
            ))}
          </div>
        </motion.div>
      )}

      {/* Remaining Players Grid */}
      {remainingPlayers.length > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <h3 className="text-xl font-semibold text-slate-300 mb-4 font-serif">
            ⚔️ Knights of the Realm
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {remainingPlayers.map((player, index) => (
              <motion.div
                key={player.player_id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: (index % 8) * 0.05 }}
              >
                <PlayerCard
                  player={player}
                  rank={player.rank}
                  variant="grid"
                />
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Loading More */}
      {loading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {[...Array(8)].map((_, i) => (
            <PlayerSkeleton key={i} />
          ))}
        </div>
      )}

      {/* Load More Trigger */}
      <div ref={observerRef} className="h-10 flex items-center justify-center">
        {!loading && visiblePlayers.length < players.length && (
          <motion.button
            onClick={loadMore}
            className="px-6 py-2 bg-amber-400/20 hover:bg-amber-400/30 text-amber-400 rounded-lg font-medium transition-colors duration-300"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Load More Knights
          </motion.button>
        )}
      </div>

      {/* End of List */}
      {visiblePlayers.length >= players.length && players.length > ITEMS_PER_PAGE && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-8"
        >
          <p className="text-slate-400 font-serif">
            🏰 You have reached the end of the kingdom
          </p>
        </motion.div>
      )}
    </div>
  );
}