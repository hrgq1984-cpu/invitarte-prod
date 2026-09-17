/**
 * Utility for client-side image compression.
 * Converts large smartphone photos (2MB - 10MB) into compact WebP/JPEG data URLs (~30KB - 80KB)
 * to prevent exceeding browser localStorage 5MB quota.
 */
export const compressImageFile = (
  file: File, 
  maxWidth = 800, 
  maxHeight = 800, 
  quality = 0.7
): Promise<string> => {
  return new Promise((resolve) => {
    // If not an image, resolve empty
    if (!file || !file.type.startsWith('image/')) {
      resolve('');
      return;
    }

    const reader = new FileReader();
    reader.onload = (readerEvent) => {
      const img = new Image();
      img.onload = () => {
        let width = img.width;
        let height = img.height;

        // Calculate aspect ratio scale
        if (width > maxWidth || height > maxHeight) {
          if (width / maxWidth > height / maxHeight) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          } else {
            width = Math.round((width * maxHeight) / height);
            height = maxHeight;
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        if (!ctx) {
          // Fallback if canvas context fails
          resolve(readerEvent.target?.result as string || '');
          return;
        }

        // Draw and compress to JPEG with specified quality
        ctx.drawImage(img, 0, 0, width, height);
        try {
          const compressedDataUrl = canvas.toDataURL('image/jpeg', quality);
          resolve(compressedDataUrl);
        } catch (e) {
          resolve(readerEvent.target?.result as string || '');
        }
      };

      img.onerror = () => {
        resolve(readerEvent.target?.result as string || '');
      };

      img.src = readerEvent.target?.result as string;
    };

    reader.onerror = () => {
      resolve('');
    };

    reader.readAsDataURL(file);
  });
};
