function _defineProperties(target, props) {
    for(var i = 0; i < props.length; i++){
        var descriptor = props[i];
        descriptor.enumerable = descriptor.enumerable || !1, descriptor.configurable = !0, "value" in descriptor && (descriptor.writable = !0), Object.defineProperty(target, descriptor.key, descriptor);
    }
}
var _bar, C = (_bar = new WeakSet(), function() {
    "use strict";
    var Constructor, protoProps, staticProps;
    function _class() {
        var obj, privateSet;
        (function(instance, Constructor) {
            if (!(instance instanceof Constructor)) throw new TypeError("Cannot call a class as a function");
        })(this, _class), obj = this, (function(obj, privateCollection) {
            if (privateCollection.has(obj)) throw new TypeError("Cannot initialize the same private elements twice on an object");
        })(obj, privateSet = _bar), privateSet.add(obj);
    }
    return Constructor = _class, protoProps = [
        {
            key: "foo",
            value: function() {
                var receiver, privateMap, value, descriptor;
                receiver = this, privateMap = _bar, value = console.log("should log this then throw"), descriptor = (function(receiver, privateMap, action) {
                    if (!privateMap.has(receiver)) throw new TypeError("attempted to set private field on non-instance");
                    return privateMap.get(receiver);
                })(receiver, privateMap, "set"), (function(receiver, descriptor, value) {
                    if (descriptor.set) descriptor.set.call(receiver, value);
                    else {
                        if (!descriptor.writable) throw new TypeError("attempted to set read only private field");
                        descriptor.value = value;
                    }
                })(receiver, descriptor, value);
            }
        }
    ], _defineProperties(Constructor.prototype, protoProps), staticProps && _defineProperties(Constructor, staticProps), _class;
}());
console.log(new C().foo());
