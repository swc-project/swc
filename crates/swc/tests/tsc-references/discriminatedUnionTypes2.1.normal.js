//// [discriminatedUnionTypes2.ts]
function f10(x) {
    if (x.kind === false) {
        x.a;
    } else if (x.kind === true) {
        x.b;
    } else {
        x.c;
    }
}
function f11(x) {
    switch(x.kind){
        case false:
            x.a;
            break;
        case true:
            x.b;
            break;
        default:
            x.c;
    }
}
function f13(x) {
    x = {
        a: null,
        b: "foo",
        c: 4
    }; // Error
}
function f14(x) {
    if (x.a === 0) {
        x.b; // Error
    }
}
function f15(x) {
    if (!x.error) {
        x.value;
    } else {
        x.error.message;
    }
}
f15({
    value: 10
});
f15({
    error: new Error("boom")
});
function f20(carrier) {
    if (carrier.error === null) {
        var error = carrier.error;
        var data = carrier.data;
    } else {
        var error1 = carrier.error;
        var data1 = carrier.data;
    }
}
function f30(foo) {
    if (foo.tag) {
        foo;
    } else {
        foo;
    }
}
function f31(foo) {
    if (foo.tag === true) {
        foo;
    } else {
        foo;
    }
}
function f(problem) {
    if (problem.type === 'b') {
        problem.name;
    } else {
        problem.other;
    }
}
function foo1(x) {
    if (x.type === 'number') {
        x.value; // number
    } else {
        x.value; // number
    }
}
function foo2(x) {
    if (x.type === 'number') {
        x.value; // number
    } else {
        x.value; // string
    }
}
