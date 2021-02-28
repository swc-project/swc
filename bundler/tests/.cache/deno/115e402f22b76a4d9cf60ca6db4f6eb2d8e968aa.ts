// Loaded from https://deno.land/x/deno_image@v0.0.3/lib/decoders/fast-png/PNGEncoder.ts


import { IOBuffer } from './iobuffer/IOBuffer.ts';
import { deflate } from './pako/index.js';

import { pngSignature, crc } from './common.ts';
import {
  DeflateFunctionOptions,
  IPNGEncoderOptions,
  IImageData,
  IDecodedPNG,
  PNGDataArray,
  BitDepth,
} from './types.ts';
import {
  ColorType,
  CompressionMethod,
  FilterMethod,
  InterlaceMethod,
} from './internalTypes.ts';

const defaultZlibOptions: DeflateFunctionOptions = {
  level: 3,
};

export default class PNGEncoder extends IOBuffer {
  private _png: IDecodedPNG;
  private _zlibOptions: DeflateFunctionOptions;
  private _colorType: ColorType;

  public constructor(data: IImageData, options: IPNGEncoderOptions = {}) {
    super();
    this._colorType = ColorType.UNKNOWN;
    this._zlibOptions = Object.assign({}, defaultZlibOptions, options.zlib);
    this._png = this._checkData(data);
    this.setBigEndian();
  }

  public encode(): Uint8Array {
    this.encodeSignature();
    this.encodeIHDR();
    this.encodeData();
    this.encodeIEND();
    return this.toArray();
  }

  // https://www.w3.org/TR/PNG/#5PNG-file-signature
  private encodeSignature(): void {
    this.writeBytes(pngSignature);
  }

  // https://www.w3.org/TR/PNG/#11IHDR
  private encodeIHDR(): void {
    this.writeUint32(13);

    this.writeChars('IHDR');

    this.writeUint32(this._png.width);
    this.writeUint32(this._png.height);
    this.writeByte(this._png.depth);
    this.writeByte(this._colorType);
    this.writeByte(CompressionMethod.DEFLATE);
    this.writeByte(FilterMethod.ADAPTIVE);
    this.writeByte(InterlaceMethod.NO_INTERLACE);

    this.writeCrc(17);
  }

  // https://www.w3.org/TR/PNG/#11IEND
  private encodeIEND(): void {
    this.writeUint32(0);

    this.writeChars('IEND');

    this.writeCrc(4);
  }

  // https://www.w3.org/TR/PNG/#11IDAT
  private encodeIDAT(data: PNGDataArray): void {
    this.writeUint32(data.length);

    this.writeChars('IDAT');

    this.writeBytes(data);

    this.writeCrc(data.length + 4);
  }

  private encodeData(): void {
    const { width, height, channels, depth, data } = this._png;
    const slotsPerLine = channels * width;
    const newData = new IOBuffer().setBigEndian();
    let offset = 0;
    for (let i = 0; i < height; i++) {
      newData.writeByte(0); // no filter
      /* istanbul ignore else */
      if (depth === 8) {
        offset = writeDataBytes(data, newData, slotsPerLine, offset);
      } else if (depth === 16) {
        offset = writeDataUint16(data, newData, slotsPerLine, offset);
      } else {
        throw new Error('unreachable');
      }
    }
    const buffer = newData.toArray();
    const compressed = <Uint8Array>deflate(buffer, this._zlibOptions);
    this.encodeIDAT(compressed);
  }

  private _checkData(data: IImageData): IDecodedPNG {
    const { colorType, channels, depth } = getColorType(data);
    const png: IDecodedPNG = {
      width: checkInteger(data.width, 'width'),
      height: checkInteger(data.height, 'height'),
      channels: channels,
      data: data.data,
      depth: depth,
      text: {},
    };
    this._colorType = colorType;
    const expectedSize = png.width * png.height * channels;
    if (png.data.length !== expectedSize) {
      throw new RangeError(
        `wrong data size. Found ${png.data.length}, expected ${expectedSize}`,
      );
    }
    return png;
  }

  private writeCrc(length: number): void {
    this.writeUint32(
      crc(
        new Uint8Array(
          this.buffer,
          this.byteOffset + this.offset - length,
          length,
        ),
        length,
      ),
    );
  }
}

function checkInteger(value: number, name: string): number {
  if (Number.isInteger(value) && value > 0) {
    return value;
  }
  throw new TypeError(`${name} must be a positive integer`);
}

function getColorType(
  data: IImageData,
): { channels: number; depth: BitDepth; colorType: ColorType } {
  const { channels = 4, depth = 8 } = data;
  if (channels !== 4 && channels !== 3 && channels !== 2 && channels !== 1) {
    throw new RangeError(`unsupported number of channels: ${channels}`);
  }
  if (depth !== 8 && depth !== 16) {
    throw new RangeError(`unsupported bit depth: ${depth}`);
  }

  const returnValue = { channels, depth, colorType: ColorType.UNKNOWN };
  switch (channels) {
    case 4:
      returnValue.colorType = ColorType.TRUECOLOUR_ALPHA;
      break;
    case 3:
      returnValue.colorType = ColorType.TRUECOLOUR;
      break;
    case 1:
      returnValue.colorType = ColorType.GREYSCALE;
      break;
    case 2:
      returnValue.colorType = ColorType.GREYSCALE_ALPHA;
      break;
    default:
      throw new Error(`unsupported number of channels: ${channels}`);
  }
  return returnValue;
}

function writeDataBytes(
  data: PNGDataArray,
  newData: IOBuffer,
  slotsPerLine: number,
  offset: number,
): number {
  for (let j = 0; j < slotsPerLine; j++) {
    newData.writeByte(data[offset++]);
  }
  return offset;
}

function writeDataUint16(
  data: PNGDataArray,
  newData: IOBuffer,
  slotsPerLine: number,
  offset: number,
): number {
  for (let j = 0; j < slotsPerLine; j++) {
    newData.writeUint16(data[offset++]);
  }
  return offset;
}
