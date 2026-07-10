import path from "node:path";
import readline from "node:readline";
import vm from "node:vm";

const PROTOCOL_VERSION = 1;
const MAX_HARNESS_CACHE_ENTRIES = 256;

class HarnessScriptCache {
    constructor(maxEntries) {
        if (!Number.isSafeInteger(maxEntries) || maxEntries <= 0) {
            throw new RangeError("harness cache capacity must be positive");
        }
        this.maxEntries = maxEntries;
        this.scripts = new Map();
    }

    compile({ name, code, digest }) {
        const key = `${name}\0${digest}`;
        let script = this.scripts.get(key);
        if (script !== undefined) {
            // Map preserves insertion order, so reinsertion implements bounded
            // LRU without retaining a second recency index.
            this.scripts.delete(key);
            this.scripts.set(key, script);
            return script;
        }

        script = new vm.Script(code, { filename: name });
        this.scripts.set(key, script);
        if (this.scripts.size > this.maxEntries) {
            const oldestKey = this.scripts.keys().next().value;
            this.scripts.delete(oldestKey);
        }
        return script;
    }
}

const harnessCache = new HarnessScriptCache(MAX_HARNESS_CACHE_ENTRIES);

class UnsupportedHostCapability extends Error {
    constructor(capability) {
        super(`The Node.js Test262 host does not implement $262.${capability}`);
        this.name = "UnsupportedHostCapability";
        this.capability = capability;
    }
}

class ExecutionTimeout extends Error {
    constructor(timeoutMs) {
        super(`Test262 execution exceeded ${timeoutMs} ms`);
        this.name = "ExecutionTimeout";
    }
}

function errorDetails(error) {
    const name =
        typeof error?.name === "string"
            ? error.name
            : typeof error?.constructor?.name === "string"
              ? error.constructor.name
              : "Error";
    const message =
        typeof error?.message === "string" ? error.message : String(error);
    const stack = typeof error?.stack === "string" ? error.stack : undefined;

    return { name, message, ...(stack === undefined ? {} : { stack }) };
}

function responseForError(id, phase, error, consoleOutput) {
    if (error?.name === "UnsupportedHostCapability") {
        return {
            protocolVersion: PROTOCOL_VERSION,
            id,
            phase: "unsupported-host-capability",
            error: errorDetails(error),
            capability: error.capability,
            console: consoleOutput,
        };
    }

    if (
        error?.name === "ExecutionTimeout" ||
        error?.code === "ERR_SCRIPT_EXECUTION_TIMEOUT"
    ) {
        return {
            protocolVersion: PROTOCOL_VERSION,
            id,
            phase: "timeout",
            error: errorDetails(error),
            console: consoleOutput,
        };
    }

    return {
        protocolVersion: PROTOCOL_VERSION,
        id,
        phase,
        error: errorDetails(error),
        console: consoleOutput,
    };
}

function capturedConsole(output) {
    const capture = (level) => (...values) => {
        output.push({
            level,
            message: values.map((value) => String(value)).join(" "),
        });
    };

    return Object.freeze({
        debug: capture("debug"),
        error: capture("error"),
        info: capture("info"),
        log: capture("log"),
        warn: capture("warn"),
    });
}

function compileHarness(sources) {
    return sources.map((source) => harnessCache.compile(source));
}

function installHost(context, runtimeState) {
    const globalObject = vm.runInContext("globalThis", context);

    const createRealm = () => {
        if (typeof runtimeState.createRealm !== "function") {
            throw new UnsupportedHostCapability("createRealm");
        }
        return runtimeState.createRealm();
    };

    const supported = {
        createRealm,
        detachArrayBuffer(buffer) {
            structuredClone(buffer, { transfer: [buffer] });
        },
        evalScript(source) {
            return new vm.Script(String(source), {
                filename: "$262.evalScript",
                importModuleDynamically: (specifier) => {
                    if (
                        typeof runtimeState.importModuleDynamically !==
                        "function"
                    ) {
                        throw new UnsupportedHostCapability("dynamicImport");
                    }
                    return runtimeState.importModuleDynamically(specifier);
                },
            }).runInContext(context);
        },
        gc() {
            if (typeof globalThis.gc !== "function") {
                throw new UnsupportedHostCapability("gc");
            }
            globalThis.gc();
        },
        global: globalObject,
        monotonicNow() {
            return performance.now();
        },
    };

    const host = new Proxy(supported, {
        get(target, property, receiver) {
            if (typeof property !== "string" || property in target) {
                return Reflect.get(target, property, receiver);
            }
            throw new UnsupportedHostCapability(property);
        },
        has(target, property) {
            if (typeof property === "string" && !(property in target)) {
                return false;
            }
            return Reflect.has(target, property);
        },
    });

    Object.defineProperty(globalObject, "$262", {
        configurable: true,
        value: host,
        writable: true,
    });

    return host;
}

