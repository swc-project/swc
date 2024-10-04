(function(Bar) {
    function foo() {
        console.log("foo");
    }
    Bar.foo = foo;
})(Bar || (Bar = {}));
var Bar;
export { Bar as Bar };
