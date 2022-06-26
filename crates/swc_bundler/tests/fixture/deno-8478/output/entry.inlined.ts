var Bar;
(function(Bar) {
    function foo() {
        console.log("foo");
    }
    Bar.foo = foo;
})(Bar || (Bar = {}));
export { Bar as Bar };
