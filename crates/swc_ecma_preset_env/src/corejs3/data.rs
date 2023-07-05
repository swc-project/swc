use once_cell::sync::Lazy;
use preset_env_base::version::Version;
use swc_common::collections::AHashMap;

use crate::util::{DataMap, FeatureMap};

const fn concat2<const N: usize>(a: &[&'static str], b: &[&'static str]) -> [&'static str; N] {
    assert!(N == a.len() + b.len());

    let mut res = [""; N];
    let mut idx = 0;

    while idx < a.len() {
        res[idx] = a[idx];
        idx += 1;
    }

    while idx < a.len() + b.len() {
        res[idx] = b[idx - a.len()];
        idx += 1;
    }

    res
}

static ARRAY_NATURE_ITERATORS: &[&str] = &["es.array.iterator", "web.dom-collections.iterator"];

pub static COMMON_ITERATORS: &[&str] =
    &concat2::<3>(&["es.string.iterator"], ARRAY_NATURE_ITERATORS);

static ARRAY_NATURE_ITERATORS_WITH_TAG: &[&str] =
    &concat2::<3>(&["es.object.to-string"], ARRAY_NATURE_ITERATORS);

static COMMON_ITERATORS_WITH_TAG: &[&str] =
    &concat2::<4>(&["es.object.to-string"], COMMON_ITERATORS);

static ITERATOR: &[&str] = &["esnext.iterator.constructor", "es.object.to-string"];

pub static PROMISE_DEPENDENCIES: &[&str] = &["es.promise", "es.object.to-string"];

static PROMISE_DEPENDENCIES_WITH_ITERATORS: &[&str] =
    &concat2::<5>(PROMISE_DEPENDENCIES, COMMON_ITERATORS);

static TYPED_ARRAY_STATIC_METHODS: FeatureMap = data_map!(Map {
    from: &["es.typed-array.from"],
    fromAsync: TYPED_FROM_ASYNC,
    of: &["es.typed-array.of"],
});

static ASYNC_ITERATOR: &[&str] =
    &concat2::<3>(&["esnext.async-iterator.constructor"], PROMISE_DEPENDENCIES);

static TYPED_FROM_ASYNC: &[&str] = &concat2::<6>(
    &["esnext.typed-array.from-async"],
    PROMISE_DEPENDENCIES_WITH_ITERATORS,
);

static SYMBOL_DEPENDENCIES: &[&str] =
    &["es.symbol", "es.symbol.description", "es.object.to-string"];

static MAP_DEPENDENCIES: &[&str] = &concat2::<19>(
    &[
        "es.map",
        "esnext.map.delete-all",
        "esnext.map.emplace",
        "esnext.map.every",
        "esnext.map.filter",
        "esnext.map.find",
        "esnext.map.find-key",
        "esnext.map.includes",
        "esnext.map.key-of",
        "esnext.map.map-keys",
        "esnext.map.map-values",
        "esnext.map.merge",
        "esnext.map.reduce",
        "esnext.map.some",
        "esnext.map.update",
    ],
    COMMON_ITERATORS_WITH_TAG,
);

static SET_DEPENDENCIES: &[&str] = &concat2::<28>(
    &[
        "es.set",
        "esnext.set.add-all",
        "esnext.set.delete-all",
        "esnext.set.difference",
        "esnext.set.difference.v2",
        "esnext.set.every",
        "esnext.set.filter",
        "esnext.set.find",
        "esnext.set.intersection",
        "esnext.set.intersection.v2",
        "esnext.set.is-disjoint-from",
        "esnext.set.is-disjoint-from.v2",
        "esnext.set.is-subset-of",
        "esnext.set.is-subset-of.v2",
        "esnext.set.is-superset-of",
        "esnext.set.is-superset-of.v2",
        "esnext.set.join",
        "esnext.set.map",
        "esnext.set.reduce",
        "esnext.set.some",
        "esnext.set.symmetric-difference",
        "esnext.set.symmetric-difference.v2",
        "esnext.set.union",
        "esnext.set.union.v2",
    ],
    COMMON_ITERATORS_WITH_TAG,
);

static WEAK_MAP_DEPENDENCIES: &[&str] = &concat2::<7>(
    &[
        "es.weak-map",
        "esnext.weak-map.delete-all",
        "esnext.weak-map.emplace",
    ],
    COMMON_ITERATORS_WITH_TAG,
);

