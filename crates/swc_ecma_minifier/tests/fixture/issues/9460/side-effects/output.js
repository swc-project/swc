const events = [];
function record(value) {
    events.push(value);
}
const { fallback = record("default") } = {}, { getterValue = record("getter-default") } = {
    get getterValue () {
        record("getter");
    }
}, { [record("computed")]: computed = "computed-default" } = {}, { restValue = record("rest-default"), ...rest } = {}, { classValue = "class-default" } = class {
    static get classValue() {
        return record("class-getter"), 1;
    }
};
try {
    const { nullValue = "null-default" } = null;
} catch  {
    record("throws");
}
try {
    const { inValue = "value" in null } = {};
} catch  {
    record("in-throws");
}
try {
    const { wrappedInValue = !("value" in null) } = {};
} catch  {
    record("wrapped-in-throws");
}
try {
    const { relationalValue = 1 > Symbol() } = {};
} catch  {
    record("relational-throws");
}
const proxy = new Proxy({}, {
    ownKeys: ()=>(record("spread-own-keys"), [])
}), { spreadValue = {
    ...proxy
} } = {};
try {
    const { classHeritage = class extends 1 {
    } } = {};
} catch  {
    record("class-heritage-throws");
}
const { iifeValue = function(value = record("iife-param")) {}() } = {}, { iifeRestValue = function(...[value = record("iife-rest-param")]) {}() } = {}, { generatorValue = function*(value = record("generator-param")) {}() } = {}, { asyncGeneratorValue = async function*(value = record("async-generator-param")) {}() } = {}, { arrowIifeValue = ((value = record("arrow-iife-param"))=>{})() } = {};
try {
    const { arrowDestructuringIifeValue = (({ value })=>{})() } = {};
} catch  {
    record("arrow-destructuring-param-throws");
}
function namedEmptyFunction(value = record("named-function-param")) {}
const { namedFunctionValue = namedEmptyFunction() } = {};
function returnsNull() {
    return null;
}
try {
    const { pureNullValue = "pure-null-default" } = /*#__PURE__*/ returnsNull();
} catch  {
    record("pure-null-throws");
}
const proxyKey = new Proxy({}, {
    get (_, key) {
        if (key === Symbol.toPrimitive) return record("computed-key-coercion"), ()=>"key";
    }
}), { objectValue = "object-default" } = {
    [proxyKey]: 1
}, { protoValue = "proto-default" } = {
    __proto__: {
        get protoValue () {
            record("quoted-proto-getter");
        }
    }
}, defaultProxyKey = new Proxy({}, {
    get (_, key) {
        if (key === Symbol.toPrimitive) return record("default-computed-key-coercion"), ()=>"key";
    }
}), { defaultObjectValue = {
    [defaultProxyKey]: 1
} } = {}, classProxyKey = new Proxy({}, {
    get (_, key) {
        if (key === Symbol.toPrimitive) return record("default-class-computed-key-coercion"), ()=>"key";
    }
}), { defaultClassValue = class {
    [classProxyKey]() {}
} } = {}, nestedProxy = new Proxy({}, {
    ownKeys: ()=>(record("nested-spread-own-keys"), [])
}), { nestedSpreadValue = 0 } = {
    other: {
        ...nestedProxy
    }
}, { newTargetValue = class {
    static value = record(new.target === void 0 ? "class-new-target" : "unexpected-new-target");
} } = {}, { arrowNewTargetValue = class {
    static value = record(new.target === void 0 ? "arrow-new-target" : "unexpected-arrow-new-target");
} } = {};
function run(callback) {
    callback();
}
const { callbackArrowNewTargetValue = class {
    static value = run(()=>record(new.target === void 0 ? "callback-arrow-new-target" : "unexpected-callback-arrow-new-target"));
} } = {}, saved = [];
function keep(callback) {
    saved.push(callback);
}
const { privateEnvironmentValue = class {
    static #privateName;
    static value = keep(function() {
        return #privateName in {};
    });
} } = {}, { nestedClassPrivateEnvironmentValue = class {
    static #nestedPrivateName;
    static value = keep(class {
        method() {
            return #nestedPrivateName in {};
        }
    });
} } = {}, { nestedClassHeritagePrivateEnvironmentValue = class {
    static #nestedClassHeritagePrivateName;
    static value = class extends (#nestedClassHeritagePrivateName in {}, record("nested-class-heritage-private"), class {
    }) {
        #nestedClassHeritagePrivateName;
    };
} } = {}, { directEvalValue = class {
    static value = eval("record(typeof this)");
} } = {}, { parenthesizedDirectEvalValue = class {
    static value = eval("record(typeof this)");
} } = {};
try {
    const { shorthandValue = {
        missing
    } } = {};
} catch  {
    record("shorthand-reference-throws");
}
try {
    const { arguments = 0 } = ()=>{};
} catch  {
    record("function-arguments-throws");
}
class B {
}
class C extends B {
    constructor(){
        let { thisValue = this } = {};
        super();
    }
}
try {
    new C();
} catch  {
    record("pre-super-this-throws");
}
try {
    const { privateBrandValue = class {
        #privateBrand;
        static value = ({}).#privateBrand;
    } } = {};
} catch  {
    record("private-brand-throws");
}
const deleteTarget = {};
Object.defineProperty(deleteTarget, "fixed", {
    configurable: !1
});
try {
    const { strictDeleteValue = class {
        static value = delete deleteTarget.fixed;
    } } = {};
} catch  {
    record("strict-delete-throws");
}
try {
    const { functionArgumentsValue = class {
        static value = (function() {}).arguments;
    } } = {};
} catch  {
    record("class-function-arguments-throws");
}
try {
    const { computedFunctionArgumentsValue = class {
        static value = (function() {}).arguments;
    } } = {};
} catch  {
    record("computed-class-function-arguments-throws");
}
const noPrimitive = Object.create(null);
try {
    const { looseEqualityValue = 1 == noPrimitive } = {};
} catch  {
    record("loose-equality-throws");
}
const otherNoPrimitive = Object.create(null);
try {
    const { looseInequalityValue = 1 != otherNoPrimitive } = {};
} catch  {
    record("loose-inequality-throws");
}
const iterable = {
    [Symbol.iterator]: ()=>(record("array-spread-iterator"), [][Symbol.iterator]())
}, { arraySpreadValue = [
    ...iterable
] } = {};
try {
    const { instanceofValue = ({}) instanceof 1 } = {};
} catch  {
    record("instanceof-throws");
}
console.log(events.join(","));
