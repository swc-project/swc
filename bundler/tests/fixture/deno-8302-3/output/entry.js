const a = function() {
    const lib = function() {
        class A {
        }
        return {
            A
        };
    }();
    console.log(b, lib);
    console.log(c, lib);
    console.log(a, lib);
}();
console.log(a);
