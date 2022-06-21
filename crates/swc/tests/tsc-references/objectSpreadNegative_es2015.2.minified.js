import _object_spread from "@swc/helpers/src/_object_spread.mjs";
import _object_spread_props from "@swc/helpers/src/_object_spread_props.mjs";
let o = {
    a: 1,
    b: 'no'
}, o2 = _object_spread({}, publicX, privateOptionalX);
o2.x, _object_spread({}, optionalString, optionalNumber), _object_spread({}, {
    b: !0
}, {
    s: "foo"
}), _object_spread_props(_object_spread(_object_spread_props(_object_spread({
    b: 'bad'
}, o), {
    b: 'bad'
}), o2), {
    b: 'bad'
}), _object_spread({}, o, o), _object_spread({
    b: 'ignored'
}, o);
let o3 = {
    a: 1,
    b: 'no'
}, o4 = {
    b: 'yes',
    c: !0
};
_object_spread({
    b: 'ok'
}, o3, o4), _object_spread(_object_spread_props(_object_spread({}, o3), {
    b: 'ok'
}), o4), _object_spread(_object_spread_props(_object_spread({}, _object_spread({
    a: 4
}, {
    b: !1,
    c: 'overriden'
})), {
    d: 'actually new'
}), {
    a: 5,
    d: 'maybe new'
}), _object_spread({
    a: 'wrong type?'
}, o3), _object_spread(_object_spread_props(_object_spread({}, o3), {
    'in the middle': 13,
    b: 'maybe?'
}), o4), _object_spread({}, 12), _object_spread({}, 2), _object_spread({}, 0).toFixed(), _object_spread({}, !0).valueOf();
let spreadStr = _object_spread({}, 'foo');
spreadStr.length, spreadStr.charAt(1), _object_spread({}, function() {})(), _object_spread({}, {
    set b (bad){}
}).b = 12, _object_spread({}, new class {
    m() {}
    constructor(){
        this.p = 1;
    }
}()).m(), _object_spread({}, {
    a: 123
}).a;
