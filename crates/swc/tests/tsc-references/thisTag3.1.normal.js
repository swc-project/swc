//// [/a.js]
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
/**
 * @typedef {{fn(a: string): void}} T
 */ var C = function C() {
    "use strict";
    var _this = this;
    _class_call_check(this, C);
    /**
     * @this {T}
     * @param {string} a
     */ this.p = function(a) {
        return _this.fn("" + a);
    };
};
