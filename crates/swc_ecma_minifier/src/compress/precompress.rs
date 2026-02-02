//! Pre-compression pass that hoists frequently used static method calls and
//! global object references to local aliases.
//!
//! ## Static Method Hoisting
//!
//! For example:
//! ```js
//! Object.assign(a, {});
//! Object.assign(b, {});
//! Object.assign(c, {});
//! ```
//!
//! Becomes:
//! ```js
//! var _Object_assign = Object.assign;
//! _Object_assign(a, {});
//! _Object_assign(b, {});
//! _Object_assign(c, {});
//! ```
//!
//! ## Global Object Hoisting
//!
//! For example:
//! ```js
//! new Map(); new Map(); new Map();
//! ```
//!
//! Becomes:
//! ```js
//! var _Map = Map;
//! new _Map(); new _Map(); new _Map();
//! ```
//!
//! After mangling, this can result in smaller output.

use rustc_hash::FxHashMap;
use swc_atoms::Atom;
use swc_common::{util::take::Take, Mark, SyntaxContext, DUMMY_SP};
use swc_ecma_ast::*;
use swc_ecma_utils::private_ident;
use swc_ecma_visit::{
    noop_visit_mut_type, noop_visit_type, Visit, VisitMut, VisitMutWith, VisitWith,
};

use crate::option::CompressOptions;

/// Calculate the minimum number of usages needed to save bytes after hoisting.
///
/// The formula is: `ceil((name_len + 7) / (name_len - 1))`
///
/// Rationale:
/// - Every hoist costs `name_len + 7` bytes (e.g., `var a=Set;` for Set is 10
///   bytes)
/// - Every usage saves `name_len - 1` bytes (e.g., `new a()` vs `new Set()`
///   saves 2 bytes)
/// - We need enough usages for savings to exceed the cost
///
/// Examples:
/// - `Object.assign` (13 chars): (13+7)/(13-1) = 20/12 = 2 usages
/// - `Math.cos` (8 chars): (8+7)/(8-1) = 15/7 = 3 usages
/// - `Set` (3 chars): (3+7)/(3-1) = 10/2 = 5 usages
const fn min_usages_for_name(name_len: usize) -> usize {
    if name_len <= 1 {
        return usize::MAX; // Never hoist single-char names
    }
    // ceil((name_len + 7) / (name_len - 1))
    (name_len + 7 + (name_len - 2)) / (name_len - 1)
}

// Pre-computed minimum usage thresholds for known static methods.
// These are computed at compile time using: ceil((name_len + 7) / (name_len -
// 1)) where name_len = "Object.method".len()

/// Object methods (Object.xxx) - "Object." is 7 chars
const MIN_USAGES_OBJECT_ASSIGN: usize = min_usages_for_name(13); // "Object.assign" = 2
const MIN_USAGES_OBJECT_KEYS: usize = min_usages_for_name(11); // "Object.keys" = 2
const MIN_USAGES_OBJECT_VALUES: usize = min_usages_for_name(13); // "Object.values" = 2
const MIN_USAGES_OBJECT_ENTRIES: usize = min_usages_for_name(14); // "Object.entries" = 2
const MIN_USAGES_OBJECT_FROM_ENTRIES: usize = min_usages_for_name(18); // "Object.fromEntries" = 2
const MIN_USAGES_OBJECT_FREEZE: usize = min_usages_for_name(13); // "Object.freeze" = 2
const MIN_USAGES_OBJECT_SEAL: usize = min_usages_for_name(11); // "Object.seal" = 2
const MIN_USAGES_OBJECT_PREVENT_EXTENSIONS: usize = min_usages_for_name(24); // "Object.preventExtensions" = 2
const MIN_USAGES_OBJECT_IS_FROZEN: usize = min_usages_for_name(15); // "Object.isFrozen" = 2
const MIN_USAGES_OBJECT_IS_SEALED: usize = min_usages_for_name(15); // "Object.isSealed" = 2
const MIN_USAGES_OBJECT_IS_EXTENSIBLE: usize = min_usages_for_name(19); // "Object.isExtensible" = 2
const MIN_USAGES_OBJECT_GET_OWN_PROP_DESC: usize = min_usages_for_name(31); // "Object.getOwnPropertyDescriptor" = 2
const MIN_USAGES_OBJECT_GET_OWN_PROP_DESCS: usize = min_usages_for_name(32); // "Object.getOwnPropertyDescriptors" = 2
const MIN_USAGES_OBJECT_GET_OWN_PROP_NAMES: usize = min_usages_for_name(27); // "Object.getOwnPropertyNames" = 2
const MIN_USAGES_OBJECT_GET_OWN_PROP_SYMBOLS: usize = min_usages_for_name(29); // "Object.getOwnPropertySymbols" = 2
const MIN_USAGES_OBJECT_GET_PROTOTYPE_OF: usize = min_usages_for_name(21); // "Object.getPrototypeOf" = 2
const MIN_USAGES_OBJECT_SET_PROTOTYPE_OF: usize = min_usages_for_name(21); // "Object.setPrototypeOf" = 2
const MIN_USAGES_OBJECT_CREATE: usize = min_usages_for_name(13); // "Object.create" = 2
const MIN_USAGES_OBJECT_DEFINE_PROPERTY: usize = min_usages_for_name(21); // "Object.defineProperty" = 2
const MIN_USAGES_OBJECT_DEFINE_PROPERTIES: usize = min_usages_for_name(23); // "Object.defineProperties" = 2
const MIN_USAGES_OBJECT_HAS_OWN: usize = min_usages_for_name(13); // "Object.hasOwn" = 2
const MIN_USAGES_OBJECT_IS: usize = min_usages_for_name(9); // "Object.is" = 2

