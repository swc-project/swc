const events = [];
function record(value) {
    events.push(value);
}
const { value = class {
    static field = (function() {
        record(void 0 === this);
    })();
} } = {};
try {
    const { value = class {
        static field = missing = 1;
    } } = {};
} catch  {
    record("strict-assignment-throws");
}
console.log(events.join(","));
