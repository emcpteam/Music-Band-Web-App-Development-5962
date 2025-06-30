import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';
import { useBandData } from '../contexts/AdminContext';

const { FiPlay, FiPause, FiClock, FiCalendar, FiMic } = FiIcons;

const PodcastDiary = () => {
  const [currentEpisode, setCurrentEpisode] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const audioRef = useRef(null);
  const bandData = useBandData();

  const episodes = bandData.podcasts.filter(podcast => podcast.isActive);

  const handlePlayPause = (episode) => {
    if (currentEpisode?.id === episode.id) {
      if (isPlaying) {
        audioRef.current?.pause();
        setIsPlaying(false);
      } else {
        audioRef.current?.play();
        setIsPlaying(true);
      }
    } else {
      setCurrentEpisode(episode);
      setIsPlaying(true);
      // In a real app, you'd load the new audio source here
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const handleSpotifySubscribe = () => {
    const spotifyUrl = bandData.band.socialLinks?.spotify || 'https://open.spotify.com/';
    window.open(spotifyUrl, '_blank', 'noopener,noreferrer');
  };

  const handleAppleSubscribe = () => {
    // Generate Apple Podcasts URL based on band name
    const bandName = encodeURIComponent(bandData.band.name);
    const appleUrl = `https://podcasts.apple.com/search?term=${bandName}`;
    window.open(appleUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50 py-20 px-4">
      <div className="max-w-6xl mx-auto">
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex items-center justify-center mb-6">
            <div className="w-16 h-16 bg-gradient-to-r from-green-400 to-blue-400 rounded-full flex items-center justify-center mr-4">
              <SafeIcon icon={FiMic} className="text-white text-2xl" />
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-800">
              Podcast Diary
            </h2>
          </div>
          <p className="text-xl text-gray-600 font-light">
            Intimate conversations and behind-the-scenes stories
          </p>
        </motion.div>

        {/* Current Episode Player */}
        {currentEpisode && (
          <motion.div
            className="bg-white/70 backdrop-blur-md rounded-3xl p-8 shadow-xl mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="flex flex-col md:flex-row items-start md:items-center space-y-4 md:space-y-0 md:space-x-6">
              <div className="flex-shrink-0">
                <div className="w-20 h-20 bg-gradient-to-r from-green-400 to-blue-400 rounded-2xl flex items-center justify-center">
                  <SafeIcon icon={FiMic} className="text-white text-2xl" />
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-xl font-semibold text-gray-800 mb-2">
                  {currentEpisode.title}
                </h3>
                <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                  {currentEpisode.description}
                </p>
                {/* Progress Bar */}
                <div className="mb-4">
                  <div className="flex justify-between text-sm text-gray-600 mb-2">
                    <span>{formatTime(currentTime)}</span>
                    <span>{currentEpisode.duration}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-gradient-to-r from-green-400 to-blue-400 h-2 rounded-full transition-all duration-300"
                      style={{ width: '25%' }}
                    ></div>
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <motion.button
                  onClick={() => handlePlayPause(currentEpisode)}
                  className="p-4 bg-gradient-to-r from-green-400 to-blue-400 rounded-full text-white shadow-lg hover:shadow-xl transition-all"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <SafeIcon icon={isPlaying ? FiPause : FiPlay} className="text-xl" />
                </motion.button>
              </div>
            </div>
            <audio ref={audioRef} src={currentEpisode.audioUrl} />
          </motion.div>
        )}

        {/* Episodes List */}
        {episodes.length > 0 ? (
          <div className="space-y-6">
            {episodes.map((episode, index) => (
              <motion.div
                key={episode.id}
                className={`bg-white/70 backdrop-blur-md rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all cursor-pointer ${
                  currentEpisode?.id === episode.id ? 'ring-2 ring-green-400' : ''
                }`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ y: -2 }}
                onClick={() => handlePlayPause(episode)}
              >
                <div className="flex flex-col md:flex-row items-start md:items-center space-y-4 md:space-y-0 md:space-x-6">
                  <div className="flex-shrink-0">
                    <div className="relative">
                      <div className="w-16 h-16 bg-gradient-to-r from-green-400 to-blue-400 rounded-xl flex items-center justify-center">
                        <SafeIcon 
                          icon={currentEpisode?.id === episode.id && isPlaying ? FiPause : FiPlay} 
                          className="text-white text-xl" 
                        />
                      </div>
                      {episode.isNew && (
                        <div className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center">
                          <span className="text-white text-xs font-bold">N</span>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2 mb-2">
                      <h3 className="text-xl font-semibold text-gray-800">{episode.title}</h3>
                      {episode.isNew && (
                        <span className="px-2 py-1 bg-red-100 text-red-600 text-xs font-medium rounded-full">
                          New
                        </span>
                      )}
                    </div>
                    <p className="text-gray-600 mb-4 leading-relaxed">
                      {episode.description}
                    </p>
                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                      <div className="flex items-center space-x-1">
                        <SafeIcon icon={FiCalendar} className="text-xs" />
                        <span>{formatDate(episode.publishDate)}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <SafeIcon icon={FiClock} className="text-xs" />
                        <span>{episode.duration}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex-shrink-0">
                    <motion.button
                      className="px-6 py-3 bg-gradient-to-r from-green-400 to-blue-400 text-white rounded-full font-medium hover:shadow-lg transition-all"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      {currentEpisode?.id === episode.id && isPlaying ? 'Pause' : 'Play'}
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <SafeIcon icon={FiMic} className="text-4xl text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">No Podcast Episodes Yet</h3>
            <p className="text-gray-600">Podcast episodes will appear here when published by the band.</p>
          </div>
        )}

        {/* Subscribe Section */}
        <motion.div
          className="mt-16 text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
        >
          <div className="bg-gradient-to-r from-green-400 to-blue-400 rounded-3xl p-8 text-white">
            <h3 className="text-2xl font-bold mb-4">Never Miss an Episode</h3>
            <p className="text-lg mb-6 opacity-90">
              Subscribe to our podcast diary and get notified when we drop new episodes
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4">
              <motion.button
                onClick={handleSpotifySubscribe}
                className="px-8 py-3 bg-white text-green-600 rounded-full font-semibold hover:bg-gray-100 transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Subscribe on Spotify
              </motion.button>
              <motion.button
                onClick={handleAppleSubscribe}
                className="px-8 py-3 bg-white/20 text-white rounded-full font-semibold hover:bg-white/30 transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Subscribe on Apple Podcasts
              </motion.button>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default PodcastDiary;