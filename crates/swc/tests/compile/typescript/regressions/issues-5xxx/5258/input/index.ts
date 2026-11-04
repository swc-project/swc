function es5ClassCompat(target: Function): any {
	///@ts-expect-error
	function _() { return Reflect.construct(target, arguments, this.constructor); }
	Object.defineProperty(_, 'name', Object.getOwnPropertyDescriptor(target, 'name')!);
	Object.setPrototypeOf(_, target);
	Object.setPrototypeOf(_.prototype, target.prototype);
	return _;
}
@es5ClassCompat
export class FileSystemError extends Error {

	static FileExists(messageOrUri?: string | URI): FileSystemError {
		return new FileSystemError(messageOrUri, FileSystemProviderErrorCode.FileExists, FileSystemError.FileExists);
	}
	static FileNotFound(messageOrUri?: string | URI): FileSystemError {
		return new FileSystemError(messageOrUri, FileSystemProviderErrorCode.FileNotFound, FileSystemError.FileNotFound);
	}
	static FileNotADirectory(messageOrUri?: string | URI): FileSystemError {
		return new FileSystemError(messageOrUri, FileSystemProviderErrorCode.FileNotADirectory, FileSystemError.FileNotADirectory);
	}
	static FileIsADirectory(messageOrUri?: string | URI): FileSystemError {
		return new FileSystemError(messageOrUri, FileSystemProviderErrorCode.FileIsADirectory, FileSystemError.FileIsADirectory);
	}
	static NoPermissions(messageOrUri?: string | URI): FileSystemError {
		return new FileSystemError(messageOrUri, FileSystemProviderErrorCode.NoPermissions, FileSystemError.NoPermissions);
	}
	static Unavailable(messageOrUri?: string | URI): FileSystemError {
		return new FileSystemError(messageOrUri, FileSystemProviderErrorCode.Unavailable, FileSystemError.Unavailable);
	}

	readonly code: string;

	constructor(uriOrMessage?: string | URI, code: FileSystemProviderErrorCode = FileSystemProviderErrorCode.Unknown, terminator?: Function) {
		super(URI.isUri(uriOrMessage) ? uriOrMessage.toString(true) : uriOrMessage);

		this.code = terminator?.name ?? 'Unknown';

		// mark the error as file system provider error so that
		// we can extract the error code on the receiving side
		markAsFileSystemProviderError(this, code);

		// workaround when extending builtin objects and when compiling to ES5, see:
		// https://github.com/microsoft/TypeScript-wiki/blob/master/Breaking-Changes.md#extending-built-ins-like-error-array-and-map-may-no-longer-work
		if (typeof (<any>Object).setPrototypeOf === 'function') {
			(<any>Object).setPrototypeOf(this, FileSystemError.prototype);
		}

		if (typeof Error.captureStackTrace === 'function' && typeof terminator === 'function') {
			// nice stack traces
			Error.captureStackTrace(this, terminator);
		}
	}
}