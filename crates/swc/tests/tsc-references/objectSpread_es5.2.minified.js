import * as swcHelpers from "@swc/helpers";
var anything, o = {
    a: 1,
    b: "no"
}, o2 = {
    b: "yes",
    c: !0
};
swcHelpers.objectSpread({}, o, {
    c: !1
}), swcHelpers.objectSpread({
    c: !1
}, o), swcHelpers.objectSpread({}, o, {
    b: "override"
}), swcHelpers.objectSpread({}, swcHelpers.objectSpread({
    a: 3
}, {
    b: !1,
    c: "overriden"
}), {
    c: "whatever"
}), swcHelpers.objectSpread({}, o, o2), swcHelpers.objectSpread({}, o, o2, {
    b: "ok"
}), swcHelpers.objectSpread({}, swcHelpers.objectSpread({
    a: 1
}, {
    b: !1,
    c: "overriden"
}), {
    c: -1
}), swcHelpers.objectSpread({}, o);
var op = {
    get a () {
        return 6;
    }
};
swcHelpers.objectSpread({}, op, {
    c: 7
}).a = 12, swcHelpers.objectSpread({}, function() {}), swcHelpers.objectSpread({}, anything);
var C = function() {
    function C() {
        swcHelpers.classCallCheck(this, C), this.p = 1;
    }
    return C.prototype.m = function() {}, C;
}(), c = new C();
function f(t, u) {
    return swcHelpers.objectSpread({}, t, u, {
        id: "id"
    });
}
swcHelpers.objectSpread({}, c), swcHelpers.objectSpread({}, c, {
    plus: function() {
        return this.p + 1;
    }
}).plus(), swcHelpers.objectSpread({}, o, {
    a: "wrong type?"
}), swcHelpers.objectSpread({}, o, {
    a: "yes",
    b: -1
}), swcHelpers.objectSpread({}, o, {
    a: 12
}), swcHelpers.objectSpread({}, {}), f({
    a: 1,
    b: "yes"
}, {
    c: "no",
    d: !1
}), f({
    a: 1
}, {
    a: 2,
    b: "extra"
}), f({
    a: 1
}, {
    a: "mismatch"
}), f({
    a: 1,
    id: !0
}, {
    c: 1,
    d: "no"
});
