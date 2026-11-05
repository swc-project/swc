function noop(value) {}
function run() {
    return noop({ missing }), noop(), 42;
}
try {
    console.log(run());
} catch (e) {
    console.log(e.name);
}
