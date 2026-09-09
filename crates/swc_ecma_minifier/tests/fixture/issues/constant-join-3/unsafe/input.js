function single(value) {
    return [
        [value].join(),
        [value].join(""),
        [value].join("-"),
        [value].join(null),
        [value].join(void 0),
        [value = null].join(),
        [value = void 0].join(),
        [value + "x"].join(),
        [value + value].join(),
    ].join("|");
}

function concatenate(a, b, c) {
    return [
        [a, b].join(""),
        [a + b, c].join(""),
        [a, b, c + "tail"].join(""),
        [a, b + c + "tail"].join(""),
        [a + "bar", c].join(""),
        [a, "bar" + c].join(""),
        [a, b + "baz"].join(""),
        ["foo" + a, null, b + "moo"].join(""),
        [a + b, c, "tail"].join(""),
        [a + b, null, c].join(""),
        ["head", a + b].join(""),
        ["head", a + b + "tail"].join(""),
    ].join("|");
}

function effect_free_trailing_string_reassociation(value) {
    return "prefix" + (value + "suffix");
}

function effect_free_leading_string_reassociation(value) {
    return value + ("prefix" + 1);
}

function effectful_leading_string_reassociation(value, side_effect) {
    return value + ("prefix" + side_effect());
}

function nullish(value) {
    return [
        [null].join(),
        [,].join(),
        [, 1, , 3].join(),
        [value, null, undefined, , "tail"].join("-"),
        [null, "foo", null, value + "baz"].join("-"),
        [null, "foo", null, value + "baz"].join(""),
    ].join("|");
}

function effects() {
    var events = [];
    function mark(name, value) {
        events.push(name);
        return value;
    }
    console.log([mark("first", 1), mark("second", 2), "tail"].join(""));
    console.log([void mark("void", 3)].join());
    console.log(["head", void mark("mixed", 4)].join(""));
    console.log([mark("element", 5)].join((mark("separator", 6), "-")));
    let state = 1;
    console.log([
        {
            toString() {
                return state;
            },
            valueOf() {
                return state;
            },
        },
        "x" + (state = 2, "y"),
    ].join(""));
    state = 1;
    console.log([
        {
            toString() {
                return state;
            },
            valueOf() {
                return state;
            },
        },
        (state = 2, "y"),
    ].join(""));
    console.log(events.join(","));
}

function singleton_join_lookup_order() {
    const join = Array.prototype.join;
    try {
        [delete Array.prototype.join].join();
    } catch {
        console.log(true);
    }
    Array.prototype.join = join;
}

singleton_join_lookup_order();

function multi_element_join_lookup_order() {
    const join = Array.prototype.join;
    try {
        [delete Array.prototype.join, true].join("");
    } catch {
        console.log(true);
    }
    Array.prototype.join = join;
}

multi_element_join_lookup_order();

function coercion() {
    console.log([{
        toString() {
            return "s";
        },
        valueOf() {
            return 1;
        },
    }].join(""));
    console.log([
        {
            toString() {
                return "s";
            },
            valueOf() {
                return 1;
            },
        },
        "x",
    ].join(""));
}

function local_object_coercion(value) {
    console.log([value].join(""));
    console.log([value = value].join(""));
}

function array_coercion_order(value) {
    let array;
    try {
        [array = Array(value), array.toString = 0].join("");
    } catch {
        console.log(true);
    }
}

array_coercion_order(1);

function regexp_coercion_order() {
    let value;
    try {
        [value = RegExp(), value.toString = 0].join("");
    } catch {
        console.log(true);
    }
}

regexp_coercion_order();

function intrinsic_global_coercion_order() {
    const mathToString = Math.toString;
    try {
        [Math, Math.toString = 0].join("");
    } catch {
        console.log(true);
    }
    Math.toString = mathToString;

    const jsonToString = JSON.toString;
    try {
        [JSON, JSON.toString = 0].join("");
    } catch {
        console.log(true);
    }
    JSON.toString = jsonToString;

    const objectToString = Object.toString;
    try {
        [Object, Object.toString = 0].join("");
    } catch {
        console.log(true);
    }
    Object.toString = objectToString;
}

intrinsic_global_coercion_order();

