function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) throw new TypeError("Cannot call a class as a function");
}
function _defineProperties(target, props) {
    for(var i = 0; i < props.length; i++){
        var descriptor = props[i];
        descriptor.enumerable = descriptor.enumerable || !1, descriptor.configurable = !0, "value" in descriptor && (descriptor.writable = !0), Object.defineProperty(target, descriptor.key, descriptor);
    }
}
function _createClass(Constructor, protoProps, staticProps) {
    return protoProps && _defineProperties(Constructor.prototype, protoProps), staticProps && _defineProperties(Constructor, staticProps), Constructor;
}
var Entry = function() {
    "use strict";
    function Entry() {
        _classCallCheck(this, Entry), this.c = 1;
    }
    return _createClass(Entry, [
        {
            key: "isInit",
            value: function(x) {
                return !0;
            }
        }
    ]), Entry;
}(), Group = function() {
    "use strict";
    function Group() {
        _classCallCheck(this, Group), this.d = "no";
    }
    return _createClass(Group, [
        {
            key: "isInit",
            value: function(x) {
                return !1;
            }
        }
    ]), Group;
}();
