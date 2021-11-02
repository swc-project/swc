function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
    }
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
function _defineProperty(obj, key, value) {
    if (key in obj) {
        Object.defineProperty(obj, key, {
            value: value,
            enumerable: true,
            configurable: true,
            writable: true
        });
    } else {
        obj[key] = value;
    }
    return obj;
}
function _objectSpread(target) {
    for(var i = 1; i < arguments.length; i++){
        var source = arguments[i] != null ? arguments[i] : {
        };
        var ownKeys = Object.keys(source);
        if (typeof Object.getOwnPropertySymbols === "function") {
            ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function(sym) {
                return Object.getOwnPropertyDescriptor(source, sym).enumerable;
            }));
        }
        ownKeys.forEach(function(key) {
            _defineProperty(target, key, source[key]);
        });
    }
    return target;
}
// @target: es5
// @strictNullChecks: true
var o = {
    a: 1,
    b: 'no'
};
var PrivateOptionalX = function PrivateOptionalX() {
    "use strict";
    _classCallCheck(this, PrivateOptionalX);
};
var PublicX = function PublicX() {
    "use strict";
    _classCallCheck(this, PublicX);
};
var o2 = _objectSpread({
}, publicX, privateOptionalX);
var sn = o2.x; // error, x is private
var allOptional = _objectSpread({
}, optionalString, optionalNumber);
var spread = _objectSpread({
}, {
    b: true
}, {
    s: "foo"
});
spread = {
    s: "foo"
}; // error, missing 'b'
var b = {
    b: false
};
spread = b; // error, missing 's'
// literal repeats are not allowed, but spread repeats are fine
var duplicated = _objectSpread({
    b: 'bad'
}, o, {
    b: 'bad'
}, o2, {
    b: 'bad'
});
var duplicatedSpread = _objectSpread({
}, o, o);
// Note: ignore changes the order that properties are printed
var ignore = _objectSpread({
    b: 'ignored'
}, o);
var o3 = {
    a: 1,
    b: 'no'
};
var o4 = {
    b: 'yes',
    c: true
};
var combinedBefore = _objectSpread({
    b: 'ok'
}, o3, o4);
var combinedMid = _objectSpread({
}, o3, {
    b: 'ok'
}, o4);
var combinedNested = _objectSpread({
}, _objectSpread({
    a: 4
}, {
    b: false,
    c: 'overriden'
}), {
    d: 'actually new'
}, {
    a: 5,
    d: 'maybe new'
});
var changeTypeBefore = _objectSpread({
    a: 'wrong type?'
}, o3);
var _obj;
var computedMiddle = _objectSpread({
}, o3, (_obj = {
}, _defineProperty(_obj, 'in the middle', 13), _defineProperty(_obj, "b", 'maybe?'), _obj), o4);
// primitives are not allowed, except for falsy ones
var spreadNum = _objectSpread({
}, 12);
var spreadSum = _objectSpread({
}, 1 + 1);
var spreadZero = _objectSpread({
}, 0);
spreadZero.toFixed(); // error, no methods even from a falsy number
var spreadBool = _objectSpread({
}, true);
spreadBool.valueOf();
var spreadStr = _objectSpread({
}, 'foo');
spreadStr.length; // error, no 'length'
spreadStr.charAt(1); // error, no methods either
// functions are skipped
var spreadFunc = _objectSpread({
}, function() {
});
spreadFunc(); // error, no call signature
// write-only properties get skipped
var setterOnly = _objectSpread({
}, {
    set b (bad){
    }
});
setterOnly.b = 12; // error, 'b' does not exist
var C = // methods are skipped because they aren't enumerable
/*#__PURE__*/ function() {
    "use strict";
    function C() {
        _classCallCheck(this, C);
        this.p = 1;
    }
    _createClass(C, [
        {
            key: "m",
            value: function m() {
            }
        }
    ]);
    return C;
}();
var c = new C();
var spreadC = _objectSpread({
}, c);
spreadC.m(); // error 'm' is not in '{ ... c }'
// non primitive
var obj1 = {
    a: 123
};
var spreadObj = _objectSpread({
}, obj1);
spreadObj.a; // error 'a' is not in {}
