// Loaded from https://deno.land/x/segno@v1.1.0/lib/validations/isDate.ts


/**
 * @ignore
 */
const isValidFormat = (format: string) => {
  return /(^(y{4}|y{2})[\/-](m{1,2})[\/-](d{1,2})$)|(^(m{1,2})[\/-](d{1,2})[\/-]((y{4}|y{2})$))|(^(d{1,2})[\/-](m{1,2})[\/-]((y{4}|y{2})$))/gi.test(
    format
  );
};

/**
 * @ignore
 */
const zip = (date: string[], format: string[]) => {
  const zippedArr = [];
  const len = Math.min(date.length, format.length);

  for (let i = 0; i < len; i++) {
    zippedArr.push([date[i], format[i]]);
  }

  return zippedArr;
};

export const isDate = (input: any, format = 'YYYY/MM/DD') => {
  if (typeof input === 'string' && isValidFormat(format)) {
    const splitter = /[-/]/;
    const dateAndFormat = zip(
      input.split(splitter),
      format.toLowerCase().split(splitter)
    );
    const dateObj = {} as any;

    for (const [dateWord, formatWord] of dateAndFormat) {
      if (dateWord.length !== formatWord.length) {
        return false;
      }

      dateObj[formatWord.charAt(0)] = dateWord;
    }

    return (
      new Date(`${dateObj.m}/${dateObj.d}/${dateObj.y}`).getDate() ===
      +dateObj.d
    );
  }

  return (
    Object.prototype.toString.call(input) === '[object Date]' && isFinite(input)
  );
};
