

const cachedTextDecoder = new TextDecoder('utf-8', { ignoreBOM: true, fatal: true });

cachedTextDecoder.decode();

let cachedUint8Memory0 = null;

function getUint8Memory0() {
    if (cachedUint8Memory0 === null || cachedUint8Memory0.byteLength === 0) {
        cachedUint8Memory0 = new Uint8Array(wasm.memory.buffer);
    }
    return cachedUint8Memory0;
}

function getStringFromWasm0(ptr, len) {
    return cachedTextDecoder.decode(getUint8Memory0().subarray(ptr, ptr + len));
}

const heap = new Array(128).fill(undefined);

heap.push(undefined, null, true, false);

let heap_next = heap.length;

function addHeapObject(obj) {
    if (heap_next === heap.length) heap.push(heap.length + 1);
    const idx = heap_next;
    heap_next = heap[idx];

    heap[idx] = obj;
    return idx;
}

function getObject(idx) { return heap[idx]; }

function isLikeNone(x) {
    return x === undefined || x === null;
}

let cachedFloat64Memory0 = null;

function getFloat64Memory0() {
    if (cachedFloat64Memory0 === null || cachedFloat64Memory0.byteLength === 0) {
        cachedFloat64Memory0 = new Float64Array(wasm.memory.buffer);
    }
    return cachedFloat64Memory0;
}

let cachedInt32Memory0 = null;

function getInt32Memory0() {
    if (cachedInt32Memory0 === null || cachedInt32Memory0.byteLength === 0) {
        cachedInt32Memory0 = new Int32Array(wasm.memory.buffer);
    }
    return cachedInt32Memory0;
}

let WASM_VECTOR_LEN = 0;

const cachedTextEncoder = new TextEncoder('utf-8');

const encodeString = function (arg, view) {
    return cachedTextEncoder.encodeInto(arg, view);
};

function passStringToWasm0(arg, malloc, realloc) {

    if (realloc === undefined) {
        const buf = cachedTextEncoder.encode(arg);
        const ptr = malloc(buf.length);
        getUint8Memory0().subarray(ptr, ptr + buf.length).set(buf);
        WASM_VECTOR_LEN = buf.length;
        return ptr;
    }

    let len = arg.length;
    let ptr = malloc(len);

    const mem = getUint8Memory0();

    let offset = 0;

    for (; offset < len; offset++) {
        const code = arg.charCodeAt(offset);
        if (code > 0x7F) break;
        mem[ptr + offset] = code;
    }

    if (offset !== len) {
        if (offset !== 0) {
            arg = arg.slice(offset);
        }
        ptr = realloc(ptr, len, len = offset + arg.length * 3);
        const view = getUint8Memory0().subarray(ptr + offset, ptr + len);
        const ret = encodeString(arg, view);

        offset += ret.written;
    }

    WASM_VECTOR_LEN = offset;
    return ptr;
}

function dropObject(idx) {
    if (idx < 132) return;
    heap[idx] = heap_next;
    heap_next = idx;
}

function takeObject(idx) {
    const ret = getObject(idx);
    dropObject(idx);
    return ret;
}

function debugString(val) {
    // primitive types
    const type = typeof val;
    if (type == 'number' || type == 'boolean' || val == null) {
        return  `${val}`;
    }
    if (type == 'string') {
        return `"${val}"`;
    }
    if (type == 'symbol') {
        const description = val.description;
        if (description == null) {
            return 'Symbol';
        } else {
            return `Symbol(${description})`;
        }
    }
    if (type == 'function') {
        const name = val.name;
        if (typeof name == 'string' && name.length > 0) {
            return `Function(${name})`;
        } else {
            return 'Function';
        }
    }
    // objects
    if (Array.isArray(val)) {
        const length = val.length;
        let debug = '[';
        if (length > 0) {
            debug += debugString(val[0]);
        }
        for(let i = 1; i < length; i++) {
            debug += ', ' + debugString(val[i]);
        }
        debug += ']';
        return debug;
    }
    // Test for built-in
    const builtInMatches = /\[object ([^\]]+)\]/.exec(toString.call(val));
    let className;
    if (builtInMatches.length > 1) {
        className = builtInMatches[1];
    } else {
        // Failed to match the standard '[object ClassName]'
        return toString.call(val);
    }
    if (className == 'Object') {
        // we're a user defined class or Object
        // JSON.stringify avoids problems with cycles, and is generally much
        // easier than looping through ownProperties of `val`.
        try {
            return 'Object(' + JSON.stringify(val) + ')';
        } catch (_) {
            return 'Object';
        }
    }
    // errors
    if (val instanceof Error) {
        return `${val.name}: ${val.message}\n${val.stack}`;
    }
    // TODO we could test for more things here, like `Set`s and `Map`s.
    return className;
}

