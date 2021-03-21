class A {
}
const mod = function() {
    return {
        A: A
    };
}();
console.log(mod);
