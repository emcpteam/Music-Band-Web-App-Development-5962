import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../../../common/SafeIcon';
import { useAdmin } from '../../../contexts/AdminContext';

const { FiFolder, FiX, FiSearch, FiCheck, FiMusic, FiMic, FiImage, FiFileText } = FiIcons;

const FileSelector = ({ isOpen, onClose, onSelect, fileTypes = ['image'], title = "Select File" }) => {
  const { data } = useAdmin();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);

  const fileIcons = {
    audio: FiMusic,
    podcast: FiMic,
    image: FiImage,
    pdf: FiFileText
  };

  const filteredFiles = (data.uploadedFiles || []).filter(file => {
    const matchesType = fileTypes.includes(file.type);
    const matchesSearch = file.name.toLowerCase().includes(searchTerm.toLowerCase());
    const isCompleted = file.status === 'completed';
    return matchesType && matchesSearch && isCompleted;
  });

  const handleSelect = () => {
    if (selectedFile) {
      onSelect(selectedFile);
      onClose();
      setSelectedFile(null);
      setSearchTerm('');
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => {
            onClose();
            setSelectedFile(null);
            setSearchTerm('');
          }}
        >
          <motion.div
            className="bg-white rounded-2xl w-full max-w-4xl max-h-[80vh] overflow-hidden"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b">
              <div className="flex items-center space-x-3">
                <SafeIcon icon={FiFolder} className="text-purple-600 text-xl" />
                <h2 className="text-xl font-semibold text-gray-800">{title}</h2>
              </div>
              <button
                onClick={() => {
                  onClose();
                  setSelectedFile(null);
                  setSearchTerm('');
                }}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <SafeIcon icon={FiX} className="text-gray-400" />
              </button>
            </div>

            {/* Search */}
            <div className="p-6 border-b">
              <div className="relative">
                <SafeIcon 
                  icon={FiSearch} 
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" 
                />
                <input
                  type="text"
                  placeholder="Search files..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-purple-400 transition-colors"
                />
              </div>
              <div className="flex items-center space-x-2 mt-3 text-sm text-gray-600">
                <span>Showing {fileTypes.join(', ')} files</span>
                <span>•</span>
                <span>{filteredFiles.length} files available</span>
              </div>
            </div>

            {/* File Grid */}
            <div className="p-6 overflow-y-auto max-h-[50vh]">
              {filteredFiles.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredFiles.map((file) => {
                    const IconComponent = fileIcons[file.type];
                    const isSelected = selectedFile?.id === file.id;

                    return (
                      <motion.div
                        key={file.id}
                        className={`relative border-2 rounded-xl p-4 cursor-pointer transition-all ${
                          isSelected
                            ? 'border-purple-500 bg-purple-50'
                            : 'border-gray-200 hover:border-purple-300 hover:bg-gray-50'
                        }`}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => setSelectedFile(file)}
                      >
                        {/* Selection Indicator */}
                        {isSelected && (
                          <div className="absolute top-2 right-2 w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center">
                            <SafeIcon icon={FiCheck} className="text-white text-sm" />
                          </div>
                        )}

                        {/* File Preview */}
                        <div className="aspect-square mb-3 rounded-lg overflow-hidden bg-gray-100 flex items-center justify-center">
                          {file.type === 'image' ? (
                            <img
                              src={file.url}
                              alt={file.name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <SafeIcon icon={IconComponent} className="text-4xl text-gray-400" />
                          )}
                        </div>

                        {/* File Info */}
                        <div className="space-y-1">
                          <h3 className="font-medium text-gray-800 truncate" title={file.name}>
                            {file.name}
                          </h3>
                          <div className="flex items-center justify-between text-xs text-gray-500">
                            <span className="capitalize">{file.type}</span>
                            <span>{formatFileSize(file.size)}</span>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <SafeIcon icon={FiFolder} className="text-2xl text-gray-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">
                    No {fileTypes.join(' or ')} files found
                  </h3>
                  <p className="text-gray-600">
                    {searchTerm
                      ? 'Try a different search term'
                      : `Upload ${fileTypes.join(' or ')} files first`}
                  </p>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between p-6 border-t bg-gray-50">
              <div className="text-sm text-gray-600">
                {selectedFile ? `Selected: ${selectedFile.name}` : 'No file selected'}
              </div>
              <div className="flex items-center space-x-3">
                <motion.button
                  onClick={() => {
                    onClose();
                    setSelectedFile(null);
                    setSearchTerm('');
                  }}
                  className="px-4 py-2 text-gray-600 hover:bg-gray-200 rounded-lg transition-colors"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Cancel
                </motion.button>
                <motion.button
                  onClick={handleSelect}
                  disabled={!selectedFile}
                  className="px-6 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg transition-all"
                  whileHover={{ scale: selectedFile ? 1.02 : 1 }}
                  whileTap={{ scale: selectedFile ? 0.98 : 1 }}
                >
                  Select File
                </motion.button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default FileSelector;