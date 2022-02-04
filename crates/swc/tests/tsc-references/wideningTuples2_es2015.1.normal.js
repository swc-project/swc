//@noImplicitAny: true
var foo = function bar() {
    let intermediate = bar();
    intermediate = [
        ""
    ];
    return [
        undefined
    ];
};
