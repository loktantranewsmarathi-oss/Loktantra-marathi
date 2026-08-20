import React from 'react';
import { Newspaper, ShieldCheck, HeartHandshake, Award, Users, Target } from 'lucide-react';
import { OFFICE_CONTACT_INFO } from '../data/newsData';

export const AboutAndMessage: React.FC = () => {
  return (
    <section id="about-us" className="mb-12 bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-sm">
      
      {/* Header */}
      <div className="border-b border-slate-200 pb-4 mb-8 text-center max-w-2xl mx-auto">
        <span className="bg-red-700 text-white font-bold text-xs px-3 py-1 rounded-full uppercase tracking-wider mb-2 inline-block">
          लोकतंत्र वृत्तपत्र परिचय
        </span>
        <h2 className="text-3xl sm:text-4xl font-black text-slate-900 font-newspaper">
          ✍️ आमच्याबद्दल & आमचा संदेश
        </h2>
        <p className="text-sm text-slate-600 font-serif-marathi mt-1">
          "जनतेचा आवाज, जनतेसाठी" — निष्पक्ष, सत्य आणि वस्तुनिष्ठ पत्रकारिता
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
        
        {/* Left Column - Main About Text */}
        <div className="lg:col-span-7 bg-slate-50 p-6 rounded-xl border border-slate-200 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-red-800 font-bold text-lg font-newspaper border-b border-slate-200 pb-2">
              <Newspaper className="w-5 h-5 text-red-700" />
              <span>लोकतंत्र मराठी डिजिटल न्यूज पोर्टल</span>
            </div>

            <p className="text-slate-800 leading-relaxed font-sans-marathi text-base sm:text-lg">
              <strong className="text-red-800 font-bold">लोकतंत्र मराठी</strong> हे महाराष्ट्रातील सामाजिक, राजकीय, शैक्षणिक, कृषी, क्रीडा आणि स्थानिक घडामोडींना हक्काचे व्यासपीठ देणारे आघाडीचे मराठी डिजिटल न्यूज पोर्टल व ई-पेपर आहे.
            </p>

            <p className="text-slate-700 leading-relaxed font-sans-marathi text-sm sm:text-base">
              जनतेच्या ज्वलंत समस्या प्रशासनापर्यंत पोहोचवणे, ग्रामीण व शहरी भागातील सकारात्मक बातम्यांना प्रसिद्धी देणे आणि डिजिटल युगात निपक्ष व वस्तुनिष्ठ पत्रकारितेला प्राधान्य देणे हा आमचा मुख्य उद्देश आहे.
            </p>

            {/* Core Values Bullets */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <div className="bg-white p-3 rounded-lg border border-slate-200 flex items-center gap-2 shadow-2xs">
                <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0" />
                <span className="text-xs font-bold text-slate-800">१००% सत्य व पडताळलेली माहिती</span>
              </div>
              <div className="bg-white p-3 rounded-lg border border-slate-200 flex items-center gap-2 shadow-2xs">
                <Target className="w-5 h-5 text-red-600 shrink-0" />
                <span className="text-xs font-bold text-slate-800">जनतेच्या समस्यांना प्राधान्य</span>
              </div>
              <div className="bg-white p-3 rounded-lg border border-slate-200 flex items-center gap-2 shadow-2xs">
                <HeartHandshake className="w-5 h-5 text-amber-600 shrink-0" />
                <span className="text-xs font-bold text-slate-800">शेतकरी व युवा वर्गाचा पाठपुरावा</span>
              </div>
              <div className="bg-white p-3 rounded-lg border border-slate-200 flex items-center gap-2 shadow-2xs">
                <Award className="w-5 h-5 text-blue-600 shrink-0" />
                <span className="text-xs font-bold text-slate-800">२४×७ डिजिटल ई-पेपर सेवा</span>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500 font-semibold">
            <span>नोंदणीकृत डिजिटल न्यूज नेटवर्क</span>
            <span>नाशिक • निफाड • पिंपळगाव बसवंत</span>
          </div>
        </div>

        {/* Right Column - Editor's Message Card */}
        <div className="lg:col-span-5 bg-gradient-to-br from-red-900 to-slate-950 text-white p-6 rounded-xl border border-red-800 shadow-lg flex flex-col justify-between">
          <div>
            <div className="inline-block bg-amber-400 text-slate-950 text-[11px] font-black px-2.5 py-0.5 rounded uppercase tracking-wider mb-3">
              संपादकीय भूमिका
            </div>

            <h3 className="text-2xl font-black font-newspaper text-amber-300 mb-2">
              आमचा मुख्य संदेश
            </h3>

            <div className="bg-red-950/80 border-l-4 border-amber-400 p-4 rounded-r-lg my-4 italic text-slate-100 font-serif-marathi text-lg shadow-inner">
              “जनतेचा आवाज, जनतेसाठी”
            </div>

            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-sans-marathi mb-6">
              "लोकशाहीत प्रसारमाध्यमे हा चौथा मुख्य स्तंभ मानला जातो. निष्पक्ष पत्रकारितेतूनच समृद्ध आणि जागरूक समाज घडतो. 'लोकतंत्र मराठी' सर्व वाचकांच्या विश्वासाला पात्र ठरण्यासाठी कटिबद्ध आहे."
            </p>
          </div>

          

        </div>

      </div>

    </section>
  );
};
