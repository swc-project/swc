define([
    "require",
    "exports"
], function(require, _exports) {
    "use strict";
    Object.defineProperty(_exports, "__esModule", {
        value: true
    });
    _export(_exports, {
        a: function() {
            return a;
        }
    });
    let a = 1;
    a = 2;
    use(a = 3);
    ({ a =4  } = {});
});