let cachedBigInt64Memory0 = null;

function getBigInt64Memory0() {
    if (cachedBigInt64Memory0 === null || cachedBigInt64Memory0.byteLength === 0) {
        cachedBigInt64Memory0 = new BigInt64Array(wasm.memory.buffer);
    }
    return cachedBigInt64Memory0;
}

function makeMutClosure(arg0, arg1, dtor, f) {
    const state = { a: arg0, b: arg1, cnt: 1, dtor };
    const real = (...args) => {
        // First up with a closure we increment the internal reference
        // count. This ensures that the Rust closure environment won't
        // be deallocated while we're invoking it.
        state.cnt++;
        const a = state.a;
        state.a = 0;
        try {
            return f(a, state.b, ...args);
        } finally {
            if (--state.cnt === 0) {
                wasm.__wbindgen_export_2.get(state.dtor)(a, state.b);

            } else {
                state.a = a;
            }
        }
    };
    real.original = state;

    return real;
}
function __wbg_adapter_54(arg0, arg1, arg2) {
    wasm._dyn_core__ops__function__FnMut__A____Output___R_as_wasm_bindgen__closure__WasmClosure___describe__invoke__hffdc7738b1c1e1d9(arg0, arg1, addHeapObject(arg2));
}

/**
* @param {string} s
* @param {any} opts
* @returns {any}
*/
export function minifySync(s, opts) {
    try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        wasm.minifySync(retptr, addHeapObject(s), addHeapObject(opts));
        var r0 = getInt32Memory0()[retptr / 4 + 0];
        var r1 = getInt32Memory0()[retptr / 4 + 1];
        var r2 = getInt32Memory0()[retptr / 4 + 2];
        if (r2) {
            throw takeObject(r1);
        }
        return takeObject(r0);
    } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
    }
}

/**
* @param {string} s
* @param {any} opts
* @returns {Promise<any>}
*/
export function minify(s, opts) {
    const ret = wasm.minify(addHeapObject(s), addHeapObject(opts));
    return takeObject(ret);
}

/**
* @param {string} s
* @param {any} opts
* @returns {any}
*/
export function parseSync(s, opts) {
    try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        wasm.parseSync(retptr, addHeapObject(s), addHeapObject(opts));
        var r0 = getInt32Memory0()[retptr / 4 + 0];
        var r1 = getInt32Memory0()[retptr / 4 + 1];
        var r2 = getInt32Memory0()[retptr / 4 + 2];
        if (r2) {
            throw takeObject(r1);
        }
        return takeObject(r0);
    } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
    }
}

/**
* @param {string} s
* @param {any} opts
* @returns {Promise<any>}
*/
export function parse(s, opts) {
    const ret = wasm.parse(addHeapObject(s), addHeapObject(opts));
    return takeObject(ret);
}

/**
* @param {any} s
* @param {any} opts
* @returns {any}
*/
export function printSync(s, opts) {
    try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        wasm.printSync(retptr, addHeapObject(s), addHeapObject(opts));
        var r0 = getInt32Memory0()[retptr / 4 + 0];
        var r1 = getInt32Memory0()[retptr / 4 + 1];
        var r2 = getInt32Memory0()[retptr / 4 + 2];
        if (r2) {
            throw takeObject(r1);
        }
        return takeObject(r0);
    } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
    }
}

/**
* @param {any} s
* @param {any} opts
* @returns {Promise<any>}
*/
export function print(s, opts) {
    const ret = wasm.print(addHeapObject(s), addHeapObject(opts));
    return takeObject(ret);
}

/**
* @param {any} s
* @param {any} opts
* @param {any} experimental_plugin_bytes_resolver
* @returns {any}
*/
export function transformSync(s, opts, experimental_plugin_bytes_resolver) {
    try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        wasm.transformSync(retptr, addHeapObject(s), addHeapObject(opts), addHeapObject(experimental_plugin_bytes_resolver));
        var r0 = getInt32Memory0()[retptr / 4 + 0];
        var r1 = getInt32Memory0()[retptr / 4 + 1];
        var r2 = getInt32Memory0()[retptr / 4 + 2];
        if (r2) {
            throw takeObject(r1);
        }
        return takeObject(r0);
    } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
    }
}

