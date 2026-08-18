import React, { useEffect, useState } from 'react';
import { ArrowDown, ArrowUp, Eye, EyeOff, GripVertical, RotateCcw, Save } from 'lucide-react';
import { supabase } from '../lib/supabase';

export type LayoutItem = { id: string; label: string; visible: boolean };
export const DEFAULT_LAYOUT: LayoutItem[] = [
  {id:'hero',label:'मुख्य बातम्या',visible:true}, {id:'nashik',label:'नाशिक जिल्हा',visible:true},
  {id:'epaper',label:'ई-पेपर',visible:true}, {id:'video',label:'व्हिडिओ गॅलरी',visible:true},
  {id:'photo',label:'फोटो गॅलरी',visible:true}, {id:'about',label:'संपादकांचा संदेश',visible:true},
  {id:'advertise',label:'जाहिरात विभाग',visible:true}, {id:'contact',label:'संपर्क विभाग',visible:true}
];

export async function fetchHomepageLayout(): Promise<LayoutItem[]> {
  if (!supabase) return DEFAULT_LAYOUT;
  const { data } = await supabase.from('site_settings').select('value').eq('key','homepage_layout').maybeSingle();
  return Array.isArray(data?.value) ? data!.value as LayoutItem[] : DEFAULT_LAYOUT;
}

export const LayoutEditor: React.FC = () => {
  const [items,setItems]=useState<LayoutItem[]>(DEFAULT_LAYOUT); const [message,setMessage]=useState(''); const [saving,setSaving]=useState(false);
  useEffect(()=>{fetchHomepageLayout().then(setItems)},[]);
  const move=(i:number,d:number)=>setItems(a=>{const b=[...a],j=i+d;if(j<0||j>=b.length)return a;[b[i],b[j]]=[b[j],b[i]];return b});
  const toggle=(i:number)=>setItems(a=>a.map((x,k)=>k===i?{...x,visible:!x.visible}:x));
  const save=async()=>{if(!supabase)return;setSaving(true);setMessage('सेव्ह होत आहे...');const {error}=await supabase.from('site_settings').upsert({key:'homepage_layout',value:items,updated_at:new Date().toISOString()});setSaving(false);setMessage(error?`सेव्ह अयशस्वी: ${error.message}`:'✅ वेबसाइटची मांडणी सेव्ह झाली.');};
  const reset=()=>setItems(DEFAULT_LAYOUT);
  return <div className="mt-8 border-t pt-6"><div className="flex flex-wrap items-center justify-between gap-3 mb-3"><div><h3 className="text-xl font-black">↕️ वेबसाइट मांडणी</h3><p className="text-sm text-slate-500">मोबाईलवरून विभाग वर/खाली करा किंवा लपवा.</p></div><div className="flex gap-2"><button onClick={reset} className="border rounded-xl px-3 py-2 flex gap-2 items-center"><RotateCcw size={17}/> Reset</button><button onClick={save} disabled={saving} className="bg-red-700 text-white rounded-xl px-4 py-2 flex gap-2 items-center"><Save size={17}/> Save</button></div></div>
    <div className="space-y-2">{items.map((x,i)=><div key={x.id} className={`border rounded-xl p-3 flex items-center gap-3 ${x.visible?'bg-white':'bg-slate-100 opacity-70'}`}><GripVertical size={18} className="text-slate-400"/><div className="flex-1"><b>{i+1}. {x.label}</b><div className="text-xs text-slate-500">{x.visible?'वेबसाइटवर दिसेल':'लपवलेले'}</div></div><button onClick={()=>move(i,-1)} disabled={i===0} className="border rounded-lg p-2 disabled:opacity-30" title="वर"><ArrowUp size={17}/></button><button onClick={()=>move(i,1)} disabled={i===items.length-1} className="border rounded-lg p-2 disabled:opacity-30" title="खाली"><ArrowDown size={17}/></button><button onClick={()=>toggle(i)} className="border rounded-lg p-2" title={x.visible?'लपवा':'दाखवा'}>{x.visible?<Eye size={17}/>:<EyeOff size={17}/>}</button></div>)}</div>
    {message&&<p className="mt-3 text-sm p-3 rounded-xl bg-slate-100">{message}</p>}
  </div>;
};
