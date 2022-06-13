import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
// @noEmit: true
// @allowJs: true
// @checkJs: true
// @target: esnext
// @Filename: a.js
var my = my !== null && my !== void 0 ? my : {};
/** @param {number} n */ my.method = function(n) {
    return n + 1;
};
my.number = 1;
my.object = {};
var _predicate;
my.predicate = (_predicate = my.predicate) !== null && _predicate !== void 0 ? _predicate : {};
my.predicate.query = function() {
    var me = this;
    me.property = false;
};
var q = new my.predicate.query();
my.predicate.query.another = function() {
    return 1;
};
my.predicate.query.result = "none";
var _sort;
/** @param {number} first
 *  @param {number} second
 */ my.predicate.sort = (_sort = my.predicate.sort) !== null && _sort !== void 0 ? _sort : function(first, second) {
    return first > second ? first : second;
};
my.predicate.type = /*#__PURE__*/ function() {
    "use strict";
    function _class() {
        _class_call_check(this, _class);
    }
    var _proto = _class.prototype;
    _proto.m = function m() {
        return 101;
    };
    return _class;
}();
var _min;
// global-ish prefixes
var min = (_min = window.min) !== null && _min !== void 0 ? _min : {};
var _nest;
min.nest = (_nest = this.min.nest) !== null && _nest !== void 0 ? _nest : function() {};
var _other;
min.nest.other = (_other = self.min.nest.other) !== null && _other !== void 0 ? _other : function _class() {
    "use strict";
    _class_call_check(this, _class);
};
var _property;
min.property = (_property = global.min.property) !== null && _property !== void 0 ? _property : {};
