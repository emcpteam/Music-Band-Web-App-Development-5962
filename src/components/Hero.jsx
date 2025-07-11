import React from 'react';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';
import { useBandData } from '../contexts/AdminContext';
import { useLanguage } from '../contexts/LanguageContext';

const { FiPlay, FiMusic } = FiIcons;

const Hero = ({ onPlayClick }) => {
  const bandData = useBandData();
  const { t } = useLanguage();

  const currentAlbum = bandData.albums.find(album => album.isActive) || bandData.albums[0];
  const theme = bandData.theme;

  // Helper function to convert hex to RGB values
  const hexToRgb = (hex) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? { r: parseInt(result[1], 16), g: parseInt(result[2], 16), b: parseInt(result[3], 16) } : { r: 139, g: 92, b: 246 }; // Fallback to primary color
  };

  // Generate gradient based on theme settings
  const generateGradient = () => {
    const { primaryColor, secondaryColor, accentColor, gradientDirection = '45deg', gradientPattern = 'linear' } = theme;
    switch (gradientPattern) {
      case 'radial': return `radial-gradient(circle, ${primaryColor} 0%, ${secondaryColor} 100%)`;
      case 'conic': return `conic-gradient(from ${gradientDirection}, ${primaryColor}, ${secondaryColor}, ${accentColor}, ${primaryColor})`;
      case 'multi-stop': return `linear-gradient(${gradientDirection}, ${primaryColor} 0%, ${accentColor} 50%, ${secondaryColor} 100%)`;
      case 'linear': default: return `linear-gradient(${gradientDirection}, ${primaryColor}, ${secondaryColor})`;
    }
  };

  // Get background style based on theme settings
  const getBackgroundStyle = () => {
    const backgroundType = theme?.heroBackgroundType || 'gradient';
    const backgroundImage = theme?.heroBackgroundImage;
    const overlayOpacity = theme?.heroOverlayOpacity || 0.3;
    const primaryRgb = hexToRgb(theme?.primaryColor || '#8B5CF6');
    const secondaryRgb = hexToRgb(theme?.secondaryColor || '#EC4899');

    switch (backgroundType) {
      case 'image':
        if (backgroundImage) {
          return {
            backgroundImage: `url(${backgroundImage})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            backgroundAttachment: 'fixed'
          };
        }
        break;
      case 'overlay':
        if (backgroundImage) {
          return {
            backgroundImage: `linear-gradient(rgba(${primaryRgb.r}, ${primaryRgb.g}, ${primaryRgb.b}, ${overlayOpacity}), rgba(${secondaryRgb.r}, ${secondaryRgb.g}, ${secondaryRgb.b}, ${overlayOpacity})), url(${backgroundImage})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            backgroundAttachment: 'fixed'
          };
        }
        break;
      case 'pattern':
        return {
          background: generateGradient(),
          backgroundSize: '400% 400%'
        };
      case 'animated':
        return {
          background: generateGradient(),
          backgroundSize: '400% 400%',
          animation: 'gradient-shift 6s ease-in-out infinite'
        };
      case 'gradient': default:
        return {
          background: generateGradient()
        };
    }
    // Fallback to default gradient
    return {
      background: generateGradient()
    };
  };

  // Get hero title style based on theme settings
  const getHeroTitleStyle = () => {
    const hasCustomBackground = theme?.heroBackgroundType === 'image' || theme?.heroBackgroundType === 'overlay';
    switch (theme?.heroTitleStyle) {
      case 'solid':
        return {
          color: theme.heroTitleColor || '#FFFFFF',
          textShadow: theme.heroTitleShadow ? '2px 2px 4px rgba(0, 0, 0, 0.5)' : 'none'
        };
      case 'gradient':
        return {
          background: generateGradient(),
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
          textShadow: theme.heroTitleShadow ? '2px 2px 4px rgba(0, 0, 0, 0.5)' : 'none'
        };
      case 'auto': default:
        if (hasCustomBackground) {
          return {
            color: 'white',
            textShadow: '2px 2px 4px rgba(0, 0, 0, 0.5)'
          };
        } else {
          return {
            background: generateGradient(),
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text'
          };
        }
    }
  };

  const backgroundStyle = getBackgroundStyle();
  const heroTitleStyle = getHeroTitleStyle();
  const hasCustomBackground = theme?.heroBackgroundType === 'image' || theme?.heroBackgroundType === 'overlay';

  return (
    <>
      {/* Add CSS for animated gradients */}
      <style jsx>{`
        @keyframes gradient-shift {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
      `}</style>
      <div className="relative min-h-screen flex items-center justify-center overflow-hidden" style={backgroundStyle}>
        {/* Background Pattern with theme colors - only show if not using custom background */}
        {!hasCustomBackground && (
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full blur-3xl" style={{ backgroundColor: 'var(--theme-primary)' }} />
            <div className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full blur-3xl" style={{ backgroundColor: 'var(--theme-secondary)' }} />
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full blur-3xl" style={{ backgroundColor: 'var(--theme-accent)' }} />
          </div>
        )}
        
        {/* Content Overlay for better readability on custom backgrounds */}
        {hasCustomBackground && (
          <div className="absolute inset-0 bg-black/20 backdrop-blur-[1px]" />
        )}
        
        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
          {/* Album Cover */}
          <motion.div className="mb-8 flex justify-center"
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ duration: 1, ease: "easeOut" }}
          >
            <div className="relative">
              <img 
                src={currentAlbum?.cover || "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=400&fit=crop&crop=center"} 
                alt={`${bandData.band.name} - ${currentAlbum?.title || 'Album'} Cover`} 
                className="w-64 h-64 md:w-80 md:h-80 rounded-2xl shadow-2xl object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-2xl"></div>
            </div>
          </motion.div>
          
          {/* Band Name & Logo */}
          <motion.div className="mb-8"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            <div className="flex items-center justify-center mb-4">
              <div className="w-12 h-12 rounded-full flex items-center justify-center mr-4" style={{ background: generateGradient() }}>
                <SafeIcon icon={FiMusic} className="text-white text-xl" />
              </div>
              <h1 className="text-4xl md:text-6xl font-bold" style={heroTitleStyle}>
                {bandData.band.name}
              </h1>
            </div>
            <p className={`text-xl md:text-2xl font-light ${hasCustomBackground ? 'text-white' : 'text-gray-600'} text-center`} style={hasCustomBackground ? { textShadow: '1px 1px 2px rgba(0, 0, 0, 0.5)' } : {}}>
              {bandData.band.tagline}
            </p>
          </motion.div>
          
          {/* Listen Now Button */}
          <motion.button 
            onClick={onPlayClick}
            className="group relative inline-flex items-center space-x-3 text-white px-8 py-4 rounded-full text-lg font-medium shadow-lg hover:shadow-xl transition-all duration-300"
            style={{ background: generateGradient() }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
          >
            <SafeIcon icon={FiPlay} className="text-xl group-hover:animate-pulse" />
            <span>{t('listenNow')}</span>
            <div className="absolute inset-0 bg-white/20 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          </motion.button>
          
          {/* Floating Elements with theme colors - only show if not using custom background */}
          {!hasCustomBackground && (
            <>
              <motion.div 
                className="absolute top-20 left-10 w-20 h-20 rounded-full opacity-60" 
                style={{ backgroundColor: 'var(--theme-primary)' }}
                animate={{ y: [0, -20, 0], rotate: [0, 180, 360] }}
                transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
              />
              <motion.div 
                className="absolute bottom-20 right-10 w-16 h-16 rounded-full opacity-60" 
                style={{ backgroundColor: 'var(--theme-secondary)' }}
                animate={{ y: [0, 20, 0], rotate: [0, -180, -360] }}
                transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
              />
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default Hero;