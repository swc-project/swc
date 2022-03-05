import * as swcHelpers from "@swc/helpers";
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
let o2 = swcHelpers.objectSpread({}, publicX, privateOptionalX);
let sn = o2.x; // error, x is private
let allOptional = swcHelpers.objectSpread({}, optionalString, optionalNumber);
let spread = swcHelpers.objectSpread({}, {
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
let duplicated = swcHelpers.objectSpread({
    b: 'bad'
}, o, {
    b: 'bad'
}, o2, {
    b: 'bad'
});
let duplicatedSpread = swcHelpers.objectSpread({}, o, o);
// Note: ignore changes the order that properties are printed
let ignore = swcHelpers.objectSpread({
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
let combinedBefore = swcHelpers.objectSpread({
    b: 'ok'
}, o3, o4);
let combinedMid = swcHelpers.objectSpread({}, o3, {
    b: 'ok'
}, o4);
let combinedNested = swcHelpers.objectSpread({}, swcHelpers.objectSpread({
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
let changeTypeBefore = swcHelpers.objectSpread({
    a: 'wrong type?'
}, o3);
let computedMiddle = swcHelpers.objectSpread({}, o3, {
    ['in the middle']: 13,
    b: 'maybe?'
}, o4);
// primitives are not allowed, except for falsy ones
let spreadNum = swcHelpers.objectSpread({}, 12);
let spreadSum = swcHelpers.objectSpread({}, 1 + 1);
let spreadZero = swcHelpers.objectSpread({}, 0);
spreadZero.toFixed(); // error, no methods even from a falsy number
let spreadBool = swcHelpers.objectSpread({}, true);
spreadBool.valueOf();
let spreadStr = swcHelpers.objectSpread({}, 'foo');
spreadStr.length; // error, no 'length'
spreadStr.charAt(1); // error, no methods either
// functions are skipped
let spreadFunc = swcHelpers.objectSpread({}, function() {});
spreadFunc(); // error, no call signature
// write-only properties get skipped
let setterOnly = swcHelpers.objectSpread({}, {
    set b (bad){}
});
setterOnly.b = 12; // error, 'b' does not exist
// methods are skipped because they aren't enumerable
class C {
    m() {}
    constructor(){
        this.p = 1;
    }
}
let c = new C();
let spreadC = swcHelpers.objectSpread({}, c);
spreadC.m(); // error 'm' is not in '{ ... c }'
// non primitive
let obj = {
    a: 123
};
let spreadObj = swcHelpers.objectSpread({}, obj);
spreadObj.a; // error 'a' is not in {}
