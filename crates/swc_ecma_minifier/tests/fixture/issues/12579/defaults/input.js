globalThis.a = 0;
a = 1;
console.log(globalThis.a, a);

globalThis.b = 0;
b = 1;
console.log(globalThis["b"], b);

globalThis.c = 0;
c = 1;
console.log(globalThis?.c, c);

function init() {
    globalThis.ready = true;
    return 1;
}
function main() {
    var r = init();
    console.log(globalThis.ready, r);
}
globalThis.ready = false;
main();
