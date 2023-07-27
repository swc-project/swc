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

static COMMON_ITERATORS: &[&str] = &concat2(ARRAY_NATURE_ITERATORS, &["es.string.iterator"]);

static ARRAY_NATURE_ITERATORS_WITH_TAG: &[&str] =
    &concat2(ARRAY_NATURE_ITERATORS, &["es.object.to-string"]);

static COMMON_ITERATORS_WITH_TAG: &[&str] = &concat2(COMMON_ITERATORS, &["es.object.to-string"]);

static ErrorDependencies: &[&str] = &["es.error.cause", "es.error.to-string"];

static SuppressedErrorDependencies: &[&str] =
    &concat2(&["esnext.suppressed-error.constructor"], ErrorDependencies);

static TypedArrayDependencies: &[&str] = &[
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

static PromiseDependencies: &[&str] = &["es.promise", "es.object.to-string"];

static PromiseDependenciesWithIterators: &[&str] = &concat2(PromiseDependencies, CommonIterators);

static SymbolDependencies: &[&str] = &["es.symbol", "es.symbol.description", "es.object.to-string"];

static MapDependencies: &[&str] = &concat2(
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
    CommonIteratorsWithTag,
);

static SetDependencies: &[&str] = &concat2(
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
    CommonIteratorsWithTag,
);

static WeakMapDependencies: &[&str] = concat2(
    &[
        "es.weak-map",
        "esnext.weak-map.delete-all",
        "esnext.weak-map.emplace",
    ],
    CommonIteratorsWithTag,
);

static WeakSetDependencies: &[&str] = concat2(
    &[
        "es.weak-set",
        "esnext.weak-set.add-all",
        "esnext.weak-set.delete-all",
    ],
    CommonIteratorsWithTag,
);

static DOMExceptionDependencies: &[&str] = &[
    "web.dom-exception.constructor",
    "web.dom-exception.stack",
    "web.dom-exception.to-string-tag",
    "es.error.to-string",
];

static URLSearchParamsDependencies: &[&str] = concat2(
    &[
        "web.url-search-params",
        "web.url-search-params.delete",
        "web.url-search-params.has",
        "web.url-search-params.size",
    ],
    CommonIteratorsWithTag,
);

static AsyncIteratorDependencies: &[&str] =
    concat2(&["esnext.async-iterator.constructor"], PromiseDependencies);

static AsyncIteratorProblemMethods: &[&str] = &[
    "esnext.async-iterator.every",
    "esnext.async-iterator.filter",
    "esnext.async-iterator.find",
    "esnext.async-iterator.flat-map",
    "esnext.async-iterator.for-each",
    "esnext.async-iterator.map",
    "esnext.async-iterator.reduce",
    "esnext.async-iterator.some",
];

static IteratorDependencies: &[&str] = &["esnext.iterator.constructor", "es.object.to-string"];

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
