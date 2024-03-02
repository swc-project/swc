//// [jsDeclarationsTypedefAndLatebound.ts]
// from #53967, based on webpack/webpack#16957
//// [index.js]
var LazySet = require("./LazySet");
/** @type {LazySet} */ var stringSet = undefined;
stringSet.addAll(stringSet);
//// [LazySet.js]
// Comment out this JSDoc, and note that the errors index.js go away.
/**
 * @typedef {Object} SomeObject
 */ import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
var LazySet = /*#__PURE__*/ function() {
    "use strict";
    function LazySet() {
        _class_call_check(this, LazySet);
    }
    var _proto = LazySet.prototype;
    /**
     * @param {LazySet} iterable
     */ _proto.addAll = function addAll(iterable) {};
    _proto[Symbol.iterator] = function() {};
    return LazySet;
}();
module.exports = LazySet;
