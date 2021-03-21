// Loaded from https://deno.land/x/segno@v1.1.0/lib/validations/isCurrency.ts


// @ts-ignore allowing typedoc to build
import { assertString } from '../helpers/assertString.ts';

type CurrencyOptions = {
  symbol?: string;
  requireSymbol?: boolean;
  allowSpaceAfterSymbol?: boolean;
  symbolAfterDigits?: boolean;
  allowNegatives?: boolean;
  parensForNegatives?: boolean;
  negativeSignBeforeDigits?: boolean;
  negativeSignAfterDigits?: boolean;
  allowNegativeSignPlaceholder?: boolean;
  thousandsSeparator?: string;
  decimalSeparator?: string;
  allowDecimal?: boolean;
  requireDecimal?: boolean;
  digitsAfterDecimal?: number[];
  allowSpaceAfterDigits?: boolean;
};

/**
 * @ignore
 */
const currencyRegex = (options: Required<CurrencyOptions>) => {
  let decimalDigits = `\\d{${options.digitsAfterDecimal[0]}}`;
  options.digitsAfterDecimal.forEach((digit, index) => {
    if (index !== 0) decimalDigits = `${decimalDigits}|\\d{${digit}}`;
  });

  const symbol = `(${options.symbol.replace(/\W/, (m) => `\\${m}`)})${
      options.requireSymbol ? '' : '?'
    }`,
    negative = '-?',
    whole_dollar_amount_without_sep = '[1-9]\\d*',
    whole_dollar_amount_with_sep = `[1-9]\\d{0,2}(\\${options.thousandsSeparator}\\d{3})*`,
    valid_whole_dollar_amounts = [
      '0',
      whole_dollar_amount_without_sep,
      whole_dollar_amount_with_sep,
    ],
    whole_dollar_amount = `(${valid_whole_dollar_amounts.join('|')})?`,
    decimal_amount = `(\\${options.decimalSeparator}(${decimalDigits}))${
      options.requireDecimal ? '' : '?'
    }`;

  let pattern =
    whole_dollar_amount +
    (options.allowDecimal || options.requireDecimal ? decimal_amount : '');

  // default is negative sign before symbol, but there are two other options (besides parens)
  if (options.allowNegatives && !options.parensForNegatives) {
    if (options.negativeSignAfterDigits) {
      pattern += negative;
    } else if (options.negativeSignBeforeDigits) {
      pattern = negative + pattern;
    }
  }

  // South African Rand, for example, uses R 123 (space) and R-123 (no space)
  if (options.allowNegativeSignPlaceholder) {
    pattern = `( (?!\\-))?${pattern}`;
  } else if (options.allowSpaceAfterSymbol) {
    pattern = ` ?${pattern}`;
  } else if (options.allowSpaceAfterDigits) {
    pattern += '( (?!$))?';
  }

  if (options.symbolAfterDigits) {
    pattern += symbol;
  } else {
    pattern = symbol + pattern;
  }

  if (options.allowNegatives) {
    if (options.parensForNegatives) {
      pattern = `(\\(${pattern}\\)|${pattern})`;
    } else if (
      !(options.negativeSignBeforeDigits || options.negativeSignAfterDigits)
    ) {
      pattern = negative + pattern;
    }
  }

  // ensure there's a dollar and/or decimal amount, and that
  // it doesn't start with a space or a negative sign followed by a space
  return new RegExp(`^(?!-? )(?=.*\\d)${pattern}$`);
};

/**
 * @ignore
 */
const defaultCurrencyOptions: CurrencyOptions = {
  symbol: '$',
  requireSymbol: false,
  allowSpaceAfterSymbol: false,
  symbolAfterDigits: false,
  allowNegatives: true,
  parensForNegatives: false,
  negativeSignBeforeDigits: false,
  negativeSignAfterDigits: false,
  allowNegativeSignPlaceholder: false,
  thousandsSeparator: ',',
  decimalSeparator: '.',
  allowDecimal: true,
  requireDecimal: false,
  digitsAfterDecimal: [2],
  allowSpaceAfterDigits: false,
};

export const isCurrency = (str: string, options?: CurrencyOptions) => {
  assertString(str);

  options = {
    ...defaultCurrencyOptions,
    ...options,
  };

  return currencyRegex(options as Required<CurrencyOptions>).test(str);
};
