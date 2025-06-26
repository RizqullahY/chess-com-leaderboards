import { motion } from 'framer-motion';
import { Github, ExternalLink, Crown } from 'lucide-react';

export function Header() {
  const links = [
    {
      name: 'GitHub',
      url: 'https://github.com/RizqullahY/chess-com-leaderboards',
      icon: Github,
      description: 'View source code'
    },
    {
      name: 'PublicAPI.dev',
      url: 'https://publicapi.dev/chess-com-api',
      icon: ExternalLink,
      description: 'Discover public APIs'
    },
    {
      name: 'Chess.com',
      url: 'https://chess.com',
      icon: Crown,
      description: 'Play chess online'
    }
  ];

  return (
    <motion.header
      className="fixed top-0 left-0 right-0 z-50 bg-slate-900/95 backdrop-blur-sm border-b border-slate-800"
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <div className="max-w-7xl mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <motion.div
            className="flex items-center gap-2"
            whileHover={{ scale: 1.05 }}
          >
            <Crown className="w-8 h-8 text-amber-400" />
            <span className="text-xl font-bold text-white font-serif">
              Royal Rankings
            </span>
          </motion.div>

          {/* External Links */}
          <nav className="flex items-center gap-4">
            {links.map((link) => {
              const Icon = link.icon;
              return (
                <motion.a
                  key={link.name}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-3 py-2 text-slate-300 hover:text-amber-400 hover:bg-slate-800/50 rounded-lg transition-all duration-300 group"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  title={link.description}
                >
                  <Icon className="w-4 h-4" />
                  <span className="hidden sm:inline text-sm font-medium">
                    {link.name}
                  </span>
                  <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                </motion.a>
              );
            })}
          </nav>
        </div>
      </div>
    </motion.header>
  );
}