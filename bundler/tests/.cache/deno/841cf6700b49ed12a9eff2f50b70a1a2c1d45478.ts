// Loaded from https://deno.land/x/segno@v1.1.0/lib/helpers/assertString.ts


export const assertString = (input: string) => {
  const isString = typeof input === 'string';

  if (!isString) {
    throw new TypeError(`Expected a string but received ${typeof input}.`);
  }
};
