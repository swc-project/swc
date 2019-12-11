namespace evaluator {
    declare let Symbol: SymbolConstructor;

    const sourceFile = vpath.combine(vfs.srcFolder, "source.ts");
    const sourceFileJs = vpath.combine(vfs.srcFolder, "source.js");

    function compile(sourceText: string, options?: ts.CompilerOptions) {
        const fs = vfs.createFromFileSystem(Harness.IO, /*ignoreCase*/ false);
        fs.writeFileSync(sourceFile, sourceText);
        const compilerOptions: ts.CompilerOptions = {
            target: ts.ScriptTarget.ES5,
            module: ts.ModuleKind.CommonJS,
            lib: ["lib.esnext.d.ts", "lib.dom.d.ts"],
            ...options
        };
        const host = new fakes.CompilerHost(fs, compilerOptions);
        return compiler.compileFiles(host, [sourceFile], compilerOptions);
    }

    function noRequire(id: string) {
        throw new Error(`Module '${id}' could not be found.`);
    }

    // Define a custom "Symbol" constructor to attach missing built-in symbols without
    // modifying the global "Symbol" constructor
    const FakeSymbol: SymbolConstructor = ((description?: string) => Symbol(description)) as any;
    (<any>FakeSymbol).prototype = Symbol.prototype;
    for (const key of Object.getOwnPropertyNames(Symbol)) {
        Object.defineProperty(FakeSymbol, key, Object.getOwnPropertyDescriptor(Symbol, key)!);
    }

    // Add "asyncIterator" if missing
    if (!ts.hasProperty(FakeSymbol, "asyncIterator")) Object.defineProperty(FakeSymbol, "asyncIterator", { value: Symbol.for("Symbol.asyncIterator"), configurable: true });

    export function evaluateTypeScript(sourceText: string, options?: ts.CompilerOptions, globals?: Record<string, any>) {
        const result = compile(sourceText, options);
        if (ts.some(result.diagnostics)) {
            assert.ok(/*value*/ false, "Syntax error in evaluation source text:\n" + ts.formatDiagnostics(result.diagnostics, {
                getCanonicalFileName: file => file,
                getCurrentDirectory: () => "",
                getNewLine: () => "\n"
            }));
        }

        const output = result.getOutput(sourceFile, "js")!;
        assert.isDefined(output);

        return evaluateJavaScript(output.text, globals, output.file);
    }

    export function evaluateJavaScript(sourceText: string, globals?: Record<string, any>, sourceFile = sourceFileJs) {
        globals = { Symbol: FakeSymbol, ...globals };

        const globalNames: string[] = [];
        const globalArgs: any[] = [];
        for (const name in globals) {
            if (ts.hasProperty(globals, name)) {
                globalNames.push(name);
                globalArgs.push(globals[name]);
            }
        }

        const evaluateText = `(function (module, exports, require, __dirname, __filename, ${globalNames.join(", ")}) { ${sourceText} })`;
        // eslint-disable-next-line no-eval
        const evaluateThunk = (void 0, eval)(evaluateText) as (module: any, exports: any, require: (id: string) => any, dirname: string, filename: string, ...globalArgs: any[]) => void;
        const module: { exports: any; } = { exports: {} };
        evaluateThunk.call(globals, module, module.exports, noRequire, vpath.dirname(sourceFile), sourceFile, FakeSymbol, ...globalArgs);
        return module.exports;
    }
}
