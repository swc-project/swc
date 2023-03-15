//// [objectSpread.ts]
import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
import _define_property from "@swc/helpers/src/_define_property.mjs";
import _extends from "@swc/helpers/src/_extends.mjs";
import _object_spread_props from "@swc/helpers/src/_object_spread_props.mjs";
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
var addAfter = _object_spread_props(_extends({}, o), {
    c: false
});
var addBefore = _extends({
    c: false
}, o);
var override = _object_spread_props(_extends({}, o), {
    b: "override"
});
var nested = _object_spread_props(_extends({}, _extends({
    a: 3
}, {
    b: false,
    c: "overriden"
})), {
    c: "whatever"
});
var combined = _extends({}, o, o2);
var combinedAfter = _object_spread_props(_extends({}, o, o2), {
    b: "ok"
});
var combinedNestedChangeType = _object_spread_props(_extends({}, _extends({
    a: 1
}, {
    b: false,
    c: "overriden"
})), {
    c: -1
});
var propertyNested = {
    a: _extends({}, o)
};
// accessors don't copy the descriptor
// (which means that readonly getters become read/write properties)
var op = {
    get a () {
        return 6;
    }
};
var getter = _object_spread_props(_extends({}, op), {
    c: 7
});
getter.a = 12;
// functions result in { }
var spreadFunc = _extends({}, function() {});
function from16326(header, authToken) {
    return _extends({}, this.header, header, authToken && {
        authToken: authToken
    });
}
// boolean && T results in Partial<T>
function conditionalSpreadBoolean(b) {
    var o = {
        x: 12,
        y: 13
    };
    o = _extends({}, o, b && {
        x: 14
    });
    var o2 = _extends({}, b && {
        x: 21
    });
    return o;
}
function conditionalSpreadNumber(nt) {
    var o = {
        x: 15,
        y: 16
    };
    o = _extends({}, o, nt && {
        x: nt
    });
    var o2 = _extends({}, nt && {
        x: nt
    });
    return o;
}
function conditionalSpreadString(st) {
    var o = {
        x: "hi",
        y: 17
    };
    o = _extends({}, o, st && {
        x: st
    });
    var o2 = _extends({}, st && {
        x: st
    });
    return o;
}
// any results in any
var anything;
var spreadAny = _extends({}, anything);
// methods are not enumerable
var C = /*#__PURE__*/ function() {
    "use strict";
    function C() {
        _class_call_check(this, C);
        this.p = 1;
    }
    var _proto = C.prototype;
    _proto.m = function m() {};
    return C;
}();
var c = new C();
var spreadC = _extends({}, c);
// own methods are enumerable
var cplus = _object_spread_props(_extends({}, c), {
    plus: function plus() {
        return this.p + 1;
    }
});
cplus.plus();
// new field's type conflicting with existing field is OK
var changeTypeAfter = _object_spread_props(_extends({}, o), {
    a: "wrong type?"
});
var changeTypeBoth = _extends({}, o, swap);
// optional
function container(definiteBoolean, definiteString, optionalString, optionalNumber) {
    var optionalUnionStops = _extends({}, definiteBoolean, definiteString, optionalNumber);
    var optionalUnionDuplicates = _extends({}, definiteBoolean, definiteString, optionalString, optionalNumber);
    var allOptional = _extends({}, optionalString, optionalNumber);
    // computed property
    var computedFirst = _object_spread_props(_extends(_define_property({}, "before everything", 12), o), {
        b: "yes"
    });
    var computedAfter = _object_spread_props(_extends({}, o), _define_property({
        b: "yeah"
    }, "at the end", 14));
}
// shortcut syntax
var a = 12;
var shortCutted = _object_spread_props(_extends({}, o), {
    a: a
});
// non primitive
var spreadNonPrimitive = _extends({}, {});
// generic spreads
function f(t, u) {
    return _object_spread_props(_extends({}, t, u), {
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
    var x01 = _extends({}, t);
    var x02 = _extends({}, t, t);
    var x03 = _extends({}, t, u);
    var x04 = _extends({}, u, t);
    var x05 = _extends({
        a: 5,
        b: "hi"
    }, t);
    var x06 = _object_spread_props(_extends({}, t), {
        a: 5,
        b: "hi"
    });
    var x07 = _extends(_object_spread_props(_extends({
        a: 5,
        b: "hi"
    }, t), {
        c: true
    }), obj);
    var x09 = _extends(_object_spread_props(_extends({
        a: 5
    }, t), {
        b: "hi",
        c: true
    }), obj);
    var x10 = _extends(_object_spread_props(_extends({
        a: 5
    }, t), {
        b: "hi"
    }), u, obj);
    var x11 = _extends({}, v);
    var x12 = _extends({}, v, obj);
    var x13 = _extends({}, w);
    var x14 = _extends({}, w, obj);
    var x15 = _extends({}, t, v);
    var x16 = _extends({}, t, w);
    var x17 = _extends({}, t, w, obj);
    var x18 = _extends({}, t, v, w);
}
