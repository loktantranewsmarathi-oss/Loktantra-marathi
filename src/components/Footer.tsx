import React, { useState } from 'react';
import { 
  Newspaper, 
  MapPin, 
  PhoneCall, 
  Mail, 
  Facebook, 
  Instagram, 
  Youtube, 
  MessageCircle, 
  X, 
  Heart 
} from 'lucide-react';
import { OFFICE_CONTACT_INFO } from '../data/newsData';
import { DEFAULT_SITE_SETTINGS, SiteSettings } from './SiteSettings';

interface FooterProps {
  onSelectCategory: (cat: any) => void;
  onOpenEPaper: () => void;
  onOpenLiveTv: () => void;
  siteSettings?: SiteSettings;
}

export const Footer: React.FC<FooterProps> = ({
  onSelectCategory,
  onOpenEPaper,
  onOpenLiveTv,
  siteSettings = DEFAULT_SITE_SETTINGS
}) => {
  const [activePolicyModal, setActivePolicyModal] = useState<string | null>(null);

  const policyContent: Record<string, { title: string; body: string }> = {
    'About Us': {
      title: 'आमच्याबद्दल (About Us)',
      body: 'लोकतंत्र मराठी हे महाराष्ट्रातील सामाजिक, राजकीय, शैक्षणिक, कृषी, क्रीडा आणि स्थानिक घडामोडींना व्यासपीठ देणारे मराठी डिजिटल न्यूज पोर्टल आहे. जनतेच्या समस्या प्रशासनापर्यंत पोहोचवणे आणि वस्तुनिष्ठ पत्रकारितेला प्राधान्य देणे हा आमचा मुख्य उद्देश आहे.'
    },
    'Contact Us': {
      title: 'संपर्क (Contact Us)',
      body: `लोकतंत्र वृत्तपत्र, लोकतंत्र मराठी न्यूज\n${siteSettings.address}\nकार्यालयीन संपर्क: ${siteSettings.phone1}\nसंपादक 1: ${siteSettings.editor1Name}\nसंपादक 2: ${siteSettings.editor2Name}\nई-मेल: ${siteSettings.email || '—'}`
    },
    'Privacy Policy': {
      title: 'गोपनीयता धोरण (Privacy Policy)',
      body: 'लोकतंत्र मराठी वापरकर्त्यांच्या डेटा सुरक्षेचा आदर करते. आम्ही कोणत्याही वापरकर्त्याची वैयक्तिक माहिती तृतीय पक्षास विकत किंवा शेअर करत नाही. वेबसाइट वापरताना गोळा केलेला कुकी डेटा केवळ वाचक अनुभव सुधारण्यासाठी वापरला जातो.'
    },
    'Terms & Conditions': {
      title: 'अटी आणि शर्ती (Terms & Conditions)',
      body: 'लोकतंत्र मराठी वरील सर्व बातम्या, फोटो व व्हिडिओ कॉपीराइट अंतर्गत संरक्षित आहेत. पूर्वपरवानगीशिवाय कोणताही आशय व्यावसायिक वापरासाठी वापरता येणार नाही. वाचकांनी पोर्टलवर प्रतिक्रिया व्यक्त करताना भाषेचे भान ठेवावे.'
    },
    'Disclaimer': {
      title: 'डिसक्लेमर (Disclaimer)',
      body: 'या संकेतस्थळावरील बातम्या आणि तपशील वेबसाइट डिझाइन/डेमोसाठी नमुना स्वरूपातील डमी कंटेंट आहेत. प्रकाशक किंवा संपादकीय मंडळ पूर्वसूचनेशिवाय सामग्रीत बदल करण्याचे हक्क राखून ठेवते.'
    },
    'Advertise With Us': {
      title: 'जाहिरात करा (Advertise With Us)',
      body: 'आपल्या व्यवसायाची जाहिरात लोकतंत्र मराठीच्या माध्यमातून हजारो वाचकांपर्यंत पोहोचवा. जाहिरातीसाठी संपर्क: 7668525252, 9860541550 किंवा ई-मेल: loktantranewsmarathi@gmail.com'
    }
  };

  return (
    <footer className="bg-slate-950 text-slate-300 pt-12 pb-8 border-t-4 border-[#B91C1C] font-sans-marathi">
      <div className="max-w-7xl mx-auto px-4 space-y-10">
        
        {/* Top Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 border-b border-slate-800 pb-10">
          
          {/* Col 1: Brand & Tagline (4 cols) */}
          <div className="lg:col-span-4 space-y-4">
            <div className="flex items-center gap-2">
              <h2 className="text-3xl font-extrabold text-white font-newspaper">{siteSettings.siteName}
              </h2>
            </div>

            <p className="text-amber-400 font-bold font-serif-marathi text-base">
              "{siteSettings.tagline}"
            </p>

            <p className="text-xs text-slate-400 leading-relaxed">
              लोकतंत्र मराठी हे महाराष्ट्रातील सामाजिक, राजकीय, शैक्षणिक, कृषी, क्रीडा आणि स्थानिक घडामोडींना व्यासपीठ देणारे मराठी डिजिटल न्यूज पोर्टल व ई-पेपर आहे.
            </p>

            {/* Social Media Links */}
            <div className="pt-2">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-2">
                🔗 सोशल मीडिया वर फॉलो करा:
              </span>
              <div className="flex items-center gap-2">
                <a
                  href={siteSettings.facebook || '#'}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 bg-slate-900 hover:bg-blue-600 text-white rounded-lg transition border border-slate-800"
                  title="Facebook"
                >
                  <Facebook className="w-4 h-4" />
                </a>
                <a
                  href={siteSettings.instagram || '#'}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 bg-slate-900 hover:bg-pink-600 text-white rounded-lg transition border border-slate-800"
                  title="Instagram"
                >
                  <Instagram className="w-4 h-4" />
                </a>
                <a
                  href={siteSettings.youtube || '#'}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 bg-slate-900 hover:bg-red-600 text-white rounded-lg transition border border-slate-800"
                  title="YouTube"
                >
                  <Youtube className="w-4 h-4" />
                </a>
                <a
                  href={siteSettings.whatsapp ? `https://wa.me/${siteSettings.whatsapp.replace(/\D/g,'')}` : '#'}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 bg-slate-900 hover:bg-emerald-600 text-white rounded-lg transition border border-slate-800"
                  title="WhatsApp"
                >
                  <MessageCircle className="w-4 h-4" />
                </a>
              </div>
            </div>
          </div>

          {/* Col 2: Quick Links (3 cols) */}
          <div className="lg:col-span-3 space-y-3">
            <h3 className="text-sm font-extrabold text-white uppercase tracking-wider border-l-2 border-red-600 pl-2">
              मुख्य विभाग
            </h3>
            <ul className="space-y-2 text-xs font-medium text-slate-400">
              <li>
                <button onClick={() => onSelectCategory('मुख्यपृष्ठ')} className="hover:text-amber-300 transition">
                  • मुख्यपृष्ठ (Home)
                </button>
              </li>
              <li>
                <button onClick={() => onSelectCategory('नाशिक जिल्हा')} className="hover:text-amber-300 transition">
                  • नाशिक जिल्हा (Nashik News)
                </button>
              </li>
              <li>
                <button onClick={() => onSelectCategory('शेती व ग्रामीण')} className="hover:text-amber-300 transition">
                  • शेती व ग्रामीण (Agri News)
                </button>
              </li>
              <li>
                <button onClick={onOpenLiveTv} className="hover:text-amber-300 transition">
                  • व्हिडिओ न्यूज & LIVE
                </button>
              </li>
              <li>
                <button onClick={() => onSelectCategory('फोटो गॅलरी')} className="hover:text-amber-300 transition">
                  • फोटो गॅलरी (Gallery)
                </button>
              </li>
              <li>
                <button onClick={onOpenEPaper} className="hover:text-amber-300 transition text-amber-400 font-bold">
                  • 📰 ई-पेपर (E-Paper Digital)
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Contact Info (5 cols) */}
          <div className="lg:col-span-5 space-y-3">
            <h3 className="text-sm font-extrabold text-white uppercase tracking-wider border-l-2 border-red-600 pl-2">
              📞 संपर्क & कार्यालय
            </h3>
            <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 space-y-2 text-xs">
              <p className="text-slate-200 font-bold">
                लोकतंत्र वृत्तपत्र, लोकतंत्र मराठी न्यूज
              </p>
              <p className="text-slate-400 leading-relaxed">
                {siteSettings.address}
              </p>
              <div className="pt-2 border-t border-slate-800 text-amber-400 font-bold font-mono">
                फोन: {siteSettings.phone1}
              </div>
              <div className="text-slate-300 font-mono text-[11px]">
                ई-मेल: {siteSettings.email || '—'}
              </div>
              <div className="text-[11px] text-slate-400 pt-1">
                संपादक 1: {siteSettings.editor1Name}<br />संपादक 2: {siteSettings.editor2Name}
              </div>
            </div>
          </div>

        </div>

        {/* Footer Legal Nav Links */}
        <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs font-semibold text-slate-400">
          {Object.keys(policyContent).map((policy) => (
            <button
              key={policy}
              onClick={() => setActivePolicyModal(policy)}
              className="hover:text-amber-300 transition"
            >
              {policy}
            </button>
          ))}
        </div>

        {/* Copyright & Disclaimer Note */}
        <div className="text-center text-xs text-slate-500 space-y-2 pt-4 border-t border-slate-900">
          <p className="font-bold text-slate-400">
            © 2026 {siteSettings.copyright}
          </p>
          <p className="text-[11px] text-slate-500 italic bg-slate-900/60 p-2.5 rounded-lg max-w-2xl mx-auto border border-slate-800">
            टीप: वरील बातम्या आणि तपशील वेबसाइट डिझाइन/डेमोसाठी नमुना स्वरूपातील डमी कंटेंट आहेत.
          </p>
        </div>

      </div>

      {/* POLICY MODAL */}
      {activePolicyModal && policyContent[activePolicyModal] && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white text-slate-900 w-full max-w-lg rounded-2xl p-6 shadow-2xl border border-slate-200 relative">
            <button
              onClick={() => setActivePolicyModal(null)}
              className="absolute top-4 right-4 p-1 hover:bg-slate-100 rounded text-slate-500 hover:text-slate-900"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-xl font-bold font-newspaper text-slate-900 mb-4 border-b border-slate-200 pb-2">
              {policyContent[activePolicyModal].title}
            </h3>

            <p className="text-sm text-slate-700 leading-relaxed font-sans-marathi whitespace-pre-line mb-6">
              {policyContent[activePolicyModal].body}
            </p>

            <button
              onClick={() => setActivePolicyModal(null)}
              className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-2.5 rounded-lg text-xs transition"
            >
              बंद करा
            </button>
          </div>
        </div>
      )}

    </footer>
  );
};
