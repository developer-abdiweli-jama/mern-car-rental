import multer from 'multer';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const BACKEND_DIR = join(dirname(fileURLToPath(import.meta.url)), '..', '..');
const UPLOAD_DIR = join(BACKEND_DIR, 'public', 'uploads');

const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/')) cb(null, true);
  else cb(new Error('Only image files are allowed'), false);
};

const upload = multer({
  storage: multer.memoryStorage(),
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 },
});

export { upload, UPLOAD_DIR };
