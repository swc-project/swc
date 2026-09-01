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

try {
    const { nullValue = "null-default" } = null;
} catch {
    record("throws");
}

console.log(events.join(","));