/// Array methods (Array.xxx) - "Array." is 6 chars
const MIN_USAGES_ARRAY_IS_ARRAY: usize = min_usages_for_name(13); // "Array.isArray" = 2
const MIN_USAGES_ARRAY_FROM: usize = min_usages_for_name(10); // "Array.from" = 2
const MIN_USAGES_ARRAY_OF: usize = min_usages_for_name(8); // "Array.of" = 3

/// Reflect methods (Reflect.xxx) - "Reflect." is 8 chars
const MIN_USAGES_REFLECT_APPLY: usize = min_usages_for_name(13); // "Reflect.apply" = 2
const MIN_USAGES_REFLECT_CONSTRUCT: usize = min_usages_for_name(17); // "Reflect.construct" = 2
const MIN_USAGES_REFLECT_DEFINE_PROPERTY: usize = min_usages_for_name(22); // "Reflect.defineProperty" = 2
const MIN_USAGES_REFLECT_DELETE_PROPERTY: usize = min_usages_for_name(22); // "Reflect.deleteProperty" = 2
const MIN_USAGES_REFLECT_GET: usize = min_usages_for_name(11); // "Reflect.get" = 2
const MIN_USAGES_REFLECT_GET_OWN_PROP_DESC: usize = min_usages_for_name(32); // "Reflect.getOwnPropertyDescriptor" = 2
const MIN_USAGES_REFLECT_GET_PROTOTYPE_OF: usize = min_usages_for_name(22); // "Reflect.getPrototypeOf" = 2
const MIN_USAGES_REFLECT_HAS: usize = min_usages_for_name(11); // "Reflect.has" = 2
const MIN_USAGES_REFLECT_IS_EXTENSIBLE: usize = min_usages_for_name(20); // "Reflect.isExtensible" = 2
const MIN_USAGES_REFLECT_OWN_KEYS: usize = min_usages_for_name(15); // "Reflect.ownKeys" = 2
const MIN_USAGES_REFLECT_PREVENT_EXTENSIONS: usize = min_usages_for_name(25); // "Reflect.preventExtensions" = 2
const MIN_USAGES_REFLECT_SET: usize = min_usages_for_name(11); // "Reflect.set" = 2
const MIN_USAGES_REFLECT_SET_PROTOTYPE_OF: usize = min_usages_for_name(22); // "Reflect.setPrototypeOf" = 2

