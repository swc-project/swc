// Loaded from https://deno.land/x/discordeno@11.0.0-rc.2/src/util/validate_length.ts


/** Validates the length of a string in JS. Certain characters in JS can have multiple numbers in length in unicode and discords api is in python which treats length differently. */
export function validateLength(text: string, options: { max?: number; min?: number }) {
  const length = [...text].length;

  // Text is too long
  if (options.max && length > options.max) return false;
  // Text is too short
  if (options.min && length < options.min) return false;

  return true;
}
