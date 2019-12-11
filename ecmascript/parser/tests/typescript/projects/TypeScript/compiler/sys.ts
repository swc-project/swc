declare function setTimeout(handler: (...args: any[]) => void, timeout: number): any;
declare function clearTimeout(handle: any): void;

namespace ts {

    export function getNodeMajorVersion(): number | undefined {
        if (typeof process === "undefined") {
            return undefined;
        }
        const version: string = process.version;
        if (!version) {
            return undefined;
        }
        const dot = version.indexOf(".");
        if (dot === -1) {
            return undefined;
        }
        return parseInt(version.substring(1, dot));
    }

    declare const ChakraHost: {
        args: string[];
        currentDirectory: string;
        executingFile: string;
        newLine?: string;
        useCaseSensitiveFileNames?: boolean;
        echo(s: string): void;
        quit(exitCode?: number): void;
        fileExists(path: string): boolean;
        deleteFile(path: string): boolean;
        getModifiedTime(path: string): Date;
        setModifiedTime(path: string, time: Date): void;
        directoryExists(path: string): boolean;
        createDirectory(path: string): void;
        resolvePath(path: string): string;
        readFile(path: string): string | undefined;
        writeFile(path: string, contents: string): void;
        getDirectories(path: string): string[];
        readDirectory(path: string, extensions?: readonly string[], basePaths?: readonly string[], excludeEx?: string, includeFileEx?: string, includeDirEx?: string): string[];
        watchFile?(path: string, callback: FileWatcherCallback): FileWatcher;
        watchDirectory?(path: string, callback: DirectoryWatcherCallback, recursive?: boolean): FileWatcher;
        realpath(path: string): string;
        getEnvironmentVariable?(name: string): string;
    };