/**
* @param {any} s
* @param {any} opts
* @param {any} experimental_plugin_bytes_resolver
* @returns {Promise<any>}
*/
export function transform(s, opts, experimental_plugin_bytes_resolver) {
    const ret = wasm.transform(addHeapObject(s), addHeapObject(opts), addHeapObject(experimental_plugin_bytes_resolver));
    return takeObject(ret);
}

function getCachedStringFromWasm0(ptr, len) {
    if (ptr === 0) {
        return getObject(len);
    } else {
        return getStringFromWasm0(ptr, len);
    }
}

function handleError(f, args) {
    try {
        return f.apply(this, args);
    } catch (e) {
        wasm.__wbindgen_exn_store(addHeapObject(e));
    }
}

function getArrayU8FromWasm0(ptr, len) {
    return getUint8Memory0().subarray(ptr / 1, ptr / 1 + len);
}
/**
* @param {string} query
* @param {any} opts
* @returns {any}
*/
export function browserslist(query, opts) {
    try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        const ptr0 = passStringToWasm0(query, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        wasm.browserslist(retptr, ptr0, len0, addHeapObject(opts));
        var r0 = getInt32Memory0()[retptr / 4 + 0];
        var r1 = getInt32Memory0()[retptr / 4 + 1];
        var r2 = getInt32Memory0()[retptr / 4 + 2];
        if (r2) {
            throw takeObject(r1);
        }
        return takeObject(r0);
    } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
    }
}

function __wbg_adapter_156(arg0, arg1, arg2, arg3) {
    wasm.wasm_bindgen__convert__closures__invoke2_mut__h366c9eee2edc7994(arg0, arg1, addHeapObject(arg2), addHeapObject(arg3));
}

/**
* A struct representing an aborted instruction execution, with a message
* indicating the cause.
*/
export class WasmerRuntimeError {

    static __wrap(ptr) {
        const obj = Object.create(WasmerRuntimeError.prototype);
        obj.ptr = ptr;

        return obj;
    }

    __destroy_into_raw() {
        const ptr = this.ptr;
        this.ptr = 0;

        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_wasmerruntimeerror_free(ptr);
    }
}

