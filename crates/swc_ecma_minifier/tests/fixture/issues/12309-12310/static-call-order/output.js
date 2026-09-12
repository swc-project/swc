const events = [];
function record(value) {
    events.push(value);
}
record("before");
record("static");
record("after");
console.log(events.join(","));
