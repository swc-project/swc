// Loaded from https://deno.land/x/deno_image@v0.0.3/lib/decoders/fast-png/types.ts


import { IOBuffer } from './iobuffer/IOBuffer.ts';


declare enum StrategyValues {
  Z_FILTERED = 1,
  Z_HUFFMAN_ONLY = 2,
  Z_RLE = 3,
  Z_FIXED = 4,
  Z_DEFAULT_STRATEGY = 0,
}

export interface DeflateFunctionOptions {
  level?: -1 | 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;
  windowBits?: number;
  memLevel?: number;
  strategy?: StrategyValues;
  dictionary?: any;
  raw?: boolean;
  to?: "string";
}

export type PNGDataArray = Uint8Array | Uint16Array;

export type DecoderInputType = IOBuffer | ArrayBufferLike | ArrayBufferView;

export type BitDepth = 1 | 2 | 4 | 8 | 16;

export interface IPNGResolution {
  /**
   * Pixels per unit, X axis
   */
  x: number;
  /**
   * Pixels per unit, Y axis
   */
  y: number;
  /**
   * Unit specifier
   */
  unit: ResolutionUnitSpecifier;
}

export enum ResolutionUnitSpecifier {
  /**
   * Unit is unknown
   */
  UNKNOWN = 0,
  /**
   * Unit is the metre
   */
  METRE = 1,
}

export interface IImageData {
  width: number;
  height: number;
  data: PNGDataArray;
  depth?: BitDepth;
  channels?: number;
}

export interface IDecodedPNG {
  width: number;
  height: number;
  data: PNGDataArray;
  depth: BitDepth;
  channels: number;
  text: { [key: string]: string };
  resolution?: IPNGResolution;
  palette?: IndexedColors;
}

export interface IPNGDecoderOptions {
  checkCrc?: boolean;
}

export interface IPNGEncoderOptions {
  zlib?: DeflateFunctionOptions;
}

export type IndexedColors = number[][];

export interface IInflator {
  result: Uint8Array | Array<any> | string;
  err: number;
  msg: string;
  push: Function;
  onData: Function;
  onEnd: Function;
}
