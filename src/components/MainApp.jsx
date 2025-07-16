import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import { useAdmin } from '../contexts/AdminContext';
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
  const { data } = useAdmin();
  const audioRef = useRef(null);

  // Refs for navigation
  const heroRef = useRef(null);
  const musicRef = useRef(null);
  const bookletRef = useRef(null);
  const podcastRef = useRef(null);
  const fanWallRef = useRef(null);
  const merchRef = useRef(null);

  // Get section visibility settings from data
  const { sectionVisibility } = data.band;

  // Function to scroll to a specific section
  const scrollToSection = (ref) => {
    if (ref && ref.current) {
      ref.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-pastel font-poppins" key={themeUpdateTrigger}>
      <MetaTags />
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
        <section ref={heroRef}>
          <Hero onPlayClick={() => scrollToSection(musicRef)} />
        </section>
        
        <section ref={musicRef}>
          <MusicPlayer
            currentTrack={currentTrack}
            setCurrentTrack={setCurrentTrack}
            isPlaying={isPlaying}
            setIsPlaying={setIsPlaying}
            audioRef={audioRef}
          />
        </section>
        
        {sectionVisibility.gallery && (
          <section ref={bookletRef}>
            <MultimediaBooklet />
          </section>
        )}
        
        {sectionVisibility.podcast && (
          <section ref={podcastRef}>
            <PodcastDiary />
          </section>
        )}
        
        {sectionVisibility.fanWall && (
          <section ref={fanWallRef}>
            <FanWall />
          </section>
        )}
        
        {sectionVisibility.merchandising && (
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