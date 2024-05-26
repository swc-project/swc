//// [unknownControlFlow.ts]
import { _ as _type_of } from "@swc/helpers/_/_type_of";
function f01(u) {
    var x1 = u; // Error
    var x2 = u;
    var x3 = u;
    var x4 = u;
}
function f10(x) {
    if (x) {
        x; // {}
    } else {
        x; // unknown
    }
    if (!x) {
        x; // unknown
    } else {
        x; // {}
    }
}
function f11(x) {
    if (x) {
        x; // T & {}
    } else {
        x; // T
    }
    if (!x) {
        x; // T
    } else {
        x; // T & {}
    }
}
function f12(x) {
    if (x) {
        x; // T
    } else {
        x; // T
    }
}
function f20(x) {
    if (x !== undefined) {
        x; // {} | null
    } else {
        x; // undefined
    }
    if (x !== null) {
        x; // {} | undefined
    } else {
        x; // null
    }
    if (x !== undefined && x !== null) {
        x; // {}
    } else {
        x; // null | undefined
    }
    if (x != undefined) {
        x; // {}
    } else {
        x; // null | undefined
    }
    if (x != null) {
        x; // {}
    } else {
        x; // null | undefined
    }
}
function f21(x) {
    if (x !== undefined) {
        x; // T & ({} | null)
    } else {
        x; // T
    }
    if (x !== null) {
        x; // T & ({} | undefined)
    } else {
        x; // T
    }
    if (x !== undefined && x !== null) {
        x; // T & {}
    } else {
        x; // T
    }
    if (x != undefined) {
        x; // T & {}
    } else {
        x; // T
    }
    if (x != null) {
        x; // T & {}
    } else {
        x; // T
    }
}
function f22(x) {
    if (x !== undefined) {
        x; // T & {}
    } else {
        x; // T
    }
    if (x !== null) {
        x; // T
    } else {
        x; // T
    }
    if (x !== undefined && x !== null) {
        x; // T & {}
    } else {
        x; // T
    }
    if (x != undefined) {
        x; // T & {}
    } else {
        x; // T
    }
    if (x != null) {
        x; // T & {}
    } else {
        x; // T
    }
}
function f23(x) {
    if (x !== undefined) {
        x; // T & {} | null
    }
    if (x !== null) {
        x; // T & {} | undefined
    }
    if (x != undefined) {
        x; // T & {}
    }
    if (x != null) {
        x; // T & {}
    }
}
function f30(x) {
    if ((typeof x === "undefined" ? "undefined" : _type_of(x)) === "object") {
        x; // object
    }
}
function f31(x) {
    if ((typeof x === "undefined" ? "undefined" : _type_of(x)) === "object") {
        x; // T & object | T & null
    }
    if (x && (typeof x === "undefined" ? "undefined" : _type_of(x)) === "object") {
        x; // T & object
    }
    if ((typeof x === "undefined" ? "undefined" : _type_of(x)) === "object" && x) {
        x; // T & object
    }
}
function f32(x) {
    if ((typeof x === "undefined" ? "undefined" : _type_of(x)) === "object") {
        x; // T & object
    }
}
function possiblyNull(x) {
    return !!true ? x : null; // T | null
}
function possiblyUndefined(x) {
    return !!true ? x : undefined; // T | undefined
}
function possiblyNullOrUndefined(x) {
    return possiblyUndefined(possiblyNull(x)); // T | null | undefined
}
function ensureNotNull(x) {
    if (x === null) throw Error();
    return x; // T & ({} | undefined)
}
function ensureNotUndefined(x) {
    if (x === undefined) throw Error();
    return x; // T & ({} | null)
}
function ensureNotNullOrUndefined(x) {
    return ensureNotUndefined(ensureNotNull(x)); // T & {}
}
function f40(a, b) {
    var a1 = ensureNotNullOrUndefined(a); // string
    var b1 = ensureNotNullOrUndefined(b); // number
}
function f41(a) {
    var a1 = ensureNotUndefined(ensureNotNull(a)); // T & {}
    var a2 = ensureNotNull(ensureNotUndefined(a)); // T & {}
    var a3 = ensureNotNull(ensureNotNull(a)); // T & {} | T & undefined
    var a4 = ensureNotUndefined(ensureNotUndefined(a)); // T & {} | T & null
    var a5 = ensureNotNullOrUndefined(ensureNotNullOrUndefined(a)); // T & {}
    var a6 = ensureNotNull(possiblyNullOrUndefined(a)); // T & {} | undefined
    var a7 = ensureNotUndefined(possiblyNullOrUndefined(a)); // T & {} | null
    var a8 = ensureNotNull(possiblyUndefined(a)); // T & {} | undefined
    var a9 = ensureNotUndefined(possiblyNull(a)); // T & {} | null
}
// Repro from #48468
function deepEquals(a, b) {
    if ((typeof a === "undefined" ? "undefined" : _type_of(a)) !== 'object' || (typeof b === "undefined" ? "undefined" : _type_of(b)) !== 'object' || !a || !b) {
        return false;
    }
    if (Array.isArray(a) || Array.isArray(b)) {
        return false;
    }
    if (Object.keys(a).length !== Object.keys(b).length) {
        return false;
    }
    return true;
}
// Repro from #49386
function foo(x) {
    var y = x;
    if (y !== null) {
        y;
    }
}
// We allow an unconstrained object of a generic type `T` to be indexed by a key of type `keyof T`
// without a check that the object is non-undefined and non-null. This is safe because `keyof T`
// is `never` (meaning no possible keys) for any `T` that includes `undefined` or `null`.
function ff1(t, k) {
    t[k];
}
function ff2(t, k) {
    t[k];
}
function ff3(t, k) {
    t[k]; // Error
}
function ff4(t, k) {
    t[k];
}
ff1(null, 'foo'); // Error
ff2(null, 'foo'); // Error
ff3(null, 'foo');
ff4(null, 'foo'); // Error
// Generics and intersections with {}
function fx0(value) {
    if (value === 42) {
        value; // T & {}
    } else {
        value; // T & ({} | null)
    }
}
function fx1(value) {
    if (value === 42) {
        value; // T & {}
    } else {
        value; // T & ({} | null)
    }
}
function fx2(value) {
    if (value === 42) {
        value; // T & {}
    } else {
        value; // T & ({} | null)
    }
}
function fx3(value) {
    if (value === 42) {
        value; // T & {}
    } else {
        value; // T & ({} | null)
    }
}
function fx4(value) {
    if (value === 42) {
        value; // T & {}
    } else {
        value; // T & ({} | null)
    }
}
function fx5(value) {
    if (value === 42) {
        value; // T & {}
    } else {
        value; // T & ({} | null)
    }
}
// Double-equals narrowing
function fx10(x, y) {
    if (x == y) {
        x; // string | number
    } else {
        x; // string | number
    }
    if (x != y) {
        x; // string | number
    } else {
        x; // string | number
    }
}
// Repros from #50706
function SendBlob(encoding) {
    if (encoding !== undefined && encoding !== 'utf8') {
        throw new Error('encoding');
    }
    encoding;
}
function doSomething1(value) {
    if (value === undefined) {
        return value;
    }
    if (value === 42) {
        throw Error('Meaning of life value');
    }
    return value;
}
function doSomething2(value) {
    if (value === undefined) {
        return;
    }
    if (value === 42) {
        value;
    }
}
function x(x, y) {
    var r2 = y;
}
function assertNever(v) {
    throw new Error('never');
}
function fx20(value) {
    if (value === 'left') {
        var foo = value;
    } else if (value === 'right') {
        var bar = value;
    } else {
        assertNever(value);
    }
}
