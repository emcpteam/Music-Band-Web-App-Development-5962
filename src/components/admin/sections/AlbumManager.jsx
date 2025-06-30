import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../../../common/SafeIcon';
import { useAdmin } from '../../../contexts/AdminContext';

const { FiPlus, FiEdit, FiTrash2, FiDisc, FiCalendar, FiImage, FiSave, FiX, FiUpload, FiUsers, FiMusic2, FiAward } = FiIcons;

const AlbumManager = () => {
  const { data, createAlbum, updateAlbum, deleteAlbum } = useAdmin();
  const [showForm, setShowForm] = useState(false);
  const [editingAlbum, setEditingAlbum] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [formData, setFormData] = useState({
    title: '',
    cover: '',
    releaseDate: '',
    description: '',
    genre: '',
    duration: '',
    trackCount: '',
    recordLabel: '',
    producer: '',
    engineer: '',
    studio: '',
    credits: {
      vocals: '',
      guitar: '',
      bass: '',
      drums: '',
      keyboards: '',
      other: ''
    },
    liner_notes: '',
    special_thanks: '',
    isActive: true
  });

  const resetForm = () => {
    setFormData({
      title: '',
      cover: '',
      releaseDate: '',
      description: '',
      genre: '',
      duration: '',
      trackCount: '',
      recordLabel: '',
      producer: '',
      engineer: '',
      studio: '',
      credits: {
        vocals: '',
        guitar: '',
        bass: '',
        drums: '',
        keyboards: '',
        other: ''
      },
      liner_notes: '',
      special_thanks: '',
      isActive: true
    });
    setEditingAlbum(null);
    setShowForm(false);
    setImagePreview('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const albumData = {
      ...formData,
      trackCount: parseInt(formData.trackCount) || 0
    };
    
    if (editingAlbum) {
      updateAlbum(editingAlbum.id, albumData);
    } else {
      createAlbum(albumData);
    }
    resetForm();
  };

  const handleEdit = (album) => {
    setFormData({
      ...album,
      credits: album.credits || {
        vocals: '',
        guitar: '',
        bass: '',
        drums: '',
        keyboards: '',
        other: ''
      }
    });
    setEditingAlbum(album);
    setShowForm(true);
    setImagePreview(album.cover);
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this album? This will also delete all associated songs.')) {
      deleteAlbum(id);
    }
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        alert('Please select an image file');
        return;
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert('Image size should be less than 5MB');
        return;
      }

      const reader = new FileReader();
      reader.onload = (event) => {
        const imageUrl = event.target.result;
        setImagePreview(imageUrl);
        setFormData({ ...formData, cover: imageUrl });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleImageUrlChange = (url) => {
    setFormData({ ...formData, cover: url });
    setImagePreview(url);
  };

  const handleCreditsChange = (instrument, value) => {
    setFormData({
      ...formData,
      credits: {
        ...formData.credits,
        [instrument]: value
      }
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Album Manager</h1>
        <motion.button
          onClick={() => setShowForm(true)}
          className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl font-medium hover:shadow-lg transition-all"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <SafeIcon icon={FiPlus} />
          <span>Add Album</span>
        </motion.button>
      </div>

      {/* Album Form Modal */}
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
              className="bg-white rounded-2xl p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-800">
                  {editingAlbum ? 'Edit Album' : 'Add New Album'}
                </h2>
                <button
                  onClick={resetForm}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <SafeIcon icon={FiX} className="text-gray-400" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Basic Information */}
                <div className="bg-gray-50 rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                    <SafeIcon icon={FiDisc} className="mr-2" />
                    Basic Information
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Album Title *
                      </label>
                      <input
                        type="text"
                        value={formData.title}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:border-purple-400 transition-colors"
                        placeholder="Enter album title"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Genre
                      </label>
                      <input
                        type="text"
                        value={formData.genre}
                        onChange={(e) => setFormData({ ...formData, genre: e.target.value })}
                        className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:border-purple-400 transition-colors"
                        placeholder="e.g., Electronic, Rock, Jazz"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Release Date *
                      </label>
                      <input
                        type="date"
                        value={formData.releaseDate}
                        onChange={(e) => setFormData({ ...formData, releaseDate: e.target.value })}
                        className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:border-purple-400 transition-colors"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Track Count
                      </label>
                      <input
                        type="number"
                        value={formData.trackCount}
                        onChange={(e) => setFormData({ ...formData, trackCount: e.target.value })}
                        className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:border-purple-400 transition-colors"
                        placeholder="Number of tracks"
                        min="1"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Total Duration
                      </label>
                      <input
                        type="text"
                        value={formData.duration}
                        onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                        className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:border-purple-400 transition-colors"
                        placeholder="e.g., 45:30"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Record Label
                      </label>
                      <input
                        type="text"
                        value={formData.recordLabel}
                        onChange={(e) => setFormData({ ...formData, recordLabel: e.target.value })}
                        className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:border-purple-400 transition-colors"
                        placeholder="Record label name"
                      />
                    </div>
                  </div>

                  <div className="mt-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Album Description
                    </label>
                    <textarea
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:border-purple-400 transition-colors resize-none"
                      rows="3"
                      placeholder="Describe the album concept, themes, or story..."
                    />
                  </div>
                </div>

                {/* Album Cover Upload */}
                <div className="bg-gray-50 rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                    <SafeIcon icon={FiImage} className="mr-2" />
                    Album Cover (Square Format Recommended)
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Upload Image File
                      </label>
                      <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:border-purple-400 transition-colors">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleImageUpload}
                          className="hidden"
                          id="albumCoverUpload"
                        />
                        <label htmlFor="albumCoverUpload" className="cursor-pointer">
                          <SafeIcon icon={FiUpload} className="mx-auto text-2xl text-gray-400 mb-2" />
                          <p className="text-sm text-gray-600">Click to upload album cover</p>
                          <p className="text-xs text-gray-500 mt-1">PNG, JPG up to 5MB (Square format recommended)</p>
                        </label>
                      </div>
                      
                      <div className="mt-4">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Or Enter Image URL
                        </label>
                        <input
                          type="url"
                          value={formData.cover}
                          onChange={(e) => handleImageUrlChange(e.target.value)}
                          className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:border-purple-400 transition-colors"
                          placeholder="https://example.com/album-cover.jpg"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Preview
                      </label>
                      <div className="aspect-square bg-gray-100 rounded-xl overflow-hidden border-2 border-gray-200">
                        {imagePreview ? (
                          <img
                            src={imagePreview}
                            alt="Album cover preview"
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <div className="text-center">
                              <SafeIcon icon={FiImage} className="text-4xl text-gray-400 mb-2" />
                              <p className="text-sm text-gray-500">No image selected</p>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Production Credits */}
                <div className="bg-gray-50 rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                    <SafeIcon icon={FiAward} className="mr-2" />
                    Production Credits
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Producer
                      </label>
                      <input
                        type="text"
                        value={formData.producer}
                        onChange={(e) => setFormData({ ...formData, producer: e.target.value })}
                        className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:border-purple-400 transition-colors"
                        placeholder="Producer name(s)"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Engineer
                      </label>
                      <input
                        type="text"
                        value={formData.engineer}
                        onChange={(e) => setFormData({ ...formData, engineer: e.target.value })}
                        className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:border-purple-400 transition-colors"
                        placeholder="Recording/mixing engineer"
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Recording Studio
                      </label>
                      <input
                        type="text"
                        value={formData.studio}
                        onChange={(e) => setFormData({ ...formData, studio: e.target.value })}
                        className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:border-purple-400 transition-colors"
                        placeholder="Studio name and location"
                      />
                    </div>
                  </div>
                </div>

                {/* Musician Credits */}
                <div className="bg-gray-50 rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                    <SafeIcon icon={FiUsers} className="mr-2" />
                    Musician Credits
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Vocals
                      </label>
                      <input
                        type="text"
                        value={formData.credits.vocals}
                        onChange={(e) => handleCreditsChange('vocals', e.target.value)}
                        className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:border-purple-400 transition-colors"
                        placeholder="Lead vocals, backing vocals..."
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Guitar
                      </label>
                      <input
                        type="text"
                        value={formData.credits.guitar}
                        onChange={(e) => handleCreditsChange('guitar', e.target.value)}
                        className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:border-purple-400 transition-colors"
                        placeholder="Electric guitar, acoustic guitar..."
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Bass
                      </label>
                      <input
                        type="text"
                        value={formData.credits.bass}
                        onChange={(e) => handleCreditsChange('bass', e.target.value)}
                        className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:border-purple-400 transition-colors"
                        placeholder="Bass guitar, synth bass..."
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Drums
                      </label>
                      <input
                        type="text"
                        value={formData.credits.drums}
                        onChange={(e) => handleCreditsChange('drums', e.target.value)}
                        className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:border-purple-400 transition-colors"
                        placeholder="Drums, percussion..."
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Keyboards/Synths
                      </label>
                      <input
                        type="text"
                        value={formData.credits.keyboards}
                        onChange={(e) => handleCreditsChange('keyboards', e.target.value)}
                        className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:border-purple-400 transition-colors"
                        placeholder="Piano, synthesizers, organs..."
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Other Instruments
                      </label>
                      <input
                        type="text"
                        value={formData.credits.other}
                        onChange={(e) => handleCreditsChange('other', e.target.value)}
                        className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:border-purple-400 transition-colors"
                        placeholder="Violin, saxophone, programming..."
                      />
                    </div>
                  </div>
                </div>

                {/* Additional Information */}
                <div className="bg-gray-50 rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                    <SafeIcon icon={FiMusic2} className="mr-2" />
                    Additional Information
                  </h3>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Liner Notes
                      </label>
                      <textarea
                        value={formData.liner_notes}
                        onChange={(e) => setFormData({ ...formData, liner_notes: e.target.value })}
                        className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:border-purple-400 transition-colors resize-none"
                        rows="4"
                        placeholder="Artist's message, album story, inspiration, recording process..."
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Special Thanks
                      </label>
                      <textarea
                        value={formData.special_thanks}
                        onChange={(e) => setFormData({ ...formData, special_thanks: e.target.value })}
                        className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:border-purple-400 transition-colors resize-none"
                        rows="3"
                        placeholder="Thank you messages, dedications, acknowledgments..."
                      />
                    </div>
                  </div>
                </div>

                {/* Status */}
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="isActive"
                    checked={formData.isActive}
                    onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                    className="w-4 h-4 text-purple-600 rounded focus:ring-purple-500"
                  />
                  <label htmlFor="isActive" className="text-sm text-gray-700">
                    Active (visible on website)
                  </label>
                </div>

                {/* Submit Buttons */}
                <div className="flex items-center space-x-4 pt-4">
                  <motion.button
                    type="submit"
                    className="flex-1 flex items-center justify-center space-x-2 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl font-medium hover:shadow-lg transition-all"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <SafeIcon icon={FiSave} />
                    <span>{editingAlbum ? 'Update' : 'Create'} Album</span>
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

      {/* Albums Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <AnimatePresence>
          {data.albums.map((album, index) => (
            <motion.div
              key={album.id}
              className="bg-white/70 backdrop-blur-md rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              layout
            >
              <div className="relative">
                <div className="aspect-square">
                  <img
                    src={album.cover}
                    alt={album.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="absolute top-4 right-4 flex space-x-2">
                  <motion.button
                    onClick={() => handleEdit(album)}
                    className="p-2 bg-white/80 rounded-full hover:bg-white transition-colors"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <SafeIcon icon={FiEdit} className="text-gray-600" />
                  </motion.button>
                  <motion.button
                    onClick={() => handleDelete(album.id)}
                    className="p-2 bg-white/80 rounded-full hover:bg-white transition-colors"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <SafeIcon icon={FiTrash2} className="text-red-500" />
                  </motion.button>
                </div>
                {!album.isActive && (
                  <div className="absolute top-4 left-4 px-2 py-1 bg-red-500 text-white text-xs font-bold rounded-full">
                    INACTIVE
                  </div>
                )}
              </div>
              <div className="p-6">
                <h3 className="text-xl font-semibold text-gray-800 mb-2">
                  {album.title}
                </h3>
                <div className="flex items-center space-x-4 text-sm text-gray-600 mb-3">
                  <div className="flex items-center space-x-1">
                    <SafeIcon icon={FiCalendar} className="text-xs" />
                    <span>{new Date(album.releaseDate).toLocaleDateString()}</span>
                  </div>
                  {album.genre && (
                    <span className="px-2 py-1 bg-purple-100 text-purple-600 text-xs rounded-full">
                      {album.genre}
                    </span>
                  )}
                </div>
                {album.trackCount && (
                  <div className="flex items-center space-x-1 text-sm text-gray-600 mb-3">
                    <SafeIcon icon={FiDisc} className="text-xs" />
                    <span>{album.trackCount} tracks</span>
                    {album.duration && <span>• {album.duration}</span>}
                  </div>
                )}
                <p className="text-gray-600 text-sm leading-relaxed line-clamp-3">
                  {album.description}
                </p>
                {(album.producer || album.recordLabel) && (
                  <div className="mt-3 pt-3 border-t border-gray-200">
                    {album.producer && (
                      <p className="text-xs text-gray-500">Produced by {album.producer}</p>
                    )}
                    {album.recordLabel && (
                      <p className="text-xs text-gray-500">{album.recordLabel}</p>
                    )}
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {data.albums.length === 0 && (
        <div className="text-center py-12">
          <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <SafeIcon icon={FiDisc} className="text-4xl text-gray-400" />
          </div>
          <h3 className="text-xl font-semibold text-gray-800 mb-2">No Albums Yet</h3>
          <p className="text-gray-600 mb-6">Create your first album to get started</p>
          <motion.button
            onClick={() => setShowForm(true)}
            className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl font-medium hover:shadow-lg transition-all"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Add Your First Album
          </motion.button>
        </div>
      )}
    </motion.div>
  );
};

export default AlbumManager;