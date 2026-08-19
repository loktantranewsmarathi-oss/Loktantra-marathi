import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { Upload, Trash2, ExternalLink } from 'lucide-react';

type EpaperRow = {
  id: string;
  edition_date: string;
  edition_name: string;
  page_number: number;
  title: string | null;
  file_path: string;
  file_url: string;
  file_type: string;
  expires_at: string;
  created_at: string;
};

export const EpaperManager: React.FC = () => {
  const [rows, setRows] = useState<EpaperRow[]>([]);
  const [date, setDate] = useState('');
  const [editionName, setEditionName] = useState('दैनिक - नाशिक आवृत्ती');
  const [pageNumber, setPageNumber] = useState('1');
  const [title, setTitle] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState('');

  const load = async () => {
    if (!supabase) return;

    const { data, error } = await supabase
      .from('epapers')
      .select('*')
      .order('edition_date', { ascending: false })
      .order('page_number', { ascending: true });

    if (error) {
      setMessage(`E-Paper यादी लोड झाली नाही: ${error.message}`);
      return;
    }

    setRows((data || []) as EpaperRow[]);
  };

  useEffect(() => {
    const today = new Date().toISOString().slice(0, 10);
    setDate(today);
    load();
  }, []);

  const uploadEpaper = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!supabase) {
      setMessage('Supabase जोडलेले नाही.');
      return;
    }

    if (!file) {
      setMessage('कृपया PDF फाइल निवडा.');
      return;
    }

    if (file.type !== 'application/pdf') {
      setMessage('फक्त PDF फाइल अपलोड करा.');
      return;
    }

    const page = Number(pageNumber);

    if (!date || !page || page < 1) {
      setMessage('तारीख आणि Page Number योग्य भरा.');
      return;
    }

    setUploading(true);
    setMessage('E-Paper upload होत आहे...');

    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session) {
      setUploading(false);
      setMessage('Admin session सापडले नाही. पुन्हा Login करा.');
      return;
    }

    const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_');
    const path = `${session.user.id}/${date}/${Date.now()}-${safeName}`;

    const { error: uploadError } = await supabase.storage
      .from('epaper-files')
      .upload(path, file, {
        upsert: false,
        contentType: 'application/pdf',
      });

    if (uploadError) {
      setUploading(false);
      setMessage(`PDF upload अयशस्वी: ${uploadError.message}`);
      return;
    }

    const { data: publicData } = supabase.storage
      .from('epaper-files')
      .getPublicUrl(path);

    const fileUrl = publicData.publicUrl;

    const { error: insertError } = await supabase.from('epapers').insert({
      edition_date: date,
      edition_name: editionName.trim() || 'दैनिक - नाशिक आवृत्ती',
      page_number: page,
      title: title.trim() || null,
      file_path: path,
      file_url: fileUrl,
      file_type: 'application/pdf',
    });

    if (insertError) {
      await supabase.storage.from('epaper-files').remove([path]);
      setUploading(false);
      setMessage(`E-Paper नोंद सेव्ह अयशस्वी: ${insertError.message}`);
      return;
    }

    setFile(null);
    setTitle('');
    setPageNumber(String(page + 1));
    setUploading(false);
    setMessage('✅ E-Paper यशस्वीपणे upload झाला.');
    await load();
  };

  const removeEpaper = async (row: EpaperRow) => {
    if (!supabase) return;

    if (!confirm(`"${row.edition_date}" चा हा E-Paper हटवायचा का?`)) {
      return;
    }

    const { error: storageError } = await supabase.storage
      .from('epaper-files')
      .remove([row.file_path]);

    if (storageError) {
      setMessage(`PDF हटवताना त्रुटी: ${storageError.message}`);
      return;
    }

    const { error } = await supabase
      .from('epapers')
      .delete()
      .eq('id', row.id);

    if (error) {
      setMessage(`नोंद हटवताना त्रुटी: ${error.message}`);
      return;
    }

    setMessage('E-Paper हटवला.');
    await load();
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-xl font-black">📰 E-Paper व्यवस्थापन</h3>
        <p className="text-sm text-slate-500">
          दैनिक E-Paper PDF upload करा आणि जुन्या आवृत्त्या व्यवस्थापित करा.
        </p>
      </div>

      <form onSubmit={uploadEpaper} className="grid md:grid-cols-2 gap-4 border rounded-2xl p-4">
        <label className="block">
          <span className="block text-sm font-bold mb-1">E-Paper तारीख</span>
          <input
            type="date"
            className="w-full border rounded-xl p-3"
            value={date}
            onChange={e => setDate(e.target.value)}
            required
          />
        </label>

        <label className="block">
          <span className="block text-sm font-bold mb-1">Edition</span>
          <input
            className="w-full border rounded-xl p-3"
            value={editionName}
            onChange={e => setEditionName(e.target.value)}
            placeholder="दैनिक - नाशिक आवृत्ती"
            required
          />
        </label>

        <label className="block">
          <span className="block text-sm font-bold mb-1">Page Number</span>
          <input
            type="number"
            min="1"
            className="w-full border rounded-xl p-3"
            value={pageNumber}
            onChange={e => setPageNumber(e.target.value)}
            required
          />
        </label>

        <label className="block">
          <span className="block text-sm font-bold mb-1">Page Title (ऐच्छिक)</span>
          <input
            className="w-full border rounded-xl p-3"
            value={title}
            onChange={e => setTitle(e.target.value)}
            placeholder="मुख्य बातम्या"
          />
        </label>

        <label className="block md:col-span-2 border rounded-xl p-4">
          <span className="block text-sm font-bold mb-2">PDF फाइल</span>
          <input
            type="file"
            accept="application/pdf,.pdf"
            onChange={e => setFile(e.target.files?.[0] || null)}
            required
          />
          {file && (
            <p className="text-sm text-slate-500 mt-2">
              निवडलेली फाइल: {file.name}
            </p>
          )}
        </label>

        <button
          type="submit"
          disabled={uploading}
          className="md:col-span-2 bg-red-700 text-white rounded-xl p-3 font-black flex items-center justify-center gap-2 disabled:opacity-50"
        >
          <Upload size={18} />
          {uploading ? 'Upload होत आहे...' : 'E-Paper Upload करा'}
        </button>
      </form>

      {message && (
        <p className="p-3 bg-slate-100 rounded-xl text-sm">
          {message}
        </p>
      )}

      <div>
        <h4 className="text-lg font-black mb-3">अपलोड केलेले E-Papers</h4>

        {rows.length === 0 ? (
          <p className="text-sm text-slate-500 border rounded-xl p-4">
            अजून E-Paper upload केलेला नाही.
          </p>
        ) : (
          <div className="space-y-2">
            {rows.map(row => (
              <div
                key={row.id}
                className="border rounded-xl p-3 flex items-center justify-between gap-3"
              >
                <div className="min-w-0">
                  <b className="block truncate">
                    {row.edition_date} — Page {row.page_number}
                  </b>
                  <div className="text-xs text-slate-500">
                    {row.edition_name}
                    {row.title ? ` • ${row.title}` : ''}
                  </div>
                </div>

                <div className="flex gap-1 shrink-0">
                  <a
                    href={row.file_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="border rounded-lg p-2"
                    title="PDF उघडा"
                  >
                    <ExternalLink size={17} />
                  </a>

                  <button
                    type="button"
                    onClick={() => removeEpaper(row)}
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
