import { useParams } from 'react-router-dom';
import { ExternalLink } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion'; // Added AnimatePresence
import { Button } from '@/components/ui/button';
import Navbar from '@/components/Navbar';
import { VideoPlayer } from '@/components/player/VideoPlayer';
import VideoSourceSelector from '@/components/player/VideoSourceSelector';
import EpisodeNavigation from '@/components/player/EpisodeNavigation';
import MediaActions from '@/components/player/MediaActions';
import { useMediaPlayer } from '@/hooks/use-media-player';
import { videoSources } from '@/utils/video-sources';
import { useAuth } from '@/hooks';
import { useState } from 'react'; // Added useState

const Player = () => {
  const { id, season, episode, type } = useParams<{
    id: string;
    season?: string;
    episode?: string;
    type: string;
  }>();
  const { user } = useAuth();
  
  const {
    title,
    mediaType,
    mediaDetails,
    episodes,
    currentEpisodeIndex,
    isLoading,
    isPlayerLoaded,
    iframeUrl,
    selectedSource,
    isFavorite,
    isInMyWatchlist,
    handleSourceChange,
    goToDetails,
    goToNextEpisode,
    goToPreviousEpisode,
    toggleFavorite,
    toggleWatchlist,
    handlePlayerLoaded,
    handlePlayerError,
    goBack
  } = useMediaPlayer(id, season, episode, type);

  const posterUrl = mediaDetails ? 
    `https://image.tmdb.org/t/p/w1280${mediaDetails.backdrop_path}` 
    : undefined;

  // State for controlling the PartyWatch modal
  const [isPartyWatchModalOpen, setIsPartyWatchModalOpen] = useState(false);

  // Function to handle PartyWatch button click
  const handlePartyWatchClick = () => {
    setIsPartyWatchModalOpen(true);
    // Automatically close the modal after 3 seconds
    setTimeout(() => {
      setIsPartyWatchModalOpen(false);
    }, 3000);
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen bg-background relative"
    >
      <div className="fixed inset-0 bg-gradient-to-b from-background/95 to-background pointer-events-none" />
      
      <motion.nav 
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5 }}
        className="sticky top-0 z-30"
      >
        <Navbar />
      </motion.nav>

      <div className="container mx-auto py-8">
        <MediaActions
          isFavorite={isFavorite}
          isInWatchlist={isInMyWatchlist}
          onToggleFavorite={toggleFavorite}
          onToggleWatchlist={toggleWatchlist}
          onBack={goBack}
          onViewDetails={goToDetails}
        />

        <VideoPlayer 
          isLoading={isLoading}
          iframeUrl={iframeUrl}
          title={title}
          poster={posterUrl}
          onLoaded={handlePlayerLoaded}
          onError={handlePlayerError}
        />

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-6 space-y-6"
        >
          {mediaType === 'tv' && episodes.length > 0 && (
            <EpisodeNavigation 
              episodes={episodes}
              currentEpisodeIndex={currentEpisodeIndex}
              onPreviousEpisode={goToPreviousEpisode}
              onNextEpisode={goToNextEpisode}
            />
          )}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-medium text-white">Video Sources</h3>
                <p className="text-sm text-white/60">Select your preferred streaming source</p>
              </div>
              <div className="flex space-x-2"> {/* Added flex container for buttons */}
                <Button
                  variant="outline"
                  size="sm"
                  className="border-white/10 bg-white/5 backdrop-blur-sm hover:bg-white/10 transition-all duration-300"
                  onClick={goToDetails}
                >
                  <ExternalLink className="h-4 w-4 mr-2" />
                  View Details
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="border-white/10 bg-white/5 backdrop-blur-sm hover:bg-white/10 transition-all duration-300"
                  onClick={handlePartyWatchClick}
                >
                  PartyWatch
                </Button>
              </div>
            </div>
            <VideoSourceSelector 
              videoSources={videoSources}
              selectedSource={selectedSource}
              onSourceChange={handleSourceChange}
            />
          </div>
        </motion.div>

        {/* PartyWatch Modal */}
        <AnimatePresence>
          {isPartyWatchModalOpen && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.3, ease: 'easeInOut' }}
              className="fixed inset-0 flex items-center justify-center z-50"
            >
              <div className="bg-white/10 backdrop-blur-md p-6 rounded-lg shadow-lg border border-white/20 max-w-sm w-full text-center">
                <motion.h3
                  initial={{ y: 10 }}
                  animate={{ y: 0 }}
                  transition={{ duration: 0.4, delay: 0.1 }}
                  className="text-lg font-semibold text-white"
                >
                  PartyWatch Coming Soon!
                </motion.h3>
                <motion.p
                  initial={{ y: 10 }}
                  animate={{ y: 0 }}
                  transition={{ duration: 0.4, delay: 0.2 }}
                  className="text-sm text-white/80 mt-2"
                >
                  This feature will be live by the end of September. Stay tuned!
                </motion.p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default Player;
