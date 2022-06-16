define([
    "require",
    "exports",
    "something"
], function(require, exports, _something) {
    "use strict";
    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    _export(exports, {
        fn: function() {
            return fn;
        }
    });
    const fn = ({ a =new _something.Foo()  })=>a;
});
