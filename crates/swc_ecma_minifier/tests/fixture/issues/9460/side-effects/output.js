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
const { iifeValue = function(value = record("iife-param")) {}() } = {}, { iifeRestValue = function(...[value = record("iife-rest-param")]) {}() } = {};
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
} } = {}, { newTargetValue = class {
    static value = record(new.target === void 0 ? "class-new-target" : "unexpected-new-target");
} } = {}, { directEvalValue = class {
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
console.log(events.join(","));
