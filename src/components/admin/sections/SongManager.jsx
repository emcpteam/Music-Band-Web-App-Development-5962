import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../../../common/SafeIcon';
import { useAdmin } from '../../../contexts/AdminContext';
import FileSelector from '../common/FileSelector';

const { FiPlus, FiEdit, FiTrash2, FiMusic, FiClock, FiSave, FiX, FiPlay, FiFolder, FiUpload } = FiIcons;

const SongManager = () => {
  const { data, createSong, updateSong, deleteSong, addUploadedFile } = useAdmin();
  const [showForm, setShowForm] = useState(false);
  const [editingSong, setEditingSong] = useState(null);
  const [showFileSelector, setShowFileSelector] = useState(false);
  const [uploadProgress, setUploadProgress] = useState({});
  const [formData, setFormData] = useState({
    title: '',
    albumId: '',
    duration: '',
    audioUrl: '',
    lyrics: '',
    notes: '',
    isActive: true
  });

  const resetForm = () => {
    setFormData({
      title: '',
      albumId: '',
      duration: '',
      audioUrl: '',
      lyrics: '',
      notes: '',
      isActive: true
    });
    setEditingSong(null);
    setShowForm(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingSong) {
      updateSong(editingSong.id, formData);
    } else {
      createSong(formData);
    }
    resetForm();
  };

  const handleEdit = (song) => {
    setFormData(song);
    setEditingSong(song);
    setShowForm(true);
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this song?')) {
      deleteSong(id);
    }
  };

  const handleFileSelect = (file) => {
    setFormData({ ...formData, audioUrl: file.url });
  };

  // Handle direct audio file upload
  const handleAudioUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      const validTypes = ['.mp3', '.wav', '.flac', '.m4a', '.aac'];
      const fileExtension = '.' + file.name.split('.').pop().toLowerCase();
      
      if (!validTypes.includes(fileExtension)) {
        alert('Please select a valid audio file (MP3, WAV, FLAC, M4A, AAC)');
        return;
      }

      // Validate file size (max 50MB)
      if (file.size > 50 * 1024 * 1024) {
        alert('Audio file size should be less than 50MB');
        return;
      }

      const fileId = Date.now() + Math.random();
      
      // Simulate upload progress
      setUploadProgress(prev => ({ ...prev, [fileId]: 0 }));
      
      const uploadFile = {
        id: fileId,
        name: file.name,
        type: 'audio',
        size: file.size,
        url: URL.createObjectURL(file),
        originalFile: file,
        uploadDate: new Date().toISOString(),
        status: 'uploading'
      };

      addUploadedFile(uploadFile);

      // Simulate upload progress
      const interval = setInterval(() => {
        setUploadProgress(prev => {
          const currentProgress = prev[fileId] || 0;
          const newProgress = Math.min(currentProgress + Math.random() * 20, 100);
          
          if (newProgress >= 100) {
            clearInterval(interval);
            // Update file status to completed and set as selected
            const completedFile = { ...uploadFile, status: 'completed' };
            addUploadedFile(completedFile);
            setFormData(prevForm => ({ ...prevForm, audioUrl: completedFile.url }));
            
            setTimeout(() => {
              setUploadProgress(prev => {
                const { [fileId]: removed, ...rest } = prev;
                return rest;
              });
            }, 1000);
          }
          
          return { ...prev, [fileId]: newProgress };
        });
      }, 200);
    }
  };

  const getAlbumTitle = (albumId) => {
    const album = data.albums.find(a => a.id === parseInt(albumId));
    return album ? album.title : 'Unknown Album';
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Song Manager</h1>
        <motion.button
          onClick={() => setShowForm(true)}
          className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl font-medium hover:shadow-lg transition-all"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <SafeIcon icon={FiPlus} />
          <span>Add Song</span>
        </motion.button>
      </div>

      {/* Song Form Modal */}
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
                  {editingSong ? 'Edit Song' : 'Add New Song'}
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
                      Song Title
                    </label>
                    <input
                      type="text"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-purple-400 transition-colors"
                      placeholder="Enter song title"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Album
                    </label>
                    <select
                      value={formData.albumId}
                      onChange={(e) => setFormData({ ...formData, albumId: parseInt(e.target.value) })}
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-purple-400 transition-colors"
                      required
                    >
                      <option value="">Select an album</option>
                      {data.albums.map(album => (
                        <option key={album.id} value={album.id}>
                          {album.title}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Duration (mm:ss)
                    </label>
                    <input
                      type="text"
                      value={formData.duration}
                      onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-purple-400 transition-colors"
                      placeholder="3:45"
                      pattern="[0-9]+:[0-5][0-9]"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Audio File
                    </label>
                    <div className="flex items-center space-x-2">
                      <input
                        type="url"
                        value={formData.audioUrl}
                        onChange={(e) => setFormData({ ...formData, audioUrl: e.target.value })}
                        className="flex-1 px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-purple-400 transition-colors"
                        placeholder="Enter URL or upload/select file"
                        required
                      />
                      {/* Direct Upload Button */}
                      <div className="relative">
                        <input
                          type="file"
                          accept=".mp3,.wav,.flac,.m4a,.aac"
                          onChange={handleAudioUpload}
                          className="hidden"
                          id="audio-upload"
                        />
                        <motion.label
                          htmlFor="audio-upload"
                          className="px-4 py-3 bg-green-100 text-green-600 rounded-xl hover:bg-green-200 transition-colors cursor-pointer flex items-center"
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          title="Upload Audio File"
                        >
                          <SafeIcon icon={FiUpload} />
                        </motion.label>
                      </div>
                      {/* Browse Files Button */}
                      <motion.button
                        type="button"
                        onClick={() => setShowFileSelector(true)}
                        className="px-4 py-3 bg-purple-100 text-purple-600 rounded-xl hover:bg-purple-200 transition-colors"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        title="Browse Uploaded Files"
                      >
                        <SafeIcon icon={FiFolder} />
                      </motion.button>
                    </div>
                    {/* Upload Progress */}
                    {Object.keys(uploadProgress).length > 0 && (
                      <div className="mt-2">
                        {Object.entries(uploadProgress).map(([fileId, progress]) => (
                          <div key={fileId} className="w-full">
                            <div className="flex justify-between text-sm text-gray-600 mb-1">
                              <span>Uploading audio...</span>
                              <span>{Math.round(progress)}%</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div
                                className="bg-green-500 h-2 rounded-full transition-all duration-300"
                                style={{ width: `${progress}%` }}
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Lyrics
                  </label>
                  <textarea
                    value={formData.lyrics}
                    onChange={(e) => setFormData({ ...formData, lyrics: e.target.value })}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-purple-400 transition-colors resize-none"
                    rows="6"
                    placeholder="Enter song lyrics..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Artist Notes
                  </label>
                  <textarea
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-purple-400 transition-colors resize-none"
                    rows="3"
                    placeholder="Behind the scenes notes about this song..."
                  />
                </div>

                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="songActive"
                    checked={formData.isActive}
                    onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                    className="w-4 h-4 text-purple-600 rounded focus:ring-purple-500"
                  />
                  <label htmlFor="songActive" className="text-sm text-gray-700">
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
                    <span>{editingSong ? 'Update' : 'Create'} Song</span>
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

      {/* Songs List */}
      <div className="space-y-4">
        <AnimatePresence>
          {data.songs.map((song, index) => (
            <motion.div
              key={song.id}
              className="bg-white/70 backdrop-blur-md rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              layout
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4 flex-1">
                  <div className="w-16 h-16 bg-gradient-to-r from-purple-400 to-pink-400 rounded-xl flex items-center justify-center">
                    <SafeIcon icon={FiMusic} className="text-white text-xl" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2 mb-1">
                      <h3 className="text-lg font-semibold text-gray-800 truncate">
                        {song.title}
                      </h3>
                      {!song.isActive && (
                        <span className="px-2 py-1 bg-red-100 text-red-600 text-xs font-medium rounded-full">
                          Inactive
                        </span>
                      )}
                    </div>
                    <div className="flex items-center space-x-4 text-sm text-gray-600">
                      <span>{getAlbumTitle(song.albumId)}</span>
                      <div className="flex items-center space-x-1">
                        <SafeIcon icon={FiClock} className="text-xs" />
                        <span>{song.duration}</span>
                      </div>
                      {song.audioUrl && (
                        <span className="text-green-600">Audio Available</span>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  {song.audioUrl && (
                    <motion.button
                      className="p-2 bg-blue-100 text-blue-600 rounded-full hover:bg-blue-200 transition-colors"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      title="Preview"
                    >
                      <SafeIcon icon={FiPlay} />
                    </motion.button>
                  )}
                  <motion.button
                    onClick={() => handleEdit(song)}
                    className="p-2 bg-gray-100 text-gray-600 rounded-full hover:bg-gray-200 transition-colors"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <SafeIcon icon={FiEdit} />
                  </motion.button>
                  <motion.button
                    onClick={() => handleDelete(song.id)}
                    className="p-2 bg-red-100 text-red-500 rounded-full hover:bg-red-200 transition-colors"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <SafeIcon icon={FiTrash2} />
                  </motion.button>
                </div>
              </div>
              {song.lyrics && (
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <p className="text-sm text-gray-600 line-clamp-2">
                    {song.lyrics.split('\n')[0]}...
                  </p>
                </div>
              )}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {data.songs.length === 0 && (
        <div className="text-center py-12">
          <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <SafeIcon icon={FiMusic} className="text-4xl text-gray-400" />
          </div>
          <h3 className="text-xl font-semibold text-gray-800 mb-2">No Songs Yet</h3>
          <p className="text-gray-600 mb-6">Add your first song to get started</p>
          <motion.button
            onClick={() => setShowForm(true)}
            className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl font-medium hover:shadow-lg transition-all"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Add Your First Song
          </motion.button>
        </div>
      )}

      {/* File Selector */}
      <FileSelector
        isOpen={showFileSelector}
        onClose={() => setShowFileSelector(false)}
        onSelect={handleFileSelect}
        fileTypes={['audio']}
        title="Select Audio File"
      />
    </motion.div>
  );
};

export default SongManager;