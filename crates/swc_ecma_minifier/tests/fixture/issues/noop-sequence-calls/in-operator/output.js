function noop(value) {}
function run(x) {
    return "k" in x, 42;
}
try {
    console.log(run(null));
} catch (e) {
    console.log(e.name);
}
