function strict() {
    "another directive";
    "use strict";
    return this;
}

var calls = [];
function ordinary() {
    calls.push(1);
    calls.push(2);
    return calls.length;
}

console.log(typeof strict());
console.log(ordinary(), calls.join());
