function noop(value) {}
function makeCallback() {
    console.log("factory");
    return () => console.log("callback");
}
function run(value) {
    return (
        noop(() => {
            throw new Error("UNUSED_ARROW_CALLBACK");
        }),
        noop(function () {
            throw new Error("UNUSED_FUNCTION_CALLBACK");
        }),
        noop(1, "value", null, true),
        noop({ ...value }),
        noop(makeCallback()),
        42
    );
}
function spread(value) {
    return noop(...value), noop(), 42;
}
console.log(
    run({
        get value() {
            console.log("get");
        },
    }),
);
try {
    console.log(spread(null));
} catch (error) {
    console.log(error.name);
}
