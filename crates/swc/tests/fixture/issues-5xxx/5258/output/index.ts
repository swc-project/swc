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
        ///@ts-expect-error
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
            _define_property._(this, "code", void 0);
            this.code = terminator?.name ?? 'Unknown';
            // mark the error as file system provider error so that
            // we can extract the error code on the receiving side
            markAsFileSystemProviderError(this, code);
            // workaround when extending builtin objects and when compiling to ES5, see:
            // https://github.com/microsoft/TypeScript-wiki/blob/master/Breaking-Changes.md#extending-built-ins-like-error-array-and-map-may-no-longer-work
            if (typeof Object.setPrototypeOf === 'function') {
                Object.setPrototypeOf(this, FileSystemError.prototype);
            }
            if (typeof Error.captureStackTrace === 'function' && typeof terminator === 'function') {
                // nice stack traces
                Error.captureStackTrace(this, terminator);
            }
        }
    };
    FileSystemError = _ts_decorate._([
        es5ClassCompat
    ], FileSystemError);
});
