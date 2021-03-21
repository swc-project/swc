// Loaded from https://raw.githubusercontent.com/denjucks/dex/master/lib/dialects/oracle/formatter.js


import Formatter from '../../formatter.js';
import { ReturningHelper } from './utils.js';

class Oracle_Formatter extends Formatter {
  alias(first, second) {
    return first + ' ' + second;
  }

  parameter(value, notSetValue) {
    // Returning helper uses always ROWID as string
    if (value instanceof ReturningHelper && this.client.driver) {
      value = new this.client.driver.OutParam(this.client.driver.OCCISTRING);
    } else if (typeof value === 'boolean') {
      value = value ? 1 : 0;
    }
    return super.parameter(value, notSetValue);
  }
}

export default Oracle_Formatter;
