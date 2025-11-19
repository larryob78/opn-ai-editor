/**
 * Face blur utility using canvas-based blur
 * For production, integrate with TensorFlow.js BlazeFace model
 */

export interface FaceBox {
  x: number;
  y: number;
  width: number;
  height: number;
}

/**
 * Detect faces in an image using BlazeFace (TensorFlow.js)
 * This is a placeholder - implement full detection in component
 */
export async function detectFaces(imageElement: HTMLImageElement): Promise<FaceBox[]> {
  // Placeholder implementation
  // In production, use @tensorflow-models/blazeface
  return [];
}

/**
 * Apply blur to specific regions of a canvas
 */
export function blurRegion(
  canvas: HTMLCanvasElement,
  ctx: CanvasRenderingContext2D,
  box: FaceBox,
  blurAmount: number = 20
): void {
  const { x, y, width, height } = box;

  // Get image data for the region
  const imageData = ctx.getImageData(x, y, width, height);
  const blurredData = applyGaussianBlur(imageData, blurAmount);

  // Put blurred data back
  ctx.putImageData(blurredData, x, y);
}

/**
 * Apply Gaussian blur to image data
 */
function applyGaussianBlur(
  imageData: ImageData,
  radius: number
): ImageData {
  const { data, width, height } = imageData;
  const output = new ImageData(width, height);

  // Simple box blur approximation of Gaussian blur
  const kernelSize = Math.ceil(radius) * 2 + 1;
  const half = Math.floor(kernelSize / 2);

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      let r = 0, g = 0, b = 0, a = 0, count = 0;

      for (let ky = -half; ky <= half; ky++) {
        for (let kx = -half; kx <= half; kx++) {
          const px = x + kx;
          const py = y + ky;

          if (px >= 0 && px < width && py >= 0 && py < height) {
            const idx = (py * width + px) * 4;
            r += data[idx];
            g += data[idx + 1];
            b += data[idx + 2];
            a += data[idx + 3];
            count++;
          }
        }
      }

      const idx = (y * width + x) * 4;
      output.data[idx] = r / count;
      output.data[idx + 1] = g / count;
      output.data[idx + 2] = b / count;
      output.data[idx + 3] = a / count;
    }
  }

  return output;
}

/**
 * Convert canvas to blob for upload
 */
export function canvasToBlob(
  canvas: HTMLCanvasElement,
  mimeType: string = 'image/jpeg',
  quality: number = 0.9
): Promise<Blob> {
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (blob) {
          resolve(blob);
        } else {
          reject(new Error('Failed to convert canvas to blob'));
        }
      },
      mimeType,
      quality
    );
  });
}

/**
 * Load image from file
 */
export function loadImageFromFile(file: File): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      const img = new Image();

      img.onload = () => resolve(img);
      img.onerror = () => reject(new Error('Failed to load image'));

      img.src = e.target?.result as string;
    };

    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsDataURL(file);
  });
}
