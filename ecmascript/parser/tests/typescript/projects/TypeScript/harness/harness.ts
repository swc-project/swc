// Block scoped definitions work poorly for global variables, temporarily enable var
/* eslint-disable no-var */

// this will work in the browser via browserify
var _chai: typeof chai = require("chai");
var assert: typeof _chai.assert = _chai.assert;
{
    // chai's builtin `assert.isFalse` is featureful but slow - we don't use those features,
    // so we'll just overwrite it as an alterative to migrating a bunch of code off of chai
    assert.isFalse = (expr: any, msg: string) => { if (expr !== false) throw new Error(msg); };

    const assertDeepImpl = assert.deepEqual;
    assert.deepEqual = (a, b, msg) => {
        if (ts.isArray(a) && ts.isArray(b)) {
            assertDeepImpl(arrayExtraKeysObject(a), arrayExtraKeysObject(b), "Array extra keys differ");
        }
        assertDeepImpl(a, b, msg);

        function arrayExtraKeysObject(a: readonly ({} | null | undefined)[]): object {
            const obj: { [key: string]: {} | null | undefined } = {};
            for (const key in a) {
                if (Number.isNaN(Number(key))) {
                    obj[key] = a[key];
                }
            }
            return obj;
        }
    };
}

var global: NodeJS.Global = Function("return this").call(undefined); // eslint-disable-line no-new-func

declare var window: {};
declare var XMLHttpRequest: new() => XMLHttpRequest;

interface XMLHttpRequest {
    readonly readyState: number;
    readonly responseText: string;
    readonly status: number;
    readonly statusText: string;
    open(method: string, url: string, async?: boolean, user?: string, password?: string): void;
    send(data?: string): void;
    setRequestHeader(header: string, value: string): void;
    getAllResponseHeaders(): string;
    getResponseHeader(header: string): string | null;
    overrideMimeType(mime: string): void;
}
/* eslint-enable no-var */

namespace Utils {
    export function encodeString(s: string): string {
        return ts.sys.bufferFrom!(s).toString("utf8");
    }

    export function byteLength(s: string, encoding?: string): number {
        // stub implementation if Buffer is not available (in-browser case)
        return Buffer.byteLength(s, encoding as ts.BufferEncoding | undefined);
    }

    export function evalFile(fileContents: string, fileName: string, nodeContext?: any) {
        const vm = require("vm");
        if (nodeContext) {
            vm.runInNewContext(fileContents, nodeContext, fileName);
        }
        else {
            vm.runInThisContext(fileContents, fileName);
        }
    }

    /** Splits the given string on \r\n, or on only \n if that fails, or on only \r if *that* fails. */
    export function splitContentByNewlines(content: string) {
        // Split up the input file by line
        // Note: IE JS engine incorrectly handles consecutive delimiters here when using RegExp split, so
        // we have to use string-based splitting instead and try to figure out the delimiting chars
        let lines = content.split("\r\n");
        if (lines.length === 1) {
            lines = content.split("\n");

            if (lines.length === 1) {
                lines = content.split("\r");
            }
        }
        return lines;
    }

    /** Reads a file under /tests */
    export function readTestFile(path: string) {
        if (path.indexOf("tests") < 0) {
            path = "tests/" + path;
        }

        let content: string | undefined;
        try {
            content = Harness.IO.readFile(Harness.userSpecifiedRoot + path);
        }
        catch (err) {
            return undefined;
        }

        return content;
    }

    export function memoize<T extends ts.AnyFunction>(f: T, memoKey: (...anything: any[]) => string): T {
        const cache = ts.createMap<any>();

        return <any>(function(this: any, ...args: any[]) {
            const key = memoKey(...args);
            if (cache.has(key)) {
                return cache.get(key);
            }
            else {
                const value = f.apply(this, args);
                cache.set(key, value);
                return value;
            }
        });
    }

    export const canonicalizeForHarness = ts.createGetCanonicalFileName(/*caseSensitive*/ false); // This is done so tests work on windows _and_ linux

    export function assertInvariants(node: ts.Node | undefined, parent: ts.Node | undefined): void {
        if (node) {
            assert.isFalse(node.pos < 0, "node.pos < 0");
            assert.isFalse(node.end < 0, "node.end < 0");
            assert.isFalse(node.end < node.pos, "node.end < node.pos");
            assert.equal(node.parent, parent, "node.parent !== parent");

            if (parent) {
                // Make sure each child is contained within the parent.
                assert.isFalse(node.pos < parent.pos, "node.pos < parent.pos");
                assert.isFalse(node.end > parent.end, "node.end > parent.end");
            }

            ts.forEachChild(node, child => {
                assertInvariants(child, node);
            });

            // Make sure each of the children is in order.
            let currentPos = 0;
            ts.forEachChild(node,
                child => {
                    assert.isFalse(child.pos < currentPos, "child.pos < currentPos");
                    currentPos = child.end;
                },
                array => {
                    assert.isFalse(array.pos < node.pos, "array.pos < node.pos");
                    assert.isFalse(array.end > node.end, "array.end > node.end");
                    assert.isFalse(array.pos < currentPos, "array.pos < currentPos");

                    for (const item of array) {
                        assert.isFalse(item.pos < currentPos, "array[i].pos < currentPos");
                        currentPos = item.end;
                    }

                    currentPos = array.end;
                });

            const childNodesAndArrays: any[] = [];
            ts.forEachChild(node, child => { childNodesAndArrays.push(child); }, array => { childNodesAndArrays.push(array); });

            for (const childName in node) {
                if (childName === "parent" || childName === "nextContainer" || childName === "modifiers" || childName === "externalModuleIndicator" ||
                    // for now ignore jsdoc comments
                    childName === "jsDocComment" || childName === "checkJsDirective" || childName === "commonJsModuleIndicator") {
                    continue;
                }
                const child = (<any>node)[childName];
                if (isNodeOrArray(child)) {
                    assert.isFalse(childNodesAndArrays.indexOf(child) < 0,
                        "Missing child when forEach'ing over node: " + (<any>ts).SyntaxKind[node.kind] + "-" + childName);
                }
            }
        }
    }

    function isNodeOrArray(a: any): boolean {
        return a !== undefined && typeof a.pos === "number";
    }

    export function convertDiagnostics(diagnostics: readonly ts.Diagnostic[]) {
        return diagnostics.map(convertDiagnostic);
    }

    function convertDiagnostic(diagnostic: ts.Diagnostic) {
        return {
            start: diagnostic.start,
            length: diagnostic.length,
            messageText: ts.flattenDiagnosticMessageText(diagnostic.messageText, Harness.IO.newLine()),
            category: ts.diagnosticCategoryName(diagnostic, /*lowerCase*/ false),
            code: diagnostic.code
        };
    }

    export function sourceFileToJSON(file: ts.Node): string {
        return JSON.stringify(file, (_, v) => isNodeOrArray(v) ? serializeNode(v) : v, "    ");

        function getKindName(k: number | string): string {
            if (ts.isString(k)) {
                return k;
            }

            // For some markers in SyntaxKind, we should print its original syntax name instead of
            // the marker name in tests.
            if (k === (<any>ts).SyntaxKind.FirstJSDocNode ||
                k === (<any>ts).SyntaxKind.LastJSDocNode ||
                k === (<any>ts).SyntaxKind.FirstJSDocTagNode ||
                k === (<any>ts).SyntaxKind.LastJSDocTagNode) {
                for (const kindName in (<any>ts).SyntaxKind) {
                    if ((<any>ts).SyntaxKind[kindName] === k) {
                        return kindName;
                    }
                }
            }

            return (<any>ts).SyntaxKind[k];
        }

        function getFlagName(flags: any, f: number): any {
            if (f === 0) {
                return 0;
            }

            let result = "";
            ts.forEach(Object.getOwnPropertyNames(flags), (v: any) => {
                if (isFinite(v)) {
                    v = +v;
                    if (f === +v) {
                        result = flags[v];
                        return true;
                    }
                    else if ((f & v) > 0) {
                        if (result.length) {
                            result += " | ";
                        }
                        result += flags[v];
                        return false;
                    }
                }
            });
            return result;
        }

        function getNodeFlagName(f: number) { return getFlagName((<any>ts).NodeFlags, f); }

        function serializeNode(n: ts.Node): any {
            const o: any = { kind: getKindName(n.kind) };
            if (ts.containsParseError(n)) {
                o.containsParseError = true;
            }

            for (const propertyName of Object.getOwnPropertyNames(n) as readonly (keyof ts.SourceFile | keyof ts.Identifier)[]) {
                switch (propertyName) {
                    case "parent":
                    case "symbol":
                    case "locals":
                    case "localSymbol":
                    case "kind":
                    case "id":
                    case "nodeCount":
                    case "symbolCount":
                    case "identifierCount":
                    case "scriptSnapshot":
                        // Blacklist of items we never put in the baseline file.
                        break;

                    case "originalKeywordKind":
                        o[propertyName] = getKindName((<any>n)[propertyName]);
                        break;

                    case "flags":
                        // Clear the flags that are produced by aggregating child values. That is ephemeral
                        // data we don't care about in the dump. We only care what the parser set directly
                        // on the AST.
                        const flags = n.flags & ~(ts.NodeFlags.JavaScriptFile | ts.NodeFlags.HasAggregatedChildData);
                        if (flags) {
                            o[propertyName] = getNodeFlagName(flags);
                        }
                        break;

                    case "parseDiagnostics":
                        o[propertyName] = convertDiagnostics((<any>n)[propertyName]);
                        break;

                    case "nextContainer":
                        if (n.nextContainer) {
                            o[propertyName] = { kind: n.nextContainer.kind, pos: n.nextContainer.pos, end: n.nextContainer.end };
                        }
                        break;

                    case "text":
                        // Include 'text' field for identifiers/literals, but not for source files.
                        if (n.kind !== ts.SyntaxKind.SourceFile) {
                            o[propertyName] = (<any>n)[propertyName];
                        }
                        break;

                    default:
                        o[propertyName] = (<any>n)[propertyName];
                }
            }

            return o;
        }
    }