static WEAK_SET_DEPENDENCIES: &[&str] = &concat2::<7>(
    &[
        "es.weak-set",
        "esnext.weak-set.add-all",
        "esnext.weak-set.delete-all",
    ],
    COMMON_ITERATORS_WITH_TAG,
);

static URL_SEARCH_PARAMS_DEPENDENCIES: &[&str] = &concat2::<6>(
    &["web.url-search-params", "web.url-search-params.size"],
    COMMON_ITERATORS_WITH_TAG,
);

pub static REGEXP_DEPENDENCIES: &[&str] = &[
    "es.regexp.constructor",
    "es.regexp.dot-all",
    "es.regexp.exec",
    "es.regexp.sticky",
    "es.regexp.to-string",
];

static TYPED_ARRAY: &[&str] = &[
    "es.typed-array.at",
    "es.typed-array.copy-within",
    "es.typed-array.every",
    "es.typed-array.fill",
    "es.typed-array.filter",
    "es.typed-array.find",
    "es.typed-array.find-index",
    "es.typed-array.find-last",
    "es.typed-array.find-last-index",
    "es.typed-array.for-each",
    "es.typed-array.includes",
    "es.typed-array.index-of",
    "es.typed-array.iterator",
    "es.typed-array.join",
    "es.typed-array.last-index-of",
    "es.typed-array.map",
    "es.typed-array.reduce",
    "es.typed-array.reduce-right",
    "es.typed-array.reverse",
    "es.typed-array.set",
    "es.typed-array.slice",
    "es.typed-array.some",
    "es.typed-array.sort",
    "es.typed-array.subarray",
    "es.typed-array.to-locale-string",
    "es.typed-array.to-reversed",
    "es.typed-array.to-sorted",
    "es.typed-array.to-string",
    "es.typed-array.with",
    "es.object.to-string",
    "es.array.iterator",
    "es.array-buffer.slice",
    "esnext.array-buffer.detached",
    "esnext.array-buffer.transfer",
    "esnext.array-buffer.transfer-to-fixed-length",
    "esnext.typed-array.filter-reject",
    "esnext.typed-array.group-by",
    "esnext.typed-array.to-spliced",
    "esnext.typed-array.unique-by",
];

static FLOAT32_ARRAY: &[&str] = &concat2::<40>(TYPED_ARRAY, &["es.typed-array.float32-array"]);
static FLOAT64_ARRAY: &[&str] = &concat2::<40>(TYPED_ARRAY, &["es.typed-array.float64-array"]);
static INT8_ARRAY: &[&str] = &concat2::<40>(TYPED_ARRAY, &["es.typed-array.int8-array"]);
static INT16_ARRAY: &[&str] = &concat2::<40>(TYPED_ARRAY, &["es.typed-array.int16-array"]);
static INT32_ARRAY: &[&str] = &concat2::<40>(TYPED_ARRAY, &["es.typed-array.int32-array"]);
static UINT8_ARRAY: &[&str] = &concat2::<40>(TYPED_ARRAY, &["es.typed-array.uint8-array"]);
static UINT8_CLAMPED_ARRAY: &[&str] =
    &concat2::<40>(TYPED_ARRAY, &["es.typed-array.uint8-clamped-array"]);
static UINT16_ARRAY: &[&str] = &concat2::<40>(TYPED_ARRAY, &["es.typed-array.uint16-array"]);
static UINT32_ARRAY: &[&str] = &concat2::<40>(TYPED_ARRAY, &["es.typed-array.uint32-array"]);

static OBSERVEABLE: &[&str] = &concat2::<7>(
    &[
        "esnext.observable",
        "esnext.symbol.observable",
        "es.object.to-string",
    ],
    COMMON_ITERATORS_WITH_TAG,
);

static URL_DEP: &[&str] = &concat2::<7>(&["web.url"], URL_SEARCH_PARAMS_DEPENDENCIES);

