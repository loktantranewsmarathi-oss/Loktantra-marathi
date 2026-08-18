import React, { useState, useEffect } from 'react';
import { 
  X, 
  Volume2, 
  VolumeX, 
  Bookmark, 
  Share2, 
  Printer, 
  Clock, 
  MapPin, 
  User, 
  Calendar, 
  Eye, 
  Check, 
  MessageCircle, 
  Facebook, 
  Twitter 
} from 'lucide-react';
import { NewsArticle } from '../types';

interface NewsModalProps {
  article: NewsArticle | null;
  onClose: () => void;
  isSaved: boolean;
  onToggleSave: (article: NewsArticle) => void;
  fontSizeMultiplier: number;
}

export const NewsModal: React.FC<NewsModalProps> = ({
  article,
  onClose,
  isSaved,
  onToggleSave,
  fontSizeMultiplier
}) => {
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  useEffect(() => {
    // Reset speech synth when article changes or closes
    return () => {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, [article]);

  if (!article) return null;

  // Marathi Voice Speech Reader using Web Speech API
  const handleToggleSpeech = () => {
    if (!('speechSynthesis' in window)) {
      alert("तुमच्या ब्राउझरमध्ये ऑडिओ वाचण्याची सोय उपलब्ध नाही.");
      return;
    }

    if (isPlayingAudio) {
      window.speechSynthesis.cancel();
      setIsPlayingAudio(false);
    } else {
      window.speechSynthesis.cancel();
      const textToRead = `${article.title}. ${article.summary}. ${article.content}`;
      const utterance = new SpeechSynthesisUtterance(textToRead);
      utterance.lang = 'mr-IN'; // Marathi language code
      utterance.rate = 0.95;

      utterance.onend = () => setIsPlayingAudio(false);
      utterance.onerror = () => setIsPlayingAudio(false);

      window.speechSynthesis.speak(utterance);
      setIsPlayingAudio(true);
    }
  };

  const handleShareWhatsApp = () => {
    const text = `📰 *${article.title}*\n\n${article.summary}\n\nसविस्तर वाचा - लोकतंत्र मराठी:\n${window.location.href}`;
    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`, '_blank');
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-950/80 backdrop-blur-sm overflow-y-auto animate-fadeIn">
      
      <div 
        className="bg-white w-full max-w-4xl max-h-[92vh] rounded-xl shadow-2xl flex flex-col overflow-hidden border border-slate-200 printable-area"
        style={{ fontSize: `${fontSizeMultiplier * 100}%` }}
      >
        
        {/* Modal Top Action Bar */}
        <div className="bg-slate-900 text-slate-100 px-4 py-3 flex items-center justify-between border-b border-slate-800 no-print shrink-0">
          <div className="flex items-center gap-2">
            <span className="bg-red-700 text-white text-xs font-bold px-2.5 py-0.5 rounded uppercase tracking-wider">
              {article.category}
            </span>
            <span className="text-xs text-slate-400 hidden sm:inline">
              • लोकतंत्र मराठी न्यूज
            </span>
          </div>

          <div className="flex items-center gap-2">
            {/* Audio Reader */}
            <button
              onClick={handleToggleSpeech}
              className={`flex items-center gap-1.5 px-3 py-1 rounded text-xs font-bold transition ${
                isPlayingAudio 
                  ? 'bg-red-600 text-white animate-pulse' 
                  : 'bg-slate-800 hover:bg-slate-700 text-amber-300 border border-slate-700'
              }`}
              title="मराठीत बातमी ऐका"
            >
              {isPlayingAudio ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5 text-amber-400" />}
              <span>{isPlayingAudio ? 'थांबवा' : 'बातमी ऐका 🔊'}</span>
            </button>

            {/* Bookmark */}
            <button
              onClick={() => onToggleSave(article)}
              className={`p-1.5 rounded transition ${
                isSaved ? 'bg-amber-500 text-slate-950' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
              title={isSaved ? "साठवलेली बातमी काढा" : "बातमी साठवा"}
            >
              <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-slate-950' : ''}`} />
            </button>

            {/* Print */}
            <button
              onClick={handlePrint}
              className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded transition hidden sm:block"
              title="बातमी प्रिंट करा"
            >
              <Printer className="w-4 h-4" />
            </button>

            {/* Close Button */}
            <button
              onClick={onClose}
              className="p-1.5 bg-slate-800 hover:bg-red-800 text-slate-300 hover:text-white rounded transition ml-2"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Scrollable Article Content */}
        <div className="p-4 sm:p-8 overflow-y-auto space-y-6">
          
          {/* Headline & Subtitle */}
          <div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 leading-tight font-newspaper mb-3">
              {article.title}
            </h2>

            {/* Metadata Bar */}
            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-slate-600 border-y border-slate-200 py-2.5 my-3">
              <span className="flex items-center gap-1 font-semibold text-red-800">
                <User className="w-3.5 h-3.5" />
                {article.author}
              </span>
              <span className="flex items-center gap-1 text-slate-500">
                <Calendar className="w-3.5 h-3.5" />
                {article.date} | {article.time}
              </span>
              <span className="flex items-center gap-1 text-slate-500">
                <MapPin className="w-3.5 h-3.5 text-red-600" />
                {article.location}
              </span>
              {article.viewsCount && (
                <span className="flex items-center gap-1 text-slate-500 ml-auto">
                  <Eye className="w-3.5 h-3.5" />
                  {article.viewsCount} वाचकांनी वाचले
                </span>
              )}
            </div>
          </div>

          {/* Featured Article Image */}
          {article.imageUrl && (
            <div className="rounded-xl overflow-hidden shadow-md border border-slate-200 bg-slate-100">
              <img 
                src={article.imageUrl} 
                alt={article.title}
                className="w-full max-h-[420px] object-cover" 
              />
              {article.imageCaption && (
                <p className="p-2.5 text-xs text-slate-600 bg-slate-50 border-t border-slate-200 italic text-center font-sans-marathi">
                  📸 {article.imageCaption}
                </p>
              )}
            </div>
          )}

          {/* Highlight Summary Box */}
          <div className="bg-red-50/80 border-l-4 border-red-700 p-4 rounded-r-lg text-slate-800 font-semibold text-base sm:text-lg leading-relaxed font-serif-marathi shadow-inner">
            <span className="text-red-800 font-bold block mb-1 text-xs uppercase tracking-wider">
              📌 बातमीचे प्रमुख सार:
            </span>
            {article.summary}
          </div>

          {/* Full Content Body */}
          <div className="text-slate-800 text-base sm:text-lg leading-relaxed space-y-4 font-sans-marathi whitespace-pre-line">
            {article.content}
          </div>

          {/* Tags */}
          {article.tags && article.tags.length > 0 && (
            <div className="pt-4 border-t border-slate-200 flex flex-wrap items-center gap-2">
              <span className="text-xs font-bold text-slate-500 uppercase">टॅग्स:</span>
              {article.tags.map((tag, idx) => (
                <span 
                  key={idx}
                  className="bg-slate-100 text-slate-700 hover:bg-slate-200 px-2.5 py-1 rounded-full text-xs font-medium cursor-pointer transition"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}

          {/* Share Box Footer */}
          <div className="bg-slate-50 rounded-xl p-4 border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4 no-print">
            <div className="text-center sm:text-left">
              <p className="font-bold text-slate-900 text-sm">ही बातमी इतरांना शेअर करा:</p>
              <p className="text-xs text-slate-500">जनतेचा आवाज - लोकतंत्र मराठी डिजिटल न्यूज</p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleShareWhatsApp}
                className="flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-2 rounded-lg text-xs font-bold shadow transition"
              >
                <MessageCircle className="w-4 h-4" />
                <span>WhatsApp</span>
              </button>

              <button
                onClick={handleCopyLink}
                className="flex items-center gap-1.5 bg-slate-800 hover:bg-slate-900 text-white px-3 py-2 rounded-lg text-xs font-bold shadow transition"
              >
                {copiedLink ? <Check className="w-4 h-4 text-emerald-400" /> : <Share2 className="w-4 h-4" />}
                <span>{copiedLink ? 'कॉपी झाले' : 'लिंक कॉपी'}</span>
              </button>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};
