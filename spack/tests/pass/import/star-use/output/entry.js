const mod = function() {
    class A {
    }
    return {
        A
    };
}();
const a = mod;
console.log(a);
