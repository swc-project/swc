function strictArguments(value, unaffected) {
    "use strict";
    value = 2;
    return arguments[0] + unaffected;
}
function missingArguments(value) {
    value = 2;
    return arguments[0];
}
function mappedArguments(value, unaffected) {
    value = 2;
    return arguments[0] + unaffected;
}
function readOnlyArguments(value) {
    return value;
}
console.log(strictArguments(1, 3), missingArguments(), mappedArguments(1, 3), readOnlyArguments(1));
