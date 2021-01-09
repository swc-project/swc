const mod = function() {
    const a = "hello world";
    const __instanceof = a;
    return {
        instanceof: __instanceof
    };
}();
const y = mod;
const __instanceof = mod.instanceof;
const x = __instanceof;
console.log(x, y);
