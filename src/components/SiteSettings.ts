import { supabase } from '../lib/supabase';

export type SiteSettings = {
  siteName: string;
  tagline: string;
  editorName: string;
  phone: string;
  whatsapp: string;
  email: string;
  address: string;
  facebook: string;
  instagram: string;
  youtube: string;
  logoUrl: string;
  liveTvUrl: string;
  epaperUrl: string;
  copyright: string;
};

export const DEFAULT_SITE_SETTINGS: SiteSettings = {
  siteName: 'लोकतंत्र मराठी',
  tagline: 'जनतेचा आवाज, जनतेसाठी',
  editorName: 'लोकतंत्र वृत्तसेवा',
  phone: '7668525252',
  whatsapp: '917668525252',
  email: '',
  address: 'पिंपळगाव बसवंत / नाशिक',
  facebook: '',
  instagram: '',
  youtube: '',
  logoUrl: '',
  liveTvUrl: '',
  epaperUrl: '',
  copyright: 'लोकतंत्र मराठी. सर्व हक्क राखीव.',
};

export async function fetchSiteSettings(): Promise<SiteSettings> {
  if (!supabase) return DEFAULT_SITE_SETTINGS;
  const { data } = await supabase.from('site_settings').select('value').eq('key', 'site_config').maybeSingle();
  return data?.value ? { ...DEFAULT_SITE_SETTINGS, ...(data.value as Partial<SiteSettings>) } : DEFAULT_SITE_SETTINGS;
}

export async function saveSiteSettings(value: SiteSettings) {
  if (!supabase) return { error: new Error('Supabase settings जोडलेले नाहीत.') };
  return supabase.from('site_settings').upsert({ key: 'site_config', value, updated_at: new Date().toISOString() });
}
