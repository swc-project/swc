// Loaded from https://raw.githubusercontent.com/denjucks/dex/master/lib/dialects/sqlite3/formatter.js


import Formatter from '../../formatter.js';
import Raw from '../../raw.js';

export default class SQlite3_Formatter extends Formatter {
  values(values) {
    if (Array.isArray(values)) {
      if (Array.isArray(values[0])) {
        return `( values ${values
          .map((value) => `(${this.parameterize(value)})`)
          .join(', ')})`;
      }
      return `(${this.parameterize(values)})`;
    }

    if (values instanceof Raw) {
      return `(${this.parameter(values)})`;
    }

    return this.parameter(values);
  }
};
