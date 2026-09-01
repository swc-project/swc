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

console.log(events.join(","));
