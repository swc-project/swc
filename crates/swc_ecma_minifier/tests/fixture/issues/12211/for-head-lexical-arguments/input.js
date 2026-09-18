function forStatement(value, ...rest) {
    value = "changed";
    for (let arguments = ["for"]; arguments.length; arguments.pop()) {
        return eval("arguments[0]");
    }
}

function forIn(value, ...rest) {
    value = "changed";
    for (let arguments in { in: true }) {
        return eval("arguments");
    }
}

function forOf(value, ...rest) {
    value = "changed";
    for (const arguments of ["of"]) {
        return eval("arguments");
    }
}

console.log(forStatement("original"), forIn("original"), forOf("original"));
