/*@internal*/
namespace ts {
    const sysFormatDiagnosticsHost: FormatDiagnosticsHost = sys ? {
        getCurrentDirectory: () => sys.getCurrentDirectory(),
        getNewLine: () => sys.newLine,
        getCanonicalFileName: createGetCanonicalFileName(sys.useCaseSensitiveFileNames)
    } : undefined!; // TODO: GH#18217

    /**
     * Create a function that reports error by writing to the system and handles the formating of the diagnostic
     */
    export function createDiagnosticReporter(system: System, pretty?: boolean): DiagnosticReporter {
        const host: FormatDiagnosticsHost = system === sys ? sysFormatDiagnosticsHost : {
            getCurrentDirectory: () => system.getCurrentDirectory(),
            getNewLine: () => system.newLine,
            getCanonicalFileName: createGetCanonicalFileName(system.useCaseSensitiveFileNames),
        };
        if (!pretty) {
            return diagnostic => system.write(formatDiagnostic(diagnostic, host));
        }

        const diagnostics: Diagnostic[] = new Array(1);
        return diagnostic => {
            diagnostics[0] = diagnostic;
            system.write(formatDiagnosticsWithColorAndContext(diagnostics, host) + host.getNewLine());
            diagnostics[0] = undefined!; // TODO: GH#18217
        };
    }

    /**
     * @returns Whether the screen was cleared.
     */
    function clearScreenIfNotWatchingForFileChanges(system: System, diagnostic: Diagnostic, options: CompilerOptions): boolean {
        if (system.clearScreen &&
            !options.preserveWatchOutput &&
            !options.extendedDiagnostics &&
            !options.diagnostics &&
            contains(screenStartingMessageCodes, diagnostic.code)) {
            system.clearScreen();
            return true;
        }

        return false;
    }

    export const screenStartingMessageCodes: number[] = [
        Diagnostics.Starting_compilation_in_watch_mode.code,
        Diagnostics.File_change_detected_Starting_incremental_compilation.code,
    ];

    function getPlainDiagnosticFollowingNewLines(diagnostic: Diagnostic, newLine: string): string {
        return contains(screenStartingMessageCodes, diagnostic.code)
            ? newLine + newLine
            : newLine;
    }

    /**
     * Get locale specific time based on whether we are in test mode
     */
    export function getLocaleTimeString(system: System) {
        return !system.now ?
            new Date().toLocaleTimeString() :
            system.now().toLocaleTimeString("en-US", { timeZone: "UTC" });
    }

    /**
     * Create a function that reports watch status by writing to the system and handles the formating of the diagnostic
     */
    export function createWatchStatusReporter(system: System, pretty?: boolean): WatchStatusReporter {
        return pretty ?
            (diagnostic, newLine, options) => {
                clearScreenIfNotWatchingForFileChanges(system, diagnostic, options);
                let output = `[${formatColorAndReset(getLocaleTimeString(system), ForegroundColorEscapeSequences.Grey)}] `;
                output += `${flattenDiagnosticMessageText(diagnostic.messageText, system.newLine)}${newLine + newLine}`;
                system.write(output);
            } :
            (diagnostic, newLine, options) => {
                let output = "";

                if (!clearScreenIfNotWatchingForFileChanges(system, diagnostic, options)) {
                    output += newLine;
                }

                output += `${getLocaleTimeString(system)} - `;
                output += `${flattenDiagnosticMessageText(diagnostic.messageText, system.newLine)}${getPlainDiagnosticFollowingNewLines(diagnostic, newLine)}`;

                system.write(output);
            };
    }

    /** Parses config file using System interface */
    export function parseConfigFileWithSystem(configFileName: string, optionsToExtend: CompilerOptions, system: System, reportDiagnostic: DiagnosticReporter) {
        const host: ParseConfigFileHost = <any>system;
        host.onUnRecoverableConfigFileDiagnostic = diagnostic => reportUnrecoverableDiagnostic(system, reportDiagnostic, diagnostic);
        const result = getParsedCommandLineOfConfigFile(configFileName, optionsToExtend, host);
        host.onUnRecoverableConfigFileDiagnostic = undefined!; // TODO: GH#18217
        return result;
    }

    export function getErrorCountForSummary(diagnostics: readonly Diagnostic[]) {
        return countWhere(diagnostics, diagnostic => diagnostic.category === DiagnosticCategory.Error);
    }

    export function getWatchErrorSummaryDiagnosticMessage(errorCount: number) {
        return errorCount === 1 ?
            Diagnostics.Found_1_error_Watching_for_file_changes :
            Diagnostics.Found_0_errors_Watching_for_file_changes;
    }

    export function getErrorSummaryText(errorCount: number, newLine: string) {
        if (errorCount === 0) return "";
        const d = createCompilerDiagnostic(errorCount === 1 ? Diagnostics.Found_1_error : Diagnostics.Found_0_errors, errorCount);
        return `${newLine}${flattenDiagnosticMessageText(d.messageText, newLine)}${newLine}${newLine}`;
    }

    /**
     * Program structure needed to emit the files and report diagnostics
     */
    export interface ProgramToEmitFilesAndReportErrors {
        getCurrentDirectory(): string;
        getCompilerOptions(): CompilerOptions;
        getSourceFiles(): readonly SourceFile[];
        getSyntacticDiagnostics(sourceFile?: SourceFile, cancellationToken?: CancellationToken): readonly Diagnostic[];
        getOptionsDiagnostics(cancellationToken?: CancellationToken): readonly Diagnostic[];
        getGlobalDiagnostics(cancellationToken?: CancellationToken): readonly Diagnostic[];
        getSemanticDiagnostics(sourceFile?: SourceFile, cancellationToken?: CancellationToken): readonly Diagnostic[];
        getConfigFileParsingDiagnostics(): readonly Diagnostic[];
        emit(targetSourceFile?: SourceFile, writeFile?: WriteFileCallback, cancellationToken?: CancellationToken, emitOnlyDtsFiles?: boolean, customTransformers?: CustomTransformers): EmitResult;
    }

    export function listFiles(program: ProgramToEmitFilesAndReportErrors, writeFileName: (s: string) => void) {
        if (program.getCompilerOptions().listFiles || program.getCompilerOptions().listFilesOnly) {
            forEach(program.getSourceFiles(), file => {
                writeFileName(file.fileName);
            });
        }
    }

