import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../../../common/SafeIcon';
import { useAdmin } from '../../../contexts/AdminContext';
import FileSelector from '../common/FileSelector';

const { FiPlus, FiEdit, FiTrash2, FiImage, FiPlay, FiSave, FiX, FiUpload, FiFolder } = FiIcons;

const MediaManager = () => {
  const { data, createMedia, updateMedia, deleteMedia } = useAdmin();
  const [showForm, setShowForm] = useState(false);
  const [editingMedia, setEditingMedia] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showFileSelector, setShowFileSelector] = useState(false);
  const [formData, setFormData] = useState({
    type: 'image',
    title: '',
    url: '',
    description: '',
    category: 'studio',
    isActive: true
  });

  const categories = [
    { id: 'all', label: 'All Media' },
    { id: 'studio', label: 'Studio' },
    { id: 'live', label: 'Live Shows' },
    { id: 'artwork', label: 'Artwork' },
    { id: 'backstage', label: 'Backstage' },
    { id: 'fanart', label: 'Fan Art' }
  ];

  const resetForm = () => {
    setFormData({
      type: 'image',
      title: '',
      url: '',
      description: '',
      category: 'studio',
      isActive: true
    });
    setEditingMedia(null);
    setShowForm(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingMedia) {
      updateMedia(editingMedia.id, formData);
    } else {
      createMedia(formData);
    }
    resetForm();
  };

  const handleEdit = (media) => {
    setFormData({
      type: media.type,
      title: media.title,
      url: media.url,
      description: media.description,
      category: media.category,
      isActive: media.isActive
    });
    setEditingMedia(media);
    setShowForm(true);
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this media item?')) {
      deleteMedia(id);
    }
  };

  const handleFileSelect = (file) => {
    setFormData({ ...formData, url: file.url });
  };

  const filteredMedia = selectedCategory === 'all' 
    ? data.media 
    : data.media.filter(item => item.category === selectedCategory);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Media Gallery Manager</h1>
        <motion.button
          onClick={() => setShowForm(true)}
          className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl font-medium hover:shadow-lg transition-all"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <SafeIcon icon={FiPlus} />
          <span>Add Media</span>
        </motion.button>
      </div>

      {/* Category Filter */}
      <div className="flex flex-wrap gap-4 mb-8">
        {categories.map(category => (
          <motion.button
            key={category.id}
            onClick={() => setSelectedCategory(category.id)}
            className={`px-4 py-2 rounded-xl transition-all ${
              selectedCategory === category.id
                ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg'
                : 'bg-white/70 backdrop-blur-md text-gray-600 hover:bg-white/90'
            }`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {category.label}
          </motion.button>
        ))}
      </div>

      {/* Media Form Modal */}
      <AnimatePresence>
        {showForm && (
          <motion.div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => resetForm()}
          >
            <motion.div
              className="bg-white rounded-2xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-800">
                  {editingMedia ? 'Edit Media' : 'Add New Media'}
                </h2>
                <button
                  onClick={resetForm}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <SafeIcon icon={FiX} className="text-gray-400" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Media Type
                    </label>
                    <select
                      value={formData.type}
                      onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-purple-400 transition-colors"
                      required
                    >
                      <option value="image">Image</option>
                      <option value="video">Video</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Category
                    </label>
                    <select
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-purple-400 transition-colors"
                      required
                    >
                      <option value="studio">Studio</option>
                      <option value="live">Live Shows</option>
                      <option value="artwork">Artwork</option>
                      <option value="backstage">Backstage</option>
                      <option value="fanart">Fan Art</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Title
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-purple-400 transition-colors"
                    placeholder="Enter media title"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {formData.type === 'image' ? 'Image URL' : 'Video URL (YouTube, Vimeo, etc.)'}
                  </label>
                  <div className="flex items-center space-x-4">
                    <input
                      type="url"
                      value={formData.url}
                      onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                      className="flex-1 px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-purple-400 transition-colors"
                      placeholder={formData.type === 'image' ? 'https://example.com/image.jpg' : 'https://youtube.com/watch?v=...'}
                      required
                    />
                    {formData.type === 'image' && (
                      <motion.button
                        type="button"
                        onClick={() => setShowFileSelector(true)}
                        className="px-4 py-3 bg-purple-100 text-purple-600 rounded-xl hover:bg-purple-200 transition-colors"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <SafeIcon icon={FiFolder} />
                      </motion.button>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-purple-400 transition-colors resize-none"
                    rows="3"
                    placeholder="Describe this media item..."
                    required
                  />
                </div>

                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="mediaActive"
                    checked={formData.isActive}
                    onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                    className="w-4 h-4 text-purple-600 rounded focus:ring-purple-500"
                  />
                  <label htmlFor="mediaActive" className="text-sm text-gray-700">
                    Active (visible on website)
                  </label>
                </div>

                <div className="flex items-center space-x-4 pt-4">
                  <motion.button
                    type="submit"
                    className="flex-1 flex items-center justify-center space-x-2 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl font-medium hover:shadow-lg transition-all"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <SafeIcon icon={FiSave} />
                    <span>{editingMedia ? 'Update' : 'Add'} Media</span>
                  </motion.button>
                  <motion.button
                    type="button"
                    onClick={resetForm}
                    className="px-6 py-3 bg-gray-100 text-gray-600 rounded-xl font-medium hover:bg-gray-200 transition-colors"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Cancel
                  </motion.button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Media Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <AnimatePresence>
          {filteredMedia.map((item, index) => (
            <motion.div
              key={item.id}
              className="bg-white/70 backdrop-blur-md rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all group"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              layout
            >
              <div className="relative">
                {item.type === 'image' ? (
                  <img
                    src={item.url}
                    alt={item.title}
                    className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                ) : (
                  <div className="w-full h-48 bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center">
                    <SafeIcon icon={FiPlay} className="text-4xl text-white" />
                  </div>
                )}
                <div className="absolute top-4 right-4 flex space-x-2">
                  <motion.button
                    onClick={() => handleEdit(item)}
                    className="p-2 bg-white/80 rounded-full hover:bg-white transition-colors"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <SafeIcon icon={FiEdit} className="text-gray-600" />
                  </motion.button>
                  <motion.button
                    onClick={() => handleDelete(item.id)}
                    className="p-2 bg-white/80 rounded-full hover:bg-white transition-colors"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <SafeIcon icon={FiTrash2} className="text-red-500" />
                  </motion.button>
                </div>
                {!item.isActive && (
                  <div className="absolute top-4 left-4 px-2 py-1 bg-red-500 text-white text-xs font-bold rounded-full">
                    INACTIVE
                  </div>
                )}
                <div className="absolute bottom-4 left-4 right-4 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                  <div className="bg-black/50 backdrop-blur-sm rounded-lg p-3">
                    <p className="text-white font-medium text-sm">
                      {item.type === 'video' ? 'Play Video' : 'View Image'}
                    </p>
                  </div>
                </div>
              </div>
              <div className="p-6">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-lg font-semibold text-gray-800">{item.title}</h3>
                  <span className="text-xs font-medium text-purple-600 bg-purple-100 px-2 py-1 rounded-full">
                    {item.category}
                  </span>
                </div>
                <p className="text-gray-600 text-sm leading-relaxed">
                  {item.description}
                </p>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {filteredMedia.length === 0 && (
        <div className="text-center py-12">
          <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <SafeIcon icon={FiImage} className="text-4xl text-gray-400" />
          </div>
          <h3 className="text-xl font-semibold text-gray-800 mb-2">
            {selectedCategory === 'all' ? 'No Media Yet' : `No ${categories.find(c => c.id === selectedCategory)?.label} Media`}
          </h3>
          <p className="text-gray-600 mb-6">Add your first media item to get started</p>
          <motion.button
            onClick={() => setShowForm(true)}
            className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl font-medium hover:shadow-lg transition-all"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Add Media
          </motion.button>
        </div>
      )}

      {/* File Selector */}
      <FileSelector
        isOpen={showFileSelector}
        onClose={() => setShowFileSelector(false)}
        onSelect={handleFileSelect}
        fileTypes={['image']}
        title="Select Image File"
      />
    </motion.div>
  );
};

export default MediaManager;