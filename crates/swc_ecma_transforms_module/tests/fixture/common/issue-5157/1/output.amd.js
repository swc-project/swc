define([
    "require",
    "exports"
], function(require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    Object.defineProperty(exports, "foo", {
        enumerable: true,
        get: ()=>foo
    });
    const foo = {
        get prop1 () {
            return 1;
        },
        get prop2 () {
            return this.prop1 + 1;
        },
        set prop3 (v){
            this.x = v;
        },
        method () {
            return this.prop1;
        }
    };
});
