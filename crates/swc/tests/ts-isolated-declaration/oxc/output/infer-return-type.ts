function foo() {
    return 1;
}
// inferred type is number
function bar() {
    if (a) {
        return;
    }
    return 1;
}
// inferred type is number | undefined
function baz() {
    if (a) {
        return null;
    }
    return 1;
}
// We can't infer return type if there are multiple return statements with different types
function qux() {
    var a1 = function() {
        return 1;
    }();
    return "Hello, world!";
}
