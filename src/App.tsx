import React, { useState, useEffect } from 'react';
import {
  PHOTO_GALLERY_ITEMS,
  OFFICE_CONTACT_INFO
} from './data/newsData';
import { NewsCategory, NewsArticle } from './types';
import { Header } from './components/Header';
import { BreakingNewsTicker } from './components/BreakingNewsTicker';
import { HeroSection } from './components/HeroSection';
import { NashikDistrictSection } from './components/NashikDistrictSection';
import { EPaperSection } from './components/EPaperSection';
import { VideoGallery } from './components/VideoGallery';
import { PhotoGallery } from './components/PhotoGallery';
import { AboutAndMessage } from './components/AboutAndMessage';
import { AdvertiseSection } from './components/AdvertiseSection';
import { ContactSection } from './components/ContactSection';
import { Footer } from './components/Footer';
import { NewsModal } from './components/NewsModal';
import { NewsCard } from './components/NewsCard';
import { SavedArticlesModal } from './components/SavedArticlesModal';
import { Search, MapPin, Sparkles, AlertCircle } from 'lucide-react';
import { AdminPanel } from './components/AdminPanel';
import { supabase } from './lib/supabase';
import { fetchHomepageLayout, DEFAULT_LAYOUT, LayoutItem } from './components/LayoutEditor';
import { fetchSiteSettings, DEFAULT_SITE_SETTINGS, SiteSettings } from './components/SiteSettings';

export default function App() {
  const [activeCategory, setActiveCategory] = useState<NewsCategory>('मुख्यपृष्ठ');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedArticle, setSelectedArticle] = useState<NewsArticle | null>(null);
  const [savedArticles, setSavedArticles] = useState<NewsArticle[]>([]);
  const [savedModalOpen, setSavedModalOpen] = useState<boolean>(false);
  const [fontSizeMultiplier, setFontSizeMultiplier] = useState<number>(1.0);
  const [liveArticles, setLiveArticles] = useState<NewsArticle[]>([]);
  const [isAdminRoute, setIsAdminRoute] = useState(() => window.location.hash === '#admin' || window.location.hash === '#admin-forgot' || window.location.hash === '#admin-login');
  const [homepageLayout, setHomepageLayout] = useState<LayoutItem[]>(DEFAULT_LAYOUT);
  const [siteSettings, setSiteSettings] = useState<SiteSettings>(DEFAULT_SITE_SETTINGS);
const [isRecoveryMode, setIsRecoveryMode] = useState(false);
const [newPassword, setNewPassword] = useState('');
  useEffect(() => {
    const onHash = () => setIsAdminRoute(window.location.hash === '#admin' || window.location.hash === '#admin-forgot' || window.location.hash === '#admin-login');
    window.addEventListener('hashchange', onHash);
    return () => window.removeEventListener('hashchange', onHash);
  }, []);
