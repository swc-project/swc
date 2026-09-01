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

console.log(events.join(","));
