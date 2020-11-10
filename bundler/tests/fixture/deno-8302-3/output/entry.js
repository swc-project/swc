const lib = function() {
    class A {
    }
    return {
        A
    };
}();
const a = function() {
    console.log(b, lib);
    console.log(c, lib);
    console.log(a, lib);
}();
console.log(a);