/// Math methods (Math.xxx) - "Math." is 5 chars
const MIN_USAGES_MATH_ABS: usize = min_usages_for_name(8); // "Math.abs" = 3
const MIN_USAGES_MATH_ACOS: usize = min_usages_for_name(9); // "Math.acos" = 2
const MIN_USAGES_MATH_ACOSH: usize = min_usages_for_name(10); // "Math.acosh" = 2
const MIN_USAGES_MATH_ASIN: usize = min_usages_for_name(9); // "Math.asin" = 2
const MIN_USAGES_MATH_ASINH: usize = min_usages_for_name(10); // "Math.asinh" = 2
const MIN_USAGES_MATH_ATAN: usize = min_usages_for_name(9); // "Math.atan" = 2
const MIN_USAGES_MATH_ATAN2: usize = min_usages_for_name(10); // "Math.atan2" = 2
const MIN_USAGES_MATH_ATANH: usize = min_usages_for_name(10); // "Math.atanh" = 2
const MIN_USAGES_MATH_CBRT: usize = min_usages_for_name(9); // "Math.cbrt" = 2
const MIN_USAGES_MATH_CEIL: usize = min_usages_for_name(9); // "Math.ceil" = 2
const MIN_USAGES_MATH_CLZ32: usize = min_usages_for_name(10); // "Math.clz32" = 2
const MIN_USAGES_MATH_COS: usize = min_usages_for_name(8); // "Math.cos" = 3
const MIN_USAGES_MATH_COSH: usize = min_usages_for_name(9); // "Math.cosh" = 2
const MIN_USAGES_MATH_EXP: usize = min_usages_for_name(8); // "Math.exp" = 3
const MIN_USAGES_MATH_EXPM1: usize = min_usages_for_name(10); // "Math.expm1" = 2
const MIN_USAGES_MATH_FLOOR: usize = min_usages_for_name(10); // "Math.floor" = 2
const MIN_USAGES_MATH_FROUND: usize = min_usages_for_name(11); // "Math.fround" = 2
const MIN_USAGES_MATH_HYPOT: usize = min_usages_for_name(10); // "Math.hypot" = 2
const MIN_USAGES_MATH_IMUL: usize = min_usages_for_name(9); // "Math.imul" = 2
const MIN_USAGES_MATH_LOG: usize = min_usages_for_name(8); // "Math.log" = 3
const MIN_USAGES_MATH_LOG10: usize = min_usages_for_name(10); // "Math.log10" = 2
const MIN_USAGES_MATH_LOG1P: usize = min_usages_for_name(10); // "Math.log1p" = 2
const MIN_USAGES_MATH_LOG2: usize = min_usages_for_name(9); // "Math.log2" = 2
const MIN_USAGES_MATH_MAX: usize = min_usages_for_name(8); // "Math.max" = 3
const MIN_USAGES_MATH_MIN: usize = min_usages_for_name(8); // "Math.min" = 3
const MIN_USAGES_MATH_POW: usize = min_usages_for_name(8); // "Math.pow" = 3
const MIN_USAGES_MATH_RANDOM: usize = min_usages_for_name(11); // "Math.random" = 2
const MIN_USAGES_MATH_ROUND: usize = min_usages_for_name(10); // "Math.round" = 2
const MIN_USAGES_MATH_SIGN: usize = min_usages_for_name(9); // "Math.sign" = 2
const MIN_USAGES_MATH_SIN: usize = min_usages_for_name(8); // "Math.sin" = 3
const MIN_USAGES_MATH_SINH: usize = min_usages_for_name(9); // "Math.sinh" = 2
const MIN_USAGES_MATH_SQRT: usize = min_usages_for_name(9); // "Math.sqrt" = 2
const MIN_USAGES_MATH_TAN: usize = min_usages_for_name(8); // "Math.tan" = 3
const MIN_USAGES_MATH_TANH: usize = min_usages_for_name(9); // "Math.tanh" = 2
const MIN_USAGES_MATH_TRUNC: usize = min_usages_for_name(10); // "Math.trunc" = 2

/// String methods (String.xxx) - "String." is 7 chars
const MIN_USAGES_STRING_FROM_CHAR_CODE: usize = min_usages_for_name(19); // "String.fromCharCode" = 2
const MIN_USAGES_STRING_FROM_CODE_POINT: usize = min_usages_for_name(20); // "String.fromCodePoint" = 2
const MIN_USAGES_STRING_RAW: usize = min_usages_for_name(10); // "String.raw" = 2

/// Number methods (Number.xxx) - "Number." is 7 chars
const MIN_USAGES_NUMBER_IS_FINITE: usize = min_usages_for_name(15); // "Number.isFinite" = 2
const MIN_USAGES_NUMBER_IS_INTEGER: usize = min_usages_for_name(16); // "Number.isInteger" = 2
const MIN_USAGES_NUMBER_IS_NAN: usize = min_usages_for_name(12); // "Number.isNaN" = 2
const MIN_USAGES_NUMBER_IS_SAFE_INTEGER: usize = min_usages_for_name(20); // "Number.isSafeInteger" = 2
const MIN_USAGES_NUMBER_PARSE_FLOAT: usize = min_usages_for_name(17); // "Number.parseFloat" = 2
const MIN_USAGES_NUMBER_PARSE_INT: usize = min_usages_for_name(15); // "Number.parseInt" = 2

/// JSON methods (JSON.xxx) - "JSON." is 5 chars
const MIN_USAGES_JSON_PARSE: usize = min_usages_for_name(10); // "JSON.parse" = 2
const MIN_USAGES_JSON_STRINGIFY: usize = min_usages_for_name(14); // "JSON.stringify" = 2

/// Promise methods (Promise.xxx) - "Promise." is 8 chars
const MIN_USAGES_PROMISE_ALL: usize = min_usages_for_name(11); // "Promise.all" = 2
const MIN_USAGES_PROMISE_ALL_SETTLED: usize = min_usages_for_name(18); // "Promise.allSettled" = 2
const MIN_USAGES_PROMISE_ANY: usize = min_usages_for_name(11); // "Promise.any" = 2
const MIN_USAGES_PROMISE_RACE: usize = min_usages_for_name(12); // "Promise.race" = 2
const MIN_USAGES_PROMISE_REJECT: usize = min_usages_for_name(14); // "Promise.reject" = 2
const MIN_USAGES_PROMISE_RESOLVE: usize = min_usages_for_name(15); // "Promise.resolve" = 2
const MIN_USAGES_PROMISE_WITH_RESOLVERS: usize = min_usages_for_name(21); // "Promise.withResolvers" = 2

