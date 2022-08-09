// @strictNullChecks: true
// @declaration: true
function f1(x) {
    let y; // Error
}
function f2(x) {
    let y; // Error
}
function f3(x) {
    let y;
}
function f4(x) {
    let y;
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
    let x1 = objAndReadonly({
        x: 0,
        y: 0
    }, {
        x: 1
    }); // Error
    let x2 = objAndReadonly({
        x: 0,
        y: 0
    }, {
        x: 1,
        y: 1
    });
    let x3 = objAndReadonly({
        x: 0,
        y: 0
    }, {
        x: 1,
        y: 1,
        z: 1
    }); // Error
}
function f21() {
    let x1 = objAndPartial({
        x: 0,
        y: 0
    }, {
        x: 1
    });
    let x2 = objAndPartial({
        x: 0,
        y: 0
    }, {
        x: 1,
        y: 1
    });
    let x3 = objAndPartial({
        x: 0,
        y: 0
    }, {
        x: 1,
        y: 1,
        z: 1
    }); // Error
}
function setState(obj, props) {
    for(let k in props){
        obj[k] = props[k];
    }
}
let foo = {
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
class C {
    setState(props) {
        for(let k in props){
            this.state[k] = props[k];
        }
    }
}
let c = new C();
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
let x1 = {
    a: 'no'
}; // Error
let x2 = {
    a: 'no'
}; // Error
let x3 = {
    a: 'no'
}; // Error
let o = {
    x: 5,
    y: false
};
let f = {
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
    let x = obj.foo; // Error
}
function test2(obj) {
    let x = obj.foo; // Error
}
