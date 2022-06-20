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
    a: ()=>a
});
let a = 1;
a = 2;
use(a = 3);
({ a =4  } = {});
