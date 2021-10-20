function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
    }
}
function _defineProperties(target, props) {
    for(var i = 0; i < props.length; i++){
        var descriptor = props[i];
        descriptor.enumerable = descriptor.enumerable || false;
        descriptor.configurable = true;
        if ("value" in descriptor) descriptor.writable = true;
        Object.defineProperty(target, descriptor.key, descriptor);
    }
}
function _createClass(Constructor, protoProps, staticProps) {
    if (protoProps) _defineProperties(Constructor.prototype, protoProps);
    if (staticProps) _defineProperties(Constructor, staticProps);
    return Constructor;
}
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
        var source = arguments[i] != null ? arguments[i] : {
        };
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
var o1 = {
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
var addAfter = _objectSpread({
}, o1, {
    c: false
});
var addBefore = _objectSpread({
    c: false
}, o1);
var override = _objectSpread({
}, o1, {
    b: 'override'
});
var nested = _objectSpread({
}, _objectSpread({
    a: 3
}, {
    b: false,
    c: 'overriden'
}), {
    c: 'whatever'
});
var combined = _objectSpread({
}, o1, o2);
var combinedAfter = _objectSpread({
}, o1, o2, {
    b: 'ok'
});
var combinedNestedChangeType = _objectSpread({
}, _objectSpread({
    a: 1
}, {
    b: false,
    c: 'overriden'
}), {
    c: -1
});
var propertyNested = {
    a: _objectSpread({
    }, o1)
};
// accessors don't copy the descriptor
// (which means that readonly getters become read/write properties)
var op = {
    get a () {
        return 6;
    }
};
var getter = _objectSpread({
}, op, {
    c: 7
});
getter.a = 12;
// functions result in { }
var spreadFunc = _objectSpread({
}, function() {
});
function from16326(header, authToken) {
    return _objectSpread({
    }, this.header, header, authToken && {
        authToken: authToken
    });
}
// boolean && T results in Partial<T>
function conditionalSpreadBoolean(b) {
    var o = {
        x: 12,
        y: 13
    };
    o = _objectSpread({
    }, o, b && {
        x: 14
    });
    var o2 = _objectSpread({
    }, b && {
        x: 21
    });
    return o;
}
function conditionalSpreadNumber(nt) {
    var o = {
        x: 15,
        y: 16
    };
    o = _objectSpread({
    }, o, nt && {
        x: nt
    });
    var o2 = _objectSpread({
    }, nt && {
        x: nt
    });
    return o;
}
function conditionalSpreadString(st) {
    var o = {
        x: 'hi',
        y: 17
    };
    o = _objectSpread({
    }, o, st && {
        x: st
    });
    var o2 = _objectSpread({
    }, st && {
        x: st
    });
    return o;
}
// any results in any
var anything;
var spreadAny = _objectSpread({
}, anything);
var C = // methods are not enumerable
/*#__PURE__*/ function() {
    "use strict";
    function C() {
        _classCallCheck(this, C);
        this.p = 1;
    }
    _createClass(C, [
        {
            key: "m",
            value: function m() {
            }
        }
    ]);
    return C;
}();
var c = new C();
var spreadC = _objectSpread({
}, c);
// own methods are enumerable
var cplus = _objectSpread({
}, c, {
    plus: function() {
        return this.p + 1;
    }
});
cplus.plus();
// new field's type conflicting with existing field is OK
var changeTypeAfter = _objectSpread({
}, o1, {
    a: 'wrong type?'
});
var changeTypeBoth = _objectSpread({
}, o1, swap);
// optional
function container(definiteBoolean, definiteString, optionalString, optionalNumber) {
    var optionalUnionStops = _objectSpread({
    }, definiteBoolean, definiteString, optionalNumber);
    var optionalUnionDuplicates = _objectSpread({
    }, definiteBoolean, definiteString, optionalString, optionalNumber);
    var allOptional = _objectSpread({
    }, optionalString, optionalNumber);
    // computed property
    var computedFirst = _objectSpread(_defineProperty({
    }, 'before everything', 12), o1, {
        b: 'yes'
    });
    var computedAfter = _objectSpread({
    }, o1, _defineProperty({
        b: 'yeah'
    }, 'at the end', 14));
}
// shortcut syntax
var a = 12;
var shortCutted = _objectSpread({
}, o1, {
    a: a
});
// non primitive
var spreadNonPrimitive = _objectSpread({
}, {
});
// generic spreads
function f(t, u) {
    return _objectSpread({
    }, t, u, {
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
    var x01 = _objectSpread({
    }, t);
    var x02 = _objectSpread({
    }, t, t);
    var x03 = _objectSpread({
    }, t, u);
    var x04 = _objectSpread({
    }, u, t);
    var x05 = _objectSpread({
        a: 5,
        b: 'hi'
    }, t);
    var x06 = _objectSpread({
    }, t, {
        a: 5,
        b: 'hi'
    });
    var x07 = _objectSpread({
        a: 5,
        b: 'hi'
    }, t, {
        c: true
    }, obj);
    var x09 = _objectSpread({
        a: 5
    }, t, {
        b: 'hi',
        c: true
    }, obj);
    var x10 = _objectSpread({
        a: 5
    }, t, {
        b: 'hi'
    }, u, obj);
    var x11 = _objectSpread({
    }, v);
    var x12 = _objectSpread({
    }, v, obj);
    var x13 = _objectSpread({
    }, w);
    var x14 = _objectSpread({
    }, w, obj);
    var x15 = _objectSpread({
    }, t, v);
    var x16 = _objectSpread({
    }, t, w);
    var x17 = _objectSpread({
    }, t, w, obj);
    var x18 = _objectSpread({
    }, t, v, w);
}
