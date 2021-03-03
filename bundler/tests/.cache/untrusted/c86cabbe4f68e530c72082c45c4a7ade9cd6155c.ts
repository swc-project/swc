// Loaded from https://raw.githubusercontent.com/denjucks/dex/master/lib/deps/tarn@3.0.0/dist/Resource.dew.js


import { dew as _utilsDewDew } from "./utils.dew.js";
var exports = {},
    _dewExec = false;
export function dew() {
  if (_dewExec) return exports;
  _dewExec = true;
  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  const utils_1 = _utilsDewDew();

  class Resource {
    constructor(resource) {
      this.resource = resource;
      this.resource = resource;
      this.timestamp = utils_1.now();
      this.deferred = utils_1.defer();
    }

    get promise() {
      return this.deferred.promise;
    }

    resolve() {
      this.deferred.resolve(undefined);
      return new Resource(this.resource);
    }

  }

  exports.Resource = Resource;
  return exports;
}