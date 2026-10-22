function sloppy(a) {
    arguments[0] = 1;
    return [a, arguments[0]];
}

function strict(a) {
    "use strict";
    arguments[0] = 1;
    return [a, arguments[0]];
}

function strictThis() {
    "use strict";
    return this;
}

console.log(sloppy(0).join());
console.log(strict(0).join());
console.log(typeof strictThis());