static DOM_EXCEPTION: &[&str] = &[
    "web.dom-exception.constructor",
    "web.dom-exception.stack",
    "web.dom-exception.to-string-tag",
    "es.error.to-string",
];
static ATOB: &[&str] = &concat2::<5>(DOM_EXCEPTION, &["web.atob"]);
static BTOA: &[&str] = &concat2::<5>(DOM_EXCEPTION, &["web.btoa"]);
static STRUCTURE_CLONE: &[&str] = &concat2::<10>(
    DOM_EXCEPTION,
    &[
        "web.structured-clone",
        "es.array.iterator",
        "es.object.keys",
        "es.object.to-string",
        "es.map",
        "es.set",
    ],
);

static ERROR_DEP: &[&str] = &["es.error.cause", "es.error.to-string"];
static SUPPRESSED_ERROR_DEP: &[&str] =
    &concat2::<3>(ERROR_DEP, &["esnext.suppressed-error.constructor"]);

static AGGREGATE_ERROR_DEP: &[&str] = &concat2::<8>(
    COMMON_ITERATORS_WITH_TAG,
    &[
        "es.aggregate-error",
        "es.error.cause",
        "es.error.to-string",
        "es.aggregate-error.cause",
    ],
);

static DISPOSABLE_STACK_DEP: &[&str] = &concat2::<6>(
    SUPPRESSED_ERROR_DEP,
    &[
        "esnext.disposable-stack.constructor",
        "es.object.to-string",
        "esnext.iterator.dispose",
    ],
);

static ASYNC_DISPOSABLE_STACK_DEP: &[&str] = &concat2::<9>(
    &concat2::<5>(SUPPRESSED_ERROR_DEP, PROMISE_DEPENDENCIES),
    &[
        "esnext.async-disposable-stack.constructor",
        "es.object.to-string",
        "esnext.async-iterator.async-dispose",
        "esnext.iterator.dispose",
    ],
);

pub static BUILTINS: DataMap<&[&str]> = data_map!(Map {
    AsyncDisposableStack: ASYNC_DISPOSABLE_STACK_DEP,
    AsyncIterator: ASYNC_ITERATOR,
    AggregateError: AGGREGATE_ERROR_DEP,
    ArrayBuffer: [
        "es.array-buffer.constructor",
        "es.array-buffer.slice",
        "es.object.to-string",
    ],
    DataView: [
        "es.data-view",
        "es.array-buffer.slice",
        "es.object.to-string"
    ],
    Date: ["es.date.to-string"],
    DOMException: DOM_EXCEPTION,
    DisposableStack: DISPOSABLE_STACK_DEP,
    Error: ERROR_DEP,
    EvalError: ERROR_DEP,
    Iterator: ITERATOR,
    Float32Array: FLOAT32_ARRAY,
    Float64Array: FLOAT64_ARRAY,
    Int8Array: INT8_ARRAY,
    Int16Array: INT16_ARRAY,
    Int32Array: INT32_ARRAY,
    Uint8Array: UINT8_ARRAY,
    Uint8ClampedArray: UINT8_CLAMPED_ARRAY,
    Uint16Array: UINT16_ARRAY,
    Uint32Array: UINT32_ARRAY,
    Map: MAP_DEPENDENCIES,
    Number: ["es.number.constructor"],
    Observable: OBSERVEABLE,
    Promise: PROMISE_DEPENDENCIES,
    RangeError: ERROR_DEP,
    ReferenceError: ERROR_DEP,
    Reflect: ["es.reflect.to-string-tag", "es.object.to-string"],
    RegExp: REGEXP_DEPENDENCIES,
    Set: SET_DEPENDENCIES,
    SuppressedError: SUPPRESSED_ERROR_DEP,
    Symbol: SYMBOL_DEPENDENCIES,
    SyntaxError: ERROR_DEP,
    TypeError: ERROR_DEP,
    URIError: ERROR_DEP,
    URL: URL_DEP,
    URLSearchParams: URL_SEARCH_PARAMS_DEPENDENCIES,
    WeakMap: WEAK_MAP_DEPENDENCIES,
    WeakSet: WEAK_SET_DEPENDENCIES,

    atob: ATOB,
    btoa: BTOA,
    clearImmediate: ["web.immediate"],
    compositeKey: ["esnext.composite-key"],
    compositeSymbol: ["esnext.composite-symbol"],
    escape: ["es.escape"],
    fetch: PROMISE_DEPENDENCIES,
    globalThis: ["es.global-this"],
    parseFloat: ["es.parse-float"],
    parseInt: ["es.parse-int"],
    queueMicrotask: ["web.queue-microtask"],
    self: ["web.self"],
    setTimeout: ["web.timers"],
    setInterval: ["web.timers"],
    setImmediate: ["web.immediate"],
    structuredClone: STRUCTURE_CLONE,
    unescape: ["es.unescape"],
});