    /**
     * Helper that emit files, report diagnostics and lists emitted and/or source files depending on compiler options
     */
    export function emitFilesAndReportErrors(
        program: ProgramToEmitFilesAndReportErrors,
        reportDiagnostic: DiagnosticReporter,
        writeFileName?: (s: string) => void,
        reportSummary?: ReportEmitErrorSummary,
        writeFile?: WriteFileCallback,
        cancellationToken?: CancellationToken,
        emitOnlyDtsFiles?: boolean,
        customTransformers?: CustomTransformers
    ) {
        const isListFilesOnly = !!program.getCompilerOptions().listFilesOnly;

        // First get and report any syntactic errors.
        const diagnostics = program.getConfigFileParsingDiagnostics().slice();
        const configFileParsingDiagnosticsLength = diagnostics.length;
        addRange(diagnostics, program.getSyntacticDiagnostics(/*sourceFile*/ undefined, cancellationToken));

        // If we didn't have any syntactic errors, then also try getting the global and
        // semantic errors.
        if (diagnostics.length === configFileParsingDiagnosticsLength) {
            addRange(diagnostics, program.getOptionsDiagnostics(cancellationToken));

            if (!isListFilesOnly) {
                addRange(diagnostics, program.getGlobalDiagnostics(cancellationToken));

                if (diagnostics.length === configFileParsingDiagnosticsLength) {
                    addRange(diagnostics, program.getSemanticDiagnostics(/*sourceFile*/ undefined, cancellationToken));
                }
            }
        }

        // Emit and report any errors we ran into.
        const emitResult = isListFilesOnly
            ? { emitSkipped: true, diagnostics: emptyArray }
            : program.emit(/*targetSourceFile*/ undefined, writeFile, cancellationToken, emitOnlyDtsFiles, customTransformers);
        const { emittedFiles, diagnostics: emitDiagnostics } = emitResult;
        addRange(diagnostics, emitDiagnostics);

        sortAndDeduplicateDiagnostics(diagnostics).forEach(reportDiagnostic);
        if (writeFileName) {
            const currentDir = program.getCurrentDirectory();
            forEach(emittedFiles, file => {
                const filepath = getNormalizedAbsolutePath(file, currentDir);
                writeFileName(`TSFILE: ${filepath}`);
            });
            listFiles(program, writeFileName);
        }

        if (reportSummary) {
            reportSummary(getErrorCountForSummary(diagnostics));
        }

        return {
            emitResult,
            diagnostics,
        };
    }

    export function emitFilesAndReportErrorsAndGetExitStatus(
        program: ProgramToEmitFilesAndReportErrors,
        reportDiagnostic: DiagnosticReporter,
        writeFileName?: (s: string) => void,
        reportSummary?: ReportEmitErrorSummary,
        writeFile?: WriteFileCallback,
        cancellationToken?: CancellationToken,
        emitOnlyDtsFiles?: boolean,
        customTransformers?: CustomTransformers
    ) {
        const { emitResult, diagnostics } = emitFilesAndReportErrors(
            program,
            reportDiagnostic,
            writeFileName,
            reportSummary,
            writeFile,
            cancellationToken,
            emitOnlyDtsFiles,
            customTransformers
        );

        if (emitResult.emitSkipped && diagnostics.length > 0) {
            // If the emitter didn't emit anything, then pass that value along.
            return ExitStatus.DiagnosticsPresent_OutputsSkipped;
        }
        else if (diagnostics.length > 0) {
            // The emitter emitted something, inform the caller if that happened in the presence
            // of diagnostics or not.
            return ExitStatus.DiagnosticsPresent_OutputsGenerated;
        }
        return ExitStatus.Success;
    }

    export const noopFileWatcher: FileWatcher = { close: noop };

    export function createWatchHost(system = sys, reportWatchStatus?: WatchStatusReporter): WatchHost {
        const onWatchStatusChange = reportWatchStatus || createWatchStatusReporter(system);
        return {
            onWatchStatusChange,
            watchFile: maybeBind(system, system.watchFile) || (() => noopFileWatcher),
            watchDirectory: maybeBind(system, system.watchDirectory) || (() => noopFileWatcher),
            setTimeout: maybeBind(system, system.setTimeout) || noop,
            clearTimeout: maybeBind(system, system.clearTimeout) || noop
        };
    }

    export const enum WatchType {
        ConfigFile = "Config file",
        SourceFile = "Source file",
        MissingFile = "Missing file",
        WildcardDirectory = "Wild card directory",
        FailedLookupLocations = "Failed Lookup Locations",
        TypeRoots = "Type roots"
    }

    interface WatchFactory<X, Y = undefined> extends ts.WatchFactory<X, Y> {
        writeLog: (s: string) => void;
    }

    export function createWatchFactory<Y = undefined>(host: { trace?(s: string): void; }, options: { extendedDiagnostics?: boolean; diagnostics?: boolean; }) {
        const watchLogLevel = host.trace ? options.extendedDiagnostics ? WatchLogLevel.Verbose : options.diagnostics ? WatchLogLevel.TriggerOnly : WatchLogLevel.None : WatchLogLevel.None;
        const writeLog: (s: string) => void = watchLogLevel !== WatchLogLevel.None ? (s => host.trace!(s)) : noop;
        const result = getWatchFactory<WatchType, Y>(watchLogLevel, writeLog) as WatchFactory<WatchType, Y>;
        result.writeLog = writeLog;
        return result;
    }

    export function createCompilerHostFromProgramHost(host: ProgramHost<any>, getCompilerOptions: () => CompilerOptions, directoryStructureHost: DirectoryStructureHost = host): CompilerHost {
        const useCaseSensitiveFileNames = host.useCaseSensitiveFileNames();
        const hostGetNewLine = memoize(() => host.getNewLine());
        return {
            getSourceFile: (fileName, languageVersion, onError) => {
                let text: string | undefined;
                try {
                    performance.mark("beforeIORead");
                    text = host.readFile(fileName, getCompilerOptions().charset);
                    performance.mark("afterIORead");
                    performance.measure("I/O Read", "beforeIORead", "afterIORead");
                }
                catch (e) {
                    if (onError) {
                        onError(e.message);
                    }
                    text = "";
                }

                return text !== undefined ? createSourceFile(fileName, text, languageVersion) : undefined;
            },
            getDefaultLibLocation: maybeBind(host, host.getDefaultLibLocation),
            getDefaultLibFileName: options => host.getDefaultLibFileName(options),
            writeFile,
            getCurrentDirectory: memoize(() => host.getCurrentDirectory()),
            useCaseSensitiveFileNames: () => useCaseSensitiveFileNames,
            getCanonicalFileName: createGetCanonicalFileName(useCaseSensitiveFileNames),
            getNewLine: () => getNewLineCharacter(getCompilerOptions(), hostGetNewLine),
            fileExists: f => host.fileExists(f),
            readFile: f => host.readFile(f),
            trace: maybeBind(host, host.trace),
            directoryExists: maybeBind(directoryStructureHost, directoryStructureHost.directoryExists),
            getDirectories: maybeBind(directoryStructureHost, directoryStructureHost.getDirectories),
            realpath: maybeBind(host, host.realpath),
            getEnvironmentVariable: maybeBind(host, host.getEnvironmentVariable) || (() => ""),
            createHash: maybeBind(host, host.createHash),
            readDirectory: maybeBind(host, host.readDirectory),
        };

        function writeFile(fileName: string, text: string, writeByteOrderMark: boolean, onError: (message: string) => void) {
            try {
                performance.mark("beforeIOWrite");

                // NOTE: If patchWriteFileEnsuringDirectory has been called,
                // the host.writeFile will do its own directory creation and
                // the ensureDirectoriesExist call will always be redundant.
                writeFileEnsuringDirectories(
                    fileName,
                    text,
                    writeByteOrderMark,
                    (path, data, writeByteOrderMark) => host.writeFile!(path, data, writeByteOrderMark),
                    path => host.createDirectory!(path),
                    path => host.directoryExists!(path));

                performance.mark("afterIOWrite");
                performance.measure("I/O Write", "beforeIOWrite", "afterIOWrite");
            }
            catch (e) {
                if (onError) {
                    onError(e.message);
                }
            }
        }
    }

