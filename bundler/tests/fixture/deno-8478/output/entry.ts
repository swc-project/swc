var Bar1;
(function(Bar1) {
    function foo() {
        console.log("foo");
    }
    Bar1.foo = foo;
})(Bar1 || (Bar1 = {
}));
export { Bar1 as Bar };
