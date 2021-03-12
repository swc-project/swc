// Loaded from https://dev.jspm.io/npm:pako@1.0.11/index.dew.js


import { dew as _commonDewDew } from "./lib/utils/common.dew.js";
import { dew as _deflateDewDew } from "./lib/deflate.dew.js";
import { dew as _inflateDewDew } from "./lib/inflate.dew.js";
import { dew as _constantsDewDew } from "./lib/zlib/constants.dew.js";
var exports = {},
    _dewExec = false;
export function dew() {
  if (_dewExec) return exports;
  _dewExec = true;

  var assign = _commonDewDew().assign;

  var deflate = _deflateDewDew();

  var inflate = _inflateDewDew();

  var constants = _constantsDewDew();

  var pako = {};
  assign(pako, deflate, inflate, constants);
  exports = pako;
  return exports;
}