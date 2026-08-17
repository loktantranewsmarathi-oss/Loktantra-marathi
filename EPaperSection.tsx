import React, { useState } from 'react';
import { 
  FileText, 
  Calendar, 
  ChevronLeft, 
  ChevronRight, 
  ZoomIn, 
  ZoomOut, 
  Maximize2, 
  Share2, 
  Download, 
  Printer, 
  X, 
  Check, 
  Sparkles 
} from 'lucide-react';
import { EPaperPage, EPaperClip } from '../types';

interface EPaperSectionProps {
  pages: EPaperPage[];
}

export const EPaperSection: React.FC<EPaperSectionProps> = ({ pages }) => {
  const [activePageNum, setActivePageNum] = useState<number>(1);
  const [selectedClip, setSelectedClip] = useState<EPaperClip | null>(null);
  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const [selectedDate, setSelectedDate] = useState<string>("१६ ऑगस्ट २०२६");
  const [copiedClip, setCopiedClip] = useState(false);

  const currentPage = pages.find(p => p.pageNumber === activePageNum) || pages[0];

  const handleNextPage = () => {
    if (activePageNum < pages.length) {
      setActivePageNum(activePageNum + 1);
    }
  };

  const handlePrevPage = () => {
    if (activePageNum > 1) {
      setActivePageNum(activePageNum - 1);
    }
  };

  const handleShareClip = (clip: EPaperClip) => {
    const text = `📰 *लोकतंत्र मराठी ई-पेपर क्लिप*\n\n*${clip.headline}*\n${clip.summary}\n\nआजचा ई-पेपर वाचा: ${window.location.href}`;
    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`, '_blank');
  };

  return (
    <section id="epaper-reader" className="mb-12 bg-slate-900 text-white rounded-2xl p-4 sm:p-6 shadow-xl border border-slate-800">
      
      {/* Header Bar */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-800 pb-4 mb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="p-2 bg-red-700 text-white rounded-lg shadow">
              <FileText className="w-5 h-5 text-amber-300" />
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold font-newspaper text-white">
              📰 लोकतंत्र मराठी डिजिटल ई-पेपर
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-slate-400 font-sans-marathi pl-10">
            आजचा अंक वाचा - क्लिपवर क्लिक करून सविस्तर बातमी वाचा व कटिंग शेअर करा
          </p>
        </div>

        {/* Date Picker & Controls */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Date Selector */}
          <div className="flex items-center bg-slate-800 rounded-lg px-3 py-1.5 border border-slate-700 text-xs">
            <Calendar className="w-3.5 h-3.5 text-amber-400 mr-2" />
            <select
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="bg-transparent text-slate-200 focus:outline-none cursor-pointer font-bold"
            >
              <option value="१६ ऑगस्ट २०२६" className="bg-slate-900">अंक: १६ ऑगस्ट २०२६ (आज)</option>
              <option value="१५ ऑगस्ट २०२६" className="bg-slate-900">अंक: १५ ऑगस्ट २०२६</option>
              <option value="१४ ऑगस्ट २०२६" className="bg-slate-900">अंक: १४ ऑगस्ट २०२६</option>
              <option value="१३ ऑगस्ट २०२६" className="bg-slate-900">अंक: १३ ऑगस्ट २०२६</option>
            </select>
          </div>

          {/* Zoom controls */}
          <div className="flex items-center bg-slate-800 rounded-lg p-1 border border-slate-700">
            <button
              onClick={() => setZoomLevel(Math.max(0.8, zoomLevel - 0.15))}
              className="p-1 hover:bg-slate-700 rounded text-slate-300 hover:text-white"
              title="झूम कमी"
            >
              <ZoomOut className="w-4 h-4" />
            </button>
            <span className="text-xs px-2 font-mono font-bold text-amber-400">
              {Math.round(zoomLevel * 100)}%
            </span>
            <button
              onClick={() => setZoomLevel(Math.min(1.4, zoomLevel + 0.15))}
              className="p-1 hover:bg-slate-700 rounded text-slate-300 hover:text-white"
              title="झूम वाढवा"
            >
              <ZoomIn className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Page Tabs Navigation Bar */}
      <div className="flex items-center justify-between bg-slate-800 p-2 rounded-xl mb-6 overflow-x-auto gap-2">
        <div className="flex items-center gap-2">
          {pages.map((p) => (
            <button
              key={p.pageNumber}
              onClick={() => setActivePageNum(p.pageNumber)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition ${
                activePageNum === p.pageNumber
                  ? 'bg-red-700 text-amber-300 shadow-md'
                  : 'bg-slate-900 text-slate-300 hover:bg-slate-700'
              }`}
            >
              पान {p.pageNumber}
            </button>
          ))}
        </div>

        {/* Prev / Next Page buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={handlePrevPage}
            disabled={activePageNum === 1}
            className="flex items-center gap-1 bg-slate-900 hover:bg-slate-700 disabled:opacity-40 px-2.5 py-1 rounded text-xs font-bold text-slate-200"
          >
            <ChevronLeft className="w-4 h-4" /> मागील पान
          </button>
          <button
            onClick={handleNextPage}
            disabled={activePageNum === pages.length}
            className="flex items-center gap-1 bg-slate-900 hover:bg-slate-700 disabled:opacity-40 px-2.5 py-1 rounded text-xs font-bold text-slate-200"
          >
            पुढील पान <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* E-Paper Digital Page Representation Canvas */}
      <div className="overflow-x-auto pb-4 flex justify-center">
        <div 
          className="epaper-bg text-slate-900 rounded-lg shadow-2xl p-6 sm:p-8 border-4 border-slate-700 relative transition-transform duration-200 origin-top"
          style={{ 
            width: '100%', 
            maxWidth: '850px',
            minHeight: '1050px',
            transform: `scale(${zoomLevel})`
          }}
        >
          {/* Print Header Masthead Simulation */}
          <div className="border-b-4 border-double border-slate-900 pb-4 mb-6 text-center">
            <div className="flex justify-between items-center text-[11px] font-bold text-slate-700 border-b border-slate-400 pb-1 mb-2">
              <span>{currentPage.edition}</span>
              <span>दिनांक: {selectedDate}</span>
              <span>पान क्र. {currentPage.pageNumber}</span>
            </div>

            <h1 className="text-4xl sm:text-6xl font-black font-newspaper text-red-800 tracking-tight leading-none mb-1">
              लोकतंत्र वृत्तपत्र
            </h1>
            <p className="text-xs font-bold font-serif-marathi text-slate-800 uppercase tracking-widest">
              — {currentPage.subtitle} —
            </p>
          </div>

          {/* Interactive Clickable Clips Container */}
          <div className="relative min-h-[850px] border border-slate-300 rounded p-4 bg-white/50 backdrop-blur-xs">
            
            <div className="absolute top-2 right-2 bg-red-100 border border-red-300 text-red-800 text-[10px] font-bold px-2 py-0.5 rounded flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-red-600" />
              <span>बातमीवर क्लिक करून कटिंग वाचा</span>
            </div>

            {/* Render Clipping Hotspots */}
            {currentPage.clips.map((clip) => (
              <div
                key={clip.id}
                onClick={() => setSelectedClip(clip)}
                style={{
                  position: 'absolute',
                  left: `${clip.x}%`,
                  top: `${clip.y}%`,
                  width: `${clip.width}%`,
                  height: `${clip.height}%`,
                }}
                className="epaper-clip-border rounded p-3 cursor-pointer flex flex-col justify-between group shadow-sm"
              >
                <div>
                  <span className="bg-red-800 text-amber-200 text-[10px] font-extrabold px-1.5 py-0.5 rounded uppercase mb-1.5 inline-block">
                    {clip.category}
                  </span>
                  <h3 className="text-sm sm:text-base font-extrabold text-slate-950 font-newspaper group-hover:text-red-800 line-clamp-2 leading-tight">
                    {clip.headline}
                  </h3>
                  <p className="text-xs text-slate-700 line-clamp-3 mt-1 font-serif-marathi">
                    {clip.summary}
                  </p>
                </div>

                <div className="flex items-center justify-between text-[10px] text-red-700 font-bold border-t border-red-200 pt-1 mt-2">
                  <span>📰 क्लिप पाहा</span>
                  <span className="bg-red-700 text-white px-1.5 py-0.5 rounded text-[9px] group-hover:bg-red-900">
                    झाूम क्लिप
                  </span>
                </div>
              </div>
            ))}

            {/* Decorative Grid Lines to imitate newspaper print column layout */}
            <div className="pointer-events-none absolute inset-0 grid grid-cols-3 gap-4 opacity-10">
              <div className="border-r border-slate-900"></div>
              <div className="border-r border-slate-900"></div>
              <div></div>
            </div>

          </div>

          {/* Footer watermark */}
          <div className="mt-6 pt-2 border-t border-slate-300 text-center text-[10px] text-slate-500 font-bold">
            © 2026 लोकतंत्र मराठी ई-पेपर डिजिटल एडिशन. सर्व हक्क राखीव.
          </div>

        </div>
      </div>

      {/* POPUP NEWS CLIP MODAL */}
      {selectedClip && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-slate-950/85 backdrop-blur-sm animate-fadeIn">
          <div className="bg-amber-50 text-slate-950 w-full max-w-lg rounded-xl shadow-2xl overflow-hidden border-2 border-red-800 printable-area">
            
            {/* Clip Header */}
            <div className="bg-red-800 text-amber-300 px-4 py-3 flex items-center justify-between border-b border-red-900 no-print">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-amber-300" />
                <span className="font-bold text-xs">ई-पेपर बातमी क्लिप ({selectedClip.category})</span>
              </div>
              <button
                onClick={() => setSelectedClip(null)}
                className="p-1 hover:bg-red-900 rounded text-amber-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Clip Content Body */}
            <div className="p-6 font-serif-marathi space-y-4">
              <div className="border-b border-red-200 pb-3">
                <span className="text-xs font-bold text-red-800 uppercase tracking-widest block mb-1">
                  लोकतंत्र मराठी ई-पेपर कटिंग
                </span>
                <h2 className="text-2xl font-black text-slate-900 font-newspaper leading-snug">
                  {selectedClip.headline}
                </h2>
              </div>

              <div className="bg-white p-3 rounded border border-amber-200 font-bold text-sm text-slate-800">
                📌 {selectedClip.summary}
              </div>

              <p className="text-sm text-slate-800 leading-relaxed font-sans-marathi whitespace-pre-line">
                {selectedClip.fullText}
              </p>

              <div className="pt-3 border-t border-slate-300 text-[11px] text-slate-500 flex justify-between items-center">
                <span>दिनांक: {selectedDate}</span>
                <span>लोकतंत्र मराठी ई-पेपर</span>
              </div>
            </div>

            {/* Clip Actions */}
            <div className="bg-amber-100 p-3 border-t border-amber-200 flex items-center justify-between gap-2 no-print">
              <button
                onClick={() => handleShareClip(selectedClip)}
                className="flex items-center gap-1.5 bg-emerald-700 hover:bg-emerald-800 text-white px-3 py-1.5 rounded-lg text-xs font-bold shadow"
              >
                <Share2 className="w-3.5 h-3.5" />
                <span>WhatsApp वर क्लिप पाठवा</span>
              </button>

              <button
                onClick={() => window.print()}
                className="flex items-center gap-1.5 bg-slate-800 hover:bg-slate-900 text-white px-3 py-1.5 rounded-lg text-xs font-bold shadow"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>प्रिंट करा</span>
              </button>
            </div>

          </div>
        </div>
      )}

    </section>
  );
};
