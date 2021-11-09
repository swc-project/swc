// Loaded from https://dev.jspm.io/npm:jszip@3.5.0/lib/index.dew.js


import { dew as _objectDewDew } from "./object.dew.js";
import { dew as _loadDewDew } from "./load.dew.js";
import { dew as _supportDewDew } from "./support.dew.js";
import { dew as _defaultsDewDew } from "./defaults.dew.js";
import { dew as _externalDewDew } from "./external.dew.js";
var exports = {},
    _dewExec = false;
export function dew() {
  if (_dewExec) return exports;
  _dewExec = true;

  /**
   * Representation a of zip file in js
   * @constructor
   */
  function JSZip() {
    // if this constructor is used without `new`, it adds `new` before itself:
    if (!(this instanceof JSZip)) {
      return new JSZip();
    }

    if (arguments.length) {
      throw new Error("The constructor with parameters has been removed in JSZip 3.0, please check the upgrade guide.");
    } // object containing the files :
    // {
    //   "folder/" : {...},
    //   "folder/data.txt" : {...}
    // }


    this.files = {};
    this.comment = null; // Where we are in the hierarchy

    this.root = "";

    this.clone = function () {
      var newObj = new JSZip();

      for (var i in this) {
        if (typeof this[i] !== "function") {
          newObj[i] = this[i];
        }
      }

      return newObj;
    };
  }

  JSZip.prototype = _objectDewDew();
  JSZip.prototype.loadAsync = _loadDewDew();
  JSZip.support = _supportDewDew();
  JSZip.defaults = _defaultsDewDew(); // TODO find a better way to handle this version,
  // a require('package.json').version doesn't work with webpack, see #327

  JSZip.version = "3.5.0";

  JSZip.loadAsync = function (content, options) {
    return new JSZip().loadAsync(content, options);
  };

  JSZip.external = _externalDewDew();
  exports = JSZip;
  return exports;
}