    export function setGetSourceFileAsHashVersioned(compilerHost: CompilerHost, host: { createHash?(data: string): string; }) {
        const originalGetSourceFile = compilerHost.getSourceFile;
        const computeHash = host.createHash || generateDjb2Hash;
        compilerHost.getSourceFile = (...args) => {
            const result = originalGetSourceFile.call(compilerHost, ...args);
            if (result) {
                result.version = computeHash.call(host, result.text);
            }
            return result;
        };
    }

    /**
     * Creates the watch compiler host that can be extended with config file or root file names and options host
     */
    export function createProgramHost<T extends BuilderProgram = EmitAndSemanticDiagnosticsBuilderProgram>(system: System, createProgram: CreateProgram<T> | undefined): ProgramHost<T> {
        const getDefaultLibLocation = memoize(() => getDirectoryPath(normalizePath(system.getExecutingFilePath())));
        let host: DirectoryStructureHost = system;
        // TODO: `host` is unused!
        // eslint-disable-next-line no-unused-expressions
        host;
        return {
            useCaseSensitiveFileNames: () => system.useCaseSensitiveFileNames,
            getNewLine: () => system.newLine,
            getCurrentDirectory: memoize(() => system.getCurrentDirectory()),
            getDefaultLibLocation,
            getDefaultLibFileName: options => combinePaths(getDefaultLibLocation(), getDefaultLibFileName(options)),
            fileExists: path => system.fileExists(path),
            readFile: (path, encoding) => system.readFile(path, encoding),
            directoryExists: path => system.directoryExists(path),
            getDirectories: path => system.getDirectories(path),
            readDirectory: (path, extensions, exclude, include, depth) => system.readDirectory(path, extensions, exclude, include, depth),
            realpath: maybeBind(system, system.realpath),
            getEnvironmentVariable: maybeBind(system, system.getEnvironmentVariable),
            trace: s => system.write(s + system.newLine),
            createDirectory: path => system.createDirectory(path),
            writeFile: (path, data, writeByteOrderMark) => system.writeFile(path, data, writeByteOrderMark),
            onCachedDirectoryStructureHostCreate: cacheHost => host = cacheHost || system,
            createHash: maybeBind(system, system.createHash),
            createProgram: createProgram || createEmitAndSemanticDiagnosticsBuilderProgram as any as CreateProgram<T>
        };
    }

    /**
     * Creates the watch compiler host that can be extended with config file or root file names and options host
     */
    function createWatchCompilerHost<T extends BuilderProgram = EmitAndSemanticDiagnosticsBuilderProgram>(system = sys, createProgram: CreateProgram<T> | undefined, reportDiagnostic: DiagnosticReporter, reportWatchStatus?: WatchStatusReporter): WatchCompilerHost<T> {
        const writeFileName = (s: string) => system.write(s + system.newLine);
        const result = createProgramHost(system, createProgram) as WatchCompilerHost<T>;
        copyProperties(result, createWatchHost(system, reportWatchStatus));
        result.afterProgramCreate = builderProgram => {
            const compilerOptions = builderProgram.getCompilerOptions();
            const newLine = getNewLineCharacter(compilerOptions, () => system.newLine);

            emitFilesAndReportErrors(
                builderProgram,
                reportDiagnostic,
                writeFileName,
                errorCount => result.onWatchStatusChange!(
                    createCompilerDiagnostic(getWatchErrorSummaryDiagnosticMessage(errorCount), errorCount),
                    newLine,
                    compilerOptions,
                    errorCount
                )
            );
        };
        return result;
    }

    /**
     * Report error and exit
     */
    function reportUnrecoverableDiagnostic(system: System, reportDiagnostic: DiagnosticReporter, diagnostic: Diagnostic) {
        reportDiagnostic(diagnostic);
        system.exit(ExitStatus.DiagnosticsPresent_OutputsSkipped);
    }

    /**
     * Creates the watch compiler host from system for config file in watch mode
     */
    export function createWatchCompilerHostOfConfigFile<T extends BuilderProgram = EmitAndSemanticDiagnosticsBuilderProgram>(configFileName: string, optionsToExtend: CompilerOptions | undefined, system: System, createProgram?: CreateProgram<T>, reportDiagnostic?: DiagnosticReporter, reportWatchStatus?: WatchStatusReporter): WatchCompilerHostOfConfigFile<T> {
        const diagnosticReporter = reportDiagnostic || createDiagnosticReporter(system);
        const host = createWatchCompilerHost(system, createProgram, diagnosticReporter, reportWatchStatus) as WatchCompilerHostOfConfigFile<T>;
        host.onUnRecoverableConfigFileDiagnostic = diagnostic => reportUnrecoverableDiagnostic(system, diagnosticReporter, diagnostic);
        host.configFileName = configFileName;
        host.optionsToExtend = optionsToExtend;
        return host;
    }

    /**
     * Creates the watch compiler host from system for compiling root files and options in watch mode
     */
    export function createWatchCompilerHostOfFilesAndCompilerOptions<T extends BuilderProgram = EmitAndSemanticDiagnosticsBuilderProgram>(rootFiles: string[], options: CompilerOptions, system: System, createProgram?: CreateProgram<T>, reportDiagnostic?: DiagnosticReporter, reportWatchStatus?: WatchStatusReporter, projectReferences?: readonly ProjectReference[]): WatchCompilerHostOfFilesAndCompilerOptions<T> {
        const host = createWatchCompilerHost(system, createProgram, reportDiagnostic || createDiagnosticReporter(system), reportWatchStatus) as WatchCompilerHostOfFilesAndCompilerOptions<T>;
        host.rootFiles = rootFiles;
        host.options = options;
        host.projectReferences = projectReferences;
        return host;
    }

