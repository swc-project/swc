function noop(value) {}
function run(x) {
    return ({}) instanceof x, 42;
}
try {
    console.log(run(null));
} catch (e) {
    console.log(e.name);
}
