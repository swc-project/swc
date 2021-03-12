const a = "hello world";
const mod = function() {
    return {
        instanceof: a
    };
}();
console.log(a, mod);
