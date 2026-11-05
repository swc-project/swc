function noop(value) {}
function run(x) {
    return noop({ ...x }), noop(), 42;
}
try {
    console.log(
        run({
            get value() {
                throw new Error("get");
            },
        }),
    );
} catch (e) {
    console.log(e.message);
}
