import React, { useState } from 'react';
import { 
  MapPin, 
  PhoneCall, 
  Mail, 
  UserCheck, 
  Send, 
  MessageCircle, 
  Share2, 
  Globe, 
  Building2, 
  CheckCircle 
} from 'lucide-react';
import { DEFAULT_SITE_SETTINGS, SiteSettings } from './SiteSettings';

export const ContactSection: React.FC<{ siteSettings?: SiteSettings }> = ({ siteSettings = DEFAULT_SITE_SETTINGS }) => {
  const [tipForm, setTipForm] = useState({
    name: '',
    phone: '',
    location: '',
    newsDetails: ''
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSendNewsTip = (e: React.FormEvent) => {
    e.preventDefault();
    if (!tipForm.name || !tipForm.phone || !tipForm.newsDetails) {
      alert("कृपया सर्व माहिती प्रविष्ट करा.");
      return;
    }

    const text = `🚨 *नागरिक बातमी / समस्या (लोकतंत्र मराठी)*\n\n*पाठवणारा:* ${tipForm.name}\n*मोबाईल:* ${tipForm.phone}\n*ठिकाण:* ${tipForm.location || 'पिंपळगाव बसवंत/नाशिक'}\n\n*बातमी/समस्येचा तपशील:*\n${tipForm.newsDetails}`;

    window.open(`https://wa.me/${siteSettings.whatsapp.replace(/\D/g, '')}?text=${encodeURIComponent(text)}`, '_blank');
    setSubmitted(true);
  };

  return (
    <section id="contact-us" className="mb-12 bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-sm">
      
      {/* Header */}
      <div className="border-b border-slate-200 pb-4 mb-8">
        <span className="bg-red-700 text-white font-bold text-xs px-3 py-1 rounded-full uppercase tracking-wider mb-2 inline-block">
          संपर्क माहिती
        </span>
        <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 font-newspaper">
          📞 कार्यालयीन संपर्क & पत्ता
        </h2>
        <p className="text-sm text-slate-600 font-sans-marathi mt-1">
          लोकतंत्र वृत्तपत्र आणि लोकतंत्र मराठी न्यूज पोर्टल मुख्य कार्यालय
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column - Office Contact Details */}
        <div className="lg:col-span-6 space-y-6">
          
          <div className="bg-slate-50 p-6 rounded-xl border border-slate-200 space-y-4">
            <h3 className="text-xl font-bold font-newspaper text-slate-900 flex items-center gap-2 border-b border-slate-200 pb-2">
              <Building2 className="w-5 h-5 text-red-700" />
              <span>मुख्य कार्यालय पत्ता</span>
            </h3>

            <div className="flex items-start gap-3 text-slate-800 font-sans-marathi text-sm sm:text-base leading-relaxed">
              <MapPin className="w-5 h-5 text-red-700 shrink-0 mt-1" />
              <div>
                <strong className="text-slate-900 font-bold block">लोकतंत्र वृत्तपत्र, लोकतंत्र मराठी न्यूज</strong>
                {siteSettings.address}
              </div>
            </div>

            <div className="pt-2 border-t border-slate-200 space-y-2 text-sm font-sans-marathi">
              <div className="flex items-center gap-3 text-slate-800">
                <PhoneCall className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>
                  <strong>कार्यालयीन संपर्क:</strong>{' '}
                  <a href={`tel:${siteSettings.phone1}`} className="text-red-700 font-bold hover:underline font-mono">{siteSettings.phone1}</a>,{' '}
                  <a href={`tel:${siteSettings.phone2}`} className="text-red-700 font-bold hover:underline font-mono">{siteSettings.phone2}</a>
                </span>
              </div>

              <div className="flex items-center gap-3 text-slate-800">
                <Mail className="w-4 h-4 text-blue-600 shrink-0" />
                <span>
                  <strong>ई-मेल:</strong>{' '}
                  <a href={`mailto:${siteSettings.email}`} className="text-red-700 font-bold hover:underline font-mono">
                    {siteSettings.email}
                  </a>
                </span>
              </div>
            </div>
          </div>

          {/* Editors Info Box */}
          <div className="bg-red-50/80 p-5 rounded-xl border border-red-200 space-y-3">
            <h4 className="text-sm font-bold text-red-900 uppercase tracking-wider flex items-center gap-2">
              <UserCheck className="w-4 h-4 text-red-700" />
              <span>संपादक मंडळ</span>
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 font-sans-marathi">
              {[
                { name: siteSettings.editor1Name, title: siteSettings.editor1Title },
                { name: siteSettings.editor2Name, title: siteSettings.editor2Title }
              ].map((editor, idx) => (
                <div key={idx} className="bg-white p-3 rounded-lg border border-red-200 shadow-2xs">
                  <span className="text-xs text-red-700 font-bold block">{editor.title}</span>
                  <span className="text-sm font-extrabold text-slate-900">{editor.name}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Simulated Pimpalgaon Baswant Map Preview */}
          <div className="bg-slate-100 rounded-xl p-4 border border-slate-200 text-center">
            <div className="aspect-[16/6] bg-slate-200 rounded-lg overflow-hidden relative flex items-center justify-center border border-slate-300">
              <div className="absolute inset-0 bg-[radial-gradient(#cbd5e1_1px,transparent_1px)] [background-size:16px_16px]"></div>
              <div className="relative z-10 bg-white/90 backdrop-blur p-3 rounded-xl border border-slate-300 shadow text-slate-900">
                <MapPin className="w-6 h-6 text-red-700 mx-auto mb-1 animate-bounce" />
                <p className="text-xs font-bold">उंबरखेड रोड, पिंपळगाव बसवंत, ता. निफाड, नाशिक</p>
                <a
                  href="https://maps.google.com/?q=Pimpalgaon+Baswant+Nashik"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[11px] font-bold text-red-700 hover:underline mt-1 inline-block"
                >
                  Google Maps वर पत्ता पाहा ↗
                </a>
              </div>
            </div>
          </div>

        </div>

        {/* Right Column - Submit News / Report Issue Form */}
        <div className="lg:col-span-6 bg-slate-900 text-white p-6 sm:p-8 rounded-xl shadow-xl border border-slate-800 flex flex-col justify-between">
          <div>
            <div className="inline-flex items-center gap-2 bg-red-700 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider mb-3">
              <MessageCircle className="w-3.5 h-3.5" />
              <span>नागरिक पत्रकार (Citizen Journalist)</span>
            </div>

            <h3 className="text-2xl font-bold font-newspaper text-white mb-2">
              तुमच्या परिसरातील बातमी किंवा समस्या पाठवा!
            </h3>

            <p className="text-xs sm:text-sm text-slate-300 font-sans-marathi leading-relaxed mb-6">
              तुमच्या गावातील, तालुक्यातील किंवा परिसरातील रस्त्यांची अडचण, पाण्याचा प्रश्न किंवा सामाजिक उपक्रमाची बातमी लोकतंत्र मराठीच्या संपादकांपर्यंत थेट पाठवा.
            </p>

            <form onSubmit={handleSendNewsTip} className="space-y-4 font-sans-marathi text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-300 mb-1">तुमचे नाव *</label>
                  <input
                    type="text"
                    required
                    value={tipForm.name}
                    onChange={(e) => setTipForm({ ...tipForm, name: e.target.value })}
                    placeholder="उदा. सागर शिंदे"
                    className="w-full p-2.5 rounded bg-slate-800 border border-slate-700 focus:outline-none focus:border-red-500 text-white text-sm"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-300 mb-1">मोबाईल नंबर *</label>
                  <input
                    type="tel"
                    required
                    value={tipForm.phone}
                    onChange={(e) => setTipForm({ ...tipForm, phone: e.target.value })}
                    placeholder="१० अंकी मोबाईल नंबर"
                    className="w-full p-2.5 rounded bg-slate-800 border border-slate-700 focus:outline-none focus:border-red-500 text-white text-sm font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-300 mb-1">गावाचे / तालुक्याचे नाव</label>
                <input
                  type="text"
                  value={tipForm.location}
                  onChange={(e) => setTipForm({ ...tipForm, location: e.target.value })}
                  placeholder="उदा. उंबरखेड रोड, पिंपळगाव बसवंत"
                  className="w-full p-2.5 rounded bg-slate-800 border border-slate-700 focus:outline-none focus:border-red-500 text-white text-sm"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-300 mb-1">बातमी / समस्येचा सविस्तर तपशील *</label>
                <textarea
                  rows={4}
                  required
                  value={tipForm.newsDetails}
                  onChange={(e) => setTipForm({ ...tipForm, newsDetails: e.target.value })}
                  placeholder="येथे समस्येची सविस्तर माहिती किंवा बातमी लिहा..."
                  className="w-full p-2.5 rounded bg-slate-800 border border-slate-700 focus:outline-none focus:border-red-500 text-white text-sm"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-red-700 hover:bg-red-600 text-white font-bold p-3 rounded-lg text-sm transition flex items-center justify-center gap-2 shadow-lg"
              >
                <Send className="w-4 h-4" />
                <span>संपादक मंडाळाला बातमी पाठवा (WhatsApp)</span>
              </button>
            </form>
          </div>

          <p className="text-[11px] text-slate-400 text-center mt-4">
            टीप: तुमची माहिती व ओळख गोपनीय ठेवली जाईल.
          </p>

        </div>

      </div>

    </section>
  );
};
