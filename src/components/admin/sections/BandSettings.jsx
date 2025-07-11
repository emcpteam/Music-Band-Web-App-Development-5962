// Add this section to BandSettings.jsx
const SectionVisibilityControls = () => {
  const { data, updateSectionVisibility } = useAdmin();
  const { sectionVisibility } = data.band;

  return (
    <div className="bg-white/70 backdrop-blur-md rounded-2xl p-6 shadow-lg">
      <h2 className="text-xl font-semibold text-gray-800 mb-6">Section Visibility</h2>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <label className="text-sm font-medium text-gray-700">Albums Section</label>
          <div className="relative inline-block w-12 h-6">
            <input
              type="checkbox"
              checked={sectionVisibility.albums}
              onChange={(e) => updateSectionVisibility('albums', e.target.checked)}
              className="sr-only"
            />
            <div className={`block w-12 h-6 rounded-full transition-colors ${
              sectionVisibility.albums ? 'bg-purple-600' : 'bg-gray-200'
            }`} />
            <div className={`absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform transform ${
              sectionVisibility.albums ? 'translate-x-6' : 'translate-x-0'
            }`} />
          </div>
        </div>

        <div className="flex items-center justify-between">
          <label className="text-sm font-medium text-gray-700">Merchandising Section</label>
          <div className="relative inline-block w-12 h-6">
            <input
              type="checkbox"
              checked={sectionVisibility.merchandising}
              onChange={(e) => updateSectionVisibility('merchandising', e.target.checked)}
              className="sr-only"
            />
            <div className={`block w-12 h-6 rounded-full transition-colors ${
              sectionVisibility.merchandising ? 'bg-purple-600' : 'bg-gray-200'
            }`} />
            <div className={`absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform transform ${
              sectionVisibility.merchandising ? 'translate-x-6' : 'translate-x-0'
            }`} />
          </div>
        </div>

        <div className="flex items-center justify-between">
          <label className="text-sm font-medium text-gray-700">Fan Wall Section</label>
          <div className="relative inline-block w-12 h-6">
            <input
              type="checkbox"
              checked={sectionVisibility.fanWall}
              onChange={(e) => updateSectionVisibility('fanWall', e.target.checked)}
              className="sr-only"
            />
            <div className={`block w-12 h-6 rounded-full transition-colors ${
              sectionVisibility.fanWall ? 'bg-purple-600' : 'bg-gray-200'
            }`} />
            <div className={`absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform transform ${
              sectionVisibility.fanWall ? 'translate-x-6' : 'translate-x-0'
            }`} />
          </div>
        </div>

        <div className="flex items-center justify-between">
          <label className="text-sm font-medium text-gray-700">Podcast Section</label>
          <div className="relative inline-block w-12 h-6">
            <input
              type="checkbox"
              checked={sectionVisibility.podcast}
              onChange={(e) => updateSectionVisibility('podcast', e.target.checked)}
              className="sr-only"
            />
            <div className={`block w-12 h-6 rounded-full transition-colors ${
              sectionVisibility.podcast ? 'bg-purple-600' : 'bg-gray-200'
            }`} />
            <div className={`absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform transform ${
              sectionVisibility.podcast ? 'translate-x-6' : 'translate-x-0'
            }`} />
          </div>
        </div>

        <div className="flex items-center justify-between">
          <label className="text-sm font-medium text-gray-700">Gallery Section</label>
          <div className="relative inline-block w-12 h-6">
            <input
              type="checkbox"
              checked={sectionVisibility.gallery}
              onChange={(e) => updateSectionVisibility('gallery', e.target.checked)}
              className="sr-only"
            />
            <div className={`block w-12 h-6 rounded-full transition-colors ${
              sectionVisibility.gallery ? 'bg-purple-600' : 'bg-gray-200'
            }`} />
            <div className={`absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform transform ${
              sectionVisibility.gallery ? 'translate-x-6' : 'translate-x-0'
            }`} />
          </div>
        </div>
      </div>
    </div>
  );
};

// Add the SectionVisibilityControls component to your BandSettings component render
const BandSettings = () => {
  // ... existing code ...

  return (
    <motion.div className="max-w-4xl mx-auto">
      {/* ... existing sections ... */}
      
      {/* Add Section Visibility Controls */}
      <SectionVisibilityControls />
      
      {/* ... rest of the sections ... */}
    </motion.div>
  );
};