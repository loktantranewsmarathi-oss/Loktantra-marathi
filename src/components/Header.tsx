import React, { useState } from 'react';
import { Search, Bookmark, Tv, FileText, MapPin, Menu, X, MessageSquare, LogIn, KeyRound, Facebook, Instagram, Youtube } from 'lucide-react';
import { NewsCategory } from '../types';
import { SiteSettings, DEFAULT_SITE_SETTINGS } from './SiteSettings';

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
  siteSettings?: SiteSettings;
}

export const Header: React.FC<HeaderProps> = ({
  activeCategory, onSelectCategory, searchQuery, onSearchChange, savedArticlesCount,
  onOpenSavedModal, fontSizeMultiplier, onChangeFontSize, onOpenLiveTv, onOpenEPaper,
  siteSettings = DEFAULT_SITE_SETTINGS,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const categories: NewsCategory[] = ['मुख्यपृष्ठ','नाशिक जिल्हा','महाराष्ट्र','शेती व ग्रामीण','शिक्षण व क्रीडा','व्हिडिओ','फोटो गॅलरी','ई-पेपर'];
  const wa = siteSettings.whatsapp ? `https://wa.me/${siteSettings.whatsapp.replace(/\D/g, '')}` : '';
  const openAdmin = () => { window.location.hash = '#admin'; };
  const openForgot = () => { window.location.hash = '#admin-forgot'; };

  return (
    <header className="w-full bg-white border-b-4 border-[#B91C1C] shadow-sm sticky top-0 z-40">
      <div className="bg-slate-900 text-slate-200 text-xs py-1.5 px-4 border-b border-slate-800">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-3 text-slate-300">
            <span className="flex items-center gap-1 font-medium"><MapPin className="w-3.5 h-3.5 text-[#B91C1C]" />{siteSettings.address || 'पिंपळगाव बसवंत / नाशिक'}</span>
            <span className="hidden md:inline border-l border-slate-700 pl-3 text-slate-400">{new Date().toLocaleDateString('mr-IN', { weekday:'long', day:'numeric', month:'long', year:'numeric' })}</span>
          </div>
          <div className="flex items-center gap-2 flex-wrap justify-end">
            <div className="flex items-center bg-slate-800 rounded-lg px-2 py-0.5 border border-slate-700 text-slate-300">
              <span className="mr-1 text-[10px] text-slate-400 font-bold">अक्षर:</span>
              <button onClick={() => onChangeFontSize(0.9)} className="px-1 font-bold">अ-</button>
              <button onClick={() => onChangeFontSize(1.0)} className="px-1 font-bold">अ</button>
              <button onClick={() => onChangeFontSize(1.15)} className="px-1 font-bold">अ+</button>
            </div>
            <button onClick={onOpenSavedModal} className="flex items-center gap-1 bg-slate-800 px-2.5 py-1 rounded-lg border border-slate-700 text-amber-300 text-xs"><Bookmark className="w-3.5 h-3.5"/><span className="hidden sm:inline font-bold">साठवलेल्या</span><span className="bg-amber-400 text-slate-950 text-[10px] font-black px-1.5 rounded-full">{savedArticlesCount}</span></button>
            {siteSettings.phone1 && <a href={`tel:${siteSettings.phone1}`} className="hidden sm:flex items-center gap-1 bg-slate-800 px-2.5 py-1 rounded-lg text-xs">📞 {siteSettings.phone1}</a>}
            {wa && <a href={wa} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 bg-emerald-700 text-white px-2.5 py-1 rounded-lg text-xs font-bold"><MessageSquare className="w-3.5 h-3.5"/><span className="hidden sm:inline">WhatsApp</span></a>}
            <button onClick={openAdmin} className="flex items-center gap-1 bg-red-700 hover:bg-red-800 text-white px-2.5 py-1 rounded-lg text-xs font-bold"><LogIn className="w-3.5 h-3.5"/> Admin Login</button>
            <button onClick={openForgot} className="flex items-center gap-1 bg-white/10 hover:bg-white/20 text-amber-300 px-2.5 py-1 rounded-lg text-xs font-bold"><KeyRound className="w-3.5 h-3.5"/> Forgot Password</button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-3 sm:py-4 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="hidden lg:flex flex-col text-xs text-slate-500 border-l-4 border-[#B91C1C] pl-3"><span className="font-extrabold text-slate-900">{siteSettings.siteName}</span><span className="font-medium text-slate-600">डिजिटल न्यूज व ई-पेपर</span><span className="text-[11px] text-slate-400">{siteSettings.address}</span></div>
        <div className="text-center cursor-pointer" onClick={() => onSelectCategory('मुख्यपृष्ठ')}>
          {siteSettings.logoUrl ? <img src={siteSettings.logoUrl} alt={siteSettings.siteName} className="h-14 sm:h-20 mx-auto object-contain"/> : <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-[#B91C1C] leading-none font-newspaper">{siteSettings.siteName}</h1>}
          <p className="text-xs font-bold uppercase tracking-widest text-slate-600 mt-1">"{siteSettings.tagline}"</p>
        </div>
        <div className="flex items-center gap-2 sm:gap-3">
          <button onClick={onOpenEPaper} className="flex items-center gap-1.5 bg-[#B91C1C] text-white px-3.5 py-2 rounded-xl text-xs md:text-sm font-bold"><FileText className="w-4 h-4 text-amber-300"/><span>ई-पेपर</span></button>
          <button onClick={onOpenLiveTv} className="flex items-center gap-1.5 bg-[#1F2937] text-white px-3.5 py-2 rounded-xl text-xs md:text-sm font-bold"><Tv className="w-4 h-4 text-red-500"/><span>LIVE TV</span></button>
          <div className="hidden sm:flex items-center gap-1">
            {siteSettings.facebook && <a href={siteSettings.facebook} target="_blank" rel="noopener noreferrer" className="p-2 rounded-lg bg-slate-100"><Facebook size={16}/></a>}
            {siteSettings.instagram && <a href={siteSettings.instagram} target="_blank" rel="noopener noreferrer" className="p-2 rounded-lg bg-slate-100"><Instagram size={16}/></a>}
            {siteSettings.youtube && <a href={siteSettings.youtube} target="_blank" rel="noopener noreferrer" className="p-2 rounded-lg bg-slate-100"><Youtube size={16}/></a>}
          </div>
        </div>
      </div>

      <nav className="bg-white border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-4 flex items-center justify-between">
          <div className="hidden md:flex items-center gap-2 overflow-x-auto py-2 scrollbar-none text-sm font-bold">{categories.map(cat => <button key={cat} onClick={() => onSelectCategory(cat)} className={`px-3 py-1.5 rounded-lg text-xs font-bold ${activeCategory===cat?'bg-[#1F2937] text-white':'text-slate-700 hover:text-[#B91C1C] hover:bg-gray-100'}`}>{cat==='ई-पेपर'?'📰 ई-पेपर':cat}</button>)}</div>
          <div className="flex md:hidden items-center py-2"><button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="p-1.5 text-white bg-slate-900 rounded flex items-center gap-1 font-bold text-sm">{mobileMenuOpen?<X className="w-5 h-5"/>:<Menu className="w-5 h-5"/>}<span>मेनू ({activeCategory})</span></button></div>
          <div className="flex items-center py-1"><div className="relative">{searchOpen?<div className="flex items-center bg-white rounded-md text-slate-900 px-2 py-1 shadow-md w-48 sm:w-64 border border-slate-300"><Search className="w-4 h-4 text-slate-400 mr-1.5"/><input type="text" value={searchQuery} onChange={e=>onSearchChange(e.target.value)} placeholder="बातमी शोधा..." className="w-full text-xs sm:text-sm focus:outline-none bg-transparent" autoFocus/><button onClick={()=>setSearchOpen(false)} className="ml-1 text-slate-500"><X className="w-4 h-4"/></button></div>:<button onClick={()=>setSearchOpen(true)} className="flex items-center gap-1 bg-red-900/80 px-2.5 py-1.5 rounded text-xs font-medium text-red-100"><Search className="w-3.5 h-3.5"/><span className="hidden sm:inline">शोधा</span></button>}</div></div>
        </div>
        {mobileMenuOpen && <div className="md:hidden bg-slate-900 text-white px-4 py-3 space-y-1 border-t border-red-900">{categories.map(cat=><button key={cat} onClick={()=>{onSelectCategory(cat);setMobileMenuOpen(false)}} className={`w-full text-left px-3 py-2 text-sm font-semibold rounded ${activeCategory===cat?'bg-red-700 text-amber-300':'hover:bg-slate-800'}`}>{cat}</button>)}</div>}
      </nav>
    </header>
  );
};