static ASYNC_ITERATOR_WITH_ITERATOR: &[&str] = &concat2::<5>(ITERATOR, ASYNC_ITERATOR);

static INDEXED_PAIRS: &[&str] = &concat2::<7>(
    &[
        "esnext.async-iterator.as-indexed-pairs",
        "esnext.iterator.as-indexed-pairs",
    ],
    ASYNC_ITERATOR_WITH_ITERATOR,
);

static DROP: &[&str] = &concat2::<7>(
    &["esnext.async-iterator.drop", "esnext.iterator.drop"],
    ASYNC_ITERATOR_WITH_ITERATOR,
);

static EVERY: &[&str] = &concat2::<5>(
    &[
        "es.array.every",
        "esnext.async-iterator.every",
        "esnext.iterator.every",
    ],
    ITERATOR,
);

static FILTER: &[&str] = &concat2::<5>(
    &[
        "es.array.filter",
        "esnext.async-iterator.filter",
        "esnext.iterator.filter",
    ],
    ITERATOR,
);

static FIND: &[&str] = &concat2::<5>(
    &[
        "es.array.find",
        "esnext.async-iterator.find",
        "esnext.iterator.find",
    ],
    ITERATOR,
);

static FLAT_MAP: &[&str] = &concat2::<6>(
    &[
        "es.array.flat-map",
        "es.array.unscopables.flat-map",
        "esnext.async-iterator.flat-map",
        "esnext.iterator.flat-map",
    ],
    ITERATOR,
);

static FOR_EACH: &[&str] = &concat2::<6>(
    &[
        "es.array.for-each",
        "esnext.async-iterator.for-each",
        "esnext.iterator.for-each",
        "web.dom-collections.for-each",
    ],
    ITERATOR,
);

static REDUCE: &[&str] = &concat2::<5>(
    &[
        "es.array.reduce",
        "esnext.async-iterator.reduce",
        "esnext.iterator.reduce",
    ],
    ITERATOR,
);

static SOME: &[&str] = &concat2::<5>(
    &[
        "es.array.some",
        "esnext.async-iterator.some",
        "esnext.iterator.some",
    ],
    ITERATOR,
);

static TAKE: &[&str] = &concat2::<7>(
    &["esnext.async-iterator.take", "esnext.iterator.take"],
    ASYNC_ITERATOR_WITH_ITERATOR,
);

static TO_ARRAY: &[&str] = &concat2::<7>(
    &["esnext.async-iterator.to-array", "esnext.iterator.to-array"],
    ASYNC_ITERATOR_WITH_ITERATOR,
);

static ASYNC_ITERATOR_METHOD: &[&str] = &[
    "esnext.async-iterator.every",
    "esnext.async-iterator.filter",
    "esnext.async-iterator.find",
    "esnext.async-iterator.flat-map",
    "esnext.async-iterator.for-each",
    "esnext.async-iterator.map",
    "esnext.async-iterator.reduce",
    "esnext.async-iterator.some",
];

static TO_ASYNC: &[&str] = &concat2::<14>(
    &["esnext.iterator.to-async"],
    &concat2::<13>(ASYNC_ITERATOR_WITH_ITERATOR, ASYNC_ITERATOR_METHOD),
);

static PROMISE_FINALLY: &[&str] = &concat2::<3>(&["es.promise.finally"], PROMISE_DEPENDENCIES);

