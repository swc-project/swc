// Loaded from https://deno.land/x/segno@v1.1.0/lib/validations/isDecimal.ts


// @ts-ignore allowing typedoc to build
import { decimal } from '../helpers/alpha.ts';
// @ts-ignore allowing typedoc to build
import { assertString } from '../helpers/assertString.ts';
// @ts-ignore allowing typedoc to build
import { includes } from '../helpers/includes.ts';

type DecimalOptions = {
  forceDecimal?: boolean;
  decimalDigits?: string;
  locale?: string;
};

/**
 * @ignore
 */
const decimalRegExp = (options: Required<DecimalOptions>) => {
  const regExp = new RegExp(
    `^[-+]?([0-9]+)?(\\${(decimal as any)[options.locale]}[0-9]{${
      options.decimalDigits
    }})${options.forceDecimal ? '' : '?'}$`
  );
  return regExp;
};

/**
 * @ignore
 */
const defaultDecimalOptions = {
  forceDecimal: false,
  decimalDigits: '1,',
  locale: 'en-US',
};

/**
 * @ignore
 */
const blacklist = ['', '-', '+'];

export const isDecimal = (str: string, options?: DecimalOptions) => {
  assertString(str);

  options = {
    ...defaultDecimalOptions,
    ...options,
  };

  if ((options as Required<DecimalOptions>).locale in decimal) {
    return (
      !includes(blacklist, str.replace(/ /g, '')) &&
      decimalRegExp(options as Required<DecimalOptions>).test(str)
    );
  }
  throw new Error(`Invalid locale '${options.locale}'`);
};
