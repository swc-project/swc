const events = [];
function record(value) {
    events.push(value);
}
const { value = class {
    static field = (function() {
        record(void 0 === this);
    })();
} } = {};
console.log(events.join(","));
