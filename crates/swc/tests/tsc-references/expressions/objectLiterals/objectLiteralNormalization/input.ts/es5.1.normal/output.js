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
// @strict: true
// @declaration: true
// Object literals in unions are normalized upon widening
var a1 = [
    {
        a: 0
    },
    {
        a: 1,
        b: "x"
    },
    {
        a: 2,
        b: "y",
        c: true
    }
][0];
a1.a; // number
a1.b; // string | undefined
a1.c; // boolean | undefined
a1 = {
    a: 1
};
a1 = {
    a: 0,
    b: 0
}; // Error
a1 = {
    b: "y"
}; // Error
a1 = {
    c: true
}; // Error
var a2 = [
    {
        a: 1,
        b: 2
    },
    {
        a: "abc"
    },
    {
    }
][0];
a2.a; // string | number | undefined
a2.b; // number | undefined
a2 = {
    a: 10,
    b: 20
};
a2 = {
    a: "def"
};
a2 = {
};
a2 = {
    a: "def",
    b: 20
}; // Error
a2 = {
    a: 1
}; // Error
var b2 = _objectSpread({
}, b1, {
    z: 55
});
var b3 = _objectSpread({
}, b2);
var c1 = !true ? {
} : opts;
var c2 = !true ? opts : {
};
var c3 = !true ? {
    a: 0,
    b: 0
} : {
};
var c4 = !true ? {
} : {
    a: 0,
    b: 0
};
// Normalization applies to nested properties
var d1 = [
    {
        kind: 'a',
        pos: {
            x: 0,
            y: 0
        }
    },
    {
        kind: 'b',
        pos: !true ? {
            a: "x"
        } : {
            b: 0
        }
    }
][0];
d1.kind;
d1.pos;
d1.pos.x;
d1.pos.y;
d1.pos.a;
d1.pos.b;
// Object literals are inferred as a single normalized union type
var e1 = f({
    a: 1,
    b: 2
}, {
    a: "abc"
}, {
});
var e2 = f({
}, {
    a: "abc"
}, {
    a: 1,
    b: 2
});
var e3 = f(data, {
    a: 2
});
var e4 = f({
    a: 2
}, data);
