const events = [];
function record(value) {
    events.push(value);
}
const { fallback = record("default") } = {}, { getterValue = record("getter-default") } = {
    get getterValue () {
        record("getter");
    }
}, { [record("computed")]: computed = "computed-default" } = {}, { restValue = record("rest-default"), ...rest } = {};
try {
    const { nullValue = "null-default" } = null;
} catch  {
    record("throws");
}
console.log(events.join(","));