    export interface IncrementalCompilationOptions {
        rootNames: readonly string[];
        options: CompilerOptions;
        configFileParsingDiagnostics?: readonly Diagnostic[];
        projectReferences?: readonly ProjectReference[];
        host?: CompilerHost;
        reportDiagnostic?: DiagnosticReporter;
        reportErrorSummary?: ReportEmitErrorSummary;
        afterProgramEmitAndDiagnostics?(program: EmitAndSemanticDiagnosticsBuilderProgram): void;
        system?: System;
    }
    export function performIncrementalCompilation(input: IncrementalCompilationOptions) {
        const system = input.system || sys;
        const host = input.host || (input.host = createIncrementalCompilerHost(input.options, system));
        const builderProgram = createIncrementalProgram(input);
        const exitStatus = emitFilesAndReportErrorsAndGetExitStatus(
            builderProgram,
            input.reportDiagnostic || createDiagnosticReporter(system),
            s => host.trace && host.trace(s),
            input.reportErrorSummary || input.options.pretty ? errorCount => system.write(getErrorSummaryText(errorCount, system.newLine)) : undefined
        );
        if (input.afterProgramEmitAndDiagnostics) input.afterProgramEmitAndDiagnostics(builderProgram);
        return exitStatus;
    }
}

namespace ts {
    export interface ReadBuildProgramHost {
        useCaseSensitiveFileNames(): boolean;
        getCurrentDirectory(): string;
        readFile(fileName: string): string | undefined;
    }
    export function readBuilderProgram(compilerOptions: CompilerOptions, host: ReadBuildProgramHost) {
        if (compilerOptions.out || compilerOptions.outFile) return undefined;
        const buildInfoPath = getTsBuildInfoEmitOutputFilePath(compilerOptions);
        if (!buildInfoPath) return undefined;
        const content = host.readFile(buildInfoPath);
        if (!content) return undefined;
        const buildInfo = getBuildInfo(content);
        if (buildInfo.version !== version) return undefined;
        if (!buildInfo.program) return undefined;
        return createBuildProgramUsingProgramBuildInfo(buildInfo.program, buildInfoPath, host);
    }

    export function createIncrementalCompilerHost(options: CompilerOptions, system = sys): CompilerHost {
        const host = createCompilerHostWorker(options, /*setParentNodes*/ undefined, system);
        host.createHash = maybeBind(system, system.createHash);
        setGetSourceFileAsHashVersioned(host, system);
        changeCompilerHostLikeToUseCache(host, fileName => toPath(fileName, host.getCurrentDirectory(), host.getCanonicalFileName));
        return host;
    }

    export interface IncrementalProgramOptions<T extends BuilderProgram> {
        rootNames: readonly string[];
        options: CompilerOptions;
        configFileParsingDiagnostics?: readonly Diagnostic[];
        projectReferences?: readonly ProjectReference[];
        host?: CompilerHost;
        createProgram?: CreateProgram<T>;
    }

    export function createIncrementalProgram<T extends BuilderProgram = EmitAndSemanticDiagnosticsBuilderProgram>({
        rootNames, options, configFileParsingDiagnostics, projectReferences, host, createProgram
    }: IncrementalProgramOptions<T>): T {
        host = host || createIncrementalCompilerHost(options);
        createProgram = createProgram || createEmitAndSemanticDiagnosticsBuilderProgram as any as CreateProgram<T>;
        const oldProgram = readBuilderProgram(options, host) as any as T;
        return createProgram(rootNames, options, host, oldProgram, configFileParsingDiagnostics, projectReferences);
    }

    export type WatchStatusReporter = (diagnostic: Diagnostic, newLine: string, options: CompilerOptions, errorCount?: number) => void;
    /** Create the program with rootNames and options, if they are undefined, oldProgram and new configFile diagnostics create new program */
    export type CreateProgram<T extends BuilderProgram> = (rootNames: readonly string[] | undefined, options: CompilerOptions | undefined, host?: CompilerHost, oldProgram?: T, configFileParsingDiagnostics?: readonly Diagnostic[], projectReferences?: readonly ProjectReference[] | undefined) => T;

    /** Host that has watch functionality used in --watch mode */
    export interface WatchHost {
        /** If provided, called with Diagnostic message that informs about change in watch status */
        onWatchStatusChange?(diagnostic: Diagnostic, newLine: string, options: CompilerOptions, errorCount?: number): void;

        /** Used to watch changes in source files, missing files needed to update the program or config file */
        watchFile(path: string, callback: FileWatcherCallback, pollingInterval?: number): FileWatcher;
        /** Used to watch resolved module's failed lookup locations, config file specs, type roots where auto type reference directives are added */
        watchDirectory(path: string, callback: DirectoryWatcherCallback, recursive?: boolean): FileWatcher;
        /** If provided, will be used to set delayed compilation, so that multiple changes in short span are compiled together */
        setTimeout?(callback: (...args: any[]) => void, ms: number, ...args: any[]): any;
        /** If provided, will be used to reset existing delayed compilation */
        clearTimeout?(timeoutId: any): void;
    }
    export interface ProgramHost<T extends BuilderProgram> {
        /**
         * Used to create the program when need for program creation or recreation detected
         */
        createProgram: CreateProgram<T>;

        // Sub set of compiler host methods to read and generate new program
        useCaseSensitiveFileNames(): boolean;
        getNewLine(): string;
        getCurrentDirectory(): string;
        getDefaultLibFileName(options: CompilerOptions): string;
        getDefaultLibLocation?(): string;
        createHash?(data: string): string;

        /**
         * Use to check file presence for source files and
         * if resolveModuleNames is not provided (complier is in charge of module resolution) then module files as well
         */
        fileExists(path: string): boolean;
        /**
         * Use to read file text for source files and
         * if resolveModuleNames is not provided (complier is in charge of module resolution) then module files as well
         */
        readFile(path: string, encoding?: string): string | undefined;

        /** If provided, used for module resolution as well as to handle directory structure */
        directoryExists?(path: string): boolean;
        /** If provided, used in resolutions as well as handling directory structure */
        getDirectories?(path: string): string[];
        /** If provided, used to cache and handle directory structure modifications */
        readDirectory?(path: string, extensions?: readonly string[], exclude?: readonly string[], include?: readonly string[], depth?: number): string[];

        /** Symbol links resolution */
        realpath?(path: string): string;
        /** If provided would be used to write log about compilation */
        trace?(s: string): void;
        /** If provided is used to get the environment variable */
        getEnvironmentVariable?(name: string): string | undefined;

        /** If provided, used to resolve the module names, otherwise typescript's default module resolution */
        resolveModuleNames?(moduleNames: string[], containingFile: string, reusedNames: string[] | undefined, redirectedReference: ResolvedProjectReference | undefined, options: CompilerOptions): (ResolvedModule | undefined)[];
        /** If provided, used to resolve type reference directives, otherwise typescript's default resolution */
        resolveTypeReferenceDirectives?(typeReferenceDirectiveNames: string[], containingFile: string, redirectedReference: ResolvedProjectReference | undefined, options: CompilerOptions): (ResolvedTypeReferenceDirective | undefined)[];
    }
    /** Internal interface used to wire emit through same host */

    /*@internal*/
    export interface ProgramHost<T extends BuilderProgram> {
        // TODO: GH#18217 Optional methods are frequently asserted
        createDirectory?(path: string): void;
        writeFile?(path: string, data: string, writeByteOrderMark?: boolean): void;
        onCachedDirectoryStructureHostCreate?(host: CachedDirectoryStructureHost): void;
    }

