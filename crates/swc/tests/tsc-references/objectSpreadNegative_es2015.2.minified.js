import * as swcHelpers from "@swc/helpers";
let o = {
    a: 1,
    b: 'no'
}, o2 = swcHelpers.objectSpread({}, publicX, privateOptionalX);
o2.x, swcHelpers.objectSpread({}, optionalString, optionalNumber), swcHelpers.objectSpread({}, {
    b: !0
}, {
    s: "foo"
}), swcHelpers.objectSpread({
    b: 'bad'
}, o, {
    b: 'bad'
}, o2, {
    b: 'bad'
}), swcHelpers.objectSpread({}, o, o), swcHelpers.objectSpread({
    b: 'ignored'
}, o);
let o3 = {
    a: 1,
    b: 'no'
}, o4 = {
    b: 'yes',
    c: !0
};
swcHelpers.objectSpread({
    b: 'ok'
}, o3, o4), swcHelpers.objectSpread({}, o3, {
    b: 'ok'
}, o4), swcHelpers.objectSpread({}, swcHelpers.objectSpread({
    a: 4
}, {
    b: !1,
    c: 'overriden'
}), {
    d: 'actually new'
}, {
    a: 5,
    d: 'maybe new'
}), swcHelpers.objectSpread({
    a: 'wrong type?'
}, o3), swcHelpers.objectSpread({}, o3, {
    'in the middle': 13,
    b: 'maybe?'
}, o4), swcHelpers.objectSpread({}, 12), swcHelpers.objectSpread({}, 2), swcHelpers.objectSpread({}, 0).toFixed(), swcHelpers.objectSpread({}, !0).valueOf();
let spreadStr = swcHelpers.objectSpread({}, 'foo');
spreadStr.length, spreadStr.charAt(1), swcHelpers.objectSpread({}, function() {})(), swcHelpers.objectSpread({}, {
    set b (bad){}
}).b = 12;
let c = new class {
    m() {}
    constructor(){
        this.p = 1;
    }
}();
swcHelpers.objectSpread({}, c).m(), swcHelpers.objectSpread({}, {
    a: 123
}).a;
