import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';
import { useBandData } from '../contexts/AdminContext';

const { FiPlay, FiPause, FiClock, FiCalendar, FiMic, FiVolumeX, FiVolume2 } = FiIcons;

const PodcastDiary = () => {
  const [currentEpisode, setCurrentEpisode] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.7);
  const [isLoading, setIsLoading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const audioRef = useRef(null);
  const progressBarRef = useRef(null);
  const bandData = useBandData();

  const episodes = bandData.podcasts.filter(podcast => podcast.isActive);

  // Audio event listeners
  useEffect(() => {
    if (audioRef.current) {
      const audio = audioRef.current;
      
      // Set initial volume
      audio.volume = volume;

      const handleTimeUpdate = () => {
        if (!isDragging) {
          setCurrentTime(audio.currentTime);
        }
      };

      const handleLoadedMetadata = () => {
        setDuration(audio.duration || 0);
        setIsLoading(false);
      };

      const handleCanPlay = () => {
        setIsLoading(false);
      };

      const handleLoadStart = () => {
        setIsLoading(true);
      };

      const handleEnded = () => {
        setIsPlaying(false);
        setCurrentTime(0);
      };

      const handleError = (e) => {
        console.error('Audio error:', e);
        setIsLoading(false);
        setIsPlaying(false);
      };

      const handlePlay = () => {
        setIsPlaying(true);
      };

      const handlePause = () => {
        setIsPlaying(false);
      };

      // Add event listeners
      audio.addEventListener('timeupdate', handleTimeUpdate);
      audio.addEventListener('loadedmetadata', handleLoadedMetadata);
      audio.addEventListener('canplay', handleCanPlay);
      audio.addEventListener('loadstart', handleLoadStart);
      audio.addEventListener('ended', handleEnded);
      audio.addEventListener('error', handleError);
      audio.addEventListener('play', handlePlay);
      audio.addEventListener('pause', handlePause);

      return () => {
        audio.removeEventListener('timeupdate', handleTimeUpdate);
        audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
        audio.removeEventListener('canplay', handleCanPlay);
        audio.removeEventListener('loadstart', handleLoadStart);
        audio.removeEventListener('ended', handleEnded);
        audio.removeEventListener('error', handleError);
        audio.removeEventListener('play', handlePlay);
        audio.removeEventListener('pause', handlePause);
      };
    }
  }, [audioRef, isDragging, volume]);

  // Update audio source when episode changes
  useEffect(() => {
    if (audioRef.current && currentEpisode?.audioUrl) {
      const audio = audioRef.current;
      
      // Reset state
      setCurrentTime(0);
      setDuration(0);
      setIsLoading(true);
      
      // Set new source
      audio.src = currentEpisode.audioUrl;
      audio.load();
      
      // Auto-play if was playing
      if (isPlaying) {
        audio.play().catch(error => {
          console.error('Auto-play failed:', error);
          setIsPlaying(false);
        });
      }
    }
  }, [currentEpisode?.audioUrl]);

  // Update volume when volume state changes
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  const handlePlayPause = (episode) => {
    if (currentEpisode?.id === episode.id) {
      if (isPlaying) {
        audioRef.current?.pause();
      } else {
        audioRef.current?.play().catch(error => {
          console.error('Play failed:', error);
          setIsPlaying(false);
        });
      }
    } else {
      setCurrentEpisode(episode);
      setIsPlaying(true);
      setCurrentTime(0);
    }
  };

  // Progress bar interaction
  const handleProgressClick = (e) => {
    if (audioRef.current && progressBarRef.current && duration > 0) {
      const progressBar = progressBarRef.current;
      const rect = progressBar.getBoundingClientRect();
      const clickX = e.clientX - rect.left;
      const newTime = (clickX / rect.width) * duration;
      
      audioRef.current.currentTime = newTime;
      setCurrentTime(newTime);
    }
  };

  const handleProgressMouseDown = (e) => {
    setIsDragging(true);
    handleProgressClick(e);
  };

  const handleProgressMouseMove = (e) => {
    if (isDragging && audioRef.current && progressBarRef.current && duration > 0) {
      const progressBar = progressBarRef.current;
      const rect = progressBar.getBoundingClientRect();
      const clickX = Math.max(0, Math.min(e.clientX - rect.left, rect.width));
      const newTime = (clickX / rect.width) * duration;
      
      audioRef.current.currentTime = newTime;
      setCurrentTime(newTime);
    }
  };

  const handleProgressMouseUp = () => {
    setIsDragging(false);
  };

  // Add global mouse events for dragging
  useEffect(() => {
    if (isDragging) {
      const handleMouseMove = (e) => handleProgressMouseMove(e);
      const handleMouseUp = () => handleProgressMouseUp();

      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);

      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging, duration]);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatTime = (time) => {
    if (isNaN(time) || time === 0) return '0:00';
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const toggleMute = () => {
    if (audioRef.current) {
      if (volume > 0) {
        setVolume(0);
      } else {
        setVolume(0.7);
      }
    }
  };

  // Calculate progress percentage
  const progressPercentage = duration > 0 ? (currentTime / duration) * 100 : 0;

  const handleSpotifySubscribe = () => {
    const spotifyUrl = bandData.band.socialLinks?.spotify || 'https://open.spotify.com/';
    window.open(spotifyUrl, '_blank', 'noopener,noreferrer');
  };

  const handleAppleSubscribe = () => {
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
                <div className="w-20 h-20 bg-gradient-to-r from-green-400 to-blue-400 rounded-2xl flex items-center justify-center relative">
                  <SafeIcon icon={FiMic} className="text-white text-2xl" />
                  {isLoading && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/20 rounded-2xl">
                      <div className="w-6 h-6 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
                    </div>
                  )}
                </div>
              </div>
              
              <div className="flex-1 min-w-0">
                <h3 className="text-xl font-semibold text-gray-800 mb-2">
                  {currentEpisode.title}
                </h3>
                <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                  {currentEpisode.description}
                </p>
                
                {/* Enhanced Progress Bar */}
                <div className="mb-4">
                  <div className="flex justify-between text-sm text-gray-600 mb-2">
                    <span>{formatTime(currentTime)}</span>
                    <span>{formatTime(duration)}</span>
                  </div>
                  <div
                    ref={progressBarRef}
                    className="w-full h-3 bg-gray-200 rounded-full cursor-pointer relative group"
                    onClick={handleProgressClick}
                    onMouseDown={handleProgressMouseDown}
                  >
                    <div
                      className="h-3 bg-gradient-to-r from-green-400 to-blue-400 rounded-full transition-all duration-150"
                      style={{ width: `${progressPercentage}%` }}
                    />
                    {/* Drag handle */}
                    <div
                      className="absolute top-1/2 transform -translate-y-1/2 w-5 h-5 bg-white rounded-full shadow-md cursor-grab active:cursor-grabbing opacity-0 group-hover:opacity-100 transition-opacity"
                      style={{ left: `calc(${progressPercentage}% - 10px)` }}
                      onMouseDown={(e) => {
                        e.stopPropagation();
                        handleProgressMouseDown(e);
                      }}
                    />
                  </div>
                </div>
                
                {/* Volume Control */}
                <div className="flex items-center space-x-3 mb-4">
                  <button
                    onClick={toggleMute}
                    className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                  >
                    <SafeIcon
                      icon={volume === 0 ? FiVolumeX : FiVolume2}
                      className="text-gray-600"
                    />
                  </button>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.1"
                    value={volume}
                    onChange={(e) => setVolume(parseFloat(e.target.value))}
                    className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer max-w-24"
                  />
                  <span className="text-xs text-gray-600 w-8">
                    {Math.round(volume * 100)}
                  </span>
                </div>
              </div>
              
              <div className="flex items-center space-x-4">
                <motion.button
                  onClick={() => handlePlayPause(currentEpisode)}
                  disabled={isLoading}
                  className="p-4 bg-gradient-to-r from-green-400 to-blue-400 rounded-full text-white shadow-lg hover:shadow-xl transition-all disabled:opacity-50"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {isLoading ? (
                    <div className="w-6 h-6 border-4 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <SafeIcon icon={isPlaying ? FiPause : FiPlay} className="text-xl" />
                  )}
                </motion.button>
              </div>
            </div>
            
            {/* Hidden Audio Element */}
            <audio
              ref={audioRef}
              preload="metadata"
              crossOrigin="anonymous"
            />
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