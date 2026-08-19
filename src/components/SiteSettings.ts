import { supabase } from '../lib/supabase';

export type SiteSettings = {
  siteName: string;
  tagline: string;

  editor1Name: string;
  editor1Title: string;
  editor2Name: string;
  editor2Title: string;

  phone1: string;
  phone2: string;
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
  siteName: 'लोकतंत्र वृत्तपत्र, लोकतंत्र मराठी न्यूज',
  tagline: 'जनतेचा आवाज, जनतेसाठी',

  editor1Name: 'रविंद्र राजाराम क्षिरसागर',
  editor1Title: 'संपादक',
  editor2Name: 'प्रविण रामराव घुमरे',
  editor2Title: 'संपादक / मुख्य व्यवस्थापक',

  phone1: '7668525252',
  phone2: '9860541550',
  whatsapp: '917668525252',
  email: 'loktantranewsmarathi@gmail.com',
  address: 'शॉप नंबर 03, उंबरखेड रोड, पिंपळगाव बसवंत, ता. निफाड, जि. नाशिक, महाराष्ट्र – 422209',

  facebook: 'https://facebook.com',
  instagram: 'https://instagram.com',
  youtube: 'https://youtube.com',

  logoUrl: '',
  liveTvUrl: '',
  epaperUrl: '',
  copyright: 'लोकतंत्र मराठी. सर्व हक्क राखीव.',
};

export async function fetchSiteSettings(): Promise<SiteSettings> {
  if (!supabase) return DEFAULT_SITE_SETTINGS;

  const { data } = await supabase
    .from('site_settings')
    .select('value')
    .eq('key', 'site_config')
    .maybeSingle();

  return data?.value
    ? { ...DEFAULT_SITE_SETTINGS, ...(data.value as Partial<SiteSettings>) }
    : DEFAULT_SITE_SETTINGS;
}

export async function saveSiteSettings(value: SiteSettings) {
  if (!supabase) {
    return { error: new Error('Supabase settings जोडलेले नाहीत.') };
  }

  return supabase
    .from('site_settings')
    .upsert({
      key: 'site_config',
      value,
      updated_at: new Date().toISOString(),
    });
}
