function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) throw new TypeError("Cannot call a class as a function");
}
function _defineProperties(target, props) {
    for(var i = 0; i < props.length; i++){
        var descriptor = props[i];
        descriptor.enumerable = descriptor.enumerable || !1, descriptor.configurable = !0, "value" in descriptor && (descriptor.writable = !0), Object.defineProperty(target, descriptor.key, descriptor);
    }
}
var _predicate, _sort, _min, _nest, _other, _property, my = null != my ? my : {
};
my.method = function(n) {
    return n + 1;
}, my.number = 1, my.object = {
}, my.predicate = null !== (_predicate = my.predicate) && void 0 !== _predicate ? _predicate : {
}, my.predicate.query = function() {
    var me = this;
    me.property = !1;
}, new my.predicate.query(), my.predicate.query.another = function() {
    return 1;
}, my.predicate.query.result = "none", my.predicate.sort = null !== (_sort = my.predicate.sort) && void 0 !== _sort ? _sort : function(first, second) {
    return first > second ? first : second;
}, my.predicate.type = (function() {
    "use strict";
    var Constructor, protoProps, staticProps;
    function _class() {
        _classCallCheck(this, _class);
    }
    return protoProps = [
        {
            key: "m",
            value: function() {
                return 101;
            }
        }
    ], _defineProperties((Constructor = _class).prototype, protoProps), staticProps && _defineProperties(Constructor, staticProps), _class;
})();
var min = null !== (_min = window.min) && void 0 !== _min ? _min : {
};
min.nest = null !== (_nest = this.min.nest) && void 0 !== _nest ? _nest : function() {
}, min.nest.other = null !== (_other = self.min.nest.other) && void 0 !== _other ? _other : function _class() {
    "use strict";
    _classCallCheck(this, _class);
}, min.property = null !== (_property = global.min.property) && void 0 !== _property ? _property : {
};