/// Symbol methods (Symbol.xxx) - "Symbol." is 7 chars
const MIN_USAGES_SYMBOL_FOR: usize = min_usages_for_name(10); // "Symbol.for" = 2
const MIN_USAGES_SYMBOL_KEY_FOR: usize = min_usages_for_name(13); // "Symbol.keyFor" = 2

// Pre-computed minimum usage thresholds for known global objects.
const MIN_USAGES_MAP: usize = min_usages_for_name(3); // "Map" = 5
const MIN_USAGES_SET: usize = min_usages_for_name(3); // "Set" = 5
const MIN_USAGES_WEAK_MAP: usize = min_usages_for_name(7); // "WeakMap" = 3
const MIN_USAGES_WEAK_SET: usize = min_usages_for_name(7); // "WeakSet" = 3
const MIN_USAGES_PROMISE: usize = min_usages_for_name(7); // "Promise" = 3
const MIN_USAGES_PROXY: usize = min_usages_for_name(5); // "Proxy" = 3
const MIN_USAGES_DATE: usize = min_usages_for_name(4); // "Date" = 4
const MIN_USAGES_REGEXP: usize = min_usages_for_name(6); // "RegExp" = 3
const MIN_USAGES_ERROR: usize = min_usages_for_name(5); // "Error" = 3
const MIN_USAGES_TYPE_ERROR: usize = min_usages_for_name(9); // "TypeError" = 2
const MIN_USAGES_RANGE_ERROR: usize = min_usages_for_name(10); // "RangeError" = 2
const MIN_USAGES_SYNTAX_ERROR: usize = min_usages_for_name(11); // "SyntaxError" = 2
const MIN_USAGES_REFERENCE_ERROR: usize = min_usages_for_name(14); // "ReferenceError" = 2
const MIN_USAGES_URI_ERROR: usize = min_usages_for_name(8); // "URIError" = 3
const MIN_USAGES_EVAL_ERROR: usize = min_usages_for_name(9); // "EvalError" = 2
const MIN_USAGES_ARRAY_BUFFER: usize = min_usages_for_name(11); // "ArrayBuffer" = 2
const MIN_USAGES_SHARED_ARRAY_BUFFER: usize = min_usages_for_name(17); // "SharedArrayBuffer" = 2
const MIN_USAGES_DATA_VIEW: usize = min_usages_for_name(8); // "DataView" = 3
const MIN_USAGES_INT8_ARRAY: usize = min_usages_for_name(9); // "Int8Array" = 2
const MIN_USAGES_UINT8_ARRAY: usize = min_usages_for_name(10); // "Uint8Array" = 2
const MIN_USAGES_UINT8_CLAMPED_ARRAY: usize = min_usages_for_name(17); // "Uint8ClampedArray" = 2
const MIN_USAGES_INT16_ARRAY: usize = min_usages_for_name(10); // "Int16Array" = 2
const MIN_USAGES_UINT16_ARRAY: usize = min_usages_for_name(11); // "Uint16Array" = 2
const MIN_USAGES_INT32_ARRAY: usize = min_usages_for_name(10); // "Int32Array" = 2
const MIN_USAGES_UINT32_ARRAY: usize = min_usages_for_name(11); // "Uint32Array" = 2
const MIN_USAGES_FLOAT32_ARRAY: usize = min_usages_for_name(12); // "Float32Array" = 2
const MIN_USAGES_FLOAT64_ARRAY: usize = min_usages_for_name(12); // "Float64Array" = 2
const MIN_USAGES_BIG_INT64_ARRAY: usize = min_usages_for_name(13); // "BigInt64Array" = 2
const MIN_USAGES_BIG_UINT64_ARRAY: usize = min_usages_for_name(14); // "BigUint64Array" = 2
const MIN_USAGES_URL: usize = min_usages_for_name(3); // "URL" = 5
const MIN_USAGES_URL_SEARCH_PARAMS: usize = min_usages_for_name(15); // "URLSearchParams" = 2
const MIN_USAGES_TEXT_ENCODER: usize = min_usages_for_name(11); // "TextEncoder" = 2
const MIN_USAGES_TEXT_DECODER: usize = min_usages_for_name(11); // "TextDecoder" = 2