function self_global_coercion_order() {
    globalThis.self = globalThis;
    const selfToString = self.toString;
    try {
        [self, self.toString = 0].join("");
    } catch {
        console.log(true);
    }
    self.toString = selfToString;
}

self_global_coercion_order();

function global_alias_coercion_order() {
    const globalToString = global.toString;
    try {
        [global, global.toString = 0].join("");
    } catch {
        console.log(true);
    }
    global.toString = globalToString;

    globalThis.window = globalThis;
    const windowToString = window.toString;
    try {
        [window, window.toString = 0].join("");
    } catch {
        console.log(true);
    }
    window.toString = windowToString;
    delete globalThis.window;
}

global_alias_coercion_order();

function document_coercion() {
    if (typeof document === "undefined") {
        return;
    }

    const documentToString = document.toString;
    const documentValueOf = document.valueOf;
    document.toString = () => "string-hint";
    document.valueOf = () => 7;
    console.log([document].join(""));
    document.toString = documentToString;
    document.valueOf = documentValueOf;
}

document_coercion();

function fetch_constructor_coercion() {
    if (typeof Headers !== "undefined") {
        const headersToString = Headers.toString;
        const headersValueOf = Headers.valueOf;
        Headers.toString = () => "string-hint";
        Headers.valueOf = () => 7;
        console.log([Headers].join(""));
        Headers.toString = headersToString;
        Headers.valueOf = headersValueOf;
    }

    if (typeof Request !== "undefined") {
        const requestToString = Request.toString;
        const requestValueOf = Request.valueOf;
        Request.toString = () => "string-hint";
        Request.valueOf = () => 7;
        console.log([Request].join(""));
        Request.toString = requestToString;
        Request.valueOf = requestValueOf;
    }

    if (typeof Response !== "undefined") {
        const responseToString = Response.toString;
        const responseValueOf = Response.valueOf;
        Response.toString = () => "string-hint";
        Response.valueOf = () => 7;
        console.log([Response].join(""));
        Response.toString = responseToString;
        Response.valueOf = responseValueOf;
    }
}

fetch_constructor_coercion();

function navigator_coercion() {
    if (typeof navigator === "undefined") {
        return;
    }

    const navigatorToString = navigator.toString;
    const navigatorValueOf = navigator.valueOf;
    navigator.toString = () => "string-hint";
    navigator.valueOf = () => 7;
    console.log([navigator].join(""));
    navigator.toString = navigatorToString;
    navigator.valueOf = navigatorValueOf;
}

navigator_coercion();

function crypto_coercion() {
    if (typeof crypto === "undefined") {
        return;
    }

    const cryptoToString = crypto.toString;
    const cryptoValueOf = crypto.valueOf;
    crypto.toString = () => "string-hint";
    crypto.valueOf = () => 7;
    console.log([crypto].join(""));
    crypto.toString = cryptoToString;
    crypto.valueOf = cryptoValueOf;
}

crypto_coercion();

function performance_coercion() {
    if (typeof performance === "undefined") {
        return;
    }

    const performanceToString = performance.toString;
    const performanceValueOf = performance.valueOf;
    performance.toString = () => "string-hint";
    performance.valueOf = () => 7;
    console.log([performance].join(""));
    performance.toString = performanceToString;
    performance.valueOf = performanceValueOf;
}

performance_coercion();

function blob_coercion() {
    if (typeof Blob === "undefined") {
        return;
    }

    const blobToString = Blob.toString;
    const blobValueOf = Blob.valueOf;
    Blob.toString = () => "string-hint";
    Blob.valueOf = () => 7;
    console.log([Blob].join(""));
    Blob.toString = blobToString;
    Blob.valueOf = blobValueOf;
}

blob_coercion();

function web_socket_coercion() {
    if (typeof WebSocket === "undefined") {
        return;
    }

    const webSocketToString = WebSocket.toString;
    const webSocketValueOf = WebSocket.valueOf;
    WebSocket.toString = () => "string-hint";
    WebSocket.valueOf = () => 7;
    console.log([WebSocket].join(""));
    WebSocket.toString = webSocketToString;
    WebSocket.valueOf = webSocketValueOf;
}

web_socket_coercion();

function form_data_coercion() {
    if (typeof FormData === "undefined") {
        return;
    }

    const formDataToString = FormData.toString;
    const formDataValueOf = FormData.valueOf;
    FormData.toString = () => "string-hint";
    FormData.valueOf = () => 7;
    console.log([FormData].join(""));
    FormData.toString = formDataToString;
    FormData.valueOf = formDataValueOf;
}

