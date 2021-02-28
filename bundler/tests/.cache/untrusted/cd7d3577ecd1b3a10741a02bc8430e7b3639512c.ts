// Loaded from https://dev.jspm.io/npm:jszip@3.5.0/lib/generate/index.dew.js


import { dew as _compressionsDewDew } from "../compressions.dew.js";
import { dew as _ZipFileWorkerDewDew } from "./ZipFileWorker.dew.js";
var exports = {},
    _dewExec = false;
export function dew() {
  if (_dewExec) return exports;
  _dewExec = true;

  var compressions = _compressionsDewDew();

  var ZipFileWorker = _ZipFileWorkerDewDew();
  /**
   * Find the compression to use.
   * @param {String} fileCompression the compression defined at the file level, if any.
   * @param {String} zipCompression the compression defined at the load() level.
   * @return {Object} the compression object to use.
   */


  var getCompression = function (fileCompression, zipCompression) {
    var compressionName = fileCompression || zipCompression;
    var compression = compressions[compressionName];

    if (!compression) {
      throw new Error(compressionName + " is not a valid compression method !");
    }

    return compression;
  };
  /**
   * Create a worker to generate a zip file.
   * @param {JSZip} zip the JSZip instance at the right root level.
   * @param {Object} options to generate the zip file.
   * @param {String} comment the comment to use.
   */


  exports.generateWorker = function (zip, options, comment) {
    var zipFileWorker = new ZipFileWorker(options.streamFiles, comment, options.platform, options.encodeFileName);
    var entriesCount = 0;

    try {
      zip.forEach(function (relativePath, file) {
        entriesCount++;
        var compression = getCompression(file.options.compression, options.compression);
        var compressionOptions = file.options.compressionOptions || options.compressionOptions || {};
        var dir = file.dir,
            date = file.date;

        file._compressWorker(compression, compressionOptions).withStreamInfo("file", {
          name: relativePath,
          dir: dir,
          date: date,
          comment: file.comment || "",
          unixPermissions: file.unixPermissions,
          dosPermissions: file.dosPermissions
        }).pipe(zipFileWorker);
      });
      zipFileWorker.entriesCount = entriesCount;
    } catch (e) {
      zipFileWorker.error(e);
    }

    return zipFileWorker;
  };

  return exports;
}