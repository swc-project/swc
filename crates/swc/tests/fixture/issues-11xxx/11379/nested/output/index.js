var obj = {};
var _obj_a;
var _obj_b;
var _obj_c;
var _obj_d;
var _obj_e;
// Multiple else-if chain with nullish coalescing
if (((_obj_a = obj.a) !== null && _obj_a !== void 0 ? _obj_a : 0) > 0) {
    console.log("a");
} else if (((_obj_b = obj.b) !== null && _obj_b !== void 0 ? _obj_b : 0) > 0) {
    console.log("b");
} else if (((_obj_c = obj.c) !== null && _obj_c !== void 0 ? _obj_c : 0) > 0) {
    console.log("c");
} else if (((_obj_d = obj.d) !== null && _obj_d !== void 0 ? _obj_d : 0) > 0) {
    console.log("d");
} else if (((_obj_e = obj.e) !== null && _obj_e !== void 0 ? _obj_e : 0) > 0) {
    console.log("e");
}
var _obj_x;
var _obj_y;
var _obj_z;
var _obj_w;
var _obj_w2;
var _obj_z2;
var _obj_y2;
var _obj_x2;
// Deeply nested if statements with nullish coalescing
if (((_obj_x = obj.x) !== null && _obj_x !== void 0 ? _obj_x : 0) > 0) {
    if (((_obj_y = obj.y) !== null && _obj_y !== void 0 ? _obj_y : 0) > 0) {
        if (((_obj_z = obj.z) !== null && _obj_z !== void 0 ? _obj_z : 0) > 0) {
            if (((_obj_w = obj.w) !== null && _obj_w !== void 0 ? _obj_w : 0) > 0) {
                console.log("all set");
            } else if (((_obj_w2 = obj.w2) !== null && _obj_w2 !== void 0 ? _obj_w2 : 0) > 0) {
                console.log("w2");
            }
        } else if (((_obj_z2 = obj.z2) !== null && _obj_z2 !== void 0 ? _obj_z2 : 0) > 0) {
            console.log("z2");
        }
    } else if (((_obj_y2 = obj.y2) !== null && _obj_y2 !== void 0 ? _obj_y2 : 0) > 0) {
        console.log("y2");
    }
} else if (((_obj_x2 = obj.x2) !== null && _obj_x2 !== void 0 ? _obj_x2 : 0) > 0) {
    console.log("x2");
}
var _obj_foo;
var _obj_bar;
var _obj_baz;
var _obj_qux;
// Mixed nesting with blocks
if (true) {
    if (((_obj_foo = obj.foo) !== null && _obj_foo !== void 0 ? _obj_foo : 0) > 0) {
        console.log("foo");
    } else if (((_obj_bar = obj.bar) !== null && _obj_bar !== void 0 ? _obj_bar : 0) > 0) {
        if (((_obj_baz = obj.baz) !== null && _obj_baz !== void 0 ? _obj_baz : 0) > 0) {
            console.log("baz");
        } else if (((_obj_qux = obj.qux) !== null && _obj_qux !== void 0 ? _obj_qux : 0) > 0) {
            console.log("qux");
        }
    }
}
// In function scope
function test() {
    var _obj_fn1;
    var _obj_fn2;
    var _obj_fn3;
    var _obj_fn4;
    if (((_obj_fn1 = obj.fn1) !== null && _obj_fn1 !== void 0 ? _obj_fn1 : 0) > 0) {
        console.log("fn1");
    } else if (((_obj_fn2 = obj.fn2) !== null && _obj_fn2 !== void 0 ? _obj_fn2 : 0) > 0) {
        if (((_obj_fn3 = obj.fn3) !== null && _obj_fn3 !== void 0 ? _obj_fn3 : 0) > 0) {
            console.log("fn3");
        } else if (((_obj_fn4 = obj.fn4) !== null && _obj_fn4 !== void 0 ? _obj_fn4 : 0) > 0) {
            console.log("fn4");
        }
    }
}
// Arrow function with nested conditions
var arrowTest = function() {
    var _obj_arrow1;
    var _obj_arrow2;
    var _obj_arrow3;
    if (((_obj_arrow1 = obj.arrow1) !== null && _obj_arrow1 !== void 0 ? _obj_arrow1 : 0) > 0) {
        console.log("arrow1");
    } else if (((_obj_arrow2 = obj.arrow2) !== null && _obj_arrow2 !== void 0 ? _obj_arrow2 : 0) > 0) {
        if (((_obj_arrow3 = obj.arrow3) !== null && _obj_arrow3 !== void 0 ? _obj_arrow3 : 0) > 0) {
            console.log("arrow3");
        }
    }
};
