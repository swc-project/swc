use once_cell::sync::Lazy;

use crate::util::{descriptor, CoreJSPolyfillDescriptor, ObjectMap, ObjectMap2};

fn dynamic_concat(a: &[&'static str], b: &[&'static str]) -> &'static [&'static str] {
    let mut res = Vec::with_capacity(a.len() + b.len());

    res.extend_from_slice(a);
    res.extend_from_slice(b);

    res.leak()
}

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

fn typed(name: &'static str) -> CoreJSPolyfillDescriptor {
    let mut global = Vec::with_capacity(1 + TYPED_ARRAY_DEPENDENCIES.len());
    global.push(name);
    global.extend_from_slice(TYPED_ARRAY_DEPENDENCIES);

    descriptor(None, global.leak(), Some(name), &[])
}

static ARRAY_NATURE_ITERATORS: &[&str] = &["es.array.iterator", "web.dom-collections.iterator"];

pub static COMMON_ITERATORS: &[&str] =
    &concat2::<3>(ARRAY_NATURE_ITERATORS, &["es.string.iterator"]);

static ARRAY_NATURE_ITERATORS_WITH_TAG: &[&str] =
    &concat2::<3>(&["es.object.to-string"], ARRAY_NATURE_ITERATORS);

static COMMON_ITERATORS_WITH_TAG: &[&str] =
    &concat2::<4>(&["es.object.to-string"], COMMON_ITERATORS);

static TYPED_ARRAY_DEPENDENCIES: &[&str] = &[
    "es.typed-array.copy-within",
    "es.typed-array.every",
    "es.typed-array.fill",
    "es.typed-array.filter",
    "es.typed-array.find",
    "es.typed-array.find-index",
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
    "es.typed-array.to-string",
    "es.object.to-string",
    "es.array.iterator",
    "es.array-buffer.slice",
];

static TYPED_ARRAY_STATIC_METHODS: Lazy<ObjectMap<CoreJSPolyfillDescriptor>> = lazy_map!(Map {
    from: define(null, ["es.typed-array.from"]),
    of: define(null, ["es.typed-array.of"]),
});

pub static PROMISE_DEPENDENCIES: &[&str] = &["es.promise", "es.object.to-string"];

static PROMISE_DEPENDENCIES_WITH_ITERATORS: &[&str] =
    &concat2::<5>(PROMISE_DEPENDENCIES, COMMON_ITERATORS);

static SYMBOL_DEPENDENCIES: &[&str] =
    &["es.symbol", "es.symbol.description", "es.object.to-string"];

