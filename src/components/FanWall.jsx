import React,{useState} from 'react';
import {motion,AnimatePresence} from 'framer-motion';
import {useNavigate} from 'react-router-dom';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';
import {useAuth} from '../contexts/AuthContext';

const {FiMessageCircle,FiHeart,FiUser,FiSend,FiClock,FiLogIn} = FiIcons;

const initialComments = [
  {
    id: 1,
    username: "CosmicDreamer",
    message: "Absolutely love the new album! 'Cosmic Dreams' has been on repeat for weeks. The production is out of this world! 🌟",
    timestamp: "2024-01-20T10:30:00Z",
    likes: 24,
    liked: false,
    status: "approved"
  },
  {
    id: 2,
    username: "StellarFan92",
    message: "Your live show in Tokyo was incredible! The energy was electric and the visuals were stunning. Can't wait for the next tour! ⚡",
    timestamp: "2024-01-19T15:45:00Z",
    likes: 18,
    liked: true,
    status: "approved"
  },
  {
    id: 3,
    username: "MusicLover",
    message: "The lyrics in 'Ocean's Echo' really speak to my soul. Thank you for creating such meaningful music that helps me through tough times. 💙",
    timestamp: "2024-01-18T09:15:00Z",
    likes: 31,
    liked: false,
    status: "approved"
  },
  {
    id: 4,
    username: "WaveRider",
    message: "Been following you since the beginning and it's amazing to see how your sound has evolved. Keep riding those stellar waves! 🌊",
    timestamp: "2024-01-17T20:00:00Z",
    likes: 15,
    liked: false,
    status: "approved"
  },
  {
    id: 5,
    username: "ArtisticSoul",
    message: "The multimedia booklet is such a cool concept! Love seeing the creative process behind the music. More bands should do this! 🎨",
    timestamp: "2024-01-16T12:30:00Z",
    likes: 22,
    liked: true,
    status: "approved"
  },
  {
    id: 6,
    username: "NightOwl",
    message: "Your podcast episodes are so insightful! Love hearing about your creative process and life on the road. Keep them coming! 🎙️",
    timestamp: "2024-01-15T23:45:00Z",
    likes: 19,
    liked: false,
    status: "approved"
  }
];

