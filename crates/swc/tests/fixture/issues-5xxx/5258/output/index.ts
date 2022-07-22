define([
    "require",
    "exports",
    "@swc/helpers/src/_ts_decorate.mjs"
], function(require, exports, _tsDecorate) {
    "use strict";
    Object.defineProperty(exports, "FileSystemError", {
        enumerable: true,
        get: ()=>FileSystemError
    });
    _tsDecorate = _tsDecorate.default;
    function es5ClassCompat(target) {
        function _() {
            return Reflect.construct(target, arguments, this.constructor);
        }
        Object.defineProperty(_, 'name', Object.getOwnPropertyDescriptor(target, 'name'));
        Object.setPrototypeOf(_, target);
        Object.setPrototypeOf(_.prototype, target.prototype);
        return _;
    }
    let FileSystemError = class FileSystemError1 extends Error {
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
            super(URI.isUri(uriOrMessage) ? uriOrMessage.toString(true) : uriOrMessage);
            this.code = terminator?.name ?? 'Unknown';
            markAsFileSystemProviderError(this, code);
            if (typeof Object.setPrototypeOf === 'function') {
                Object.setPrototypeOf(this, FileSystemError.prototype);
            }
            if (typeof Error.captureStackTrace === 'function' && typeof terminator === 'function') {
                Error.captureStackTrace(this, terminator);
            }
        }
    };
    FileSystemError = _tsDecorate([
        es5ClassCompat
    ], FileSystemError);
});