pub static INSTANCE_PROPERTIES: DataMap<&[&str]> = data_map!(Map {
    asIndexedPairs: INDEXED_PAIRS,
    // TODO: check type of variable
    at: ["esnext.string.at", "es.string.at-alternative", "es.array.at"],
    anchor: ["es.string.anchor"],
    big: ["es.string.big"],
    bind: ["es.function.bind"],
    blink: ["es.string.blink"],
    bold: ["es.string.bold"],
    codePointAt: ["es.string.code-point-at"],
    codePoints: ["esnext.string.code-points"],
    concat: ["es.array.concat"],
    copyWithin: ["es.array.copy-within"],
    description: ["es.symbol", "es.symbol.description"],
    dotAll: [ "es.regexp.dot-all"],
    drop: DROP,
    emplace: ["esnext.map.emplace", "esnext.weak-map.emplace"],
    endsWith: ["es.string.ends-with"],
    entries: ARRAY_NATURE_ITERATORS_WITH_TAG,
    every: EVERY,
    exec: ["es.regexp.exec"],
    fill: ["es.array.fill"],
    filter: FILTER,
    filterReject: "esnext.array.filter-reject",
    finally: PROMISE_FINALLY,
    find: FIND,
    findIndex: ["es.array.find-index"],
    findLast: ["es.array.find-last"],
    findLastIndex: ["es.array.find-last-index"],
    fixed: ["es.string.fixed"],
    flags: ["es.regexp.flags"],
    flat: ["es.array.flat", "es.array.unscopables.flat"],
    flatMap: FLAT_MAP,
    fontcolor: ["es.string.fontcolor"],
    fontsize: ["es.string.fontsize"],
    forEach: FOR_EACH,
    getYear: "es.date.get-year",
    group: ["esnext.array.group"],
    groupBy: "esnext.array.group-by",
    groupByToMap: ["esnext.array.group-by-to-map", "es.map", "es.object.to-string"],
    groupToMap:["esnext.array.group-to-map", "es.map", "es.object.to-string"],
    includes: ["es.array.includes", "es.string.includes"],
    indexOf: ["es.array.index-of"],
    isWellFormed: ["esnext.string.is-well-formed"],
    italics: ["es.string.italics"],
    join: ["es.array.join"],
    keys: ARRAY_NATURE_ITERATORS_WITH_TAG,
    lastIndex: ["esnext.array.last-index"],
    lastIndexOf: ["es.array.last-index-of"],
    lastItem: ["esnext.array.last-item"],
    link: ["es.string.link"],
    map: ["es.array.map", "esnext.async-iterator.map", "esnext.iterator.map"],
    match: ["es.string.match", "es.regexp.exec"],
    matchAll: ["es.string.match-all", "es.regexp.exec"],
    name: ["es.function.name"],
    padEnd: ["es.string.pad-end"],
    padStart: ["es.string.pad-start"],
    push: ["es.array.push"],
    reduce: REDUCE,
    reduceRight: ["es.array.reduce-right"],
    repeat: ["es.string.repeat"],
    replace: ["es.string.replace", "es.regexp.exec"],
    replaceAll: ["es.string.replace-all", "es.string.replace","es.regexp.exec"],
    reverse: ["es.array.reverse"],
    search: ["es.string.search", "es.regexp.exec"],
    setYear: ["es.date.set-year"],
    slice: ["es.array.slice"],
    small: ["es.string.small"],
    some: SOME,
    sort: ["es.array.sort"],
    splice: ["es.array.splice"],
    split: ["es.string.split", "es.regexp.exec"],
    startsWith: ["es.string.starts-with"],
    sticky:["es.regexp.sticky"],
    strike: ["es.string.strike"],
    sub: ["es.string.sub"],
    substr: ["es.string.substr"],
    sup: ["es.string.sup"],
    take: TAKE,
    test: ["es.regexp.test", "es.regexp.exec"],
    toArray: TO_ARRAY,
    toAsync: TO_ASYNC,
    toExponential: "es.number.to-exponential",
    toFixed: ["es.number.to-fixed"],
    toGMTString: "es.date.to-gmt-string",
    toISOString: ["es.date.to-iso-string"],
    toJSON: ["es.date.to-json", "web.url.to-json"],
    toPrecision: ["es.number.to-precision"],
    toReversed: ["es.array.to-reversed"],
    toSorted: ["es.array.to-sorted", "es.array.sort"],
    toSpliced: "es.array.to-spliced",
    toString: ["es.object.to-string", "es.error.to-string", "es.date.to-string", "es.regexp.to-string"],
    toWellFormed: ["esnext.string.to-well-formed"],
    trim: ["es.string.trim"],
    trimEnd: ["es.string.trim-end"],
    trimLeft: ["es.string.trim-start"],
    trimRight: ["es.string.trim-end"],
    trimStart: ["es.string.trim-start"],
    uniqueBy: ["esnext.array.unique-by", "es.map"],
    unshift: ["es.array.unshift"],
    unThis: "esnext.function.un-this",
    values: ARRAY_NATURE_ITERATORS_WITH_TAG,
    with: "es.array.with",
    __defineGetter__: ["es.object.define-getter"],
    __defineSetter__: ["es.object.define-setter"],
    __lookupGetter__: ["es.object.lookup-getter"],
    __lookupSetter__: ["es.object.lookup-setter"],
    __proto__: ["es.object.proto"],
});

