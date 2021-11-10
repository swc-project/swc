function _assertThisInitialized(self) {
    if (self === void 0) {
        throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
    }
    return self;
}
function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
    }
}
function _getPrototypeOf(o) {
    _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) {
        return o.__proto__ || Object.getPrototypeOf(o);
    };
    return _getPrototypeOf(o);
}
function _inherits(subClass, superClass) {
    if (typeof superClass !== "function" && superClass !== null) {
        throw new TypeError("Super expression must either be null or a function");
    }
    subClass.prototype = Object.create(superClass && superClass.prototype, {
        constructor: {
            value: subClass,
            writable: true,
            configurable: true
        }
    });
    if (superClass) _setPrototypeOf(subClass, superClass);
}
function _possibleConstructorReturn(self, call) {
    if (call && (_typeof(call) === "object" || typeof call === "function")) {
        return call;
    }
    return _assertThisInitialized(self);
}
function _setPrototypeOf(o, p) {
    _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) {
        o.__proto__ = p;
        return o;
    };
    return _setPrototypeOf(o, p);
}
var _typeof = function(obj) {
    return obj && typeof Symbol !== "undefined" && obj.constructor === Symbol ? "symbol" : typeof obj;
};
function _isNativeReflectConstruct() {
    if (typeof Reflect === "undefined" || !Reflect.construct) return false;
    if (Reflect.construct.sham) return false;
    if (typeof Proxy === "function") return true;
    try {
        Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function() {
        }));
        return true;
    } catch (e) {
        return false;
    }
}
function _createSuper(Derived) {
    var hasNativeReflectConstruct = _isNativeReflectConstruct();
    return function _createSuperInternal() {
        var Super = _getPrototypeOf(Derived), result;
        if (hasNativeReflectConstruct) {
            var NewTarget = _getPrototypeOf(this).constructor;
            result = Reflect.construct(Super, arguments, NewTarget);
        } else {
            result = Super.apply(this, arguments);
        }
        return _possibleConstructorReturn(this, result);
    };
}
var A = function A() {
    "use strict";
    _classCallCheck(this, A);
};
var B = /*#__PURE__*/ function(A) {
    "use strict";
    _inherits(B, A);
    var _super = _createSuper(B);
    function B() {
        _classCallCheck(this, B);
        return _super.apply(this, arguments);
    }
    return B;
}(A);
var Compass1;
(function(Compass) {
    Compass[Compass["North"] = 0] = "North";
    Compass[Compass["South"] = 1] = "South";
    Compass[Compass["East"] = 2] = "East";
    Compass[Compass["West"] = 3] = "West";
})(Compass1 || (Compass1 = {
}));
var numIndex = {
    3: 'three',
    'three': 'three'
};
var strIndex = {
    'N': Compass1.North,
    'E': Compass1.East
};
var bothIndex;
function noIndex() {
}
var obj1 = {
    10: 'ten',
    x: 'hello',
    y: 32,
    z: {
        n: 'world',
        m: 15,
        o: function() {
            return false;
        }
    },
    'literal property': 100
};
var anyVar = {
};
var stringOrNumber;
var someObject;
// Assign to a property access
obj1.y = 4;
// Property access on value of type 'any'
anyVar.x = anyVar.y = obj1.x = anyVar.z;
// Dotted property access of property that exists
var aa = obj1.x;
// Dotted property access of property that exists on value's apparent type
var bb = obj1.hasOwnProperty;
// Dotted property access of property that doesn't exist on value's apparent type
var cc = obj1.qqq; // error
// Bracket notation property access using string literal value on type with property of that literal name
var dd = obj1['literal property'];
var dd;
// Bracket notation property access using string literal value on type without property of that literal name
var ee = obj1['wa wa wa wa wa'];
var ee;
// Bracket notation property access using numeric string literal value on type with property of that literal name
var ff = obj1['10'];
var ff;
// Bracket notation property access using numeric string literal value on type without property of that literal name
var gg = obj1['1'];
var gg;
// Bracket notation property access using numeric value on type with numeric index signature
var hh = numIndex[3];
var hh;
// Bracket notation property access using enum value on type with numeric index signature
var ii = numIndex[Compass1.South];
var ii;
// Bracket notation property access using value of type 'any' on type with numeric index signature
var jj = numIndex[anyVar];
var jj;
// Bracket notation property access using string value on type with numeric index signature
var kk = numIndex['what'];
var kk;
// Bracket notation property access using value of other type on type with numeric index signature and no string index signature
var ll = numIndex[someObject]; // Error
// Bracket notation property access using string value on type with string index signature and no numeric index signature
var mm = strIndex['N'];
var mm;
var mm2 = strIndex['zzz'];
var mm2;
// Bracket notation property access using numeric value on type with string index signature and no numeric index signature
var nn = strIndex[10];
var nn;
// Bracket notation property access using enum value on type with string index signature and no numeric index signature
var oo = strIndex[Compass1.East];
var oo;
// Bracket notation property access using value of type 'any' on type with string index signature and no numeric index signature
var pp = strIndex[null];
var pp;
// Bracket notation property access using numeric value on type with no index signatures
var qq = noIndex[123];
var qq;
// Bracket notation property access using string value on type with no index signatures
var rr = noIndex['zzzz'];
var rr;
// Bracket notation property access using enum value on type with no index signatures
var ss = noIndex[Compass1.South];
var ss;
// Bracket notation property access using value of type 'any' on type with no index signatures
var tt = noIndex[null];
var tt;
// Bracket notation property access using values of other types on type with no index signatures
var uu = noIndex[someObject]; // Error
// Bracket notation property access using numeric value on type with numeric index signature and string index signature
var vv = noIndex[32];
var vv;
// Bracket notation property access using enum value on type with numeric index signature and string index signature
var ww = bothIndex[Compass1.East];
var ww;
// Bracket notation property access using value of type 'any' on type with numeric index signature and string index signature
var xx = bothIndex[null];
var xx;
// Bracket notation property access using string value on type with numeric index signature and string index signature
var yy = bothIndex['foo'];
var yy;
// Bracket notation property access using numeric string value on type with numeric index signature and string index signature
var zz = bothIndex['1.0'];
var zz;
// Bracket notation property access using value of other type on type with numeric index signature and no string index signature and string index signature
var zzzz = bothIndex[someObject]; // Error
var x1 = numIndex[stringOrNumber];
var x1;
var x2 = strIndex[stringOrNumber];
var x2;
var x3 = bothIndex[stringOrNumber];
var x3;
