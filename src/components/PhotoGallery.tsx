import React, { useState } from 'react';
import { Camera, MapPin, Calendar, X, ChevronLeft, ChevronRight, ZoomIn } from 'lucide-react';
import { PhotoGalleryItem } from '../types';

interface PhotoGalleryProps {
  photos: PhotoGalleryItem[];
}

export const PhotoGallery: React.FC<PhotoGalleryProps> = ({ photos }) => {
  const [activeCategory, setActiveCategory] = useState<string>('सर्व');
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState<number | null>(null);

  const categories = [
    'सर्व',
    'स्थानिक कार्यक्रम',
    'सामाजिक उपक्रम',
    'क्रीडा स्पर्धा',
    'शैक्षणिक कार्यक्रम',
    'सांस्कृतिक कार्यक्रम',
    'नागरिकांचे उपक्रम'
  ];

  const filteredPhotos = activeCategory === 'सर्व'
    ? photos
    : photos.filter(p => p.category === activeCategory);

  const handleNextPhoto = () => {
    if (selectedPhotoIndex !== null && selectedPhotoIndex < filteredPhotos.length - 1) {
      setSelectedPhotoIndex(selectedPhotoIndex + 1);
    }
  };

  const handlePrevPhoto = () => {
    if (selectedPhotoIndex !== null && selectedPhotoIndex > 0) {
      setSelectedPhotoIndex(selectedPhotoIndex - 1);
    }
  };

  const currentPhoto = selectedPhotoIndex !== null ? filteredPhotos[selectedPhotoIndex] : null;

  return (
    <section id="photo-gallery" className="mb-12 bg-white rounded-2xl p-4 sm:p-6 border border-slate-200 shadow-sm">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-4 mb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="p-2 bg-red-700 text-white rounded-lg shadow">
              <Camera className="w-5 h-5 text-amber-300" />
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-newspaper">
              📸 फोटो गॅलरी
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-slate-600 font-sans-marathi pl-10">
            पिंपळगाव बसवंत, निफाड व नाशिक जिल्ह्यातील प्रमुख कार्यक्रमांचे फोटो क्षणचित्रे
          </p>
        </div>
      </div>

      {/* Category Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-4 mb-6 scrollbar-none">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition shadow-sm ${
              activeCategory === cat
                ? 'bg-red-700 text-white shadow'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Photos Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredPhotos.map((photo, idx) => (
          <div
            key={photo.id}
            onClick={() => setSelectedPhotoIndex(idx)}
            className="group bg-slate-50 rounded-xl overflow-hidden border border-slate-200 shadow-sm hover:shadow-md cursor-pointer transition flex flex-col justify-between"
          >
            <div>
              <div className="relative aspect-[4/3] overflow-hidden bg-slate-200">
                <img 
                  src={photo.imageUrl} 
                  alt={photo.title} 
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                />
                <div className="absolute inset-0 bg-slate-950/20 opacity-0 group-hover:opacity-100 transition flex items-center justify-center">
                  <span className="bg-white/90 text-slate-900 p-2 rounded-full shadow-lg font-bold text-xs flex items-center gap-1">
                    <ZoomIn className="w-4 h-4 text-red-700" /> पाहण्यासाठी क्लिक करा
                  </span>
                </div>
                <span className="absolute top-2 left-2 bg-red-700 text-white text-[10px] font-bold px-2 py-0.5 rounded shadow">
                  {photo.category}
                </span>
              </div>

              <div className="p-4">
                <h3 className="text-sm sm:text-base font-bold text-slate-900 font-newspaper line-clamp-2 leading-snug group-hover:text-red-700 transition">
                  {photo.title}
                </h3>
                <p className="text-xs text-slate-600 line-clamp-2 mt-1 font-sans-marathi">
                  {photo.description}
                </p>
              </div>
            </div>

            <div className="px-4 py-2.5 bg-slate-100 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
              <span className="flex items-center gap-1">
                <MapPin className="w-3 h-3 text-red-600" /> {photo.location}
              </span>
              <span className="flex items-center gap-1">
                <Calendar className="w-3 h-3" /> {photo.date}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* LIGHTBOX MODAL */}
      {currentPhoto && selectedPhotoIndex !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-slate-950/90 backdrop-blur-md animate-fadeIn">
          <div className="relative bg-slate-900 text-white w-full max-w-4xl rounded-2xl overflow-hidden shadow-2xl border border-slate-800 flex flex-col max-h-[90vh]">
            
            {/* Modal Topbar */}
            <div className="bg-slate-950 px-4 py-3 flex items-center justify-between border-b border-slate-800">
              <span className="bg-red-700 text-white text-xs font-bold px-2.5 py-0.5 rounded">
                {currentPhoto.category} ({selectedPhotoIndex + 1}/{filteredPhotos.length})
              </span>
              <button
                onClick={() => setSelectedPhotoIndex(null)}
                className="p-1 hover:bg-slate-800 rounded text-slate-400 hover:text-white"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Main Lightbox Image View */}
            <div className="relative flex-1 bg-black flex items-center justify-center overflow-hidden min-h-[300px]">
              <img 
                src={currentPhoto.imageUrl} 
                alt={currentPhoto.title}
                className="max-h-[60vh] w-auto object-contain" 
              />

              {/* Prev / Next controls */}
              <button
                onClick={handlePrevPhoto}
                disabled={selectedPhotoIndex === 0}
                className="absolute left-3 p-2 bg-slate-900/80 hover:bg-red-700 disabled:opacity-30 rounded-full text-white transition shadow"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>

              <button
                onClick={handleNextPhoto}
                disabled={selectedPhotoIndex === filteredPhotos.length - 1}
                className="absolute right-3 p-2 bg-slate-900/80 hover:bg-red-700 disabled:opacity-30 rounded-full text-white transition shadow"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            </div>

            {/* Photo Title & Caption */}
            <div className="p-4 sm:p-6 bg-slate-900 border-t border-slate-800 font-sans-marathi">
              <h3 className="text-lg sm:text-xl font-bold font-newspaper text-white mb-1">
                {currentPhoto.title}
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed mb-3">
                {currentPhoto.description}
              </p>
              <div className="flex items-center gap-4 text-xs text-slate-400">
                <span className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-red-500" /> {currentPhoto.location}
                </span>
                <span className="flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-amber-400" /> {currentPhoto.date}
                </span>
              </div>
            </div>

          </div>
        </div>
      )}

    </section>
  );
};
