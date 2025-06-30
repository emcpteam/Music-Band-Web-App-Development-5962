import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../../../common/SafeIcon';
import { useAdmin } from '../../../contexts/AdminContext';

const { FiMessageCircle, FiCheck, FiX, FiUser, FiClock, FiEye, FiTrash2, FiAlertTriangle, FiFilter } = FiIcons;

const CommentModeration = () => {
  const { data, approveComment, rejectComment, deleteComment } = useAdmin();
  const [selectedFilter, setSelectedFilter] = useState('pending');
  const [selectedComment, setSelectedComment] = useState(null);

  const filters = [
    { id: 'pending', label: 'Pending Review', count: data.comments?.filter(c => c.status === 'pending').length || 0 },
    { id: 'approved', label: 'Approved', count: data.comments?.filter(c => c.status === 'approved').length || 0 },
    { id: 'rejected', label: 'Rejected', count: data.comments?.filter(c => c.status === 'rejected').length || 0 },
    { id: 'all', label: 'All Comments', count: data.comments?.length || 0 }
  ];

  const filterComments = () => {
    if (!data.comments) return [];
    
    if (selectedFilter === 'all') {
      return data.comments;
    }
    return data.comments.filter(comment => comment.status === selectedFilter);
  };

  const handleApprove = (commentId) => {
    approveComment(commentId);
  };

  const handleReject = (commentId) => {
    rejectComment(commentId);
  };

  const handleDelete = (commentId) => {
    if (window.confirm('Are you sure you want to permanently delete this comment?')) {
      deleteComment(commentId);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'text-yellow-600 bg-yellow-100';
      case 'approved': return 'text-green-600 bg-green-100';
      case 'rejected': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
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

  const filteredComments = filterComments();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Comment Moderation</h1>
        <div className="flex items-center space-x-2">
          <SafeIcon icon={FiMessageCircle} className="text-purple-600" />
          <span className="text-sm text-gray-600">
            {data.comments?.filter(c => c.status === 'pending').length || 0} pending review
          </span>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap gap-4 mb-8">
        {filters.map(filter => (
          <motion.button
            key={filter.id}
            onClick={() => setSelectedFilter(filter.id)}
            className={`flex items-center space-x-2 px-4 py-2 rounded-xl transition-all ${
              selectedFilter === filter.id
                ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg'
                : 'bg-white/70 backdrop-blur-md text-gray-600 hover:bg-white/90'
            }`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <SafeIcon icon={FiFilter} className="text-sm" />
            <span className="font-medium">{filter.label}</span>
            <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
              selectedFilter === filter.id ? 'bg-white/20' : 'bg-gray-200'
            }`}>
              {filter.count}
            </span>
          </motion.button>
        ))}
      </div>

      {/* Comments List */}
      <div className="space-y-6">
        <AnimatePresence>
          {filteredComments.map((comment, index) => (
            <motion.div
              key={comment.id}
              className="bg-white/70 backdrop-blur-md rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              layout
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-4 flex-1">
                  {/* User Avatar */}
                  <div className="w-12 h-12 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full flex items-center justify-center flex-shrink-0">
                    <SafeIcon icon={FiUser} className="text-white text-lg" />
                  </div>

                  {/* Comment Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2 mb-2">
                      <h4 className="font-semibold text-gray-800">{comment.username}</h4>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(comment.status)}`}>
                        {comment.status.charAt(0).toUpperCase() + comment.status.slice(1)}
                      </span>
                      <div className="flex items-center space-x-1 text-gray-500 text-sm">
                        <SafeIcon icon={FiClock} className="text-xs" />
                        <span>{formatTimeAgo(comment.timestamp)}</span>
                      </div>
                    </div>

                    <p className="text-gray-700 leading-relaxed mb-4">
                      {comment.message}
                    </p>

                    {/* Comment Metadata */}
                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                      <span>💬 Fan Wall</span>
                      <span>👍 {comment.likes || 0} likes</span>
                      {comment.email && <span>📧 {comment.email}</span>}
                    </div>

                    {/* Auto-moderation flags */}
                    {comment.flags && comment.flags.length > 0 && (
                      <div className="mt-3 p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                        <div className="flex items-center space-x-2 mb-2">
                          <SafeIcon icon={FiAlertTriangle} className="text-yellow-600" />
                          <span className="font-medium text-yellow-800">Auto-moderation Flags:</span>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {comment.flags.map((flag, idx) => (
                            <span key={idx} className="px-2 py-1 bg-yellow-100 text-yellow-700 text-xs rounded-full">
                              {flag}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center space-x-2 flex-shrink-0">
                  {comment.status === 'pending' && (
                    <>
                      <motion.button
                        onClick={() => handleApprove(comment.id)}
                        className="p-3 bg-green-100 text-green-600 rounded-full hover:bg-green-200 transition-colors"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        title="Approve Comment"
                      >
                        <SafeIcon icon={FiCheck} className="text-lg" />
                      </motion.button>
                      <motion.button
                        onClick={() => handleReject(comment.id)}
                        className="p-3 bg-red-100 text-red-600 rounded-full hover:bg-red-200 transition-colors"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        title="Reject Comment"
                      >
                        <SafeIcon icon={FiX} className="text-lg" />
                      </motion.button>
                    </>
                  )}

                  {comment.status === 'approved' && (
                    <motion.button
                      onClick={() => handleReject(comment.id)}
                      className="p-3 bg-yellow-100 text-yellow-600 rounded-full hover:bg-yellow-200 transition-colors"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      title="Reject Comment"
                    >
                      <SafeIcon icon={FiX} className="text-lg" />
                    </motion.button>
                  )}

                  {comment.status === 'rejected' && (
                    <motion.button
                      onClick={() => handleApprove(comment.id)}
                      className="p-3 bg-green-100 text-green-600 rounded-full hover:bg-green-200 transition-colors"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      title="Approve Comment"
                    >
                      <SafeIcon icon={FiCheck} className="text-lg" />
                    </motion.button>
                  )}

                  <motion.button
                    onClick={() => setSelectedComment(comment)}
                    className="p-3 bg-blue-100 text-blue-600 rounded-full hover:bg-blue-200 transition-colors"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    title="View Details"
                  >
                    <SafeIcon icon={FiEye} className="text-lg" />
                  </motion.button>

                  <motion.button
                    onClick={() => handleDelete(comment.id)}
                    className="p-3 bg-gray-100 text-gray-600 rounded-full hover:bg-gray-200 transition-colors"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    title="Delete Comment"
                  >
                    <SafeIcon icon={FiTrash2} className="text-lg" />
                  </motion.button>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {filteredComments.length === 0 && (
        <div className="text-center py-12">
          <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <SafeIcon icon={FiMessageCircle} className="text-4xl text-gray-400" />
          </div>
          <h3 className="text-xl font-semibold text-gray-800 mb-2">
            No {selectedFilter === 'all' ? '' : selectedFilter} Comments
          </h3>
          <p className="text-gray-600">
            {selectedFilter === 'pending' 
              ? "All comments have been reviewed"
              : `No ${selectedFilter} comments found`
            }
          </p>
        </div>
      )}

      {/* Comment Detail Modal */}
      <AnimatePresence>
        {selectedComment && (
          <motion.div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedComment(null)}
          >
            <motion.div
              className="bg-white rounded-2xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-800">Comment Details</h2>
                <button
                  onClick={() => setSelectedComment(null)}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <SafeIcon icon={FiX} className="text-gray-400" />
                </button>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
                    <p className="text-gray-800">{selectedComment.username}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(selectedComment.status)}`}>
                      {selectedComment.status.charAt(0).toUpperCase() + selectedComment.status.slice(1)}
                    </span>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
                  <p className="text-gray-800 bg-gray-50 p-3 rounded-lg">{selectedComment.message}</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Posted</label>
                    <p className="text-gray-600">{new Date(selectedComment.timestamp).toLocaleString()}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Likes</label>
                    <p className="text-gray-600">{selectedComment.likes || 0}</p>
                  </div>
                </div>

                {selectedComment.flags && selectedComment.flags.length > 0 && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Moderation Flags</label>
                    <div className="flex flex-wrap gap-2">
                      {selectedComment.flags.map((flag, idx) => (
                        <span key={idx} className="px-2 py-1 bg-yellow-100 text-yellow-700 text-xs rounded-full">
                          {flag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                <div className="flex items-center space-x-4 pt-4">
                  {selectedComment.status === 'pending' && (
                    <>
                      <motion.button
                        onClick={() => {
                          handleApprove(selectedComment.id);
                          setSelectedComment(null);
                        }}
                        className="flex-1 py-3 bg-green-500 text-white rounded-xl font-medium hover:bg-green-600 transition-colors"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        Approve Comment
                      </motion.button>
                      <motion.button
                        onClick={() => {
                          handleReject(selectedComment.id);
                          setSelectedComment(null);
                        }}
                        className="flex-1 py-3 bg-red-500 text-white rounded-xl font-medium hover:bg-red-600 transition-colors"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        Reject Comment
                      </motion.button>
                    </>
                  )}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default CommentModeration;