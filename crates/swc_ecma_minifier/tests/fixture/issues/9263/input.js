"use strict";
const k = (function () {
    var x = 42;
    for (var x in [4242]) break;
    return x;
})();


export { k };