    export function assertDiagnosticsEquals(array1: readonly ts.Diagnostic[], array2: readonly ts.Diagnostic[]) {
        if (array1 === array2) {
            return;
        }

        assert(array1, "array1");
        assert(array2, "array2");

        assert.equal(array1.length, array2.length, "array1.length !== array2.length");

        for (let i = 0; i < array1.length; i++) {
            const d1 = array1[i];
            const d2 = array2[i];

            assert.equal(d1.start, d2.start, "d1.start !== d2.start");
            assert.equal(d1.length, d2.length, "d1.length !== d2.length");
            assert.equal(
                ts.flattenDiagnosticMessageText(d1.messageText, Harness.IO.newLine()),
                ts.flattenDiagnosticMessageText(d2.messageText, Harness.IO.newLine()), "d1.messageText !== d2.messageText");
            assert.equal(d1.category, d2.category, "d1.category !== d2.category");
            assert.equal(d1.code, d2.code, "d1.code !== d2.code");
        }
    }

    export function assertStructuralEquals(node1: ts.Node, node2: ts.Node) {
        if (node1 === node2) {
            return;
        }

        assert(node1, "node1");
        assert(node2, "node2");
        assert.equal(node1.pos, node2.pos, "node1.pos !== node2.pos");
        assert.equal(node1.end, node2.end, "node1.end !== node2.end");
        assert.equal(node1.kind, node2.kind, "node1.kind !== node2.kind");

        // call this on both nodes to ensure all propagated flags have been set (and thus can be
        // compared).
        assert.equal(ts.containsParseError(node1), ts.containsParseError(node2));
        assert.equal(node1.flags & ~ts.NodeFlags.ReachabilityAndEmitFlags, node2.flags & ~ts.NodeFlags.ReachabilityAndEmitFlags, "node1.flags !== node2.flags");

        ts.forEachChild(node1,
            child1 => {
                const childName = findChildName(node1, child1);
                const child2: ts.Node = (<any>node2)[childName];

                assertStructuralEquals(child1, child2);
            },
            array1 => {
                const childName = findChildName(node1, array1);
                const array2: ts.NodeArray<ts.Node> = (<any>node2)[childName];

                assertArrayStructuralEquals(array1, array2);
            });
    }

    function assertArrayStructuralEquals(array1: ts.NodeArray<ts.Node>, array2: ts.NodeArray<ts.Node>) {
        if (array1 === array2) {
            return;
        }

        assert(array1, "array1");
        assert(array2, "array2");
        assert.equal(array1.pos, array2.pos, "array1.pos !== array2.pos");
        assert.equal(array1.end, array2.end, "array1.end !== array2.end");
        assert.equal(array1.length, array2.length, "array1.length !== array2.length");

        for (let i = 0; i < array1.length; i++) {
            assertStructuralEquals(array1[i], array2[i]);
        }
    }

    function findChildName(parent: any, child: any) {
        for (const name in parent) {
            if (parent.hasOwnProperty(name) && parent[name] === child) {
                return name;
            }
        }

        throw new Error("Could not find child in parent");
    }

    const maxHarnessFrames = 1;

    export function filterStack(error: Error, stackTraceLimit = Infinity) {
        const stack = <string>(<any>error).stack;
        if (stack) {
            const lines = stack.split(/\r\n?|\n/g);
            const filtered: string[] = [];
            let frameCount = 0;
            let harnessFrameCount = 0;
            for (let line of lines) {
                if (isStackFrame(line)) {
                    if (frameCount >= stackTraceLimit
                        || isMocha(line)
                        || isNode(line)) {
                        continue;
                    }

                    if (isHarness(line)) {
                        if (harnessFrameCount >= maxHarnessFrames) {
                            continue;
                        }

                        harnessFrameCount++;
                    }

                    line = line.replace(/\bfile:\/\/\/(.*?)(?=(:\d+)*($|\)))/, (_, path) => ts.sys.resolvePath(path));
                    frameCount++;
                }

                filtered.push(line);
            }

            (<any>error).stack = filtered.join(Harness.IO.newLine());
        }

        return error;
    }

    function isStackFrame(line: string) {
        return /^\s+at\s/.test(line);
    }

    function isMocha(line: string) {
        return /[\\/](node_modules|components)[\\/]mocha(js)?[\\/]|[\\/]mocha\.js/.test(line);
    }

    function isNode(line: string) {
        return /\((timers|events|node|module)\.js:/.test(line);
    }

    function isHarness(line: string) {
        return /[\\/]src[\\/]harness[\\/]|[\\/]run\.js/.test(line);
    }
}

namespace Harness {
    // eslint-disable-next-line @typescript-eslint/interface-name-prefix
    export interface IO {
        newLine(): string;
        getCurrentDirectory(): string;
        useCaseSensitiveFileNames(): boolean;
        resolvePath(path: string): string | undefined;
        getFileSize(path: string): number;
        readFile(path: string): string | undefined;
        writeFile(path: string, contents: string): void;
        directoryName(path: string): string | undefined;
        getDirectories(path: string): string[];
        createDirectory(path: string): void;
        fileExists(fileName: string): boolean;
        directoryExists(path: string): boolean;
        deleteFile(fileName: string): void;
        enumerateTestFiles(runner: RunnerBase): (string | FileBasedTest)[];
        listFiles(path: string, filter?: RegExp, options?: { recursive?: boolean }): string[];
        log(text: string): void;
        args(): string[];
        getExecutingFilePath(): string;
        getWorkspaceRoot(): string;
        exit(exitCode?: number): void;
        readDirectory(path: string, extension?: readonly string[], exclude?: readonly string[], include?: readonly string[], depth?: number): readonly string[];
        getAccessibleFileSystemEntries(dirname: string): ts.FileSystemEntries;
        tryEnableSourceMapsForHost?(): void;
        getEnvironmentVariable?(name: string): string;
        getMemoryUsage?(): number | undefined;
    }

    export let IO: IO;

    // harness always uses one kind of new line
    // But note that `parseTestData` in `fourslash.ts` uses "\n"
    export const harnessNewLine = "\r\n";

    // Root for file paths that are stored in a virtual file system
    export const virtualFileSystemRoot = "/";

