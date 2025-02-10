

// src/utils/upload.util.ts
import { createClient } from '@supabase/supabase-js';


export interface MulterFile {
  fieldname: string;
  originalname: string;
  encoding: string;
  mimetype: string;
  buffer: Buffer;
  size: number;
}

export async function uploadFileToSupabase(file: MulterFile): Promise<string> {

  const supabaseUrl = process.env.SUPABASE_URL!;
  const supabaseKey = process.env.SUPABASE_API_KEY!;
  const supabase = createClient(supabaseUrl, supabaseKey);


  const fileName = `${Date.now()}-${file.originalname}`;


  const { data, error } = await supabase.storage
    .from('avatars')
    .upload(fileName, file.buffer, {
      contentType: file.mimetype,
    });

  if (error) {
    throw new Error(`Upload error: ${error.message}`);
  }

  const { data: publicData } = supabase.storage
    .from('avatars')
    .getPublicUrl(fileName);

  if (!publicData.publicUrl) {
    throw new Error('Failed to retrieve public URL');
  }

  return publicData.publicUrl;
}