/// Get the minimum usages threshold for a known static method.
/// Returns `None` if the method is not known/hoistable.
fn get_static_method_min_usages(obj: &str, prop: &str) -> Option<usize> {
    match obj {
        "Object" => match prop {
            "assign" => Some(MIN_USAGES_OBJECT_ASSIGN),
            "keys" => Some(MIN_USAGES_OBJECT_KEYS),
            "values" => Some(MIN_USAGES_OBJECT_VALUES),
            "entries" => Some(MIN_USAGES_OBJECT_ENTRIES),
            "fromEntries" => Some(MIN_USAGES_OBJECT_FROM_ENTRIES),
            "freeze" => Some(MIN_USAGES_OBJECT_FREEZE),
            "seal" => Some(MIN_USAGES_OBJECT_SEAL),
            "preventExtensions" => Some(MIN_USAGES_OBJECT_PREVENT_EXTENSIONS),
            "isFrozen" => Some(MIN_USAGES_OBJECT_IS_FROZEN),
            "isSealed" => Some(MIN_USAGES_OBJECT_IS_SEALED),
            "isExtensible" => Some(MIN_USAGES_OBJECT_IS_EXTENSIBLE),
            "getOwnPropertyDescriptor" => Some(MIN_USAGES_OBJECT_GET_OWN_PROP_DESC),
            "getOwnPropertyDescriptors" => Some(MIN_USAGES_OBJECT_GET_OWN_PROP_DESCS),
            "getOwnPropertyNames" => Some(MIN_USAGES_OBJECT_GET_OWN_PROP_NAMES),
            "getOwnPropertySymbols" => Some(MIN_USAGES_OBJECT_GET_OWN_PROP_SYMBOLS),
            "getPrototypeOf" => Some(MIN_USAGES_OBJECT_GET_PROTOTYPE_OF),
            "setPrototypeOf" => Some(MIN_USAGES_OBJECT_SET_PROTOTYPE_OF),
            "create" => Some(MIN_USAGES_OBJECT_CREATE),
            "defineProperty" => Some(MIN_USAGES_OBJECT_DEFINE_PROPERTY),
            "defineProperties" => Some(MIN_USAGES_OBJECT_DEFINE_PROPERTIES),
            "hasOwn" => Some(MIN_USAGES_OBJECT_HAS_OWN),
            "is" => Some(MIN_USAGES_OBJECT_IS),
            _ => None,
        },
        "Array" => match prop {
            "isArray" => Some(MIN_USAGES_ARRAY_IS_ARRAY),
            "from" => Some(MIN_USAGES_ARRAY_FROM),
            "of" => Some(MIN_USAGES_ARRAY_OF),
            _ => None,
        },
        "Reflect" => match prop {
            "apply" => Some(MIN_USAGES_REFLECT_APPLY),
            "construct" => Some(MIN_USAGES_REFLECT_CONSTRUCT),
            "defineProperty" => Some(MIN_USAGES_REFLECT_DEFINE_PROPERTY),
            "deleteProperty" => Some(MIN_USAGES_REFLECT_DELETE_PROPERTY),
            "get" => Some(MIN_USAGES_REFLECT_GET),
            "getOwnPropertyDescriptor" => Some(MIN_USAGES_REFLECT_GET_OWN_PROP_DESC),
            "getPrototypeOf" => Some(MIN_USAGES_REFLECT_GET_PROTOTYPE_OF),
            "has" => Some(MIN_USAGES_REFLECT_HAS),
            "isExtensible" => Some(MIN_USAGES_REFLECT_IS_EXTENSIBLE),
            "ownKeys" => Some(MIN_USAGES_REFLECT_OWN_KEYS),
            "preventExtensions" => Some(MIN_USAGES_REFLECT_PREVENT_EXTENSIONS),
            "set" => Some(MIN_USAGES_REFLECT_SET),
            "setPrototypeOf" => Some(MIN_USAGES_REFLECT_SET_PROTOTYPE_OF),
            _ => None,
        },
        "Math" => match prop {
            "abs" => Some(MIN_USAGES_MATH_ABS),
            "acos" => Some(MIN_USAGES_MATH_ACOS),
            "acosh" => Some(MIN_USAGES_MATH_ACOSH),
            "asin" => Some(MIN_USAGES_MATH_ASIN),
            "asinh" => Some(MIN_USAGES_MATH_ASINH),
            "atan" => Some(MIN_USAGES_MATH_ATAN),
            "atan2" => Some(MIN_USAGES_MATH_ATAN2),
            "atanh" => Some(MIN_USAGES_MATH_ATANH),
            "cbrt" => Some(MIN_USAGES_MATH_CBRT),
            "ceil" => Some(MIN_USAGES_MATH_CEIL),
            "clz32" => Some(MIN_USAGES_MATH_CLZ32),
            "cos" => Some(MIN_USAGES_MATH_COS),
            "cosh" => Some(MIN_USAGES_MATH_COSH),
            "exp" => Some(MIN_USAGES_MATH_EXP),
            "expm1" => Some(MIN_USAGES_MATH_EXPM1),
            "floor" => Some(MIN_USAGES_MATH_FLOOR),
            "fround" => Some(MIN_USAGES_MATH_FROUND),
            "hypot" => Some(MIN_USAGES_MATH_HYPOT),
            "imul" => Some(MIN_USAGES_MATH_IMUL),
            "log" => Some(MIN_USAGES_MATH_LOG),
            "log10" => Some(MIN_USAGES_MATH_LOG10),
            "log1p" => Some(MIN_USAGES_MATH_LOG1P),
            "log2" => Some(MIN_USAGES_MATH_LOG2),
            "max" => Some(MIN_USAGES_MATH_MAX),
            "min" => Some(MIN_USAGES_MATH_MIN),
            "pow" => Some(MIN_USAGES_MATH_POW),
            "random" => Some(MIN_USAGES_MATH_RANDOM),
            "round" => Some(MIN_USAGES_MATH_ROUND),
            "sign" => Some(MIN_USAGES_MATH_SIGN),
            "sin" => Some(MIN_USAGES_MATH_SIN),
            "sinh" => Some(MIN_USAGES_MATH_SINH),
            "sqrt" => Some(MIN_USAGES_MATH_SQRT),
            "tan" => Some(MIN_USAGES_MATH_TAN),
            "tanh" => Some(MIN_USAGES_MATH_TANH),
            "trunc" => Some(MIN_USAGES_MATH_TRUNC),
            _ => None,
        },
        "String" => match prop {
            "fromCharCode" => Some(MIN_USAGES_STRING_FROM_CHAR_CODE),
            "fromCodePoint" => Some(MIN_USAGES_STRING_FROM_CODE_POINT),
            "raw" => Some(MIN_USAGES_STRING_RAW),
            _ => None,
        },
        "Number" => match prop {
            "isFinite" => Some(MIN_USAGES_NUMBER_IS_FINITE),
            "isInteger" => Some(MIN_USAGES_NUMBER_IS_INTEGER),
            "isNaN" => Some(MIN_USAGES_NUMBER_IS_NAN),
            "isSafeInteger" => Some(MIN_USAGES_NUMBER_IS_SAFE_INTEGER),
            "parseFloat" => Some(MIN_USAGES_NUMBER_PARSE_FLOAT),
            "parseInt" => Some(MIN_USAGES_NUMBER_PARSE_INT),
            _ => None,
        },
        "JSON" => match prop {
            "parse" => Some(MIN_USAGES_JSON_PARSE),
            "stringify" => Some(MIN_USAGES_JSON_STRINGIFY),
            _ => None,
        },
        "Promise" => match prop {
            "all" => Some(MIN_USAGES_PROMISE_ALL),
            "allSettled" => Some(MIN_USAGES_PROMISE_ALL_SETTLED),
            "any" => Some(MIN_USAGES_PROMISE_ANY),
            "race" => Some(MIN_USAGES_PROMISE_RACE),
            "reject" => Some(MIN_USAGES_PROMISE_REJECT),
            "resolve" => Some(MIN_USAGES_PROMISE_RESOLVE),
            "withResolvers" => Some(MIN_USAGES_PROMISE_WITH_RESOLVERS),
            _ => None,
        },
        "Symbol" => match prop {
            "for" => Some(MIN_USAGES_SYMBOL_FOR),
            "keyFor" => Some(MIN_USAGES_SYMBOL_KEY_FOR),
            _ => None,
        },
        _ => None,
    }
}

