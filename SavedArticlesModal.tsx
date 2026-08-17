import React from 'react';
import { Bookmark, X, Trash2, ExternalLink } from 'lucide-react';
import { NewsArticle } from '../types';

interface SavedArticlesModalProps {
  isOpen: boolean;
  onClose: () => void;
  savedArticles: NewsArticle[];
  onSelectArticle: (article: NewsArticle) => void;
  onRemoveArticle: (article: NewsArticle) => void;
  onClearAll: () => void;
}

export const SavedArticlesModal: React.FC<SavedArticlesModalProps> = ({
  isOpen,
  onClose,
  savedArticles,
  onSelectArticle,
  onRemoveArticle,
  onClearAll
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-slate-950/80 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white text-slate-900 w-full max-w-2xl max-h-[85vh] rounded-2xl shadow-2xl overflow-hidden flex flex-col border border-slate-200">
        
        {/* Header */}
        <div className="bg-slate-900 text-white px-5 py-3.5 flex items-center justify-between border-b border-slate-800 shrink-0">
          <div className="flex items-center gap-2">
            <Bookmark className="w-5 h-5 text-amber-400 fill-amber-400/30" />
            <h3 className="font-bold text-base font-newspaper">
              माझ्या साठवलेल्या बातम्या ({savedArticles.length})
            </h3>
          </div>

          <div className="flex items-center gap-2">
            {savedArticles.length > 0 && (
              <button
                onClick={onClearAll}
                className="text-xs text-red-400 hover:text-red-300 font-bold px-2 py-1 rounded bg-slate-800"
              >
                सर्व काढा
              </button>
            )}
            <button
              onClick={onClose}
              className="p-1 hover:bg-slate-800 rounded text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 space-y-3">
          {savedArticles.length > 0 ? (
            savedArticles.map((article) => (
              <div
                key={article.id}
                className="bg-slate-50 p-3 sm:p-4 rounded-xl border border-slate-200 flex items-center justify-between gap-4 hover:border-red-300 transition group"
              >
                <div 
                  onClick={() => {
                    onSelectArticle(article);
                    onClose();
                  }}
                  className="flex items-center gap-3 flex-1 cursor-pointer min-w-0"
                >
                  <img 
                    src={article.imageUrl} 
                    alt={article.title} 
                    className="w-16 h-16 rounded-lg object-cover shrink-0" 
                  />
                  <div className="min-w-0">
                    <span className="text-[10px] font-bold text-red-700 uppercase block mb-0.5">
                      {article.category}
                    </span>
                    <h4 className="text-sm font-bold text-slate-900 group-hover:text-red-700 transition line-clamp-2 font-newspaper leading-snug">
                      {article.title}
                    </h4>
                    <span className="text-[11px] text-slate-500 font-sans-marathi">
                      {article.date} | {article.location}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => {
                      onSelectArticle(article);
                      onClose();
                    }}
                    className="p-2 bg-red-700 hover:bg-red-800 text-white rounded-lg text-xs font-bold transition flex items-center gap-1 shadow"
                  >
                    <span>वाचा</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </button>

                  <button
                    onClick={() => onRemoveArticle(article)}
                    className="p-2 text-slate-400 hover:text-red-600 rounded-lg hover:bg-red-50 transition"
                    title="काढा"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-12 text-slate-500 font-sans-marathi">
              <Bookmark className="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <p className="font-bold text-base text-slate-700">तुमच्याकडे कोणतीही साठवलेली बातमी नाही.</p>
              <p className="text-xs text-slate-500 mt-1">
                कोणतीही बातमी वाचताना 'साठवा' (Bookmark) बटणावर क्लिक करा.
              </p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
