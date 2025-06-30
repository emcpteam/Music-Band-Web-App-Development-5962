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
  const [likedSongs, setLikedSongs] = useState(() => {
    // Load liked songs from localStorage
    try {
      const saved = localStorage.getItem('likedSongs');
      return saved ? JSON.parse(saved) : [];
    } catch (error) {
      return [];
    }
  });
  const [showShareMenu, setShowShareMenu] = useState(false);
  const [shareMessage, setShareMessage] = useState('');
  
  const bandData = useBandData();
  const { t } = useLanguage();
  
  const tracks = bandData.songs.filter(song => song.isActive);
  const currentAlbum = bandData.albums.find(album => album.isActive) || bandData.albums[0];
  const currentSong = tracks[currentTrack];

  // Save liked songs to localStorage whenever it changes
  useEffect(() => {
    try {
      localStorage.setItem('likedSongs', JSON.stringify(likedSongs));
    } catch (error) {
      console.error('Error saving liked songs:', error);
    }
  }, [likedSongs]);

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

  // Handle Like Button
  const handleLike = () => {
    if (!currentSong) return;

    const songId = currentSong.id;
    const isCurrentlyLiked = likedSongs.includes(songId);

    if (isCurrentlyLiked) {
      // Remove from liked songs
      setLikedSongs(prev => prev.filter(id => id !== songId));
      
      // Show feedback
      setShareMessage(`Removed "${currentSong.title}" from your favorites`);
    } else {
      // Add to liked songs
      setLikedSongs(prev => [...prev, songId]);
      
      // Show feedback
      setShareMessage(`Added "${currentSong.title}" to your favorites! ❤️`);
    }

    // Clear message after 3 seconds
    setTimeout(() => setShareMessage(''), 3000);
  };

  // Handle Share Button
  const handleShare = async () => {
    if (!currentSong) return;

    const shareData = {
      title: `${currentSong.title} - ${bandData.band.name}`,
      text: `Check out this amazing song "${currentSong.title}" by ${bandData.band.name}!`,
      url: window.location.href
    };

    // Try native Web Share API first (mobile devices)
    if (navigator.share) {
      try {
        await navigator.share(shareData);
        setShareMessage('Thanks for sharing! 🎵');
        setTimeout(() => setShareMessage(''), 3000);
        return;
      } catch (error) {
        console.log('Native share failed, showing share menu');
      }
    }

    // Fallback: Show custom share menu
    setShowShareMenu(true);
  };

  // Share to specific platforms
  const shareToTwitter = () => {
    const text = `🎵 Currently listening to "${currentSong.title}" by ${bandData.band.name} 🎵`;
    const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(window.location.href)}`;
    window.open(url, '_blank', 'noopener,noreferrer');
    setShowShareMenu(false);
    setShareMessage('Shared to Twitter! 🐦');
    setTimeout(() => setShareMessage(''), 3000);
  };

  const shareToFacebook = () => {
    const url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`;
    window.open(url, '_blank', 'noopener,noreferrer');
    setShowShareMenu(false);
    setShareMessage('Shared to Facebook! 📘');
    setTimeout(() => setShareMessage(''), 3000);
  };

  const copyToClipboard = async () => {
    const shareText = `🎵 Check out "${currentSong.title}" by ${bandData.band.name}! ${window.location.href}`;
    
    try {
      await navigator.clipboard.writeText(shareText);
      setShareMessage('Link copied to clipboard! 📋');
    } catch (error) {
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = shareText;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      setShareMessage('Link copied to clipboard! 📋');
    }
    
    setShowShareMenu(false);
    setTimeout(() => setShareMessage(''), 3000);
  };

  const isLiked = currentSong && likedSongs.includes(currentSong.id);

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
            className="theme-card p-8 shadow-xl relative"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            {/* Feedback Message */}
            <AnimatePresence>
              {shareMessage && (
                <motion.div
                  className="absolute top-4 left-4 right-4 bg-green-500 text-white px-4 py-2 rounded-lg text-center font-medium z-10"
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  {shareMessage}
                </motion.div>
              )}
            </AnimatePresence>

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
                <div className="theme-progress" style={{ width: '35%' }} />
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
            <div className="flex justify-center space-x-4 relative">
              <motion.button
                onClick={handleLike}
                className={`flex items-center space-x-2 px-4 py-2 rounded-full transition-all ${
                  isLiked 
                    ? 'bg-red-100 text-red-600' 
                    : 'bg-gray-100 text-gray-600 hover:bg-red-50 hover:text-red-500'
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <SafeIcon 
                  icon={FiHeart} 
                  className={`text-sm ${isLiked ? 'fill-current' : ''}`} 
                />
                <span className="text-sm">{isLiked ? 'Liked' : t('like')}</span>
              </motion.button>

              <motion.button
                onClick={handleShare}
                className="flex items-center space-x-2 px-4 py-2 bg-blue-50 text-blue-600 rounded-full hover:bg-blue-100 transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <SafeIcon icon={FiShare2} className="text-sm" />
                <span className="text-sm">{t('share')}</span>
              </motion.button>

              {/* Share Menu */}
              <AnimatePresence>
                {showShareMenu && (
                  <motion.div
                    className="absolute bottom-full mb-2 right-0 bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden z-20"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    transition={{ duration: 0.2 }}
                  >
                    <div className="p-2 space-y-1">
                      <button
                        onClick={shareToTwitter}
                        className="w-full text-left px-4 py-2 hover:bg-gray-50 rounded-lg transition-colors flex items-center space-x-2"
                      >
                        <span>🐦</span>
                        <span>Share on Twitter</span>
                      </button>
                      <button
                        onClick={shareToFacebook}
                        className="w-full text-left px-4 py-2 hover:bg-gray-50 rounded-lg transition-colors flex items-center space-x-2"
                      >
                        <span>📘</span>
                        <span>Share on Facebook</span>
                      </button>
                      <button
                        onClick={copyToClipboard}
                        className="w-full text-left px-4 py-2 hover:bg-gray-50 rounded-lg transition-colors flex items-center space-x-2"
                      >
                        <span>📋</span>
                        <span>Copy Link</span>
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
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
                            ? 'text-white border-2'
                            : 'hover:bg-gray-50'
                        }`}
                        style={{
                          backgroundImage: currentTrack === index 
                            ? `linear-gradient(45deg, var(--theme-primary), var(--theme-secondary))` 
                            : undefined,
                          borderColor: currentTrack === index ? 'var(--theme-primary)' : 'transparent'
                        }}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <div className="flex items-center space-x-4">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                            currentTrack === index
                              ? 'bg-white/20 text-white'
                              : 'bg-gray-200 text-gray-600'
                          }`}>
                            {currentTrack === index && isPlaying ? (
                              <SafeIcon icon={FiPause} className="text-sm" />
                            ) : (
                              <SafeIcon icon={FiPlay} className="text-sm" />
                            )}
                          </div>
                          <div className="text-left flex items-center space-x-2">
                            <div>
                              <p className={`font-medium ${
                                currentTrack === index ? 'text-white' : 'theme-text'
                              }`}>
                                {track.title}
                              </p>
                              <p className={`text-sm ${
                                currentTrack === index ? 'text-white/80' : 'text-gray-600'
                              }`}>
                                {getAlbumTitle(track.albumId)}
                              </p>
                            </div>
                            {likedSongs.includes(track.id) && (
                              <SafeIcon 
                                icon={FiHeart} 
                                className={`text-sm fill-current ${
                                  currentTrack === index ? 'text-white' : 'text-red-500'
                                }`} 
                              />
                            )}
                          </div>
                        </div>
                        <span className={`text-sm ${
                          currentTrack === index ? 'text-white/80' : 'text-gray-600'
                        }`}>
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

      {/* Backdrop for share menu */}
      {showShareMenu && (
        <div 
          className="fixed inset-0 z-10" 
          onClick={() => setShowShareMenu(false)}
        />
      )}
    </div>
  );
};

export default MusicPlayer;