form_data_coercion();

function opener_nullish() {
    return [opener].join("-");
}

function process_coercion() {
    const processToString = process.toString;
    const processValueOf = process.valueOf;
    process.toString = () => "string-hint";
    process.valueOf = () => 7;
    console.log([process].join(""));
    process.toString = processToString;
    process.valueOf = processValueOf;
}

process_coercion();

function intrinsic_constructor_coercion_order() {
    const arrayToString = Array.toString;
    try {
        [Array, Array.toString = 0].join("");
    } catch {
        console.log(true);
    }
    Array.toString = arrayToString;
}

intrinsic_constructor_coercion_order();

function legacy_global_coercion_order() {
    const escapeToString = escape.toString;
    try {
        [escape, escape.toString = 0].join("");
    } catch {
        console.log(true);
    }
    escape.toString = escapeToString;

    const unescapeToString = unescape.toString;
    try {
        [unescape, unescape.toString = 0].join("");
    } catch {
        console.log(true);
    }
    unescape.toString = unescapeToString;
}

legacy_global_coercion_order();

function arguments_coercion() {
    arguments.toString = () => "s";
    arguments.valueOf = () => 1;
    return [arguments].join("");
}

console.log(arguments_coercion());

function signed_typed_array_constructor_coercion_order() {
    const int8ArrayToString = Int8Array.toString;
    try {
        [Int8Array, Int8Array.toString = 0].join("");
    } catch {
        console.log(true);
    }
    Int8Array.toString = int8ArrayToString;

    const int16ArrayToString = Int16Array.toString;
    try {
        [Int16Array, Int16Array.toString = 0].join("");
    } catch {
        console.log(true);
    }
    Int16Array.toString = int16ArrayToString;

    const int32ArrayToString = Int32Array.toString;
    try {
        [Int32Array, Int32Array.toString = 0].join("");
    } catch {
        console.log(true);
    }
    Int32Array.toString = int32ArrayToString;
}

signed_typed_array_constructor_coercion_order();

function float16_array_constructor_coercion_order() {
    if (typeof Float16Array === "undefined") {
        return;
    }

    const float16ArrayToString = Float16Array.toString;
    try {
        [Float16Array, Float16Array.toString = 0].join("");
    } catch {
    }
    Float16Array.toString = float16ArrayToString;
}

float16_array_constructor_coercion_order();

function abort_constructor_coercion_order() {
    if (typeof AbortController !== "undefined") {
        const abortControllerToString = AbortController.toString;
        try {
            [AbortController, AbortController.toString = 0].join("");
        } catch {
            console.log(true);
        }
        AbortController.toString = abortControllerToString;
    }

    if (typeof AbortSignal !== "undefined") {
        const abortSignalToString = AbortSignal.toString;
        try {
            [AbortSignal, AbortSignal.toString = 0].join("");
        } catch {
            console.log(true);
        }
        AbortSignal.toString = abortSignalToString;
    }
}

abort_constructor_coercion_order();

function optional_member_coercion_order() {
    let state = 1;
    const object = {
        value: {
            toString() {
                return state;
            },
            valueOf() {
                return state;
            },
        },
    };
    console.log(object?.value + ("x" + (state = 2, "")));
}

optional_member_coercion_order();

function optional_member_property_symbol_order() {
    let hit = false;
    try {
        ({ value: Symbol() })?.value + ("x" + (hit = true, ""));
    } catch {}
    console.log(hit);
}

optional_member_property_symbol_order();

function aggregate_error_coercion_order() {
    let value;
    try {
        [value = AggregateError(), value.toString = 0].join("");
    } catch {
        console.log(true);
    }
}

aggregate_error_coercion_order();

local_object_coercion({
    toString() {
        return "s";
    },
    valueOf() {
        return 1;
    },
});

function symbol_order() {
    const events = [];
    function mark() {
        events.push("mark");
    }
    try {
        [Symbol(), mark()].join("");
    } catch {}
    console.log(events.join(","));
}

function indirect_symbol_order() {
    const events = [];
    function make_symbol() {
        return Symbol();
    }
    function mark() {
        events.push("mark");
    }
    try {
        [make_symbol(), mark()].join("");
    } catch {}
    console.log(events.join(","));
}

