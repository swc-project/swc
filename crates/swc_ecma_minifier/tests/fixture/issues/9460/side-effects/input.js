const events = [];

function record(value) {
    events.push(value);
}

const { fallback = record("default") } = {};
const { getterValue = record("getter-default") } = {
    get getterValue() {
        record("getter");
        return undefined;
    }
};
const { [record("computed")]: computed = "computed-default" } = {};
const { restValue = record("rest-default"), ...rest } = {};
const { classValue = "class-default" } = class {
    static get classValue() {
        record("class-getter");
        return 1;
    }
};

try {
    const { nullValue = "null-default" } = null;
} catch {
    record("throws");
}

try {
    const { inValue = "value" in null } = {};
} catch {
    record("in-throws");
}

try {
    const { wrappedInValue = !("value" in null) } = {};
} catch {
    record("wrapped-in-throws");
}

const proxy = new Proxy({}, {
    ownKeys() {
        record("spread-own-keys");
        return [];
    }
});
const { spreadValue = { ...proxy } } = {};

try {
    const { classHeritage = class extends 1 {} } = {};
} catch {
    record("class-heritage-throws");
}

const { iifeValue = (function (value = record("iife-param")) {})() } = {};
const { iifeRestValue = (function (...[value = record("iife-rest-param")]) {})() } = {};
const { generatorValue = (function* (value = record("generator-param")) {})() } = {};
const { asyncGeneratorValue = (async function* (value = record("async-generator-param")) {})() } = {};

function namedEmptyFunction(value = record("named-function-param")) {}
const { namedFunctionValue = namedEmptyFunction() } = {};

function returnsNull() {
    return null;
}
try {
    const { pureNullValue = "pure-null-default" } = /*#__PURE__*/ returnsNull();
} catch {
    record("pure-null-throws");
}

const proxyKey = new Proxy({}, {
    get(_, key) {
        if (key === Symbol.toPrimitive) {
            record("computed-key-coercion");
            return () => "key";
        }
    }
});
const { objectValue = "object-default" } = { [proxyKey]: 1 };

const { protoValue = "proto-default" } = {
    "__proto__": {
        get protoValue() {
            record("quoted-proto-getter");
            return undefined;
        }
    }
};

const defaultProxyKey = new Proxy({}, {
    get(_, key) {
        if (key === Symbol.toPrimitive) {
            record("default-computed-key-coercion");
            return () => "key";
        }
    }
});
const { defaultObjectValue = { [defaultProxyKey]: 1 } } = {};

const classProxyKey = new Proxy({}, {
    get(_, key) {
        if (key === Symbol.toPrimitive) {
            record("default-class-computed-key-coercion");
            return () => "key";
        }
    }
});
const { defaultClassValue = class { [classProxyKey]() {} } } = {};

const nestedProxy = new Proxy({}, {
    ownKeys() {
        record("nested-spread-own-keys");
        return [];
    }
});
const { nestedSpreadValue = 0 } = { other: { ...nestedProxy } };

const { newTargetValue = class {
    static value = record(new.target === undefined ? "class-new-target" : "unexpected-new-target");
} } = {};

const { arrowNewTargetValue = class {
    static value = (() => record(new.target === undefined ? "arrow-new-target" : "unexpected-arrow-new-target"))();
} } = {};

const { directEvalValue = class {
    static value = eval("record(typeof this)");
} } = {};

try {
    const { shorthandValue = { missing } } = {};
} catch {
    record("shorthand-reference-throws");
}

try {
    const { arguments = 0 } = () => {};
} catch {
    record("function-arguments-throws");
}

class B {}
class C extends B {
    constructor() {
        const { thisValue = this } = {};
        super();
    }
}
try {
    new C();
} catch {
    record("pre-super-this-throws");
}

console.log(events.join(","));
