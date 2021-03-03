// Loaded from https://dev.jspm.io/npm:jszip@3.5.0/lib/zipObject.dew.js


import { dew as _StreamHelperDewDew } from "./stream/StreamHelper.dew.js";
import { dew as _DataWorkerDewDew } from "./stream/DataWorker.dew.js";
import { dew as _utf8DewDew } from "./utf8.dew.js";
import { dew as _compressedObjectDewDew } from "./compressedObject.dew.js";
import { dew as _GenericWorkerDewDew } from "./stream/GenericWorker.dew.js";
var exports = {},
    _dewExec = false;
export function dew() {
  if (_dewExec) return exports;
  _dewExec = true;

  var StreamHelper = _StreamHelperDewDew();

  var DataWorker = _DataWorkerDewDew();

  var utf8 = _utf8DewDew();

  var CompressedObject = _compressedObjectDewDew();

  var GenericWorker = _GenericWorkerDewDew();
  /**
   * A simple object representing a file in the zip file.
   * @constructor
   * @param {string} name the name of the file
   * @param {String|ArrayBuffer|Uint8Array|Buffer} data the data
   * @param {Object} options the options of the file
   */


  var ZipObject = function (name, data, options) {
    this.name = name;
    this.dir = options.dir;
    this.date = options.date;
    this.comment = options.comment;
    this.unixPermissions = options.unixPermissions;
    this.dosPermissions = options.dosPermissions;
    this._data = data;
    this._dataBinary = options.binary; // keep only the compression

    this.options = {
      compression: options.compression,
      compressionOptions: options.compressionOptions
    };
  };

  ZipObject.prototype = {
    /**
     * Create an internal stream for the content of this object.
     * @param {String} type the type of each chunk.
     * @return StreamHelper the stream.
     */
    internalStream: function (type) {
      var result = null,
          outputType = "string";

      try {
        if (!type) {
          throw new Error("No output type specified.");
        }

        outputType = type.toLowerCase();
        var askUnicodeString = outputType === "string" || outputType === "text";

        if (outputType === "binarystring" || outputType === "text") {
          outputType = "string";
        }

        result = this._decompressWorker();
        var isUnicodeString = !this._dataBinary;

        if (isUnicodeString && !askUnicodeString) {
          result = result.pipe(new utf8.Utf8EncodeWorker());
        }

        if (!isUnicodeString && askUnicodeString) {
          result = result.pipe(new utf8.Utf8DecodeWorker());
        }
      } catch (e) {
        result = new GenericWorker("error");
        result.error(e);
      }

      return new StreamHelper(result, outputType, "");
    },

    /**
     * Prepare the content in the asked type.
     * @param {String} type the type of the result.
     * @param {Function} onUpdate a function to call on each internal update.
     * @return Promise the promise of the result.
     */
    async: function (type, onUpdate) {
      return this.internalStream(type).accumulate(onUpdate);
    },

    /**
     * Prepare the content as a nodejs stream.
     * @param {String} type the type of each chunk.
     * @param {Function} onUpdate a function to call on each internal update.
     * @return Stream the stream.
     */
    nodeStream: function (type, onUpdate) {
      return this.internalStream(type || "nodebuffer").toNodejsStream(onUpdate);
    },

    /**
     * Return a worker for the compressed content.
     * @private
     * @param {Object} compression the compression object to use.
     * @param {Object} compressionOptions the options to use when compressing.
     * @return Worker the worker.
     */
    _compressWorker: function (compression, compressionOptions) {
      if (this._data instanceof CompressedObject && this._data.compression.magic === compression.magic) {
        return this._data.getCompressedWorker();
      } else {
        var result = this._decompressWorker();

        if (!this._dataBinary) {
          result = result.pipe(new utf8.Utf8EncodeWorker());
        }

        return CompressedObject.createWorkerFrom(result, compression, compressionOptions);
      }
    },

    /**
     * Return a worker for the decompressed content.
     * @private
     * @return Worker the worker.
     */
    _decompressWorker: function () {
      if (this._data instanceof CompressedObject) {
        return this._data.getContentWorker();
      } else if (this._data instanceof GenericWorker) {
        return this._data;
      } else {
        return new DataWorker(this._data);
      }
    }
  };
  var removedMethods = ["asText", "asBinary", "asNodeBuffer", "asUint8Array", "asArrayBuffer"];

  var removedFn = function () {
    throw new Error("This method has been removed in JSZip 3.0, please check the upgrade guide.");
  };

  for (var i = 0; i < removedMethods.length; i++) {
    ZipObject.prototype[removedMethods[i]] = removedFn;
  }

  exports = ZipObject;
  return exports;
}