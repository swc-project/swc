function check() {
    console.log("check");
    return true;
}
delete globalThis.setImmediate;
try {
    check() ? new setImmediate(1) : new setImmediate(2);
} catch (error) {
    console.log(error.name);
}
