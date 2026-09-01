const events = [];

function record(value) {
    events.push(value);
}

const { value = class {
    static field = (function () {
        record(this === undefined);
    })();
} } = {};

console.log(events.join(","));