    function createNodeIO(): IO {
        let fs: any, pathModule: any;
        if (require) {
            fs = require("fs");
            pathModule = require("path");
        }
        else {
            fs = pathModule = {};
        }

        function deleteFile(path: string) {
            try {
                fs.unlinkSync(path);
            }
            catch { /*ignore*/ }
        }

        function directoryName(path: string) {
            const dirPath = pathModule.dirname(path);
            // Node will just continue to repeat the root path, rather than return null
            return dirPath === path ? undefined : dirPath;
        }

        function enumerateTestFiles(runner: RunnerBase) {
            return runner.getTestFiles();
        }

        function listFiles(path: string, spec: RegExp, options: { recursive?: boolean } = {}) {
            function filesInFolder(folder: string): string[] {
                let paths: string[] = [];

                for (const file of fs.readdirSync(folder)) {
                    const pathToFile = pathModule.join(folder, file);
                    const stat = fs.statSync(pathToFile);
                    if (options.recursive && stat.isDirectory()) {
                        paths = paths.concat(filesInFolder(pathToFile));
                    }
                    else if (stat.isFile() && (!spec || file.match(spec))) {
                        paths.push(pathToFile);
                    }
                }

                return paths;
            }

            return filesInFolder(path);
        }

        function getAccessibleFileSystemEntries(dirname: string): ts.FileSystemEntries {
            try {
                const entries: string[] = fs.readdirSync(dirname || ".").sort(ts.sys.useCaseSensitiveFileNames ? ts.compareStringsCaseSensitive : ts.compareStringsCaseInsensitive);
                const files: string[] = [];
                const directories: string[] = [];
                for (const entry of entries) {
                    if (entry === "." || entry === "..") continue;
                    const name = vpath.combine(dirname, entry);
                    try {
                        const stat = fs.statSync(name);
                        if (!stat) continue;
                        if (stat.isFile()) {
                            files.push(entry);
                        }
                        else if (stat.isDirectory()) {
                            directories.push(entry);
                        }
                    }
                    catch { /*ignore*/ }
                }
                return { files, directories };
            }
            catch (e) {
                return { files: [], directories: [] };
            }
        }

        function createDirectory(path: string) {
            try {
                fs.mkdirSync(path);
            }
            catch (e) {
                if (e.code === "ENOENT") {
                    createDirectory(vpath.dirname(path));
                    createDirectory(path);
                }
                else if (!ts.sys.directoryExists(path)) {
                    throw e;
                }
            }
        }

        return {
            newLine: () => harnessNewLine,
            getCurrentDirectory: () => ts.sys.getCurrentDirectory(),
            useCaseSensitiveFileNames: () => ts.sys.useCaseSensitiveFileNames,
            resolvePath: (path: string) => ts.sys.resolvePath(path),
            getFileSize: (path: string) => ts.sys.getFileSize!(path),
            readFile: path => ts.sys.readFile(path),
            writeFile: (path, content) => ts.sys.writeFile(path, content),
            directoryName,
            getDirectories: path => ts.sys.getDirectories(path),
            createDirectory,
            fileExists: path => ts.sys.fileExists(path),
            directoryExists: path => ts.sys.directoryExists(path),
            deleteFile,
            listFiles,
            enumerateTestFiles,
            log: s => console.log(s),
            args: () => ts.sys.args,
            getExecutingFilePath: () => ts.sys.getExecutingFilePath(),
            getWorkspaceRoot: () => vpath.resolve(__dirname, "../.."),
            exit: exitCode => ts.sys.exit(exitCode),
            readDirectory: (path, extension, exclude, include, depth) => ts.sys.readDirectory(path, extension, exclude, include, depth),
            getAccessibleFileSystemEntries,
            tryEnableSourceMapsForHost: () => ts.sys.tryEnableSourceMapsForHost && ts.sys.tryEnableSourceMapsForHost(),
            getMemoryUsage: () => ts.sys.getMemoryUsage && ts.sys.getMemoryUsage(),
            getEnvironmentVariable: name => ts.sys.getEnvironmentVariable(name),
        };
    }

    export function mockHash(s: string): string {
        return `hash-${s}`;
    }

    IO = createNodeIO();
}

if (Harness.IO.tryEnableSourceMapsForHost && /^development$/i.test(Harness.IO.getEnvironmentVariable!("NODE_ENV"))) {
    Harness.IO.tryEnableSourceMapsForHost();
}

namespace Harness {
    export const libFolder = "built/local/";
    const tcServicesFileName = ts.combinePaths(libFolder, "typescriptServices.js");
    export const tcServicesFile = IO.readFile(tcServicesFileName) + IO.newLine() + `//# sourceURL=${IO.resolvePath(tcServicesFileName)}`;

    export type SourceMapEmitterCallback = (
        emittedFile: string,
        emittedLine: number,
        emittedColumn: number,
        sourceFile: string,
        sourceLine: number,
        sourceColumn: number,
        sourceName: string,
    ) => void;

    // Settings
    /* eslint-disable prefer-const */
    export let userSpecifiedRoot = "";
    export let lightMode = false;
    /* eslint-enable prefer-const */

    /** Functionality for compiling TypeScript code */
    export namespace Compiler {
        /** Aggregate various writes into a single array of lines. Useful for passing to the
         *  TypeScript compiler to fill with source code or errors.
         */
        export class WriterAggregator {
            public lines: string[] = [];
            public currentLine: string = undefined!;

            public Write(str: string) {
                // out of memory usage concerns avoid using + or += if we're going to do any manipulation of this string later
                this.currentLine = [(this.currentLine || ""), str].join("");
            }

            public WriteLine(str: string) {
                // out of memory usage concerns avoid using + or += if we're going to do any manipulation of this string later
                this.lines.push([(this.currentLine || ""), str].join(""));
                this.currentLine = undefined!;
            }

            public Close() {
                if (this.currentLine !== undefined) { this.lines.push(this.currentLine); }
                this.currentLine = undefined!;
            }

            public reset() {
                this.lines = [];
                this.currentLine = undefined!;
            }
        }

        export function createSourceFileAndAssertInvariants(
            fileName: string,
            sourceText: string,
            languageVersion: ts.ScriptTarget) {
            // We'll only assert invariants outside of light mode.
            const shouldAssertInvariants = !lightMode;

            // Only set the parent nodes if we're asserting invariants.  We don't need them otherwise.
            const result = ts.createSourceFile(fileName, sourceText, languageVersion, /*setParentNodes:*/ shouldAssertInvariants);

            if (shouldAssertInvariants) {
                Utils.assertInvariants(result, /*parent:*/ undefined);
            }

            return result;
        }

        export const defaultLibFileName = "lib.d.ts";
        export const es2015DefaultLibFileName = "lib.es2015.d.ts";

        // Cache of lib files from "built/local"
        let libFileNameSourceFileMap: ts.Map<ts.SourceFile> | undefined;

        export function getDefaultLibrarySourceFile(fileName = defaultLibFileName): ts.SourceFile | undefined {
            if (!isDefaultLibraryFile(fileName)) {
                return undefined;
            }

            if (!libFileNameSourceFileMap) {
                libFileNameSourceFileMap = ts.createMapFromTemplate({
                    [defaultLibFileName]: createSourceFileAndAssertInvariants(defaultLibFileName, IO.readFile(libFolder + "lib.es5.d.ts")!, /*languageVersion*/ ts.ScriptTarget.Latest)
                });
            }

            let sourceFile = libFileNameSourceFileMap.get(fileName);
            if (!sourceFile) {
                libFileNameSourceFileMap.set(fileName, sourceFile = createSourceFileAndAssertInvariants(fileName, IO.readFile(libFolder + fileName)!, ts.ScriptTarget.Latest));
            }
            return sourceFile;
        }

        export function getDefaultLibFileName(options: ts.CompilerOptions): string {
            switch (options.target) {
                case ts.ScriptTarget.ESNext:
                case ts.ScriptTarget.ES2017:
                    return "lib.es2017.d.ts";
                case ts.ScriptTarget.ES2016:
                    return "lib.es2016.d.ts";
                case ts.ScriptTarget.ES2015:
                    return es2015DefaultLibFileName;

                default:
                    return defaultLibFileName;
            }
        }

        // Cache these between executions so we don't have to re-parse them for every test
        export const fourslashFileName = "fourslash.ts";
        export let fourslashSourceFile: ts.SourceFile;

        export function getCanonicalFileName(fileName: string): string {
            return fileName;
        }

        interface HarnessOptions {
            useCaseSensitiveFileNames?: boolean;
            includeBuiltFile?: string;
            baselineFile?: string;
            libFiles?: string;
            noTypesAndSymbols?: boolean;
        }

        // Additional options not already in ts.optionDeclarations
        const harnessOptionDeclarations: ts.CommandLineOption[] = [
            { name: "allowNonTsExtensions", type: "boolean" },
            { name: "useCaseSensitiveFileNames", type: "boolean" },
            { name: "baselineFile", type: "string" },
            { name: "includeBuiltFile", type: "string" },
            { name: "fileName", type: "string" },
            { name: "libFiles", type: "string" },
            { name: "noErrorTruncation", type: "boolean" },
            { name: "suppressOutputPathCheck", type: "boolean" },
            { name: "noImplicitReferences", type: "boolean" },
            { name: "currentDirectory", type: "string" },
            { name: "symlink", type: "string" },
            { name: "link", type: "string" },
            { name: "noTypesAndSymbols", type: "boolean" },
            // Emitted js baseline will print full paths for every output file
            { name: "fullEmitPaths", type: "boolean" }
        ];

        let optionsIndex: ts.Map<ts.CommandLineOption>;
        function getCommandLineOption(name: string): ts.CommandLineOption | undefined {
            if (!optionsIndex) {
                optionsIndex = ts.createMap<ts.CommandLineOption>();
                const optionDeclarations = harnessOptionDeclarations.concat(ts.optionDeclarations);
                for (const option of optionDeclarations) {
                    optionsIndex.set(option.name.toLowerCase(), option);
                }
            }
            return optionsIndex.get(name.toLowerCase());
        }

        export function setCompilerOptionsFromHarnessSetting(settings: TestCaseParser.CompilerSettings, options: ts.CompilerOptions & HarnessOptions): void {
            for (const name in settings) {
                if (settings.hasOwnProperty(name)) {
                    const value = settings[name];
                    if (value === undefined) {
                        throw new Error(`Cannot have undefined value for compiler option '${name}'.`);
                    }
                    const option = getCommandLineOption(name);
                    if (option) {
                        const errors: ts.Diagnostic[] = [];
                        options[option.name] = optionValue(option, value, errors);
                        if (errors.length > 0) {
                            throw new Error(`Unknown value '${value}' for compiler option '${name}'.`);
                        }
                    }
                    else {
                        throw new Error(`Unknown compiler option '${name}'.`);
                    }
                }
            }
        }

