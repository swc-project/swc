// Loaded from https://deno.land/x/deno_image@v0.0.3/lib/decoders/fast-png/index.ts


import PNGDecoder from './PNGDecoder.ts';
import PNGEncoder from './PNGEncoder.ts';
import {
  DecoderInputType,
  IPNGDecoderOptions,
  IDecodedPNG,
  IImageData,
  IPNGEncoderOptions,
} from './types.ts';

export * from './types.ts';

function decodePNG(
  data: DecoderInputType,
  options?: IPNGDecoderOptions,
): IDecodedPNG {
  const decoder = new PNGDecoder(data, options);
  return decoder.decode();
}

function encodePNG(png: IImageData, options?: IPNGEncoderOptions): Uint8Array {
  const encoder = new PNGEncoder(png, options);
  return encoder.encode();
}

export { decodePNG as decode, encodePNG as encode };
