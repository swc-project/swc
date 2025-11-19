//// [objectLiteralNormalization.ts]
// Object literals in unions are normalized upon widening
import { _ as _object_spread } from "@swc/helpers/_/_object_spread";
import { _ as _object_spread_props } from "@swc/helpers/_/_object_spread_props";
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
    {}
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
a2 = {};
a2 = {
    a: "def",
    b: 20
}; // Error
a2 = {
    a: 1
}; // Error
var b2 = _object_spread_props(_object_spread({}, b1), {
    z: 55
});
var b3 = _object_spread({}, b2);
var c1 = !true ? {} : opts;
var c2 = !true ? opts : {};
var c3 = !true ? {
    a: 0,
    b: 0
} : {};
var c4 = !true ? {} : {
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
}, {});
var e2 = f({}, {
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
