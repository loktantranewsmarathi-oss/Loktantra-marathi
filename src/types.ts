export type NewsCategory = 
  | 'मुख्यपृष्ठ'
  | 'नाशिक जिल्हा'
  | 'महाराष्ट्र'
  | 'शेती व ग्रामीण'
  | 'शिक्षण व क्रीडा'
  | 'व्हिडिओ'
  | 'फोटो गॅलरी'
  | 'ई-पेपर';

export interface NewsArticle {
  id: string;
  title: string;
  category: NewsCategory;
  subCategory?: string;
  summary: string;
  content: string;
  date: string;
  time: string;
  location: string;
  author: string;
  imageUrl: string;
  imageCaption?: string;
  isBreaking?: boolean;
  isFeatured?: boolean;
  viewsCount?: number;
  readTimeMinutes?: number;
  tags?: string[];
}

export interface EPaperClip {
  id: string;
  headline: string;
  summary: string;
  fullText: string;
  x: number; // Percentage offset for visual placement
  y: number;
  width: number;
  height: number;
  category: string;
}

export interface EPaperPage {
  pageNumber: number;
  title: string;
  subtitle: string;
  date: string;
  edition: string;
  imageUrl?: string;
  clips: EPaperClip[];
}

export interface PhotoGalleryItem {
  id: string;
  title: string;
  category: 'स्थानिक कार्यक्रम' | 'सामाजिक उपक्रम' | 'क्रीडा स्पर्धा' | 'शैक्षणिक कार्यक्रम' | 'सांस्कृतिक कार्यक्रम' | 'नागरिकांचे उपक्रम';
  imageUrl: string;
  description: string;
  date: string;
  location: string;
}

export interface VideoNewsItem {
  id: string;
  title: string;
  category: 'ब्रेकिंग न्यूज' | 'स्थानिक बातम्या' | 'महाराष्ट्र' | 'विशेष मुलाखती' | 'ग्राउंड रिपोर्ट';
  thumbnailUrl: string;
  duration: string;
  youtubeId?: string;
  date: string;
  views: string;
  isLive?: boolean;
  description: string;
}

export interface NewsTipForm {
  name: string;
  phone: string;
  location: string;
  message: string;
  category: string;
}

export interface AdInquiryForm {
  name: string;
  businessName: string;
  phone: string;
  email: string;
  adType: string;
  message: string;
}