static ASYNC_ITER_FROM: &[&str] = &concat2::<15>(
    &["esnext.async-iterator.from"],
    &concat2::<14>(
        ASYNC_ITERATOR,
        &concat2::<11>(ASYNC_ITERATOR_METHOD, COMMON_ITERATORS),
    ),
);
static FROM_ASYNC: &[&str] = &concat2::<6>(
    &["esnext.array.from-async"],
    PROMISE_DEPENDENCIES_WITH_ITERATORS,
);
static ALL_SETTLED: &[&str] = &concat2::<6>(
    &["es.promise.all-settled"],
    PROMISE_DEPENDENCIES_WITH_ITERATORS,
);
static PROMISE_ANY: &[&str] = &concat2::<7>(
    &["es.promise.any", "es.aggregate-error"],
    PROMISE_DEPENDENCIES_WITH_ITERATORS,
);
static PROMISE_TRY: &[&str] =
    &concat2::<6>(&["esnext.promise.try"], PROMISE_DEPENDENCIES_WITH_ITERATORS);

static MAP_FROM: &[&str] = &concat2::<20>(&["esnext.map.from"], MAP_DEPENDENCIES);
static MAP_GROUP_BY: &[&str] = &concat2::<20>(&["esnext.map.group-by"], MAP_DEPENDENCIES);
static MAP_KEY_BY: &[&str] = &concat2::<20>(&["esnext.map.key-by"], MAP_DEPENDENCIES);
static MAP_OF: &[&str] = &concat2::<20>(&["esnext.map.key-of"], MAP_DEPENDENCIES);

static SET_FROM: &[&str] = &concat2::<29>(&["esnext.set.from"], SET_DEPENDENCIES);
static SET_OF: &[&str] = &concat2::<29>(&["esnext.set.of"], SET_DEPENDENCIES);

static WEAK_MAP_FROM: &[&str] = &concat2::<8>(&["esnext.weak-map.from"], WEAK_MAP_DEPENDENCIES);
static WEAK_MAP_OF: &[&str] = &concat2::<8>(&["esnext.weak-map.of"], WEAK_MAP_DEPENDENCIES);

static WEAK_SET_FROM: &[&str] = &concat2::<8>(&["esnext.weak-set.from"], WEAK_SET_DEPENDENCIES);
static WEAK_SET_OF: &[&str] = &concat2::<8>(&["esnext.weak-set.of"], WEAK_SET_DEPENDENCIES);

static SYMBOL_ITERATOR: &[&str] = &concat2::<5>(&["es.symbol.iterator"], COMMON_ITERATORS_WITH_TAG);

