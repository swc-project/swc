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

try {
    const { relationalValue = Symbol() < 1 } = {};
} catch {
    record("relational-throws");
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
const { arrowIifeValue = ((value = record("arrow-iife-param")) => {})() } = {};

try {
    const { arrowDestructuringIifeValue = (({ value }) => {})() } = {};
} catch {
    record("arrow-destructuring-param-throws");
}

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

function run(callback) {
    callback();
}
const { callbackArrowNewTargetValue = class {
    static value = run(() => record(new.target === undefined ? "callback-arrow-new-target" : "unexpected-callback-arrow-new-target"));
} } = {};

const saved = [];
function keep(callback) {
    saved.push(callback);
}
const { privateEnvironmentValue = class {
    static #privateName;
    static value = keep(function () {
        return #privateName in {};
    });
} } = {};

const { nestedClassPrivateEnvironmentValue = class {
    static #nestedPrivateName;
    static value = keep(class {
        method() {
            return #nestedPrivateName in {};
        }
    });
} } = {};

const { nestedClassHeritagePrivateEnvironmentValue = class {
    static #nestedClassHeritagePrivateName;
    static value = class extends ((#nestedClassHeritagePrivateName in {}), record("nested-class-heritage-private"), class {}) {
        #nestedClassHeritagePrivateName;
    };
} } = {};

const { directEvalValue = class {
    static value = eval("record(typeof this)");
} } = {};

const { parenthesizedDirectEvalValue = class {
    static value = (eval)("record(typeof this)");
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

try {
    const { privateBrandValue = class {
        #privateBrand;
        static value = ({}).#privateBrand;
    } } = {};
} catch {
    record("private-brand-throws");
}

const deleteTarget = {};
Object.defineProperty(deleteTarget, "fixed", { configurable: false });
try {
    const { strictDeleteValue = class {
        static value = delete deleteTarget.fixed;
    } } = {};
} catch {
    record("strict-delete-throws");
}

try {
    const { functionArgumentsValue = class {
        static value = (function () {}).arguments;
    } } = {};
} catch {
    record("class-function-arguments-throws");
}

try {
    const { computedFunctionArgumentsValue = class {
        static value = (function () {})["arguments"];
    } } = {};
} catch {
    record("computed-class-function-arguments-throws");
}

const noPrimitive = Object.create(null);
try {
    const { looseEqualityValue = noPrimitive == 1 } = {};
} catch {
    record("loose-equality-throws");
}

const otherNoPrimitive = Object.create(null);
try {
    const { looseInequalityValue = otherNoPrimitive != 1 } = {};
} catch {
    record("loose-inequality-throws");
}

const iterable = {
    [Symbol.iterator]() {
        record("array-spread-iterator");
        return [][Symbol.iterator]();
    }
};
const { arraySpreadValue = [...iterable] } = {};

try {
    const { instanceofValue = {} instanceof 1 } = {};
} catch {
    record("instanceof-throws");
}

const includesSymbol = Symbol();
try {
    const { stringMethodValue = class {
        static value = "".includes(includesSymbol);
    } } = {};
} catch {
    record("string-method-throws");
}

const { constructorParameterValue = class {
    static value = new (class {
        constructor(value = record("constructor-parameter")) {}
    })();
} } = {};

console.log(events.join(","));