        function optionValue(option: ts.CommandLineOption, value: string, errors: ts.Diagnostic[]): any {
            switch (option.type) {
                case "boolean":
                    return value.toLowerCase() === "true";
                case "string":
                    return value;
                case "number": {
                    const numverValue = parseInt(value, 10);
                    if (isNaN(numverValue)) {
                        throw new Error(`Value must be a number, got: ${JSON.stringify(value)}`);
                    }
                    return numverValue;
                }
                // If not a primitive, the possible types are specified in what is effectively a map of options.
                case "list":
                    return ts.parseListTypeOption(option, value, errors);
                default:
                    return ts.parseCustomTypeOption(<ts.CommandLineOptionOfCustomType>option, value, errors);
            }
        }

        export interface TestFile {
            unitName: string;
            content: string;
            fileOptions?: any;
        }

        export function compileFiles(
            inputFiles: TestFile[],
            otherFiles: TestFile[],
            harnessSettings: TestCaseParser.CompilerSettings | undefined,
            compilerOptions: ts.CompilerOptions | undefined,
            // Current directory is needed for rwcRunner to be able to use currentDirectory defined in json file
            currentDirectory: string | undefined,
            symlinks?: vfs.FileSet
        ): compiler.CompilationResult {
            const options: ts.CompilerOptions & HarnessOptions = compilerOptions ? ts.cloneCompilerOptions(compilerOptions) : { noResolve: false };
            options.target = options.target || ts.ScriptTarget.ES3;
            options.newLine = options.newLine || ts.NewLineKind.CarriageReturnLineFeed;
            options.noErrorTruncation = true;
            options.skipDefaultLibCheck = typeof options.skipDefaultLibCheck === "undefined" ? true : options.skipDefaultLibCheck;

            if (typeof currentDirectory === "undefined") {
                currentDirectory = vfs.srcFolder;
            }

            // Parse settings
            if (harnessSettings) {
                setCompilerOptionsFromHarnessSetting(harnessSettings, options);
            }
            if (options.rootDirs) {
                options.rootDirs = ts.map(options.rootDirs, d => ts.getNormalizedAbsolutePath(d, currentDirectory));
            }

            const useCaseSensitiveFileNames = options.useCaseSensitiveFileNames !== undefined ? options.useCaseSensitiveFileNames : true;
            const programFileNames = inputFiles.map(file => file.unitName).filter(fileName => !ts.fileExtensionIs(fileName, ts.Extension.Json));

            // Files from built\local that are requested by test "@includeBuiltFiles" to be in the context.
            // Treat them as library files, so include them in build, but not in baselines.
            if (options.includeBuiltFile) {
                programFileNames.push(vpath.combine(vfs.builtFolder, options.includeBuiltFile));
            }

            // Files from tests\lib that are requested by "@libFiles"
            if (options.libFiles) {
                for (const fileName of options.libFiles.split(",")) {
                    programFileNames.push(vpath.combine(vfs.testLibFolder, fileName));
                }
            }

            const docs = inputFiles.concat(otherFiles).map(documents.TextDocument.fromTestFile);
            const fs = vfs.createFromFileSystem(IO, !useCaseSensitiveFileNames, { documents: docs, cwd: currentDirectory });
            if (symlinks) {
                fs.apply(symlinks);
            }
            const host = new fakes.CompilerHost(fs, options);
            const result = compiler.compileFiles(host, programFileNames, options);
            result.symlinks = symlinks;
            return result;
        }

        export interface DeclarationCompilationContext {
            declInputFiles: TestFile[];
            declOtherFiles: TestFile[];
            harnessSettings: TestCaseParser.CompilerSettings & HarnessOptions | undefined;
            options: ts.CompilerOptions;
            currentDirectory: string;
        }

        export function prepareDeclarationCompilationContext(inputFiles: readonly TestFile[],
            otherFiles: readonly TestFile[],
            result: compiler.CompilationResult,
            harnessSettings: TestCaseParser.CompilerSettings & HarnessOptions,
            options: ts.CompilerOptions,
            // Current directory is needed for rwcRunner to be able to use currentDirectory defined in json file
            currentDirectory: string | undefined): DeclarationCompilationContext | undefined {

            if (options.declaration && result.diagnostics.length === 0) {
                if (options.emitDeclarationOnly) {
                    if (result.js.size > 0 || result.dts.size === 0) {
                        throw new Error("Only declaration files should be generated when emitDeclarationOnly:true");
                    }
                }
                else if (result.dts.size !== result.getNumberOfJsFiles(/*includeJson*/ true)) {
                    throw new Error("There were no errors and declFiles generated did not match number of js files generated");
                }
            }

            const declInputFiles: TestFile[] = [];
            const declOtherFiles: TestFile[] = [];

            // if the .d.ts is non-empty, confirm it compiles correctly as well
            if (options.declaration && result.diagnostics.length === 0 && result.dts.size > 0) {
                ts.forEach(inputFiles, file => addDtsFile(file, declInputFiles));
                ts.forEach(otherFiles, file => addDtsFile(file, declOtherFiles));
                return { declInputFiles, declOtherFiles, harnessSettings, options, currentDirectory: currentDirectory || harnessSettings.currentDirectory };
            }

            function addDtsFile(file: TestFile, dtsFiles: TestFile[]) {
                if (vpath.isDeclaration(file.unitName) || vpath.isJson(file.unitName)) {
                    dtsFiles.push(file);
                }
                else if (vpath.isTypeScript(file.unitName) || (vpath.isJavaScript(file.unitName) && options.allowJs)) {
                    const declFile = findResultCodeFile(file.unitName);
                    if (declFile && !findUnit(declFile.file, declInputFiles) && !findUnit(declFile.file, declOtherFiles)) {
                        dtsFiles.push({ unitName: declFile.file, content: utils.removeByteOrderMark(declFile.text) });
                    }
                }
            }

            function findResultCodeFile(fileName: string) {
                const sourceFile = result.program!.getSourceFile(fileName)!;
                assert(sourceFile, "Program has no source file with name '" + fileName + "'");
                // Is this file going to be emitted separately
                let sourceFileName: string;
                const outFile = options.outFile || options.out;
                if (!outFile) {
                    if (options.outDir) {
                        let sourceFilePath = ts.getNormalizedAbsolutePath(sourceFile.fileName, result.vfs.cwd());
                        sourceFilePath = sourceFilePath.replace(result.program!.getCommonSourceDirectory(), "");
                        sourceFileName = ts.combinePaths(options.outDir, sourceFilePath);
                    }
                    else {
                        sourceFileName = sourceFile.fileName;
                    }
                }
                else {
                    // Goes to single --out file
                    sourceFileName = outFile;
                }

                const dTsFileName = ts.removeFileExtension(sourceFileName) + ts.Extension.Dts;
                return result.dts.get(dTsFileName);
            }

            function findUnit(fileName: string, units: TestFile[]) {
                return ts.forEach(units, unit => unit.unitName === fileName ? unit : undefined);
            }
        }

        export function compileDeclarationFiles(context: DeclarationCompilationContext | undefined, symlinks: vfs.FileSet | undefined) {
            if (!context) {
                return;
            }
            const { declInputFiles, declOtherFiles, harnessSettings, options, currentDirectory } = context;
            const output = compileFiles(declInputFiles, declOtherFiles, harnessSettings, options, currentDirectory, symlinks);
            return { declInputFiles, declOtherFiles, declResult: output };
        }

        export function minimalDiagnosticsToString(diagnostics: readonly ts.Diagnostic[], pretty?: boolean) {
            const host = { getCanonicalFileName, getCurrentDirectory: () => "", getNewLine: () => IO.newLine() };
            return (pretty ? ts.formatDiagnosticsWithColorAndContext : ts.formatDiagnostics)(diagnostics, host);
        }

        export function getErrorBaseline(inputFiles: readonly TestFile[], diagnostics: readonly ts.Diagnostic[], pretty?: boolean) {
            let outputLines = "";
            const gen = iterateErrorBaseline(inputFiles, diagnostics, { pretty });
            for (let {done, value} = gen.next(); !done; { done, value } = gen.next()) {
                const [, content] = value;
                outputLines += content;
            }
            if (pretty) {
                outputLines += ts.getErrorSummaryText(ts.getErrorCountForSummary(diagnostics), IO.newLine());
            }
            return outputLines;
        }