static MAP_DEPENDENCIES: &[&str] = &concat2::<18>(
    &[
        "es.map",
        "esnext.map.delete-all",
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

static SET_DEPENDENCIES: &[&str] = &concat2::<21>(
    &[
        "es.set",
        "esnext.set.add-all",
        "esnext.set.delete-all",
        "esnext.set.difference",
        "esnext.set.every",
        "esnext.set.filter",
        "esnext.set.find",
        "esnext.set.intersection",
        "esnext.set.is-disjoint-from",
        "esnext.set.is-subset-of",
        "esnext.set.is-superset-of",
        "esnext.set.join",
        "esnext.set.map",
        "esnext.set.reduce",
        "esnext.set.some",
        "esnext.set.symmetric-difference",
        "esnext.set.union",
    ],
    COMMON_ITERATORS_WITH_TAG,
);

static WEAK_MAP_DEPENDENCIES: &[&str] = &concat2::<6>(
    &["es.weak-map", "esnext.weak-map.delete-all"],
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

static URL_SEARCH_PARAMS_DEPENDENCIES: &[&str] =
    &concat2::<5>(&["web.url"], COMMON_ITERATORS_WITH_TAG);

pub(crate) static BUILT_INS: Lazy<ObjectMap<CoreJSPolyfillDescriptor>> = lazy_map!(Map {
    AggregateError: define(
        "aggregate-error",
        ["esnext.aggregate-error", COMMON_ITERATORS]
    ),
    ArrayBuffer: define(
        null,
        [
            "es.array-buffer.constructor",
            "es.array-buffer.slice",
            "es.object.to-string",
        ]
    ),
    DataView: define(
        null,
        [
            "es.data-view",
            "es.array-buffer.slice",
            "es.object.to-string",
        ]
    ),
    Date: define(null, ["es.date.to-string"]),
    Float32Array: typed("es.typed-array.float32-array"),
    Float64Array: typed("es.typed-array.float64-array"),
    Int8Array: typed("es.typed-array.int8-array"),
    Int16Array: typed("es.typed-array.int16-array"),
    Int32Array: typed("es.typed-array.int32-array"),
    Uint8Array: typed("es.typed-array.uint8-array"),
    Uint8ClampedArray: typed("es.typed-array.uint8-clamped-array"),
    Uint16Array: typed("es.typed-array.uint16-array"),
    Uint32Array: typed("es.typed-array.uint32-array"),
    Map: define("map/index", MAP_DEPENDENCIES),
    Number: define(null, ["es.number.constructor"]),
    Observable: define(
        "observable/index",
        [
            "esnext.observable",
            "esnext.symbol.observable",
            "es.object.to-string",
            COMMON_ITERATORS_WITH_TAG,
        ]
    ),
    Promise: define("promise/index", PROMISE_DEPENDENCIES),
    RegExp: define(
        null,
        [
            "es.regexp.constructor",
            "es.regexp.exec",
            "es.regexp.to-string",
        ]
    ),
    Set: define("set/index", SET_DEPENDENCIES),
    Symbol: define("symbol/index", SYMBOL_DEPENDENCIES),
    URL: define("url/index", ["web.url", URL_SEARCH_PARAMS_DEPENDENCIES]),
    URLSearchParams: define("url-search-params/index", URL_SEARCH_PARAMS_DEPENDENCIES),
    WeakMap: define("weak-map/index", WEAK_MAP_DEPENDENCIES),
    WeakSet: define("weak-set/index", WEAK_SET_DEPENDENCIES),
    clearImmediate: define("clear-immediate", ["web.immediate"]),
    compositeKey: define("composite-key", ["esnext.composite-key"]),
    compositeSymbol: define(
        "composite-symbol",
        ["esnext.composite-symbol", SYMBOL_DEPENDENCIES]
    ),
    fetch: define(null, PROMISE_DEPENDENCIES),
    globalThis: define("global-this", ["es.global-this", "esnext.global-this"]),
    parseFloat: define("parse-float", ["es.parse-float"]),
    parseInt: define("parse-int", ["es.parse-int"]),
    queueMicrotask: define("queue-microtask", ["web.queue-microtask"]),
    setTimeout: define("set-timeout", ["web.timers"]),
    setInterval: define("set-interval", ["web.timers"]),
    setImmediate: define("set-immediate", ["web.immediate"]),
});

pub(crate) static STATIC_PROPERTIES: Lazy<ObjectMap2<CoreJSPolyfillDescriptor>> = lazy_map!(Map{
  Array: Map {
    from: define("array/from", ["es.array.from", "es.string.iterator"]),
    isArray: define("array/is-array", ["es.array.is-array"]),
    of: define("array/of", ["es.array.of"]),
  },

  Date: Map {
    now: define("date/now", ["es.date.now"]),
  },

  Object: Map {
    assign: define("object/assign", ["es.object.assign"]),
    create: define("object/create", ["es.object.create"]),
    defineProperty: define("object/define-property", ["es.object.define-property"]),
    defineProperties: define("object/define-properties", ["es.object.define-properties"]),
    entries: define("object/entries", ["es.object.entries"]),
    freeze: define("object/freeze", ["es.object.freeze"]),
    fromEntries: define("object/from-entries", ["es.object.from-entries", "es.array.iterator"]),
    getOwnPropertyDescriptor: define("object/get-own-property-descriptor", ["es.object.get-own-property-descriptor"]),
    getOwnPropertyDescriptors: define("object/get-own-property-descriptors", ["es.object.get-own-property-descriptors"]),
    getOwnPropertyNames: define("object/get-own-property-names", ["es.object.get-own-property-names"]),
    getOwnPropertySymbols: define("object/get-own-property-symbols", ["es.symbol"]),
    getPrototypeOf: define("object/get-prototype-of", ["es.object.get-prototype-of"]),
    is: define("object/is", ["es.object.is"]),
    isExtensible: define("object/is-extensible", ["es.object.is-extensible"]),
    isFrozen: define("object/is-frozen", ["es.object.is-frozen"]),
    isSealed: define("object/is-sealed", ["es.object.is-sealed"]),
    keys: define("object/keys", ["es.object.keys"]),
    preventExtensions: define("object/prevent-extensions", ["es.object.prevent-extensions"]),
    seal: define("object/seal", ["es.object.seal"]),
    setPrototypeOf: define("object/set-prototype-of", ["es.object.set-prototype-of"]),
    values: define("object/values", ["es.object.values"]),
  },

  Math: Map {
    acosh: define("math/acosh", ["es.math.acosh"]),
    asinh: define("math/asinh", ["es.math.asinh"]),
    atanh: define("math/atanh", ["es.math.atanh"]),
    cbrt: define("math/cbrt", ["es.math.cbrt"]),
    clz32: define("math/clz32", ["es.math.clz32"]),
    cosh: define("math/cosh", ["es.math.cosh"]),
    expm1: define("math/expm1", ["es.math.expm1"]),
    fround: define("math/fround", ["es.math.fround"]),
    hypot: define("math/hypot", ["es.math.hypot"]),
    imul: define("math/imul", ["es.math.imul"]),
    log10: define("math/log10", ["es.math.log10"]),
    log1p: define("math/log1p", ["es.math.log1p"]),
    log2: define("math/log2", ["es.math.log2"]),
    sign: define("math/sign", ["es.math.sign"]),
    sinh: define("math/sinh", ["es.math.sinh"]),
    tanh: define("math/tanh", ["es.math.tanh"]),
    trunc: define("math/trunc", ["es.math.trunc"]),
    DEG_PER_RAD: define("math/deg-per-rad", ["esnext.math.deg-per-rad"]),
    RAD_PER_DEG: define("math/rad-per-deg", ["esnext.math.rad-per-deg"]),
    clamp: define("math/clamp", ["esnext.math.clamp"]),
    degrees: define("math/degrees", ["esnext.math.degrees"]),
    fscale: define("math/fscale", ["esnext.math.fscale"]),
    iaddh: define("math/iaddh", ["esnext.math.iaddh"]),
    imulh: define("math/imulh", ["esnext.math.imulh"]),
    isubh: define("math/isubh", ["esnext.math.isubh"]),
    radians: define("math/radians", ["esnext.math.radians"]),
    scale: define("math/scale", ["esnext.math.scale"]),
    seededPRNG: define("math/seeded-prng", ["esnext.math.seeded-prng"]),
    signbit: define("math/signbit", ["esnext.math.signbit"]),
    umulh: define("math/umulh", ["esnext.math.umulh"]),
  },

  String: Map {
    fromCodePoint: define("string/from-code-point", ["es.string.from-code-point"]),
    raw: define("string/raw", ["es.string.raw"]),
  },

  Number: Map {
    EPSILON: define("number/epsilon", ["es.number.epsilon"]),
    MIN_SAFE_INTEGER: define("number/min-safe-integer", ["es.number.min-safe-integer"]),
    MAX_SAFE_INTEGER: define("number/max-safe-integer", ["es.number.max-safe-integer"]),
    fromString: define("number/from-string", ["esnext.number.from-string"]),
    isFinite: define("number/is-finite", ["es.number.is-finite"]),
    isInteger: define("number/is-integer", ["es.number.is-integer"]),
    isSafeInteger: define("number/is-safe-integer", ["es.number.is-safe-integer"]),
    isNaN: define("number/is-nan", ["es.number.is-nan"]),
    parseFloat: define("number/parse-float", ["es.number.parse-float"]),
    parseInt: define("number/parse-int", ["es.number.parse-int"]),
  },

  Map: Map {
    from: define(null, ["esnext.map.from", MAP_DEPENDENCIES]),
    groupBy: define(null, ["esnext.map.group-by", MAP_DEPENDENCIES]),
    keyBy: define(null, ["esnext.map.key-by", MAP_DEPENDENCIES]),
    of: define(null, ["esnext.map.of", MAP_DEPENDENCIES]),
  },

  Set: Map {
    from: define(null, ["esnext.set.from", SET_DEPENDENCIES]),
    of: define(null, ["esnext.set.of", SET_DEPENDENCIES]),
  },

  WeakMap: Map {
    from: define(null, ["esnext.weak-map.from", WEAK_MAP_DEPENDENCIES]),
    of: define(null, ["esnext.weak-map.of", WEAK_MAP_DEPENDENCIES]),
  },

  WeakSet: Map {
    from: define(null, ["esnext.weak-set.from", WEAK_SET_DEPENDENCIES]),
    of: define(null, ["esnext.weak-set.of", WEAK_SET_DEPENDENCIES]),
  },

  Promise: Map {
    all: define(null, PROMISE_DEPENDENCIES_WITH_ITERATORS),
    allSettled: define(null, [
      "es.promise.all-settled",
      "esnext.promise.all-settled",
      PROMISE_DEPENDENCIES_WITH_ITERATORS,
    ]),
    any: define(null, [
      "esnext.promise.any",
      "esnext.aggregate-error",
      PROMISE_DEPENDENCIES_WITH_ITERATORS,
    ]),
    race: define(null, PROMISE_DEPENDENCIES_WITH_ITERATORS),
    try: define(null, ["esnext.promise.try", PROMISE_DEPENDENCIES_WITH_ITERATORS]),
  },

  Reflect: Map {
    apply: define("reflect/apply", ["es.reflect.apply"]),
    construct: define("reflect/construct", ["es.reflect.construct"]),
    defineMetadata: define("reflect/define-metadata", ["esnext.reflect.define-metadata"]),
    defineProperty: define("reflect/define-property", ["es.reflect.define-property"]),
    deleteMetadata: define("reflect/delete-metadata", ["esnext.reflect.delete-metadata"]),
    deleteProperty: define("reflect/delete-property", ["es.reflect.delete-property"]),
    get: define("reflect/get", ["es.reflect.get"]),
    getMetadata: define("reflect/get-metadata", ["esnext.reflect.get-metadata"]),
    getMetadataKeys: define("reflect/get-metadata-keys", ["esnext.reflect.get-metadata-keys"]),
    getOwnMetadata: define("reflect/get-own-metadata", ["esnext.reflect.get-own-metadata"]),
    getOwnMetadataKeys: define("reflect/get-own-metadata-keys", ["esnext.reflect.get-own-metadata-keys"]),
    getOwnPropertyDescriptor: define("reflect/get-own-property-descriptor", ["es.reflect.get-own-property-descriptor"]),
    getPrototypeOf: define("reflect/get-prototype-of", ["es.reflect.get-prototype-of"]),
    has: define("reflect/has", ["es.reflect.has"]),
    hasMetadata: define("reflect/has-metadata", ["esnext.reflect.has-metadata"]),
    hasOwnMetadata: define("reflect/has-own-metadata", ["esnext.reflect.has-own-metadata"]),
    isExtensible: define("reflect/is-extensible", ["es.reflect.is-extensible"]),
    metadata: define("reflect/metadata", ["esnext.reflect.metadata"]),
    ownKeys: define("reflect/own-keys", ["es.reflect.own-keys"]),
    preventExtensions: define("reflect/prevent-extensions", ["es.reflect.prevent-extensions"]),
    set: define("reflect/set", ["es.reflect.set"]),
    setPrototypeOf: define("reflect/set-prototype-of", ["es.reflect.set-prototype-of"]),
  },

  Symbol: Map {
    asyncIterator: define("symbol/async-iterator", ["es.symbol.async-iterator"]),
    dispose: define("symbol/dispose", ["esnext.symbol.dispose"]),
    hasInstance: define("symbol/has-instance", ["es.symbol.has-instance", "es.function.has-instance"]),
    isConcatSpreadable: define("symbol/is-concat-spreadable", ["es.symbol.is-concat-spreadable", "es.array.concat"]),
    iterator: define("symbol/iterator", ["es.symbol.iterator", COMMON_ITERATORS_WITH_TAG]),
    match: define("symbol/match", ["es.symbol.match", "es.string.match"]),
    observable: define("symbol/observable", ["esnext.symbol.observable"]),
    patternMatch: define("symbol/pattern-match", ["esnext.symbol.pattern-match"]),
    replace: define("symbol/replace", ["es.symbol.replace", "es.string.replace"]),
    search: define("symbol/search", ["es.symbol.search", "es.string.search"]),
    species: define("symbol/species", ["es.symbol.species", "es.array.species"]),
    split: define("symbol/split", ["es.symbol.split", "es.string.split"]),
    toPrimitive: define("symbol/to-primitive", ["es.symbol.to-primitive", "es.date.to-primitive"]),
    toStringTag: define("symbol/to-string-tag", [
      "es.symbol.to-string-tag",
      "es.object.to-string",
      "es.math.to-string-tag",
      "es.json.to-string-tag",
    ]),
    unscopables: define("symbol/unscopables", ["es.symbol.unscopables"]),
  },

  ArrayBuffer: Map {
    isView: define(null, ["es.array-buffer.is-view"]),
  },

  Int8Array: *TYPED_ARRAY_STATIC_METHODS,
  Uint8Array: *TYPED_ARRAY_STATIC_METHODS,
  Uint8ClampedArray: *TYPED_ARRAY_STATIC_METHODS,
  Int16Array: *TYPED_ARRAY_STATIC_METHODS,
  Uint16Array: *TYPED_ARRAY_STATIC_METHODS,
  Int32Array: *TYPED_ARRAY_STATIC_METHODS,
  Uint32Array: *TYPED_ARRAY_STATIC_METHODS,
  Float32Array: *TYPED_ARRAY_STATIC_METHODS,
  Float64Array: *TYPED_ARRAY_STATIC_METHODS,
});

pub(crate) static INSTANCE_PROPERTIES: Lazy<ObjectMap<CoreJSPolyfillDescriptor>> = lazy_map!(Map {
    at: define("instance/at", ["es.string.at", "es.array.at"]),
    anchor: define(null, ["es.string.anchor"]),
    big: define(null, ["es.string.big"]),
    bind: define("instance/bind", ["es.function.bind"]),
    blink: define(null, ["es.string.blink"]),
    bold: define(null, ["es.string.bold"]),
    codePointAt: define("instance/code-point-at", ["es.string.code-point-at"]),
    codePoints: define("instance/code-points", ["esnext.string.code-points"]),
    concat: define("instance/concat", ["es.array.concat"]),
    copyWithin: define("instance/copy-within", ["es.array.copy-within"]),
    endsWith: define("instance/ends-with", ["es.string.ends-with"]),
    entries: define("instance/entries", ARRAY_NATURE_ITERATORS_WITH_TAG),
    every: define("instance/every", ["es.array.every"]),
    exec: define(null, ["es.regexp.exec"]),
    fill: define("instance/fill", ["es.array.fill"]),
    filter: define("instance/filter", ["es.array.filter"]),
    finally: define(null, ["es.promise.finally", PROMISE_DEPENDENCIES]),
    find: define("instance/find", ["es.array.find"]),
    findIndex: define("instance/find-index", ["es.array.find-index"]),
    fixed: define(null, ["es.string.fixed"]),
    flags: define("instance/flags", ["es.regexp.flags"]),
    flat: define("instance/flat", ["es.array.flat", "es.array.unscopables.flat"]),
    flatMap: define("instance/flat-map", ["es.array.flat-map", "es.array.unscopables.flat-map"]),
    fontcolor: define(null, ["es.string.fontcolor"]),
    fontsize: define(null, ["es.string.fontsize"]),
    forEach: define("instance/for-each", ["es.array.for-each", "web.dom-collections.for-each"]),
    includes: define("instance/includes", ["es.array.includes", "es.string.includes"]),
    indexOf: define("instance/index-of", ["es.array.index-of"]),
    italics: define(null, ["es.string.italics"]),
    join: define(null, ["es.array.join"]),
    keys: define("instance/keys", ARRAY_NATURE_ITERATORS_WITH_TAG),
    lastIndex: define(null, ["esnext.array.last-index"]),
    lastIndexOf: define("instance/last-index-of", ["es.array.last-index-of"]),
    lastItem: define(null, ["esnext.array.last-item"]),
    link: define(null, ["es.string.link"]),
    map: define("instance/map", ["es.array.map"]),
    match: define(null, ["es.string.match", "es.regexp.exec"]),
    matchAll: define("instance/match-all", ["es.string.match-all", "esnext.string.match-all"]),
    name: define(null, ["es.function.name"]),
    padEnd: define("instance/pad-end", ["es.string.pad-end"]),
    padStart: define("instance/pad-start", ["es.string.pad-start"]),
    reduce: define("instance/reduce", ["es.array.reduce"]),
    reduceRight: define("instance/reduce-right", ["es.array.reduce-right"]),
    repeat: define("instance/repeat", ["es.string.repeat"]),
    replace: define(null, ["es.string.replace", "es.regexp.exec"]),
    replaceAll: define("instance/replace-all", ["esnext.string.replace-all"]),
    reverse: define("instance/reverse", ["es.array.reverse"]),
    search: define(null, ["es.string.search", "es.regexp.exec"]),
    slice: define("instance/slice", ["es.array.slice"]),
    small: define(null, ["es.string.small"]),
    some: define("instance/some", ["es.array.some"]),
    sort: define("instance/sort", ["es.array.sort"]),
    splice: define("instance/splice", ["es.array.splice"]),
    split: define(null, ["es.string.split", "es.regexp.exec"]),
    startsWith: define("instance/starts-with", ["es.string.starts-with"]),
    strike: define(null, ["es.string.strike"]),
    sub: define(null, ["es.string.sub"]),
    sup: define(null, ["es.string.sup"]),
    toFixed: define(null, ["es.number.to-fixed"]),
    toISOString: define(null, ["es.date.to-iso-string"]),
    toJSON: define(null, ["es.date.to-json", "web.url.to-json"]),
    toPrecision: define(null, ["es.number.to-precision"]),
    toString: define(null, ["es.object.to-string", "es.regexp.to-string", "es.date.to-string"]),
    trim: define("instance/trim", ["es.string.trim"]),
    trimEnd: define("instance/trim-end", ["es.string.trim-end"]),
    trimLeft: define("instance/trim-left", ["es.string.trim-start"]),
    trimRight: define("instance/trim-right", ["es.string.trim-end"]),
    trimStart: define("instance/trim-start", ["es.string.trim-start"]),
    values: define("instance/values", ARRAY_NATURE_ITERATORS_WITH_TAG),
    __defineGetter__: define(null, ["es.object.define-getter"]),
    __defineSetter__: define(null, ["es.object.define-setter"]),
    __lookupGetter__: define(null, ["es.object.lookup-getter"]),
    __lookupSetter__: define(null, ["es.object.lookup-setter"]),
});

pub static COMMON_INSTANCE_DEPENDENCIES: Lazy<ObjectMap<CoreJSPolyfillDescriptor>> =
    lazy_map!(Map {
        es_object_to_string: define(null, ["es.object.to-string"]),
        es_object_define_getter: define(null, ["es.object.define-getter"]),
        es_object_define_setter: define(null, ["es.object.define-setter"]),
        es_object_lookup_getter: define(null, ["es.object.lookup-getter"]),
        es_object_lookup_setter: define(null, ["es.object.lookup-setter"]),
        es_regexp_exec: define(null, ["es.regexp.exec"]),
    });

pub static POSSIBLE_GLOBAL_OBJECTS: Lazy<ObjectMap<CoreJSPolyfillDescriptor>> = lazy_map!(Map {
    global: define(null, []),
    globalThis: define(null, []),
    self: define(null, []),
    window: define(null, []),
});
