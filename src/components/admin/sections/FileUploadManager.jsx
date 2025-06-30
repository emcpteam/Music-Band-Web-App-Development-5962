import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../../../common/SafeIcon';
import { useAdmin } from '../../../contexts/AdminContext';

const { FiUpload, FiFile, FiMusic, FiMic, FiImage, FiFileText, FiX, FiCheck, FiTrash2, FiDownload, FiEye, FiPlay, FiPause, FiRefreshCw } = FiIcons;

const FileUploadManager = () => {
  const { data, addUploadedFile, removeUploadedFile } = useAdmin();
  const [uploadProgress, setUploadProgress] = useState({});
  const [dragOver, setDragOver] = useState(false);
  const [previewFile, setPreviewFile] = useState(null);
  const [audioPlaying, setAudioPlaying] = useState({});
  const [refreshKey, setRefreshKey] = useState(0);

  // Force refresh of file list
  const refreshFileList = () => {
    setRefreshKey(prev => prev + 1);
  };

  const fileTypes = {
    audio: {
      label: 'Audio Files (MP3, WAV, FLAC)',
      accept: '.mp3,.wav,.flac,.m4a,.aac',
      icon: FiMusic,
      maxSize: 50 * 1024 * 1024, // 50MB
      color: 'text-green-600',
      bgColor: 'bg-green-100'
    },
    podcast: {
      label: 'Podcast Files (MP3, WAV)',
      accept: '.mp3,.wav,.m4a',
      icon: FiMic,
      maxSize: 100 * 1024 * 1024, // 100MB
      color: 'text-blue-600',
      bgColor: 'bg-blue-100'
    },
    image: {
      label: 'Images (JPG, PNG, GIF, WebP)',
      accept: '.jpg,.jpeg,.png,.gif,.webp',
      icon: FiImage,
      maxSize: 10 * 1024 * 1024, // 10MB
      color: 'text-purple-600',
      bgColor: 'bg-purple-100'
    },
    pdf: {
      label: 'PDF Documents',
      accept: '.pdf',
      icon: FiFileText,
      maxSize: 20 * 1024 * 1024, // 20MB
      color: 'text-red-600',
      bgColor: 'bg-red-100'
    }
  };

  const handleFileUpload = (files, type) => {
    if (!files || files.length === 0) return;

    Array.from(files).forEach(file => {
      const fileType = fileTypes[type];
      
      // Validate file type
      const fileExtension = '.' + file.name.split('.').pop().toLowerCase();
      if (!fileType.accept.includes(fileExtension)) {
        alert(`Invalid file type. Please select ${fileType.label}`);
        return;
      }

      // Validate file size
      if (file.size > fileType.maxSize) {
        alert(`File too large. Maximum size is ${fileType.maxSize / (1024 * 1024)}MB`);
        return;
      }

      const fileId = Date.now() + Math.random();
      
      // Create blob URL for the file
      const blobUrl = URL.createObjectURL(file);

      // Start upload simulation
      setUploadProgress(prev => ({ ...prev, [fileId]: 0 }));

      const uploadFile = {
        id: fileId,
        name: file.name,
        type: type,
        size: file.size,
        url: blobUrl,
        originalFile: file,
        uploadDate: new Date().toISOString(),
        status: 'uploading'
      };

      // Add file to state immediately
      addUploadedFile(uploadFile);

      // Simulate upload progress
      const interval = setInterval(() => {
        setUploadProgress(prev => {
          const currentProgress = prev[fileId] || 0;
          const newProgress = Math.min(currentProgress + Math.random() * 20, 100);
          
          if (newProgress >= 100) {
            clearInterval(interval);
            
            // Update file status to completed
            const completedFile = {
              ...uploadFile,
              status: 'completed'
            };
            addUploadedFile(completedFile);
            
            // Remove progress after delay
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
    });
  };

  const handleDrop = (e, type) => {
    e.preventDefault();
    setDragOver(false);
    const files = e.dataTransfer.files;
    handleFileUpload(files, type);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = () => {
    setDragOver(false);
  };

  const deleteFile = (fileId) => {
    if (window.confirm('Are you sure you want to delete this file?')) {
      // Find the file and revoke its blob URL
      const file = data.uploadedFiles?.find(f => f.id === fileId);
      if (file && file.url && file.url.startsWith('blob:')) {
        URL.revokeObjectURL(file.url);
      }
      removeUploadedFile(fileId);
    }
  };

  const handlePreview = (file) => {
    // Ensure blob URL is still valid
    if (file.originalFile && (!file.url || !file.url.startsWith('blob:'))) {
      const newUrl = URL.createObjectURL(file.originalFile);
      const updatedFile = { ...file, url: newUrl };
      addUploadedFile(updatedFile);
      setPreviewFile(updatedFile);
    } else {
      setPreviewFile(file);
    }
  };

  const handleAudioToggle = (fileId) => {
    const audio = document.getElementById(`audio-${fileId}`);
    if (audio) {
      if (audioPlaying[fileId]) {
        audio.pause();
        setAudioPlaying(prev => ({ ...prev, [fileId]: false }));
      } else {
        // Pause all other audio
        Object.keys(audioPlaying).forEach(id => {
          if (id !== fileId.toString()) {
            const otherAudio = document.getElementById(`audio-${id}`);
            if (otherAudio) otherAudio.pause();
          }
        });
        setAudioPlaying({ [fileId]: true });
        audio.play().catch(err => {
          console.error('Error playing audio:', err);
          setAudioPlaying(prev => ({ ...prev, [fileId]: false }));
        });
      }
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getFilesByType = (type) => {
    return data.uploadedFiles?.filter(file => file.type === type) || [];
  };

  const downloadFile = (file) => {
    try {
      const a = document.createElement('a');
      a.href = file.url;
      a.download = file.name;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    } catch (error) {
      console.error('Error downloading file:', error);
      alert('Error downloading file. Please try again.');
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      key={refreshKey}
    >
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-gray-800">File Upload Manager</h1>
        <div className="flex items-center space-x-4">
          <motion.button
            onClick={refreshFileList}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-100 text-blue-600 rounded-xl hover:bg-blue-200 transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            title="Refresh file list"
          >
            <SafeIcon icon={FiRefreshCw} className="text-sm" />
            <span className="text-sm">Refresh</span>
          </motion.button>
          <div className="text-sm text-gray-600">
            Total Files: {data.uploadedFiles?.length || 0}
          </div>
        </div>
      </div>

      {/* Upload Zones */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {Object.entries(fileTypes).map(([type, config]) => (
          <motion.div
            key={type}
            className={`border-2 border-dashed rounded-xl p-6 text-center transition-all ${
              dragOver ? 'border-purple-400 bg-purple-50' : 'border-gray-300 hover:border-purple-400'
            }`}
            whileHover={{ scale: 1.02 }}
            onDrop={(e) => handleDrop(e, type)}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
          >
            <input
              type="file"
              multiple
              accept={config.accept}
              onChange={(e) => handleFileUpload(e.target.files, type)}
              className="hidden"
              id={`upload-${type}`}
            />
            <label htmlFor={`upload-${type}`} className="cursor-pointer">
              <div className={`w-16 h-16 ${config.bgColor} rounded-full flex items-center justify-center mx-auto mb-4`}>
                <SafeIcon icon={config.icon} className={`text-2xl ${config.color}`} />
              </div>
              <h3 className="font-semibold text-gray-800 mb-2 capitalize">{type}</h3>
              <p className="text-sm text-gray-600 mb-4">{config.label}</p>
              <div className="flex items-center justify-center space-x-2 text-purple-600">
                <SafeIcon icon={FiUpload} className="text-sm" />
                <span className="text-sm font-medium">Click or Drop Files</span>
              </div>
              <p className="text-xs text-gray-500 mt-2">
                Max: {config.maxSize / (1024 * 1024)}MB
              </p>
            </label>
          </motion.div>
        ))}
      </div>

      {/* File Lists */}
      <div className="space-y-8">
        {Object.keys(fileTypes).map(type => {
          const files = getFilesByType(type);
          const config = fileTypes[type];
          
          if (files.length === 0) return null;

          return (
            <motion.div
              key={type}
              className="bg-white/70 backdrop-blur-md rounded-2xl p-6 shadow-lg"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div className="flex items-center space-x-3 mb-4">
                <div className={`w-8 h-8 ${config.bgColor} rounded-full flex items-center justify-center`}>
                  <SafeIcon icon={config.icon} className={`text-sm ${config.color}`} />
                </div>
                <h3 className="text-lg font-semibold text-gray-800 capitalize">
                  {type} Files ({files.length})
                </h3>
              </div>

              <div className="space-y-3">
                {files.map(file => (
                  <motion.div
                    key={file.id}
                    className="flex items-center justify-between p-4 bg-gray-50 rounded-xl"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                  >
                    <div className="flex items-center space-x-4 flex-1">
                      <div className={`w-10 h-10 ${config.bgColor} rounded-lg flex items-center justify-center relative`}>
                        <SafeIcon icon={config.icon} className={`${config.color}`} />
                        {type === 'image' && file.status === 'completed' && file.url && (
                          <img
                            src={file.url}
                            alt={file.name}
                            className="absolute inset-0 w-full h-full object-cover rounded-lg"
                            onError={(e) => {
                              // If image fails to load, try to recreate blob URL
                              if (file.originalFile) {
                                const newUrl = URL.createObjectURL(file.originalFile);
                                e.target.src = newUrl;
                                addUploadedFile({ ...file, url: newUrl });
                              }
                            }}
                          />
                        )}
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-gray-800 truncate">{file.name}</p>
                        <div className="flex items-center space-x-4 text-sm text-gray-600">
                          <span>{formatFileSize(file.size)}</span>
                          <span>{new Date(file.uploadDate).toLocaleDateString()}</span>
                          {file.status === 'completed' && (
                            <span className="flex items-center space-x-1 text-green-600">
                              <SafeIcon icon={FiCheck} className="text-xs" />
                              <span>Ready</span>
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Upload Progress */}
                    {uploadProgress[file.id] !== undefined && (
                      <div className="w-32 mx-4">
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-purple-500 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${uploadProgress[file.id]}%` }}
                          />
                        </div>
                        <p className="text-xs text-gray-600 mt-1 text-center">
                          {Math.round(uploadProgress[file.id])}%
                        </p>
                      </div>
                    )}

                    {/* Actions */}
                    <div className="flex items-center space-x-2">
                      {file.status === 'completed' && (
                        <>
                          {/* Audio Play Button */}
                          {(type === 'audio' || type === 'podcast') && file.url && (
                            <>
                              <motion.button
                                onClick={() => handleAudioToggle(file.id)}
                                className="p-2 bg-green-100 text-green-600 rounded-full hover:bg-green-200 transition-colors"
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                title="Play/Pause"
                              >
                                <SafeIcon icon={audioPlaying[file.id] ? FiPause : FiPlay} className="text-sm" />
                              </motion.button>
                              <audio
                                id={`audio-${file.id}`}
                                src={file.url}
                                onEnded={() => setAudioPlaying(prev => ({ ...prev, [file.id]: false }))}
                                onPause={() => setAudioPlaying(prev => ({ ...prev, [file.id]: false }))}
                                onPlay={() => setAudioPlaying(prev => ({ ...prev, [file.id]: true }))}
                              />
                            </>
                          )}

                          <motion.button
                            onClick={() => handlePreview(file)}
                            className="p-2 bg-blue-100 text-blue-600 rounded-full hover:bg-blue-200 transition-colors"
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            title="Preview"
                          >
                            <SafeIcon icon={FiEye} className="text-sm" />
                          </motion.button>

                          <motion.button
                            onClick={() => downloadFile(file)}
                            className="p-2 bg-green-100 text-green-600 rounded-full hover:bg-green-200 transition-colors"
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            title="Download"
                          >
                            <SafeIcon icon={FiDownload} className="text-sm" />
                          </motion.button>
                        </>
                      )}

                      <motion.button
                        onClick={() => deleteFile(file.id)}
                        className="p-2 bg-red-100 text-red-600 rounded-full hover:bg-red-200 transition-colors"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        title="Delete"
                      >
                        <SafeIcon icon={FiTrash2} className="text-sm" />
                      </motion.button>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          );
        })}
      </div>

      {(!data.uploadedFiles || data.uploadedFiles.length === 0) && (
        <div className="text-center py-12">
          <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <SafeIcon icon={FiUpload} className="text-4xl text-gray-400" />
          </div>
          <h3 className="text-xl font-semibold text-gray-800 mb-2">No Files Uploaded Yet</h3>
          <p className="text-gray-600">Start by uploading your first file using the upload zones above</p>
        </div>
      )}

      {/* Preview Modal */}
      <AnimatePresence>
        {previewFile && (
          <motion.div
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setPreviewFile(null)}
          >
            <motion.div
              className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between p-4 border-b">
                <h3 className="text-lg font-semibold text-gray-800">{previewFile.name}</h3>
                <button
                  onClick={() => setPreviewFile(null)}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <SafeIcon icon={FiX} className="text-gray-400" />
                </button>
              </div>

              <div className="p-6">
                {previewFile.type === 'image' && previewFile.url && (
                  <img
                    src={previewFile.url}
                    alt={previewFile.name}
                    className="w-full h-auto max-h-[60vh] object-contain rounded-lg"
                    onError={(e) => {
                      // If image fails to load, try to recreate blob URL
                      if (previewFile.originalFile) {
                        const newUrl = URL.createObjectURL(previewFile.originalFile);
                        e.target.src = newUrl;
                        const updatedFile = { ...previewFile, url: newUrl };
                        addUploadedFile(updatedFile);
                        setPreviewFile(updatedFile);
                      }
                    }}
                  />
                )}

                {(previewFile.type === 'audio' || previewFile.type === 'podcast') && (
                  <div className="text-center py-8">
                    <div className="w-24 h-24 bg-gradient-to-r from-green-400 to-blue-400 rounded-full flex items-center justify-center mx-auto mb-4">
                      <SafeIcon icon={previewFile.type === 'audio' ? FiMusic : FiMic} className="text-white text-3xl" />
                    </div>
                    {previewFile.url && (
                      <audio controls className="w-full max-w-md mx-auto">
                        <source src={previewFile.url} type={`audio/${previewFile.name.split('.').pop()}`} />
                        Your browser does not support the audio element.
                      </audio>
                    )}
                  </div>
                )}

                {previewFile.type === 'pdf' && previewFile.url && (
                  <iframe
                    src={previewFile.url}
                    className="w-full h-[60vh] border rounded-lg"
                    title={previewFile.name}
                  />
                )}

                <div className="mt-4 text-sm text-gray-600 space-y-1">
                  <p><strong>Size:</strong> {formatFileSize(previewFile.size)}</p>
                  <p><strong>Type:</strong> {previewFile.type}</p>
                  <p><strong>Uploaded:</strong> {new Date(previewFile.uploadDate).toLocaleString()}</p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default FileUploadManager;