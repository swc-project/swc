// Loaded from https://deno.land/x/segno@v1.1.0/lib/validations/isDataURI.ts


// @ts-ignore allowing typedoc to build
import { assertString } from '../helpers/assertString.ts';

/**
 * @ignore
 */
const validMediaType = /^[a-z]+\/[a-z0-9\-\+]+$/i;

/**
 * @ignore
 */
const validAttribute = /^[a-z\-]+=[a-z0-9\-]+$/i;

/**
 * @ignore
 */
const validData = /^[a-z0-9!\$&'\(\)\*\+,;=\-\._~:@\/\?%\s]*$/i;

export const isDataURI = (str: string) => {
  assertString(str);

  let data = str.split(',');

  if (data.length < 2) {
    return false;
  }

  const attributes = (data.shift() as string).trim().split(';');
  const schemeAndMediaType = attributes.shift() as string;

  if (schemeAndMediaType.substr(0, 5) !== 'data:') {
    return false;
  }

  const mediaType = schemeAndMediaType.substr(5);

  if (mediaType !== '' && !validMediaType.test(mediaType)) {
    return false;
  }

  for (let i = 0; i < attributes.length; i++) {
    if (
      i === attributes.length - 1 &&
      attributes[i].toLowerCase() === 'base64'
    ) {
      // ok
    } else if (!validAttribute.test(attributes[i])) {
      return false;
    }
  }

  for (let i = 0; i < data.length; i++) {
    if (!validData.test(data[i])) {
      return false;
    }
  }

  return true;
};
