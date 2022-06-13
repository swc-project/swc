import _object_spread from "@swc/helpers/src/_object_spread.mjs";
import _object_spread_props from "@swc/helpers/src/_object_spread_props.mjs";
let o = {
    a: 1,
    b: 'no'
}, o2 = {
    b: 'yes',
    c: !0
};
_object_spread_props(_object_spread({}, o), {
    c: !1
}), _object_spread({
    c: !1
}, o), _object_spread_props(_object_spread({}, o), {
    b: 'override'
}), _object_spread_props(_object_spread({}, _object_spread({
    a: 3
}, {
    b: !1,
    c: 'overriden'
})), {
    c: 'whatever'
}), _object_spread({}, o, o2), _object_spread_props(_object_spread({}, o, o2), {
    b: 'ok'
}), _object_spread_props(_object_spread({}, _object_spread({
    a: 1
}, {
    b: !1,
    c: 'overriden'
})), {
    c: -1
}), _object_spread({}, o), _object_spread_props(_object_spread({}, {
    get a () {
        return 6;
    }
}), {
    c: 7
}).a = 12, _object_spread({}, function() {}), _object_spread({}, void 0);
let c = new class {
    m() {}
    constructor(){
        this.p = 1;
    }
}();
function f(t, u) {
    return _object_spread_props(_object_spread({}, t, u), {
        id: 'id'
    });
}
_object_spread({}, c), _object_spread_props(_object_spread({}, c), {
    plus () {
        return this.p + 1;
    }
}).plus(), _object_spread_props(_object_spread({}, o), {
    a: 'wrong type?'
}), _object_spread({}, o, {
    a: 'yes',
    b: -1
}), _object_spread_props(_object_spread({}, o), {
    a: 12
}), _object_spread({}, {}), f({
    a: 1,
    b: 'yes'
}, {
    c: 'no',
    d: !1
}), f({
    a: 1
}, {
    a: 2,
    b: 'extra'
}), f({
    a: 1
}, {
    a: 'mismatch'
}), f({
    a: 1,
    id: !0
}, {
    c: 1,
    d: 'no'
});