        export const diagnosticSummaryMarker = "__diagnosticSummary";
        export const globalErrorsMarker = "__globalErrors";
        export function *iterateErrorBaseline(inputFiles: readonly TestFile[], diagnostics: readonly ts.Diagnostic[], options?: { pretty?: boolean, caseSensitive?: boolean, currentDirectory?: string }): IterableIterator<[string, string, number]> {
            diagnostics = ts.sort(diagnostics, ts.compareDiagnostics);
            let outputLines = "";
            // Count up all errors that were found in files other than lib.d.ts so we don't miss any
            let totalErrorsReportedInNonLibraryFiles = 0;

            let errorsReported = 0;

            let firstLine = true;
            function newLine() {
                if (firstLine) {
                    firstLine = false;
                    return "";
                }
                return "\r\n";
            }

            const formatDiagnsoticHost = {
                getCurrentDirectory: () => options && options.currentDirectory ? options.currentDirectory : "",
                getNewLine: () => IO.newLine(),
                getCanonicalFileName: ts.createGetCanonicalFileName(options && options.caseSensitive !== undefined ? options.caseSensitive : true),
            };

            function outputErrorText(error: ts.Diagnostic) {
                const message = ts.flattenDiagnosticMessageText(error.messageText, IO.newLine());

                const errLines = utils.removeTestPathPrefixes(message)
                    .split("\n")
                    .map(s => s.length > 0 && s.charAt(s.length - 1) === "\r" ? s.substr(0, s.length - 1) : s)
                    .filter(s => s.length > 0)
                    .map(s => "!!! " + ts.diagnosticCategoryName(error) + " TS" + error.code + ": " + s);
                if (error.relatedInformation) {
                    for (const info of error.relatedInformation) {
                        errLines.push(`!!! related TS${info.code}${info.file ? " " + ts.formatLocation(info.file, info.start!, formatDiagnsoticHost, ts.identity) : ""}: ${ts.flattenDiagnosticMessageText(info.messageText, IO.newLine())}`);
                    }
                }
                errLines.forEach(e => outputLines += (newLine() + e));
                errorsReported++;

                // do not count errors from lib.d.ts here, they are computed separately as numLibraryDiagnostics
                // if lib.d.ts is explicitly included in input files and there are some errors in it (i.e. because of duplicate identifiers)
                // then they will be added twice thus triggering 'total errors' assertion with condition
                // 'totalErrorsReportedInNonLibraryFiles + numLibraryDiagnostics + numTest262HarnessDiagnostics, diagnostics.length

                if (!error.file || !isDefaultLibraryFile(error.file.fileName)) {
                    totalErrorsReportedInNonLibraryFiles++;
                }
            }

            yield [diagnosticSummaryMarker, utils.removeTestPathPrefixes(minimalDiagnosticsToString(diagnostics, options && options.pretty)) + IO.newLine() + IO.newLine(), diagnostics.length];

            // Report global errors
            const globalErrors = diagnostics.filter(err => !err.file);
            globalErrors.forEach(outputErrorText);
            yield [globalErrorsMarker, outputLines, errorsReported];
            outputLines = "";
            errorsReported = 0;

            // 'merge' the lines of each input file with any errors associated with it
            const dupeCase = ts.createMap<number>();
            for (const inputFile of inputFiles.filter(f => f.content !== undefined)) {
                // Filter down to the errors in the file
                const fileErrors = diagnostics.filter((e): e is ts.DiagnosticWithLocation => {
                    const errFn = e.file;
                    return !!errFn && ts.comparePaths(utils.removeTestPathPrefixes(errFn.fileName), utils.removeTestPathPrefixes(inputFile.unitName), options && options.currentDirectory || "", !(options && options.caseSensitive)) === ts.Comparison.EqualTo;
                });


                // Header
                outputLines += (newLine() + "==== " + inputFile.unitName + " (" + fileErrors.length + " errors) ====");

                // Make sure we emit something for every error
                let markedErrorCount = 0;
                // For each line, emit the line followed by any error squiggles matching this line
                // Note: IE JS engine incorrectly handles consecutive delimiters here when using RegExp split, so
                // we have to string-based splitting instead and try to figure out the delimiting chars

                const lineStarts = ts.computeLineStarts(inputFile.content);
                let lines = inputFile.content.split("\n");
                if (lines.length === 1) {
                    lines = lines[0].split("\r");
                }

                lines.forEach((line, lineIndex) => {
                    if (line.length > 0 && line.charAt(line.length - 1) === "\r") {
                        line = line.substr(0, line.length - 1);
                    }

                    const thisLineStart = lineStarts[lineIndex];
                    let nextLineStart: number;
                    // On the last line of the file, fake the next line start number so that we handle errors on the last character of the file correctly
                    if (lineIndex === lines.length - 1) {
                        nextLineStart = inputFile.content.length;
                    }
                    else {
                        nextLineStart = lineStarts[lineIndex + 1];
                    }
                    // Emit this line from the original file
                    outputLines += (newLine() + "    " + line);
                    fileErrors.forEach(errDiagnostic => {
                        const err = errDiagnostic as ts.TextSpan; // TODO: GH#18217
                        // Does any error start or continue on to this line? Emit squiggles
                        const end = ts.textSpanEnd(err);
                        if ((end >= thisLineStart) && ((err.start < nextLineStart) || (lineIndex === lines.length - 1))) {
                            // How many characters from the start of this line the error starts at (could be positive or negative)
                            const relativeOffset = err.start - thisLineStart;
                            // How many characters of the error are on this line (might be longer than this line in reality)
                            const length = (end - err.start) - Math.max(0, thisLineStart - err.start);
                            // Calculate the start of the squiggle
                            const squiggleStart = Math.max(0, relativeOffset);
                            // TODO/REVIEW: this doesn't work quite right in the browser if a multi file test has files whose names are just the right length relative to one another
                            outputLines += (newLine() + "    " + line.substr(0, squiggleStart).replace(/[^\s]/g, " ") + new Array(Math.min(length, line.length - squiggleStart) + 1).join("~"));

                            // If the error ended here, or we're at the end of the file, emit its message
                            if ((lineIndex === lines.length - 1) || nextLineStart > end) {
                                // Just like above, we need to do a split on a string instead of on a regex
                                // because the JS engine does regexes wrong

                                outputErrorText(errDiagnostic);
                                markedErrorCount++;
                            }
                        }
                    });
                });

                // Verify we didn't miss any errors in this file
                assert.equal(markedErrorCount, fileErrors.length, "count of errors in " + inputFile.unitName);
                const isDupe = dupeCase.has(sanitizeTestFilePath(inputFile.unitName));
                yield [checkDuplicatedFileName(inputFile.unitName, dupeCase), outputLines, errorsReported];
                if (isDupe && !(options && options.caseSensitive)) {
                    // Case-duplicated files on a case-insensitive build will have errors reported in both the dupe and the original
                    // thanks to the canse-insensitive path comparison on the error file path - We only want to count those errors once
                    // for the assert below, so we subtract them here.
                    totalErrorsReportedInNonLibraryFiles -= errorsReported;
                }
                outputLines = "";
                errorsReported = 0;
            }

            const numLibraryDiagnostics = ts.countWhere(diagnostics, diagnostic => {
                return !!diagnostic.file && (isDefaultLibraryFile(diagnostic.file.fileName) || isBuiltFile(diagnostic.file.fileName));
            });

            const numTest262HarnessDiagnostics = ts.countWhere(diagnostics, diagnostic => {
                // Count an error generated from tests262-harness folder.This should only apply for test262
                return !!diagnostic.file && diagnostic.file.fileName.indexOf("test262-harness") >= 0;
            });

            // Verify we didn't miss any errors in total
            assert.equal(totalErrorsReportedInNonLibraryFiles + numLibraryDiagnostics + numTest262HarnessDiagnostics, diagnostics.length, "total number of errors");
        }

        export function doErrorBaseline(baselinePath: string, inputFiles: readonly TestFile[], errors: readonly ts.Diagnostic[], pretty?: boolean) {
            Baseline.runBaseline(baselinePath.replace(/\.tsx?$/, ".errors.txt"),
                !errors || (errors.length === 0) ? null : getErrorBaseline(inputFiles, errors, pretty)); // eslint-disable-line no-null/no-null
        }

