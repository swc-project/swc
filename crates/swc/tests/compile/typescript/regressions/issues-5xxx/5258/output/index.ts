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
    class FileSystemError extends Error {
        static FileExists(messageOrUri) {
            return new FileSystemError(messageOrUri, FileSystemProviderErrorCode.FileExists, FileSystemError.FileExists);
        }
        static FileNotFound(messageOrUri) {
            return new FileSystemError(messageOrUri, FileSystemProviderErrorCode.FileNotFound, FileSystemError.FileNotFound);
        }
        static FileNotADirectory(messageOrUri) {
            return new FileSystemError(messageOrUri, FileSystemProviderErrorCode.FileNotADirectory, FileSystemError.FileNotADirectory);
        }
        static FileIsADirectory(messageOrUri) {
            return new FileSystemError(messageOrUri, FileSystemProviderErrorCode.FileIsADirectory, FileSystemError.FileIsADirectory);
        }
        static NoPermissions(messageOrUri) {
            return new FileSystemError(messageOrUri, FileSystemProviderErrorCode.NoPermissions, FileSystemError.NoPermissions);
        }
        static Unavailable(messageOrUri) {
            return new FileSystemError(messageOrUri, FileSystemProviderErrorCode.Unavailable, FileSystemError.Unavailable);
        }
        constructor(uriOrMessage, code = FileSystemProviderErrorCode.Unknown, terminator){
            super(URI.isUri(uriOrMessage) ? uriOrMessage.toString(true) : uriOrMessage), _define_property._(this, "code", void 0);
            this.code = terminator?.name ?? 'Unknown';
            markAsFileSystemProviderError(this, code);
            if (typeof Object.setPrototypeOf === 'function') {
                Object.setPrototypeOf(this, FileSystemError.prototype);
            }
            if (typeof Error.captureStackTrace === 'function' && typeof terminator === 'function') {
                Error.captureStackTrace(this, terminator);
            }
        }
    }
    FileSystemError = _ts_decorate._([
        es5ClassCompat
    ], FileSystemError);
});
