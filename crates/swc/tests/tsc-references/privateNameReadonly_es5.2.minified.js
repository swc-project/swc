function _defineProperties(target, props) {
    for(var i = 0; i < props.length; i++){
        var descriptor = props[i];
        descriptor.enumerable = descriptor.enumerable || !1, descriptor.configurable = !0, "value" in descriptor && (descriptor.writable = !0), Object.defineProperty(target, descriptor.key, descriptor);
    }
}
var C = function() {
    var _bar = new WeakSet(), _class = function() {
        "use strict";
        var Constructor, protoProps, staticProps;
        function _class() {
            var obj, privateSet;
            !function(instance, Constructor) {
                if (!(instance instanceof Constructor)) throw new TypeError("Cannot call a class as a function");
            }(this, _class), obj = this, (function(obj, privateCollection) {
                if (privateCollection.has(obj)) throw new TypeError("Cannot initialize the same private elements twice on an object");
            })(obj, privateSet = _bar), privateSet.add(obj);
        }
        return Constructor = _class, protoProps = [
            {
                key: "foo",
                value: function() {
                    !function(receiver, privateMap, value) {
                        if (!privateMap.has(receiver)) throw new TypeError("attempted to set private field on non-instance");
                        var descriptor = privateMap.get(receiver);
                        if (!descriptor.writable) throw new TypeError("attempted to set read only private field");
                        return descriptor.value = value, value;
                    }(this, _bar, console.log("should log this then throw"));
                }
            }
        ], _defineProperties(Constructor.prototype, protoProps), staticProps && _defineProperties(Constructor, staticProps), _class;
    }();
    return _class;
}();
console.log(new C().foo());
