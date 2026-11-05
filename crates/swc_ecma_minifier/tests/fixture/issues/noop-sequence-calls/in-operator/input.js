function noop(value) {}
function run(x) {
    return noop("k" in x), noop(), 42;
}
try {
    console.log(run(null));
} catch (e) {
    console.log(e.name);
}
