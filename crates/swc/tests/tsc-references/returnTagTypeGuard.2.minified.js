//// [bug25127.js]
import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
!function() {
    "use strict";
    function Entry() {
        _class_call_check(this, Entry), this.c = 1;
    }
    return Entry.prototype.isInit = function(x) {
        return !0;
    }, Entry;
}();