    // TODO: GH#18217 this is used as if it's certainly defined in many places.
    // eslint-disable-next-line prefer-const
    export let sys: System = (() => {
        // NodeJS detects "\uFEFF" at the start of the string and *replaces* it with the actual
        // byte order mark from the specified encoding. Using any other byte order mark does
        // not actually work.
        const byteOrderMarkIndicator = "\uFEFF";

        function getNodeSystem(): System {
            const nativePattern = /^native |^\([^)]+\)$|^(internal[\\/]|[a-zA-Z0-9_\s]+(\.js)?$)/;
            const _fs: typeof import("fs") = require("fs");
            const _path: typeof import("path") = require("path");
            const _os = require("os");
            // crypto can be absent on reduced node installations
            let _crypto: typeof import("crypto") | undefined;
            try {
                _crypto = require("crypto");
            }
            catch {
                _crypto = undefined;
            }
            let activeSession: import("inspector").Session | "stopping" | undefined;
            let profilePath = "./profile.cpuprofile";

            const Buffer: {
                new (input: string, encoding?: string): any;
                from?(input: string, encoding?: string): any;
            } = require("buffer").Buffer;

            const nodeVersion = getNodeMajorVersion();
            const isNode4OrLater = nodeVersion! >= 4;
            const isLinuxOrMacOs = process.platform === "linux" || process.platform === "darwin";

            const platform: string = _os.platform();
            const useCaseSensitiveFileNames = isFileSystemCaseSensitive();

            const enum FileSystemEntryKind {
                File,
                Directory
            }

            const useNonPollingWatchers = process.env.TSC_NONPOLLING_WATCHER;
            const tscWatchFile = process.env.TSC_WATCHFILE;
            const tscWatchDirectory = process.env.TSC_WATCHDIRECTORY;
            const fsWatchFile = createSingleFileWatcherPerName(fsWatchFileWorker, useCaseSensitiveFileNames);
            let dynamicPollingWatchFile: HostWatchFile | undefined;
            const nodeSystem: System = {
                args: process.argv.slice(2),
                newLine: _os.EOL,
                useCaseSensitiveFileNames,
                write(s: string): void {
                    process.stdout.write(s);
                },
                writeOutputIsTTY() {
                    return process.stdout.isTTY;
                },
                readFile,
                writeFile,
                watchFile: getWatchFile(),
                watchDirectory: getWatchDirectory(),
                resolvePath: path => _path.resolve(path),
                fileExists,
                directoryExists,
                createDirectory(directoryName: string) {
                    if (!nodeSystem.directoryExists(directoryName)) {
                        // Wrapped in a try-catch to prevent crashing if we are in a race
                        // with another copy of ourselves to create the same directory
                        try {
                            _fs.mkdirSync(directoryName);
                        }
                        catch (e) {
                            if (e.code !== "EEXIST") {
                                // Failed for some other reason (access denied?); still throw
                                throw e;
                            }
                        }
                    }
                },
                getExecutingFilePath() {
                    return __filename;
                },
                getCurrentDirectory() {
                    return process.cwd();
                },
                getDirectories,
                getEnvironmentVariable(name: string) {
                    return process.env[name] || "";
                },
                readDirectory,
                getModifiedTime,
                setModifiedTime,
                deleteFile,
                createHash: _crypto ? createSHA256Hash : generateDjb2Hash,
                createSHA256Hash: _crypto ? createSHA256Hash : undefined,
                getMemoryUsage() {
                    if (global.gc) {
                        global.gc();
                    }
                    return process.memoryUsage().heapUsed;
                },
                getFileSize(path) {
                    try {
                        const stat = _fs.statSync(path);
                        if (stat.isFile()) {
                            return stat.size;
                        }
                    }
                    catch { /*ignore*/ }
                    return 0;
                },
                exit(exitCode?: number): void {
                    disableCPUProfiler(() => process.exit(exitCode));
                },
                enableCPUProfiler,
                disableCPUProfiler,
                realpath,
                debugMode: some(<string[]>process.execArgv, arg => /^--(inspect|debug)(-brk)?(=\d+)?$/i.test(arg)),
                tryEnableSourceMapsForHost() {
                    try {
                        require("source-map-support").install();
                    }
                    catch {
                        // Could not enable source maps.
                    }
                },
                setTimeout,
                clearTimeout,
                clearScreen: () => {
                    process.stdout.write("\x1Bc");
                },
                setBlocking: () => {
                    if (process.stdout && process.stdout._handle && process.stdout._handle.setBlocking) {
                        process.stdout._handle.setBlocking(true);
                    }
                },
                bufferFrom,
                base64decode: input => bufferFrom(input, "base64").toString("utf8"),
                base64encode: input => bufferFrom(input).toString("base64"),
                require: (baseDir, moduleName) => {
                    try {
                        const modulePath = resolveJSModule(moduleName, baseDir, nodeSystem);
                        return { module: require(modulePath), modulePath, error: undefined };
                    }
                    catch (error) {
                        return { module: undefined, modulePath: undefined, error };
                    }
                }
            };
            return nodeSystem;

            /**
             * Uses the builtin inspector APIs to capture a CPU profile
             * See https://nodejs.org/api/inspector.html#inspector_example_usage for details
             */
            function enableCPUProfiler(path: string, cb: () => void) {
                if (activeSession) {
                    cb();
                    return false;
                }
                const inspector: typeof import("inspector") = require("inspector");
                if (!inspector || !inspector.Session) {
                    cb();
                    return false;
                }
                const session = new inspector.Session();
                session.connect();

                session.post("Profiler.enable", () => {
                    session.post("Profiler.start", () => {
                        activeSession = session;
                        profilePath = path;
                        cb();
                    });
                });
                return true;
            }

            /**
             * Strips non-TS paths from the profile, so users with private projects shouldn't
             * need to worry about leaking paths by submitting a cpu profile to us
             */
            function cleanupPaths(profile: import("inspector").Profiler.Profile) {
                let externalFileCounter = 0;
                const remappedPaths = createMap<string>();
                const normalizedDir = normalizeSlashes(__dirname);
                // Windows rooted dir names need an extra `/` prepended to be valid file:/// urls
                const fileUrlRoot = `file://${getRootLength(normalizedDir) === 1 ? "" : "/"}${normalizedDir}`;
                for (const node of profile.nodes) {
                    if (node.callFrame.url) {
                        const url = normalizeSlashes(node.callFrame.url);
                        if (containsPath(fileUrlRoot, url, useCaseSensitiveFileNames)) {
                            node.callFrame.url = getRelativePathToDirectoryOrUrl(fileUrlRoot, url, fileUrlRoot, createGetCanonicalFileName(useCaseSensitiveFileNames), /*isAbsolutePathAnUrl*/ true);
                        }
                        else if (!nativePattern.test(url)) {
                            node.callFrame.url = (remappedPaths.has(url) ? remappedPaths : remappedPaths.set(url, `external${externalFileCounter}.js`)).get(url)!;
                            externalFileCounter++;
                        }
                    }
                }
                return profile;
            }

            function disableCPUProfiler(cb: () => void) {
                if (activeSession && activeSession !== "stopping") {
                    const s = activeSession;
                    activeSession.post("Profiler.stop", (err, { profile }) => {
                        if (!err) {
                            try {
                                if (_fs.statSync(profilePath).isDirectory()) {
                                    profilePath = _path.join(profilePath, `${(new Date()).toISOString().replace(/:/g, "-")}+P${process.pid}.cpuprofile`);
                                }
                            }
                            catch {
                                // do nothing and ignore fallible fs operation
                            }
                            try {
                                _fs.mkdirSync(_path.dirname(profilePath), { recursive: true });
                            }
                            catch {
                                // do nothing and ignore fallible fs operation
                            }
                            _fs.writeFileSync(profilePath, JSON.stringify(cleanupPaths(profile)));
                        }
                        activeSession = undefined;
                        s.disconnect();
                        cb();
                    });
                    activeSession = "stopping";
                    return true;
                }
                else {
                    cb();
                    return false;
                }
            }

            function bufferFrom(input: string, encoding?: string): Buffer {
                // See https://github.com/Microsoft/TypeScript/issues/25652
                return Buffer.from && (Buffer.from as Function) !== Int8Array.from
                    ? Buffer.from(input, encoding)
                    : new Buffer(input, encoding);
            }

            function isFileSystemCaseSensitive(): boolean {
                // win32\win64 are case insensitive platforms
                if (platform === "win32" || platform === "win64") {
                    return false;
                }
                // If this file exists under a different case, we must be case-insensitve.
                return !fileExists(swapCase(__filename));
            }

            /** Convert all lowercase chars to uppercase, and vice-versa */
            function swapCase(s: string): string {
                return s.replace(/\w/g, (ch) => {
                    const up = ch.toUpperCase();
                    return ch === up ? ch.toLowerCase() : up;
                });
            }

            function getWatchFile(): HostWatchFile {
                switch (tscWatchFile) {
                    case "PriorityPollingInterval":
                        // Use polling interval based on priority when create watch using host.watchFile
                        return fsWatchFile;
                    case "DynamicPriorityPolling":
                        // Use polling interval but change the interval depending on file changes and their default polling interval
                        return createDynamicPriorityPollingWatchFile({ getModifiedTime, setTimeout });
                    case "UseFsEvents":
                        // Use notifications from FS to watch with falling back to fs.watchFile
                        return watchFileUsingFsWatch;
                    case "UseFsEventsWithFallbackDynamicPolling":
                        // Use notifications from FS to watch with falling back to dynamic watch file
                        dynamicPollingWatchFile = createDynamicPriorityPollingWatchFile({ getModifiedTime, setTimeout });
                        return createWatchFileUsingDynamicWatchFile(dynamicPollingWatchFile);
                    case "UseFsEventsOnParentDirectory":
                        // Use notifications from FS to watch with falling back to fs.watchFile
                        return createNonPollingWatchFile();
                }
                return useNonPollingWatchers ?
                    createNonPollingWatchFile() :
                    // Default to do not use polling interval as it is before this experiment branch
                    (fileName, callback) => fsWatchFile(fileName, callback, /*pollingInterval*/ undefined);
            }

            function getWatchDirectory(): HostWatchDirectory {
                // Node 4.0 `fs.watch` function supports the "recursive" option on both OSX and Windows
                // (ref: https://github.com/nodejs/node/pull/2649 and https://github.com/Microsoft/TypeScript/issues/4643)
                const fsSupportsRecursive = isNode4OrLater && (process.platform === "win32" || process.platform === "darwin");
                if (fsSupportsRecursive) {
                    return watchDirectoryUsingFsWatch;
                }

                // defer watchDirectoryRecursively as it depends on `ts.createMap()` which may not be usable yet.
                const watchDirectory = tscWatchDirectory === "RecursiveDirectoryUsingFsWatchFile" ?
                    createWatchDirectoryUsing(fsWatchFile) :
                    tscWatchDirectory === "RecursiveDirectoryUsingDynamicPriorityPolling" ?
                        createWatchDirectoryUsing(dynamicPollingWatchFile || createDynamicPriorityPollingWatchFile({ getModifiedTime, setTimeout })) :
                        watchDirectoryUsingFsWatch;
                const watchDirectoryRecursively = createRecursiveDirectoryWatcher({
                    useCaseSensitiveFileNames,
                    directoryExists,
                    getAccessibleSortedChildDirectories: path => getAccessibleFileSystemEntries(path).directories,
                    watchDirectory,
                    realpath
                });

                return (directoryName, callback, recursive) => {
                    if (recursive) {
                        return watchDirectoryRecursively(directoryName, callback);
                    }
                    return watchDirectory(directoryName, callback);
                };
            }

            function createNonPollingWatchFile() {
                // One file can have multiple watchers
                const fileWatcherCallbacks = createMultiMap<FileWatcherCallback>();
                const dirWatchers = createMap<DirectoryWatcher>();
                const toCanonicalName = createGetCanonicalFileName(useCaseSensitiveFileNames);
                return nonPollingWatchFile;

                function nonPollingWatchFile(fileName: string, callback: FileWatcherCallback): FileWatcher {
                    const filePath = toCanonicalName(fileName);
                    fileWatcherCallbacks.add(filePath, callback);
                    const dirPath = getDirectoryPath(filePath) || ".";
                    const watcher = dirWatchers.get(dirPath) || createDirectoryWatcher(getDirectoryPath(fileName) || ".", dirPath);
                    watcher.referenceCount++;
                    return {
                        close: () => {
                            if (watcher.referenceCount === 1) {
                                watcher.close();
                                dirWatchers.delete(dirPath);
                            }
                            else {
                                watcher.referenceCount--;
                            }
                            fileWatcherCallbacks.remove(filePath, callback);
                        }
                    };
                }

                function createDirectoryWatcher(dirName: string, dirPath: string) {
                    const watcher = fsWatchDirectory(
                        dirName,
                        (_eventName: string, relativeFileName) => {
                            // When files are deleted from disk, the triggered "rename" event would have a relativefileName of "undefined"
                            if (!isString(relativeFileName)) { return; }
                            const fileName = getNormalizedAbsolutePath(relativeFileName, dirName);
                            // Some applications save a working file via rename operations
                            const callbacks = fileName && fileWatcherCallbacks.get(toCanonicalName(fileName));
                            if (callbacks) {
                                for (const fileCallback of callbacks) {
                                    fileCallback(fileName, FileWatcherEventKind.Changed);
                                }
                            }
                        }
                    ) as DirectoryWatcher;
                    watcher.referenceCount = 0;
                    dirWatchers.set(dirPath, watcher);
                    return watcher;
                }
            }

            function fsWatchFileWorker(fileName: string, callback: FileWatcherCallback, pollingInterval?: number): FileWatcher {
                _fs.watchFile(fileName, { persistent: true, interval: pollingInterval || 250 }, fileChanged);
                let eventKind: FileWatcherEventKind;
                return {
                    close: () => _fs.unwatchFile(fileName, fileChanged)
                };

                function fileChanged(curr: any, prev: any) {
                    // previous event kind check is to ensure we recongnize the file as previously also missing when it is restored or renamed twice (that is it disappears and reappears)
                    // In such case, prevTime returned is same as prev time of event when file was deleted as per node documentation
                    const isPreviouslyDeleted = +prev.mtime === 0 || eventKind === FileWatcherEventKind.Deleted;
                    if (+curr.mtime === 0) {
                        if (isPreviouslyDeleted) {
                            // Already deleted file, no need to callback again
                            return;
                        }
                        eventKind = FileWatcherEventKind.Deleted;
                    }
                    else if (isPreviouslyDeleted) {
                        eventKind = FileWatcherEventKind.Created;
                    }
                    // If there is no change in modified time, ignore the event
                    else if (+curr.mtime === +prev.mtime) {
                        return;
                    }
                    else {
                        // File changed
                        eventKind = FileWatcherEventKind.Changed;
                    }
                    callback(fileName, eventKind);
                }
            }

            type FsWatchCallback = (eventName: "rename" | "change", relativeFileName: string | undefined) => void;

            function createFileWatcherCallback(callback: FsWatchCallback): FileWatcherCallback {
                return (_fileName, eventKind) => callback(eventKind === FileWatcherEventKind.Changed ? "change" : "rename", "");
            }

            function createFsWatchCallbackForFileWatcherCallback(fileName: string, callback: FileWatcherCallback): FsWatchCallback {
                return eventName => {
                    if (eventName === "rename") {
                        callback(fileName, fileExists(fileName) ? FileWatcherEventKind.Created : FileWatcherEventKind.Deleted);
                    }
                    else {
                        // Change
                        callback(fileName, FileWatcherEventKind.Changed);
                    }
                };
            }

            function createFsWatchCallbackForDirectoryWatcherCallback(directoryName: string, callback: DirectoryWatcherCallback): FsWatchCallback {
                return (eventName, relativeFileName) => {
                    // In watchDirectory we only care about adding and removing files (when event name is
                    // "rename"); changes made within files are handled by corresponding fileWatchers (when
                    // event name is "change")
                    if (eventName === "rename") {
                        // When deleting a file, the passed baseFileName is null
                        callback(!relativeFileName ? directoryName : normalizePath(combinePaths(directoryName, relativeFileName)));
                    }
                };
            }

            function fsWatch(fileOrDirectory: string, entryKind: FileSystemEntryKind.File | FileSystemEntryKind.Directory, callback: FsWatchCallback, recursive: boolean, fallbackPollingWatchFile: HostWatchFile, pollingInterval?: number): FileWatcher {
                let options: any;
                let lastDirectoryPartWithDirectorySeparator: string | undefined;
                let lastDirectoryPart: string | undefined;
                if (isLinuxOrMacOs) {
                    lastDirectoryPartWithDirectorySeparator = fileOrDirectory.substr(fileOrDirectory.lastIndexOf(directorySeparator));
                    lastDirectoryPart = lastDirectoryPartWithDirectorySeparator.slice(directorySeparator.length);
                }
                /** Watcher for the file system entry depending on whether it is missing or present */
                let watcher = !fileSystemEntryExists(fileOrDirectory, entryKind) ?
                    watchMissingFileSystemEntry() :
                    watchPresentFileSystemEntry();
                return {
                    close: () => {
                        // Close the watcher (either existing file system entry watcher or missing file system entry watcher)
                        watcher.close();
                        watcher = undefined!;
                    }
                };

                /**
                 * Invoke the callback with rename and update the watcher if not closed
                 * @param createWatcher
                 */
                function invokeCallbackAndUpdateWatcher(createWatcher: () => FileWatcher) {
                    sysLog(`sysLog:: ${fileOrDirectory}:: Changing watcher to ${createWatcher === watchPresentFileSystemEntry ? "Present" : "Missing"}FileSystemEntryWatcher`);
                    // Call the callback for current directory
                    callback("rename", "");

                    // If watcher is not closed, update it
                    if (watcher) {
                        watcher.close();
                        watcher = createWatcher();
                    }
                }

                /**
                 * Watch the file or directory that is currently present
                 * and when the watched file or directory is deleted, switch to missing file system entry watcher
                 */
                function watchPresentFileSystemEntry(): FileWatcher {
                    // Node 4.0 `fs.watch` function supports the "recursive" option on both OSX and Windows
                    // (ref: https://github.com/nodejs/node/pull/2649 and https://github.com/Microsoft/TypeScript/issues/4643)
                    if (options === undefined) {
                        if (isNode4OrLater && (process.platform === "win32" || process.platform === "darwin")) {
                            options = { persistent: true, recursive: !!recursive };
                        }
                        else {
                            options = { persistent: true };
                        }
                    }
                    try {
                        const presentWatcher = _fs.watch(
                            fileOrDirectory,
                            options,
                            isLinuxOrMacOs ?
                                callbackChangingToMissingFileSystemEntry :
                                callback
                        );
                        // Watch the missing file or directory or error
                        presentWatcher.on("error", () => invokeCallbackAndUpdateWatcher(watchMissingFileSystemEntry));
                        return presentWatcher;
                    }
                    catch (e) {
                        // Catch the exception and use polling instead
                        // Eg. on linux the number of watches are limited and one could easily exhaust watches and the exception ENOSPC is thrown when creating watcher at that point
                        // so instead of throwing error, use fs.watchFile
                        return watchPresentFileSystemEntryWithFsWatchFile();
                    }
                }

                function callbackChangingToMissingFileSystemEntry(event: "rename" | "change", relativeName: string | undefined) {
                    // because relativeName is not guaranteed to be correct we need to check on each rename with few combinations
                    // Eg on ubuntu while watching app/node_modules the relativeName is "node_modules" which is neither relative nor full path
                    return event === "rename" &&
                        (!relativeName ||
                            relativeName === lastDirectoryPart ||
                            relativeName.lastIndexOf(lastDirectoryPartWithDirectorySeparator!) === relativeName.length - lastDirectoryPartWithDirectorySeparator!.length) &&
                        !fileSystemEntryExists(fileOrDirectory, entryKind) ?
                        invokeCallbackAndUpdateWatcher(watchMissingFileSystemEntry) :
                        callback(event, relativeName);
                }

                /**
                 * Watch the file or directory using fs.watchFile since fs.watch threw exception
                 * Eg. on linux the number of watches are limited and one could easily exhaust watches and the exception ENOSPC is thrown when creating watcher at that point
                 */
                function watchPresentFileSystemEntryWithFsWatchFile(): FileWatcher {
                    sysLog(`sysLog:: ${fileOrDirectory}:: Changing to fsWatchFile`);
                    return fallbackPollingWatchFile(fileOrDirectory, createFileWatcherCallback(callback), pollingInterval);
                }

                /**
                 * Watch the file or directory that is missing
                 * and switch to existing file or directory when the missing filesystem entry is created
                 */
                function watchMissingFileSystemEntry(): FileWatcher {
                    return fallbackPollingWatchFile(fileOrDirectory, (_fileName, eventKind) => {
                        if (eventKind === FileWatcherEventKind.Created && fileSystemEntryExists(fileOrDirectory, entryKind)) {
                            // Call the callback for current file or directory
                            // For now it could be callback for the inner directory creation,
                            // but just return current directory, better than current no-op
                            invokeCallbackAndUpdateWatcher(watchPresentFileSystemEntry);
                        }
                    }, pollingInterval);
                }
            }

            function watchFileUsingFsWatch(fileName: string, callback: FileWatcherCallback, pollingInterval?: number) {
                return fsWatch(fileName, FileSystemEntryKind.File, createFsWatchCallbackForFileWatcherCallback(fileName, callback), /*recursive*/ false, fsWatchFile, pollingInterval);
            }

            function createWatchFileUsingDynamicWatchFile(watchFile: HostWatchFile): HostWatchFile {
                return (fileName, callback, pollingInterval) => fsWatch(fileName, FileSystemEntryKind.File, createFsWatchCallbackForFileWatcherCallback(fileName, callback), /*recursive*/ false, watchFile, pollingInterval);
            }

            function fsWatchDirectory(directoryName: string, callback: FsWatchCallback, recursive?: boolean): FileWatcher {
                return fsWatch(directoryName, FileSystemEntryKind.Directory, callback, !!recursive, fsWatchFile);
            }

            function watchDirectoryUsingFsWatch(directoryName: string, callback: DirectoryWatcherCallback, recursive?: boolean) {
                return fsWatchDirectory(directoryName, createFsWatchCallbackForDirectoryWatcherCallback(directoryName, callback), recursive);
            }

            function createWatchDirectoryUsing(fsWatchFile: HostWatchFile): HostWatchDirectory {
                return (directoryName, callback) => fsWatchFile(directoryName, () => callback(directoryName), PollingInterval.Medium);
            }

            function readFileWorker(fileName: string, _encoding?: string): string | undefined {
                if (!fileExists(fileName)) {
                    return undefined;
                }
                const buffer = _fs.readFileSync(fileName);
                let len = buffer.length;
                if (len >= 2 && buffer[0] === 0xFE && buffer[1] === 0xFF) {
                    // Big endian UTF-16 byte order mark detected. Since big endian is not supported by node.js,
                    // flip all byte pairs and treat as little endian.
                    len &= ~1; // Round down to a multiple of 2
                    for (let i = 0; i < len; i += 2) {
                        const temp = buffer[i];
                        buffer[i] = buffer[i + 1];
                        buffer[i + 1] = temp;
                    }
                    return buffer.toString("utf16le", 2);
                }
                if (len >= 2 && buffer[0] === 0xFF && buffer[1] === 0xFE) {
                    // Little endian UTF-16 byte order mark detected
                    return buffer.toString("utf16le", 2);
                }
                if (len >= 3 && buffer[0] === 0xEF && buffer[1] === 0xBB && buffer[2] === 0xBF) {
                    // UTF-8 byte order mark detected
                    return buffer.toString("utf8", 3);
                }
                // Default is UTF-8 with no byte order mark
                return buffer.toString("utf8");
            }

            function readFile(fileName: string, _encoding?: string): string | undefined {
                perfLogger.logStartReadFile(fileName);
                const file = readFileWorker(fileName, _encoding);
                perfLogger.logStopReadFile();
                return file;
            }

            function writeFile(fileName: string, data: string, writeByteOrderMark?: boolean): void {
                perfLogger.logEvent("WriteFile: " + fileName);
                // If a BOM is required, emit one
                if (writeByteOrderMark) {
                    data = byteOrderMarkIndicator + data;
                }

                let fd: number | undefined;

                try {
                    fd = _fs.openSync(fileName, "w");
                    _fs.writeSync(fd, data, /*position*/ undefined, "utf8");
                }
                finally {
                    if (fd !== undefined) {
                        _fs.closeSync(fd);
                    }
                }
            }

            function getAccessibleFileSystemEntries(path: string): FileSystemEntries {
                perfLogger.logEvent("ReadDir: " + (path || "."));
                try {
                    const entries = _fs.readdirSync(path || ".").sort();
                    const files: string[] = [];
                    const directories: string[] = [];
                    for (const entry of entries) {
                        // This is necessary because on some file system node fails to exclude
                        // "." and "..". See https://github.com/nodejs/node/issues/4002
                        if (entry === "." || entry === "..") {
                            continue;
                        }
                        const name = combinePaths(path, entry);

                        let stat: any;
                        try {
                            stat = _fs.statSync(name);
                        }
                        catch (e) {
                            continue;
                        }

                        if (stat.isFile()) {
                            files.push(entry);
                        }
                        else if (stat.isDirectory()) {
                            directories.push(entry);
                        }
                    }
                    return { files, directories };
                }
                catch (e) {
                    return emptyFileSystemEntries;
                }
            }

            function readDirectory(path: string, extensions?: readonly string[], excludes?: readonly string[], includes?: readonly string[], depth?: number): string[] {
                return matchFiles(path, extensions, excludes, includes, useCaseSensitiveFileNames, process.cwd(), depth, getAccessibleFileSystemEntries, realpath);
            }

            function fileSystemEntryExists(path: string, entryKind: FileSystemEntryKind): boolean {
                try {
                    const stat = _fs.statSync(path);
                    switch (entryKind) {
                        case FileSystemEntryKind.File: return stat.isFile();
                        case FileSystemEntryKind.Directory: return stat.isDirectory();
                        default: return false;
                    }
                }
                catch (e) {
                    return false;
                }
            }

            function fileExists(path: string): boolean {
                return fileSystemEntryExists(path, FileSystemEntryKind.File);
            }

            function directoryExists(path: string): boolean {
                return fileSystemEntryExists(path, FileSystemEntryKind.Directory);
            }

            function getDirectories(path: string): string[] {
                perfLogger.logEvent("ReadDir: " + path);
                return filter<string>(_fs.readdirSync(path), dir => fileSystemEntryExists(combinePaths(path, dir), FileSystemEntryKind.Directory));
            }

            function realpath(path: string): string {
                try {
                    return _fs.realpathSync(path);
                }
                catch {
                    return path;
                }
            }

            function getModifiedTime(path: string) {
                try {
                    return _fs.statSync(path).mtime;
                }
                catch (e) {
                    return undefined;
                }
            }

            function setModifiedTime(path: string, time: Date) {
                try {
                    _fs.utimesSync(path, time, time);
                }
                catch (e) {
                    return;
                }
            }

            function deleteFile(path: string) {
                try {
                    return _fs.unlinkSync(path);
                }
                catch (e) {
                    return;
                }
            }

            function createSHA256Hash(data: string): string {
                const hash = _crypto!.createHash("sha256");
                hash.update(data);
                return hash.digest("hex");
            }
        }

        function getChakraSystem(): System {
            const realpath = ChakraHost.realpath && ((path: string) => ChakraHost.realpath(path));
            return {
                newLine: ChakraHost.newLine || "\r\n",
                args: ChakraHost.args,
                useCaseSensitiveFileNames: !!ChakraHost.useCaseSensitiveFileNames,
                write: ChakraHost.echo,
                readFile(path: string, _encoding?: string) {
                    // encoding is automatically handled by the implementation in ChakraHost
                    return ChakraHost.readFile(path);
                },
                writeFile(path: string, data: string, writeByteOrderMark?: boolean) {
                    // If a BOM is required, emit one
                    if (writeByteOrderMark) {
                        data = byteOrderMarkIndicator + data;
                    }

                    ChakraHost.writeFile(path, data);
                },
                resolvePath: ChakraHost.resolvePath,
                fileExists: ChakraHost.fileExists,
                deleteFile: ChakraHost.deleteFile,
                getModifiedTime: ChakraHost.getModifiedTime,
                setModifiedTime: ChakraHost.setModifiedTime,
                directoryExists: ChakraHost.directoryExists,
                createDirectory: ChakraHost.createDirectory,
                getExecutingFilePath: () => ChakraHost.executingFile,
                getCurrentDirectory: () => ChakraHost.currentDirectory,
                getDirectories: ChakraHost.getDirectories,
                getEnvironmentVariable: ChakraHost.getEnvironmentVariable || (() => ""),
                readDirectory(path, extensions, excludes, includes, _depth) {
                    const pattern = getFileMatcherPatterns(path, excludes, includes, !!ChakraHost.useCaseSensitiveFileNames, ChakraHost.currentDirectory);
                    return ChakraHost.readDirectory(path, extensions, pattern.basePaths, pattern.excludePattern, pattern.includeFilePattern, pattern.includeDirectoryPattern);
                },
                exit: ChakraHost.quit,
                realpath
            };
        }

        let sys: System | undefined;
        if (typeof ChakraHost !== "undefined") {
            sys = getChakraSystem();
        }
        else if (typeof process !== "undefined" && process.nextTick && !process.browser && typeof require !== "undefined") {
            // process and process.nextTick checks if current environment is node-like
            // process.browser check excludes webpack and browserify
            sys = getNodeSystem();
        }
        if (sys) {
            // patch writefile to create folder before writing the file
            patchWriteFileEnsuringDirectory(sys);
        }
        return sys!;
    })();

    if (sys && sys.getEnvironmentVariable) {
        setCustomPollingValues(sys);
        Debug.currentAssertionLevel = /^development$/i.test(sys.getEnvironmentVariable("NODE_ENV"))
            ? AssertionLevel.Normal
            : AssertionLevel.None;
    }
    if (sys && sys.debugMode) {
        Debug.isDebugging = true;
    }
}
