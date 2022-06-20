"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
function __export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        get: all[name],
        enumerable: true
    });
}
__export(exports, {
    a: function() {
        return a;
    },
    b: function() {
        return b;
    }
});
let a, b;
console.log([a, b] = [
    1,
    2
]);
