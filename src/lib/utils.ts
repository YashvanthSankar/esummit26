// File size limits
export const FILE_SIZE_LIMITS = {
    MAX_IMAGE_SIZE: 500 * 1024, // 500KB max for images (before compression)
    MAX_PDF_SIZE: 500 * 1024, // 500KB max for PDFs
    TARGET_SIZE: 100 * 1024, // Target < 100KB after compression for images
    WARN_SIZE: 150 * 1024, // Warn if compressed result > 150KB
};

// Validate file before upload
export const validateFile = (file: File, options?: { 
    maxSize?: number; 
    allowedTypes?: string[];
}): { valid: boolean; error?: string; warning?: string } => {
    const allowedTypes = options?.allowedTypes || ['image/jpeg', 'image/png', 'image/webp', 'application/pdf'];
    
    // Different size limits for images vs PDFs
    const isPdf = file.type === 'application/pdf';
    const maxSize = options?.maxSize || (isPdf ? FILE_SIZE_LIMITS.MAX_PDF_SIZE : FILE_SIZE_LIMITS.MAX_IMAGE_SIZE);

    if (!allowedTypes.includes(file.type)) {
        return { 
            valid: false, 
            error: `Invalid file type. Allowed: ${allowedTypes.map(t => t.split('/')[1]).join(', ')}` 
        };
    }

    if (file.size > maxSize) {
        const sizeInKB = Math.round(maxSize / 1024);
        return { 
            valid: false, 
            error: isPdf 
                ? `PDF too large (${Math.round(file.size/1024)}KB). Maximum: ${sizeInKB}KB` 
                : `Image too large (${Math.round(file.size/1024)}KB). Maximum: ${sizeInKB}KB`
        };
    }

    return { valid: true };
};

// Smart compress - aggressively compresses to < 100KB target
export const compressImage = async (file: File, options?: {
    maxWidth?: number;
    maxHeight?: number;
    quality?: number;
    targetSize?: number;
}): Promise<File> => {
    // Skip compression for non-images (PDFs, etc.)
    if (!file.type.startsWith('image/')) {
        return file;
    }

    // Slightly larger dimensions for better quality, compression will handle size
    const maxWidth = options?.maxWidth || 1200;
    const maxHeight = options?.maxHeight || 1200;
    const targetSize = options?.targetSize || FILE_SIZE_LIMITS.TARGET_SIZE; // 100KB
    
    // Start with quality based on input size (500KB max input)
    let quality = options?.quality || 0.6;
    if (file.size > 400 * 1024) quality = 0.4; // 400KB+ = 40% quality
    else if (file.size > 300 * 1024) quality = 0.5; // 300KB+ = 50% quality
    else if (file.size > 200 * 1024) quality = 0.55; // 200KB+ = 55% quality

    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = (event) => {
            const img = new Image();
            img.src = event.target?.result as string;
            img.onload = async () => {
                const canvas = document.createElement('canvas');
                let width = img.width;
                let height = img.height;

                // Resize if needed
                if (width > height) {
                    if (width > maxWidth) {
                        height *= maxWidth / width;
                        width = maxWidth;
                    }
                } else {
                    if (height > maxHeight) {
                        width *= maxHeight / height;
                        height = maxHeight;
                    }
                }

                canvas.width = width;
                canvas.height = height;
                const ctx = canvas.getContext('2d');
                ctx?.drawImage(img, 0, 0, width, height);

                // Try compression with decreasing quality until target size (< 100KB)
                const tryCompress = (currentQuality: number): Promise<File> => {
                    return new Promise((res, rej) => {
                        canvas.toBlob((blob) => {
                            if (!blob) {
                                rej(new Error('Canvas to Blob failed'));
                                return;
                            }
                            
                            const compressedFile = new File([blob], file.name.replace(/\.[^.]+$/, '.jpg'), {
                                type: 'image/jpeg',
                                lastModified: Date.now(),
                            });

                            // If still too large and quality > 0.1, try again with lower quality
                            if (compressedFile.size > targetSize && currentQuality > 0.1) {
                                res(tryCompress(currentQuality - 0.05));
                            } else {
                                // Warn if compressed result is still > 150KB
                                if (compressedFile.size > FILE_SIZE_LIMITS.WARN_SIZE) {
                                    console.warn(`[Compress] Warning: ${file.name} is ${(compressedFile.size/1024).toFixed(0)}KB (target: <100KB)`);
                                }
                                res(compressedFile);
                            }
                        }, 'image/jpeg', currentQuality);
                    });
                };

                try {
                    const result = await tryCompress(quality);
                    const reduction = Math.round((1 - result.size/file.size) * 100);
                    const resultKB = (result.size/1024).toFixed(0);
                    const status = result.size <= FILE_SIZE_LIMITS.TARGET_SIZE ? '✅' : 
                                   result.size <= FILE_SIZE_LIMITS.WARN_SIZE ? '⚠️' : '❌';
                    console.log(`[Compress] ${status} ${file.name}: ${(file.size/1024).toFixed(0)}KB → ${resultKB}KB (${reduction}% reduction)`);
                    resolve(result);
                } catch (error) {
                    reject(error);
                }
            };
            img.onerror = (error) => reject(error);
        };
        reader.onerror = (error) => reject(error);
    });
};

// Compress and validate in one step
export const prepareFileForUpload = async (file: File, options?: {
    maxSize?: number;
    allowedTypes?: string[];
    compress?: boolean;
}): Promise<{ file: File; error?: string }> => {
    // Validate first
    const validation = validateFile(file, {
        maxSize: options?.maxSize,
        allowedTypes: options?.allowedTypes,
    });

    if (!validation.valid) {
        return { file, error: validation.error };
    }

    // Compress if it's an image and compression is not disabled
    if (options?.compress !== false && file.type.startsWith('image/')) {
        try {
            const compressed = await compressImage(file);
            return { file: compressed };
        } catch (error) {
            console.error('[Compress] Failed, using original:', error);
            return { file };
        }
    }

    return { file };
};
