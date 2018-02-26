import * as path from 'path';
import * as glob from 'glob';
import { platform } from 'os';

export class Cli {
	/**
	 * 
	 * @param executable Resolved path to executable.
	 */
	constructor(
		readonly executable: string
	) { }
}


/*
https://stackoverflow.com/questions/33086985/how-to-obtain-case-exact-path-of-a-file-in-node-js-on-windows

SYNOPSIS
  trueCasePathSync(<fileSystemPath>)
DESCRIPTION
  Given a possibly case-variant version of an existing filesystem path, returns
  the case-exact, normalized version as stored in the filesystem.
  Note: If the input path is a globbing *pattern* as defined by the 'glob' npm
        package (see prerequisites below), only the 1st match, if any,
        is returned.
        Only a literal input path guarantees an unambiguous result.
  If no matching path exists, undefined is returned.
  On case-SENSITIVE filesystems, a match will also be found, but if case
  variations of a given path exist, it is undefined which match is returned.
PLATFORMS
    Windows, OSX, and Linux (though note the limitations with case-insensitive
    filesystems).
LIMITATIONS
  - Paths starting with './' are acceptable, but paths starting with '../'
    are not - when in doubt, resolve with fs.realPathSync() first.
    An initial '.' and *interior* '..' instances are normalized, but a relative
    input path still results in a relative output path. If you want to ensure
    an absolute output path, apply fs.realPathSync() to the result.
  - On Windows, no attempt is made to case-correct the drive letter or UNC-share
    component of the path.
  - Unicode support:
    - Be sure to use UTF8 source-code files (with a BOM on Windows)
    - On OSX, the input path is automatically converted to NFD Unicode form
      to match how the filesystem stores names, but note that the result will
      invariably be NFD too (which makes no difference for ASCII-characters-only
      names).
PREREQUISITES
  npm install glob    # see https://www.npmjs.com/search?q=glob
EXAMPLES
  trueCasePathSync('/users/guest') // OSX: -> '/Users/Guest'
  trueCasePathSync('c:\\users\\all users') // Windows: -> 'c:\Users\All Users'
*/
export async function trueCasePath(fsPath: string): Promise<string> {
	// Normalize the path so as to resolve . and .. components.
	// !! As of Node v4.1.1, a path starting with ../ is NOT resolved relative
	// !! to the current dir, and glob.sync() below then fails.
	// !! When in doubt, resolve with fs.realPathSync() *beforehand*.
	let fsPathNormalized = path.normalize(fsPath)

	// OSX: HFS+ stores filenames in NFD (decomposed normal form) Unicode format,
	// so we must ensure that the input path is in that format first.
	if (process.platform === 'darwin') {
		fsPathNormalized = fsPathNormalized.normalize('NFD')
	}

	// !! Windows: Curiously, the drive component mustn't be part of a glob,
	// !! otherwise glob.sync() will invariably match nothing.
	// !! Thus, we remove the drive component and instead pass it in as the 'cwd' 
	// !! (working dir.) property below.
	let pathRoot = path.parse(fsPathNormalized).root
	if (platform() === 'win32') {
		pathRoot = pathRoot.toUpperCase()
	}

	const noDrivePath = fsPathNormalized.slice(Math.max(pathRoot.length - 1, 0))

	// Perform case-insensitive globbing (on Windows, relative to the drive / 
	// network share) and return the 1st match, if any.
	// Fortunately, glob() with nocase case-corrects the input even if it is 
	// a *literal* path.
	const g = new glob.Glob(noDrivePath, { nocase: true, cwd: pathRoot });
	return new Promise<string>((resolve, reject) => {
		g.once('match', (s: string) => {
			g.abort()
			resolve(s)
		})
	})
}