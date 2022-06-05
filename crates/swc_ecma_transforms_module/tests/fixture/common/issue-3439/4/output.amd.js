define(["require", "exports"], function (require, _exports) {
    "use strict";
    Object.defineProperty(_exports, "__esModule", {
        value: true,
    });
    __export(_exports, {
        bar: function () {
            return foo;
        },
        default: function () {
            return foo;
        },
    });
    foo = 1;
    function foo() {}
    foo = 2;
});
