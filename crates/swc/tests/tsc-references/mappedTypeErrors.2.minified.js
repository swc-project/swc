//// [mappedTypeErrors.ts]
import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
function f1(x) {}
function f2(x) {}
function f3(x) {}
function f4(x) {}
function f10() {}
function f11() {}
function f12() {}
function f20() {
    objAndReadonly({
        x: 0,
        y: 0
    }, {
        x: 1
    }), objAndReadonly({
        x: 0,
        y: 0
    }, {
        x: 1,
        y: 1
    }), objAndReadonly({
        x: 0,
        y: 0
    }, {
        x: 1,
        y: 1,
        z: 1
    });
}
function f21() {
    objAndPartial({
        x: 0,
        y: 0
    }, {
        x: 1
    }), objAndPartial({
        x: 0,
        y: 0
    }, {
        x: 1,
        y: 1
    }), objAndPartial({
        x: 0,
        y: 0
    }, {
        x: 1,
        y: 1,
        z: 1
    });
}
function setState(obj, props) {
    for(var k in props)obj[k] = props[k];
}
var foo = {
    a: "hello",
    b: 42
};
setState(foo, {
    a: "test",
    b: 43
}), setState(foo, {
    a: "hi"
}), setState(foo, {
    b: void 0
}), setState(foo, {}), setState(foo, foo), setState(foo, {
    a: void 0
}), setState(foo, {
    c: !0
});
var C = function() {
    "use strict";
    function C() {
        _class_call_check(this, C);
    }
    return C.prototype.setState = function(props) {
        for(var k in props)this.state[k] = props[k];
    }, C;
}(), c = new C();
c.setState({
    a: "test",
    b: 43
}), c.setState({
    a: "hi"
}), c.setState({
    b: void 0
}), c.setState({}), c.setState(foo), c.setState({
    a: void 0
}), c.setState({
    c: !0
});
var x1 = {
    a: "no"
}, x2 = {
    a: "no"
}, x3 = {
    a: "no"
}, o = {
    x: 5,
    y: !1
}, f = {
    pf: {
        x: 7
    },
    pt: {
        x: 7,
        y: !1
    }
};
function test1(obj) {
    obj.foo;
}
function test2(obj) {
    obj.foo;
}
