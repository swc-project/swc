import path from "node:path";
import readline from "node:readline";
import vm from "node:vm";

const PROTOCOL_VERSION = 1;
const harnessCache = new Map();

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

    return { name, message };
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
    const key = JSON.stringify(sources);
    let scripts = harnessCache.get(key);
    if (scripts !== undefined) {
        return scripts;
    }

    scripts = sources.map(
        ({ name, code }) => new vm.Script(code, { filename: name }),
    );
    harnessCache.set(key, scripts);
    return scripts;
}

function installHost(context, childCleanups) {
    const globalObject = vm.runInContext("globalThis", context);

    const createRealm = () => {
        const realmOutput = [];
        const realm = createContext(realmOutput);
        childCleanups.push(realm.cleanup);
        return realm.host;
    };

    const supported = {
        createRealm,
        detachArrayBuffer(buffer) {
            structuredClone(buffer, { transfer: [buffer] });
        },
        evalScript(source) {
            return new vm.Script(String(source), {
                filename: "$262.evalScript",
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

function createContext(consoleOutput) {
    const timers = new Set();
    const childCleanups = [];
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
    const sandbox = {
        clearInterval: (handle) => trackedClear(clearInterval, handle),
        clearTimeout: (handle) => trackedClear(clearTimeout, handle),
        console: capturedConsole(consoleOutput),
        queueMicrotask,
        setInterval: trackedSetInterval,
        setTimeout: trackedSetTimeout,
        structuredClone,
    };
    const context = vm.createContext(sandbox, {
        name: "test262-case",
        codeGeneration: { strings: true, wasm: true },
    });
    const host = installHost(context, childCleanups);
    const cleanup = () => {
        for (const handle of timers) {
            clearTimeout(handle);
            clearInterval(handle);
        }
        timers.clear();
        for (const cleanupChild of childCleanups) {
            cleanupChild();
        }
        childCleanups.length = 0;
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

function withTimeout(promise, remaining, timeoutMs) {
    let timer;
    const timeout = new Promise((_, reject) => {
        timer = setTimeout(
            () => reject(new ExecutionTimeout(timeoutMs)),
            remaining(),
        );
    });
    return Promise.race([promise, timeout]).finally(() => clearTimeout(timer));
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

function moduleResolver(request, context, remaining) {
    const definitions = new Map();
    for (const module of request.modules) {
        definitions.set(normalizedModulePath(module.path), module.code);
    }

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
            importModuleDynamically: async (specifier, referencingModule) => {
                const dependency = getModule(
                    resolve(specifier, referencingModule.identifier),
                );
                await ensureLinked(dependency);
                await ensureEvaluated(dependency);
                return dependency;
            },
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

    return { definitions, ensureEvaluated, ensureLinked, getModule };
}

async function executeScript(request, context, remaining, donePromise) {
    let script;
    // Strictness is materialized before SWC runs so transforms and minification
    // observe the same semantics as the final runtime execution.
    const source = request.code;
    try {
        script = new vm.Script(source, { filename: request.filename });
    } catch (error) {
        return { phase: "parse", error };
    }

    try {
        script.runInContext(context, { timeout: Math.max(1, remaining()) });
        if (request.async) {
            await withTimeout(donePromise, remaining, request.timeoutMs);
        } else {
            await Promise.resolve();
        }
        return { phase: "success" };
    } catch (error) {
        return { phase: "runtime", error };
    }
}

async function executeModule(request, context, remaining, donePromise) {
    const resolver = moduleResolver(request, context, remaining);
    const entryPath = normalizedModulePath(request.filename);
    resolver.definitions.set(entryPath, request.code);

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
        );
    } catch (error) {
        return { phase: "resolution", error };
    }

    try {
        await withTimeout(
            resolver.ensureEvaluated(entry),
            remaining,
            request.timeoutMs,
        );
        if (request.async) {
            await withTimeout(donePromise, remaining, request.timeoutMs);
        }
        return { phase: "success" };
    } catch (error) {
        return { phase: "runtime", error };
    }
}

async function execute(request) {
    if (request.protocolVersion !== PROTOCOL_VERSION) {
        throw new Error(
            `Unsupported protocol version ${request.protocolVersion}; expected ${PROTOCOL_VERSION}`,
        );
    }

    const consoleOutput = [];
    const { cleanup, context } = createContext(consoleOutput);
    const remaining = deadline(request.timeoutMs);
    const donePromise = installDone(context);

    try {
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
                ? await executeModule(request, context, remaining, donePromise)
                : await executeScript(request, context, remaining, donePromise);

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
        cleanup();
    }
}

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