function createContext(consoleOutput, runtimeState) {
    const timers = new Set();
    const trackedSetTimeout = (callback, delay, ...arguments_) => {
        let handle;
        handle = setTimeout(() => {
            timers.delete(handle);
            callback(...arguments_);
        }, delay);
        timers.add(handle);
        return handle;
    };
    const trackedSetInterval = (callback, delay, ...arguments_) => {
        const handle = setInterval(callback, delay, ...arguments_);
        timers.add(handle);
        return handle;
    };
    const trackedClear = (clear, handle) => {
        timers.delete(handle);
        clear(handle);
    };
    const console = capturedConsole(consoleOutput);
    const sandbox = {
        clearInterval: (handle) => trackedClear(clearInterval, handle),
        clearTimeout: (handle) => trackedClear(clearTimeout, handle),
        console,
        print: (...values) => {
            consoleOutput.push({
                level: "print",
                message: values.map((value) => String(value)).join(" "),
            });
        },
        queueMicrotask,
        setInterval: trackedSetInterval,
        setTimeout: trackedSetTimeout,
        structuredClone,
    };
    const context = vm.createContext(sandbox, {
        name: "test262-case",
        codeGeneration: { strings: true, wasm: true },
    });
    const host = installHost(context, runtimeState);
    const cleanup = () => {
        for (const handle of timers) {
            clearTimeout(handle);
            clearInterval(handle);
        }
        timers.clear();
    };
    return { cleanup, context, host };
}

function deadline(timeoutMs) {
    const end = Date.now() + timeoutMs;
    return () => {
        const remaining = end - Date.now();
        if (remaining <= 0) {
            throw new ExecutionTimeout(timeoutMs);
        }
        return remaining;
    };
}

class UnhandledCaseError {
    constructor(error) {
        this.error = error;
    }
}

// The worker processes requests serially, so process-level asynchronous errors
// can be owned by the one active request. Each lifecycle installs exact listener
// functions and removes them before the next JSONL request is read.
class ActiveCaseLifecycle {
    constructor() {
        this.captured = false;
        this.resolveUnhandled = undefined;
        this.unhandled = new Promise((resolve) => {
            this.resolveUnhandled = resolve;
        });
        this.onUnhandledRejection = (reason) => this.capture(reason);
        this.onUncaughtException = (error) => this.capture(error);

        process.on("unhandledRejection", this.onUnhandledRejection);
        process.on("uncaughtException", this.onUncaughtException);
    }

    capture(error) {
        if (this.captured) {
            return;
        }
        this.captured = true;
        this.resolveUnhandled(error);
    }

    async race(promise) {
        const completion = Promise.resolve(promise).then(
            (value) => ({ kind: "completed", value }),
            (error) => ({ kind: "thrown", error }),
        );
        const unhandled = this.unhandled.then((error) => ({
            kind: "unhandled",
            error,
        }));
        const outcome = await Promise.race([completion, unhandled]);

        if (outcome.kind === "completed") {
            return outcome.value;
        }
        if (outcome.kind === "thrown") {
            throw outcome.error;
        }
        throw new UnhandledCaseError(outcome.error);
    }

    async drain() {
        // Node reports unhandled promise rejections after the current microtask
        // queue. Waiting through the check phase prevents a successful response
        // from being emitted before that report arrives.
        await this.race(new Promise((resolve) => setImmediate(resolve)));
    }

    close() {
        process.off("unhandledRejection", this.onUnhandledRejection);
        process.off("uncaughtException", this.onUncaughtException);
    }
}

function runtimeOutcome(error, defaultPhase) {
    if (error instanceof UnhandledCaseError) {
        return { phase: "runtime", error: error.error };
    }
    return { phase: defaultPhase, error };
}

function withTimeout(promise, remaining, timeoutMs, lifecycle) {
    let timer;
    const timeout = new Promise((_, reject) => {
        timer = setTimeout(
            () => reject(new ExecutionTimeout(timeoutMs)),
            remaining(),
        );
    });
    return lifecycle
        .race(Promise.race([promise, timeout]))
        .finally(() => clearTimeout(timer));
}

function installDone(context) {
    let settled = false;
    let resolveDone;
    let rejectDone;
    const promise = new Promise((resolve, reject) => {
        resolveDone = resolve;
        rejectDone = reject;
    });

    const done = (error) => {
        if (settled) {
            return;
        }
        settled = true;
        if (error === undefined || error === null) {
            resolveDone();
        } else {
            rejectDone(error);
        }
    };

    Object.defineProperty(vm.runInContext("globalThis", context), "$DONE", {
        configurable: true,
        value: done,
        writable: true,
    });
    return promise;
}

