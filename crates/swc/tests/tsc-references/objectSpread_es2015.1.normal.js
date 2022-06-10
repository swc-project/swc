import _object_spread from "@swc/helpers/lib/_object_spread.js";
import _object_spread_props from "@swc/helpers/lib/_object_spread_props.js";
// @strictNullChecks: true
// @target: es5
let o = {
    a: 1,
    b: 'no'
};
let o2 = {
    b: 'yes',
    c: true
};
let swap = {
    a: 'yes',
    b: -1
};
let addAfter = _object_spread_props(_object_spread({}, o), {
    c: false
});
let addBefore = _object_spread({
    c: false
}, o);
let override = _object_spread_props(_object_spread({}, o), {
    b: 'override'
});
let nested = _object_spread_props(_object_spread({}, _object_spread({
    a: 3
}, {
    b: false,
    c: 'overriden'
})), {
    c: 'whatever'
});
let combined = _object_spread({}, o, o2);
let combinedAfter = _object_spread_props(_object_spread({}, o, o2), {
    b: 'ok'
});
let combinedNestedChangeType = _object_spread_props(_object_spread({}, _object_spread({
    a: 1
}, {
    b: false,
    c: 'overriden'
})), {
    c: -1
});
let propertyNested = {
    a: _object_spread({}, o)
};
// accessors don't copy the descriptor
// (which means that readonly getters become read/write properties)
let op = {
    get a () {
        return 6;
    }
};
let getter = _object_spread_props(_object_spread({}, op), {
    c: 7
});
getter.a = 12;
// functions result in { }
let spreadFunc = _object_spread({}, function() {});
function from16326(header, authToken) {
    return _object_spread({}, this.header, header, authToken && {
        authToken
    });
}
// boolean && T results in Partial<T>
function conditionalSpreadBoolean(b) {
    let o1 = {
        x: 12,
        y: 13
    };
    o1 = _object_spread({}, o1, b && {
        x: 14
    });
    let o2 = _object_spread({}, b && {
        x: 21
    });
    return o1;
}
function conditionalSpreadNumber(nt) {
    let o3 = {
        x: 15,
        y: 16
    };
    o3 = _object_spread({}, o3, nt && {
        x: nt
    });
    let o2 = _object_spread({}, nt && {
        x: nt
    });
    return o3;
}
function conditionalSpreadString(st) {
    let o4 = {
        x: 'hi',
        y: 17
    };
    o4 = _object_spread({}, o4, st && {
        x: st
    });
    let o2 = _object_spread({}, st && {
        x: st
    });
    return o4;
}
// any results in any
let anything;
let spreadAny = _object_spread({}, anything);
// methods are not enumerable
class C {
    m() {}
    constructor(){
        this.p = 1;
    }
}
let c = new C();
let spreadC = _object_spread({}, c);
// own methods are enumerable
let cplus = _object_spread_props(_object_spread({}, c), {
    plus () {
        return this.p + 1;
    }
});
cplus.plus();
// new field's type conflicting with existing field is OK
let changeTypeAfter = _object_spread_props(_object_spread({}, o), {
    a: 'wrong type?'
});
let changeTypeBoth = _object_spread({}, o, swap);
// optional
function container(definiteBoolean, definiteString, optionalString, optionalNumber) {
    let optionalUnionStops = _object_spread({}, definiteBoolean, definiteString, optionalNumber);
    let optionalUnionDuplicates = _object_spread({}, definiteBoolean, definiteString, optionalString, optionalNumber);
    let allOptional = _object_spread({}, optionalString, optionalNumber);
    // computed property
    let computedFirst = _object_spread_props(_object_spread({
        ['before everything']: 12
    }, o), {
        b: 'yes'
    });
    let computedAfter = _object_spread_props(_object_spread({}, o), {
        b: 'yeah',
        ['at the end']: 14
    });
}
// shortcut syntax
let a = 12;
let shortCutted = _object_spread_props(_object_spread({}, o), {
    a
});
// non primitive
let spreadNonPrimitive = _object_spread({}, {});
// generic spreads
function f(t, u) {
    return _object_spread_props(_object_spread({}, t, u), {
        id: 'id'
    });
}
let exclusive = f({
    a: 1,
    b: 'yes'
}, {
    c: 'no',
    d: false
});
let overlap = f({
    a: 1
}, {
    a: 2,
    b: 'extra'
});
let overlapConflict = f({
    a: 1
}, {
    a: 'mismatch'
});
let overwriteId = f({
    a: 1,
    id: true
}, {
    c: 1,
    d: 'no'
});
function genericSpread(t, u, v, w, obj) {
    let x01 = _object_spread({}, t);
    let x02 = _object_spread({}, t, t);
    let x03 = _object_spread({}, t, u);
    let x04 = _object_spread({}, u, t);
    let x05 = _object_spread({
        a: 5,
        b: 'hi'
    }, t);
    let x06 = _object_spread_props(_object_spread({}, t), {
        a: 5,
        b: 'hi'
    });
    let x07 = _object_spread(_object_spread_props(_object_spread({
        a: 5,
        b: 'hi'
    }, t), {
        c: true
    }), obj);
    let x09 = _object_spread(_object_spread_props(_object_spread({
        a: 5
    }, t), {
        b: 'hi',
        c: true
    }), obj);
    let x10 = _object_spread(_object_spread_props(_object_spread({
        a: 5
    }, t), {
        b: 'hi'
    }), u, obj);
    let x11 = _object_spread({}, v);
    let x12 = _object_spread({}, v, obj);
    let x13 = _object_spread({}, w);
    let x14 = _object_spread({}, w, obj);
    let x15 = _object_spread({}, t, v);
    let x16 = _object_spread({}, t, w);
    let x17 = _object_spread({}, t, w, obj);
    let x18 = _object_spread({}, t, v, w);
}
