import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import { useAdmin, useBandData } from '../contexts/AdminContext';
import Hero from './Hero';
import MusicPlayer from './MusicPlayer';
import MultimediaBooklet from './MultimediaBooklet';
import PodcastDiary from './PodcastDiary';
import FanWall from './FanWall';
import Merchandising from './Merchandising';
import Footer from './Footer';
import Navigation from './Navigation';
import TrackingCodes from './TrackingCodes';
import MetaTags from './MetaTags';

const MainApp = () => {
  const [currentTrack, setCurrentTrack] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const { themeUpdateTrigger } = useAdmin();
  const bandData = useBandData();
  const audioRef = useRef(null);

  // Refs for navigation
  const heroRef = useRef(null);
  const musicRef = useRef(null);
  const bookletRef = useRef(null);
  const podcastRef = useRef(null);
  const fanWallRef = useRef(null);
  const merchRef = useRef(null);

  // Get sections configuration
  const sections = bandData.band.sections || {};

  // Listen for theme updates and force component re-render
  useEffect(() => {
    const handleThemeUpdate = () => {
      // Force re-render by updating a state
      setCurrentTrack(prev => prev); // Dummy state update to trigger re-render
    };

    window.addEventListener('themeUpdated', handleThemeUpdate);
    window.addEventListener('themePreviewUpdate', handleThemeUpdate);

    return () => {
      window.removeEventListener('themeUpdated', handleThemeUpdate);
      window.removeEventListener('themePreviewUpdate', handleThemeUpdate);
    };
  }, []);

  const scrollToSection = (sectionRef) => {
    sectionRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div 
      className="min-h-screen bg-gradient-pastel font-poppins" 
      key={themeUpdateTrigger} // Force re-render when theme changes
    >
      {/* SEO Meta Tags */}
      <MetaTags />

      {/* Analytics & Tracking Codes */}
      <TrackingCodes />

      <Navigation 
        onNavigate={scrollToSection}
        refs={{ heroRef, musicRef, bookletRef, podcastRef, fanWallRef, merchRef }}
      />

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        {/* Hero Section - Always enabled */}
        {sections.hero?.enabled !== false && (
          <section ref={heroRef}>
            <Hero onPlayClick={() => scrollToSection(musicRef)} />
          </section>
        )}

        {/* Music Section */}
        {sections.music?.enabled !== false && (
          <section ref={musicRef}>
            <MusicPlayer
              currentTrack={currentTrack}
              setCurrentTrack={setCurrentTrack}
              isPlaying={isPlaying}
              setIsPlaying={setIsPlaying}
              audioRef={audioRef}
            />
          </section>
        )}

        {/* Gallery Section */}
        {sections.gallery?.enabled !== false && (
          <section ref={bookletRef}>
            <MultimediaBooklet />
          </section>
        )}

        {/* Podcast Section */}
        {sections.podcast?.enabled !== false && (
          <section ref={podcastRef}>
            <PodcastDiary />
          </section>
        )}

        {/* Fan Wall Section */}
        {sections.fanWall?.enabled !== false && (
          <section ref={fanWallRef}>
            <FanWall />
          </section>
        )}

        {/* Merchandising Section */}
        {sections.merchandising?.enabled !== false && (
          <section ref={merchRef}>
            <Merchandising />
          </section>
        )}

        <Footer />
      </motion.div>
    </div>
  );
};

export default MainApp;