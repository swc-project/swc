"use strict";
class x {}
const y = x;
const z = class {};
console.log(typeof x);
console.log(typeof y);
console.log(typeof z);
console.log(typeof class {});
