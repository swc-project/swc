//// [objectSpread.ts]
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
import { _ as _define_property } from "@swc/helpers/_/_define_property";
import { _ as _object_spread } from "@swc/helpers/_/_object_spread";
import { _ as _object_spread_props } from "@swc/helpers/_/_object_spread_props";
var o = {
    a: 1,
    b: 'no'
};
var o2 = {
    b: 'yes',
    c: true
};
var swap = {
    a: 'yes',
    b: -1
};
var addAfter = _object_spread_props(_object_spread({}, o), {
    c: false
});
var addBefore = _object_spread({
    c: false
}, o);
var override = _object_spread_props(_object_spread({}, o), {
    b: 'override'
});
var nested = _object_spread_props(_object_spread({}, _object_spread({
    a: 3
}, {
    b: false,
    c: 'overriden'
})), {
    c: 'whatever'
});
var combined = _object_spread({}, o, o2);
var combinedAfter = _object_spread_props(_object_spread({}, o, o2), {
    b: 'ok'
});
var combinedNestedChangeType = _object_spread_props(_object_spread({}, _object_spread({
    a: 1
}, {
    b: false,
    c: 'overriden'
})), {
    c: -1
});
var propertyNested = {
    a: _object_spread({}, o)
};
// accessors don't copy the descriptor
// (which means that readonly getters become read/write properties)
var op = {
    get a () {
        return 6;
    }
};
var getter = _object_spread_props(_object_spread({}, op), {
    c: 7
});
getter.a = 12;
// functions result in { }
var spreadFunc = _object_spread({}, function() {});
function from16326(header, authToken) {
    return _object_spread({}, this.header, header, authToken && {
        authToken: authToken
    });
}
// boolean && T results in Partial<T>
function conditionalSpreadBoolean(b) {
    var o = {
        x: 12,
        y: 13
    };
    o = _object_spread({}, o, b && {
        x: 14
    });
    var o2 = _object_spread({}, b && {
        x: 21
    });
    return o;
}
function conditionalSpreadNumber(nt) {
    var o = {
        x: 15,
        y: 16
    };
    o = _object_spread({}, o, nt && {
        x: nt
    });
    var o2 = _object_spread({}, nt && {
        x: nt
    });
    return o;
}
function conditionalSpreadString(st) {
    var o = {
        x: 'hi',
        y: 17
    };
    o = _object_spread({}, o, st && {
        x: st
    });
    var o2 = _object_spread({}, st && {
        x: st
    });
    return o;
}
// any results in any
var anything;
var spreadAny = _object_spread({}, anything);
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
var spreadC = _object_spread({}, c);
// own methods are enumerable
var cplus = _object_spread_props(_object_spread({}, c), {
    plus: function plus() {
        return this.p + 1;
    }
});
cplus.plus();
// new field's type conflicting with existing field is OK
var changeTypeAfter = _object_spread_props(_object_spread({}, o), {
    a: 'wrong type?'
});
var changeTypeBoth = _object_spread({}, o, swap);
// optional
function container(definiteBoolean, definiteString, optionalString, optionalNumber) {
    var optionalUnionStops = _object_spread({}, definiteBoolean, definiteString, optionalNumber);
    var optionalUnionDuplicates = _object_spread({}, definiteBoolean, definiteString, optionalString, optionalNumber);
    var allOptional = _object_spread({}, optionalString, optionalNumber);
    // computed property
    var computedFirst = _object_spread_props(_object_spread(_define_property({}, 'before everything', 12), o), {
        b: 'yes'
    });
    var computedAfter = _object_spread_props(_object_spread({}, o), _define_property({
        b: 'yeah'
    }, 'at the end', 14));
}
// shortcut syntax
var a = 12;
var shortCutted = _object_spread_props(_object_spread({}, o), {
    a: a
});
// non primitive
var spreadNonPrimitive = _object_spread({}, {});
// generic spreads
function f(t, u) {
    return _object_spread_props(_object_spread({}, t, u), {
        id: 'id'
    });
}
var exclusive = f({
    a: 1,
    b: 'yes'
}, {
    c: 'no',
    d: false
});
var overlap = f({
    a: 1
}, {
    a: 2,
    b: 'extra'
});
var overlapConflict = f({
    a: 1
}, {
    a: 'mismatch'
});
var overwriteId = f({
    a: 1,
    id: true
}, {
    c: 1,
    d: 'no'
});
function genericSpread(t, u, v, w, obj) {
    var x01 = _object_spread({}, t);
    var x02 = _object_spread({}, t, t);
    var x03 = _object_spread({}, t, u);
    var x04 = _object_spread({}, u, t);
    var x05 = _object_spread({
        a: 5,
        b: 'hi'
    }, t);
    var x06 = _object_spread_props(_object_spread({}, t), {
        a: 5,
        b: 'hi'
    });
    var x07 = _object_spread(_object_spread_props(_object_spread({
        a: 5,
        b: 'hi'
    }, t), {
        c: true
    }), obj);
    var x09 = _object_spread(_object_spread_props(_object_spread({
        a: 5
    }, t), {
        b: 'hi',
        c: true
    }), obj);
    var x10 = _object_spread(_object_spread_props(_object_spread({
        a: 5
    }, t), {
        b: 'hi'
    }), u, obj);
    var x11 = _object_spread({}, v);
    var x12 = _object_spread({}, v, obj);
    var x13 = _object_spread({}, w);
    var x14 = _object_spread({}, w, obj);
    var x15 = _object_spread({}, t, v);
    var x16 = _object_spread({}, t, w);
    var x17 = _object_spread({}, t, w, obj);
    var x18 = _object_spread({}, t, v, w);
}
