import React,{useState} from 'react';
import {motion,AnimatePresence} from 'framer-motion';
import {useNavigate} from 'react-router-dom';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';
import {useBandData} from '../contexts/AdminContext';
import {useLanguage} from '../contexts/LanguageContext';
import {useAuth} from '../contexts/AuthContext';
import LanguageSelector from './common/LanguageSelector';
import CartButton from './cart/CartButton';

const {FiMenu,FiX,FiMusic,FiImage,FiMic,FiMessageCircle,FiShoppingBag,FiHome,FiShield,FiGlobe,FiUser,FiLogIn,FiLogOut} = FiIcons;

const Navigation = ({onNavigate,refs}) => {
  const [isOpen,setIsOpen] = useState(false);
  const [showProfileMenu,setShowProfileMenu] = useState(false);
  const navigate = useNavigate();
  const bandData = useBandData();
  const {t} = useLanguage();
  const {isAuthenticated,user,logout} = useAuth();

  const navItems = [
    {icon: FiHome,label: t('home'),ref: refs.heroRef},
    {icon: FiMusic,label: t('music'),ref: refs.musicRef},
    {icon: FiImage,label: t('gallery'),ref: refs.bookletRef},
    {icon: FiMic,label: t('podcast'),ref: refs.podcastRef},
    {icon: FiMessageCircle,label: t('fanWall'),ref: refs.fanWallRef},
    {icon: FiShoppingBag,label: t('merch'),ref: refs.merchRef},
  ];

  const handleAdminAccess = () => {
    navigate('/admin');
    setIsOpen(false);
    setShowProfileMenu(false);
  };

  const handleAuthAction = () => {
    if (isAuthenticated) {
      setShowProfileMenu(!showProfileMenu);
    } else {
      navigate('/login');
      setIsOpen(false);
    }
  };

  const handleLogout = () => {
    logout();
    setShowProfileMenu(false);
    setIsOpen(false);
  };

  const handleNavItemClick = (itemRef) => {
    onNavigate(itemRef);
    setIsOpen(false);
  };

  return (
    <>
      <motion.nav
        className="fixed top-0 left-0 right-0 z-50 theme-nav border-b"
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Band Name */}
            <motion.div 
              className="flex items-center cursor-pointer"
              whileHover={{ scale: 1.05 }}
              onClick={() => onNavigate(refs.heroRef)}
            >
              <span className="font-semibold theme-text text-xl">{bandData.band.name}</span>
            </motion.div>

            {/* Desktop Navigation - Hidden on tablet and mobile */}
            <div className="hidden xl:flex items-center space-x-6">
              {navItems.map((item, index) => (
                <motion.button
                  key={item.label}
                  onClick={() => onNavigate(item.ref)}
                  className="flex items-center space-x-2 text-gray-600 transition-colors hover:text-current"
                  style={{'--hover-color': 'var(--theme-primary)'}}
                  whileHover={{ scale: 1.05, color: 'var(--theme-primary)' }}
                  whileTap={{ scale: 0.95 }}
                >
                  <SafeIcon icon={item.icon} className="text-sm" />
                  <span className="text-sm font-medium">{item.label}</span>
                </motion.button>
              ))}

              {/* Cart Button - Desktop */}
              <CartButton />

              {/* Language Selector - Desktop */}
              <LanguageSelector />

              {/* Auth Button with Dropdown - Desktop */}
              <div className="relative">
                <motion.button
                  onClick={handleAuthAction}
                  className="flex items-center space-x-2 text-gray-600 hover:text-current transition-colors"
                  style={{'--hover-color': 'var(--theme-primary)'}}
                  whileHover={{ scale: 1.05, color: 'var(--theme-primary)' }}
                  whileTap={{ scale: 0.95 }}
                  title={isAuthenticated ? 'Profile Menu' : 'Sign In'}
                >
                  <SafeIcon icon={isAuthenticated ? FiUser : FiLogIn} className="text-sm" />
                  <span className="text-sm font-medium">
                    {isAuthenticated ? 'Profile' : 'Sign In'}
                  </span>
                </motion.button>

                {/* Profile Dropdown - Desktop */}
                <AnimatePresence>
                  {isAuthenticated && showProfileMenu && (
                    <motion.div
                      className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden z-50"
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.2 }}
                    >
                      <div className="p-3 border-b border-gray-100">
                        <p className="text-sm font-medium text-gray-800">Signed in as</p>
                        <p className="text-xs text-gray-600 truncate">{user?.email || user?.userId}</p>
                      </div>
                      <div className="py-1">
                        <button
                          onClick={handleLogout}
                          className="flex items-center space-x-2 w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-50 transition-colors"
                        >
                          <SafeIcon icon={FiLogOut} className="text-sm" />
                          <span className="text-sm">Sign Out</span>
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Admin Access - Desktop */}
              <motion.button
                onClick={handleAdminAccess}
                className="flex items-center space-x-2 theme-primary transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                title={t('adminAccess')}
              >
                <SafeIcon icon={FiShield} className="text-sm" />
                <span className="text-sm font-medium">{t('admin')}</span>
              </motion.button>
            </div>

            {/* Mobile/Tablet Menu Button - Shows on tablet and mobile */}
            <div className="xl:hidden flex items-center space-x-3">
              {/* Cart Button - Mobile/Tablet */}
              <CartButton />
              
              <motion.button
                className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                onClick={() => setIsOpen(!isOpen)}
                whileTap={{ scale: 0.95 }}
                aria-label="Toggle navigation menu"
              >
                <SafeIcon icon={isOpen ? FiX : FiMenu} className="text-2xl text-gray-600" />
              </motion.button>
            </div>
          </div>
        </div>

        {/* Mobile/Tablet Menu */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              className="xl:hidden theme-nav border-t backdrop-blur-md"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3, ease: 'easeInOut' }}
            >
              <div className="px-4 py-4 space-y-2 max-h-[80vh] overflow-y-auto">
                {/* Navigation Items */}
                {navItems.map((item, index) => (
                  <motion.button
                    key={item.label}
                    onClick={() => handleNavItemClick(item.ref)}
                    className="flex items-center space-x-4 w-full px-4 py-3 text-gray-700 rounded-xl transition-all hover:bg-gray-100 active:bg-gray-200"
                    style={{
                      '--hover-bg': 'rgba(var(--theme-primary-rgb),0.1)',
                      '--hover-color': 'var(--theme-primary)'
                    }}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ 
                      x: 5, 
                      backgroundColor: 'rgba(var(--theme-primary-rgb),0.1)', 
                      color: 'var(--theme-primary)' 
                    }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
                      <SafeIcon icon={item.icon} className="text-sm text-gray-600" />
                    </div>
                    <span className="text-base font-medium">{item.label}</span>
                  </motion.button>
                ))}

                {/* Divider */}
                <div className="my-4 border-t border-gray-200"></div>

                {/* Language Selector - Mobile/Tablet */}
                <div className="px-4 py-2">
                  <div className="flex items-center space-x-3 mb-2">
                    <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
                      <SafeIcon icon={FiGlobe} className="text-sm text-gray-600" />
                    </div>
                    <span className="text-base font-medium text-gray-700">Language</span>
                  </div>
                  <div className="ml-11">
                    <LanguageSelector />
                  </div>
                </div>

                {/* Auth Section - Mobile/Tablet */}
                <div className="border-t border-gray-200 pt-4">
                  {isAuthenticated ? (
                    <>
                      {/* User Info */}
                      <div className="px-4 py-3 bg-gray-50 rounded-xl mb-3">
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center">
                            <SafeIcon icon={FiUser} className="text-white text-sm" />
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-800">Signed in</p>
                            <p className="text-xs text-gray-600 truncate">{user?.email || user?.userId}</p>
                          </div>
                        </div>
                      </div>
                      {/* Logout Button */}
                      <motion.button
                        onClick={handleLogout}
                        className="flex items-center space-x-4 w-full px-4 py-3 text-red-600 rounded-xl transition-all hover:bg-red-50"
                        whileHover={{ x: 5 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center">
                          <SafeIcon icon={FiLogOut} className="text-sm text-red-600" />
                        </div>
                        <span className="text-base font-medium">Sign Out</span>
                      </motion.button>
                    </>
                  ) : (
                    /* Login Button */
                    <motion.button
                      onClick={() => {
                        navigate('/login');
                        setIsOpen(false);
                      }}
                      className="flex items-center space-x-4 w-full px-4 py-3 rounded-xl transition-all"
                      style={{
                        color: 'var(--theme-primary)',
                        backgroundColor: 'rgba(var(--theme-primary-rgb),0.05)'
                      }}
                      whileHover={{ x: 5, backgroundColor: 'rgba(var(--theme-primary-rgb),0.1)' }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <div 
                        className="w-8 h-8 rounded-full flex items-center justify-center"
                        style={{ backgroundColor: 'rgba(var(--theme-primary-rgb),0.2)' }}
                      >
                        <SafeIcon 
                          icon={FiLogIn} 
                          className="text-sm" 
                          style={{ color: 'var(--theme-primary)' }}
                        />
                      </div>
                      <span className="text-base font-medium">Sign In</span>
                    </motion.button>
                  )}
                </div>

                {/* Admin Access - Mobile/Tablet */}
                <motion.button
                  onClick={handleAdminAccess}
                  className="flex items-center space-x-4 w-full px-4 py-3 rounded-xl transition-all mt-3"
                  style={{
                    color: 'var(--theme-primary)',
                    backgroundColor: 'rgba(var(--theme-primary-rgb),0.05)'
                  }}
                  whileHover={{ x: 5, backgroundColor: 'rgba(var(--theme-primary-rgb),0.1)' }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div 
                    className="w-8 h-8 rounded-full flex items-center justify-center"
                    style={{ backgroundColor: 'rgba(var(--theme-primary-rgb),0.2)' }}
                  >
                    <SafeIcon 
                      icon={FiShield} 
                      className="text-sm" 
                      style={{ color: 'var(--theme-primary)' }}
                    />
                  </div>
                  <span className="text-base font-medium">{t('adminAccess')}</span>
                </motion.button>

                {/* Close Menu Button */}
                <motion.button
                  onClick={() => setIsOpen(false)}
                  className="flex items-center justify-center w-full px-4 py-3 mt-6 text-gray-600 bg-gray-100 rounded-xl transition-colors hover:bg-gray-200"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <SafeIcon icon={FiX} className="text-lg mr-2" />
                  <span className="text-base font-medium">Close Menu</span>
                </motion.button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>

      {/* Spacer for fixed navigation */}
      <div className="h-16"></div>

      {/* Mobile Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40 xl:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Desktop Profile Menu Backdrop */}
      {showProfileMenu && (
        <div 
          className="fixed inset-0 z-40" 
          onClick={() => setShowProfileMenu(false)} 
        />
      )}
    </>
  );
};

export default Navigation;