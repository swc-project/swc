function sloppy(a) {
    return (arguments[0] = 1), [
        a,
        arguments[0]
    ];
}
function strict(a) {
    "use strict";
    return (arguments[0] = 1), [
        a,
        arguments[0]
    ];
}
function strictThis() {
    "use strict";
    return this;
}
console.log(sloppy(0).join());
console.log(strict(0).join());
console.log(typeof strictThis());