/// Get the minimum usages threshold for a known global object.
/// Returns `None` if the object is not known/hoistable.
fn get_global_object_min_usages(name: &str) -> Option<usize> {
    match name {
        "Map" => Some(MIN_USAGES_MAP),
        "Set" => Some(MIN_USAGES_SET),
        "WeakMap" => Some(MIN_USAGES_WEAK_MAP),
        "WeakSet" => Some(MIN_USAGES_WEAK_SET),
        "Promise" => Some(MIN_USAGES_PROMISE),
        "Proxy" => Some(MIN_USAGES_PROXY),
        "Date" => Some(MIN_USAGES_DATE),
        "RegExp" => Some(MIN_USAGES_REGEXP),
        "Error" => Some(MIN_USAGES_ERROR),
        "TypeError" => Some(MIN_USAGES_TYPE_ERROR),
        "RangeError" => Some(MIN_USAGES_RANGE_ERROR),
        "SyntaxError" => Some(MIN_USAGES_SYNTAX_ERROR),
        "ReferenceError" => Some(MIN_USAGES_REFERENCE_ERROR),
        "URIError" => Some(MIN_USAGES_URI_ERROR),
        "EvalError" => Some(MIN_USAGES_EVAL_ERROR),
        "ArrayBuffer" => Some(MIN_USAGES_ARRAY_BUFFER),
        "SharedArrayBuffer" => Some(MIN_USAGES_SHARED_ARRAY_BUFFER),
        "DataView" => Some(MIN_USAGES_DATA_VIEW),
        "Int8Array" => Some(MIN_USAGES_INT8_ARRAY),
        "Uint8Array" => Some(MIN_USAGES_UINT8_ARRAY),
        "Uint8ClampedArray" => Some(MIN_USAGES_UINT8_CLAMPED_ARRAY),
        "Int16Array" => Some(MIN_USAGES_INT16_ARRAY),
        "Uint16Array" => Some(MIN_USAGES_UINT16_ARRAY),
        "Int32Array" => Some(MIN_USAGES_INT32_ARRAY),
        "Uint32Array" => Some(MIN_USAGES_UINT32_ARRAY),
        "Float32Array" => Some(MIN_USAGES_FLOAT32_ARRAY),
        "Float64Array" => Some(MIN_USAGES_FLOAT64_ARRAY),
        "BigInt64Array" => Some(MIN_USAGES_BIG_INT64_ARRAY),
        "BigUint64Array" => Some(MIN_USAGES_BIG_UINT64_ARRAY),
        "URL" => Some(MIN_USAGES_URL),
        "URLSearchParams" => Some(MIN_USAGES_URL_SEARCH_PARAMS),
        "TextEncoder" => Some(MIN_USAGES_TEXT_ENCODER),
        "TextDecoder" => Some(MIN_USAGES_TEXT_DECODER),
        _ => None,
    }
}