function member_symbol_order() {
    const events = [];
    const factory = {
        make() {
            return Symbol();
        },
    };
    function mark() {
        events.push("mark");
    }
    try {
        [factory.make(), mark()].join("");
    } catch {}
    console.log(events.join(","));
}

function parenthesized_object_coercion() {
    console.log([({
        toString() {
            return "s";
        },
        valueOf() {
            return 1;
        },
    })].join(""));
}

function nested_addition_order() {
    let state = 1;
    function later() {
        state = 2;
        return "";
    }
    console.log(["head", {
        toString() {
            return state;
        },
        valueOf() {
            return state;
        },
    } + (later() + "y")].join(""));
}

function dynamic_nested_addition_order() {
    let state = 1;
    const value = {
        toString() {
            return state;
        },
        valueOf() {
            return state;
        },
    };
    console.log(["head", value + ("x" + (state = 2, ""))].join(""));
}

dynamic_nested_addition_order();

function dynamic_call_nested_addition_order() {
    let state = 1;
    function make() {
        return {
            toString() {
                return state;
            },
            valueOf() {
                return state;
            },
        };
    }
    function later() {
        state = 2;
        return "";
    }
    console.log(["head", make() + ("x" + later())].join(""));
}

dynamic_call_nested_addition_order();

function new_target_coercion_order() {
    let state = 1;
    new.target.toString = () => state;
    const later = () => {
        state = 2;
        return "";
    };
    console.log(new.target + ("x" + later()));
}

new new_target_coercion_order();

function class_coercion() {
    console.log([class {
        static valueOf() {
            return 1;
        }
        static toString() {
            return "s";
        }
    }].join(""));
}

async function awaited() {
    return [[await null].join(""), [await void 0].join("")].join("|");
}

async function awaited_symbol_order() {
    const events = [];
    function mark() {
        events.push("mark");
    }
    try {
        [await Symbol(), mark()].join("");
    } catch {}
    console.log(events.join(","));
}

async function awaited_object_order() {
    let state = 1;
    console.log([
        await {
            toString() {
                return state;
            },
            valueOf() {
                return state;
            },
        },
        state = 2,
    ].join(""));
}

function value_selecting_object_coercion(flag, value) {
    console.log([flag ? {
        toString() {
            return "s";
        },
        valueOf() {
            return 1;
        },
    } : 0].join(""));
    console.log([flag && class {
        static toString() {
            return "s";
        }
        static valueOf() {
            return 1;
        }
    }].join(""));
    console.log([!flag || class {
        static toString() {
            return "s";
        }
        static valueOf() {
            return 1;
        }
    }].join(""));
    console.log([value ?? class {
        static toString() {
            return "s";
        }
        static valueOf() {
            return 1;
        }
    }].join(""));
}

function value_selecting_symbol_order(flag, value) {
    const events = [];
    function mark() {
        events.push("mark");
    }
    try {
        console.log([flag ? Symbol() : 0, mark()].join(""));
    } catch {}
    try {
        console.log([flag && Symbol(), mark()].join(""));
    } catch {}
    try {
        console.log([!flag || Symbol(), mark()].join(""));
    } catch {}
    try {
        console.log([value ?? Symbol(), mark()].join(""));
    } catch {}
    console.log(events.join(","));
}

function assigned_class_coercion() {
    let assigned;
    console.log([assigned = class {
        static valueOf() {
            return 1;
        }
        static toString() {
            return "s";
        }
    }].join(""));
}

function assigned_symbol_order() {
    let assigned;
    const events = [];
    function mark() {
        events.push("mark");
    }
    try {
        [assigned = Symbol(), mark()].join("");
    } catch {}
    console.log(events.join(","));
}

function logical_assigned_symbol_order() {
    let assigned;
    const events = [];
    function mark() {
        events.push("mark");
    }
    try {
        [assigned ||= Symbol(), mark()].join("");
    } catch {}
    console.log(events.join(","));
}

function logical_assigned_nullish() {
    let assigned;
    return [assigned ||= null].join("");
}

function logical_assigned_class_coercion() {
    let assigned;
    console.log([assigned ||= class {
        static valueOf() {
            return 1;
        }
        static toString() {
            return "s";
        }
    }].join(""));
}

