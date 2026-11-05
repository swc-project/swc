function noop(value) {}
function run(x) {
    return noop({} instanceof x), noop(), 42;
}
try {
    console.log(run(null));
} catch (e) {
    console.log(e.name);
}
