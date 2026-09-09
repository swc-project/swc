var trace = [];
var globals = Object.getOwnPropertyNames(globalThis);
with ({ set _loop_init_(value) { trace.push("intercepted"); throw "scratch"; } }) {
    for (let i = 0, read = () => i; i < 1;) {
        i = 42;
        console.log(read());
        break;
    }
}
console.log(trace.length);
console.log(Object.getOwnPropertyNames(globalThis).filter(function (key) {
    return globals.indexOf(key) === -1 && key.indexOf("_loop_init") === 0;
}).length);
