function parameter(...rest) {
    return function (rest) {
        return eval("rest.length");
    }([1]);
}

function block(...rest) {
    {
        let rest = [1, 2];
        return eval("rest.length");
    }
}

function nestedVar(...rest) {
    return function () {
        var rest = [1, 2, 3];
        return eval("rest.length");
    }();
}

function nestedControlFlowVar(...rest) {
    return function () {
        if (false) {
            var rest = [1, 2, 3, 4];
        }
        return typeof eval("rest");
    }();
}

function nestedFunction(...rest) {
    return function () {
        function rest() {}
        return typeof eval("rest");
    }();
}

console.log(parameter(1, 2));
console.log(block(1, 2));
console.log(nestedVar(1, 2));
console.log(nestedControlFlowVar(1, 2));
console.log(nestedFunction(1, 2));
