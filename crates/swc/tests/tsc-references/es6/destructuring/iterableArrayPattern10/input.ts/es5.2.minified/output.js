function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) throw new TypeError("Cannot call a class as a function");
}
function _defineProperties(target, props) {
    for(var i = 0; i < props.length; i++){
        var descriptor = props[i];
        descriptor.enumerable = descriptor.enumerable || !1, descriptor.configurable = !0, "value" in descriptor && (descriptor.writable = !0), Object.defineProperty(target, descriptor.key, descriptor);
    }
}
function _getPrototypeOf(o) {
    return _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) {
        return o.__proto__ || Object.getPrototypeOf(o);
    }, _getPrototypeOf(o);
}
function _setPrototypeOf(o, p) {
    return _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) {
        return o.__proto__ = p, o;
    }, _setPrototypeOf(o, p);
}
var Bar1 = function() {
    "use strict";
    _classCallCheck(this, Bar1);
}, Foo = function(Bar) {
    "use strict";
    function Foo() {
        var self, call, obj;
        return _classCallCheck(this, Foo), self = this, call = _getPrototypeOf(Foo).apply(this, arguments), call && ("object" == ((obj = call) && "undefined" != typeof Symbol && obj.constructor === Symbol ? "symbol" : typeof obj) || "function" == typeof call) ? call : (function(self) {
            if (void 0 === self) throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
            return self;
        })(self);
    }
    return !function(subClass, superClass) {
        if ("function" != typeof superClass && null !== superClass) throw new TypeError("Super expression must either be null or a function");
        subClass.prototype = Object.create(superClass && superClass.prototype, {
            constructor: {
                value: subClass,
                writable: !0,
                configurable: !0
            }
        }), superClass && _setPrototypeOf(subClass, superClass);
    }(Foo, Bar), Foo;
}(Bar1), tmp = Symbol.iterator, FooIterator = function() {
    "use strict";
    var Constructor, protoProps, staticProps;
    function FooIterator() {
        _classCallCheck(this, FooIterator);
    }
    return Constructor = FooIterator, protoProps = [
        {
            key: "next",
            value: function() {
                return {
                    value: new Foo,
                    done: !1
                };
            }
        },
        {
            key: tmp,
            value: function() {
                return this;
            }
        }
    ], _defineProperties(Constructor.prototype, protoProps), staticProps && _defineProperties(Constructor, staticProps), FooIterator;
}();
!function(param) {
    var arr, i, _param = (i = 2, function(arr) {
        if (Array.isArray(arr)) return arr;
    }(arr = param) || function(arr, i) {
        var _arr = [], _n = !0, _d = !1, _e = void 0;
        try {
            for(var _s, _i = arr[Symbol.iterator](); !(_n = (_s = _i.next()).done) && (_arr.push(_s.value), !i || _arr.length !== i); _n = !0);
        } catch (err) {
            _d = !0, _e = err;
        } finally{
            try {
                _n || null == _i.return || _i.return();
            } finally{
                if (_d) throw _e;
            }
        }
        return _arr;
    }(arr, i) || function() {
        throw new TypeError("Invalid attempt to destructure non-iterable instance");
    }());
    _param[0], _param[1];
}(new FooIterator);
