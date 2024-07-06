var global1, factory;
global1 = this, factory = function(exports1) {
    function isGlobalObj(obj) {
        return obj && obj.Math == Math ? obj : void 0;
    }
    "use strict";
    console.log("fetch" in ("object" == typeof globalThis && isGlobalObj(globalThis) || // eslint-disable-next-line no-restricted-globals
    isGlobalObj(globalThis) || "object" == typeof self && isGlobalObj(self) || "object" == typeof global && isGlobalObj(global) || function() {
        return this;
    }() || {}));
}, "object" == typeof exports && "undefined" != typeof module ? factory(exports) : "function" == typeof define && define.amd ? define([
    "exports"
], factory) : factory((global1 = "undefined" != typeof globalThis ? globalThis : global1 || self).Sentry = {});
