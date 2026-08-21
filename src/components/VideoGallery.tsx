import React, { useState } from 'react';
import { Tv, Play, Radio, Eye, Clock, X, Sparkles } from 'lucide-react';
import { VideoNewsItem } from '../types';

interface VideoGalleryProps {
  videos: VideoNewsItem[];
}

export const VideoGallery: React.FC<VideoGalleryProps> = ({ videos }) => {
  const [selectedVideo, setSelectedVideo] = useState<VideoNewsItem | null>(null);
  const [activeCategory, setActiveCategory] = useState<string>('सर्व');

  if (!videos || videos.length === 0) return null;

  const categories = [
    'सर्व',
    'ब्रेकिंग न्यूज',
    'स्थानिक बातम्या',
    'महाराष्ट्र',
    'विशेष मुलाखती',
    'ग्राउंड रिपोर्ट'
  ];

  const filteredVideos = activeCategory === 'सर्व'
    ? videos
    : videos.filter(v => v.category === activeCategory);

  const liveVideo = videos.find(v => v.isLive) || videos[0];

  return (
    <section id="video-news" className="mb-12 bg-slate-900 text-white rounded-2xl p-4 sm:p-6 shadow-xl border border-slate-800">
      
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-4 mb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="p-2 bg-red-700 text-white rounded-lg shadow">
              <Tv className="w-5 h-5 text-amber-300" />
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold font-newspaper text-white">
              🎥 व्हिडिओ न्यूज & लोकतंत्र मराठी LIVE
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-slate-400 font-sans-marathi pl-10">
            दररोजच्या महत्त्वाच्या बातम्यांचे व्हिडिओ अपडेट्स आणि थेट प्रक्षेपण
          </p>
        </div>

        {/* Live Badge */}
        <button
          onClick={() => setSelectedVideo(liveVideo)}
          className="flex items-center gap-2 bg-red-700 hover:bg-red-800 text-white font-black px-4 py-2 rounded-xl text-xs sm:text-sm shadow-lg transition transform active:scale-95 border border-red-500"
        >
          <span className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-amber-400"></span>
          </span>
          <Radio className="w-4 h-4 text-amber-300" />
          <span>लोकतंत्र LIVE राहा</span>
        </button>
      </div>

      {/* Category Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-4 scrollbar-none">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition ${
              activeCategory === cat
                ? 'bg-amber-500 text-slate-950 font-black shadow'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Main Featured Video + Playlist Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Big Featured Video (7 cols) */}
        <div 
          onClick={() => setSelectedVideo(liveVideo)}
          className="lg:col-span-7 group bg-slate-950 rounded-2xl overflow-hidden border border-slate-800 cursor-pointer shadow-lg hover:border-red-600 transition"
        >
          <div className="relative aspect-video overflow-hidden">
            <img 
              src={liveVideo.thumbnailUrl} 
              alt={liveVideo.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-80" 
            />
            
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent"></div>

            {/* Play overlay button */}
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="p-4 bg-red-700/90 text-white rounded-full group-hover:scale-110 transition shadow-2xl border-2 border-amber-400">
                <Play className="w-8 h-8 fill-white ml-1" />
              </span>
            </div>

            {liveVideo.isLive && (
              <span className="absolute top-3 left-3 bg-red-600 text-white text-xs font-bold px-2.5 py-1 rounded flex items-center gap-1 shadow">
                <span className="w-2 h-2 rounded-full bg-amber-300 animate-pulse"></span>
                LIVE
              </span>
            )}

            <span className="absolute bottom-3 right-3 bg-slate-900/90 text-amber-300 text-xs font-bold px-2 py-0.5 rounded border border-slate-700">
              {liveVideo.duration}
            </span>
          </div>

          <div className="p-4">
            <div className="flex items-center gap-3 text-xs text-slate-400 mb-1">
              <span className="text-amber-400 font-bold">{liveVideo.category}</span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Eye className="w-3.5 h-3.5" /> {liveVideo.views} व्ह्यूज
              </span>
            </div>

            <h3 className="text-lg sm:text-xl font-bold font-newspaper text-white group-hover:text-amber-300 transition line-clamp-2">
              {liveVideo.title}
            </h3>

            <p className="text-xs text-slate-300 mt-2 line-clamp-2 font-sans-marathi">
              {liveVideo.description}
            </p>
          </div>
        </div>

        {/* Right Video Playlist (5 cols) */}
        <div className="lg:col-span-5 space-y-3 flex flex-col justify-between">
          <div className="bg-slate-800 p-2.5 rounded-t-xl text-xs font-bold text-amber-400 border-b border-slate-700 flex items-center justify-between">
            <span>📹 आजचे प्रमुख व्हिडिओ</span>
            <span className="text-[10px] text-slate-400">लोकतंत्र डिजिटल</span>
          </div>

          <div className="space-y-3">
            {filteredVideos.map((video) => (
              <div
                key={video.id}
                onClick={() => setSelectedVideo(video)}
                className="group bg-slate-800 hover:bg-slate-750 p-2.5 rounded-xl border border-slate-700 hover:border-amber-400/50 cursor-pointer transition flex items-center gap-3"
              >
                <div className="relative w-28 aspect-video rounded-lg overflow-hidden shrink-0 bg-slate-900">
                  <img 
                    src={video.thumbnailUrl} 
                    alt={video.title} 
                    className="w-full h-full object-cover group-hover:scale-105 transition"
                  />
                  <div className="absolute inset-0 bg-slate-950/40 flex items-center justify-center">
                    <Play className="w-4 h-4 fill-white text-white" />
                  </div>
                  <span className="absolute bottom-1 right-1 bg-slate-950/90 text-[9px] text-amber-300 px-1 rounded font-bold">
                    {video.duration}
                  </span>
                </div>

                <div className="flex-1 min-w-0">
                  <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider block">
                    {video.category}
                  </span>
                  <h4 className="text-xs sm:text-sm font-bold text-slate-100 group-hover:text-amber-300 transition line-clamp-2 font-newspaper leading-snug">
                    {video.title}
                  </h4>
                  <span className="text-[10px] text-slate-400 block mt-1">
                    {video.date}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* VIDEO PLAYER MODAL */}
      {selectedVideo && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-slate-950/90 backdrop-blur-md animate-fadeIn">
          <div className="bg-slate-900 text-white w-full max-w-3xl rounded-2xl overflow-hidden shadow-2xl border border-slate-800">
            
            {/* Modal Header */}
            <div className="bg-slate-950 px-4 py-3 flex items-center justify-between border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Tv className="w-4 h-4 text-red-500" />
                <span className="font-bold text-xs text-amber-300">
                  लोकतंत्र मराठी - {selectedVideo.category}
                </span>
              </div>
              <button
                onClick={() => setSelectedVideo(null)}
                className="p-1 hover:bg-slate-800 rounded text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Video Player Display Simulation */}
            <div className="relative aspect-video bg-black flex items-center justify-center overflow-hidden">
              <img 
                src={selectedVideo.thumbnailUrl} 
                alt={selectedVideo.title}
                className="w-full h-full object-cover opacity-60" 
              />
              
              {/* Simulated Live Broadcast Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent flex flex-col justify-between p-4">
                <div className="flex justify-between items-center">
                  <span className="bg-red-700 text-white font-bold text-xs px-2.5 py-1 rounded flex items-center gap-1 shadow">
                    <span className="w-2 h-2 rounded-full bg-amber-300 animate-pulse"></span>
                    लोकतंत्र मराठी LIVE
                  </span>
                  <span className="text-xs text-amber-300 font-mono font-bold bg-slate-900/80 px-2 py-1 rounded border border-slate-700">
                    HD 1080p
                  </span>
                </div>

                <div className="text-center bg-slate-950/80 backdrop-blur-md p-4 rounded-xl border border-slate-800 max-w-xl mx-auto shadow-2xl">
                  <Sparkles className="w-6 h-6 text-amber-400 mx-auto mb-2 animate-bounce" />
                  <p className="text-sm font-bold text-white mb-1">
                    "{selectedVideo.title}"
                  </p>
                  <p className="text-xs text-slate-300 font-sans-marathi">
                    थेट प्रक्षेपण पाहण्यासाठी डिजिटल चॅनेलवर स्वागत आहे.
                  </p>
                </div>
              </div>
            </div>

            {/* Video Info */}
            <div className="p-4 sm:p-5 font-sans-marathi">
              <h3 className="text-lg font-bold font-newspaper text-white mb-2">
                {selectedVideo.title}
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed mb-4">
                {selectedVideo.description}
              </p>

              <div className="flex items-center justify-between text-xs text-slate-400 pt-3 border-t border-slate-800">
                <span>दिनांक: {selectedVideo.date}</span>
                <span>एकूण व्ह्यूज: {selectedVideo.views}</span>
              </div>
            </div>

          </div>
        </div>
      )}

    </section>
  );
};
