const mod = function() {
    const a = "hello world";
    const __instanceof = a;
    return {
        instanceof: a
    };
}();
const __instanceof = mod.instanceof;
console.log(__instanceof, mod);