/// Key for tracking static method usage: (object_name, method_name)
type StaticMethodKey = (Atom, Atom);

/// First pass: count usages of static method calls and global object usages.
struct UsageCounter {
    unresolved_ctxt: SyntaxContext,
    /// Count of usages for each static method
    static_method_counts: FxHashMap<StaticMethodKey, usize>,
    /// Count of usages for each global object
    global_object_counts: FxHashMap<Atom, usize>,
    /// Whether to count static methods
    count_static_methods: bool,
    /// Whether to count global objects
    count_global_objects: bool,
}

impl UsageCounter {
    fn new(unresolved_mark: Mark, count_static_methods: bool, count_global_objects: bool) -> Self {
        Self {
            unresolved_ctxt: SyntaxContext::empty().apply_mark(unresolved_mark),
            static_method_counts: Default::default(),
            global_object_counts: Default::default(),
            count_static_methods,
            count_global_objects,
        }
    }

    fn try_record_static_method_call(&mut self, callee: &Expr) {
        if !self.count_static_methods {
            return;
        }
        if let Some((obj, prop)) = extract_static_method(callee, self.unresolved_ctxt) {
            // Only record if this is a known static method (lookup returns Some)
            if get_static_method_min_usages(&obj, &prop).is_some() {
                *self.static_method_counts.entry((obj, prop)).or_insert(0) += 1;
            }
        }
    }

    fn try_record_global_object(&mut self, callee: &Expr) {
        if !self.count_global_objects {
            return;
        }
        if let Some(ident) = callee.as_ident() {
            // Only record if this is a known global object (lookup returns Some)
            if ident.ctxt == self.unresolved_ctxt
                && get_global_object_min_usages(&ident.sym).is_some()
            {
                *self
                    .global_object_counts
                    .entry(ident.sym.clone())
                    .or_insert(0) += 1;
            }
        }
    }
}

impl Visit for UsageCounter {
    noop_visit_type!();

    fn visit_call_expr(&mut self, e: &CallExpr) {
        if let Callee::Expr(callee) = &e.callee {
            self.try_record_static_method_call(callee);
        }
        e.visit_children_with(self);
    }

    fn visit_new_expr(&mut self, e: &NewExpr) {
        // For `new` expressions, we count constructor usages like `new Map()`
        self.try_record_global_object(&e.callee);
        e.visit_children_with(self);
    }
}

/// Extract (object_name, method_name) from a member expression like
/// `Object.assign`.
fn extract_static_method(expr: &Expr, unresolved_ctxt: SyntaxContext) -> Option<(Atom, Atom)> {
    let member = expr.as_member()?;

    // Object must be a simple identifier (e.g., `Object`)
    let obj = member.obj.as_ident()?;

    // Must be unresolved (global)
    if obj.ctxt != unresolved_ctxt {
        return None;
    }

    // Property must be a non-computed identifier
    if member.prop.is_computed() {
        return None;
    }

    let prop = member.prop.as_ident()?;

    Some((obj.sym.clone(), prop.sym.clone()))
}

/// Second pass: replace static method calls and global objects with aliases.
struct AliasReplacer {
    unresolved_ctxt: SyntaxContext,
    /// Map from static method key to the alias identifier
    static_method_aliases: FxHashMap<StaticMethodKey, Ident>,
    /// Map from global object name to the alias identifier
    global_object_aliases: FxHashMap<Atom, Ident>,
    /// Variable declarations to prepend
    var_decls: Vec<VarDeclarator>,
}

