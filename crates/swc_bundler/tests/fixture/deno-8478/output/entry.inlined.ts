var Bar;
(function(Bar1) {
    function foo() {
        console.log("foo");
    }
    Bar1.foo = foo;
})(Bar || (Bar = {
}));
export { Bar as Bar };
