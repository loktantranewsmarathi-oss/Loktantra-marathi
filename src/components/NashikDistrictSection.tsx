import React, { useState } from 'react';
import { MapPin, Filter, ArrowRight } from 'lucide-react';
import { NewsArticle } from '../types';
import { NewsCard } from './NewsCard';

interface NashikDistrictSectionProps {
  articles: NewsArticle[];
  onSelectArticle: (article: NewsArticle) => void;
  savedArticleIds: string[];
  onToggleSave: (article: NewsArticle) => void;
}

export const NashikDistrictSection: React.FC<NashikDistrictSectionProps> = ({
  articles,
  onSelectArticle,
  savedArticleIds,
  onToggleSave
}) => {
  const [selectedTaluka, setSelectedTaluka] = useState<string>('सर्व');

  const talukas = [
    'सर्व',
    'पिंपळगाव बसवंत',
    'निफाड',
    'नाशिक शहर',
    'मालेगाव',
    'सिन्नर',
    'येवला'
  ];

  // Filter district articles
  const districtArticles = articles.filter(item => 
    item.category === 'नाशिक जिल्हा' || 
    item.location.includes('नाशिक') || 
    item.location.includes('पिंपळगाव') || 
    item.location.includes('निफाड')
  );

  const filteredArticles = selectedTaluka === 'सर्व' 
    ? districtArticles 
    : districtArticles.filter(item => 
        item.location.toLowerCase().includes(selectedTaluka.toLowerCase()) || 
        item.title.toLowerCase().includes(selectedTaluka.toLowerCase())
      );

  return (
    <section className="mb-12 bg-gradient-to-b from-slate-100 to-white p-4 sm:p-6 rounded-2xl border border-slate-200 shadow-sm">
      
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 border-b border-slate-200 pb-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="p-2 bg-red-700 text-white rounded-lg shadow">
              <MapPin className="w-5 h-5 text-amber-300" />
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-newspaper tracking-tight">
              📍 नाशिक जिल्हा विशेष
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-slate-600 font-sans-marathi pl-10">
            पिंपळगाव बसवंत, निफाड, नाशिक शहर व संपूर्ण जिल्ह्यातील ताज्या घडामोडी
          </p>
        </div>

        {/* Taluka Filter Buttons */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-2 md:pb-0 scrollbar-none">
          <Filter className="w-4 h-4 text-slate-400 shrink-0 hidden sm:block mr-1" />
          {talukas.map((taluka) => (
            <button
              key={taluka}
              onClick={() => setSelectedTaluka(taluka)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition shadow-sm ${
                selectedTaluka === taluka
                  ? 'bg-red-700 text-white shadow'
                  : 'bg-white text-slate-700 hover:bg-slate-200 border border-slate-200'
              }`}
            >
              {taluka}
            </button>
          ))}
        </div>
      </div>

      {/* Articles Grid */}
      {filteredArticles.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredArticles.map((article) => (
            <NewsCard
              key={article.id}
              article={article}
              onSelect={onSelectArticle}
              isSaved={savedArticleIds.includes(article.id)}
              onToggleSave={onToggleSave}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-10 bg-white rounded-xl border border-dashed border-slate-300">
          <p className="text-slate-500 font-medium text-sm">
            "{selectedTaluka}" साठी ताज्या बातम्या शोधत आहोत...
          </p>
          <button 
            onClick={() => setSelectedTaluka('सर्व')}
            className="mt-2 text-xs font-bold text-red-700 hover:underline"
          >
            सर्व नाशिक जिल्हा बातम्या पाहा
          </button>
        </div>
      )}

    </section>
  );
};