pub static STATIC_PROPERTIES: DataMap<DataMap<&[&str]>> = data_map!(Map {
    AsyncIterator: Map {
        from: ASYNC_ITER_FROM,
    },
    Array: Map {
        from: ["es.array.from", "es.string.iterator"],
        fromAsync: FROM_ASYNC,
        isArray: ["es.array.is-array"],
        isTemplateObject: "esnext.array.is-template-object",
        of: ["es.array.of"],
    },

    ArrayBuffer: Map {
        isView: ["es.array-buffer.is-view"],
    },

    BigInt: Map {
        range: ["esnext.bigint.range", "es.object.to-string"],
    },

    Date: Map { now: "es.date.now" },

    Function: Map {
        isCallable: "esnext.function.is-callable",
        isConstructor: "esnext.function.is-constructor",
    },

    Iterator: Map {
        from: ["esnext.iterator.from"],
        range: [
            "esnext.iterator.range",
            "es.object.to-string",
        ],
    },

    JSON: Map {
        isRawJSON: ["esnext.json.is-raw-json"],
        parse: ["esnext.json.parse", "es.object.keys"],
        rawJSON: [
            "esnext.json.raw-json",
            "es.object.create",
            "es.object.freeze",
        ],
        stringify: ["es.json.stringify"],
    },

    Object: Map {
        assign: "es.object.assign",
        create: "es.object.create",
        defineProperty: "es.object.define-property",
        defineProperties: "es.object.define-properties",
        entries: "es.object.entries",
        freeze: "es.object.freeze",
        fromEntries: ["es.object.from-entries", "es.array.iterator"],
        getOwnPropertyDescriptor: "es.object.get-own-property-descriptor",
        getOwnPropertyDescriptors: "es.object.get-own-property-descriptors",
        getOwnPropertyNames: "es.object.get-own-property-names",
        getOwnPropertySymbols: "es.symbol",
        getPrototypeOf: "es.object.get-prototype-of",
        hasOwn: "es.object.has-own",
        is: "es.object.is",
        isExtensible: "es.object.is-extensible",
        isFrozen: "es.object.is-frozen",
        isSealed: "es.object.is-sealed",
        keys: "es.object.keys",
        preventExtensions: "es.object.prevent-extensions",
        seal: "es.object.seal",
        setPrototypeOf: "es.object.set-prototype-of",
        values: "es.object.values",
    },

    Math: Map {
        DEG_PER_RAD: "esnext.math.deg-per-rad",
        RAD_PER_DEG: "esnext.math.rad-per-deg",
        acosh: "es.math.acosh",
        asinh: "es.math.asinh",
        atanh: "es.math.atanh",
        cbrt: "es.math.cbrt",
        clamp: "esnext.math.clamp",
        clz32: "es.math.clz32",
        cosh: "es.math.cosh",
        degrees: "esnext.math.degrees",
        expm1: "es.math.expm1",
        fround: "es.math.fround",
        fscale: "esnext.math.fscale",
        hypot: "es.math.hypot",
        iaddh: "esnext.math.iaddh",
        imul: "es.math.imul",
        imulh: "esnext.math.imulh",
        isubh: "esnext.math.isubh",
        log1p: "es.math.log1p",
        log10: "es.math.log10",
        log2: "es.math.log2",
        radians: "esnext.math.radians",
        scale: "esnext.math.scale",
        seededPRNG: "esnext.math.seeded-prng",
        sign: "es.math.sign",
        signbit: "esnext.math.signbit",
        sinh: "es.math.sinh",
        tanh: "es.math.tanh",
        trunc: "es.math.trunc",
        umulh: "esnext.math.umulh",
    },

    String: Map {
        cooked: "esnext.string.cooked",
        dedent: [
            "esnext.string.dedent",
            "es.string.from-code-point",
            "es.weak-map",
        ],
        fromCodePoint: "es.string.from-code-point",
        raw: "es.string.raw",
    },

    Number: Map {
        EPSILON: "es.number.epsilon",
        MIN_SAFE_INTEGER: "es.number.min-safe-integer",
        MAX_SAFE_INTEGER: "es.number.max-safe-integer",
        fromString: "esnext.number.from-string",
        isFinite: "es.number.is-finite",
        isInteger: "es.number.is-integer",
        isSafeInteger: "es.number.is-safe-integer",
        isNaN: "es.number.is-nan",
        parseFloat: "es.number.parse-float",
        parseInt: "es.number.parse-int",
        range: [
            "esnext.number.range",
            "es.object.to-string",
        ],
    },

    Map: Map {
        from: MAP_FROM,
        groupBy: MAP_GROUP_BY,
        keyBy: MAP_KEY_BY,
        of: MAP_OF,
    },

    Set: Map {
        from: SET_FROM,
        of: SET_OF,
    },

    WeakMap: Map {
        from: WEAK_MAP_FROM,
        of: WEAK_MAP_OF,
    },

    WeakSet: Map {
        from: WEAK_SET_FROM,
        of: WEAK_SET_OF,
    },

    Promise: Map {
        all: PROMISE_DEPENDENCIES_WITH_ITERATORS,
        allSettled: ALL_SETTLED,
        any: PROMISE_ANY,
        race: PROMISE_DEPENDENCIES_WITH_ITERATORS,
        try: PROMISE_TRY,
    },

    Reflect: Map {
        apply: "es.reflect.apply",
        construct: "es.reflect.construct",
        defineMetadata: "esnext.reflect.define-metadata",
        defineProperty: "es.reflect.define-property",
        deleteMetadata: "esnext.reflect.delete-metadata",
        deleteProperty: "es.reflect.delete-property",
        get: "es.reflect.get",
        getMetadata: "esnext.reflect.get-metadata",
        getMetadataKeys: "esnext.reflect.get-metadata-keys",
        getOwnMetadata: "esnext.reflect.get-own-metadata",
        getOwnMetadataKeys: "esnext.reflect.get-own-metadata-keys",
        getOwnPropertyDescriptor: "es.reflect.get-own-property-descriptor",
        getPrototypeOf: "es.reflect.get-prototype-of",
        has: "es.reflect.has",
        hasMetadata: "esnext.reflect.has-metadata",
        hasOwnMetadata: "esnext.reflect.has-own-metadata",
        isExtensible: "es.reflect.is-extensible",
        metadata: "esnext.reflect.metadata",
        ownKeys: "es.reflect.own-keys",
        preventExtensions: "es.reflect.prevent-extensions",
        set: "es.reflect.set",
        setPrototypeOf: "es.reflect.set-prototype-of",
    },

    Symbol: Map {
        asyncDispose: ["esnext.symbol.async-dispose"],
        asyncIterator: ["es.symbol.async-iterator"],
        dispose: ["esnext.symbol.dispose"],
        for: ["es.symbol"],
        hasInstance: ["es.symbol.has-instance", "es.function.has-instance"],
        isConcatSpreadable: ["es.symbol.is-concat-spreadable", "es.array.concat"],
        isRegistered: ["esnext.symbol.is-registered", "es.symbol"],
        isWellKnown: ["esnext.symbol.is-well-known", "es.symbol"],
        iterator: SYMBOL_ITERATOR,
        keyFor: ["es.symbol"],
        match: ["es.symbol.match", "es.string.match"],
        matcher: ["es.symbol.matcher"],
        matchAll: ["es.symbol.match-all", "es.string.match-all"],
        metadata: "esnext.symbol.metadata",
        metadataKey: ["esnext.symbol.metadata-key"],
        observable: ["esnext.symbol.observable"],
        patternMatch: ["esnext.symbol.pattern-match"],
        replace: ["es.symbol.replace", "es.string.replace"],
        search: ["es.symbol.search", "es.string.search"],
        species: ["es.symbol.species", "es.array.species"],
        split: ["es.symbol.split", "es.string.split"],
        toPrimitive: ["es.symbol.to-primitive", "es.date.to-primitive"],
        toStringTag: [
            "es.symbol.to-string-tag",
            "es.object.to-string",
            "es.math.to-string-tag",
            "es.json.to-string-tag",
        ],
        unscopables: ["es.symbol.unscopables"],
    },

    Int8Array: &TYPED_ARRAY_STATIC_METHODS,
    Uint8Array: &TYPED_ARRAY_STATIC_METHODS,
    Uint8ClampedArray: &TYPED_ARRAY_STATIC_METHODS,
    Int16Array: &TYPED_ARRAY_STATIC_METHODS,
    Uint16Array: &TYPED_ARRAY_STATIC_METHODS,
    Int32Array: &TYPED_ARRAY_STATIC_METHODS,
    Uint32Array: &TYPED_ARRAY_STATIC_METHODS,
    Float32Array: &TYPED_ARRAY_STATIC_METHODS,
    Float64Array: &TYPED_ARRAY_STATIC_METHODS,

    WebAssembly: Map {
        CompileError: ERROR_DEP,
        LinkError: ERROR_DEP,
        RuntimeError: ERROR_DEP,
    },
});

pub static POSSIBLE_GLOBAL_OBJECTS: &[&str] = &["global", "globalThis", "self", "window"];

pub static MODULES_BY_VERSION: Lazy<AHashMap<&'static str, Version>> = Lazy::new(|| {
    serde_json::from_str::<AHashMap<_, _>>(include_str!(
        "../../data/core-js-compat/modules-by-versions.json"
    ))
    .expect("failed to parse modules-by-versions.json")
    .into_iter()
    .flat_map(|(k, v): (Version, Vec<String>)| {
        v.into_iter()
            .map(|s: String| (&*Box::leak(s.into_boxed_str()), k))
            .collect::<Vec<_>>()
    })
    .collect()
});
