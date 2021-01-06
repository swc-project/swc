const mod = function() {
    const a = "hello world";
    return {
        instanceof: a
    };
}();
const y = mod;
const __instanceof = mod.instanceof;
const x = __instanceof;
console.log(x, y);
