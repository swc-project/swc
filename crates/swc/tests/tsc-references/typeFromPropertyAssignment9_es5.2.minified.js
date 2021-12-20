function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) throw new TypeError("Cannot call a class as a function");
}
function _defineProperties(target, props) {
    for(var i = 0; i < props.length; i++){
        var descriptor = props[i];
        descriptor.enumerable = descriptor.enumerable || !1, descriptor.configurable = !0, "value" in descriptor && (descriptor.writable = !0), Object.defineProperty(target, descriptor.key, descriptor);
    }
}
var my = my || {
};
my.method = function(n) {
    return n + 1;
}, my.number = 1, my.object = {
}, my.predicate = my.predicate || {
}, my.predicate.query = function() {
    var me = this;
    me.property = !1;
}, new my.predicate.query(), my.predicate.query.another = function() {
    return 1;
}, my.predicate.query.result = "none", my.predicate.sort = my.predicate.sort || function(first, second) {
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
var min = window.min || {
};
min.nest = this.min.nest || function() {
}, min.nest.other = self.min.nest.other || function _class() {
    "use strict";
    _classCallCheck(this, _class);
}, min.property = global.min.property || {
};