function tagged_template_symbol_order() {
    const events = [];
    function tag() {
        return Symbol();
    }
    function mark() {
        events.push("mark");
    }
    try {
        [tag`x`, mark()].join("");
    } catch {}
    console.log(events.join(","));
}

function tagged_template_object_coercion() {
    function tag() {
        return {
            toString() {
                return "s";
            },
            valueOf() {
                return 1;
            },
        };
    }
    console.log([tag`x`].join(""));
}

function iife_symbol_order() {
    const events = [];
    function mark() {
        events.push("mark");
    }
    try {
        [(() => Symbol())(), mark()].join("");
    } catch {}
    console.log(events.join(","));
}

function optional_member_symbol_order() {
    const events = [];
    const factory = {
        make() {
            return Symbol();
        },
    };
    function mark() {
        events.push("mark");
    }
    try {
        [factory?.make(), mark()].join("");
    } catch {}
    console.log(events.join(","));
}

function conditional_nullish_join(flag) {
    return [flag ? null : 1].join("");
}

function call_object_coercion() {
    function make() {
        return {
            toString() {
                return "s";
            },
            valueOf() {
                return 1;
            },
        };
    }
    return [make()].join("");
}

function identifier_symbol_order(value) {
    let hit = false;
    try {
        [value, hit = true].join("");
    } catch {}
    return hit;
}

function optional_member_nullish(value) {
    return [value?.field].join("");
}

function member_value_symbol_order() {
    const events = [];
    function mark() {
        events.push("mark");
    }
    try {
        [{ value: Symbol() }.value, mark()].join("");
    } catch {}
    return events.join(",");
}

function member_object_coercion() {
    return [{
        value: {
            toString() {
                return "s";
            },
            valueOf() {
                return 1;
            },
        },
    }.value].join("");
}

function super_property_object_coercion() {
    class Base {}
    Base.value = {
        toString() {
            return "s";
        },
        valueOf() {
            return 1;
        },
    };
    class Derived extends Base {
        static read() {
            return [super.value].join("");
        }
    }
    return Derived.read();
}

function new_target_nullish() {
    return [new.target].join("");
}

function iife_object_coercion() {
    return [(() => ({
        toString() {
            return "s";
        },
        valueOf() {
            return 1;
        },
    }))()].join("");
}

function this_object_coercion() {
    return [this].join("");
}

function super_method_object_coercion() {
    class Base {
        static make() {
            return {
                toString() {
                    return "s";
                },
                valueOf() {
                    return 1;
                },
            };
        }
    }
    class Derived extends Base {
        static read() {
            return [super.make()].join("");
        }
    }
    return Derived.read();
}

function yielded_symbol_order() {
    let hit = false;
    function* generator() {
        try {
            [yield 0, hit = true].join("");
        } catch {}
    }
    const iterator = generator();
    iterator.next();
    iterator.next(Symbol());
    return hit;
}

function yielded_object_coercion() {
    function* generator() {
        return [yield 0].join("");
    }
    const iterator = generator();
    iterator.next();
    return iterator.next({
        toString() {
            return "s";
        },
        valueOf() {
            return 1;
        },
    }).value;
}

function assigned_sequence_object_coercion() {
    let assigned;
    function make() {
        return {
            toString() {
                return "s";
            },
            valueOf() {
                return 1;
            },
        };
    }
    return [assigned = (0, make())].join("");
}

function wrapped_symbol_order() {
    let saved;
    let hit = false;
    try {
        [saved = (0, Symbol()), hit = true].join("");
    } catch {}
    console.log(hit);

    function make() {
        return Symbol();
    }

    hit = false;
    try {
        [(0, make)(), hit = true].join("");
    } catch {}
    console.log(hit);
}

function direct_super_object_coercion() {
    class Base {
        constructor() {
            this.toString = () => "s";
            this.valueOf = () => 1;
        }
    }
    class Derived extends Base {
        constructor() {
            console.log([super()].join(""));
        }
    }
    new Derived();
}

function call_valued_callee_object_coercion() {
    function makeFactory() {
        return function () {
            return {
                toString() {
                    return "s";
                },
                valueOf() {
                    return 1;
                },
            };
        };
    }
    return [makeFactory()()].join("");
}

