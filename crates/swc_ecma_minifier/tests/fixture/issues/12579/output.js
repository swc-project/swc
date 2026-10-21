function init() {
    return globalThis.ready = !0, 1;
}
function main() {
    var r = init();
    console.log(globalThis.ready, r);
}
globalThis.ready = !1, main();
