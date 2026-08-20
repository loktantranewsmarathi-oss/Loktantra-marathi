import React, { useState, useEffect, useRef } from 'react';
import * as pdfjsLib from 'pdfjs-dist';
import pdfWorker from 'pdfjs-dist/build/pdf.worker.min.mjs?url';
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
import { supabase } from '../lib/supabase';

interface EPaperSectionProps {
  pages: EPaperPage[];
}

export const EPaperSection: React.FC<EPaperSectionProps> = ({ pages }) => {
  const [activePageNum, setActivePageNum] = useState<number>(1);
  const [selectedClip, setSelectedClip] = useState<EPaperClip | null>(null);
  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const [selectedDate, setSelectedDate] = useState<string>("१६ ऑगस्ट २०२६");
  const [copiedClip, setCopiedClip] = useState(false);
  const [liveEpapers, setLiveEpapers] = useState<any[]>([]);
  const [liveEpaperLoading, setLiveEpaperLoading] = useState(true);
  const livePdf = liveEpapers.find((item) => Number(item.page_number) === activePageNum)?.file_url || liveEpapers[0]?.file_url || '';
  const [livePdfPageCount, setLivePdfPageCount] = useState(8);
  const pdfCanvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    pdfjsLib.GlobalWorkerOptions.workerSrc = pdfWorker;
  }, []);

  useEffect(() => {
    const renderPdf = async () => {
      if (!livePdf || !pdfCanvasRef.current) return;

      try {
        const response = await fetch(livePdf, {
          mode: 'cors',
          cache: 'no-store'
        });

        if (!response.ok) {
          throw new Error(`PDF fetch failed: ${response.status}`);
        }

        const pdfData = new Uint8Array(await response.arrayBuffer());

        const loadingTask = pdfjsLib.getDocument({
          data: pdfData
        });

        const pdf = await loadingTask.promise;
        setLivePdfPageCount(Math.min(pdf.numPages, 8));

        const pdfPageNumber = Math.min(
          Math.max(activePageNum, 1),
          Math.min(pdf.numPages, 8)
        );

        const page = await pdf.getPage(pdfPageNumber);

        const containerWidth =
          pdfCanvasRef.current.parentElement?.clientWidth || 800;

        const baseViewport = page.getViewport({ scale: 1 });
        const scale = Math.max(
          1,
          Math.min(2, (containerWidth - 20) / baseViewport.width)
        );

        const viewport = page.getViewport({ scale });

        const canvas = pdfCanvasRef.current;
        const context = canvas.getContext('2d');

        if (!context) return;

        canvas.width = viewport.width;
        canvas.height = viewport.height;
        canvas.style.width = '100%';
        canvas.style.height = 'auto';
        canvas.style.display = 'block';

        await page.render({
          canvasContext: context,
          viewport
        }).promise;
      } catch (error) {
        console.error('PDF render error:', error);
      }
    };

    renderPdf();
  }, [livePdf, activePageNum]);

  const currentPage = pages.find(p => p.pageNumber === activePageNum) || pages[0];

  React.useEffect(() => {
    const loadLiveEpapers = async () => {
      if (!supabase) {
        setLiveEpaperLoading(false);
        return;
      }

      const { data } = await supabase
        .from('epapers')
        .select('id, edition_date, edition_name, page_number, title, file_url, views_count')
        .order('edition_date', { ascending: false })
        .order('page_number', { ascending: true });

      setLiveEpapers(data || []);
      setLiveEpaperLoading(false);
    };

    loadLiveEpapers();
  }, []);

  const handleNextPage = () => {
    if (activePageNum < 8) {
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

      {/* LIVE SUPABASE PDF E-PAPER */}
      {livePdf && (
        <div className="mb-6 bg-slate-800 rounded-xl p-3 border border-slate-700">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm sm:text-base font-bold text-amber-300">
              📰 आजचा Live E-Paper
            <span className="text-xs text-slate-400 flex items-center gap-1">
              👁️ {(liveEpapers.find((item) => Number(item.page_number) === activePageNum)?.views_count ?? liveEpapers[0]?.views_count ?? 0).toLocaleString("en-IN")} व्ह्यूज
            </span>
            </h3>
            <a
              href={livePdf}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs bg-red-700 hover:bg-red-800 text-white px-3 py-1.5 rounded-lg font-bold"
            >
              PDF उघडा
            </a>
          </div>
          <div className="bg-white rounded-lg overflow-auto flex justify-center p-2">
            <canvas
              ref={pdfCanvasRef}
              className="max-w-full h-auto shadow-lg"
            />
          </div>
        </div>
      )}

      {/* Page Tabs Navigation Bar */}
      <div className="flex items-center justify-between bg-slate-800 p-2 rounded-xl mb-6 overflow-x-auto gap-2">
        <div className="flex items-center gap-2">
          {Array.from(
            { length: 8 },
            (_, index) => index + 1
          ).map((pageNumber) => (
            <button
              key={pageNumber}
              onClick={() => setActivePageNum(pageNumber)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition ${
                activePageNum === pageNumber
                  ? 'bg-red-700 text-amber-300 shadow-md'
                  : 'bg-slate-900 text-slate-300 hover:bg-slate-700'
              }`}
            >
              पान {pageNumber}
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
            disabled={activePageNum >= 8}
            className="flex items-center gap-1 bg-slate-900 hover:bg-slate-700 disabled:opacity-40 px-2.5 py-1 rounded text-xs font-bold text-slate-200"
          >
            पुढील पान <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

    </section>
  );
};
