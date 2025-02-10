
import * as multer from 'multer';

export const uploadMiddleware = multer({
  storage: multer.memoryStorage(),
});