        export function doTypeAndSymbolBaseline(baselinePath: string, program: ts.Program, allFiles: {unitName: string, content: string}[], opts?: Baseline.BaselineOptions, multifile?: boolean, skipTypeBaselines?: boolean, skipSymbolBaselines?: boolean, hasErrorBaseline?: boolean) {
            // The full walker simulates the types that you would get from doing a full
            // compile.  The pull walker simulates the types you get when you just do
            // a type query for a random node (like how the LS would do it).  Most of the
            // time, these will be the same.  However, occasionally, they can be different.
            // Specifically, when the compiler internally depends on symbol IDs to order
            // things, then we may see different results because symbols can be created in a
            // different order with 'pull' operations, and thus can produce slightly differing
            // output.
            //
            // For example, with a full type check, we may see a type displayed as: number | string
            // But with a pull type check, we may see it as:                        string | number
            //
            // These types are equivalent, but depend on what order the compiler observed
            // certain parts of the program.

            const fullWalker = new TypeWriterWalker(program, /*fullTypeCheck*/ true, !!hasErrorBaseline);

            // Produce baselines.  The first gives the types for all expressions.
            // The second gives symbols for all identifiers.
            let typesError: Error | undefined, symbolsError: Error | undefined;
            try {
                checkBaseLines(/*isSymbolBaseLine*/ false);
            }
            catch (e) {
                typesError = e;
            }

            try {
                checkBaseLines(/*isSymbolBaseLine*/ true);
            }
            catch (e) {
                symbolsError = e;
            }

            if (typesError && symbolsError) {
                throw new Error(typesError.stack + IO.newLine() + symbolsError.stack);
            }

            if (typesError) {
                throw typesError;
            }

            if (symbolsError) {
                throw symbolsError;
            }

            return;

            function checkBaseLines(isSymbolBaseLine: boolean) {
                const fullExtension = isSymbolBaseLine ? ".symbols" : ".types";
                // When calling this function from rwc-runner, the baselinePath will have no extension.
                // As rwc test- file is stored in json which ".json" will get stripped off.
                // When calling this function from compiler-runner, the baselinePath will then has either ".ts" or ".tsx" extension
                const outputFileName = ts.endsWith(baselinePath, ts.Extension.Ts) || ts.endsWith(baselinePath, ts.Extension.Tsx) ?
                    baselinePath.replace(/\.tsx?/, "") : baselinePath;

                if (!multifile) {
                    const fullBaseLine = generateBaseLine(isSymbolBaseLine, isSymbolBaseLine ? skipSymbolBaselines : skipTypeBaselines);
                    Baseline.runBaseline(outputFileName + fullExtension, fullBaseLine, opts);
                }
                else {
                    Baseline.runMultifileBaseline(outputFileName, fullExtension, () => {
                        return iterateBaseLine(isSymbolBaseLine, isSymbolBaseLine ? skipSymbolBaselines : skipTypeBaselines);
                    }, opts);
                }
            }

            function generateBaseLine(isSymbolBaseline: boolean, skipBaseline?: boolean): string | null {
                let result = "";
                const gen = iterateBaseLine(isSymbolBaseline, skipBaseline);
                for (let {done, value} = gen.next(); !done; { done, value } = gen.next()) {
                    const [, content] = value;
                    result += content;
                }
                return result || null; // eslint-disable-line no-null/no-null
            }

            function *iterateBaseLine(isSymbolBaseline: boolean, skipBaseline?: boolean): IterableIterator<[string, string]> {
                if (skipBaseline) {
                    return;
                }
                const dupeCase = ts.createMap<number>();

                for (const file of allFiles) {
                    const { unitName } = file;
                    let typeLines = "=== " + unitName + " ===\r\n";
                    const codeLines = ts.flatMap(file.content.split(/\r?\n/g), e => e.split(/[\r\u2028\u2029]/g));
                    const gen: IterableIterator<TypeWriterResult> = isSymbolBaseline ? fullWalker.getSymbols(unitName) : fullWalker.getTypes(unitName);
                    let lastIndexWritten: number | undefined;
                    for (let {done, value: result} = gen.next(); !done; { done, value: result } = gen.next()) {
                        if (isSymbolBaseline && !result.symbol) {
                            return;
                        }
                        if (lastIndexWritten === undefined) {
                            typeLines += codeLines.slice(0, result.line + 1).join("\r\n") + "\r\n";
                        }
                        else if (result.line !== lastIndexWritten) {
                            if (!((lastIndexWritten + 1 < codeLines.length) && (codeLines[lastIndexWritten + 1].match(/^\s*[{|}]\s*$/) || codeLines[lastIndexWritten + 1].trim() === ""))) {
                                typeLines += "\r\n";
                            }
                            typeLines += codeLines.slice(lastIndexWritten + 1, result.line + 1).join("\r\n") + "\r\n";
                        }
                        lastIndexWritten = result.line;
                        const typeOrSymbolString = isSymbolBaseline ? result.symbol : result.type;
                        const formattedLine = result.sourceText.replace(/\r?\n/g, "") + " : " + typeOrSymbolString;
                        typeLines += ">" + formattedLine + "\r\n";
                    }

                    // Preserve legacy behavior
                    if (lastIndexWritten === undefined) {
                        for (const codeLine of codeLines) {
                            typeLines += codeLine + "\r\nNo type information for this code.";
                        }
                    }
                    else {
                        if (lastIndexWritten + 1 < codeLines.length) {
                            if (!((lastIndexWritten + 1 < codeLines.length) && (codeLines[lastIndexWritten + 1].match(/^\s*[{|}]\s*$/) || codeLines[lastIndexWritten + 1].trim() === ""))) {
                                typeLines += "\r\n";
                            }
                            typeLines += codeLines.slice(lastIndexWritten + 1).join("\r\n");
                        }
                        typeLines += "\r\n";
                    }
                    yield [checkDuplicatedFileName(unitName, dupeCase), utils.removeTestPathPrefixes(typeLines)];
                }
            }
        }

        export function doSourcemapBaseline(baselinePath: string, options: ts.CompilerOptions, result: compiler.CompilationResult, harnessSettings: TestCaseParser.CompilerSettings) {
            const declMaps = ts.getAreDeclarationMapsEnabled(options);
            if (options.inlineSourceMap) {
                if (result.maps.size > 0 && !declMaps) {
                    throw new Error("No sourcemap files should be generated if inlineSourceMaps was set.");
                }
                return;
            }
            else if (options.sourceMap || declMaps) {
                if (result.maps.size !== ((options.sourceMap ? result.getNumberOfJsFiles(/*includeJson*/ false) : 0) + (declMaps ? result.getNumberOfJsFiles(/*includeJson*/ true) : 0))) {
                    throw new Error("Number of sourcemap files should be same as js files.");
                }

                let sourceMapCode: string | null;
                if ((options.noEmitOnError && result.diagnostics.length !== 0) || result.maps.size === 0) {
                    // We need to return null here or the runBaseLine will actually create a empty file.
                    // Baselining isn't required here because there is no output.
                    sourceMapCode = null; // eslint-disable-line no-null/no-null
                }
                else {
                    sourceMapCode = "";
                    result.maps.forEach(sourceMap => {
                        if (sourceMapCode) sourceMapCode += "\r\n";
                        sourceMapCode += fileOutput(sourceMap, harnessSettings);
                    });
                }
                Baseline.runBaseline(baselinePath.replace(/\.tsx?/, ".js.map"), sourceMapCode);
            }
        }

        export function doJsEmitBaseline(baselinePath: string, header: string, options: ts.CompilerOptions, result: compiler.CompilationResult, tsConfigFiles: readonly TestFile[], toBeCompiled: readonly TestFile[], otherFiles: readonly TestFile[], harnessSettings: TestCaseParser.CompilerSettings) {
            if (!options.noEmit && !options.emitDeclarationOnly && result.js.size === 0 && result.diagnostics.length === 0) {
                throw new Error("Expected at least one js file to be emitted or at least one error to be created.");
            }

            // check js output
            let tsCode = "";
            const tsSources = otherFiles.concat(toBeCompiled);
            if (tsSources.length > 1) {
                tsCode += "//// [" + header + "] ////\r\n\r\n";
            }
            for (let i = 0; i < tsSources.length; i++) {
                tsCode += "//// [" + ts.getBaseFileName(tsSources[i].unitName) + "]\r\n";
                tsCode += tsSources[i].content + (i < (tsSources.length - 1) ? "\r\n" : "");
            }

            let jsCode = "";
            result.js.forEach(file => {
                if (jsCode.length && jsCode.charCodeAt(jsCode.length - 1) !== ts.CharacterCodes.lineFeed) {
                    jsCode += "\r\n";
                }
                if (!result.diagnostics.length && !ts.endsWith(file.file, ts.Extension.Json)) {
                    const fileParseResult = ts.createSourceFile(file.file, file.text, options.target || ts.ScriptTarget.ES3, /*parentNodes*/ false, ts.endsWith(file.file, "x") ? ts.ScriptKind.JSX : ts.ScriptKind.JS);
                    if (ts.length(fileParseResult.parseDiagnostics)) {
                        jsCode += getErrorBaseline([file.asTestFile()], fileParseResult.parseDiagnostics);
                        return;
                    }
                }
                jsCode += fileOutput(file, harnessSettings);
            });

            if (result.dts.size > 0) {
                jsCode += "\r\n\r\n";
                result.dts.forEach(declFile => {
                    jsCode += fileOutput(declFile, harnessSettings);
                });
            }

            const declFileContext = prepareDeclarationCompilationContext(
                toBeCompiled, otherFiles, result, harnessSettings, options, /*currentDirectory*/ undefined
            );
            const declFileCompilationResult = compileDeclarationFiles(declFileContext, result.symlinks);

            if (declFileCompilationResult && declFileCompilationResult.declResult.diagnostics.length) {
                jsCode += "\r\n\r\n//// [DtsFileErrors]\r\n";
                jsCode += "\r\n\r\n";
                jsCode += getErrorBaseline(tsConfigFiles.concat(declFileCompilationResult.declInputFiles, declFileCompilationResult.declOtherFiles), declFileCompilationResult.declResult.diagnostics);
            }

            // eslint-disable-next-line no-null/no-null
            Baseline.runBaseline(baselinePath.replace(/\.tsx?/, ts.Extension.Js), jsCode.length > 0 ? tsCode + "\r\n\r\n" + jsCode : null);
        }

        function fileOutput(file: documents.TextDocument, harnessSettings: TestCaseParser.CompilerSettings): string {
            const fileName = harnessSettings.fullEmitPaths ? utils.removeTestPathPrefixes(file.file) : ts.getBaseFileName(file.file);
            return "//// [" + fileName + "]\r\n" + utils.removeTestPathPrefixes(file.text);
        }

