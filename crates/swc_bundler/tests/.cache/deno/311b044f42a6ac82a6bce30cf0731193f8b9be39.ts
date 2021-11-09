// Loaded from https://deno.land/x/deno_image@v0.0.3/index.ts


import { Resize } from './lib/resize/resize.js';
import { encodeJPG, decodeJPG, Image as ImageJPG } from "./deps.ts";
import { encode as encodePNG, decode as decodePNG } from './lib/decoders/fast-png/index.ts';
import { IImageData as ImagePNG } from './lib/decoders/fast-png/types.ts';
import { mimeType } from './mime-type.ts';
import type { ResizeOptions, DimensionsOptions } from './types.ts';


/**
 * Resize image. JPG and PNG formats are supported.
 * @param {Uint8Array} imgFile - image file 
 * @param {ResizeOptions} options - options for resize
 */
export function resize(imgFile: Uint8Array, options: ResizeOptions): Promise<Uint8Array> {
  return new Promise((resolve, reject) => {
    const mime = mimeType(imgFile);

    if(mime === 'image/jpeg') {
      resizeJPG(imgFile, options)
        .then(img => resolve(img))
        .catch(error => reject(error));
    } else if (mime === 'image/png') {
      resizePNG(imgFile, options)
        .then(img => resolve(img))
        .catch(error => reject(error));
    } else {
      reject('Unknown format.');
    }
  });
}

/**
 * Resize JPG file.
 * @param imgFile - Image file
 * @param options - options for resize
 */
function resizeJPG(imgFile: Uint8Array, {width, height, aspectRatio = true}: ResizeOptions): Promise<Uint8Array> {
  return new Promise((resolve, reject) => {
    try {
      const decoded: ImageJPG = decodeJPG(imgFile);

      const { targetWidth, targetHeight } = getDimensions({
        originalWidth: decoded.width,
        originalHeight: decoded.height,
        width,
        height,
        aspectRatio
      });

      const resized = new Resize(decoded.width, decoded.height, targetWidth, targetHeight, true, true, false, async (buffer: Uint8Array) => {
        const image: any = {
          width: targetWidth,
          height: targetHeight,
          data: buffer
        };
      
        try {
          const raw = encodeJPG(image, 100); //Quality 100 (default is 50)
          resolve(raw.data);
        } catch(error) {
          reject(error);
        }
      });
      
      resized.resize(decoded.data);
    } catch (error) {
      reject(error);
    }
  });
}


/**
 * Resize PNG file.
 * @param imgFile - Image file
 * @param options - options for resize
 */
function resizePNG(imgFile: Uint8Array, {width, height, aspectRatio = true}: ResizeOptions): Promise<Uint8Array> {
  return new Promise((resolve, reject) => {
    try {
      const decoded: ImagePNG = decodePNG(imgFile);

      const { targetWidth, targetHeight } = getDimensions({
        originalWidth: decoded.width,
        originalHeight: decoded.height,
        width,
        height,
        aspectRatio
      });

      const resized = new Resize(decoded.width, decoded.height, targetWidth, targetHeight, false, true, false, async (buffer: Uint8Array) => {
        const image: ImagePNG = {
          width: targetWidth,
          height: targetHeight,
          data: buffer,
          depth: decoded.depth,
          channels: decoded.channels
        };
      
        try {
          const raw = encodePNG(image); //Quality 100 (default is 50)
          resolve(raw);
        } catch(error) {
          reject(error);
        }
      });
      
      resized.resize(decoded.data);
    } catch (error) {
      reject(error);
    }
  });
}

/**
 * Get dimensions for resizing an image
 * @param options - options for resize
 * - for landscape, width has priority
 * - for portrait, height has priority
 */
function getDimensions(options: DimensionsOptions): {targetWidth: number, targetHeight: number} {
  const { 
    originalWidth, 
    originalHeight, 
    width, 
    height, 
    aspectRatio = true 
  } = options || {};

  // Don't keep aspect ratio
  if(!aspectRatio) {
    return { 
      targetWidth: width || originalWidth, 
      targetHeight: height || originalHeight 
    };
  }

  // Keep aspect ratio
  const _aspectRatio = originalWidth / originalHeight;
  let targetWidth;
  let targetHeight;
  
  if(_aspectRatio > 1) { // landscape
    if(width) {
      targetWidth = width;
      targetHeight = Math.trunc(width / _aspectRatio);
    } else if(!width && height){
      targetWidth = Math.trunc(height * _aspectRatio);
      targetHeight = height;
    } else {
      targetWidth = 100;
      targetHeight = Math.trunc(100 / _aspectRatio);
    }
  } else { //portrait
    if(height) {
      targetWidth = Math.trunc(height * _aspectRatio);
      targetHeight = height;
    } else if(width && !height){
      targetWidth = width;
      targetHeight = Math.trunc(width / _aspectRatio);
    } else {
      targetWidth = Math.trunc(100 * _aspectRatio);
      targetHeight = 100;
    }
  }

  return { targetWidth, targetHeight };
}