define([
    "require",
    "exports",
    "something"
], function(require, exports, _something) {
    "use strict";
    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    Object.defineProperty(exports, "fn", {
        enumerable: true,
        get: ()=>fn
    });
    const fn = ({ a =new _something.Foo()  })=>a;
});
