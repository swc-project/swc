// Loaded from https://deno.land/x/segno@v1.1.0/lib/validations/isHash.ts


// @ts-ignore allowing typedoc to build
import { assertString } from '../helpers/assertString.ts';

type Algorithm =
  | 'md5'
  | 'md4'
  | 'sha1'
  | 'sha256'
  | 'sha384'
  | 'sha512'
  | 'ripemd128'
  | 'ripemd160'
  | 'tiger128'
  | 'tiger160'
  | 'tiger192'
  | 'crc32'
  | 'crc32b';

/**
 * @ignore
 */
const lengths = {
  md5: 32,
  md4: 32,
  sha1: 40,
  sha256: 64,
  sha384: 96,
  sha512: 128,
  ripemd128: 32,
  ripemd160: 40,
  tiger128: 32,
  tiger160: 40,
  tiger192: 48,
  crc32: 8,
  crc32b: 8,
};

export const isHash = (str: string, algorithm: Algorithm) => {
  assertString(str);
  const hash = new RegExp(`^[a-fA-F0-9]{${lengths[algorithm]}}$`);
  return hash.test(str);
};
