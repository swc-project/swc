import * as swcHelpers from "@swc/helpers";
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
let addAfter = swcHelpers.objectSpread({}, o, {
    c: false
});
let addBefore = swcHelpers.objectSpread({
    c: false
}, o);
let override = swcHelpers.objectSpread({}, o, {
    b: 'override'
});
let nested = swcHelpers.objectSpread({}, swcHelpers.objectSpread({
    a: 3
}, {
    b: false,
    c: 'overriden'
}), {
    c: 'whatever'
});
let combined = swcHelpers.objectSpread({}, o, o2);
let combinedAfter = swcHelpers.objectSpread({}, o, o2, {
    b: 'ok'
});
let combinedNestedChangeType = swcHelpers.objectSpread({}, swcHelpers.objectSpread({
    a: 1
}, {
    b: false,
    c: 'overriden'
}), {
    c: -1
});
let propertyNested = {
    a: swcHelpers.objectSpread({}, o)
};
// accessors don't copy the descriptor
// (which means that readonly getters become read/write properties)
let op = {
    get a () {
        return 6;
    }
};
let getter = swcHelpers.objectSpread({}, op, {
    c: 7
});
getter.a = 12;
// functions result in { }
let spreadFunc = swcHelpers.objectSpread({}, function() {});
function from16326(header, authToken) {
    return swcHelpers.objectSpread({}, this.header, header, authToken && {
        authToken
    });
}
// boolean && T results in Partial<T>
function conditionalSpreadBoolean(b) {
    let o1 = {
        x: 12,
        y: 13
    };
    o1 = swcHelpers.objectSpread({}, o1, b && {
        x: 14
    });
    let o2 = swcHelpers.objectSpread({}, b && {
        x: 21
    });
    return o1;
}
function conditionalSpreadNumber(nt) {
    let o3 = {
        x: 15,
        y: 16
    };
    o3 = swcHelpers.objectSpread({}, o3, nt && {
        x: nt
    });
    let o2 = swcHelpers.objectSpread({}, nt && {
        x: nt
    });
    return o3;
}
function conditionalSpreadString(st) {
    let o4 = {
        x: 'hi',
        y: 17
    };
    o4 = swcHelpers.objectSpread({}, o4, st && {
        x: st
    });
    let o2 = swcHelpers.objectSpread({}, st && {
        x: st
    });
    return o4;
}
// any results in any
let anything;
let spreadAny = swcHelpers.objectSpread({}, anything);
// methods are not enumerable
class C {
    m() {}
    constructor(){
        this.p = 1;
    }
}
let c = new C();
let spreadC = swcHelpers.objectSpread({}, c);
// own methods are enumerable
let cplus = swcHelpers.objectSpread({}, c, {
    plus () {
        return this.p + 1;
    }
});
cplus.plus();
// new field's type conflicting with existing field is OK
let changeTypeAfter = swcHelpers.objectSpread({}, o, {
    a: 'wrong type?'
});
let changeTypeBoth = swcHelpers.objectSpread({}, o, swap);
// optional
function container(definiteBoolean, definiteString, optionalString, optionalNumber) {
    let optionalUnionStops = swcHelpers.objectSpread({}, definiteBoolean, definiteString, optionalNumber);
    let optionalUnionDuplicates = swcHelpers.objectSpread({}, definiteBoolean, definiteString, optionalString, optionalNumber);
    let allOptional = swcHelpers.objectSpread({}, optionalString, optionalNumber);
    // computed property
    let computedFirst = swcHelpers.objectSpread({
        ['before everything']: 12
    }, o, {
        b: 'yes'
    });
    let computedAfter = swcHelpers.objectSpread({}, o, {
        b: 'yeah',
        ['at the end']: 14
    });
}
// shortcut syntax
let a = 12;
let shortCutted = swcHelpers.objectSpread({}, o, {
    a
});
// non primitive
let spreadNonPrimitive = swcHelpers.objectSpread({}, {});
// generic spreads
function f(t, u) {
    return swcHelpers.objectSpread({}, t, u, {
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
    let x01 = swcHelpers.objectSpread({}, t);
    let x02 = swcHelpers.objectSpread({}, t, t);
    let x03 = swcHelpers.objectSpread({}, t, u);
    let x04 = swcHelpers.objectSpread({}, u, t);
    let x05 = swcHelpers.objectSpread({
        a: 5,
        b: 'hi'
    }, t);
    let x06 = swcHelpers.objectSpread({}, t, {
        a: 5,
        b: 'hi'
    });
    let x07 = swcHelpers.objectSpread({
        a: 5,
        b: 'hi'
    }, t, {
        c: true
    }, obj);
    let x09 = swcHelpers.objectSpread({
        a: 5
    }, t, {
        b: 'hi',
        c: true
    }, obj);
    let x10 = swcHelpers.objectSpread({
        a: 5
    }, t, {
        b: 'hi'
    }, u, obj);
    let x11 = swcHelpers.objectSpread({}, v);
    let x12 = swcHelpers.objectSpread({}, v, obj);
    let x13 = swcHelpers.objectSpread({}, w);
    let x14 = swcHelpers.objectSpread({}, w, obj);
    let x15 = swcHelpers.objectSpread({}, t, v);
    let x16 = swcHelpers.objectSpread({}, t, w);
    let x17 = swcHelpers.objectSpread({}, t, w, obj);
    let x18 = swcHelpers.objectSpread({}, t, v, w);
}
