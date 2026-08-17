import React from 'react';
import { Clock, MapPin, Bookmark, Volume2, Share2, Eye, ChevronRight } from 'lucide-react';
import { NewsArticle } from '../types';

interface NewsCardProps {
  article: NewsArticle;
  onSelect: (article: NewsArticle) => void;
  isSaved: boolean;
  onToggleSave: (article: NewsArticle) => void;
  layout?: 'grid' | 'horizontal' | 'compact';
}

export const NewsCard: React.FC<NewsCardProps> = ({
  article,
  onSelect,
  isSaved,
  onToggleSave,
  layout = 'grid'
}) => {

  const handleShareWhatsApp = (e: React.MouseEvent) => {
    e.stopPropagation();
    const text = `📰 *${article.title}*\n\n${article.summary}\n\nवाचा - लोकतंत्र मराठी:\n${window.location.href}`;
    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`, '_blank');
  };

  if (layout === 'horizontal') {
    return (
      <div 
        onClick={() => onSelect(article)}
        className="group bg-white rounded-xl shadow-sm hover:shadow-md border border-slate-200 overflow-hidden transition-all cursor-pointer flex flex-col sm:flex-row items-stretch"
      >
        <div className="sm:w-2/5 relative overflow-hidden bg-slate-100 min-h-[160px]">
          <img 
            src={article.imageUrl} 
            alt={article.title} 
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
          <span className="absolute top-2 left-2 bg-red-700 text-white text-[10px] font-bold px-2 py-0.5 rounded shadow">
            {article.category}
          </span>
        </div>

        <div className="sm:w-3/5 p-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-xs text-slate-500 mb-1.5">
              <span className="flex items-center gap-1">
                <MapPin className="w-3 h-3 text-red-600" />
                {article.location}
              </span>
              <span>{article.time}</span>
            </div>

            <h3 className="text-base sm:text-lg font-bold text-slate-900 group-hover:text-red-700 transition font-newspaper leading-snug mb-2 line-clamp-2">
              {article.title}
            </h3>

            <p className="text-xs sm:text-sm text-slate-600 line-clamp-2 font-sans-marathi mb-3">
              {article.summary}
            </p>
          </div>

          <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs">
            <span className="text-slate-500 font-medium">
              {article.date}
            </span>

            <div className="flex items-center gap-2">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onToggleSave(article);
                }}
                className={`p-1 rounded transition ${isSaved ? 'text-amber-500' : 'text-slate-400 hover:text-slate-700'}`}
                title="साठवा"
              >
                <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-amber-500' : ''}`} />
              </button>

              <button
                onClick={handleShareWhatsApp}
                className="p-1 text-slate-400 hover:text-emerald-600 transition"
                title="WhatsApp शेअर"
              >
                <Share2 className="w-4 h-4" />
              </button>

              <span className="text-red-700 font-bold flex items-center gap-0.5 text-xs group-hover:translate-x-0.5 transition">
                सविस्तर <ChevronRight className="w-3.5 h-3.5" />
              </span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (layout === 'compact') {
    return (
      <div 
        onClick={() => onSelect(article)}
        className="group bg-white p-3 rounded-lg border border-slate-200 hover:border-red-300 hover:shadow-sm cursor-pointer transition flex items-center gap-3"
      >
        <img 
          src={article.imageUrl} 
          alt={article.title} 
          className="w-20 h-20 rounded-md object-cover shrink-0" 
        />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5 text-[10px] text-red-700 font-bold uppercase mb-0.5">
            <span>{article.category}</span>
            <span>•</span>
            <span className="text-slate-400 font-normal">{article.time}</span>
          </div>
          <h4 className="text-xs sm:text-sm font-bold text-slate-900 group-hover:text-red-700 transition line-clamp-2 leading-snug font-newspaper">
            {article.title}
          </h4>
        </div>
      </div>
    );
  }

  // Default Grid Card
  return (
    <div 
      onClick={() => onSelect(article)}
      className="group bg-white rounded-xl shadow-sm hover:shadow-xl border border-gray-200 hover:border-red-300 overflow-hidden transition-all duration-300 cursor-pointer flex flex-col justify-between"
    >
      <div>
        <div className="relative overflow-hidden aspect-video bg-slate-100">
          <img 
            src={article.imageUrl} 
            alt={article.title} 
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition"></div>
          
          <span className="absolute top-3 left-3 bg-[#B91C1C] text-white text-[11px] font-bold px-2.5 py-0.5 rounded shadow">
            {article.category}
          </span>

          <span className="absolute bottom-2 left-3 text-white text-xs font-medium flex items-center gap-1 drop-shadow">
            <MapPin className="w-3 h-3 text-red-400" />
            {article.location}
          </span>
        </div>

        <div className="p-4 sm:p-5">
          <div className="flex items-center justify-between text-xs text-slate-500 mb-2 font-sans-marathi">
            <span className="font-medium text-slate-600">{article.date}</span>
            <span className="flex items-center gap-1 font-mono">
              <Clock className="w-3 h-3 text-slate-400" />
              {article.time}
            </span>
          </div>

          <h3 className="text-base sm:text-lg font-bold text-slate-900 group-hover:text-[#B91C1C] transition font-newspaper leading-snug mb-2 line-clamp-2">
            {article.title}
          </h3>

          <p className="text-xs sm:text-sm text-slate-600 line-clamp-3 font-sans-marathi mb-4 leading-relaxed">
            {article.summary}
          </p>
        </div>
      </div>

      <div className="px-4 sm:px-5 py-3 bg-slate-50 border-t border-gray-100 flex items-center justify-between text-xs">
        <span className="text-slate-500 font-semibold flex items-center gap-1">
          ✍️ {article.author}
        </span>

        <div className="flex items-center gap-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggleSave(article);
            }}
            className={`p-1.5 rounded-lg transition ${isSaved ? 'bg-amber-100 text-amber-600' : 'text-slate-400 hover:text-slate-700'}`}
            title="साठवा"
          >
            <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-amber-600' : ''}`} />
          </button>

          <button
            onClick={handleShareWhatsApp}
            className="p-1.5 text-slate-400 hover:text-emerald-600 transition"
            title="WhatsApp शेअर"
          >
            <Share2 className="w-4 h-4" />
          </button>

          <span className="bg-[#B91C1C] hover:bg-red-800 text-white font-bold px-2.5 py-1 rounded-lg text-xs transition flex items-center gap-1 shadow-sm">
            वाचा <ChevronRight className="w-3 h-3" />
          </span>
        </div>
      </div>
    </div>
  );
};
