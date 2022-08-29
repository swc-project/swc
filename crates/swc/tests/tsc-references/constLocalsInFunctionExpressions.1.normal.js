//// [constLocalsInFunctionExpressions.ts]
function f1() {
    var x = getStringOrNumber();
    if (typeof x === "string") {
        var f = function() {
            return x.length;
        };
    }
}
function f2() {
    var x = getStringOrNumber();
    if (typeof x !== "string") {
        return;
    }
    var f = function() {
        return x.length;
    };
}
function f3() {
    var x = getStringOrNumber();
    if (typeof x === "string") {
        var f = function f() {
            return x.length;
        };
    }
}
function f4() {
    var x = getStringOrNumber();
    if (typeof x !== "string") {
        return;
    }
    var f = function f() {
        return x.length;
    };
}
function f5() {
    var x = getStringOrNumber();
    if (typeof x === "string") {
        var f = function() {
            return function() {
                return x.length;
            };
        };
    }
}
