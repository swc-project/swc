// @strict: true
// @allowUnreachableCode: false
// @declaration: true
function fail(message) {
    throw new Error(message);
}
function f01(x) {
    if (x === undefined) fail("undefined argument");
    x.length; // string
}
function f02(x) {
    if (x >= 0) return x;
    fail("negative number");
    x; // Unreachable
}
function f03(x) {
    x; // string
    fail();
    x; // Unreachable
}
function f11(x, fail) {
    if (x === undefined) fail("undefined argument");
    x.length; // string
}
function f12(x, fail) {
    if (x >= 0) return x;
    fail("negative number");
    x; // Unreachable
}
function f13(x, fail) {
    x; // string
    fail();
    x; // Unreachable
}
function f21(x) {
    if (x === undefined) Debug.fail("undefined argument");
    x.length; // string
}
function f22(x) {
    if (x >= 0) return x;
    Debug.fail("negative number");
    x; // Unreachable
}
function f23(x) {
    x; // string
    Debug.fail();
    x; // Unreachable
}
function f24(x) {
    x; // string
    Debug.fail();
    x; // Unreachable
}
class Test {
    fail(message) {
        throw new Error(message);
    }
    f1(x) {
        if (x === undefined) this.fail("undefined argument");
        x.length; // string
    }
    f2(x) {
        if (x >= 0) return x;
        this.fail("negative number");
        x; // Unreachable
    }
    f3(x) {
        x; // string
        this.fail();
        x; // Unreachable
    }
}
function f30(x) {
    if (typeof x === "string") {
        fail();
        x; // Unreachable
    } else {
        x; // number | undefined
        if (x !== undefined) {
            x; // number
            fail();
            x; // Unreachable
        } else {
            x; // undefined
            fail();
            x; // Unreachable
        }
        x; // Unreachable
    }
    x; // Unreachable
}
function f31(x) {
    if (typeof x.a === "string") {
        fail();
        x; // Unreachable
        x.a; // Unreachable
    }
    x; // { a: string | number }
    x.a; // number
}
function f40(x) {
    try {
        x;
        fail();
        x; // Unreachable
    } finally{
        x;
        fail();
        x; // Unreachable
    }
    x; // Unreachable
}
function f41(x) {
    try {
        x;
    } finally{
        x;
        fail();
        x; // Unreachable
    }
    x; // Unreachable
}
function f42(x) {
    try {
        x;
        fail();
        x; // Unreachable
    } finally{
        x;
    }
    x; // Unreachable
}
function f43() {
    const fail = ()=>{
        throw new Error();
    };
    const f = [
        fail
    ];
    fail(); // No effect (missing type annotation)
    f[0](); // No effect (not a dotted name)
    f;
}
const Component = registerComponent('test-component', {
    schema: {
        myProperty: {
            default: [],
            parse () {
                return [
                    true
                ];
            }
        },
        string: {
            type: 'string'
        },
        num: 0
    },
    init () {
        this.data.num = 0;
        this.el.setAttribute('custom-attribute', 'custom-value');
    },
    update () {},
    tick () {},
    remove () {},
    pause () {},
    play () {},
    multiply (f) {
        // Reference to system because both were registered with the same name.
        return f * this.data.num * this.system.data.counter;
    }
});
// Repro from #36147
class MyThrowable {
    throw() {
        throw new Error();
    }
}
class SuperThrowable extends MyThrowable {
    err(msg) {
        super.throw();
    }
    ok() {
        this.throw();
    }
}
function foo(services, s) {
    if (s === null) {
        services.panic("ouch");
    } else {
        return s;
    }
}
export { };