function arrow_object_coercion_order() {
    let value;
    try {
        [value = () => 0, value.toString = 0].join("");
    } catch {
        return true;
    }
    return false;
}

function object_call_coercion(value) {
    return [Object(value)].join("");
}

function webassembly_coercion_order() {
    const toString = WebAssembly.toString;
    try {
        [WebAssembly, WebAssembly.toString = 0].join("");
    } catch {
        console.log(true);
    }
    WebAssembly.toString = toString;
}

function console_coercion_order() {
    const toString = console.toString;
    try {
        [console, console.toString = 0].join("");
    } catch {
        console.log(true);
    }
    console.toString = toString;
}

function disposable_stack_coercion_order() {
    if (typeof DisposableStack !== "undefined") {
        const disposableStackToString = DisposableStack.toString;
        try {
            [DisposableStack, DisposableStack.toString = 0].join("");
        } catch {
            console.log(true);
        }
        DisposableStack.toString = disposableStackToString;
    }

    if (typeof AsyncDisposableStack !== "undefined") {
        const asyncDisposableStackToString = AsyncDisposableStack.toString;
        try {
            [AsyncDisposableStack, AsyncDisposableStack.toString = 0].join("");
        } catch {
            console.log(true);
        }
        AsyncDisposableStack.toString = asyncDisposableStackToString;
    }
}

function prompt_nullish() {
    globalThis.prompt = () => null;
    const result = [prompt()].join("");
    delete globalThis.prompt;
    return result;
}

function queue_microtask_nullish() {
    return [queueMicrotask(() => {})].join("");
}

function timer_cancellation_nullish() {
    return [
        [clearTimeout(0)].join(""),
        [clearInterval(0)].join(""),
        [clearImmediate(0)].join(""),
    ].join("|");
}

function timer_handle_coercion_order() {
    let timeout;
    try {
        [timeout = setTimeout(() => {}), timeout[Symbol.toPrimitive] = 0].join("");
    } catch {
        console.log(true);
    } finally {
        clearTimeout(timeout);
    }

    let interval;
    try {
        [interval = setInterval(() => {}), interval[Symbol.toPrimitive] = 0].join("");
    } catch {
        console.log(true);
    } finally {
        clearInterval(interval);
    }

    let immediate;
    try {
        [immediate = setImmediate(() => {}), immediate[Symbol.toPrimitive] = 0].join("");
    } catch {
        console.log(true);
    } finally {
        clearImmediate(immediate);
    }
}

function fetch_coercion_order() {
    let promise;
    try {
        [promise = fetch("data:,"), promise.toString = 0].join("");
    } catch {
        console.log(true);
    }
}

function fetch_function_coercion_order() {
    const fetchToString = fetch.toString;
    try {
        [fetch, fetch.toString = 0].join("");
    } catch {
        console.log(true);
    }
    fetch.toString = fetchToString;
}

function iterator_coercion_order() {
    if (typeof Iterator !== "undefined") {
        const iteratorToString = Iterator.toString;
        try {
            [Iterator, Iterator.toString = 0].join("");
        } catch {
            console.log(true);
        }
        Iterator.toString = iteratorToString;
    }
}

function async_iterator_coercion_order() {
    if (typeof AsyncIterator !== "undefined") {
        const asyncIteratorToString = AsyncIterator.toString;
        try {
            [AsyncIterator, AsyncIterator.toString = 0].join("");
        } catch {
            console.log(true);
        }
        AsyncIterator.toString = asyncIteratorToString;
    }
}

function alert_nullish() {
    const originalAlert = globalThis.alert;
    globalThis.alert = () => undefined;
    const result = [alert("message")].join("");
    globalThis.alert = originalAlert;
    return result;
}

function structured_clone_nullish() {
    return [structuredClone(undefined)].join("");
}

function structured_clone_object_coercion_order() {
    let value;
    try {
        [value = structuredClone({}), value.toString = 0].join("");
    } catch {
        console.log(true);
    }
}

function structured_clone_addition_coercion_order() {
    let value;
    return (value = structuredClone({})) + ("x" + (value.toString = 0, ""));
}

