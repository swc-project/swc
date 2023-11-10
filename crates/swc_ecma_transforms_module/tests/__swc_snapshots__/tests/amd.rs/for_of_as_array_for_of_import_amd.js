define([
    "require",
    "exports",
    "foo"
], function(require, exports, _foo) {
    "use strict";
    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    for(let _i = 0; _i < _foo.array.length; _i++){
        const elm = _foo.array[_i];
        console.log(elm);
    }
});
