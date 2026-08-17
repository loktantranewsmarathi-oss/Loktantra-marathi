import React, { useState } from 'react';
import { Megaphone, PhoneCall, Send, CheckCircle2, MessageSquare, Sparkles } from 'lucide-react';
import { OFFICE_CONTACT_INFO } from '../data/newsData';

export const AdvertiseSection: React.FC = () => {
  const [formData, setFormData] = useState({
    businessName: '',
    contactName: '',
    phone: '',
    adType: 'डिजिटल बॅनर (वेबसाइट)',
    message: ''
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.businessName || !formData.phone) {
      alert("कृपया नाव व फोन नंबर प्रविष्ट करा.");
      return;
    }

    const text = `📢 *नवीन जाहिरात विचारणा (लोकतंत्र मराठी)*\n\n*व्यवसायाचे नाव:* ${formData.businessName}\n*संपर्क व्यक्ती:* ${formData.contactName}\n*फोन नंबर:* ${formData.phone}\n*जाहिरात प्रकार:* ${formData.adType}\n*संदेश:* ${formData.message || 'नाही'}`;

    window.open(`https://wa.me/917668525252?text=${encodeURIComponent(text)}`, '_blank');
    setSubmitted(true);
  };

  return (
    <section id="advertise" className="mb-12 bg-gradient-to-r from-red-900 via-red-800 to-slate-900 text-white rounded-2xl p-6 sm:p-8 shadow-xl relative overflow-hidden border border-red-700">
      
      {/* Background Accent */}
      <div className="absolute -right-10 -bottom-10 opacity-10 pointer-events-none">
        <Megaphone className="w-96 h-96 text-white" />
      </div>

      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        
        {/* Left Column - Promotion Callout */}
        <div className="lg:col-span-7 space-y-4">
          <div className="inline-flex items-center gap-2 bg-amber-400 text-slate-950 font-black text-xs px-3 py-1 rounded-full shadow uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5 text-slate-950" />
            <span>जाहिरात विभाग (Business Advertising)</span>
          </div>

          <h2 className="text-3xl sm:text-4xl font-extrabold font-newspaper text-white leading-tight">
            आपल्या व्यवसायाची जाहिरात <span className="text-amber-300">लोकतंत्र मराठी</span>च्या माध्यमातून हजारो वाचकांपर्यंत पोहोचवा!
          </h2>

          <p className="text-slate-200 text-sm sm:text-base font-sans-marathi leading-relaxed">
            पिंपळगाव बसवंत, निफाड, नाशिक शहर आणि संपूर्ण महाराष्ट्रातील हजारो सक्रिय वाचकांपर्यंत आपले प्रॉडक्ट, सर्व्हिस किंवा ब्रँड पोहोचवण्यासाठी लोकतंत्र मराठी हा उत्तम डिजिटल पर्याय आहे.
          </p>

          {/* Features */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-xs font-semibold">
            <div className="flex items-center gap-2 bg-red-950/60 p-2.5 rounded-lg border border-red-700/60">
              <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
              <span>वेबसाइट डिजिटल बॅनर जाहिरात</span>
            </div>
            <div className="flex items-center gap-2 bg-red-950/60 p-2.5 rounded-lg border border-red-700/60">
              <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
              <span>ई-पेपर जाहिरात कटिंग</span>
            </div>
            <div className="flex items-center gap-2 bg-red-950/60 p-2.5 rounded-lg border border-red-700/60">
              <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
              <span>सोशल मीडिया & WhatsApp प्रमोशन</span>
            </div>
            <div className="flex items-center gap-2 bg-red-950/60 p-2.5 rounded-lg border border-red-700/60">
              <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
              <span>व्हिडिओ न्यूज स्पॉन्सर्ड क्लिप्स</span>
            </div>
          </div>

          {/* Quick Call Box */}
          <div className="pt-4 flex flex-wrap items-center gap-3">
            <div className="bg-amber-400 text-slate-950 p-3 rounded-xl shadow-lg flex items-center gap-3">
              <PhoneCall className="w-6 h-6 text-red-900 animate-bounce" />
              <div>
                <span className="text-[10px] uppercase font-extrabold text-slate-800 block">थेट जाहिरात संपर्क:</span>
                <span className="text-base sm:text-lg font-black font-mono">
                  {OFFICE_CONTACT_INFO.phones.join(" / ")}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - Direct Ad Inquiry Form */}
        <div className="lg:col-span-5 bg-white text-slate-900 p-6 rounded-xl shadow-2xl border border-slate-200">
          <h3 className="text-xl font-bold font-newspaper text-slate-900 mb-1 flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-red-700" />
            <span>जाहिरात विचारणा फॉर्म</span>
          </h3>
          <p className="text-xs text-slate-500 font-sans-marathi mb-4">
            तुमचे तपशील भरा आणि तात्काळ व्हॉट्सॲपवर माहिती मिळवा:
          </p>

          <form onSubmit={handleSubmit} className="space-y-3 font-sans-marathi text-xs">
            <div>
              <label className="block font-bold text-slate-700 mb-1">व्यवसायाचे/दुकानाचे नाव *</label>
              <input
                type="text"
                required
                value={formData.businessName}
                onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
                placeholder="उदा. श्री स्वामी समर्थ ट्रेडर्स"
                className="w-full p-2.5 rounded border border-slate-300 focus:outline-none focus:border-red-700 text-sm"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">संपर्क व्यक्तीचे नाव</label>
              <input
                type="text"
                value={formData.contactName}
                onChange={(e) => setFormData({ ...formData, contactName: e.target.value })}
                placeholder="उदा. रमेश पाटील"
                className="w-full p-2.5 rounded border border-slate-300 focus:outline-none focus:border-red-700 text-sm"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">फोन नंबर *</label>
              <input
                type="tel"
                required
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="१० अंकी मोबाईल नंबर"
                className="w-full p-2.5 rounded border border-slate-300 focus:outline-none focus:border-red-700 text-sm font-mono"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">जाहिरात प्रकार</label>
              <select
                value={formData.adType}
                onChange={(e) => setFormData({ ...formData, adType: e.target.value })}
                className="w-full p-2.5 rounded border border-slate-300 focus:outline-none focus:border-red-700 text-sm font-bold bg-white"
              >
                <option value="डिजिटल बॅनर (वेबसाइट)">डिजिटल बॅनर (वेबसाइट)</option>
                <option value="ई-पेपर मधील जाहिरात">ई-पेपर मधील जाहिरात</option>
                <option value="व्हिडिओ न्यूज स्पॉन्सरशिप">व्हिडिओ न्यूज स्पॉन्सरशिप</option>
                <option value="सोशल मीडिया प्रमोशन">सोशल मीडिया प्रमोशन</option>
              </select>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">काही संदेश असल्यास</label>
              <textarea
                rows={2}
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                placeholder="जाहिरातीचे बजेट किंवा इतर माहिती..."
                className="w-full p-2.5 rounded border border-slate-300 focus:outline-none focus:border-red-700 text-sm"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold p-3 rounded-lg text-sm transition flex items-center justify-center gap-2 shadow-md hover:shadow-lg"
            >
              <Send className="w-4 h-4" />
              <span>WhatsApp वर पाठवा</span>
            </button>
          </form>
        </div>

      </div>

    </section>
  );
};
