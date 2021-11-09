// Loaded from https://deno.land/x/deno_image@v0.0.3/lib/decoders/fast-png/internalTypes.ts


export enum ColorType {
  UNKNOWN = -1,
  GREYSCALE = 0,
  TRUECOLOUR = 2,
  INDEXED_COLOUR = 3,
  GREYSCALE_ALPHA = 4,
  TRUECOLOUR_ALPHA = 6,
}

export enum CompressionMethod {
  UNKNOWN = -1,
  DEFLATE = 0,
}

export enum FilterMethod {
  UNKNOWN = -1,
  ADAPTIVE = 0,
}

export enum InterlaceMethod {
  UNKNOWN = -1,
  NO_INTERLACE = 0,
  ADAM7 = 1,
}
