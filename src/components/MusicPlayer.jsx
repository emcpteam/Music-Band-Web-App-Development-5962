import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';
import { useBandData } from '../contexts/AdminContext';
import { useLanguage } from '../contexts/LanguageContext';

const { FiPlay, FiPause, FiSkipBack, FiSkipForward, FiVolume2, FiHeart, FiShare2 } = FiIcons;

const MusicPlayer = ({ currentTrack, setCurrentTrack, isPlaying, setIsPlaying, audioRef }) => {
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.7);
  const [showLyrics, setShowLyrics] = useState(true);
  const bandData = useBandData();
  const { t } = useLanguage();

  const tracks = bandData.songs.filter(song => song.isActive);
  const currentAlbum = bandData.albums.find(album => album.isActive) || bandData.albums[0];

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  const handlePlayPause = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleTrackSelect = (index) => {
    setCurrentTrack(index);
    setIsPlaying(false);
  };

  const handlePrevious = () => {
    setCurrentTrack(currentTrack > 0 ? currentTrack - 1 : tracks.length - 1);
  };

  const handleNext = () => {
    setCurrentTrack(currentTrack < tracks.length - 1 ? currentTrack + 1 : 0);
  };

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const getAlbumTitle = (albumId) => {
    const album = bandData.albums.find(a => a.id === albumId);
    return album ? album.title : bandData.band.name;
  };

  if (tracks.length === 0) {
    return (
      <div className="min-h-screen theme-gradient-bg py-20 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold theme-text mb-4">{t('musicPlayer')}</h2>
          <p className="text-xl text-gray-600 font-light mb-8">{t('noSongsYet')}</p>
          <div className="theme-card p-8 shadow-xl">
            <p className="text-gray-600">{t('songsWillAppear')}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen theme-gradient-bg py-20 px-4">
      <div className="max-w-6xl mx-auto">
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-4xl md:text-5xl font-bold theme-text mb-4">
            {t('musicPlayer')}
          </h2>
          <p className="text-xl text-gray-600 font-light">
            {t('immersiveExperience')}
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Player Section */}
          <motion.div
            className="theme-card p-8 shadow-xl"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            {/* Current Track Info */}
            <div className="text-center mb-8">
              <div className="w-48 h-48 mx-auto mb-6 relative">
                <img
                  src={currentAlbum?.cover || "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=400&fit=crop&crop=center"}
                  alt={tracks[currentTrack]?.title}
                  className="w-full h-full rounded-2xl object-cover shadow-lg"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-2xl"></div>
              </div>
              <h3 className="text-2xl font-semibold theme-text mb-2">
                {tracks[currentTrack]?.title}
              </h3>
              <p className="text-gray-600">{bandData.band.name}</p>
            </div>

            {/* Controls */}
            <div className="flex items-center justify-center space-x-6 mb-6">
              <motion.button
                onClick={handlePrevious}
                className="p-3 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <SafeIcon icon={FiSkipBack} className="text-xl text-gray-700" />
              </motion.button>

              <motion.button
                onClick={handlePlayPause}
                className="p-4 rounded-full text-white shadow-lg hover:shadow-xl transition-all btn-primary"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <SafeIcon icon={isPlaying ? FiPause : FiPlay} className="text-2xl" />
              </motion.button>

              <motion.button
                onClick={handleNext}
                className="p-3 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <SafeIcon icon={FiSkipForward} className="text-xl text-gray-700" />
              </motion.button>
            </div>

            {/* Progress Bar */}
            <div className="mb-6">
              <div className="flex justify-between text-sm text-gray-600 mb-2">
                <span>{formatTime(currentTime)}</span>
                <span>{tracks[currentTrack]?.duration}</span>
              </div>
              <div className="theme-progress-bg">
                <div 
                  className="theme-progress"
                  style={{ width: '35%' }}
                />
              </div>
            </div>

            {/* Volume Control */}
            <div className="flex items-center space-x-4 mb-6">
              <SafeIcon icon={FiVolume2} className="text-gray-600" />
              <input
                type="range"
                min="0"
                max="1"
                step="0.1"
                value={volume}
                onChange={(e) => setVolume(e.target.value)}
                className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              />
            </div>

            {/* Action Buttons */}
            <div className="flex justify-center space-x-4">
              <motion.button
                className="flex items-center space-x-2 px-4 py-2 bg-red-50 text-red-600 rounded-full hover:bg-red-100 transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <SafeIcon icon={FiHeart} className="text-sm" />
                <span className="text-sm">{t('like')}</span>
              </motion.button>

              <motion.button
                className="flex items-center space-x-2 px-4 py-2 bg-blue-50 text-blue-600 rounded-full hover:bg-blue-100 transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <SafeIcon icon={FiShare2} className="text-sm" />
                <span className="text-sm">{t('share')}</span>
              </motion.button>
            </div>

            {/* Hidden Audio Element */}
            <audio ref={audioRef} src={tracks[currentTrack]?.audioUrl} />
          </motion.div>

          {/* Lyrics & Track List */}
          <motion.div
            className="space-y-6"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            {/* Toggle Buttons */}
            <div className="flex theme-card p-2">
              <button
                onClick={() => setShowLyrics(true)}
                className={`flex-1 py-3 px-4 rounded-xl transition-all ${
                  showLyrics 
                    ? 'text-white shadow-lg btn-primary' 
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                {t('lyricsNotes')}
              </button>
              <button
                onClick={() => setShowLyrics(false)}
                className={`flex-1 py-3 px-4 rounded-xl transition-all ${
                  !showLyrics 
                    ? 'text-white shadow-lg btn-primary' 
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                {t('trackList')}
              </button>
            </div>

            <AnimatePresence mode="wait">
              {showLyrics ? (
                <motion.div
                  key="lyrics"
                  className="theme-card p-6 shadow-lg"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <h4 className="text-xl font-semibold theme-text mb-4">
                    {tracks[currentTrack]?.title} - Lyrics
                  </h4>
                  <div className="theme-text whitespace-pre-line mb-6 leading-relaxed">
                    {tracks[currentTrack]?.lyrics || t('noLyricsAvailable')}
                  </div>
                  {tracks[currentTrack]?.notes && (
                    <div className="border-t pt-4">
                      <h5 className="font-medium theme-text mb-2">{t('artistNotes')}</h5>
                      <p className="text-gray-600 text-sm leading-relaxed">
                        {tracks[currentTrack].notes}
                      </p>
                    </div>
                  )}
                </motion.div>
              ) : (
                <motion.div
                  key="tracklist"
                  className="theme-card p-6 shadow-lg"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <h4 className="text-xl font-semibold theme-text mb-4">{t('trackList')}</h4>
                  <div className="space-y-2">
                    {tracks.map((track, index) => (
                      <motion.button
                        key={track.id}
                        onClick={() => handleTrackSelect(index)}
                        className={`w-full flex items-center justify-between p-4 rounded-xl transition-all ${
                          currentTrack === index
                            ? 'bg-gradient-to-r theme-gradient text-white border-2'
                            : 'hover:bg-gray-50'
                        }`}
                        style={{
                          background: currentTrack === index 
                            ? `linear-gradient(45deg, var(--theme-primary), var(--theme-secondary))` 
                            : undefined,
                          borderColor: currentTrack === index 
                            ? 'var(--theme-primary)' 
                            : 'transparent'
                        }}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <div className="flex items-center space-x-4">
                          <div 
                            className={`w-8 h-8 rounded-full flex items-center justify-center ${
                              currentTrack === index 
                                ? 'bg-white/20 text-white' 
                                : 'bg-gray-200 text-gray-600'
                            }`}
                          >
                            {currentTrack === index && isPlaying ? (
                              <SafeIcon icon={FiPause} className="text-sm" />
                            ) : (
                              <SafeIcon icon={FiPlay} className="text-sm" />
                            )}
                          </div>
                          <div className="text-left">
                            <p 
                              className={`font-medium ${
                                currentTrack === index ? 'text-white' : 'theme-text'
                              }`}
                            >
                              {track.title}
                            </p>
                            <p 
                              className={`text-sm ${
                                currentTrack === index ? 'text-white/80' : 'text-gray-600'
                              }`}
                            >
                              {getAlbumTitle(track.albumId)}
                            </p>
                          </div>
                        </div>
                        <span 
                          className={`text-sm ${
                            currentTrack === index ? 'text-white/80' : 'text-gray-600'
                          }`}
                        >
                          {track.duration}
                        </span>
                      </motion.button>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default MusicPlayer;