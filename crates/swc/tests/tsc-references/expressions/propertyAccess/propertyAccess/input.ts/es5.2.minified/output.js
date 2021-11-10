function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) throw new TypeError("Cannot call a class as a function");
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
var Compass, bothIndex, stringOrNumber, someObject, Compass1, A1 = function() {
    "use strict";
    _classCallCheck(this, A1);
}, B = function(A) {
    "use strict";
    !function(subClass, superClass) {
        if ("function" != typeof superClass && null !== superClass) throw new TypeError("Super expression must either be null or a function");
        subClass.prototype = Object.create(superClass && superClass.prototype, {
            constructor: {
                value: subClass,
                writable: !0,
                configurable: !0
            }
        }), superClass && _setPrototypeOf(subClass, superClass);
    }(B, A);
    var _super = function(Derived) {
        var hasNativeReflectConstruct = function() {
            if ("undefined" == typeof Reflect || !Reflect.construct) return !1;
            if (Reflect.construct.sham) return !1;
            if ("function" == typeof Proxy) return !0;
            try {
                return Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function() {
                })), !0;
            } catch (e) {
                return !1;
            }
        }();
        return function() {
            var obj, self, call, result, Super = _getPrototypeOf(Derived);
            if (hasNativeReflectConstruct) {
                var NewTarget = _getPrototypeOf(this).constructor;
                result = Reflect.construct(Super, arguments, NewTarget);
            } else result = Super.apply(this, arguments);
            return self = this, (call = result) && ("object" == ((obj = call) && "undefined" != typeof Symbol && obj.constructor === Symbol ? "symbol" : typeof obj) || "function" == typeof call) ? call : (function(self) {
                if (void 0 === self) throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
                return self;
            })(self);
        };
    }(B);
    function B() {
        return _classCallCheck(this, B), _super.apply(this, arguments);
    }
    return B;
}(A1);
(Compass1 = Compass || (Compass = {
}))[Compass1.North = 0] = "North", Compass1[Compass1.South = 1] = "South", Compass1[Compass1.East = 2] = "East", Compass1[Compass1.West = 3] = "West";
var numIndex = {
    3: "three",
    three: "three"
}, strIndex = {
    N: Compass.North,
    E: Compass.East
};
function noIndex() {
}
var obj1 = {
    10: "ten",
    x: "hello",
    y: 32,
    z: {
        n: "world",
        m: 15,
        o: function() {
            return !1;
        }
    },
    "literal property": 100
}, anyVar = {
};
obj1.y = 4, anyVar.x = anyVar.y = obj1.x = anyVar.z, obj1.x, obj1.hasOwnProperty, obj1.qqq, obj1["literal property"], obj1["wa wa wa wa wa"], obj1["10"], obj1["1"], numIndex[3], numIndex[Compass.South], numIndex[anyVar], numIndex.what, numIndex[someObject], strIndex.N, strIndex.zzz, strIndex[10], strIndex[Compass.East], strIndex[null], noIndex[123], noIndex[Compass.South], noIndex[null], noIndex[someObject], noIndex[32], bothIndex[Compass.East], bothIndex[null], bothIndex.foo, bothIndex["1.0"], bothIndex[someObject], numIndex[stringOrNumber], strIndex[stringOrNumber], bothIndex[stringOrNumber];
