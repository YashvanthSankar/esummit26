// File size limits
export const FILE_SIZE_LIMITS = {
    MAX_IMAGE_SIZE: 200 * 1024, // 200KB max for images (before compression)
    MAX_PDF_SIZE: 500 * 1024, // 500KB max for PDFs
    TARGET_SIZE: 50 * 1024, // Target < 50KB after compression for images
    WARN_SIZE: 100 * 1024, // Warn if compressed result > 100KB
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

// Smart compress - aggressively compresses to < 50KB target
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

    // Smaller dimensions for aggressive compression to < 50KB
    const maxWidth = options?.maxWidth || 800;
    const maxHeight = options?.maxHeight || 800;
    const targetSize = options?.targetSize || FILE_SIZE_LIMITS.TARGET_SIZE; // 50KB
    
    // Start with aggressive quality since max input is 200KB
    let quality = options?.quality || 0.5;
    if (file.size > 150 * 1024) quality = 0.4; // 150KB+ = 40% quality
    else if (file.size > 100 * 1024) quality = 0.45; // 100KB+ = 45% quality

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

                // Try compression with decreasing quality until target size (< 50KB)
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

                            // If still too large and quality > 0.15, try again with lower quality
                            if (compressedFile.size > targetSize && currentQuality > 0.15) {
                                res(tryCompress(currentQuality - 0.05));
                            } else {
                                // Warn if compressed result is still > 100KB
                                if (compressedFile.size > FILE_SIZE_LIMITS.WARN_SIZE) {
                                    console.warn(`[Compress] Warning: ${file.name} is ${(compressedFile.size/1024).toFixed(0)}KB (target: <50KB)`);
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
