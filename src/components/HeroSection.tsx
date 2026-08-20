import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { Flame, ChevronRight, MapPin, Clock, Bookmark, Play, Camera, FileText } from 'lucide-react';
import { NewsArticle } from '../types';

interface HeroSectionProps {
  articles: NewsArticle[];
  onSelectArticle: (article: NewsArticle) => void;
  savedArticleIds: string[];
  onToggleSave: (article: NewsArticle) => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  articles,
  onSelectArticle,
  savedArticleIds,
  onToggleSave
}) => {
  if (articles.length === 0) return null;

  const leadArticle = articles[0]; // 1. नाशिक जिल्ह्यात पावसाची जोरदार हजेरी
  const topStories = articles.slice(1, 5); // 2, 3, 4, 5
  const [advertisements, setAdvertisements] = useState<any[]>([]);

  useEffect(() => {
    const loadAdvertisements = async () => {
      if (!supabase) return;
      const { data } = await supabase
        .from('advertisements')
        .select('*')
        .eq('is_active', true)
        .in('position', ['homepage_top', 'homepage_middle', 'homepage_bottom'])
        .order('display_order', { ascending: true });
      setAdvertisements(data || []);
    };
    loadAdvertisements();
  }, []);

  return (
    <section className="mb-10 space-y-4">
      
      {/* Section Title Header */}
      <div className="flex items-center justify-between border-b-4 border-[#B91C1C] pb-2">
        <div className="flex items-center gap-2">
          <span className="p-1.5 bg-[#B91C1C] text-white rounded-lg shadow-sm">
            <Flame className="w-5 h-5 text-amber-300" />
          </span>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 font-newspaper tracking-tight">
            प्रमुख बातम्या & ई-सुविधा
          </h2>
        </div>
        <span className="text-xs font-bold text-[#B91C1C] uppercase tracking-widest hidden sm:inline">
          लोकतंत्र Bento Grid
        </span>
      </div>

      {/* Primary Bento Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        
        {/* BENTO CARD 1: MAIN LEAD STORY (7 Cols) */}
        <div 
          onClick={() => onSelectArticle(leadArticle)}
          className="lg:col-span-7 bg-white p-6 rounded-xl border border-gray-200 shadow-md flex flex-col justify-between relative overflow-hidden group cursor-pointer hover:border-red-300 transition-all duration-300"
        >
          <span className="absolute top-4 left-6 z-10 bg-[#B91C1C] text-white text-[10px] px-2.5 py-1 font-bold rounded uppercase tracking-wider shadow">
            प्रमुख बातमी
          </span>

          <div className="mt-6 flex-grow flex flex-col justify-between space-y-4">
            <div className="relative aspect-[16/9] rounded-lg overflow-hidden bg-slate-900 shadow-inner">
              <img 
                src={leadArticle.imageUrl} 
                alt={leadArticle.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" 
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent"></div>
              
              <div className="absolute bottom-3 left-3 right-3 text-white flex items-center justify-between text-xs">
                <span className="flex items-center gap-1 font-medium text-amber-300">
                  <MapPin className="w-3.5 h-3.5 text-red-400" />
                  {leadArticle.location}
                </span>
                <span className="bg-black/60 backdrop-blur px-2 py-0.5 rounded text-[11px]">
                  {leadArticle.date}
                </span>
              </div>
            </div>

            <div>
              <h2 className="text-xl sm:text-3xl font-bold leading-tight mb-3 text-gray-900 font-newspaper group-hover:text-[#B91C1C] transition">
                {leadArticle.title}
              </h2>
              <p className="text-gray-600 text-sm sm:text-base leading-relaxed font-sans-marathi line-clamp-3">
                {leadArticle.summary}
              </p>
            </div>

            <div className="flex items-center justify-between border-t border-gray-100 pt-4">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-slate-800 text-amber-300 flex items-center justify-center font-bold text-sm font-newspaper border border-slate-700">
                  रक्ष
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-900">{leadArticle.author}</p>
                  <p className="text-[10px] text-gray-500">संपादक, लोकतंत्र मराठी</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onToggleSave(leadArticle);
                  }}
                  className="p-2 rounded-lg hover:bg-slate-100 text-slate-500 transition"
                  title="साठवा"
                >
                  <Bookmark className={`w-4 h-4 ${savedArticleIds.includes(leadArticle.id) ? 'fill-amber-500 text-amber-500' : ''}`} />
                </button>
                <span className="bg-[#B91C1C] hover:bg-red-800 text-white font-bold px-3 py-1.5 rounded-lg text-xs flex items-center gap-1 shadow transition">
                  वाचा <ChevronRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* BENTO CARD 2: VIDEO LIVE STREAM (5 Cols) */}
        <div className="lg:col-span-5 bg-[#1F2937] text-white p-5 rounded-xl flex flex-col justify-between shadow-lg border-l-4 border-[#B91C1C]">
          <div>
            <h3 className="text-base sm:text-lg font-bold border-l-4 border-[#B91C1C] pl-3 mb-1 font-newspaper text-white">
              व्हिडिओ न्यूज LIVE
            </h3>
            <p className="text-xs text-gray-400 mb-3 font-sans-marathi">
              नाशिक जिल्ह्यातील पावसाची व इतर ताज्या घडामोडींची सद्यस्थिती — थेट रिपोर्ट
            </p>
          </div>

          <div 
            onClick={() => {
              const el = document.getElementById('video-news');
              el?.scrollIntoView({ behavior: 'smooth' });
            }}
            className="aspect-video bg-black rounded-lg flex items-center justify-center relative group cursor-pointer overflow-hidden border border-slate-700 shadow-inner"
          >
            <img 
              src="https://images.unsplash.com/photo-1515694346937-94d85e41e6f0?auto=format&fit=crop&q=80&w=800" 
              alt="Live Stream" 
              className="w-full h-full object-cover opacity-60 group-hover:scale-105 transition"
            />
            <div className="w-12 h-12 rounded-full bg-[#B91C1C] flex items-center justify-center shadow-2xl group-hover:scale-110 transition absolute z-10">
              <div className="w-0 h-0 border-t-[8px] border-t-transparent border-l-[12px] border-l-white border-b-[8px] border-b-transparent ml-1"></div>
            </div>
            <span className="absolute top-2 left-2 bg-[#B91C1C] text-white text-[10px] px-2 py-0.5 rounded font-black tracking-wider uppercase animate-pulse">
              ● LIVE
            </span>
            <span className="absolute bottom-2 right-2 bg-slate-900/80 text-amber-300 text-[10px] px-1.5 py-0.5 rounded font-mono font-bold">
              HD 1080p
            </span>
          </div>

          <div className="pt-3 border-t border-slate-700 flex justify-between items-center text-xs text-gray-300">
            <span>लोकतंत्र मराठी थेट प्रक्षेपण</span>
            <span className="text-[#B91C1C] font-bold text-[11px] hover:underline cursor-pointer">
              सर्व व्हिडिओ पाहा →
            </span>
          </div>
        </div>

        {/* SECOND BENTO ROW */}

        {/* BENTO CARD 3: E-PAPER DIGITAL (4 Cols) */}
        <div 
          onClick={() => {
            const el = document.getElementById('epaper-reader');
            el?.scrollIntoView({ behavior: 'smooth' });
          }}
          className="lg:col-span-4 bg-gradient-to-br from-[#B91C1C] to-[#7F1D1D] text-white p-5 rounded-xl shadow-xl flex flex-col items-center justify-center text-center cursor-pointer group hover:shadow-2xl transition"
        >
          <FileText className="w-8 h-8 text-amber-300 mb-2 group-hover:scale-110 transition" />
          <h3 className="text-2xl sm:text-3xl font-black mb-1 font-newspaper tracking-tight">ई-पेपर</h3>
          <p className="text-xs opacity-90 mb-4 font-sans-marathi">आजचा संपूर्ण अंक पाहा व डिजिटल कटिंग वाचा</p>
          <button className="bg-white text-[#B91C1C] px-6 py-2 rounded-full font-bold text-xs uppercase tracking-wider shadow-md hover:scale-105 transition-transform">
            अंक पाहा
          </button>
        </div>

        {/* BENTO CARD 4: NASHIK UPDATES (4 Cols) */}
        <div className="lg:col-span-4 bg-white p-5 rounded-xl border border-gray-200 shadow-sm flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-bold mb-3 border-b pb-2 text-gray-800 uppercase tracking-wide font-newspaper flex justify-between items-center">
              <span>नाशिक अपडेट्स</span>
              <span className="text-[10px] text-[#B91C1C] font-mono">ताज्या घडामोडी</span>
            </h3>
            <ul className="text-xs space-y-2.5 font-medium text-gray-700 font-sans-marathi">
              {topStories.map((story) => (
                <li 
                  key={story.id} 
                  onClick={() => onSelectArticle(story)}
                  className="flex items-start gap-2 hover:text-[#B91C1C] cursor-pointer transition"
                >
                  <span className="text-[#B91C1C] font-bold shrink-0">•</span>
                  <span className="line-clamp-2">{story.title}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* BENTO CARD 5: LIVE ADVERTISEMENT */}
<div className="lg:col-span-4 bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
  {advertisements.length > 0 ? (
  <div className="h-full">
    {advertisements.slice(0, 3).map((ad) => {
      const mediaUrl = ad.media_url || ad.video_url || ad.image_url || '';
      const isVideo = ad.media_type === 'video' || !!ad.video_url;

      const content = (
        <div className="group cursor-pointer">
          {mediaUrl && isVideo ? (
            <video
              src={mediaUrl}
              className="w-full h-auto object-contain bg-gray-50"
              autoPlay
              muted
              loop
              playsInline
              controls
            />
          ) : mediaUrl ? (
            <img
              src={mediaUrl}
              alt={ad.title}
              className="w-full h-auto object-contain bg-gray-50 group-hover:scale-105 transition-transform duration-500"
            />
          ) : null}

          <div className="p-4 text-center">
            <div className="text-[10px] font-black text-[#B91C1C] uppercase tracking-widest mb-1">
              जाहिरात
            </div>

            <h3 className="text-base font-black text-gray-900 font-newspaper">
              {ad.title}
            </h3>

            <p className="text-xs text-gray-500 mt-1 font-sans-marathi">
              {ad.advertiser_name}
            </p>

            {ad.description && (
              <p className="text-sm text-gray-700 mt-2 leading-relaxed font-sans-marathi">
                {ad.description}
              </p>
            )}
            <p className="text-xs text-gray-500 mt-2 flex items-center justify-center gap-1 font-semibold">
              👁️ {(ad.views_count ?? 0).toLocaleString("en-IN")} व्ह्यूज
            </p>

            {ad.link_type && ad.link_type !== 'none' && ad.link_url && (
              <div className="mt-2 text-[11px] font-bold text-[#B91C1C]">
                {ad.link_type === 'youtube'
                  ? '▶️ YouTube वर पाहा'
                  : ad.link_type === 'whatsapp'
                    ? '💬 WhatsApp वर संपर्क करा'
                    : '🌐 अधिक माहितीसाठी येथे क्लिक करा'}
              </div>
            )}
          </div>
        </div>
      );

      return ad.link_url && ad.link_type !== 'none' ? (
        <a
          key={ad.id}
          href={ad.link_url}
          target="_blank"
          rel="noopener noreferrer"
          className="block"
        >
          {content}
        </a>
      ) : (
        <div key={ad.id}>{content}</div>
      );
    })}
  </div>
) : (
<div className="h-full p-5 flex flex-col justify-center text-center">
      <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">
        जाहिरात विशेष
      </h3>
      <p className="text-sm font-bold text-gray-800 font-newspaper mb-1">
        तुमच्या व्यवसायाची जाहिरात येथे करा
      </p>
      <p className="text-xs text-gray-500 font-sans-marathi">
        लोकतंत्र मराठीच्या माध्यमातून हजारो वाचकांपर्यंत पोहोचा
      </p>
      <div className="mt-3 pt-2 border-t border-gray-200">
        <p className="text-xs font-bold text-[#B91C1C] font-mono">
          संपर्क: 7668525252 | 9860541550
        </p>
      </div>
    </div>
  )}
</div>

      </div>

    </section>
  );
};

