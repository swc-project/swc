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
console.log(events.join(","));
