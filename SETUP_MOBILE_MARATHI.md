# लोकतंत्र मराठी — Live Setup (मोबाईलवरून)

## 1) Supabase Project
1. https://supabase.com/ वर account/project तयार करा.
2. Dashboard → SQL Editor → New query.
3. या project मधील `supabase_schema.sql` पूर्ण कॉपी करून Run करा.

## 2) Admin User
1. Supabase → Authentication → Users → Add user.
2. तुमचा email + मजबूत password वापरा.
3. User तयार झाल्यावर SQL Editor मध्ये हे चालवा:
   `update public.profiles set is_admin = true where id = (select id from auth.users where email = 'YOUR-EMAIL');`
4. `YOUR-EMAIL` च्या जागी तुमचा खरा admin email लिहा.

## 3) Supabase API keys
Dashboard → Project Settings → API मधून Project URL आणि Publishable/Anon key घ्या.

Hosting मध्ये environment variables:
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`

**Service role key कधीही वेबसाइटच्या `.env` मध्ये किंवा browser code मध्ये ठेवू नका.**

## 4) Website deploy
Netlify वर GitHub repository import करा.
Build command: `npm run build`
Publish directory: `dist`

Netlify environment variables मध्ये वरच्या दोन Supabase variables जोडा आणि Deploy करा.

## 5) Domain
Netlify → Domain management → Add a domain → Add a domain you already own → `loktantramarathi.in`.
Netlify जे DNS records दाखवेल ते GoDaddy DNS मध्ये टाका.

## 6) Admin Panel
Website उघडा:
`https://loktantramarathi.in/#admin`

Admin email/password ने login करा. त्यानंतर बातमी, फोटो, category, breaking/featured निवडून Publish करा.

## महत्त्वाची सुरक्षा
- Supabase RLS policies बदलू नका जोपर्यंत कारण माहीत नाही.
- Admin password कोणालाही देऊ नका.
- Service Role key browser मध्ये वापरू नका.
- Domain renewal साठी GoDaddy account मध्ये auto-renew/renewal price तपासा.


## नवीन: Website Layout Editor
Admin Panel मध्ये “↕️ वेबसाइट मांडणी” विभागातून मुख्यपृष्ठाचे sections वर/खाली करता येतात आणि Eye बटणाने section लपवता/दाखवता येतो. Save केल्यानंतर homepage वर नवीन क्रम दिसतो. यासाठी नवीन `site_settings` SQL भाग Supabase SQL Editor मध्ये एकदा run करणे आवश्यक आहे.