const imports = {
    __wbindgen_placeholder__: {
        __wbindgen_error_new: function(arg0, arg1) {
            const ret = new Error(getStringFromWasm0(arg0, arg1));
            return addHeapObject(ret);
        },
        __wbindgen_is_undefined: function(arg0) {
            const ret = getObject(arg0) === undefined;
            return ret;
        },
        __wbindgen_in: function(arg0, arg1) {
            const ret = getObject(arg0) in getObject(arg1);
            return ret;
        },
        __wbindgen_number_get: function(arg0, arg1) {
            const obj = getObject(arg1);
            const ret = typeof(obj) === 'number' ? obj : undefined;
            getFloat64Memory0()[arg0 / 8 + 1] = isLikeNone(ret) ? 0 : ret;
            getInt32Memory0()[arg0 / 4 + 0] = !isLikeNone(ret);
        },
        __wbindgen_boolean_get: function(arg0) {
            const v = getObject(arg0);
            const ret = typeof(v) === 'boolean' ? (v ? 1 : 0) : 2;
            return ret;
        },
        __wbindgen_is_null: function(arg0) {
            const ret = getObject(arg0) === null;
            return ret;
        },
        __wbindgen_string_get: function(arg0, arg1) {
            const obj = getObject(arg1);
            const ret = typeof(obj) === 'string' ? obj : undefined;
            var ptr0 = isLikeNone(ret) ? 0 : passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
            var len0 = WASM_VECTOR_LEN;
            getInt32Memory0()[arg0 / 4 + 1] = len0;
            getInt32Memory0()[arg0 / 4 + 0] = ptr0;
        },
        __wbindgen_is_bigint: function(arg0) {
            const ret = typeof(getObject(arg0)) === 'bigint';
            return ret;
        },
        __wbindgen_is_object: function(arg0) {
            const val = getObject(arg0);
            const ret = typeof(val) === 'object' && val !== null;
            return ret;
        },
        __wbindgen_is_string: function(arg0) {
            const ret = typeof(getObject(arg0)) === 'string';
            return ret;
        },
        __wbindgen_jsval_eq: function(arg0, arg1) {
            const ret = getObject(arg0) === getObject(arg1);
            return ret;
        },
        __wbindgen_bigint_from_i64: function(arg0) {
            const ret = arg0;
            return addHeapObject(ret);
        },
        __wbindgen_bigint_from_u64: function(arg0) {
            const ret = BigInt.asUintN(64, arg0);
            return addHeapObject(ret);
        },
        __wbg_error_f851667af71bcfc6: function(arg0, arg1) {
            var v0 = getCachedStringFromWasm0(arg0, arg1);
        if (arg0 !== 0) { wasm.__wbindgen_free(arg0, arg1); }
        console.error(v0);
    },
    __wbg_new_abda76e883ba8a5f: function() {
        const ret = new Error();
        return addHeapObject(ret);
    },
    __wbg_stack_658279fe44541cf6: function(arg0, arg1) {
        const ret = getObject(arg1).stack;
        const ptr0 = passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        getInt32Memory0()[arg0 / 4 + 1] = len0;
        getInt32Memory0()[arg0 / 4 + 0] = ptr0;
    },
    __wbindgen_cb_drop: function(arg0) {
        const obj = takeObject(arg0).original;
        if (obj.cnt-- == 1) {
            obj.a = 0;
            return true;
        }
        const ret = false;
        return ret;
    },
    __wbindgen_number_new: function(arg0) {
        const ret = arg0;
        return addHeapObject(ret);
    },
    __wbindgen_object_clone_ref: function(arg0) {
        const ret = getObject(arg0);
        return addHeapObject(ret);
    },
    __wbindgen_string_new: function(arg0, arg1) {
        const ret = getStringFromWasm0(arg0, arg1);
        return addHeapObject(ret);
    },
    __wbg_crypto_e1d53a1d73fb10b8: function(arg0) {
        const ret = getObject(arg0).crypto;
        return addHeapObject(ret);
    },
    __wbg_msCrypto_6e7d3e1f92610cbb: function(arg0) {
        const ret = getObject(arg0).msCrypto;
        return addHeapObject(ret);
    },
    __wbg_getRandomValues_805f1c3d65988a5a: function() { return handleError(function (arg0, arg1) {
        getObject(arg0).getRandomValues(getObject(arg1));
    }, arguments) },
    __wbg_randomFillSync_6894564c2c334c42: function() { return handleError(function (arg0, arg1, arg2) {
        getObject(arg0).randomFillSync(getArrayU8FromWasm0(arg1, arg2));
    }, arguments) },
    __wbg_require_78a3dcfbdba9cbce: function() { return handleError(function () {
        const ret = module.require;
        return addHeapObject(ret);
    }, arguments) },
    __wbg_process_038c26bf42b093f8: function(arg0) {
        const ret = getObject(arg0).process;
        return addHeapObject(ret);
    },
    __wbg_versions_ab37218d2f0b24a8: function(arg0) {
        const ret = getObject(arg0).versions;
        return addHeapObject(ret);
    },
    __wbg_node_080f4b19d15bc1fe: function(arg0) {
        const ret = getObject(arg0).node;
        return addHeapObject(ret);
    },
    __wbg_instanceof_Global_71ffa48bd62833fb: function(arg0) {
        let result;
        try {
            result = getObject(arg0) instanceof WebAssembly.Global;
        } catch {
            result = false;
        }
        const ret = result;
        return ret;
    },
    __wbg_wasmerruntimeerror_new: function(arg0) {
        const ret = WasmerRuntimeError.__wrap(arg0);
        return addHeapObject(ret);
    },
    __wbindgen_jsval_loose_eq: function(arg0, arg1) {
        const ret = getObject(arg0) == getObject(arg1);
        return ret;
    },
    __wbg_String_91fba7ded13ba54c: function(arg0, arg1) {
        const ret = String(getObject(arg1));
        const ptr0 = passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        getInt32Memory0()[arg0 / 4 + 1] = len0;
        getInt32Memory0()[arg0 / 4 + 0] = ptr0;
    },
    __wbg_getwithrefkey_15c62c2b8546208d: function(arg0, arg1) {
        const ret = getObject(arg0)[getObject(arg1)];
        return addHeapObject(ret);
    },
    __wbg_set_20cbc34131e76824: function(arg0, arg1, arg2) {
        getObject(arg0)[takeObject(arg1)] = takeObject(arg2);
    },
    __wbg_new_1d9a920c6bfc44a8: function() {
        const ret = new Array();
        return addHeapObject(ret);
    },
    __wbg_get_57245cc7d7c7619d: function(arg0, arg1) {
        const ret = getObject(arg0)[arg1 >>> 0];
        return addHeapObject(ret);
    },
    __wbg_set_a68214f35c417fa9: function(arg0, arg1, arg2) {
        getObject(arg0)[arg1 >>> 0] = takeObject(arg2);
    },
    __wbg_from_7ce3cb27cb258569: function(arg0) {
        const ret = Array.from(getObject(arg0));
        return addHeapObject(ret);
    },
    __wbg_isArray_27c46c67f498e15d: function(arg0) {
        const ret = Array.isArray(getObject(arg0));
        return ret;
    },
    __wbg_length_6e3bbe7c8bd4dbd8: function(arg0) {
        const ret = getObject(arg0).length;
        return ret;
    },
    __wbg_push_740e4b286702d964: function(arg0, arg1) {
        const ret = getObject(arg0).push(getObject(arg1));
        return ret;
    },
    __wbg_instanceof_ArrayBuffer_e5e48f4762c5610b: function(arg0) {
        let result;
        try {
            result = getObject(arg0) instanceof ArrayBuffer;
        } catch {
            result = false;
        }
        const ret = result;
        return ret;
    },
    __wbg_instanceof_Function_056d5b3aef8aaa85: function(arg0) {
        let result;
        try {
            result = getObject(arg0) instanceof Function;
        } catch {
            result = false;
        }
        const ret = result;
        return ret;
    },
    __wbg_newnoargs_b5b063fc6c2f0376: function(arg0, arg1) {
        var v0 = getCachedStringFromWasm0(arg0, arg1);
        const ret = new Function(v0);
        return addHeapObject(ret);
    },
    __wbg_apply_22a3220d244124da: function() { return handleError(function (arg0, arg1, arg2) {
        const ret = getObject(arg0).apply(getObject(arg1), getObject(arg2));
        return addHeapObject(ret);
    }, arguments) },
    __wbg_call_97ae9d8645dc388b: function() { return handleError(function (arg0, arg1) {
        const ret = getObject(arg0).call(getObject(arg1));
        return addHeapObject(ret);
    }, arguments) },
    __wbg_call_168da88779e35f61: function() { return handleError(function (arg0, arg1, arg2) {
        const ret = getObject(arg0).call(getObject(arg1), getObject(arg2));
        return addHeapObject(ret);
    }, arguments) },
    __wbg_bind_ca24d624360a8ab1: function(arg0, arg1, arg2) {
        const ret = getObject(arg0).bind(getObject(arg1), getObject(arg2));
        return addHeapObject(ret);
    },
    __wbg_name_da379f055623f0d3: function(arg0) {
        const ret = getObject(arg0).name;
        return addHeapObject(ret);
    },
    __wbg_new_268f7b7dd3430798: function() {
        const ret = new Map();
        return addHeapObject(ret);
    },
    __wbg_set_933729cf5b66ac11: function(arg0, arg1, arg2) {
        const ret = getObject(arg0).set(getObject(arg1), getObject(arg2));
        return addHeapObject(ret);
    },
    __wbg_next_aaef7c8aa5e212ac: function() { return handleError(function (arg0) {
        const ret = getObject(arg0).next();
        return addHeapObject(ret);
    }, arguments) },
    __wbg_next_579e583d33566a86: function(arg0) {
        const ret = getObject(arg0).next;
        return addHeapObject(ret);
    },
    __wbg_done_1b73b0672e15f234: function(arg0) {
        const ret = getObject(arg0).done;
        return ret;
    },
    __wbg_value_1ccc36bc03462d71: function(arg0) {
        const ret = getObject(arg0).value;
        return addHeapObject(ret);
    },
    __wbg_isSafeInteger_dfa0593e8d7ac35a: function(arg0) {
        const ret = Number.isSafeInteger(getObject(arg0));
        return ret;
    },
    __wbg_getTime_cb82adb2556ed13e: function(arg0) {
        const ret = getObject(arg0).getTime();
        return ret;
    },
    __wbg_getTimezoneOffset_89bd4275e1ca8341: function(arg0) {
        const ret = getObject(arg0).getTimezoneOffset();
        return ret;
    },
    __wbg_new0_a57059d72c5b7aee: function() {
        const ret = new Date();
        return addHeapObject(ret);
    },
    __wbg_constructor_20fd216941fe9866: function(arg0) {
        const ret = getObject(arg0).constructor;
        return addHeapObject(ret);
    },
    __wbg_entries_65a76a413fc91037: function(arg0) {
        const ret = Object.entries(getObject(arg0));
        return addHeapObject(ret);
    },
    __wbg_getPrototypeOf_ca7be35aca69033c: function(arg0) {
        const ret = Object.getPrototypeOf(getObject(arg0));
        return addHeapObject(ret);
    },
    __wbg_new_0b9bfdd97583284e: function() {
        const ret = new Object();
        return addHeapObject(ret);
    },
    __wbg_iterator_6f9d4f28845f426c: function() {
        const ret = Symbol.iterator;
        return addHeapObject(ret);
    },
    __wbg_new_9962f939219f1820: function(arg0, arg1) {
        try {
            var state0 = {a: arg0, b: arg1};
            var cb0 = (arg0, arg1) => {
                const a = state0.a;
                state0.a = 0;
                try {
                    return __wbg_adapter_156(a, state0.b, arg0, arg1);
                } finally {
                    state0.a = a;
                }
            };
            const ret = new Promise(cb0);
            return addHeapObject(ret);
        } finally {
            state0.a = state0.b = 0;
        }
    },
    __wbg_resolve_99fe17964f31ffc0: function(arg0) {
        const ret = Promise.resolve(getObject(arg0));
        return addHeapObject(ret);
    },
    __wbg_then_11f7a54d67b4bfad: function(arg0, arg1) {
        const ret = getObject(arg0).then(getObject(arg1));
        return addHeapObject(ret);
    },
    __wbg_globalThis_7f206bda628d5286: function() { return handleError(function () {
        const ret = globalThis.globalThis;
        return addHeapObject(ret);
    }, arguments) },
    __wbg_self_6d479506f72c6a71: function() { return handleError(function () {
        const ret = self.self;
        return addHeapObject(ret);
    }, arguments) },
    __wbg_window_f2557cc78490aceb: function() { return handleError(function () {
        const ret = window.window;
        return addHeapObject(ret);
    }, arguments) },
    __wbg_global_ba75c50d1cf384f4: function() { return handleError(function () {
        const ret = global.global;
        return addHeapObject(ret);
    }, arguments) },
    __wbg_instanceof_Uint8Array_971eeda69eb75003: function(arg0) {
        let result;
        try {
            result = getObject(arg0) instanceof Uint8Array;
        } catch {
            result = false;
        }
        const ret = result;
        return ret;
    },
    __wbg_new_8c3f0052272a457a: function(arg0) {
        const ret = new Uint8Array(getObject(arg0));
        return addHeapObject(ret);
    },
    __wbg_newwithlength_f5933855e4f48a19: function(arg0) {
        const ret = new Uint8Array(arg0 >>> 0);
        return addHeapObject(ret);
    },
    __wbg_newwithbyteoffsetandlength_d9aa266703cb98be: function(arg0, arg1, arg2) {
        const ret = new Uint8Array(getObject(arg0), arg1 >>> 0, arg2 >>> 0);
        return addHeapObject(ret);
    },
    __wbg_subarray_58ad4efbb5bcb886: function(arg0, arg1, arg2) {
        const ret = getObject(arg0).subarray(arg1 >>> 0, arg2 >>> 0);
        return addHeapObject(ret);
    },
    __wbg_length_9e1ae1900cb0fbd5: function(arg0) {
        const ret = getObject(arg0).length;
        return ret;
    },
    __wbg_set_83db9690f9353e79: function(arg0, arg1, arg2) {
        getObject(arg0).set(getObject(arg1), arg2 >>> 0);
    },
    __wbg_getindex_ed9af38a6f2f9635: function(arg0, arg1) {
        const ret = getObject(arg0)[arg1 >>> 0];
        return ret;
    },
    __wbindgen_is_function: function(arg0) {
        const ret = typeof(getObject(arg0)) === 'function';
        return ret;
    },
    __wbg_new_1c5d2ff1edfe6d73: function() { return handleError(function (arg0, arg1) {
        const ret = new WebAssembly.Instance(getObject(arg0), getObject(arg1));
        return addHeapObject(ret);
    }, arguments) },
    __wbg_exports_1f32da4bc6734cea: function(arg0) {
        const ret = getObject(arg0).exports;
        return addHeapObject(ret);
    },
    __wbg_new_2c576172346480cc: function() { return handleError(function (arg0) {
        const ret = new WebAssembly.Module(getObject(arg0));
        return addHeapObject(ret);
    }, arguments) },
    __wbg_exports_4db28c393be16bc5: function(arg0) {
        const ret = WebAssembly.Module.exports(getObject(arg0));
        return addHeapObject(ret);
    },
    __wbg_imports_5d97b92618ae2b69: function(arg0) {
        const ret = WebAssembly.Module.imports(getObject(arg0));
        return addHeapObject(ret);
    },
    __wbg_instanceof_Table_aab62205c7444b79: function(arg0) {
        let result;
        try {
            result = getObject(arg0) instanceof WebAssembly.Table;
        } catch {
            result = false;
        }
        const ret = result;
        return ret;
    },
    __wbg_get_19328b9e516e0330: function() { return handleError(function (arg0, arg1) {
        const ret = getObject(arg0).get(arg1 >>> 0);
        return addHeapObject(ret);
    }, arguments) },
    __wbg_instanceof_Memory_f1dc0d9a83a9c8ea: function(arg0) {
        let result;
        try {
            result = getObject(arg0) instanceof WebAssembly.Memory;
        } catch {
            result = false;
        }
        const ret = result;
        return ret;
    },
    __wbg_buffer_3f3d764d4747d564: function(arg0) {
        const ret = getObject(arg0).buffer;
        return addHeapObject(ret);
    },
    __wbg_get_765201544a2b6869: function() { return handleError(function (arg0, arg1) {
        const ret = Reflect.get(getObject(arg0), getObject(arg1));
        return addHeapObject(ret);
    }, arguments) },
    __wbg_set_bf3f89b92d5a34bf: function() { return handleError(function (arg0, arg1, arg2) {
        const ret = Reflect.set(getObject(arg0), getObject(arg1), getObject(arg2));
        return ret;
    }, arguments) },
    __wbindgen_debug_string: function(arg0, arg1) {
        const ret = debugString(getObject(arg1));
        const ptr0 = passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        getInt32Memory0()[arg0 / 4 + 1] = len0;
        getInt32Memory0()[arg0 / 4 + 0] = ptr0;
    },
    __wbindgen_bigint_get_as_i64: function(arg0, arg1) {
        const v = getObject(arg1);
        const ret = typeof(v) === 'bigint' ? v : undefined;
        getBigInt64Memory0()[arg0 / 8 + 1] = isLikeNone(ret) ? BigInt(0) : ret;
        getInt32Memory0()[arg0 / 4 + 0] = !isLikeNone(ret);
    },
    __wbindgen_object_drop_ref: function(arg0) {
        takeObject(arg0);
    },
    __wbindgen_throw: function(arg0, arg1) {
        throw new Error(getStringFromWasm0(arg0, arg1));
    },
    __wbindgen_rethrow: function(arg0) {
        throw takeObject(arg0);
    },
    __wbindgen_memory: function() {
        const ret = wasm.memory;
        return addHeapObject(ret);
    },
    __wbindgen_function_table: function() {
        const ret = wasm.__wbindgen_export_2;
        return addHeapObject(ret);
    },
    __wbindgen_closure_wrapper19714: function(arg0, arg1, arg2) {
        const ret = makeMutClosure(arg0, arg1, 1202, __wbg_adapter_54);
        return addHeapObject(ret);
    },
},

};

const wasm_url = new URL('binding_core_wasm_bg.wasm', import.meta.url);
let wasmCode = '';
switch (wasm_url.protocol) {
    case 'file:':
    wasmCode = await Deno.readFile(wasm_url);
    break
    case 'https:':
    case 'http:':
    wasmCode = await (await fetch(wasm_url)).arrayBuffer();
    break
    default:
    throw new Error(`Unsupported protocol: ${wasm_url.protocol}`);
}

const wasmInstance = (await WebAssembly.instantiate(wasmCode, imports)).instance;
const wasm = wasmInstance.exports;

