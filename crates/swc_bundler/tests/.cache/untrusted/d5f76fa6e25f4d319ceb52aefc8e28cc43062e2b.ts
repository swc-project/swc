// Loaded from https://raw.githubusercontent.com/denjucks/dex/master/lib/logger.js


/* eslint no-console:0 */

import * as colors from "./deps/colors/colors.ts";
import { inspect } from './deps/@jspm/core@1.1.0/nodelibs/util.js';
import _ from './deps/lodash@4.17.15/index.js';
const isFunction = _.isFunction;
const isString = _.isString;

class Logger {
  constructor(config) {
    const {
      log: {
        debug,
        warn,
        error,
        deprecate,
        inspectionDepth,
        enableColors,
      } = {},
    } = config;
    this._inspectionDepth = inspectionDepth || 5;
    this._enableColors = resolveIsEnabledColors(enableColors);
    this._debug = debug;
    this._warn = warn;
    this._error = error;
    this._deprecate = deprecate;
  }

  _log(message, userFn, colorFn) {
    if (userFn != null && !isFunction(userFn)) {
      throw new TypeError('Extensions to knex logger must be functions!');
    }

    if (isFunction(userFn)) {
      userFn(message);
      return;
    }

    if (!isString(message)) {
      message = inspect(message, {
        depth: this._inspectionDepth,
        colors: this._enableColors,
      });
    }

    console.log(colorFn ? colorFn(message) : message);
  }

  debug(message) {
    this._log(message, this._debug);
  }

  warn(message) {
    this._log(message, this._warn, colors.yellow);
  }

  error(message) {
    this._log(message, this._error, colors.red);
  }

  deprecate(method, alternative) {
    const message = `${method} is deprecated, please use ${alternative}`;

    this._log(message, this._deprecate, colors.yellow);
  }
}

function resolveIsEnabledColors(enableColorsParam) {
  if (enableColorsParam != null) {
    return enableColorsParam;
  }
/*
  if (process && process.stdout) {
    return process.stdout.isTTY;
  }
*/
  return false;
}

export default Logger;