const FanWall = () => {
  const [comments,setComments] = useState(initialComments);
  const [newComment,setNewComment] = useState('');
  const [username,setUsername] = useState('');
  const [showCommentForm,setShowCommentForm] = useState(false);
  const [showLoginPrompt,setShowLoginPrompt] = useState(false);
  
  const {isAuthenticated,user} = useAuth();
  const navigate = useNavigate();

  const handleLike = (commentId) => {
    if (!isAuthenticated) {
      setShowLoginPrompt(true);
      return;
    }

    setComments(comments.map(comment =>
      comment.id === commentId
        ? {
            ...comment,
            liked: !comment.liked,
            likes: comment.liked ? comment.likes - 1 : comment.likes + 1
          }
        : comment
    ));
  };

  const handleShowCommentForm = () => {
    if (!isAuthenticated) {
      setShowLoginPrompt(true);
      return;
    }
    setShowCommentForm(true);
  };

  const handleSubmitComment = (e) => {
    e.preventDefault();
    if (newComment.trim() && username.trim()) {
      const newCommentObj = {
        id: comments.length + 1,
        username: username.trim(),
        message: newComment.trim(),
        timestamp: new Date().toISOString(),
        likes: 0,
        liked: false,
        status: "pending" // New comments need approval
      };

      // Add to comments but won't show until approved
      setComments([newCommentObj, ...comments]);
      setNewComment('');
      setUsername('');
      setShowCommentForm(false);

      // Show confirmation message
      alert('Thank you for your comment! It will be visible after review by our moderators.');
    }
  };

  const handleLoginRedirect = () => {
    navigate('/login');
  };

  const formatTimeAgo = (timestamp) => {
    const now = new Date();
    const commentTime = new Date(timestamp);
    const diffInHours = Math.floor((now - commentTime) / (1000 * 60 * 60));

    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays}d ago`;
    return commentTime.toLocaleDateString();
  };

  // Only show approved comments to users
  const approvedComments = comments.filter(comment => comment.status === 'approved');

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-purple-50 py-20 px-4">
      <div className="max-w-4xl mx-auto">
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex items-center justify-center mb-6">
            <div className="w-16 h-16 bg-gradient-to-r from-pink-400 to-purple-400 rounded-full flex items-center justify-center mr-4">
              <SafeIcon icon={FiMessageCircle} className="text-white text-2xl" />
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-800">
              Fan Wall
            </h2>
          </div>
          <p className="text-xl text-gray-600 font-light">
            Share your thoughts and connect with fellow fans
          </p>
        </motion.div>

        {/* Add Comment Button */}
        <motion.div
          className="mb-8 text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <motion.button
            onClick={handleShowCommentForm}
            className="inline-flex items-center space-x-2 px-8 py-4 bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-full font-semibold shadow-lg hover:shadow-xl transition-all"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <SafeIcon icon={FiMessageCircle} className="text-xl" />
            <span>Share Your Thoughts</span>
          </motion.button>
        </motion.div>

        {/* Login Prompt Modal */}
        <AnimatePresence>
          {showLoginPrompt && (
            <motion.div
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowLoginPrompt(false)}
            >
              <motion.div
                className="bg-white rounded-2xl p-8 max-w-md w-full text-center"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
              >
                <div className="w-16 h-16 bg-gradient-to-r from-pink-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <SafeIcon icon={FiLogIn} className="text-white text-2xl" />
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-4">
                  Sign In Required
                </h3>
                <p className="text-gray-600 mb-6">
                  Please sign in to interact with the fan wall, like comments, and share your thoughts with the community.
                </p>
                <div className="flex space-x-3">
                  <motion.button
                    onClick={handleLoginRedirect}
                    className="flex-1 py-3 bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-xl font-medium hover:shadow-lg transition-all"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Sign In
                  </motion.button>
                  <motion.button
                    onClick={() => setShowLoginPrompt(false)}
                    className="flex-1 py-3 bg-gray-100 text-gray-700 rounded-xl font-medium hover:bg-gray-200 transition-colors"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Browse Only
                  </motion.button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Comment Form */}
        <AnimatePresence>
          {showCommentForm && (
            <motion.div
              className="bg-white/70 backdrop-blur-md rounded-2xl p-6 shadow-lg mb-8"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
            >
              <form onSubmit={handleSubmitComment} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Your Name
                  </label>
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full px-4 py-3 bg-white/80 border border-gray-200 rounded-xl focus:outline-none focus:border-purple-400 transition-colors"
                    placeholder="Enter your name..."
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Your Message
                  </label>
                  <textarea
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    className="w-full px-4 py-3 bg-white/80 border border-gray-200 rounded-xl focus:outline-none focus:border-purple-400 transition-colors resize-none"
                    rows="4"
                    placeholder="Share your thoughts about our music..."
                    required
                  />
                </div>
                <div className="text-sm text-gray-600 bg-blue-50 p-3 rounded-lg">
                  <strong>Note:</strong> All comments are reviewed before being published to ensure a positive experience for everyone.
                </div>
                <div className="flex items-center space-x-4">
                  <motion.button
                    type="submit"
                    className="inline-flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-xl font-medium hover:shadow-lg transition-all"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <SafeIcon icon={FiSend} className="text-sm" />
                    <span>Post Comment</span>
                  </motion.button>
                  <motion.button
                    type="button"
                    onClick={() => setShowCommentForm(false)}
                    className="px-6 py-3 bg-gray-100 text-gray-600 rounded-xl font-medium hover:bg-gray-200 transition-colors"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Cancel
                  </motion.button>
                </div>
              </form>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Comments List */}
        <div className="space-y-6">
          <AnimatePresence>
            {approvedComments.map((comment, index) => (
              <motion.div
                key={comment.id}
                className="bg-white/70 backdrop-blur-md rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                layout
              >
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 bg-gradient-to-r from-pink-400 to-purple-400 rounded-full flex items-center justify-center">
                      <SafeIcon icon={FiUser} className="text-white text-lg" />
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2 mb-2">
                      <h4 className="font-semibold text-gray-800">{comment.username}</h4>
                      <div className="flex items-center space-x-1 text-gray-500 text-sm">
                        <SafeIcon icon={FiClock} className="text-xs" />
                        <span>{formatTimeAgo(comment.timestamp)}</span>
                      </div>
                    </div>
                    <p className="text-gray-700 leading-relaxed mb-4">
                      {comment.message}
                    </p>
                    <div className="flex items-center space-x-4">
                      <motion.button
                        onClick={() => handleLike(comment.id)}
                        className={`flex items-center space-x-2 px-4 py-2 rounded-full transition-all ${
                          comment.liked
                            ? 'bg-red-100 text-red-600'
                            : 'bg-gray-100 text-gray-600 hover:bg-red-50 hover:text-red-500'
                        }`}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <SafeIcon
                          icon={FiHeart}
                          className={`text-sm ${comment.liked ? 'fill-current' : ''}`}
                        />
                        <span className="text-sm font-medium">{comment.likes}</span>
                      </motion.button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Community Guidelines */}
        <motion.div
          className="mt-16 bg-gradient-to-r from-pink-100 to-purple-100 rounded-2xl p-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
        >
          <h3 className="text-lg font-semibold text-gray-800 mb-3">Community Guidelines</h3>
          <div className="text-sm text-gray-600 space-y-2">
            <p>• Be respectful and kind to fellow fans</p>
            <p>• Share constructive feedback and positive vibes</p>
            <p>• Keep discussions music-related and family-friendly</p>
            <p>• No spam, self-promotion, or offensive content</p>
            <p>• All comments are moderated to ensure a safe space for everyone</p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default FanWall;