function timer_and_encoding_coercion_order() {
    const atobToString = atob.toString;
    try {
        [atob, atob.toString = 0].join("");
    } catch {
        console.log(true);
    }
    atob.toString = atobToString;

    const btoaToString = btoa.toString;
    try {
        [btoa, btoa.toString = 0].join("");
    } catch {
        console.log(true);
    }
    btoa.toString = btoaToString;

    const clearIntervalToString = clearInterval.toString;
    try {
        [clearInterval, clearInterval.toString = 0].join("");
    } catch {
        console.log(true);
    }
    clearInterval.toString = clearIntervalToString;

    const clearTimeoutToString = clearTimeout.toString;
    try {
        [clearTimeout, clearTimeout.toString = 0].join("");
    } catch {
        console.log(true);
    }
    clearTimeout.toString = clearTimeoutToString;

    const clearImmediateToString = clearImmediate.toString;
    try {
        [clearImmediate, clearImmediate.toString = 0].join("");
    } catch {
        console.log(true);
    }
    clearImmediate.toString = clearImmediateToString;

    const setImmediateToString = setImmediate.toString;
    try {
        [setImmediate, setImmediate.toString = 0].join("");
    } catch {
        console.log(true);
    }
    setImmediate.toString = setImmediateToString;

    const setIntervalToString = setInterval.toString;
    try {
        [setInterval, setInterval.toString = 0].join("");
    } catch {
        console.log(true);
    }
    setInterval.toString = setIntervalToString;

    const setTimeoutToString = setTimeout.toString;
    try {
        [setTimeout, setTimeout.toString = 0].join("");
    } catch {
        console.log(true);
    }
    setTimeout.toString = setTimeoutToString;
}

function direct_eval_object_coercion() {
    return [eval("({toString(){return 's'},valueOf(){return 1}})")].join("");
}

function direct_eval_symbol_order() {
    let hit = false;
    try {
        [eval("Symbol()"), hit = true].join("");
    } catch {}
    return hit;
}

function direct_eval_nullish() {
    return [eval("null")].join("");
}

function spread(values) {
    return [1, ...values, 2].join("");
}

console.log(single(2));
console.log(single("a"));
console.log(concatenate(1, 2, 3));
console.log(concatenate("a", "b", "c"));
console.log(nullish("x"));
console.log(spread([null, , 3]));
effects();
coercion();
symbol_order();
indirect_symbol_order();
member_symbol_order();
parenthesized_object_coercion();
nested_addition_order();
class_coercion();
awaited().then(console.log);
awaited_symbol_order();
awaited_object_order();
value_selecting_object_coercion(true, null);
value_selecting_symbol_order(true, null);
assigned_class_coercion();
assigned_symbol_order();
logical_assigned_symbol_order();
console.log(logical_assigned_nullish());
logical_assigned_class_coercion();
tagged_template_symbol_order();
tagged_template_object_coercion();
iife_symbol_order();
optional_member_symbol_order();
console.log(conditional_nullish_join(true));
console.log(call_object_coercion());
console.log(identifier_symbol_order(Symbol()));
console.log(optional_member_nullish(null));
console.log(member_value_symbol_order());
console.log(member_object_coercion());
console.log(super_property_object_coercion());
console.log(new_target_nullish());
console.log(iife_object_coercion());
console.log(this_object_coercion.call({
    toString() {
        return "s";
    },
    valueOf() {
        return 1;
    },
}));
console.log(super_method_object_coercion());
console.log(yielded_symbol_order());
console.log(yielded_object_coercion());
console.log(assigned_sequence_object_coercion());
wrapped_symbol_order();
direct_super_object_coercion();
console.log(call_valued_callee_object_coercion());
console.log(arrow_object_coercion_order());
console.log(object_call_coercion({
    toString() {
        return "s";
    },
    valueOf() {
        return 1;
    },
}));
webassembly_coercion_order();
console_coercion_order();
disposable_stack_coercion_order();
console.log("prompt:" + prompt_nullish());
console.log("queue:" + queue_microtask_nullish());
console.log("timers:" + timer_cancellation_nullish());
timer_handle_coercion_order();
fetch_coercion_order();
fetch_function_coercion_order();
iterator_coercion_order();
async_iterator_coercion_order();
console.log("alert:" + alert_nullish());
console.log("clone:" + structured_clone_nullish());
structured_clone_object_coercion_order();
timer_and_encoding_coercion_order();
console.log(direct_eval_object_coercion());
console.log(direct_eval_symbol_order());
console.log(direct_eval_nullish());