function runHarness(context, sources, remaining) {
    for (const script of compileHarness(sources)) {
        script.runInContext(context, { timeout: Math.max(1, remaining()) });
    }
}

function normalizedModulePath(value) {
    const normalized = path.posix.normalize(String(value).replaceAll("\\", "/"));
    return normalized.startsWith("/") ? normalized : `/${normalized}`;
}

function moduleDefinitions(request) {
    const definitions = new Map();
    for (const module of request.modules) {
        definitions.set(normalizedModulePath(module.path), module.code);
    }
    if (request.goal === "module") {
        definitions.set(normalizedModulePath(request.filename), request.code);
    }
    return definitions;
}

function moduleResolver(definitions, context, remaining) {
    const modules = new Map();
    const linkPromises = new Map();
    const evaluationPromises = new Map();

    const resolve = (specifier, referencingIdentifier) => {
        const rawSpecifier = String(specifier).replaceAll("\\", "/");
        if (!rawSpecifier.startsWith(".") && !rawSpecifier.startsWith("/")) {
            const bare = normalizedModulePath(rawSpecifier);
            if (definitions.has(bare)) {
                return bare;
            }
            throw new SyntaxError(`Unable to resolve bare module '${specifier}'`);
        }

        const base = path.posix.dirname(referencingIdentifier);
        const resolved = normalizedModulePath(
            rawSpecifier.startsWith("/")
                ? rawSpecifier
                : path.posix.join(base, rawSpecifier),
        );
        if (!definitions.has(resolved)) {
            throw new SyntaxError(
                `Unable to resolve module '${specifier}' from '${referencingIdentifier}'`,
            );
        }
        return resolved;
    };

    const getModule = (identifier) => {
        let module = modules.get(identifier);
        if (module !== undefined) {
            return module;
        }

        const code = definitions.get(identifier);
        if (code === undefined) {
            throw new SyntaxError(`Missing module source for '${identifier}'`);
        }

        module = new vm.SourceTextModule(code, {
            context,
            identifier,
            initializeImportMeta(meta) {
                meta.url = `file://${identifier}`;
            },
            importModuleDynamically: (specifier, referencingModule) =>
                importDynamically(specifier, referencingModule.identifier),
        });
        modules.set(identifier, module);
        return module;
    };

    const linker = (specifier, referencingModule) =>
        getModule(resolve(specifier, referencingModule.identifier));

    const ensureLinked = (module) => {
        let promise = linkPromises.get(module.identifier);
        if (promise !== undefined) {
            return promise;
        }
        if (module.status !== "unlinked") {
            return Promise.resolve();
        }
        promise = module.link(linker);
        linkPromises.set(module.identifier, promise);
        return promise;
    };

    const ensureEvaluated = (module) => {
        if (module.status === "evaluated") {
            return Promise.resolve();
        }
        if (module.status === "errored") {
            return Promise.reject(module.error);
        }
        let promise = evaluationPromises.get(module.identifier);
        if (promise === undefined) {
            promise = module.evaluate({ timeout: Math.max(1, remaining()) });
            evaluationPromises.set(module.identifier, promise);
        }
        return promise;
    };

    const importDynamically = async (specifier, referencingIdentifier) => {
        const dependency = getModule(resolve(specifier, referencingIdentifier));
        await ensureLinked(dependency);
        await ensureEvaluated(dependency);
        return dependency;
    };

    return {
        ensureEvaluated,
        ensureLinked,
        getModule,
        importDynamically,
    };
}

function createExecutionRealm(execution, consoleOutput) {
    const runtimeState = {};
    const created = createContext(consoleOutput, runtimeState);
    execution.cleanupTree.push(created.cleanup);

    // Source definitions and the deadline belong to the request, but module
    // records belong to a realm. A separate resolver ensures every
    // SourceTextModule is constructed with this realm's vm.Context.
    const resolver = moduleResolver(
        execution.definitions,
        created.context,
        execution.remaining,
    );
    runtimeState.importModuleDynamically = (specifier) =>
        resolver.importDynamically(specifier, execution.entryIdentifier);
    runtimeState.createRealm = () => createExecutionRealm(execution, []).host;

    return { ...created, resolver, runtimeState };
}

async function executeScript(
    request,
    context,
    remaining,
    donePromise,
    runtimeState,
    lifecycle,
) {
    let script;
    // Strictness is materialized before SWC runs so transforms and minification
    // observe the same semantics as the final runtime execution.
    const source = request.code;
    try {
        script = new vm.Script(source, {
            filename: request.filename,
            importModuleDynamically: (specifier) =>
                runtimeState.importModuleDynamically(specifier),
        });
    } catch (error) {
        return { phase: "parse", error };
    }

    try {
        script.runInContext(context, { timeout: Math.max(1, remaining()) });
        if (request.async) {
            await withTimeout(
                donePromise,
                remaining,
                request.timeoutMs,
                lifecycle,
            );
        }
        await lifecycle.drain();
        return { phase: "success" };
    } catch (error) {
        return runtimeOutcome(error, "runtime");
    }
}

