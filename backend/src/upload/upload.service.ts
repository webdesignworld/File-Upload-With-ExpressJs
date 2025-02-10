import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { createClient } from '@supabase/supabase-js';

@Injectable()
export class UploadService {
  private supabase;
  private bucketName = 'avatars';

  constructor() {
    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_API_KEY;
  
    if (!supabaseUrl || !supabaseKey) {
      throw new Error('Supabase environment variables (SUPABASE_URL and SUPABASE_API_KEY) must be defined');
    }
  
    this.supabase = createClient(supabaseUrl, supabaseKey);
  }
  

  async uploadFile(file: Express.Multer.File) {

    const fileName = `${Date.now()}-${file.originalname}`;

  
    const { data, error } = await this.supabase.storage
      .from(this.bucketName)
      .upload(fileName, file.buffer, {
        contentType: file.mimetype,
      });

    if (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }


    const { publicURL, error: publicURLError } = this.supabase.storage
      .from(this.bucketName)
      .getPublicUrl(fileName);

    if (publicURLError) {
      throw new HttpException(publicURLError.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }

    return {
      message: 'File uploaded successfully',
      data,
      publicURL,
    };
  }
}
