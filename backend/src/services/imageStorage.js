import { createHash, randomUUID } from 'crypto';
import { mkdir, writeFile } from 'fs/promises';
import { basename, extname, join } from 'path';
import { UPLOAD_DIR } from '../config/multer.js';
import { AppError } from '../middleware/errorHandler.js';

const saveToCloudinary = async (file) => {
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
  const apiKey = process.env.CLOUDINARY_API_KEY;
  const apiSecret = process.env.CLOUDINARY_API_SECRET;
  const timestamp = Math.floor(Date.now() / 1000);
  const folder = 'car-rental';
  const signature = createHash('sha1')
    .update(`folder=${folder}&timestamp=${timestamp}${apiSecret}`)
    .digest('hex');

  const form = new FormData();
  form.append('file', new Blob([file.buffer], { type: file.mimetype }), basename(file.originalname));
  form.append('api_key', apiKey);
  form.append('timestamp', String(timestamp));
  form.append('folder', folder);
  form.append('signature', signature);

  const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
    method: 'POST',
    body: form,
  });
  const result = await response.json();
  if (!response.ok || !result.secure_url) {
    throw AppError(result.error?.message || 'Unable to store the uploaded image', 502);
  }
  return result.secure_url;
};

const saveLocally = async (file) => {
  await mkdir(UPLOAD_DIR, { recursive: true });
  const extension = extname(file.originalname).toLowerCase();
  const filename = `${Date.now()}-${randomUUID()}${extension}`;
  await writeFile(join(UPLOAD_DIR, filename), file.buffer);
  return `/uploads/${filename}`;
};

export const saveCarImage = async (file) => {
  if (!file) return '';

  const cloudCredentials = [
    process.env.CLOUDINARY_CLOUD_NAME,
    process.env.CLOUDINARY_API_KEY,
    process.env.CLOUDINARY_API_SECRET,
  ];
  const hasAnyCloudCredential = cloudCredentials.some(Boolean);
  if (hasAnyCloudCredential && !cloudCredentials.every(Boolean)) {
    throw AppError('Cloud image storage credentials are incomplete', 500);
  }
  if (cloudCredentials.every(Boolean)) return saveToCloudinary(file);
  if (process.env.NODE_ENV === 'production') {
    throw AppError('Configure Cloudinary before uploading images in production', 503);
  }
  return saveLocally(file);
};
