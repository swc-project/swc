// Loaded from https://dev.jspm.io/npm:jszip@3.5.0/lib/load.dew.js


import { dew as _utilsDewDew } from "./utils.dew.js";
import { dew as _externalDewDew } from "./external.dew.js";
import { dew as _utf8DewDew } from "./utf8.dew.js";
import { dew as _zipEntriesDewDew } from "./zipEntries.dew.js";
import { dew as _Crc32ProbeDewDew } from "./stream/Crc32Probe.dew.js";
import { dew as _nodejsUtilsDewDew } from "./nodejsUtils.dew.js";
var exports = {},
    _dewExec = false;
export function dew() {
  if (_dewExec) return exports;
  _dewExec = true;

  var utils = _utilsDewDew();

  var external = _externalDewDew();

  var utf8 = _utf8DewDew();

  var utils = _utilsDewDew();

  var ZipEntries = _zipEntriesDewDew();

  var Crc32Probe = _Crc32ProbeDewDew();

  var nodejsUtils = _nodejsUtilsDewDew();
  /**
   * Check the CRC32 of an entry.
   * @param {ZipEntry} zipEntry the zip entry to check.
   * @return {Promise} the result.
   */


  function checkEntryCRC32(zipEntry) {
    return new external.Promise(function (resolve, reject) {
      var worker = zipEntry.decompressed.getContentWorker().pipe(new Crc32Probe());
      worker.on("error", function (e) {
        reject(e);
      }).on("end", function () {
        if (worker.streamInfo.crc32 !== zipEntry.decompressed.crc32) {
          reject(new Error("Corrupted zip : CRC32 mismatch"));
        } else {
          resolve();
        }
      }).resume();
    });
  }

  exports = function (data, options) {
    var zip = this;
    options = utils.extend(options || {}, {
      base64: false,
      checkCRC32: false,
      optimizedBinaryString: false,
      createFolders: false,
      decodeFileName: utf8.utf8decode
    });

    if (nodejsUtils.isNode && nodejsUtils.isStream(data)) {
      return external.Promise.reject(new Error("JSZip can't accept a stream when loading a zip file."));
    }

    return utils.prepareContent("the loaded zip file", data, true, options.optimizedBinaryString, options.base64).then(function (data) {
      var zipEntries = new ZipEntries(options);
      zipEntries.load(data);
      return zipEntries;
    }).then(function checkCRC32(zipEntries) {
      var promises = [external.Promise.resolve(zipEntries)];
      var files = zipEntries.files;

      if (options.checkCRC32) {
        for (var i = 0; i < files.length; i++) {
          promises.push(checkEntryCRC32(files[i]));
        }
      }

      return external.Promise.all(promises);
    }).then(function addFiles(results) {
      var zipEntries = results.shift();
      var files = zipEntries.files;

      for (var i = 0; i < files.length; i++) {
        var input = files[i];
        zip.file(input.fileNameStr, input.decompressed, {
          binary: true,
          optimizedBinaryString: true,
          date: input.date,
          dir: input.dir,
          comment: input.fileCommentStr.length ? input.fileCommentStr : null,
          unixPermissions: input.unixPermissions,
          dosPermissions: input.dosPermissions,
          createFolders: options.createFolders
        });
      }

      if (zipEntries.zipComment.length) {
        zip.comment = zipEntries.zipComment;
      }

      return zip;
    });
  };

  return exports;
}