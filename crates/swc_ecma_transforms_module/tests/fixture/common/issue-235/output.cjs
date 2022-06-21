"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "fn", {
    get: ()=>fn,
    enumerable: true
});
const _something = require("something");
const fn = ({ a =new _something.Foo()  })=>a;
