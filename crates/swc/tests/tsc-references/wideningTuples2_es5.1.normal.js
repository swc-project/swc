//@noImplicitAny: true
var foo = function bar() {
    var intermediate = bar();
    intermediate = [
        ""
    ];
    return [
        undefined
    ];
};
