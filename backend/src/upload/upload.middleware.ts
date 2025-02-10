
import * as multer from 'multer';

export const uploadMiddleware = multer({
  storage: multer.memoryStorage(),
});


//This sets up Multer to store uploaded files in memory (as buffers) rather than saving them to disk. This is useful when you want to immediately pass the file to another service (like Supabase).