const events = [];

function record(value) {
    events.push(value);
}

record("before");
(class { static value = record("static"); });
record("after");

console.log(events.join(","));
