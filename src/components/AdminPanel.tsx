import React, { useEffect, useState } from 'react';
import { LogIn, LogOut, PlusCircle, Trash2, Upload, X, Save, Settings, KeyRound, Pencil, ExternalLink } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { LayoutEditor } from './LayoutEditor';
import { EpaperManager } from './EpaperManager';
import { DEFAULT_SITE_SETTINGS, fetchSiteSettings, saveSiteSettings, SiteSettings } from './SiteSettings';

const categories = ['नाशिक जिल्हा','महाराष्ट्र','शेती व ग्रामीण','शिक्षण व क्रीडा'] as const;
type NewsRow = { id: string; title: string; category: string; summary: string; content: string; date: string; time: string; location: string; author: string; image_url: string; is_breaking: boolean; is_featured: boolean; published: boolean; created_at: string };
const emptyForm = { title:'', category:'नाशिक जिल्हा', summary:'', content:'', date:'', time:'', location:'पिंपळगाव बसवंत', author:'लोकतंत्र वृत्तसेवा', image_url:'', is_breaking:false, is_featured:false, published:true };

type Props = { onClose: () => void; initialMode?: 'none'|'login'|'forgot'; onSettingsChanged?: (settings: SiteSettings) => void };

export const AdminPanel: React.FC<Props> = ({ onClose, initialMode='login', onSettingsChanged }) => {
  const [session, setSession] = useState<any>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [login, setLogin] = useState({email:'',password:''});
  const [resetEmail, setResetEmail] = useState('');
  const [mode, setMode] = useState<'login'|'forgot'>(initialMode === 'forgot' ? 'forgot' : 'login');
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [rows, setRows] = useState<NewsRow[]>([]);
  const [message, setMessage] = useState('');
  const [uploading, setUploading] = useState(false);
  const [activeTab, setActiveTab] = useState<'news'|'settings'|'layout'|'epaper'>('news');
  const [settings, setSettings] = useState<SiteSettings>(DEFAULT_SITE_SETTINGS);
  const [settingsSaving, setSettingsSaving] = useState(false);

  const load = async () => {
    if (!supabase) { setLoading(false); return; }
    const { data: { session } } = await supabase.auth.getSession();
    setSession(session);
    if (!session) { setIsAdmin(false); setLoading(false); return; }
    const { data: profile } = await supabase.from('profiles').select('is_admin').eq('id', session.user.id).maybeSingle();
    const admin = !!profile?.is_admin;
    setIsAdmin(admin);
    if (admin) {
      const [{ data: news }, site] = await Promise.all([
        supabase.from('news').select('*').order('created_at', { ascending:false }).limit(100),
        fetchSiteSettings(),
      ]);
      setRows((news || []) as NewsRow[]);
      setSettings(site);
      onSettingsChanged?.(site);
    }
    setLoading(false);
  };

  useEffect(() => { load(); if (!supabase) return; const { data } = supabase.auth.onAuthStateChange(() => load()); return () => data.subscription.unsubscribe(); }, []);

  const signIn = async (e: React.FormEvent) => {
    e.preventDefault(); if (!supabase) return;
    setMessage('लॉगिन तपासत आहे...');
    const { error } = await supabase.auth.signInWithPassword(login);
    setMessage(error ? `लॉगिन अयशस्वी: ${error.message}` : '');
    if (!error) await load();
  };

  const sendReset = async (e: React.FormEvent) => {
    e.preventDefault(); if (!supabase) return;
    setMessage('Reset link पाठवत आहे...');
    const { error } = await supabase.auth.resetPasswordForEmail(resetEmail.trim(), { redirectTo: window.location.origin });
    setMessage(error ? `Reset link पाठवताना त्रुटी: ${error.message}` : '✅ Reset link तुमच्या ई-मेलवर पाठवली आहे. ई-मेलमधील लिंक उघडा.');
  };

  const uploadImage = async (file: File) => {
    if (!supabase || !session) return;
    setUploading(true); setMessage('फोटो अपलोड होत आहे...');
    const ext = file.name.split('.').pop() || 'jpg'; const path = `${session.user.id}/${Date.now()}.${ext}`;
    const { error } = await supabase.storage.from('news-images').upload(path, file, { upsert:false, contentType:file.type });
    if (error) setMessage(`फोटो अपलोड अयशस्वी: ${error.message}`);
    else { const { data } = supabase.storage.from('news-images').getPublicUrl(path); setForm(f=>({...f,image_url:data.publicUrl})); setMessage('फोटो अपलोड झाला.'); }
    setUploading(false);
  };

  const publish = async (e: React.FormEvent) => {
    e.preventDefault(); if (!supabase || !isAdmin) return;
    const payload = { ...form, tags:[] };
    const result = editingId ? await supabase.from('news').update(payload).eq('id', editingId) : await supabase.from('news').insert(payload);
    if (result.error) setMessage(`बातमी सेव्ह अयशस्वी: ${result.error.message}`);
    else { setMessage(editingId ? 'बातमी अपडेट झाली.' : 'बातमी प्रकाशित झाली.'); setForm({...emptyForm}); setEditingId(null); await load(); }
  };

  const edit = (r: NewsRow) => { setEditingId(r.id); setForm({ title:r.title, category:r.category, summary:r.summary, content:r.content, date:r.date, time:r.time, location:r.location, author:r.author, image_url:r.image_url, is_breaking:r.is_breaking, is_featured:r.is_featured, published:r.published }); setActiveTab('news'); window.scrollTo({top:0,behavior:'smooth'}); };
  const remove = async (id:string) => { if (!supabase || !isAdmin || !confirm('ही बातमी हटवायची का?')) return; const {error}=await supabase.from('news').delete().eq('id',id); setMessage(error?`हटवताना त्रुटी: ${error.message}`:'बातमी हटवली.'); await load(); };
  const signOut = async () => { await supabase?.auth.signOut(); setSession(null); setIsAdmin(false); };
  const saveSettings = async () => { setSettingsSaving(true); setMessage('Settings सेव्ह होत आहेत...'); const {error}=await saveSiteSettings(settings); setSettingsSaving(false); setMessage(error?`Settings सेव्ह अयशस्वी: ${error.message}`:'✅ वेबसाइट Settings सेव्ह झाल्या.'); if(!error) onSettingsChanged?.(settings); };
  const updateSetting = (key: keyof SiteSettings, value: string) => setSettings(s=>({...s,[key]:value}));

  if (!supabase) return <Panel><h2 className="text-xl font-black">Admin Panel</h2><p className="mt-3 text-red-700">Supabase settings जोडलेले नाहीत. Hosting मध्ये VITE_SUPABASE_URL आणि VITE_SUPABASE_ANON_KEY सेट करा.</p></Panel>;
  if (loading) return <Panel><p>लोड होत आहे...</p></Panel>;
  if (!session) return <Panel><div className="flex justify-between items-center mb-5"><h2 className="text-2xl font-black">🔐 लोकतंत्र मराठी Admin</h2><button onClick={onClose} className="border rounded-xl p-2"><X/></button></div>
    {mode==='login' ? <form onSubmit={signIn} className="space-y-4 max-w-md"><input className="w-full border rounded-xl p-3" type="email" placeholder="Admin Email" value={login.email} onChange={e=>setLogin({...login,email:e.target.value})} required/><input className="w-full border rounded-xl p-3" type="password" placeholder="Password" value={login.password} onChange={e=>setLogin({...login,password:e.target.value})} required/><button className="w-full bg-red-700 text-white rounded-xl p-3 font-bold flex items-center justify-center gap-2"><LogIn size={18}/> Login</button><button type="button" onClick={()=>{setMode('forgot');window.location.hash='#admin-forgot'}} className="w-full border rounded-xl p-3 font-bold flex items-center justify-center gap-2"><KeyRound size={18}/> Forgot Password?</button></form> : <form onSubmit={sendReset} className="space-y-4 max-w-md"><h3 className="text-xl font-black">🔑 Admin Password Reset</h3><p className="text-sm text-slate-600">तुमच्या Admin account चा ई-मेल टाका. Reset link ई-मेलवर येईल.</p><input className="w-full border rounded-xl p-3" type="email" placeholder="Admin Email" value={resetEmail} onChange={e=>setResetEmail(e.target.value)} required/><button className="w-full bg-red-700 text-white rounded-xl p-3 font-bold">Reset Link पाठवा</button><button type="button" onClick={()=>{setMode('login');window.location.hash='#admin'}} className="w-full border rounded-xl p-3 font-bold">← Login कडे जा</button></form>}
    {message&&<p className="mt-4 text-sm text-red-700">{message}</p>}
  </Panel>;
  if (!isAdmin) return <Panel><h2 className="text-2xl font-black">Admin परवानगी नाही</h2><p className="mt-2 text-slate-600">या ईमेलला admin अधिकार दिलेले नाहीत.</p><button onClick={signOut} className="mt-5 border rounded-xl px-4 py-2 flex gap-2"><LogOut size={17}/> Logout</button></Panel>;

  return <Panel>
    <div className="flex flex-wrap items-center justify-between gap-3 mb-6"><div><h2 className="text-2xl font-black">📰 लोकतंत्र मराठी Admin Control Panel</h2><p className="text-sm text-slate-500">बातम्या आणि वेबसाइटची माहिती मोबाइलवरून नियंत्रित करा.</p></div><div className="flex gap-2"><button onClick={signOut} className="border rounded-xl px-3 py-2 flex gap-2"><LogOut size={17}/> Logout</button><button onClick={onClose} className="border rounded-xl p-2"><X/></button></div></div>
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mb-6"><button onClick={()=>setActiveTab('news')} className={`rounded-xl p-3 font-bold ${activeTab==='news'?'bg-red-700 text-white':'border'}`}>📰 बातम्या</button><button onClick={()=>setActiveTab('settings')} className={`rounded-xl p-3 font-bold ${activeTab==='settings'?'bg-red-700 text-white':'border'}`}><Settings className="inline mr-1" size={17}/> Website Settings</button><button onClick={()=>setActiveTab('layout')} className={`rounded-xl p-3 font-bold ${activeTab==='layout'?'bg-red-700 text-white':'border'}`}>↕️ Website Layout</button><button onClick={()=>setActiveTab('epaper')} className={`rounded-xl p-3 font-bold ${activeTab==='epaper'?'bg-red-700 text-white':'border'}`}>📰 E-Paper</button></div>

    {activeTab==='news' && <>
      <form onSubmit={publish} className="grid md:grid-cols-2 gap-4">
        <div className="md:col-span-2 flex items-center justify-between"> <h3 className="text-xl font-black">{editingId?'✏️ बातमी Edit करा':'➕ नवीन बातमी'}</h3>{editingId&&<button type="button" onClick={()=>{setEditingId(null);setForm({...emptyForm})}} className="border rounded-xl px-3 py-2">Cancel Edit</button>}</div>
        <input className="border rounded-xl p-3 md:col-span-2" placeholder="बातमीचे शीर्षक" value={form.title} onChange={e=>setForm({...form,title:e.target.value})} required/>
        <select className="border rounded-xl p-3" value={form.category} onChange={e=>setForm({...form,category:e.target.value})}>{categories.map(c=><option key={c}>{c}</option>)}</select>
        <input className="border rounded-xl p-3" placeholder="ठिकाण" value={form.location} onChange={e=>setForm({...form,location:e.target.value})}/>
        <input className="border rounded-xl p-3" placeholder="तारीख" value={form.date} onChange={e=>setForm({...form,date:e.target.value})} required/><input className="border rounded-xl p-3" placeholder="वेळ" value={form.time} onChange={e=>setForm({...form,time:e.target.value})}/>
        <textarea className="border rounded-xl p-3 md:col-span-2" rows={3} placeholder="थोडक्यात बातमी" value={form.summary} onChange={e=>setForm({...form,summary:e.target.value})} required/>
        <textarea className="border rounded-xl p-3 md:col-span-2" rows={8} placeholder="संपूर्ण बातमी" value={form.content} onChange={e=>setForm({...form,content:e.target.value})} required/>
        <input className="border rounded-xl p-3" placeholder="लेखक / प्रतिनिधी" value={form.author} onChange={e=>setForm({...form,author:e.target.value})}/>
        <div className="border rounded-xl p-3"><label className="font-bold flex items-center gap-2"><Upload size={17}/> फोटो <input type="file" accept="image/*" className="ml-2" onChange={e=>e.target.files?.[0]&&uploadImage(e.target.files[0])}/></label>{uploading&&<p className="text-xs mt-2">अपलोड होत आहे...</p>}{form.image_url&&<img src={form.image_url} className="mt-3 h-24 w-full object-cover rounded-lg"/>}</div>
        <div className="md:col-span-2 flex flex-wrap gap-5 text-sm font-bold"><label><input type="checkbox" checked={form.is_breaking} onChange={e=>setForm({...form,is_breaking:e.target.checked})}/> 🔴 Breaking News</label><label><input type="checkbox" checked={form.is_featured} onChange={e=>setForm({...form,is_featured:e.target.checked})}/> ⭐ Featured</label><label><input type="checkbox" checked={form.published} onChange={e=>setForm({...form,published:e.target.checked})}/> 👁️ Published</label></div>
        <button disabled={uploading} className="md:col-span-2 bg-red-700 text-white rounded-xl p-3 font-black flex items-center justify-center gap-2">{editingId?<Pencil size={19}/>:<PlusCircle size={19}/>} {editingId?'बातमी Update करा':'Publish News'}</button>
      </form>
      <div className="mt-8"><h3 className="text-xl font-black mb-3">अलीकडील बातम्या</h3><div className="space-y-2">{rows.map(r=><div key={r.id} className="border rounded-xl p-3 flex items-center justify-between gap-3"><div className="min-w-0"><b className="block truncate">{r.title}</b><div className="text-xs text-slate-500">{r.category} • {r.date} • {r.published?'Published':'Draft'}</div></div><div className="flex gap-1"><button onClick={()=>edit(r)} className="border rounded-lg p-2" title="Edit"><Pencil size={17}/></button><button onClick={()=>remove(r.id)} className="text-red-700 border rounded-lg p-2" title="Delete"><Trash2 size={17}/></button></div></div>)}</div></div>
    </>}

    {activeTab==='settings' && <div className="space-y-6"><div><h3 className="text-xl font-black">⚙️ Website Settings</h3><p className="text-sm text-slate-500">ही माहिती बदलल्यावर Save Settings करा. बदल वेबसाइटच्या Header/Footer मध्ये वापरले जातील.</p></div><div className="grid md:grid-cols-2 gap-4">
      {([
        ['siteName','वेबसाइटचे नाव'],
        ['tagline','घोषवाक्य'],
        ['editor1Name','संपादक 1 चे नाव'],
        ['editor1Title','संपादक 1 चे पद'],
        ['editor2Name','संपादक 2 चे नाव'],
        ['editor2Title','संपादक 2 चे पद'],
        ['phone1','मोबाईल नंबर 1'],
        ['phone2','मोबाईल नंबर 2'],
        ['whatsapp','WhatsApp नंबर (देश कोडसह)'],
        ['email','ई-मेल'],
        ['address','कार्यालयीन पत्ता'],
        ['facebook','Facebook URL'],
        ['instagram','Instagram URL'],
        ['youtube','YouTube URL'],
        ['logoUrl','Logo URL'],
        ['liveTvUrl','Live TV URL'],
        ['epaperUrl','E-Paper URL'],
        ['copyright','Copyright मजकूर']] as const).map(([key,label])=><label key={key} className="block"><span className="block text-sm font-bold mb-1">{label}</span><input className="w-full border rounded-xl p-3" value={settings[key]} onChange={e=>updateSetting(key,e.target.value)} placeholder={label}/></label>)}
    </div><div className="flex flex-wrap gap-2"><button onClick={saveSettings} disabled={settingsSaving} className="bg-red-700 text-white rounded-xl px-5 py-3 font-black flex items-center gap-2"><Save size={18}/> {settingsSaving?'सेव्ह होत आहे...':'Save Settings'}</button>{settings.facebook&&<a href={settings.facebook} target="_blank" rel="noopener noreferrer" className="border rounded-xl px-4 py-3 flex items-center gap-2">Facebook <ExternalLink size={15}/></a>}</div></div>}

    {activeTab==='layout' && <LayoutEditor />}\n    {activeTab==='epaper' && <EpaperManager />}
    {message&&<p className="mt-5 p-3 bg-slate-100 rounded-xl text-sm">{message}</p>}
  </Panel>;
};

const Panel: React.FC<{children: React.ReactNode}> = ({children}) => <div className="min-h-screen bg-slate-100 p-3 sm:p-6"><div className="max-w-6xl mx-auto bg-white rounded-2xl shadow-sm border p-4 sm:p-8">{children}</div></div>;
