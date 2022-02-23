function _checkPrivateRedeclaration(obj, privateCollection) {
    if (privateCollection.has(obj)) {
        throw new TypeError("Cannot initialize the same private elements twice on an object");
    }
}
function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
    }
}
function _classPrivateFieldSet(receiver, privateMap, value) {
    if (!privateMap.has(receiver)) {
        throw new TypeError("attempted to set private field on non-instance");
    }
    var descriptor = privateMap.get(receiver);
    if (!descriptor.writable) {
        throw new TypeError("attempted to set read only private field");
    }
    descriptor.value = value;
    return value;
}
function _classPrivateMethodInit(obj, privateSet) {
    _checkPrivateRedeclaration(obj, privateSet);
    privateSet.add(obj);
}
function _defineProperties(target, props) {
    for(var i = 0; i < props.length; i++){
        var descriptor = props[i];
        descriptor.enumerable = descriptor.enumerable || false;
        descriptor.configurable = true;
        if ("value" in descriptor) descriptor.writable = true;
        Object.defineProperty(target, descriptor.key, descriptor);
    }
}
function _createClass(Constructor, protoProps, staticProps) {
    if (protoProps) _defineProperties(Constructor.prototype, protoProps);
    if (staticProps) _defineProperties(Constructor, staticProps);
    return Constructor;
}
// @target: es2015
var C = function() {
    var bar = function bar() {};
    var _bar = new WeakSet();
    var _class = /*#__PURE__*/ function() {
        "use strict";
        function _class() {
            _classCallCheck(this, _class);
            _classPrivateMethodInit(this, _bar);
        }
        _createClass(_class, [
            {
                key: "foo",
                value: function foo() {
                    _classPrivateFieldSet(this, _bar, console.log("should log this then throw"));
                }
            }
        ]);
        return _class;
    }();
    return _class;
}();
console.log(new C().foo());
