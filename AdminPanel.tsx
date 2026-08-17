import React, { useEffect, useState } from 'react';
import { LogIn, LogOut, PlusCircle, Trash2, Upload, X } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { LayoutEditor } from './LayoutEditor';

const categories = ['नाशिक जिल्हा','महाराष्ट्र','शेती व ग्रामीण','शिक्षण व क्रीडा'] as const;

type NewsRow = {
  id: string; title: string; category: string; summary: string; content: string;
  date: string; time: string; location: string; author: string; image_url: string;
  is_breaking: boolean; is_featured: boolean; published: boolean; created_at: string;
};

const emptyForm = { title:'', category:'नाशिक जिल्हा', summary:'', content:'', date:'', time:'', location:'पिंपळगाव बसवंत', author:'लोकतंत्र वृत्तसेवा', image_url:'', is_breaking:false, is_featured:false, published:true };

export const AdminPanel: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const [session, setSession] = useState<any>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [login, setLogin] = useState({email:'',password:''});
  const [form, setForm] = useState(emptyForm);
  const [rows, setRows] = useState<NewsRow[]>([]);
  const [message, setMessage] = useState('');
  const [uploading, setUploading] = useState(false);

  const load = async () => {
    if (!supabase) { setLoading(false); return; }
    const { data: { session } } = await supabase.auth.getSession();
    setSession(session);
    if (!session) { setLoading(false); return; }
    const { data: profile } = await supabase.from('profiles').select('is_admin').eq('id', session.user.id).single();
    const admin = !!profile?.is_admin;
    setIsAdmin(admin);
    if (admin) {
      const { data } = await supabase.from('news').select('*').order('created_at', { ascending:false }).limit(50);
      setRows((data || []) as NewsRow[]);
    }
    setLoading(false);
  };

  useEffect(() => {
    load();
    if (!supabase) return;
    const { data } = supabase.auth.onAuthStateChange(() => load());
    return () => data.subscription.unsubscribe();
  }, []);

  const signIn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!supabase) return;
    setMessage('लॉगिन तपासत आहे...');
    const { error } = await supabase.auth.signInWithPassword(login);
    setMessage(error ? `लॉगिन अयशस्वी: ${error.message}` : '');
    if (!error) await load();
  };

  const uploadImage = async (file: File) => {
    if (!supabase || !session) return;
    setUploading(true); setMessage('फोटो अपलोड होत आहे...');
    const ext = file.name.split('.').pop() || 'jpg';
    const path = `${session.user.id}/${Date.now()}.${ext}`;
    const { error } = await supabase.storage.from('news-images').upload(path, file, { upsert:false, contentType:file.type });
    if (error) setMessage(`फोटो अपलोड अयशस्वी: ${error.message}`);
    else {
      const { data } = supabase.storage.from('news-images').getPublicUrl(path);
      setForm(f => ({...f, image_url:data.publicUrl})); setMessage('फोटो अपलोड झाला.');
    }
    setUploading(false);
  };

  const publish = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!supabase || !isAdmin) return;
    const { error } = await supabase.from('news').insert({ ...form, tags:[] });
    if (error) setMessage(`बातमी सेव्ह अयशस्वी: ${error.message}`);
    else { setMessage('बातमी प्रकाशित झाली.'); setForm({...emptyForm}); await load(); }
  };

  const remove = async (id: string) => {
    if (!supabase || !isAdmin || !confirm('ही बातमी हटवायची का?')) return;
    const { error } = await supabase.from('news').delete().eq('id', id);
    setMessage(error ? `हटवताना त्रुटी: ${error.message}` : 'बातमी हटवली.');
    await load();
  };

  const signOut = async () => { await supabase?.auth.signOut(); setSession(null); setIsAdmin(false); };

  if (!supabase) return <Panel><h2 className="text-xl font-black">Admin Panel</h2><p className="mt-3 text-red-700">Supabase settings जोडलेले नाहीत. Hosting मध्ये VITE_SUPABASE_URL आणि VITE_SUPABASE_ANON_KEY सेट करा.</p></Panel>;
  if (loading) return <Panel><p>लोड होत आहे...</p></Panel>;
  if (!session) return <Panel><h2 className="text-2xl font-black mb-5">🔐 लोकतंत्र मराठी Admin Login</h2><form onSubmit={signIn} className="space-y-4 max-w-md"><input className="w-full border rounded-xl p-3" type="email" placeholder="Admin Email" value={login.email} onChange={e=>setLogin({...login,email:e.target.value})} required/><input className="w-full border rounded-xl p-3" type="password" placeholder="Password" value={login.password} onChange={e=>setLogin({...login,password:e.target.value})} required/><button className="w-full bg-red-700 text-white rounded-xl p-3 font-bold flex items-center justify-center gap-2"><LogIn size={18}/> Login</button></form>{message&&<p className="mt-4 text-sm text-red-700">{message}</p>}</Panel>;
  if (!isAdmin) return <Panel><h2 className="text-2xl font-black">Admin परवानगी नाही</h2><p className="mt-2 text-slate-600">या ईमेलला admin अधिकार दिलेले नाहीत.</p><button onClick={signOut} className="mt-5 border rounded-xl px-4 py-2 flex gap-2"><LogOut size={17}/> Logout</button></Panel>;

  return <Panel>
    <div className="flex items-center justify-between gap-3 mb-6"><div><h2 className="text-2xl font-black">📰 Admin Panel</h2><p className="text-sm text-slate-500">मोबाईलवरून बातमी प्रकाशित करा</p></div><div className="flex gap-2"><button onClick={signOut} className="border rounded-xl px-3 py-2 flex gap-2"><LogOut size={17}/> Logout</button><button onClick={onClose} className="border rounded-xl p-2"><X/></button></div></div>
    <form onSubmit={publish} className="grid md:grid-cols-2 gap-4">
      <input className="border rounded-xl p-3 md:col-span-2" placeholder="बातमीचे शीर्षक" value={form.title} onChange={e=>setForm({...form,title:e.target.value})} required/>
      <select className="border rounded-xl p-3" value={form.category} onChange={e=>setForm({...form,category:e.target.value})}>{categories.map(c=><option key={c}>{c}</option>)}</select>
      <input className="border rounded-xl p-3" placeholder="ठिकाण" value={form.location} onChange={e=>setForm({...form,location:e.target.value})}/>
      <input className="border rounded-xl p-3" placeholder="तारीख (उदा. १६ ऑगस्ट २०२६)" value={form.date} onChange={e=>setForm({...form,date:e.target.value})} required/>
      <input className="border rounded-xl p-3" placeholder="वेळ" value={form.time} onChange={e=>setForm({...form,time:e.target.value})}/>
      <textarea className="border rounded-xl p-3 md:col-span-2" rows={3} placeholder="थोडक्यात बातमी" value={form.summary} onChange={e=>setForm({...form,summary:e.target.value})} required/>
      <textarea className="border rounded-xl p-3 md:col-span-2" rows={8} placeholder="संपूर्ण बातमी" value={form.content} onChange={e=>setForm({...form,content:e.target.value})} required/>
      <input className="border rounded-xl p-3" placeholder="लेखक / प्रतिनिधी" value={form.author} onChange={e=>setForm({...form,author:e.target.value})}/>
      <div className="border rounded-xl p-3"><label className="font-bold flex items-center gap-2"><Upload size={17}/> फोटो अपलोड <input type="file" accept="image/*" className="ml-2" onChange={e=>e.target.files?.[0] && uploadImage(e.target.files[0])}/></label>{uploading&&<p className="text-xs mt-2">अपलोड होत आहे...</p>}{form.image_url&&<img src={form.image_url} className="mt-3 h-24 w-full object-cover rounded-lg"/>}</div>
      <div className="md:col-span-2 flex flex-wrap gap-5 text-sm font-bold"><label><input type="checkbox" checked={form.is_breaking} onChange={e=>setForm({...form,is_breaking:e.target.checked})}/> 🔴 Breaking News</label><label><input type="checkbox" checked={form.is_featured} onChange={e=>setForm({...form,is_featured:e.target.checked})}/> ⭐ Featured</label></div>
      <button disabled={uploading} className="md:col-span-2 bg-red-700 text-white rounded-xl p-3 font-black flex items-center justify-center gap-2"><PlusCircle size={19}/> Publish News</button>
    </form>
    {message&&<p className="mt-4 p-3 bg-slate-100 rounded-xl text-sm">{message}</p>}
    <LayoutEditor />
    <div className="mt-8"><h3 className="text-xl font-black mb-3">अलीकडील बातम्या</h3><div className="space-y-2">{rows.map(r=><div key={r.id} className="border rounded-xl p-3 flex items-center justify-between gap-3"><div><b>{r.title}</b><div className="text-xs text-slate-500">{r.category} • {r.date}</div></div><button onClick={()=>remove(r.id)} className="text-red-700 p-2" title="Delete"><Trash2 size={18}/></button></div>)}</div></div>
  </Panel>;
};

const Panel: React.FC<{children: React.ReactNode}> = ({children}) => <div className="min-h-screen bg-slate-100 p-3 sm:p-6"><div className="max-w-5xl mx-auto bg-white rounded-2xl shadow-sm border p-4 sm:p-8">{children}</div></div>;