        export function collateOutputs(outputFiles: readonly documents.TextDocument[]): string {
            const gen = iterateOutputs(outputFiles);
            // Emit them
            let result = "";
            for (let {done, value} = gen.next(); !done; { done, value } = gen.next()) {
                // Some extra spacing if this isn't the first file
                if (result.length) {
                    result += "\r\n\r\n";
                }
                // FileName header + content
                const [, content] = value;
                result += content;
            }
            return result;
        }

        export function* iterateOutputs(outputFiles: Iterable<documents.TextDocument>): IterableIterator<[string, string]> {
            // Collect, test, and sort the fileNames
            const files = Array.from(outputFiles);
            files.slice().sort((a, b) => ts.compareStringsCaseSensitive(cleanName(a.file), cleanName(b.file)));
            const dupeCase = ts.createMap<number>();
            // Yield them
            for (const outputFile of files) {
                yield [checkDuplicatedFileName(outputFile.file, dupeCase), "/*====== " + outputFile.file + " ======*/\r\n" + utils.removeByteOrderMark(outputFile.text)];
            }

            function cleanName(fn: string) {
                const lastSlash = ts.normalizeSlashes(fn).lastIndexOf("/");
                return fn.substr(lastSlash + 1).toLowerCase();
            }
        }

        function checkDuplicatedFileName(resultName: string, dupeCase: ts.Map<number>): string {
            resultName = sanitizeTestFilePath(resultName);
            if (dupeCase.has(resultName)) {
                // A different baseline filename should be manufactured if the names differ only in case, for windows compat
                const count = 1 + dupeCase.get(resultName)!;
                dupeCase.set(resultName, count);
                resultName = `${resultName}.dupe${count}`;
            }
            else {
                dupeCase.set(resultName, 0);
            }
            return resultName;
        }

