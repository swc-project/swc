"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "a", {
    get: ()=>a,
    enumerable: true
});
let a = 1;
a = 2;
use(a = 3);
({ a =4  } = {});
