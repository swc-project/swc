function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
    }
}
function _classPrivateFieldGet(receiver, privateMap) {
    if (!privateMap.has(receiver)) {
        throw new TypeError("attempted to get private field on non-instance");
    }
    return privateMap.get(receiver).value;
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
var Test = // @target: es2015
/*#__PURE__*/ function() {
    "use strict";
    function Test() {
        _classCallCheck(this, Test);
        _y.set(this, {
            writable: true,
            value: 123
        });
    }
    _createClass(Test, null, [
        {
            key: "something",
            value: function something(obj) {
                var _s;
                _classPrivateFieldSet(obj[(new (function() {
                    var _class = function _class() {
                        _classCallCheck(this, _class);
                        _x.set(this, {
                            writable: true,
                            value: 1
                        });
                        this.s = "prop";
                    };
                    var _x = new WeakMap();
                    return _class;
                }())).s], _y, 1);
                _classPrivateFieldSet(_s = obj[(new (function() {
                    var _class = function _class() {
                        _classCallCheck(this, _class);
                        _x.set(this, {
                            writable: true,
                            value: 1
                        });
                        this.s = "prop";
                    };
                    var _x = new WeakMap();
                    return _class;
                }())).s], _y, _classPrivateFieldGet(_s, _y) + 1);
            }
        }
    ]);
    return Test;
}();
var _y = new WeakMap();
