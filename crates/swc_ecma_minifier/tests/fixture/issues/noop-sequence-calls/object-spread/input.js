function noop(value) {}
function run(x) {
    return noop({ ...x }), noop(), 42;
}
console.log(
    run({
        get value() {
            console.log("get");
            return 1;
        },
    }),
);
