import * as swcHelpers from "@swc/helpers";
var Entry = function() {
    "use strict";
    function Entry() {
        swcHelpers.classCallCheck(this, Entry), this.c = 1;
    }
    return Entry.prototype.isInit = function(x) {
        return !0;
    }, Entry;
}(), Group = function() {
    "use strict";
    function Group() {
        swcHelpers.classCallCheck(this, Group), this.d = 'no';
    }
    return Group.prototype.isInit = function(x) {
        return !1;
    }, Group;
}();