async function executeModule(
    request,
    context,
    remaining,
    donePromise,
    resolver,
    lifecycle,
) {
    const entryPath = normalizedModulePath(request.filename);

    let entry;
    try {
        entry = resolver.getModule(entryPath);
    } catch (error) {
        return { phase: "parse", error };
    }

    try {
        await withTimeout(
            resolver.ensureLinked(entry),
            remaining,
            request.timeoutMs,
            lifecycle,
        );
    } catch (error) {
        return runtimeOutcome(error, "resolution");
    }

    try {
        await withTimeout(
            resolver.ensureEvaluated(entry),
            remaining,
            request.timeoutMs,
            lifecycle,
        );
        if (request.async) {
            await withTimeout(
                donePromise,
                remaining,
                request.timeoutMs,
                lifecycle,
            );
        }
        await lifecycle.drain();
        return { phase: "success" };
    } catch (error) {
        return runtimeOutcome(error, "runtime");
    }
}

async function execute(request) {
    if (request.protocolVersion !== PROTOCOL_VERSION) {
        throw new Error(
            `Unsupported protocol version ${request.protocolVersion}; expected ${PROTOCOL_VERSION}`,
        );
    }

    const lifecycle = new ActiveCaseLifecycle();
    const consoleOutput = [];
    let cleanup = () => {};

    try {
        const remaining = deadline(request.timeoutMs);
        const entryIdentifier = normalizedModulePath(request.filename);
        const execution = {
            cleanupTree: [],
            definitions: moduleDefinitions(request),
            entryIdentifier,
            remaining,
        };
        const created = createExecutionRealm(execution, consoleOutput);
        cleanup = () => {
            while (execution.cleanupTree.length > 0) {
                execution.cleanupTree.pop()();
            }
        };
        const { context, resolver, runtimeState } = created;
        const donePromise = request.async ? installDone(context) : undefined;

        try {
            runHarness(context, request.harness, remaining);
        } catch (error) {
            return responseForError(
                request.id,
                "runtime",
                error,
                consoleOutput,
            );
        }

        const outcome =
            request.goal === "module"
                ? await executeModule(
                      request,
                      context,
                      remaining,
                      donePromise,
                      resolver,
                      lifecycle,
                  )
                : await executeScript(
                      request,
                      context,
                      remaining,
                      donePromise,
                      runtimeState,
                      lifecycle,
                  );

        if (outcome.phase === "success") {
            return {
                protocolVersion: PROTOCOL_VERSION,
                id: request.id,
                phase: "success",
                console: consoleOutput,
            };
        }
        return responseForError(
            request.id,
            outcome.phase,
            outcome.error,
            consoleOutput,
        );
    } finally {
        try {
            cleanup();
        } finally {
            lifecycle.close();
        }
    }
}

function runHarnessCacheSelfTest() {
    const cache = new HarnessScriptCache(2);
    const first = { name: "assert.js", code: "void 1;", digest: "first" };
    const second = { name: "sta.js", code: "void 2;", digest: "second" };
    const third = { name: "helper.js", code: "void 3;", digest: "third" };

    const firstScript = cache.compile(first);
    if (cache.compile(first) !== firstScript) {
        throw new Error("harness cache did not reuse an identical source");
    }
    const secondScript = cache.compile(second);
    cache.compile(first);
    cache.compile(third);
    if (cache.scripts.size !== 2) {
        throw new Error("harness cache exceeded its configured capacity");
    }
    if (cache.compile(first) !== firstScript) {
        throw new Error("harness cache evicted the most recently used source");
    }
    if (cache.compile(second) === secondScript) {
        throw new Error("harness cache did not evict the least recently used source");
    }
    if (
        cache.compile({ ...first, code: "void 4;", digest: "changed" }) ===
        firstScript
    ) {
        throw new Error("harness cache ignored a source content digest change");
    }
}

function runProtocol() {
    const input = readline.createInterface({
        input: process.stdin,
        crlfDelay: Infinity,
        terminal: false,
    });

    let pending = Promise.resolve();
    input.on("line", (line) => {
        pending = pending.then(async () => {
            let request;
            try {
                request = JSON.parse(line);
                const response = await execute(request);
                process.stdout.write(`${JSON.stringify(response)}\n`);
            } catch (error) {
                const response = responseForError(
                    request?.id ?? 0,
                    "runtime",
                    error,
                    [],
                );
                process.stdout.write(`${JSON.stringify(response)}\n`);
            }
        });
    });
}

if (process.argv[2] === "--self-test-harness-cache") {
    runHarnessCacheSelfTest();
} else {
    runProtocol();
}
