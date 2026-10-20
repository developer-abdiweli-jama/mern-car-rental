const API_ORIGIN = ((import.meta.env.VITE_API_URL as string) || 'http://localhost:5000/api').replace(/\/api$/, '');

export const getImageUrl = (image?: string | null): string => {
  if (!image) return '';
  if (image.startsWith('http://') || image.startsWith('https://')) return image;
  // Car uploads stored locally by the API use /uploads; Vite's /assets and /src
  // paths belong to the frontend and must stay on the frontend origin.
  if (image.startsWith('/uploads/')) return `${API_ORIGIN}${image}`;
  if (image.startsWith('/')) return image;
  return `${API_ORIGIN}/${image}`;
};
