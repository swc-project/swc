function report(label, callback) {
    try {
        console.log(label, callback());
    } catch (error) {
        console.log(label, error.name);
    }
}

report("number", () => {
    (class extends 1 {});
    return "no error";
});

const Arrow = () => {};

report("arrow", () => {
    (class extends Arrow {});
    return "no error";
});

const events = [];

function record(value) {
    events.push(value);
}

report("null", () => {
    (class extends null { static value = record("null"); });
    return "ok";
});

function Base() {}

let count = 0;
report("constructor", () => {
    (class extends (count++, Base) { static value = count++; });
    return count;
});

console.log(events.join(","));
