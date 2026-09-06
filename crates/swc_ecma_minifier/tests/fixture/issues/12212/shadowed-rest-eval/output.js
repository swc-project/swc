function parameter() {
    return function(rest) {
        return eval("rest.length");
    }([
        1
    ]);
}
function block() {
    {
        let rest = [
            1,
            2
        ];
        return eval("rest.length");
    }
}
function nestedVar() {
    return function() {
        var rest = [
            1,
            2,
            3
        ];
        return eval("rest.length");
    }();
}
function nestedControlFlowVar() {
    return function() {
        var rest;
        return typeof eval("rest");
    }();
}
function nestedFunction() {
    return function() {
        function rest() {}
        return typeof eval("rest");
    }();
}
console.log(parameter(1, 2));
console.log(block(1, 2));
console.log(nestedVar(1, 2));
console.log(nestedControlFlowVar(1, 2));
console.log(nestedFunction(1, 2));