useEffect(() => {
  if (!supabase) return;
  let mounted = true;
  const loadLiveNews = async () => {
    const { data, error } = await supabase
      .from("news")
      .select("*")
      .eq("published", true)
      .order("created_at", { ascending: false })
      .limit(100);
    if (error || !data || !mounted) return;
    const mapped: NewsArticle[] = data.map((n: any) => ({
      id: n.id, title: n.title, category: n.category as NewsCategory, summary: n.summary,
      content: n.content, date: n.date, time: n.time, location: n.location, author: n.author,
      imageUrl: n.image_url || "", imageCaption: n.image_caption || undefined,
      isBreaking: n.is_breaking, isFeatured: n.is_featured, viewsCount: n.views_count, tags: n.tags || []
    }));
    setLiveArticles(mapped);
  };
  loadLiveNews();
  const channel = supabase
    .channel("live-news-updates")
    .on("postgres_changes", { event: "*", schema: "public", table: "news" }, () => {
      loadLiveNews();
    })
    .subscribe();
  return () => {
    mounted = false;
    supabase.removeChannel(channel);
  };
}, []);

  useEffect(() => { fetchHomepageLayout().then(setHomepageLayout); }, []);

  useEffect(() => {
    fetchSiteSettings().then(setSiteSettings);
  }, []);

  const allArticles = liveArticles;
  const breakingItems = liveArticles.filter(a => a.isBreaking).map(a => a.title);

  // Load saved bookmarks from localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem('loktantra_saved_news');
      if (stored) {
        setSavedArticles(JSON.parse(stored));
      }
    } catch (e) {
      console.error("Failed to load saved articles", e);
    }
  }, []);

  // Sync saved bookmarks to localStorage
  const handleToggleSave = (article: NewsArticle) => {
    let updated: NewsArticle[];
    if (savedArticles.some(a => a.id === article.id)) {
      updated = savedArticles.filter(a => a.id !== article.id);
    } else {
      updated = [article, ...savedArticles];
    }
    setSavedArticles(updated);
    try {
      localStorage.setItem('loktantra_saved_news', JSON.stringify(updated));
    } catch (e) {
      console.error("Failed to save article", e);
    }
  };

  const handleClearAllSaved = () => {
    setSavedArticles([]);
    localStorage.removeItem('loktantra_saved_news');
  };

  const savedArticleIds = savedArticles.map(a => a.id);

  // Handle Ticker Item Select
  const handleSelectTickerItem = (headline: string) => {
    const matched = allArticles.find(a => headline.includes(a.title.slice(0, 10)) || a.title.includes(headline.slice(0, 10)));
    if (matched) {
      setSelectedArticle(matched);
    } else {
      setSelectedArticle({
        id: `ticker-${Date.now()}`,
        title: headline,
        category: 'नाशिक जिल्हा',
        summary: headline,
        content: `${headline}\n\nविशेष रिपोर्ट: नाशिक व निफाड तालुक्यातील ताज्या घडामोडींसाठी 'लोकतंत्र मराठी' डिजिटल न्यूज पोर्टल व ई-पेपरशी जोडलेले राहा.`,
        date: '१६ ऑगस्ट २०२६',
        time: 'सकाळी ०८:३०',
        location: 'पिंपळगाव बसवंत / नाशिक',
        author: 'लोकतंत्र वृत्तसेवा',
        imageUrl: 'https://images.unsplash.com/photo-1515694346937-94d85e41e6f0?auto=format&fit=crop&q=80&w=1000'
      });
    }
}
useEffect(() => {
  const checkRecovery = () => {
    const hash = window.location.hash;
    const search = window.location.search;

    if (
      hash.includes('type=recovery') ||
      new URLSearchParams(search).get('type') === 'recovery'
    ) {
      setIsRecoveryMode(true);
    }
  };

  checkRecovery();

  if (!supabase) return;

  const { data: listener } = supabase.auth.onAuthStateChange((event) => {
    if (event === 'PASSWORD_RECOVERY') {
      setIsRecoveryMode(true);
    }
  });

  return () => listener.subscription.unsubscribe();
}, []);

  const categoryFilteredArticles = activeCategory === 'मुख्यपृष्ठ'
    ? allArticles
    : allArticles.filter(a => a.category === activeCategory);

  const filteredSearchArticles = searchQuery.trim()
    ? categoryFilteredArticles.filter(a =>
        a.title.toLowerCase().includes(searchQuery.trim().toLowerCase()) ||
        a.headline.toLowerCase().includes(searchQuery.trim().toLowerCase())
      )
    : [];

 if (isRecoveryMode) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100 p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-6">
        <h2 className="text-2xl font-bold mb-4">
          नवीन पासवर्ड सेट करा
        </h2>

        <input
          type="password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          placeholder="नवीन पासवर्ड"
          className="w-full border rounded-lg p-3 mb-4"
        />

        <button
          onClick={async () => {
            if (newPassword.length < 6) {
              alert('पासवर्ड किमान 6 अक्षरांचा असावा');
              return;
            }

            const { error } = await supabase.auth.updateUser({
              password: newPassword,
            });

            if (error) {
              alert(error.message);
              return;
            }

            alert('पासवर्ड यशस्वीरित्या बदलला आहे');
            setIsRecoveryMode(false);
            setNewPassword('');
            window.location.hash = '#admin';
          }}
          className="w-full bg-red-600 text-white rounded-lg p-3 font-bold"
        >
          पासवर्ड बदला
        </button>
      </div>
    </div>
  );
 } if (isAdminRoute) return <AdminPanel initialMode={window.location.hash === '#admin-forgot' ? 'forgot' : 'login'} onClose={() => { window.location.hash = ''; }} />;

  return (
    <div className="min-h-screen flex flex-col bg-slate-100 text-slate-900 font-sans-marathi selection:bg-red-700 selection:text-white">
      
      {/* 1. Header Navigation */}
      <Header
        activeCategory={activeCategory}
        onSelectCategory={(cat) => {
          setActiveCategory(cat);
          setSearchQuery('');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        savedArticlesCount={savedArticles.length}
        onOpenSavedModal={() => setSavedModalOpen(true)}
        fontSizeMultiplier={fontSizeMultiplier}
        onChangeFontSize={setFontSizeMultiplier}
        onOpenLiveTv={() => {
          setActiveCategory('व्हिडिओ');
          const el = document.getElementById('video-news');
          el?.scrollIntoView({ behavior: 'smooth' });
        }}
        onOpenEPaper={() => {
          setActiveCategory('ई-पेपर');
          const el = document.getElementById('epaper-reader');
          el?.scrollIntoView({ behavior: 'smooth' });
        }}
        siteSettings={siteSettings}
      />

      {/* 2. Breaking News Ticker */}
      <BreakingNewsTicker
        items={breakingItems}
        onSelectTickerItem={handleSelectTickerItem}
      />

      {/* 3. Main Body Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-3 sm:px-6 py-6 space-y-10">
        
        {/* SEARCH RESULTS VIEW */}
        {searchQuery.trim() !== '' ? (
          <section className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm min-h-[50vh]">
            <div className="flex items-center justify-between border-b border-slate-200 pb-4 mb-6">
              <h2 className="text-xl font-bold font-newspaper flex items-center gap-2">
                <Search className="w-5 h-5 text-red-700" />
                <span>शोधा निकाल: "{searchQuery}" ({filteredSearchArticles.length})</span>
              </h2>
              <button 
                onClick={() => setSearchQuery('')}
                className="text-xs text-red-700 font-bold hover:underline"
              >
                शोधा बंद करा
              </button>
            </div>

            {filteredSearchArticles.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredSearchArticles.map((article) => (
                  <NewsCard
                    key={article.id}
                    article={article}
                    onSelect={setSelectedArticle}
                    isSaved={savedArticleIds.includes(article.id)}
                    onToggleSave={handleToggleSave}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-12 text-slate-500">
                <p className="font-bold text-base">"{searchQuery}" या शोधशब्दासाठी कोणतीही बातमी सापडली नाही.</p>
                <p className="text-xs text-slate-400 mt-1">कृपया इतर मराठी शब्द वापरून पुन्हा शोधा.</p>
              </div>
            )}
          </section>
        ) : (
          <>
            {/* ROUTE VIEW ACCORDING TO CATEGORY */}

            {/* HOME CATEGORY - FULL SHOWCASE */}
            {activeCategory === 'मुख्यपृष्ठ' && (
              <>
                {homepageLayout.filter(x => x.visible).map(section => {
                  switch (section.id) {
                    case 'hero': return <HeroSection key={section.id} articles={allArticles} onSelectArticle={setSelectedArticle} savedArticleIds={savedArticleIds} onToggleSave={handleToggleSave} />;
                    case 'nashik': return <NashikDistrictSection key={section.id} articles={allArticles} onSelectArticle={setSelectedArticle} savedArticleIds={savedArticleIds} onToggleSave={handleToggleSave} />;
                    case 'epaper': return <EPaperSection key={section.id} pages={[]} />;
                    case 'video': return <VideoGallery key={section.id} videos={[]} />;
                    case 'photo': return <PhotoGallery key={section.id} photos={PHOTO_GALLERY_ITEMS} />;
                    case 'about': return <AboutAndMessage key={section.id} />;
                    case 'advertise': return <AdvertiseSection key={section.id} />;
                    case 'contact': return <ContactSection key={section.id} siteSettings={siteSettings} />;
                    default: return null;
                  }
                })}
              </>
            )}

            {/* NASHIK DISTRICT CATEGORY VIEW */}
            {activeCategory === 'नाशिक जिल्हा' && (
              <NashikDistrictSection
                articles={allArticles}
                onSelectArticle={setSelectedArticle}
                savedArticleIds={savedArticleIds}
                onToggleSave={handleToggleSave}
              />
            )}

            {/* EPAPER DIRECT VIEW */}
            {activeCategory === 'ई-पेपर' && (
              <EPaperSection pages={[]} />
            )}

            {/* VIDEO DIRECT VIEW */}
            {activeCategory === 'व्हिडिओ' && (
              <VideoGallery videos={[]} />
            )}

            {/* PHOTO GALLERY DIRECT VIEW */}
            {activeCategory === 'फोटो गॅलरी' && (
              <PhotoGallery photos={PHOTO_GALLERY_ITEMS} />
            )}

            {/* OTHER SPECIFIC CATEGORIES GRID VIEW */}
            {activeCategory !== 'मुख्यपृष्ठ' && 
             activeCategory !== 'नाशिक जिल्हा' && 
             activeCategory !== 'ई-पेपर' && 
             activeCategory !== 'व्हिडिओ' && 
             activeCategory !== 'फोटो गॅलरी' && (
              <section className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm min-h-[60vh]">
                <div className="flex items-center justify-between border-b border-slate-200 pb-4 mb-6">
                  <h2 className="text-2xl font-black font-newspaper text-slate-900">
                    {activeCategory} बातम्या
                  </h2>
                  <span className="text-xs text-slate-500 font-bold">
                    एकूण {categoryFilteredArticles.length} बातम्या
                  </span>
                </div>

                {categoryFilteredArticles.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {categoryFilteredArticles.map((article) => (
                      <NewsCard
                        key={article.id}
                        article={article}
                        onSelect={setSelectedArticle}
                        isSaved={savedArticleIds.includes(article.id)}
                        onToggleSave={handleToggleSave}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12 text-slate-500">
                    <p className="font-bold text-base">{activeCategory} विभागातील ताज्या बातम्या लोड होत आहेत...</p>
                  </div>
                )}
              </section>
            )}
          </>
        )}

      </main>

      {/* 4. Footer Component */}
      <Footer
        onSelectCategory={(cat) => {
          setActiveCategory(cat);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onOpenEPaper={() => {
          setActiveCategory('ई-पेपर');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onOpenLiveTv={() => {
          setActiveCategory('व्हिडिओ');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
      />

      {/* 5. Article Reader Modal */}
      <NewsModal
        article={selectedArticle}
        onClose={() => setSelectedArticle(null)}
        isSaved={selectedArticle ? savedArticleIds.includes(selectedArticle.id) : false}
        onToggleSave={handleToggleSave}
        fontSizeMultiplier={fontSizeMultiplier}
      />

      {/* 6. Saved Bookmarks Modal */}
      <SavedArticlesModal
        isOpen={savedModalOpen}
        onClose={() => setSavedModalOpen(false)}
        savedArticles={savedArticles}
        onSelectArticle={setSelectedArticle}
        onRemoveArticle={handleToggleSave}
        onClearAll={handleClearAllSaved}
      />

    </div>
  );
}
