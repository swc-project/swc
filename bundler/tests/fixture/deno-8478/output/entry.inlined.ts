var Bar1;
(function(Bar) {
    function foo() {
        console.log("foo");
    }
    Bar.foo = foo;
})(Bar1 || (Bar1 = {
}));
export { Bar1 as Bar };
