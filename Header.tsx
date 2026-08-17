import React, { useState } from 'react';
import { 
  Newspaper, 
  Search, 
  Bookmark, 
  Tv, 
  FileText, 
  PhoneCall, 
  Share2, 
  Menu, 
  X, 
  MapPin, 
  Sun, 
  Volume2, 
  MessageSquare
} from 'lucide-react';
import { NewsCategory } from '../types';

interface HeaderProps {
  activeCategory: NewsCategory;
  onSelectCategory: (category: NewsCategory) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  savedArticlesCount: number;
  onOpenSavedModal: () => void;
  fontSizeMultiplier: number;
  onChangeFontSize: (multiplier: number) => void;
  onOpenLiveTv: () => void;
  onOpenEPaper: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeCategory,
  onSelectCategory,
  searchQuery,
  onSearchChange,
  savedArticlesCount,
  onOpenSavedModal,
  fontSizeMultiplier,
  onChangeFontSize,
  onOpenLiveTv,
  onOpenEPaper
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  const categories: NewsCategory[] = [
    'मुख्यपृष्ठ',
    'नाशिक जिल्हा',
    'महाराष्ट्र',
    'शेती व ग्रामीण',
    'शिक्षण व क्रीडा',
    'व्हिडिओ',
    'फोटो गॅलरी',
    'ई-पेपर'
  ];

  const currentDateMarathi = "रविवार, १६ ऑगस्ट २०२६";

