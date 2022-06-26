import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
var _predicate, _sort, _min, _nest, _other, _property, my = null != my ? my : {};
my.method = function(n) {
    return n + 1;
}, my.number = 1, my.object = {}, my.predicate = null !== (_predicate = my.predicate) && void 0 !== _predicate ? _predicate : {}, my.predicate.query = function() {
    var me = this;
    me.property = !1;
}, new my.predicate.query(), my.predicate.query.another = function() {
    return 1;
}, my.predicate.query.result = "none", my.predicate.sort = null !== (_sort = my.predicate.sort) && void 0 !== _sort ? _sort : function(first, second) {
    return first > second ? first : second;
}, my.predicate.type = function() {
    "use strict";
    function _class() {
        _class_call_check(this, _class);
    }
    return _class.prototype.m = function() {
        return 101;
    }, _class;
}();
var min = null !== (_min = window.min) && void 0 !== _min ? _min : {};
min.nest = null !== (_nest = this.min.nest) && void 0 !== _nest ? _nest : function() {}, min.nest.other = null !== (_other = self.min.nest.other) && void 0 !== _other ? _other : function _class() {
    "use strict";
    _class_call_check(this, _class);
}, min.property = null !== (_property = global.min.property) && void 0 !== _property ? _property : {};
