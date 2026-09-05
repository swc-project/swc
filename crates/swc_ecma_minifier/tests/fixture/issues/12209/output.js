function strictArguments(value) {
    "use strict";
    value = 2;
    return arguments[0];
}
function missingArguments(value) {
    value = 2;
    return arguments[0];
}
function readOnlyArguments(value) {
    return value;
}
console.log(strictArguments(1), missingArguments(), readOnlyArguments(1));
