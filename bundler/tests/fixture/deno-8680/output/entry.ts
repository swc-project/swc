const mod = function() {
    const a = "hello world";
    return {
        instanceof: a
    };
}();
const __instanceof = mod.instanceof;
const x = __instanceof;
const y = mod;
console.log(x, y);