        export function sanitizeTestFilePath(name: string) {
            const path = ts.toPath(ts.normalizeSlashes(name.replace(/[\^<>:"|?*%]/g, "_")).replace(/\.\.\//g, "__dotdot/"), "", Utils.canonicalizeForHarness);
            if (ts.startsWith(path, "/")) {
                return path.substring(1);
            }
            return path;
        }
    }

    export interface FileBasedTest {
        file: string;
        configurations?: FileBasedTestConfiguration[];
    }

    export interface FileBasedTestConfiguration {
        [key: string]: string;
    }

    function splitVaryBySettingValue(text: string): string[] | undefined {
        if (!text) return undefined;
        const entries = text.split(/,/).map(s => s.trim().toLowerCase()).filter(s => s.length > 0);
        return entries && entries.length > 1 ? entries : undefined;
    }

    function computeFileBasedTestConfigurationVariations(configurations: FileBasedTestConfiguration[], variationState: FileBasedTestConfiguration, varyByEntries: [string, string[]][], offset: number) {
        if (offset >= varyByEntries.length) {
            // make a copy of the current variation state
            configurations.push({ ...variationState });
            return;
        }

        const [varyBy, entries] = varyByEntries[offset];
        for (const entry of entries) {
            // set or overwrite the variation, then compute the next variation
            variationState[varyBy] = entry;
            computeFileBasedTestConfigurationVariations(configurations, variationState, varyByEntries, offset + 1);
        }
    }

    /**
     * Compute FileBasedTestConfiguration variations based on a supplied list of variable settings.
     */
    export function getFileBasedTestConfigurations(settings: TestCaseParser.CompilerSettings, varyBy: string[]): FileBasedTestConfiguration[] | undefined {
        let varyByEntries: [string, string[]][] | undefined;
        for (const varyByKey of varyBy) {
            if (ts.hasProperty(settings, varyByKey)) {
                // we only consider variations when there are 2 or more variable entries.
                const entries = splitVaryBySettingValue(settings[varyByKey]);
                if (entries) {
                    if (!varyByEntries) varyByEntries = [];
                    varyByEntries.push([varyByKey, entries]);
                }
            }
        }

        if (!varyByEntries) return undefined;

        const configurations: FileBasedTestConfiguration[] = [];
        computeFileBasedTestConfigurationVariations(configurations, /*variationState*/ {}, varyByEntries, /*offset*/ 0);
        return configurations;
    }

    /**
     * Compute a description for this configuration based on its entries
     */
    export function getFileBasedTestConfigurationDescription(configuration: FileBasedTestConfiguration) {
        let name = "";
        if (configuration) {
            const keys = Object.keys(configuration).sort();
            for (const key of keys) {
                if (name) name += ", ";
                name += `@${key}: ${configuration[key]}`;
            }
        }
        return name;
    }

    export namespace TestCaseParser {
        /** all the necessary information to set the right compiler settings */
        export interface CompilerSettings {
            [name: string]: string;
        }

        /** All the necessary information to turn a multi file test into useful units for later compilation */
        export interface TestUnitData {
            content: string;
            name: string;
            fileOptions: any;
            originalFilePath: string;
            references: string[];
        }

        // Regex for parsing options in the format "@Alpha: Value of any sort"
        const optionRegex = /^[\/]{2}\s*@(\w+)\s*:\s*([^\r\n]*)/gm;  // multiple matches on multiple lines
        const linkRegex = /^[\/]{2}\s*@link\s*:\s*([^\r\n]*)\s*->\s*([^\r\n]*)/gm;  // multiple matches on multiple lines

        export function extractCompilerSettings(content: string): CompilerSettings {
            const opts: CompilerSettings = {};

            let match: RegExpExecArray | null;
            while ((match = optionRegex.exec(content)) !== null) { // eslint-disable-line no-null/no-null
                opts[match[1]] = match[2].trim();
            }

            return opts;
        }

        export interface TestCaseContent {
            settings: CompilerSettings;
            testUnitData: TestUnitData[];
            tsConfig: ts.ParsedCommandLine | undefined;
            tsConfigFileUnitData: TestUnitData | undefined;
            symlinks?: vfs.FileSet;
        }

        /** Given a test file containing // @FileName directives, return an array of named units of code to be added to an existing compiler instance */
        export function makeUnitsFromTest(code: string, fileName: string, rootDir?: string, settings = extractCompilerSettings(code)): TestCaseContent {
            // List of all the subfiles we've parsed out
            const testUnitData: TestUnitData[] = [];

            const lines = Utils.splitContentByNewlines(code);

            // Stuff related to the subfile we're parsing
            let currentFileContent: string | undefined;
            let currentFileOptions: any = {};
            let currentFileName: any;
            let refs: string[] = [];
            let symlinks: vfs.FileSet | undefined;

            for (const line of lines) {
                let testMetaData: RegExpExecArray | null;
                const linkMetaData = linkRegex.exec(line);
                linkRegex.lastIndex = 0;
                if (linkMetaData) {
                    if (!symlinks) symlinks = {};
                    symlinks[linkMetaData[2].trim()] = new vfs.Symlink(linkMetaData[1].trim());
                }
                else if (testMetaData = optionRegex.exec(line)) {
                    // Comment line, check for global/file @options and record them
                    optionRegex.lastIndex = 0;
                    const metaDataName = testMetaData[1].toLowerCase();
                    currentFileOptions[testMetaData[1]] = testMetaData[2].trim();
                    if (metaDataName !== "filename") {
                        continue;
                    }

                    // New metadata statement after having collected some code to go with the previous metadata
                    if (currentFileName) {
                        // Store result file
                        const newTestFile = {
                            content: currentFileContent!, // TODO: GH#18217
                            name: currentFileName,
                            fileOptions: currentFileOptions,
                            originalFilePath: fileName,
                            references: refs
                        };
                        testUnitData.push(newTestFile);

                        // Reset local data
                        currentFileContent = undefined;
                        currentFileOptions = {};
                        currentFileName = testMetaData[2].trim();
                        refs = [];
                    }
                    else {
                        // First metadata marker in the file
                        currentFileName = testMetaData[2].trim();
                    }
                }
                else {
                    // Subfile content line
                    // Append to the current subfile content, inserting a newline needed
                    if (currentFileContent === undefined) {
                        currentFileContent = "";
                    }
                    else if (currentFileContent !== "") {
                        // End-of-line
                        currentFileContent = currentFileContent + "\n";
                    }
                    currentFileContent = currentFileContent + line;
                }
            }

            // normalize the fileName for the single file case
            currentFileName = testUnitData.length > 0 || currentFileName ? currentFileName : ts.getBaseFileName(fileName);

            // EOF, push whatever remains
            const newTestFile2 = {
                content: currentFileContent || "",
                name: currentFileName,
                fileOptions: currentFileOptions,
                originalFilePath: fileName,
                references: refs
            };
            testUnitData.push(newTestFile2);

            // unit tests always list files explicitly
            const parseConfigHost: ts.ParseConfigHost = {
                useCaseSensitiveFileNames: false,
                readDirectory: () => [],
                fileExists: () => true,
                readFile: (name) => ts.forEach(testUnitData, data => data.name.toLowerCase() === name.toLowerCase() ? data.content : undefined)
            };

            // check if project has tsconfig.json in the list of files
            let tsConfig: ts.ParsedCommandLine | undefined;
            let tsConfigFileUnitData: TestUnitData | undefined;
            for (let i = 0; i < testUnitData.length; i++) {
                const data = testUnitData[i];
                if (getConfigNameFromFileName(data.name)) {
                    const configJson = ts.parseJsonText(data.name, data.content);
                    assert.isTrue(configJson.endOfFileToken !== undefined);
                    let baseDir = ts.normalizePath(ts.getDirectoryPath(data.name));
                    if (rootDir) {
                        baseDir = ts.getNormalizedAbsolutePath(baseDir, rootDir);
                    }
                    tsConfig = ts.parseJsonSourceFileConfigFileContent(configJson, parseConfigHost, baseDir);
                    tsConfig.options.configFilePath = data.name;
                    tsConfigFileUnitData = data;

                    // delete entry from the list
                    ts.orderedRemoveItemAt(testUnitData, i);

                    break;
                }
            }
            return { settings, testUnitData, tsConfig, tsConfigFileUnitData, symlinks };
        }
    }

    /** Support class for baseline files */
    export namespace Baseline {
        const noContent = "<no content>";

        export interface BaselineOptions {
            Subfolder?: string;
            Baselinefolder?: string;
        }

        export function localPath(fileName: string, baselineFolder?: string, subfolder?: string) {
            if (baselineFolder === undefined) {
                return baselinePath(fileName, "local", "tests/baselines", subfolder);
            }
            else {
                return baselinePath(fileName, "local", baselineFolder, subfolder);
            }
        }

        function referencePath(fileName: string, baselineFolder?: string, subfolder?: string) {
            if (baselineFolder === undefined) {
                return baselinePath(fileName, "reference", "tests/baselines", subfolder);
            }
            else {
                return baselinePath(fileName, "reference", baselineFolder, subfolder);
            }
        }

        function baselinePath(fileName: string, type: string, baselineFolder: string, subfolder?: string) {
            if (subfolder !== undefined) {
                return userSpecifiedRoot + baselineFolder + "/" + subfolder + "/" + type + "/" + fileName;
            }
            else {
                return userSpecifiedRoot + baselineFolder + "/" + type + "/" + fileName;
            }
        }

        const fileCache: { [idx: string]: boolean } = {};

        function compareToBaseline(actual: string | null, relativeFileName: string, opts: BaselineOptions | undefined) {
            // actual is now either undefined (the generator had an error), null (no file requested),
            // or some real output of the function
            if (actual === undefined) {
                // Nothing to do
                return undefined!; // TODO: GH#18217
            }

            const refFileName = referencePath(relativeFileName, opts && opts.Baselinefolder, opts && opts.Subfolder);

            // eslint-disable-next-line no-null/no-null
            if (actual === null) {
                actual = noContent;
            }

            let expected = "<no content>";
            if (IO.fileExists(refFileName)) {
                expected = IO.readFile(refFileName)!; // TODO: GH#18217
            }

            return { expected, actual };
        }

        function writeComparison(expected: string, actual: string, relativeFileName: string, actualFileName: string) {
            // For now this is written using TypeScript, because sys is not available when running old test cases.
            // But we need to move to sys once we have
            // Creates the directory including its parent if not already present
            function createDirectoryStructure(dirName: string) {
                if (fileCache[dirName] || IO.directoryExists(dirName)) {
                    fileCache[dirName] = true;
                    return;
                }

                const parentDirectory = IO.directoryName(dirName)!; // TODO: GH#18217
                if (parentDirectory !== "" && parentDirectory !== dirName) {
                    createDirectoryStructure(parentDirectory);
                }
                IO.createDirectory(dirName);
                fileCache[dirName] = true;
            }

            // Create folders if needed
            createDirectoryStructure(IO.directoryName(actualFileName)!); // TODO: GH#18217

            // Delete the actual file in case it fails
            if (IO.fileExists(actualFileName)) {
                IO.deleteFile(actualFileName);
            }

            const encodedActual = Utils.encodeString(actual);
            if (expected !== encodedActual) {
                if (actual === noContent) {
                    IO.writeFile(actualFileName + ".delete", "");
                }
                else {
                    IO.writeFile(actualFileName, encodedActual);
                }
                throw new Error(`The baseline file ${relativeFileName} has changed.`);
            }
        }

        export function runBaseline(relativeFileName: string, actual: string | null, opts?: BaselineOptions): void {
            const actualFileName = localPath(relativeFileName, opts && opts.Baselinefolder, opts && opts.Subfolder);
            if (actual === undefined) {
                throw new Error("The generated content was \"undefined\". Return \"null\" if no baselining is required.\"");
            }
            const comparison = compareToBaseline(actual, relativeFileName, opts);
            writeComparison(comparison.expected, comparison.actual, relativeFileName, actualFileName);
        }

        export function runMultifileBaseline(relativeFileBase: string, extension: string, generateContent: () => IterableIterator<[string, string, number]> | IterableIterator<[string, string]> | null, opts?: BaselineOptions, referencedExtensions?: string[]): void {
            const gen = generateContent();
            const writtenFiles = ts.createMap<true>();
            const errors: Error[] = [];

            // eslint-disable-next-line no-null/no-null
            if (gen !== null) {
                for (let {done, value} = gen.next(); !done; { done, value } = gen.next()) {
                    const [name, content, count] = value as [string, string, number | undefined];
                    if (count === 0) continue; // Allow error reporter to skip writing files without errors
                    const relativeFileName = relativeFileBase + "/" + name + extension;
                    const actualFileName = localPath(relativeFileName, opts && opts.Baselinefolder, opts && opts.Subfolder);
                    const comparison = compareToBaseline(content, relativeFileName, opts);
                    try {
                        writeComparison(comparison.expected, comparison.actual, relativeFileName, actualFileName);
                    }
                    catch (e) {
                        errors.push(e);
                    }
                    writtenFiles.set(relativeFileName, true);
                }
            }

            const referenceDir = referencePath(relativeFileBase, opts && opts.Baselinefolder, opts && opts.Subfolder);
            let existing = IO.readDirectory(referenceDir, referencedExtensions || [extension]);
            if (extension === ".ts" || referencedExtensions && referencedExtensions.indexOf(".ts") > -1 && referencedExtensions.indexOf(".d.ts") === -1) {
                // special-case and filter .d.ts out of .ts results
                existing = existing.filter(f => !ts.endsWith(f, ".d.ts"));
            }
            const missing: string[] = [];
            for (const name of existing) {
                const localCopy = name.substring(referenceDir.length - relativeFileBase.length);
                if (!writtenFiles.has(localCopy)) {
                    missing.push(localCopy);
                }
            }
            if (missing.length) {
                for (const file of missing) {
                    IO.writeFile(localPath(file + ".delete", opts && opts.Baselinefolder, opts && opts.Subfolder), "");
                }
            }

            if (errors.length || missing.length) {
                let errorMsg = "";
                if (errors.length) {
                    errorMsg += `The baseline for ${relativeFileBase} in ${errors.length} files has changed:${"\n    " + errors.slice(0, 5).map(e => e.message).join("\n    ") + (errors.length > 5 ? "\n" + `    and ${errors.length - 5} more` : "")}`;
                }
                if (errors.length && missing.length) {
                    errorMsg += "\n";
                }
                if (missing.length) {
                    const writtenFilesArray = ts.arrayFrom(writtenFiles.keys());
                    errorMsg += `Baseline missing ${missing.length} files:${"\n    " + missing.slice(0, 5).join("\n    ") + (missing.length > 5 ? "\n" + `    and ${missing.length - 5} more` : "") + "\n"}Written ${writtenFiles.size} files:${"\n    " + writtenFilesArray.slice(0, 5).join("\n    ") + (writtenFilesArray.length > 5 ? "\n" + `    and ${writtenFilesArray.length - 5} more` : "")}`;
                }
                throw new Error(errorMsg);
            }
        }
    }

    export function isDefaultLibraryFile(filePath: string): boolean {
        // We need to make sure that the filePath is prefixed with "lib." not just containing "lib." and end with ".d.ts"
        const fileName = ts.getBaseFileName(ts.normalizeSlashes(filePath));
        return ts.startsWith(fileName, "lib.") && ts.endsWith(fileName, ts.Extension.Dts);
    }

    export function isBuiltFile(filePath: string): boolean {
        return filePath.indexOf(libFolder) === 0 ||
            filePath.indexOf(vpath.addTrailingSeparator(vfs.builtFolder)) === 0;
    }

    export function getDefaultLibraryFile(filePath: string, io: IO): Compiler.TestFile {
        const libFile = userSpecifiedRoot + libFolder + ts.getBaseFileName(ts.normalizeSlashes(filePath));
        return { unitName: libFile, content: io.readFile(libFile)! };
    }

    export function getConfigNameFromFileName(filename: string): "tsconfig.json" | "jsconfig.json" | undefined {
        const flc = ts.getBaseFileName(filename).toLowerCase();
        return ts.find(["tsconfig.json" as "tsconfig.json", "jsconfig.json" as "jsconfig.json"], x => x === flc);
    }

    if (Error) (<any>Error).stackTraceLimit = 100;
}
