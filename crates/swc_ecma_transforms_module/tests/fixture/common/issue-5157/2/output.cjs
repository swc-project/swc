"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "foo", {
    enumerable: true,
    get: ()=>foo
});
const foo = {
    get [void 0] () {
        return this;
    },
    set [void 0] (v = this.y){
        this.x = v;
    }
};