    export interface WatchCompilerHost<T extends BuilderProgram> extends ProgramHost<T>, WatchHost {
        /** If provided, callback to invoke after every new program creation */
        afterProgramCreate?(program: T): void;

        // Only for testing
        /*@internal*/
        maxNumberOfFilesToIterateForInvalidation?: number;
    }

    /**
     * Host to create watch with root files and options
     */
    export interface WatchCompilerHostOfFilesAndCompilerOptions<T extends BuilderProgram> extends WatchCompilerHost<T> {
        /** root files to use to generate program */
        rootFiles: string[];

        /** Compiler options */
        options: CompilerOptions;

        /** Project References */
        projectReferences?: readonly ProjectReference[];
    }

    /**
     * Host to create watch with config file
     */
    export interface WatchCompilerHostOfConfigFile<T extends BuilderProgram> extends WatchCompilerHost<T>, ConfigFileDiagnosticsReporter {
        /** Name of the config file to compile */
        configFileName: string;

        /** Options to extend */
        optionsToExtend?: CompilerOptions;

        /**
         * Used to generate source file names from the config file and its include, exclude, files rules
         * and also to cache the directory stucture
         */
        readDirectory(path: string, extensions?: readonly string[], exclude?: readonly string[], include?: readonly string[], depth?: number): string[];
    }

    /**
     * Host to create watch with config file that is already parsed (from tsc)
     */
    /*@internal*/
    export interface WatchCompilerHostOfConfigFile<T extends BuilderProgram> extends WatchCompilerHost<T> {
        optionsToExtend?: CompilerOptions;
        configFileParsingResult?: ParsedCommandLine;
    }

    export interface Watch<T> {
        /** Synchronize with host and get updated program */
        getProgram(): T;
        /** Gets the existing program without synchronizing with changes on host */
        /*@internal*/
        getCurrentProgram(): T;
        /** Closes the watch */
        close(): void;
    }

    /**
     * Creates the watch what generates program using the config file
     */
    export interface WatchOfConfigFile<T> extends Watch<T> {
    }

    /**
     * Creates the watch that generates program using the root files and compiler options
     */
    export interface WatchOfFilesAndCompilerOptions<T> extends Watch<T> {
        /** Updates the root files in the program, only if this is not config file compilation */
        updateRootFileNames(fileNames: string[]): void;
    }

    /**
     * Create the watch compiler host for either configFile or fileNames and its options
     */
    export function createWatchCompilerHost<T extends BuilderProgram>(configFileName: string, optionsToExtend: CompilerOptions | undefined, system: System, createProgram?: CreateProgram<T>, reportDiagnostic?: DiagnosticReporter, reportWatchStatus?: WatchStatusReporter): WatchCompilerHostOfConfigFile<T>;
    export function createWatchCompilerHost<T extends BuilderProgram>(rootFiles: string[], options: CompilerOptions, system: System, createProgram?: CreateProgram<T>, reportDiagnostic?: DiagnosticReporter, reportWatchStatus?: WatchStatusReporter, projectReferences?: readonly ProjectReference[]): WatchCompilerHostOfFilesAndCompilerOptions<T>;
    export function createWatchCompilerHost<T extends BuilderProgram>(rootFilesOrConfigFileName: string | string[], options: CompilerOptions | undefined, system: System, createProgram?: CreateProgram<T>, reportDiagnostic?: DiagnosticReporter, reportWatchStatus?: WatchStatusReporter, projectReferences?: readonly ProjectReference[]): WatchCompilerHostOfFilesAndCompilerOptions<T> | WatchCompilerHostOfConfigFile<T> {
        if (isArray(rootFilesOrConfigFileName)) {
            return createWatchCompilerHostOfFilesAndCompilerOptions(rootFilesOrConfigFileName, options!, system, createProgram, reportDiagnostic, reportWatchStatus, projectReferences); // TODO: GH#18217
        }
        else {
            return createWatchCompilerHostOfConfigFile(rootFilesOrConfigFileName, options, system, createProgram, reportDiagnostic, reportWatchStatus);
        }
    }

