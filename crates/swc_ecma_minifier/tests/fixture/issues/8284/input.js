(function (global, factory) {
    typeof exports === "object" && typeof module !== "undefined"
        ? factory(exports)
        : typeof define === "function" && define.amd
        ? define(["exports"], factory)
        : ((global =
              typeof globalThis !== "undefined" ? globalThis : global || self),
          factory((global.Sentry = {})));
})(this, function (exports) {
    "use strict";
    function isGlobalObj(obj) {
        return obj && obj.Math == Math ? obj : undefined;
    }
    const GLOBAL_OBJ =
        (typeof globalThis == "object" && isGlobalObj(globalThis)) ||
        // eslint-disable-next-line no-restricted-globals
        isGlobalObj(globalThis) ||
        (typeof self == "object" && isGlobalObj(self)) ||
        (typeof global == "object" && isGlobalObj(global)) ||
        (function () {
            return this;
        })() ||
        {};
    function getGlobalObject() {
        return GLOBAL_OBJ;
    }
    const WINDOW$6 = getGlobalObject();
    function supportsFetch() {
        if (!("fetch" in WINDOW$6)) {
            return false;
        }
        return true;
    }

    console.log(supportsFetch());
});
