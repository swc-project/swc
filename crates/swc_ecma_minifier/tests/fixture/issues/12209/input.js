function strictArguments(value, unaffected) {
    "use strict";
    value = 2;
    return arguments[0] + arguments[1];
}

function missingArguments(value) {
    value = 2;
    return arguments[0];
}

function mappedArguments(value, unaffected) {
    value = 2;
    return arguments[0] + arguments[1];
}

function readOnlyArguments(value) {
    return arguments[0];
}

console.log(
    strictArguments(1, 3),
    missingArguments(),
    mappedArguments(1, 3),
    readOnlyArguments(1),
);
