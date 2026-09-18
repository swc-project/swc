define([
    "require",
    "exports",
    "@swc/helpers/_/_define_property",
    "@swc/helpers/_/_ts_decorate"
], function(require, exports, _define_property, _ts_decorate) {
    "use strict";
    Object.defineProperty(exports, "FileSystemError", {
        enumerable: true,
        get: function() {
            return FileSystemError;
        }
    });
    function es5ClassCompat(target) {
        function _() {
            return Reflect.construct(target, arguments, this.constructor);
        }
        Object.defineProperty(_, 'name', Object.getOwnPropertyDescriptor(target, 'name'));
        Object.setPrototypeOf(_, target);
        Object.setPrototypeOf(_.prototype, target.prototype);
        return _;
    }
    let _FileSystemError;
    class FileSystemError extends Error {
        static FileExists(messageOrUri) {
            return new _FileSystemError(messageOrUri, FileSystemProviderErrorCode.FileExists, _FileSystemError.FileExists);
        }
        static FileNotFound(messageOrUri) {
            return new _FileSystemError(messageOrUri, FileSystemProviderErrorCode.FileNotFound, _FileSystemError.FileNotFound);
        }
        static FileNotADirectory(messageOrUri) {
            return new _FileSystemError(messageOrUri, FileSystemProviderErrorCode.FileNotADirectory, _FileSystemError.FileNotADirectory);
        }
        static FileIsADirectory(messageOrUri) {
            return new _FileSystemError(messageOrUri, FileSystemProviderErrorCode.FileIsADirectory, _FileSystemError.FileIsADirectory);
        }
        static NoPermissions(messageOrUri) {
            return new _FileSystemError(messageOrUri, FileSystemProviderErrorCode.NoPermissions, _FileSystemError.NoPermissions);
        }
        static Unavailable(messageOrUri) {
            return new _FileSystemError(messageOrUri, FileSystemProviderErrorCode.Unavailable, _FileSystemError.Unavailable);
        }
        constructor(uriOrMessage, code = FileSystemProviderErrorCode.Unknown, terminator){
            super(URI.isUri(uriOrMessage) ? uriOrMessage.toString(true) : uriOrMessage), _define_property._(this, "code", void 0);
            this.code = terminator?.name ?? 'Unknown';
            markAsFileSystemProviderError(this, code);
            if (typeof Object.setPrototypeOf === 'function') {
                Object.setPrototypeOf(this, _FileSystemError.prototype);
            }
            if (typeof Error.captureStackTrace === 'function' && typeof terminator === 'function') {
                Error.captureStackTrace(this, terminator);
            }
        }
    }
    _FileSystemError = FileSystemError;
    FileSystemError = _FileSystemError = _ts_decorate._([
        es5ClassCompat
    ], FileSystemError);
});
