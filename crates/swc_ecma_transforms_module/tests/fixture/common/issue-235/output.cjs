"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "fn", {
    enumerable: true,
    get: function() {
        return fn;
    }
});
const _something = require("something");
const fn = ({ a =new _something.Foo()  })=>a;
