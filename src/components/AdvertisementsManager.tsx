import React, { useEffect, useState } from 'react';
import { Pencil, PlusCircle, Trash2, Upload, X, Save } from 'lucide-react';
import { supabase } from '../lib/supabase';

type Advertisement = {
  id: string;
  title: string;
  advertiser_name: string;
  description: string;
  image_url: string;
      media_url: string;
    media_type: string;
    link_type: string;
position: string;
  start_date: string | null;
  end_date: string | null;
  is_active: boolean;
  display_order: number;
  link_url: string;
  views_count: number;
  created_at: string;
};

const emptyForm = {
  title: '',
  advertiser_name: '',
  description: '',
  image_url: '',
      media_url: '',
    media_type: 'image',
    link_type: 'website',
position: 'homepage_top',
  start_date: '',
  end_date: '',
  is_active: true,
  display_order: 0,
  link_url: '',
};

const positions = [
  ['homepage_top', 'मुख्यपृष्ठ — वर'],
  ['homepage_middle', 'मुख्यपृष्ठ — मधला भाग'],
  ['homepage_bottom', 'मुख्यपृष्ठ — खाली'],
  ['epaper', 'ई-पेपर विभाग'],
  ['footer', 'Footer जवळ'],
] as const;

export const AdvertisementsManager: React.FC = () => {
  const [rows, setRows] = useState<Advertisement[]>([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState('');

  const load = async () => {
    if (!supabase) {
      setLoading(false);
      return;
    }

    setLoading(true);

    const { data, error } = await supabase
      .from('advertisements')
      .select('*')
      .order('display_order', { ascending: true })
      .order('created_at', { ascending: false });

    if (error) {
      setMessage(`जाहिराती लोड करताना त्रुटी: ${error.message}`);
    } else {
      setRows((data || []) as Advertisement[]);
    }

    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  const uploadImage = async (file: File) => {
    if (!supabase) return;

    setUploading(true);
    setMessage('जाहिरातीचा फोटो अपलोड होत आहे...');

    const ext = file.name.split('.').pop() || 'jpg';
    const path = `advertisements/${Date.now()}.${ext}`;

    const { error } = await supabase.storage
      .from('news-images')
      .upload(path, file, {
        upsert: false,
        contentType: file.type,
      });

    if (error) {
      setMessage(`फोटो अपलोड अयशस्वी: ${error.message}`);
    } else {
      const { data } = supabase.storage
        .from('news-images')
        .getPublicUrl(path);

      setForm(f => ({ ...f, image_url: data.publicUrl }));
      setMessage('जाहिरातीचा फोटो अपलोड झाला.');
    }

    setUploading(false);
  };

  const save = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!supabase) return;

    if (!form.title.trim() || !form.advertiser_name.trim()) {
      setMessage('जाहिरातीचे नाव आणि जाहिरातदाराचे नाव भरा.');
      return;
    }

    setSaving(true);
    setMessage('जाहिरात सेव्ह होत आहे...');

    const payload = editingId ? {
      title: form.title.trim(),
      advertiser_name: form.advertiser_name.trim(),
      description: form.description.trim(),
      image_url: form.image_url.trim(),
      media_url: form.media_url.trim(),
      media_type: form.media_type,
      link_type: form.link_type,
      position: form.position,
      start_date: form.start_date || null,
      end_date: form.end_date || null,
      is_active: form.is_active,
      display_order: Number(form.display_order) || 0,
      link_url: form.link_url.trim(),
    } : { ...form, views_count: Math.floor(Math.random() * 10001) + 5000 };

    const result = editingId
      ? await supabase
          .from('advertisements')
          .update(payload)
          .eq('id', editingId)
      : await supabase
          .from('advertisements')
          .insert(payload);

    if (result.error) {
      setMessage(`जाहिरात सेव्ह अयशस्वी: ${result.error.message}`);
    } else {
      setMessage(
        editingId
          ? '✅ जाहिरात अपडेट झाली.'
          : '✅ जाहिरात जोडली गेली.'
      );
      setForm({ ...emptyForm });
      setEditingId(null);
      await load();
    }

    setSaving(false);
  };

  const edit = (row: Advertisement) => {
    setEditingId(row.id);

    setForm({
      title: row.title || '',
      advertiser_name: row.advertiser_name || '',
      description: row.description || '',
      image_url: row.image_url || '',
        media_url: row.media_url || '',
        media_type: row.media_type || 'image',
        link_type: row.link_type || 'website',
      position: row.position || 'homepage_top',
      start_date: row.start_date || '',
      end_date: row.end_date || '',
      is_active: row.is_active,
      display_order: row.display_order || 0,
      link_url: row.link_url || '',
    });

    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const remove = async (id: string) => {
    if (
      !supabase ||
      !confirm('ही जाहिरात कायमची हटवायची का?')
    ) {
      return;
    }

    const { error } = await supabase
      .from('advertisements')
      .delete()
      .eq('id', id);

    setMessage(
      error
        ? `जाहिरात हटवताना त्रुटी: ${error.message}`
        : '🗑️ जाहिरात हटवली.'
    );

    await load();
  };

  const cancelEdit = () => {
    setEditingId(null);
    setForm({ ...emptyForm });
    setMessage('');
  };

  if (loading) {
    return <p>जाहिराती लोड होत आहेत...</p>;
  }

  if (!supabase) {
    return (
      <p className="text-red-700">
        Supabase settings जोडलेले नाहीत.
      </p>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-xl font-black">📢 जाहिरात व्यवस्थापन</h3>
        <p className="text-sm text-slate-500 mt-1">
          वेबसाइटवरील जाहिराती येथे जोडा, बदला, बंद करा किंवा हटवा.
        </p>
      </div>

      <form
        onSubmit={save}
        className="border rounded-2xl p-4 sm:p-6 bg-slate-50 space-y-4"
      >
        <div className="flex items-center justify-between gap-3">
          <h4 className="text-lg font-black">
            {editingId ? '✏️ जाहिरात Edit करा' : '➕ नवीन जाहिरात'}
          </h4>

          {editingId && (
            <button
              type="button"
              onClick={cancelEdit}
              className="border rounded-xl px-3 py-2 flex items-center gap-1"
            >
              <X size={16} />
              Cancel
            </button>
          )}
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <label>
            <span className="block text-sm font-bold mb-1">
              जाहिरातीचे नाव *
            </span>
            <input
              className="w-full border rounded-xl p-3 bg-white"
              value={form.title}
              onChange={e =>
                setForm({ ...form, title: e.target.value })
              }
              placeholder="उदा. श्री गणेश ज्वेलर्स"
              required
            />
          </label>

          <label>
            <span className="block text-sm font-bold mb-1">
              जाहिरातदाराचे नाव *
            </span>
            <input
              className="w-full border rounded-xl p-3 bg-white"
              value={form.advertiser_name}
              onChange={e =>
                setForm({
                  ...form,
                  advertiser_name: e.target.value,
                })
              }
              placeholder="व्यवसाय / कंपनीचे नाव"
              required
            />
          </label>

          <label>
            <span className="block text-sm font-bold mb-1">
              जाहिरात कुठे दाखवायची?
            </span>
            <select
              className="w-full border rounded-xl p-3 bg-white"
              value={form.position}
              onChange={e =>
                setForm({ ...form, position: e.target.value })
              }
            >
              {positions.map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
          </label>

          <label>
            <span className="block text-sm font-bold mb-1">
              जाहिरातीचा क्रम
            </span>
            <input
              type="number"
              className="w-full border rounded-xl p-3 bg-white"
              value={form.display_order}
              onChange={e =>
                setForm({
                  ...form,
                  display_order: Number(e.target.value),
                })
              }
            />
          </label>

          <label>
            <span className="block text-sm font-bold mb-1">
              सुरू होण्याची तारीख
            </span>
            <input
              type="date"
              className="w-full border rounded-xl p-3 bg-white"
              value={form.start_date}
              onChange={e =>
                setForm({ ...form, start_date: e.target.value })
              }
            />
          </label>

          <label>
            <span className="block text-sm font-bold mb-1">
              समाप्ती तारीख
            </span>
            <input
              type="date"
              className="w-full border rounded-xl p-3 bg-white"
              value={form.end_date}
              onChange={e =>
                setForm({ ...form, end_date: e.target.value })
              }
            />
          </label>

          <label className="md:col-span-2">
            <span className="block text-sm font-bold mb-1">

      
        <label className="md:col-span-2">
          <span className="block text-sm font-bold mb-1">
            📝 जाहिरातीची माहिती
          </span>
          <textarea
            rows={4}
            className="w-full border rounded-xl p-3 bg-white resize-y"
            value={form.description}
            onChange={e =>
              setForm({ ...form, description: e.target.value })
            }
            placeholder="जाहिरातीबद्दल सविस्तर माहिती येथे लिहा..."
          />
          <p className="text-xs text-slate-500 mt-1">
            जाहिरातीची ऑफर, पत्ता, सेवा, संपर्काची माहिती इत्यादी येथे लिहू शकता.
          </p>
        </label>

<div className="md:col-span-2 grid md:grid-cols-2 gap-4">
        <label>
          <span className="block text-sm font-bold mb-1">जाहिरात Media Type</span>
          <select
            className="w-full border rounded-xl p-3 bg-white"
            value={form.media_type}
            onChange={e => setForm({ ...form, media_type: e.target.value })}
          >
            <option value="image">🖼️ फोटो / Banner</option>
            <option value="video">🎬 Short Video</option>
          </select>
        </label>

        <label>
          <span className="block text-sm font-bold mb-1">Link Type</span>
          <select
            className="w-full border rounded-xl p-3 bg-white"
            value={form.link_type}
            onChange={e => setForm({ ...form, link_type: e.target.value })}
          >
            <option value="website">🌐 Website</option>
            <option value="youtube">▶️ YouTube</option>
            <option value="whatsapp">💬 WhatsApp</option>
            <option value="none">🚫 Link नाही</option>
          </select>
        </label>

        <label className="md:col-span-2">
          <span className="block text-sm font-bold mb-1">🎬 Short Video / Media URL</span>
          <input
            type="url"
            className="w-full border rounded-xl p-3 bg-white"
            value={form.media_url}
            onChange={e => setForm({ ...form, media_url: e.target.value })}
            placeholder="https://example.com/video.mp4"
          />
          <p className="text-xs text-slate-500 mt-1">
            Short Video असल्यास MP4 video ची direct URL द्या.
          </p>
        </label>
      </div>

              जाहिरातीवर क्लिक केल्यावर उघडणारी Link
            </span>
            <input
              type="url"
              className="w-full border rounded-xl p-3 bg-white"
              value={form.link_url}
              onChange={e =>
                setForm({ ...form, link_url: e.target.value })
              }
              placeholder="https://example.com"
            />
          </label>

          <div className="md:col-span-2 border rounded-xl p-4 bg-white">
            <label className="font-bold flex items-center gap-2">
              <Upload size={18} />
              जाहिरातीचा Banner / फोटो
              <input
                type="file"
                accept="image/*"
                className="ml-2"
                onChange={e => {
                  const file = e.target.files?.[0];
                  if (file) uploadImage(file);
                }}
              />
            </label>

            {uploading && (
              <p className="text-xs mt-2 text-slate-500">
                फोटो अपलोड होत आहे...
              </p>
            )}

            {form.image_url && (
              <img
                src={form.image_url}
                alt="Advertisement preview"
                className="mt-3 w-full max-h-64 object-contain rounded-lg border"
              />
            )}
          </div>

          <label className="md:col-span-2 flex items-center gap-2 font-bold">
            <input
              type="checkbox"
              checked={form.is_active}
              onChange={e =>
                setForm({
                  ...form,
                  is_active: e.target.checked,
                })
              }
            />
            👁️ जाहिरात Active आहे
          </label>
        </div>

        <button
          disabled={saving || uploading}
          className="w-full bg-red-700 text-white rounded-xl p-3 font-black flex items-center justify-center gap-2 disabled:opacity-50"
        >
          {editingId ? (
            <Save size={18} />
          ) : (
            <PlusCircle size={18} />
          )}
          {saving
            ? 'सेव्ह होत आहे...'
            : editingId
            ? 'जाहिरात Update करा'
            : 'जाहिरात जोडा'}
        </button>
      </form>

      {message && (
        <div className="p-3 rounded-xl bg-slate-100 text-sm">
          {message}
        </div>
      )}

      <div>
        <h4 className="text-xl font-black mb-3">
          📋 सर्व जाहिराती
        </h4>

        {rows.length === 0 ? (
          <div className="border rounded-xl p-6 text-center text-slate-500">
            अजून कोणतीही जाहिरात जोडलेली नाही.
          </div>
        ) : (
          <div className="space-y-3">
            {rows.map(row => (
              <div
                key={row.id}
                className="border rounded-xl p-3 flex flex-col sm:flex-row gap-3 sm:items-center justify-between"
              >
                <div className="flex gap-3 min-w-0">
                  {row.image_url && (
                    <img
                      src={row.image_url}
                      alt={row.title}
                      className="w-24 h-16 object-cover rounded-lg border shrink-0"
                    />
                  )}

                  <div className="min-w-0">
                    <b className="block truncate">
                      {row.title}
                    </b>

                    <div className="text-xs text-slate-500">
                      {row.advertiser_name} •{' '}
                      {positions.find(
                        p => p[0] === row.position
                      )?.[1] || row.position}
                    </div>

                    <div className="text-xs mt-1">
                      {row.is_active ? (
                        <span className="text-green-700 font-bold">
                          ● Active
                        </span>
                      ) : (
                        <span className="text-slate-500 font-bold">
                          ● Inactive
                        </span>
                      )}

                      {row.start_date &&
                        ` • ${row.start_date}`}

                      {row.end_date &&
                        ` → ${row.end_date}`}
                    </div>
                  </div>
                </div>

                <div className="flex gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={() => edit(row)}
                    className="border rounded-lg p-2"
                    title="Edit"
                  >
                    <Pencil size={17} />
                  </button>

                  <button
                    type="button"
                    onClick={() => remove(row.id)}
                    className="text-red-700 border rounded-lg p-2"
                    title="Delete"
                  >
                    <Trash2 size={17} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
