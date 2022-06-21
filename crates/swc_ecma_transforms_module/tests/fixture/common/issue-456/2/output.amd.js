define([
    "require",
    "exports",
    "path"
], function(require, exports, _path) {
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
        foo: ()=>foo
    });
    const foo = function() {
        var e = 1;
        return A(e, {}), e;
    }();
});
