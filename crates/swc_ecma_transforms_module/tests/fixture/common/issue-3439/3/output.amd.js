define([
    "require",
    "exports"
], function(require, exports) {
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
        bar: ()=>bar,
        bar2: ()=>bar,
        default: ()=>bar,
        foo: ()=>foo,
        foo1: ()=>foo
    });
    const foo = 1;
    let bar = 2;
    bar = 3;
});
