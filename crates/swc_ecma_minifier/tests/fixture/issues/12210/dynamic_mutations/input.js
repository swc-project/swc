function remove(a, key) {
    delete arguments[key];
    return arguments[0];
}
function increment(a, key) {
    "use strict";
    arguments[key]++;
    return arguments[0];
}
console.log(remove(1, 0));
console.log(increment(1, "0"));
