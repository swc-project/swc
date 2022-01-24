function _defineProperty(obj, key, value) {
    if (key in obj) {
        Object.defineProperty(obj, key, {
            value: value,
            enumerable: true,
            configurable: true,
            writable: true
        });
    } else {
        obj[key] = value;
    }
    return obj;
}
function _objectSpread(target) {
    for(var i = 1; i < arguments.length; i++){
        var source = arguments[i] != null ? arguments[i] : {};
        var ownKeys = Object.keys(source);
        if (typeof Object.getOwnPropertySymbols === "function") {
            ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function(sym) {
                return Object.getOwnPropertyDescriptor(source, sym).enumerable;
            }));
        }
        ownKeys.forEach(function(key) {
            _defineProperty(target, key, source[key]);
        });
    }
    return target;
}
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
let addAfter = _objectSpread({}, o, {
    c: false
});
let addBefore = _objectSpread({
    c: false
}, o);
let override = _objectSpread({}, o, {
    b: 'override'
});
let nested = _objectSpread({}, _objectSpread({
    a: 3
}, {
    b: false,
    c: 'overriden'
}), {
    c: 'whatever'
});
let combined = _objectSpread({}, o, o2);
let combinedAfter = _objectSpread({}, o, o2, {
    b: 'ok'
});
let combinedNestedChangeType = _objectSpread({}, _objectSpread({
    a: 1
}, {
    b: false,
    c: 'overriden'
}), {
    c: -1
});
let propertyNested = {
    a: _objectSpread({}, o)
};
// accessors don't copy the descriptor
// (which means that readonly getters become read/write properties)
let op = {
    get a () {
        return 6;
    }
};
let getter = _objectSpread({}, op, {
    c: 7
});
getter.a = 12;
// functions result in { }
let spreadFunc = _objectSpread({}, function() {});
function from16326(header, authToken) {
    return _objectSpread({}, this.header, header, authToken && {
        authToken
    });
}
// boolean && T results in Partial<T>
function conditionalSpreadBoolean(b) {
    let o1 = {
        x: 12,
        y: 13
    };
    o1 = _objectSpread({}, o1, b && {
        x: 14
    });
    let o2 = _objectSpread({}, b && {
        x: 21
    });
    return o1;
}
function conditionalSpreadNumber(nt) {
    let o3 = {
        x: 15,
        y: 16
    };
    o3 = _objectSpread({}, o3, nt && {
        x: nt
    });
    let o2 = _objectSpread({}, nt && {
        x: nt
    });
    return o3;
}
function conditionalSpreadString(st) {
    let o4 = {
        x: 'hi',
        y: 17
    };
    o4 = _objectSpread({}, o4, st && {
        x: st
    });
    let o2 = _objectSpread({}, st && {
        x: st
    });
    return o4;
}
// any results in any
let anything;
let spreadAny = _objectSpread({}, anything);
// methods are not enumerable
class C {
    m() {}
    constructor(){
        this.p = 1;
    }
}
let c = new C();
let spreadC = _objectSpread({}, c);
// own methods are enumerable
let cplus = _objectSpread({}, c, {
    plus () {
        return this.p + 1;
    }
});
cplus.plus();
// new field's type conflicting with existing field is OK
let changeTypeAfter = _objectSpread({}, o, {
    a: 'wrong type?'
});
let changeTypeBoth = _objectSpread({}, o, swap);
// optional
function container(definiteBoolean, definiteString, optionalString, optionalNumber) {
    let optionalUnionStops = _objectSpread({}, definiteBoolean, definiteString, optionalNumber);
    let optionalUnionDuplicates = _objectSpread({}, definiteBoolean, definiteString, optionalString, optionalNumber);
    let allOptional = _objectSpread({}, optionalString, optionalNumber);
    // computed property
    let computedFirst = _objectSpread({
        ['before everything']: 12
    }, o, {
        b: 'yes'
    });
    let computedAfter = _objectSpread({}, o, {
        b: 'yeah',
        ['at the end']: 14
    });
}
// shortcut syntax
let a = 12;
let shortCutted = _objectSpread({}, o, {
    a
});
// non primitive
let spreadNonPrimitive = _objectSpread({}, {});
// generic spreads
function f(t, u) {
    return _objectSpread({}, t, u, {
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
    let x01 = _objectSpread({}, t);
    let x02 = _objectSpread({}, t, t);
    let x03 = _objectSpread({}, t, u);
    let x04 = _objectSpread({}, u, t);
    let x05 = _objectSpread({
        a: 5,
        b: 'hi'
    }, t);
    let x06 = _objectSpread({}, t, {
        a: 5,
        b: 'hi'
    });
    let x07 = _objectSpread({
        a: 5,
        b: 'hi'
    }, t, {
        c: true
    }, obj);
    let x09 = _objectSpread({
        a: 5
    }, t, {
        b: 'hi',
        c: true
    }, obj);
    let x10 = _objectSpread({
        a: 5
    }, t, {
        b: 'hi'
    }, u, obj);
    let x11 = _objectSpread({}, v);
    let x12 = _objectSpread({}, v, obj);
    let x13 = _objectSpread({}, w);
    let x14 = _objectSpread({}, w, obj);
    let x15 = _objectSpread({}, t, v);
    let x16 = _objectSpread({}, t, w);
    let x17 = _objectSpread({}, t, w, obj);
    let x18 = _objectSpread({}, t, v, w);
}
