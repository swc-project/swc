//! Static method and global object aliasing for minification.
//!
//! This module provides functionality to hoist frequently used static method
//! calls and global object references to local aliases.
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
//!
//! ## Integration with Optimizer
//!
//! This module integrates directly into the `Optimizer` rather than using
//! separate visitors. The Optimizer calls helper methods during its traversal:
//! - `try_record_static_method_call` during `visit_mut_call_expr`
//! - `try_record_global_object` during `visit_mut_new_expr`
//! - `try_replace_static_method_call` during `visit_mut_call_expr`
//! - `try_replace_global_object` during `visit_mut_new_expr`
//! - `build_aliases_from_counts` at the end of module/script processing
//! - `take_alias_var_decls` to get var declarations for insertion

use rustc_hash::FxHashMap;
use swc_atoms::Atom;
use swc_common::{SyntaxContext, DUMMY_SP};
use swc_ecma_ast::*;
use swc_ecma_utils::private_ident;

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
pub type StaticMethodKey = (Atom, Atom);

/// State for static alias optimization, stored in Optimizer.
#[derive(Default)]
pub struct StaticAliasState {
    /// Count of usages for each static method
    pub static_method_counts: FxHashMap<StaticMethodKey, usize>,
    /// Count of usages for each global object
    pub global_object_counts: FxHashMap<Atom, usize>,
    /// Aliases for static methods (built after counting)
    pub static_method_aliases: FxHashMap<StaticMethodKey, Ident>,
    /// Aliases for global objects (built after counting)
    pub global_object_aliases: FxHashMap<Atom, Ident>,
    /// Var declarations to prepend (built after counting)
    pub var_decls: Vec<VarDeclarator>,
    /// Whether aliases have been built (happens once per program)
    pub aliases_built: bool,
    /// Whether var declarations have been inserted
    pub var_decls_inserted: bool,
    /// Whether any replacements were made (in this pass)
    pub replacements_made: bool,
}

impl StaticAliasState {
    /// Record a static method call usage.
    /// Called during Optimizer's visit_mut_call_expr.
    pub fn try_record_static_method_call(
        &mut self,
        callee: &Expr,
        unresolved_ctxt: SyntaxContext,
        enabled: bool,
    ) {
        if !enabled || self.aliases_built {
            return;
        }
        if let Some((obj, prop)) = extract_static_method(callee, unresolved_ctxt) {
            // Only record if this is a known static method
            if get_static_method_min_usages(&obj, &prop).is_some() {
                *self.static_method_counts.entry((obj, prop)).or_insert(0) += 1;
            }
        }
    }

    /// Record a global object usage (from new expression).
    /// Called during Optimizer's visit_mut_new_expr.
    pub fn try_record_global_object(
        &mut self,
        callee: &Expr,
        unresolved_ctxt: SyntaxContext,
        enabled: bool,
    ) {
        if !enabled || self.aliases_built {
            return;
        }
        if let Some(ident) = callee.as_ident() {
            // Only record if this is a known global object
            if ident.ctxt == unresolved_ctxt && get_global_object_min_usages(&ident.sym).is_some() {
                *self
                    .global_object_counts
                    .entry(ident.sym.clone())
                    .or_insert(0) += 1;
            }
        }
    }

    /// Try to replace a static method call with its alias.
    /// Returns true if replacement was made.
    /// Called during Optimizer's visit_mut_call_expr.
    pub fn try_replace_static_method_call(
        &mut self,
        callee: &mut Box<Expr>,
        unresolved_ctxt: SyntaxContext,
    ) -> bool {
        if !self.aliases_built {
            return false;
        }
        if let Some((obj, prop)) = extract_static_method(callee, unresolved_ctxt) {
            if let Some(alias) = self.static_method_aliases.get(&(obj, prop)) {
                *callee = Box::new(alias.clone().into());
                self.replacements_made = true;
                return true;
            }
        }
        false
    }

    /// Try to replace a global object in new expression with its alias.
    /// Returns true if replacement was made.
    /// Called during Optimizer's visit_mut_new_expr.
    pub fn try_replace_global_object(
        &mut self,
        callee: &mut Box<Expr>,
        unresolved_ctxt: SyntaxContext,
    ) -> bool {
        if !self.aliases_built {
            return false;
        }
        if let Some(ident) = callee.as_ident() {
            if ident.ctxt == unresolved_ctxt {
                if let Some(alias) = self.global_object_aliases.get(&ident.sym) {
                    *callee = Box::new(alias.clone().into());
                    self.replacements_made = true;
                    return true;
                }
            }
        }
        false
    }

    /// Build aliases from the collected counts.
    /// Called at the end of module/script processing.
    /// Returns true if any aliases were created.
    pub fn build_aliases_from_counts(&mut self, unresolved_ctxt: SyntaxContext) -> bool {
        if self.aliases_built {
            return false;
        }

        self.aliases_built = true;

        // Collect and sort static method keys for deterministic output
        let mut static_method_keys: Vec<_> = self.static_method_counts.drain().collect();
        static_method_keys.sort_by(|a, b| a.0.cmp(&b.0));

        // Handle static method aliases
        for ((obj, prop), count) in static_method_keys {
            if let Some(min_usages) = get_static_method_min_usages(&obj, &prop) {
                if count >= min_usages {
                    let alias_ident = private_ident!(format!("_{}_{}", obj, prop));
                    let init = MemberExpr {
                        span: DUMMY_SP,
                        obj: Box::new(Ident::new(obj.clone(), DUMMY_SP, unresolved_ctxt).into()),
                        prop: MemberProp::Ident(IdentName::new(prop.clone(), DUMMY_SP)),
                    };
                    self.var_decls.push(VarDeclarator {
                        span: DUMMY_SP,
                        name: alias_ident.clone().into(),
                        init: Some(Box::new(init.into())),
                        definite: false,
                    });
                    self.static_method_aliases.insert((obj, prop), alias_ident);
                }
            }
        }

        // Collect and sort global object names for deterministic output
        let mut global_object_keys: Vec<_> = self.global_object_counts.drain().collect();
        global_object_keys.sort_by(|a, b| a.0.cmp(&b.0));

        // Handle global object aliases
        for (name, count) in global_object_keys {
            if let Some(min_usages) = get_global_object_min_usages(&name) {
                if count >= min_usages {
                    let alias_ident = private_ident!(format!("_{}", name));
                    let init = Ident::new(name.clone(), DUMMY_SP, unresolved_ctxt);
                    self.var_decls.push(VarDeclarator {
                        span: DUMMY_SP,
                        name: alias_ident.clone().into(),
                        init: Some(Box::new(init.into())),
                        definite: false,
                    });
                    self.global_object_aliases.insert(name, alias_ident);
                }
            }
        }

        !self.static_method_aliases.is_empty() || !self.global_object_aliases.is_empty()
    }

    /// Check if there are pending var declarations to insert.
    /// Returns true only if aliases have been built, replacements have been
    /// done, and var declarations haven't been inserted yet.
    pub fn should_insert_var_decls(&self) -> bool {
        self.aliases_built
            && self.replacements_made
            && !self.var_decls_inserted
            && !self.var_decls.is_empty()
    }

    /// Take the var declarations for insertion.
    /// Marks them as inserted so they won't be inserted again.
    pub fn take_var_decls(&mut self) -> Vec<VarDeclarator> {
        self.var_decls_inserted = true;
        std::mem::take(&mut self.var_decls)
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