    /**
     * Creates the watch from the host for root files and compiler options
     */
    export function createWatchProgram<T extends BuilderProgram>(host: WatchCompilerHostOfFilesAndCompilerOptions<T>): WatchOfFilesAndCompilerOptions<T>;
    /**
     * Creates the watch from the host for config file
     */
    export function createWatchProgram<T extends BuilderProgram>(host: WatchCompilerHostOfConfigFile<T>): WatchOfConfigFile<T>;
    export function createWatchProgram<T extends BuilderProgram>(host: WatchCompilerHostOfFilesAndCompilerOptions<T> & WatchCompilerHostOfConfigFile<T>): WatchOfFilesAndCompilerOptions<T> | WatchOfConfigFile<T> {
        interface FilePresentOnHost {
            version: string;
            sourceFile: SourceFile;
            fileWatcher: FileWatcher;
        }
        type FileMissingOnHost = false;
        interface FilePresenceUnknownOnHost {
            version: false;
            fileWatcher?: FileWatcher;
        }
        type FileMayBePresentOnHost = FilePresentOnHost | FilePresenceUnknownOnHost;
        type HostFileInfo = FilePresentOnHost | FileMissingOnHost | FilePresenceUnknownOnHost;

        let builderProgram: T;
        let reloadLevel: ConfigFileProgramReloadLevel;                      // level to indicate if the program needs to be reloaded from config file/just filenames etc
        let missingFilesMap: Map<FileWatcher>;                              // Map of file watchers for the missing files
        let watchedWildcardDirectories: Map<WildcardDirectoryWatcher>;      // map of watchers for the wild card directories in the config file
        let timerToUpdateProgram: any;                                      // timer callback to recompile the program

        const sourceFilesCache = createMap<HostFileInfo>();                 // Cache that stores the source file and version info
        let missingFilePathsRequestedForRelease: Path[] | undefined;        // These paths are held temparirly so that we can remove the entry from source file cache if the file is not tracked by missing files
        let hasChangedCompilerOptions = false;                              // True if the compiler options have changed between compilations
        let hasChangedAutomaticTypeDirectiveNames = false;                  // True if the automatic type directives have changed

        const useCaseSensitiveFileNames = host.useCaseSensitiveFileNames();
        const currentDirectory = host.getCurrentDirectory();
        const { configFileName, optionsToExtend: optionsToExtendForConfigFile = {}, createProgram } = host;
        let { rootFiles: rootFileNames, options: compilerOptions, projectReferences } = host;
        let configFileSpecs: ConfigFileSpecs;
        let configFileParsingDiagnostics: Diagnostic[] | undefined;
        let canConfigFileJsonReportNoInputFiles = false;
        let hasChangedConfigFileParsingErrors = false;

        const cachedDirectoryStructureHost = configFileName === undefined ? undefined : createCachedDirectoryStructureHost(host, currentDirectory, useCaseSensitiveFileNames);
        if (cachedDirectoryStructureHost && host.onCachedDirectoryStructureHostCreate) {
            host.onCachedDirectoryStructureHostCreate(cachedDirectoryStructureHost);
        }
        const directoryStructureHost: DirectoryStructureHost = cachedDirectoryStructureHost || host;
        const parseConfigFileHost = parseConfigHostFromCompilerHostLike(host, directoryStructureHost);

        // From tsc we want to get already parsed result and hence check for rootFileNames
        let newLine = updateNewLine();
        if (configFileName && host.configFileParsingResult) {
            setConfigFileParsingResult(host.configFileParsingResult);
            newLine = updateNewLine();
        }
        reportWatchDiagnostic(Diagnostics.Starting_compilation_in_watch_mode);
        if (configFileName && !host.configFileParsingResult) {
            newLine = getNewLineCharacter(optionsToExtendForConfigFile, () => host.getNewLine());
            Debug.assert(!rootFileNames);
            parseConfigFile();
            newLine = updateNewLine();
        }

        const { watchFile, watchFilePath, watchDirectory, writeLog } = createWatchFactory<string>(host, compilerOptions);
        const getCanonicalFileName = createGetCanonicalFileName(useCaseSensitiveFileNames);

        writeLog(`Current directory: ${currentDirectory} CaseSensitiveFileNames: ${useCaseSensitiveFileNames}`);
        let configFileWatcher: FileWatcher | undefined;
        if (configFileName) {
            configFileWatcher = watchFile(host, configFileName, scheduleProgramReload, PollingInterval.High, WatchType.ConfigFile);
        }

        const compilerHost = createCompilerHostFromProgramHost(host, () => compilerOptions, directoryStructureHost) as CompilerHost & ResolutionCacheHost;
        setGetSourceFileAsHashVersioned(compilerHost, host);
        // Members for CompilerHost
        const getNewSourceFile = compilerHost.getSourceFile;
        compilerHost.getSourceFile = (fileName, ...args) => getVersionedSourceFileByPath(fileName, toPath(fileName), ...args);
        compilerHost.getSourceFileByPath = getVersionedSourceFileByPath;
        compilerHost.getNewLine = () => newLine;
        compilerHost.fileExists = fileExists;
        compilerHost.onReleaseOldSourceFile = onReleaseOldSourceFile;
        // Members for ResolutionCacheHost
        compilerHost.toPath = toPath;
        compilerHost.getCompilationSettings = () => compilerOptions;
        compilerHost.watchDirectoryOfFailedLookupLocation = (dir, cb, flags) => watchDirectory(host, dir, cb, flags, WatchType.FailedLookupLocations);
        compilerHost.watchTypeRootsDirectory = (dir, cb, flags) => watchDirectory(host, dir, cb, flags, WatchType.TypeRoots);
        compilerHost.getCachedDirectoryStructureHost = () => cachedDirectoryStructureHost;
        compilerHost.onInvalidatedResolution = scheduleProgramUpdate;
        compilerHost.onChangedAutomaticTypeDirectiveNames = () => {
            hasChangedAutomaticTypeDirectiveNames = true;
            scheduleProgramUpdate();
        };
        compilerHost.fileIsOpen = returnFalse;
        compilerHost.maxNumberOfFilesToIterateForInvalidation = host.maxNumberOfFilesToIterateForInvalidation;
        compilerHost.getCurrentProgram = getCurrentProgram;
        compilerHost.writeLog = writeLog;

        // Cache for the module resolution
        const resolutionCache = createResolutionCache(compilerHost,
            configFileName ?
                getDirectoryPath(getNormalizedAbsolutePath(configFileName, currentDirectory)) :
                currentDirectory,
            /*logChangesWhenResolvingModule*/ false
        );
        // Resolve module using host module resolution strategy if provided otherwise use resolution cache to resolve module names
        compilerHost.resolveModuleNames = host.resolveModuleNames ?
            ((...args) => host.resolveModuleNames!(...args)) :
            ((moduleNames, containingFile, reusedNames, redirectedReference) => resolutionCache.resolveModuleNames(moduleNames, containingFile, reusedNames, redirectedReference));
        compilerHost.resolveTypeReferenceDirectives = host.resolveTypeReferenceDirectives ?
            ((...args) => host.resolveTypeReferenceDirectives!(...args)) :
            ((typeDirectiveNames, containingFile, redirectedReference) => resolutionCache.resolveTypeReferenceDirectives(typeDirectiveNames, containingFile, redirectedReference));
        const userProvidedResolution = !!host.resolveModuleNames || !!host.resolveTypeReferenceDirectives;

        builderProgram = readBuilderProgram(compilerOptions, compilerHost) as any as T;
        synchronizeProgram();

        // Update the wild card directory watch
        watchConfigFileWildCardDirectories();

        return configFileName ?
            { getCurrentProgram: getCurrentBuilderProgram, getProgram: synchronizeProgram, close } :
            { getCurrentProgram: getCurrentBuilderProgram, getProgram: synchronizeProgram, updateRootFileNames, close };

        function close() {
            resolutionCache.clear();
            clearMap(sourceFilesCache, value => {
                if (value && value.fileWatcher) {
                    value.fileWatcher.close();
                    value.fileWatcher = undefined;
                }
            });
            if (configFileWatcher) {
                configFileWatcher.close();
                configFileWatcher = undefined;
            }
            if (watchedWildcardDirectories) {
                clearMap(watchedWildcardDirectories, closeFileWatcherOf);
                watchedWildcardDirectories = undefined!;
            }
            if (missingFilesMap) {
                clearMap(missingFilesMap, closeFileWatcher);
                missingFilesMap = undefined!;
            }
        }

        function getCurrentBuilderProgram() {
            return builderProgram;
        }

        function getCurrentProgram() {
            return builderProgram && builderProgram.getProgramOrUndefined();
        }

        function synchronizeProgram() {
            writeLog(`Synchronizing program`);

            const program = getCurrentBuilderProgram();
            if (hasChangedCompilerOptions) {
                newLine = updateNewLine();
                if (program && changesAffectModuleResolution(program.getCompilerOptions(), compilerOptions)) {
                    resolutionCache.clear();
                }
            }

            // All resolutions are invalid if user provided resolutions
            const hasInvalidatedResolution = resolutionCache.createHasInvalidatedResolution(userProvidedResolution);
            if (isProgramUptoDate(getCurrentProgram(), rootFileNames, compilerOptions, getSourceVersion, fileExists, hasInvalidatedResolution, hasChangedAutomaticTypeDirectiveNames, projectReferences)) {
                if (hasChangedConfigFileParsingErrors) {
                    builderProgram = createProgram(/*rootNames*/ undefined, /*options*/ undefined, compilerHost, builderProgram, configFileParsingDiagnostics, projectReferences);
                    hasChangedConfigFileParsingErrors = false;
                }
            }
            else {
                createNewProgram(hasInvalidatedResolution);
            }

            if (host.afterProgramCreate) {
                host.afterProgramCreate(builderProgram);
            }

            return builderProgram;
        }

        function createNewProgram(hasInvalidatedResolution: HasInvalidatedResolution) {
            // Compile the program
            writeLog("CreatingProgramWith::");
            writeLog(`  roots: ${JSON.stringify(rootFileNames)}`);
            writeLog(`  options: ${JSON.stringify(compilerOptions)}`);

            const needsUpdateInTypeRootWatch = hasChangedCompilerOptions || !getCurrentProgram();
            hasChangedCompilerOptions = false;
            hasChangedConfigFileParsingErrors = false;
            resolutionCache.startCachingPerDirectoryResolution();
            compilerHost.hasInvalidatedResolution = hasInvalidatedResolution;
            compilerHost.hasChangedAutomaticTypeDirectiveNames = hasChangedAutomaticTypeDirectiveNames;
            builderProgram = createProgram(rootFileNames, compilerOptions, compilerHost, builderProgram, configFileParsingDiagnostics, projectReferences);
            resolutionCache.finishCachingPerDirectoryResolution();

            // Update watches
            updateMissingFilePathsWatch(builderProgram.getProgram(), missingFilesMap || (missingFilesMap = createMap()), watchMissingFilePath);
            if (needsUpdateInTypeRootWatch) {
                resolutionCache.updateTypeRootsWatch();
            }

            if (missingFilePathsRequestedForRelease) {
                // These are the paths that program creater told us as not in use any more but were missing on the disk.
                // We didnt remove the entry for them from sourceFiles cache so that we dont have to do File IO,
                // if there is already watcher for it (for missing files)
                // At this point our watches were updated, hence now we know that these paths are not tracked and need to be removed
                // so that at later time we have correct result of their presence
                for (const missingFilePath of missingFilePathsRequestedForRelease) {
                    if (!missingFilesMap.has(missingFilePath)) {
                        sourceFilesCache.delete(missingFilePath);
                    }
                }
                missingFilePathsRequestedForRelease = undefined;
            }
        }

        function updateRootFileNames(files: string[]) {
            Debug.assert(!configFileName, "Cannot update root file names with config file watch mode");
            rootFileNames = files;
            scheduleProgramUpdate();
        }

        function updateNewLine() {
            return getNewLineCharacter(compilerOptions || optionsToExtendForConfigFile, () => host.getNewLine());
        }

        function toPath(fileName: string) {
            return ts.toPath(fileName, currentDirectory, getCanonicalFileName);
        }

        function isFileMissingOnHost(hostSourceFile: HostFileInfo | undefined): hostSourceFile is FileMissingOnHost {
            return typeof hostSourceFile === "boolean";
        }

        function isFilePresenceUnknownOnHost(hostSourceFile: FileMayBePresentOnHost): hostSourceFile is FilePresenceUnknownOnHost {
            return typeof (hostSourceFile as FilePresenceUnknownOnHost).version === "boolean";
        }

        function fileExists(fileName: string) {
            const path = toPath(fileName);
            // If file is missing on host from cache, we can definitely say file doesnt exist
            // otherwise we need to ensure from the disk
            if (isFileMissingOnHost(sourceFilesCache.get(path))) {
                return true;
            }

            return directoryStructureHost.fileExists(fileName);
        }

        function getVersionedSourceFileByPath(fileName: string, path: Path, languageVersion: ScriptTarget, onError?: (message: string) => void, shouldCreateNewSourceFile?: boolean): SourceFile | undefined {
            const hostSourceFile = sourceFilesCache.get(path);
            // No source file on the host
            if (isFileMissingOnHost(hostSourceFile)) {
                return undefined;
            }

            // Create new source file if requested or the versions dont match
            if (hostSourceFile === undefined || shouldCreateNewSourceFile || isFilePresenceUnknownOnHost(hostSourceFile)) {
                const sourceFile = getNewSourceFile(fileName, languageVersion, onError);
                if (hostSourceFile) {
                    if (sourceFile) {
                        // Set the source file and create file watcher now that file was present on the disk
                        (hostSourceFile as FilePresentOnHost).sourceFile = sourceFile;
                        hostSourceFile.version = sourceFile.version;
                        if (!hostSourceFile.fileWatcher) {
                            hostSourceFile.fileWatcher = watchFilePath(host, fileName, onSourceFileChange, PollingInterval.Low, path, WatchType.SourceFile);
                        }
                    }
                    else {
                        // There is no source file on host any more, close the watch, missing file paths will track it
                        if (hostSourceFile.fileWatcher) {
                            hostSourceFile.fileWatcher.close();
                        }
                        sourceFilesCache.set(path, false);
                    }
                }
                else {
                    if (sourceFile) {
                        const fileWatcher = watchFilePath(host, fileName, onSourceFileChange, PollingInterval.Low, path, WatchType.SourceFile);
                        sourceFilesCache.set(path, { sourceFile, version: sourceFile.version, fileWatcher });
                    }
                    else {
                        sourceFilesCache.set(path, false);
                    }
                }
                return sourceFile;
            }
            return hostSourceFile.sourceFile;
        }

        function nextSourceFileVersion(path: Path) {
            const hostSourceFile = sourceFilesCache.get(path);
            if (hostSourceFile !== undefined) {
                if (isFileMissingOnHost(hostSourceFile)) {
                    // The next version, lets set it as presence unknown file
                    sourceFilesCache.set(path, { version: false });
                }
                else {
                    (hostSourceFile as FilePresenceUnknownOnHost).version = false;
                }
            }
        }

        function getSourceVersion(path: Path): string | undefined {
            const hostSourceFile = sourceFilesCache.get(path);
            return !hostSourceFile || !hostSourceFile.version ? undefined : hostSourceFile.version;
        }

        function onReleaseOldSourceFile(oldSourceFile: SourceFile, _oldOptions: CompilerOptions, hasSourceFileByPath: boolean) {
            const hostSourceFileInfo = sourceFilesCache.get(oldSourceFile.resolvedPath);
            // If this is the source file thats in the cache and new program doesnt need it,
            // remove the cached entry.
            // Note we arent deleting entry if file became missing in new program or
            // there was version update and new source file was created.
            if (hostSourceFileInfo !== undefined) {
                // record the missing file paths so they can be removed later if watchers arent tracking them
                if (isFileMissingOnHost(hostSourceFileInfo)) {
                    (missingFilePathsRequestedForRelease || (missingFilePathsRequestedForRelease = [])).push(oldSourceFile.path);
                }
                else if ((hostSourceFileInfo as FilePresentOnHost).sourceFile === oldSourceFile) {
                    if (hostSourceFileInfo.fileWatcher) {
                        hostSourceFileInfo.fileWatcher.close();
                    }
                    sourceFilesCache.delete(oldSourceFile.resolvedPath);
                    if (!hasSourceFileByPath) {
                        resolutionCache.removeResolutionsOfFile(oldSourceFile.path);
                    }
                }
            }
        }

        function reportWatchDiagnostic(message: DiagnosticMessage) {
            if (host.onWatchStatusChange) {
                host.onWatchStatusChange(createCompilerDiagnostic(message), newLine, compilerOptions || optionsToExtendForConfigFile);
            }
        }

        // Upon detecting a file change, wait for 250ms and then perform a recompilation. This gives batch
        // operations (such as saving all modified files in an editor) a chance to complete before we kick
        // off a new compilation.
        function scheduleProgramUpdate() {
            if (!host.setTimeout || !host.clearTimeout) {
                return;
            }

            if (timerToUpdateProgram) {
                host.clearTimeout(timerToUpdateProgram);
            }
            writeLog("Scheduling update");
            timerToUpdateProgram = host.setTimeout(updateProgram, 250);
        }

        function scheduleProgramReload() {
            Debug.assert(!!configFileName);
            reloadLevel = ConfigFileProgramReloadLevel.Full;
            scheduleProgramUpdate();
        }

        function updateProgram() {
            timerToUpdateProgram = undefined;
            reportWatchDiagnostic(Diagnostics.File_change_detected_Starting_incremental_compilation);

            switch (reloadLevel) {
                case ConfigFileProgramReloadLevel.Partial:
                    perfLogger.logStartUpdateProgram("PartialConfigReload");
                    reloadFileNamesFromConfigFile();
                    break;
                case ConfigFileProgramReloadLevel.Full:
                    perfLogger.logStartUpdateProgram("FullConfigReload");
                    reloadConfigFile();
                    break;
                default:
                    perfLogger.logStartUpdateProgram("SynchronizeProgram");
                    synchronizeProgram();
                    break;
            }
            perfLogger.logStopUpdateProgram("Done");
        }

        function reloadFileNamesFromConfigFile() {
            writeLog("Reloading new file names and options");
            const result = getFileNamesFromConfigSpecs(configFileSpecs, getDirectoryPath(configFileName), compilerOptions, parseConfigFileHost);
            if (updateErrorForNoInputFiles(result, configFileName, configFileSpecs, configFileParsingDiagnostics!, canConfigFileJsonReportNoInputFiles)) {
                hasChangedConfigFileParsingErrors = true;
            }
            rootFileNames = result.fileNames;

            // Update the program
            synchronizeProgram();
        }

        function reloadConfigFile() {
            writeLog(`Reloading config file: ${configFileName}`);
            reloadLevel = ConfigFileProgramReloadLevel.None;

            if (cachedDirectoryStructureHost) {
                cachedDirectoryStructureHost.clearCache();
            }
            parseConfigFile();
            hasChangedCompilerOptions = true;
            synchronizeProgram();

            // Update the wild card directory watch
            watchConfigFileWildCardDirectories();
        }

        function parseConfigFile() {
            setConfigFileParsingResult(getParsedCommandLineOfConfigFile(configFileName, optionsToExtendForConfigFile, parseConfigFileHost)!); // TODO: GH#18217
        }

        function setConfigFileParsingResult(configFileParseResult: ParsedCommandLine) {
            rootFileNames = configFileParseResult.fileNames;
            compilerOptions = configFileParseResult.options;
            configFileSpecs = configFileParseResult.configFileSpecs!; // TODO: GH#18217
            projectReferences = configFileParseResult.projectReferences;
            configFileParsingDiagnostics = getConfigFileParsingDiagnostics(configFileParseResult).slice();
            canConfigFileJsonReportNoInputFiles = canJsonReportNoInutFiles(configFileParseResult.raw);
            hasChangedConfigFileParsingErrors = true;
        }

        function onSourceFileChange(fileName: string, eventKind: FileWatcherEventKind, path: Path) {
            updateCachedSystemWithFile(fileName, path, eventKind);

            // Update the source file cache
            if (eventKind === FileWatcherEventKind.Deleted && sourceFilesCache.has(path)) {
                resolutionCache.invalidateResolutionOfFile(path);
            }
            resolutionCache.removeResolutionsFromProjectReferenceRedirects(path);
            nextSourceFileVersion(path);

            // Update the program
            scheduleProgramUpdate();
        }

        function updateCachedSystemWithFile(fileName: string, path: Path, eventKind: FileWatcherEventKind) {
            if (cachedDirectoryStructureHost) {
                cachedDirectoryStructureHost.addOrDeleteFile(fileName, path, eventKind);
            }
        }

        function watchMissingFilePath(missingFilePath: Path) {
            return watchFilePath(host, missingFilePath, onMissingFileChange, PollingInterval.Medium, missingFilePath, WatchType.MissingFile);
        }

        function onMissingFileChange(fileName: string, eventKind: FileWatcherEventKind, missingFilePath: Path) {
            updateCachedSystemWithFile(fileName, missingFilePath, eventKind);

            if (eventKind === FileWatcherEventKind.Created && missingFilesMap.has(missingFilePath)) {
                missingFilesMap.get(missingFilePath)!.close();
                missingFilesMap.delete(missingFilePath);

                // Delete the entry in the source files cache so that new source file is created
                nextSourceFileVersion(missingFilePath);

                // When a missing file is created, we should update the graph.
                scheduleProgramUpdate();
            }
        }

        function watchConfigFileWildCardDirectories() {
            if (configFileSpecs) {
                updateWatchingWildcardDirectories(
                    watchedWildcardDirectories || (watchedWildcardDirectories = createMap()),
                    createMapFromTemplate(configFileSpecs.wildcardDirectories),
                    watchWildcardDirectory
                );
            }
            else if (watchedWildcardDirectories) {
                clearMap(watchedWildcardDirectories, closeFileWatcherOf);
            }
        }

        function watchWildcardDirectory(directory: string, flags: WatchDirectoryFlags) {
            return watchDirectory(
                host,
                directory,
                fileOrDirectory => {
                    Debug.assert(!!configFileName);

                    const fileOrDirectoryPath = toPath(fileOrDirectory);

                    // Since the file existance changed, update the sourceFiles cache
                    if (cachedDirectoryStructureHost) {
                        cachedDirectoryStructureHost.addOrDeleteFileOrDirectory(fileOrDirectory, fileOrDirectoryPath);
                    }
                    nextSourceFileVersion(fileOrDirectoryPath);

                    if (isPathIgnored(fileOrDirectoryPath)) return;

                    // If the the added or created file or directory is not supported file name, ignore the file
                    // But when watched directory is added/removed, we need to reload the file list
                    if (fileOrDirectoryPath !== directory && hasExtension(fileOrDirectoryPath) && !isSupportedSourceFileName(fileOrDirectory, compilerOptions)) {
                        writeLog(`Project: ${configFileName} Detected file add/remove of non supported extension: ${fileOrDirectory}`);
                        return;
                    }

                    // Reload is pending, do the reload
                    if (reloadLevel !== ConfigFileProgramReloadLevel.Full) {
                        reloadLevel = ConfigFileProgramReloadLevel.Partial;

                        // Schedule Update the program
                        scheduleProgramUpdate();
                    }
                },
                flags,
                WatchType.WildcardDirectory
            );
        }
    }
}
