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
let o = {
    a: 1,
    b: 'no'
};
/// private propagates
class PrivateOptionalX {
}
class PublicX {
}
let o2 = _objectSpread({
}, publicX, privateOptionalX);
let sn = o2.x; // error, x is private
let allOptional = _objectSpread({
}, optionalString, optionalNumber);
let spread = _objectSpread({
}, {
    b: true
}, {
    s: "foo"
});
spread = {
    s: "foo"
}; // error, missing 'b'
let b = {
    b: false
};
spread = b; // error, missing 's'
// literal repeats are not allowed, but spread repeats are fine
let duplicated = _objectSpread({
    b: 'bad'
}, o, {
    b: 'bad'
}, o2, {
    b: 'bad'
});
let duplicatedSpread = _objectSpread({
}, o, o);
// Note: ignore changes the order that properties are printed
let ignore = _objectSpread({
    b: 'ignored'
}, o);
let o3 = {
    a: 1,
    b: 'no'
};
let o4 = {
    b: 'yes',
    c: true
};
let combinedBefore = _objectSpread({
    b: 'ok'
}, o3, o4);
let combinedMid = _objectSpread({
}, o3, {
    b: 'ok'
}, o4);
let combinedNested = _objectSpread({
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
let changeTypeBefore = _objectSpread({
    a: 'wrong type?'
}, o3);
let computedMiddle = _objectSpread({
}, o3, {
    ['in the middle']: 13,
    b: 'maybe?'
}, o4);
// primitives are not allowed, except for falsy ones
let spreadNum = _objectSpread({
}, 12);
let spreadSum = _objectSpread({
}, 1 + 1);
let spreadZero = _objectSpread({
}, 0);
spreadZero.toFixed(); // error, no methods even from a falsy number
let spreadBool = _objectSpread({
}, true);
spreadBool.valueOf();
let spreadStr = _objectSpread({
}, 'foo');
spreadStr.length; // error, no 'length'
spreadStr.charAt(1); // error, no methods either
// functions are skipped
let spreadFunc = _objectSpread({
}, function() {
});
spreadFunc(); // error, no call signature
// write-only properties get skipped
let setterOnly = _objectSpread({
}, {
    set b (bad){
    }
});
setterOnly.b = 12; // error, 'b' does not exist
// methods are skipped because they aren't enumerable
class C {
    m() {
    }
    constructor(){
        this.p = 1;
    }
}
let c = new C();
let spreadC = _objectSpread({
}, c);
spreadC.m(); // error 'm' is not in '{ ... c }'
// non primitive
let obj1 = {
    a: 123
};
let spreadObj = _objectSpread({
}, obj1);
spreadObj.a; // error 'a' is not in {}
