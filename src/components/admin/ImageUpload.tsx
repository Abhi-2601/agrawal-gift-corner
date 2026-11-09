import { useRef, useState } from 'react';
import { ImagePlus, Loader2, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { supabase } from '../../lib/supabase';

interface ImageUploadProps {
  value: string;
  onChange: (url: string) => void;
  bucket: 'product-images' | 'banners';
  label?: string;
  aspect?: 'square' | 'wide' | 'banner';
}

export default function ImageUpload({
  value,
  onChange,
  bucket,
  label = 'Image',
  aspect = 'wide',
}: ImageUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  const aspectClass = aspect === 'square' ? 'aspect-square' : aspect === 'banner' ? 'aspect-[16/6]' : 'aspect-[4/3]';

  const handleFile = async (file: File | undefined) => {
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      toast.error('Please choose an image file.');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Images must be 5 MB or smaller.');
      return;
    }

    setUploading(true);
    try {
      const extension = file.name.split('.').pop()?.toLowerCase() || 'jpg';
      const path = `${crypto.randomUUID()}.${extension}`;
      const { error } = await supabase.storage.from(bucket).upload(path, file, {
        cacheControl: '3600',
        upsert: false,
        contentType: file.type,
      });
      if (error) throw error;

      const { data } = supabase.storage.from(bucket).getPublicUrl(path);
      if (!data.publicUrl) throw new Error('Upload succeeded but no public URL was returned.');
      onChange(data.publicUrl);
      toast.success('Image uploaded');
    } catch (error: any) {
      toast.error(error?.message || 'Image upload failed. Check Storage bucket permissions.');
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = '';
    }
  };

  return (
    <div>
      <span className="admin-label">{label}</span>
      <div className={`relative overflow-hidden rounded-xl border border-dashed border-subtle-border bg-[#FBF8F5] ${aspectClass}`}>
        {value ? (
          <>
            <img src={value} alt="Preview" className="h-full w-full object-cover" />
            <div className="absolute inset-x-0 bottom-0 flex items-center justify-between gap-2 bg-gradient-to-t from-ink/70 to-transparent p-2.5">
              <button
                type="button"
                onClick={() => inputRef.current?.click()}
                className="rounded-md bg-white/95 px-2.5 py-1.5 text-[0.68rem] font-semibold text-ink shadow-sm hover:bg-white"
              >
                Replace
              </button>
              <button
                type="button"
                onClick={() => onChange('')}
                className="grid h-8 w-8 place-items-center rounded-md bg-white/95 text-red-700 shadow-sm hover:bg-white"
                aria-label="Remove image"
              >
                <Trash2 size={14} />
              </button>
            </div>
          </>
        ) : (
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            className="flex h-full w-full flex-col items-center justify-center gap-2 p-4 text-center text-secondary-text transition-colors hover:bg-blush/30"
          >
            {uploading ? <Loader2 size={24} className="animate-spin text-burgundy" /> : <ImagePlus size={24} className="text-burgundy/70" />}
            <span className="text-xs font-semibold">{uploading ? 'Uploading…' : 'Click to upload'}</span>
            <span className="text-[0.65rem]">JPG, PNG or WebP · max 5 MB</span>
          </button>
        )}
      </div>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="sr-only"
        onChange={(event) => void handleFile(event.target.files?.[0])}
      />
    </div>
  );
}
