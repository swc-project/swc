//// [mappedTypeErrors.ts]
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
function f1(x) {
    var y; // Error
}
function f2(x) {
    var y; // Error
}
function f3(x) {
    var y;
}
function f4(x) {
    var y;
}
// Type identity checking
function f10() {
    var x;
    var x;
    var x;
}
function f11() {
    var x;
    var x; // Error
    var x; // Error
    var x; // Error
}
function f12() {
    var x;
    var x; // Error
}
function f20() {
    var x1 = objAndReadonly({
        x: 0,
        y: 0
    }, {
        x: 1
    }); // Error
    var x2 = objAndReadonly({
        x: 0,
        y: 0
    }, {
        x: 1,
        y: 1
    });
    var x3 = objAndReadonly({
        x: 0,
        y: 0
    }, {
        x: 1,
        y: 1,
        z: 1
    }); // Error
}
function f21() {
    var x1 = objAndPartial({
        x: 0,
        y: 0
    }, {
        x: 1
    });
    var x2 = objAndPartial({
        x: 0,
        y: 0
    }, {
        x: 1,
        y: 1
    });
    var x3 = objAndPartial({
        x: 0,
        y: 0
    }, {
        x: 1,
        y: 1,
        z: 1
    }); // Error
}
function setState(obj, props) {
    for(var k in props){
        obj[k] = props[k];
    }
}
var foo = {
    a: "hello",
    b: 42
};
setState(foo, {
    a: "test",
    b: 43
});
setState(foo, {
    a: "hi"
});
setState(foo, {
    b: undefined
});
setState(foo, {});
setState(foo, foo);
setState(foo, {
    a: undefined
}); // Error
setState(foo, {
    c: true
}); // Error
var C = /*#__PURE__*/ function() {
    "use strict";
    function C() {
        _class_call_check(this, C);
    }
    var _proto = C.prototype;
    _proto.setState = function setState(props) {
        for(var k in props){
            this.state[k] = props[k];
        }
    };
    return C;
}();
var c = new C();
c.setState({
    a: "test",
    b: 43
});
c.setState({
    a: "hi"
});
c.setState({
    b: undefined
});
c.setState({});
c.setState(foo);
c.setState({
    a: undefined
}); // Error
c.setState({
    c: true
}); // Error
var x1 = {
    a: 'no'
}; // Error
var x2 = {
    a: 'no'
}; // Error
var x3 = {
    a: 'no'
}; // Error
var o = {
    x: 5,
    y: false
};
var f = {
    pf: {
        x: 7
    },
    pt: {
        x: 7,
        y: false
    }
};
// Repro from #28170
function test1(obj) {
    var x = obj.foo; // Error
}
function test2(obj) {
    var x = obj.foo; // Error
}
