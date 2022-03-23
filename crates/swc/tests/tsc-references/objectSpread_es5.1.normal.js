import * as swcHelpers from "@swc/helpers";
// @strictNullChecks: true
// @target: es5
var o = {
    a: 1,
    b: "no"
};
var o2 = {
    b: "yes",
    c: true
};
var swap = {
    a: "yes",
    b: -1
};
var addAfter = swcHelpers.objectSpread({}, o, {
    c: false
});
var addBefore = swcHelpers.objectSpread({
    c: false
}, o);
var override = swcHelpers.objectSpread({}, o, {
    b: "override"
});
var nested = swcHelpers.objectSpread({}, swcHelpers.objectSpread({
    a: 3
}, {
    b: false,
    c: "overriden"
}), {
    c: "whatever"
});
var combined = swcHelpers.objectSpread({}, o, o2);
var combinedAfter = swcHelpers.objectSpread({}, o, o2, {
    b: "ok"
});
var combinedNestedChangeType = swcHelpers.objectSpread({}, swcHelpers.objectSpread({
    a: 1
}, {
    b: false,
    c: "overriden"
}), {
    c: -1
});
var propertyNested = {
    a: swcHelpers.objectSpread({}, o)
};
// accessors don't copy the descriptor
// (which means that readonly getters become read/write properties)
var op = {
    get a () {
        return 6;
    }
};
var getter = swcHelpers.objectSpread({}, op, {
    c: 7
});
getter.a = 12;
// functions result in { }
var spreadFunc = swcHelpers.objectSpread({}, function() {});
function from16326(header, authToken) {
    return swcHelpers.objectSpread({}, this.header, header, authToken && {
        authToken: authToken
    });
}
// boolean && T results in Partial<T>
function conditionalSpreadBoolean(b) {
    var o1 = {
        x: 12,
        y: 13
    };
    o1 = swcHelpers.objectSpread({}, o1, b && {
        x: 14
    });
    var o2 = swcHelpers.objectSpread({}, b && {
        x: 21
    });
    return o1;
}
function conditionalSpreadNumber(nt) {
    var o3 = {
        x: 15,
        y: 16
    };
    o3 = swcHelpers.objectSpread({}, o3, nt && {
        x: nt
    });
    var o2 = swcHelpers.objectSpread({}, nt && {
        x: nt
    });
    return o3;
}
function conditionalSpreadString(st) {
    var o4 = {
        x: "hi",
        y: 17
    };
    o4 = swcHelpers.objectSpread({}, o4, st && {
        x: st
    });
    var o2 = swcHelpers.objectSpread({}, st && {
        x: st
    });
    return o4;
}
// any results in any
var anything;
var spreadAny = swcHelpers.objectSpread({}, anything);
// methods are not enumerable
var C = /*#__PURE__*/ function() {
    "use strict";
    function C() {
        swcHelpers.classCallCheck(this, C);
        this.p = 1;
    }
    var _proto = C.prototype;
    _proto.m = function m() {};
    return C;
}();
var c = new C();
var spreadC = swcHelpers.objectSpread({}, c);
// own methods are enumerable
var cplus = swcHelpers.objectSpread({}, c, {
    plus: function plus() {
        return this.p + 1;
    }
});
cplus.plus();
// new field's type conflicting with existing field is OK
var changeTypeAfter = swcHelpers.objectSpread({}, o, {
    a: "wrong type?"
});
var changeTypeBoth = swcHelpers.objectSpread({}, o, swap);
// optional
function container(definiteBoolean, definiteString, optionalString, optionalNumber) {
    var optionalUnionStops = swcHelpers.objectSpread({}, definiteBoolean, definiteString, optionalNumber);
    var optionalUnionDuplicates = swcHelpers.objectSpread({}, definiteBoolean, definiteString, optionalString, optionalNumber);
    var allOptional = swcHelpers.objectSpread({}, optionalString, optionalNumber);
    // computed property
    var computedFirst = swcHelpers.objectSpread(swcHelpers.defineProperty({}, "before everything", 12), o, {
        b: "yes"
    });
    var computedAfter = swcHelpers.objectSpread({}, o, swcHelpers.defineProperty({
        b: "yeah"
    }, "at the end", 14));
}
// shortcut syntax
var a = 12;
var shortCutted = swcHelpers.objectSpread({}, o, {
    a: a
});
// non primitive
var spreadNonPrimitive = swcHelpers.objectSpread({}, {});
// generic spreads
function f(t, u) {
    return swcHelpers.objectSpread({}, t, u, {
        id: "id"
    });
}
var exclusive = f({
    a: 1,
    b: "yes"
}, {
    c: "no",
    d: false
});
var overlap = f({
    a: 1
}, {
    a: 2,
    b: "extra"
});
var overlapConflict = f({
    a: 1
}, {
    a: "mismatch"
});
var overwriteId = f({
    a: 1,
    id: true
}, {
    c: 1,
    d: "no"
});
function genericSpread(t, u, v, w, obj) {
    var x01 = swcHelpers.objectSpread({}, t);
    var x02 = swcHelpers.objectSpread({}, t, t);
    var x03 = swcHelpers.objectSpread({}, t, u);
    var x04 = swcHelpers.objectSpread({}, u, t);
    var x05 = swcHelpers.objectSpread({
        a: 5,
        b: "hi"
    }, t);
    var x06 = swcHelpers.objectSpread({}, t, {
        a: 5,
        b: "hi"
    });
    var x07 = swcHelpers.objectSpread({
        a: 5,
        b: "hi"
    }, t, {
        c: true
    }, obj);
    var x09 = swcHelpers.objectSpread({
        a: 5
    }, t, {
        b: "hi",
        c: true
    }, obj);
    var x10 = swcHelpers.objectSpread({
        a: 5
    }, t, {
        b: "hi"
    }, u, obj);
    var x11 = swcHelpers.objectSpread({}, v);
    var x12 = swcHelpers.objectSpread({}, v, obj);
    var x13 = swcHelpers.objectSpread({}, w);
    var x14 = swcHelpers.objectSpread({}, w, obj);
    var x15 = swcHelpers.objectSpread({}, t, v);
    var x16 = swcHelpers.objectSpread({}, t, w);
    var x17 = swcHelpers.objectSpread({}, t, w, obj);
    var x18 = swcHelpers.objectSpread({}, t, v, w);
}