  return (
    <header className="w-full bg-white border-b-4 border-[#B91C1C] shadow-sm sticky top-0 z-40">
      {/* 1. TOP UTILITY BAR */}
      <div className="bg-slate-900 text-slate-200 text-xs py-1.5 px-4 border-b border-slate-800">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          {/* Left info */}
          <div className="flex items-center gap-4 text-slate-300">
            <span className="flex items-center gap-1 font-medium">
              <MapPin className="w-3.5 h-3.5 text-[#B91C1C]" />
              पिंपळगाव बसवंत / नाशिक (२८°C ⛅)
            </span>
            <span className="hidden md:inline border-l border-slate-700 pl-4 text-slate-400">
              {currentDateMarathi}
            </span>
            <span className="hidden lg:inline border-l border-slate-700 pl-4 text-amber-400 font-medium">
              घोषवाक्य: "जनतेचा आवाज, जनतेसाठी"
            </span>
          </div>

          {/* Right Controls */}
          <div className="flex items-center gap-3">
            {/* Font Size Adjuster */}
            <div className="flex items-center bg-slate-800 rounded-lg px-2 py-0.5 border border-slate-700 text-slate-300">
              <span className="mr-1 text-[10px] text-slate-400 font-bold uppercase">अक्षर:</span>
              <button 
                onClick={() => onChangeFontSize(0.9)} 
                className={`px-1 hover:text-white font-bold ${fontSizeMultiplier === 0.9 ? 'text-red-400' : ''}`}
                title="लहान अक्षर"
              >
                अ-
              </button>
              <button 
                onClick={() => onChangeFontSize(1.0)} 
                className={`px-1 hover:text-white font-bold ${fontSizeMultiplier === 1.0 ? 'text-red-400' : ''}`}
                title="सामान्य अक्षर"
              >
                अ
              </button>
              <button 
                onClick={() => onChangeFontSize(1.15)} 
                className={`px-1 hover:text-white font-bold ${fontSizeMultiplier === 1.15 ? 'text-red-400' : ''}`}
                title="मोठे अक्षर"
              >
                अ+
              </button>
            </div>

            {/* Saved Bookmarks Button */}
            <button
              onClick={onOpenSavedModal}
              className="flex items-center gap-1 bg-slate-800 hover:bg-slate-700 px-2.5 py-1 rounded-lg border border-slate-700 text-amber-300 text-xs transition"
              title="माझ्या जतन केलेल्या बातम्या"
            >
              <Bookmark className="w-3.5 h-3.5 text-amber-400 fill-amber-400/20" />
              <span className="hidden sm:inline font-bold">साठवलेल्या</span>
              <span className="bg-amber-400 text-slate-950 text-[10px] font-black px-1.5 py-0.2 rounded-full">
                {savedArticlesCount}
              </span>
            </button>

            {/* WhatsApp Group Link */}
            <a
              href="https://wa.me/917668525252?text=नमस्कार,%20मला%20लोकतंत्र%20मराठी%20न्यूज%20ग्रुपमध्ये%20जॉईन%20व्हायचे%20आहे."
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 bg-emerald-700 hover:bg-emerald-600 text-white px-2.5 py-1 rounded-lg text-xs transition font-bold shadow-sm"
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">WhatsApp</span>
            </a>
          </div>
        </div>
      </div>

      {/* 2. NEWSPAPER MASTHEAD BANNER */}
      <div className="max-w-7xl mx-auto px-4 py-3 sm:py-4 flex flex-col md:flex-row items-center justify-between gap-4">
        
        {/* Registration badge - Desktop Left */}
        <div className="hidden lg:flex flex-col text-xs text-slate-500 border-l-4 border-[#B91C1C] pl-3">
          <span className="font-extrabold text-slate-900">लोकतंत्र मराठी</span>
          <span className="font-medium text-slate-600">डिजिटल न्यूज व ई-पेपर</span>
          <span className="text-[11px] text-slate-400 font-mono">नाशिक • निफाड आवृत्ती</span>
        </div>

        {/* Center Main Masthead Logo */}
        <div className="text-center cursor-pointer" onClick={() => onSelectCategory('मुख्यपृष्ठ')}>
          <h1 className="text-3xl sm:text-5xl lg:text-5xl font-extrabold tracking-tight text-[#B91C1C] leading-none font-newspaper">
            लोकतंत्र मराठी
          </h1>
          <p className="text-xs font-bold uppercase tracking-widest text-slate-600 mt-1 font-sans-marathi">
            "जनतेचा आवाज, जनतेसाठी"
          </p>
        </div>

        {/* Right CTA Action Buttons */}
        <div className="flex items-center gap-2 sm:gap-3">
          <button
            onClick={onOpenEPaper}
            className="flex items-center gap-1.5 bg-[#B91C1C] hover:bg-red-800 text-white px-3.5 py-2 rounded-xl text-xs md:text-sm font-bold shadow-sm transition transform active:scale-95"
          >
            <FileText className="w-4 h-4 text-amber-300" />
            <span>ई-पेपर</span>
          </button>

          <button
            onClick={onOpenLiveTv}
            className="flex items-center gap-1.5 bg-[#1F2937] hover:bg-slate-800 text-white px-3.5 py-2 rounded-xl text-xs md:text-sm font-bold shadow-sm transition border border-slate-700"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
            </span>
            <Tv className="w-4 h-4 text-red-500" />
            <span>LIVE TV</span>
          </button>
        </div>
      </div>

      {/* 3. NAVIGATION MENU BAR */}
      <nav className="bg-white border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-4 flex items-center justify-between">
          
          {/* Desktop Links */}
          <div className="hidden md:flex items-center gap-2 overflow-x-auto py-2 scrollbar-none text-sm font-bold uppercase">
            {categories.map((cat) => {
              const isActive = activeCategory === cat;
              if (cat === 'ई-पेपर') {
                return (
                  <button
                    key={cat}
                    onClick={() => onSelectCategory(cat)}
                    className="bg-[#B91C1C] text-white px-3.5 py-1.5 rounded-lg font-bold text-xs uppercase tracking-wider cursor-pointer animate-pulse hover:bg-red-800 transition"
                  >
                    📰 ई-पेपर
                  </button>
                );
              }
              return (
                <button
                  key={cat}
                  onClick={() => onSelectCategory(cat)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    isActive 
                      ? 'bg-[#1F2937] text-white shadow-sm' 
                      : 'text-slate-700 hover:text-[#B91C1C] hover:bg-gray-100'
                  }`}
                >
                  {cat}
                </button>
              );
            })}
          </div>

          {/* Mobile Header Left Toggle */}
          <div className="flex md:hidden items-center py-2">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-1.5 text-white hover:bg-red-900 rounded focus:outline-none flex items-center gap-1 font-bold text-sm"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              <span>मेनू ({activeCategory})</span>
            </button>
          </div>

          {/* Right Search Input Toggle */}
          <div className="flex items-center py-1 gap-2">
            <div className="relative">
              {searchOpen ? (
                <div className="flex items-center bg-white rounded-md text-slate-900 px-2 py-1 shadow-md w-48 sm:w-64 border border-slate-300">
                  <Search className="w-4 h-4 text-slate-400 mr-1.5 shrink-0" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => onSearchChange(e.target.value)}
                    placeholder="बातमी शोधा..."
                    className="w-full text-xs sm:text-sm focus:outline-none bg-transparent"
                    autoFocus
                  />
                  {searchQuery && (
                    <button 
                      onClick={() => onSearchChange('')}
                      className="text-slate-400 hover:text-slate-600 text-xs font-bold px-1"
                    >
                      ×
                    </button>
                  )}
                  <button 
                    onClick={() => setSearchOpen(false)}
                    className="ml-1 text-slate-500 hover:text-slate-800"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setSearchOpen(true)}
                  className="flex items-center gap-1 bg-red-900/80 hover:bg-slate-900 px-2.5 py-1.5 rounded text-xs font-medium text-red-100 transition border border-red-700"
                >
                  <Search className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">शोधा</span>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-slate-900 text-white px-4 py-3 space-y-1 border-t border-red-900 animate-fadeIn">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => {
                  onSelectCategory(cat);
                  setMobileMenuOpen(false);
                }}
                className={`w-full text-left px-3 py-2 text-sm font-semibold rounded ${
                  activeCategory === cat ? 'bg-red-700 text-amber-300' : 'hover:bg-slate-800 text-slate-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        )}
      </nav>
    </header>
  );
};