impl AliasReplacer {
    fn new(
        unresolved_mark: Mark,
        static_method_counts: FxHashMap<StaticMethodKey, usize>,
        global_object_counts: FxHashMap<Atom, usize>,
    ) -> Self {
        let unresolved_ctxt = SyntaxContext::empty().apply_mark(unresolved_mark);
        let mut static_method_aliases = FxHashMap::default();
        let mut global_object_aliases = FxHashMap::default();
        let mut var_decls = Vec::new();

        // Collect and sort static method keys for deterministic output
        let mut static_method_keys: Vec<_> = static_method_counts.into_iter().collect();
        static_method_keys.sort_by(|a, b| a.0.cmp(&b.0));

        // Handle static method aliases
        for ((obj, prop), count) in static_method_keys {
            // Use pre-computed threshold from lookup table
            if let Some(min_usages) = get_static_method_min_usages(&obj, &prop) {
                if count >= min_usages {
                    // Create a private identifier - hygiene pass will handle conflicts
                    let alias_ident = private_ident!(format!("_{}_{}", obj, prop));

                    // Create the initializer: Object.assign
                    let init = MemberExpr {
                        span: DUMMY_SP,
                        obj: Box::new(Ident::new(obj.clone(), DUMMY_SP, unresolved_ctxt).into()),
                        prop: MemberProp::Ident(IdentName::new(prop.clone(), DUMMY_SP)),
                    };

                    var_decls.push(VarDeclarator {
                        span: DUMMY_SP,
                        name: alias_ident.clone().into(),
                        init: Some(Box::new(init.into())),
                        definite: false,
                    });

                    static_method_aliases.insert((obj, prop), alias_ident);
                }
            }
        }

        // Collect and sort global object names for deterministic output
        let mut global_object_keys: Vec<_> = global_object_counts.into_iter().collect();
        global_object_keys.sort_by(|a, b| a.0.cmp(&b.0));

        // Handle global object aliases
        for (name, count) in global_object_keys {
            // Use pre-computed threshold from lookup table
            if let Some(min_usages) = get_global_object_min_usages(&name) {
                if count >= min_usages {
                    // Create a private identifier - hygiene pass will handle conflicts
                    let alias_ident = private_ident!(format!("_{}", name));

                    // Create the initializer: Map
                    let init = Ident::new(name.clone(), DUMMY_SP, unresolved_ctxt);

                    var_decls.push(VarDeclarator {
                        span: DUMMY_SP,
                        name: alias_ident.clone().into(),
                        init: Some(Box::new(init.into())),
                        definite: false,
                    });

                    global_object_aliases.insert(name, alias_ident);
                }
            }
        }

        Self {
            unresolved_ctxt,
            static_method_aliases,
            global_object_aliases,
            var_decls,
        }
    }

    fn has_aliases(&self) -> bool {
        !self.static_method_aliases.is_empty() || !self.global_object_aliases.is_empty()
    }

    fn take_var_decls(&mut self) -> Vec<VarDeclarator> {
        self.var_decls.take()
    }
}

impl VisitMut for AliasReplacer {
    noop_visit_mut_type!();

    fn visit_mut_call_expr(&mut self, e: &mut CallExpr) {
        // Visit children first
        e.visit_mut_children_with(self);

        // Then try to replace the callee
        if let Callee::Expr(callee) = &mut e.callee {
            if let Some((obj, prop)) = extract_static_method(callee, self.unresolved_ctxt) {
                if let Some(alias) = self.static_method_aliases.get(&(obj, prop)) {
                    *callee = Box::new(alias.clone().into());
                }
            }
        }
    }

    fn visit_mut_new_expr(&mut self, e: &mut NewExpr) {
        // Visit children first
        e.visit_mut_children_with(self);

        // Then try to replace the callee
        if let Some(ident) = e.callee.as_ident() {
            if ident.ctxt == self.unresolved_ctxt {
                if let Some(alias) = self.global_object_aliases.get(&ident.sym) {
                    e.callee = Box::new(alias.clone().into());
                }
            }
        }
    }
}

/// Run the precompress optimization on a program.
pub fn precompress_optimizer(
    program: &mut Program,
    options: &CompressOptions,
    unresolved_mark: Mark,
) {
    let count_static_methods = options.unsafe_hoist_static_method_alias;
    let count_global_objects = options.unsafe_hoist_global_objects_alias;

    if !count_static_methods && !count_global_objects {
        return;
    }

    // First pass: count usages
    let mut counter =
        UsageCounter::new(unresolved_mark, count_static_methods, count_global_objects);
    program.visit_with(&mut counter);

    // Create replacer with aliases for frequently used methods/objects
    // We use private_ident! to create unique identifiers - the hygiene pass
    // will automatically rename them if there are conflicts
    let mut replacer = AliasReplacer::new(
        unresolved_mark,
        counter.static_method_counts,
        counter.global_object_counts,
    );

    if !replacer.has_aliases() {
        return;
    }

    // Second pass: replace calls with aliases
    program.visit_mut_with(&mut replacer);

    // Prepend variable declarations
    let var_decls = replacer.take_var_decls();
    if var_decls.is_empty() {
        return;
    }

    let var_stmt = Stmt::Decl(Decl::Var(Box::new(VarDecl {
        span: DUMMY_SP,
        kind: VarDeclKind::Var,
        declare: false,
        decls: var_decls,
        ctxt: SyntaxContext::empty(),
    })));

    match program {
        Program::Module(module) => {
            module.body.insert(0, ModuleItem::Stmt(var_stmt));
        }
        Program::Script(script) => {
            script.body.insert(0, var_stmt);
        }
    }
}
