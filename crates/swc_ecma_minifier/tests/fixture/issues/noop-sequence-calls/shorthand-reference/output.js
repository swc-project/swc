function noop(value) {}
function run() {
    return missing, 42;
}
try {
    console.log(run());
} catch (e) {
    console.log(e.name);
}
