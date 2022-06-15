// @strict: true
// @declaration: true
// Narrowing by aliased conditional expressions
function f10(x) {
    const isString = typeof x === "string";
    if (isString) {
        let t = x;
    } else {
        let t1 = x;
    }
}
function f11(x) {
    const isString = typeof x === "string";
    if (isString) {
        let t = x;
    }
}
function f12(x) {
    const isString = typeof x === "string";
    const isNumber = typeof x === "number";
    if (isString || isNumber) {
        let t = x;
    } else {
        let t1 = x;
    }
}
function f13(x) {
    const isString = typeof x === "string";
    const isNumber = typeof x === "number";
    const isStringOrNumber = isString || isNumber;
    if (isStringOrNumber) {
        let t = x;
    } else {
        let t1 = x;
    }
}
function f14(x) {
    const notUndefined = x !== undefined;
    return notUndefined ? x : 0;
}
function f15(obj) {
    const isString = typeof obj.x === 'string';
    if (isString) {
        let s = obj.x;
    }
}
function f16(obj) {
    const isString = typeof obj.x === 'string';
    obj = {
        x: 42
    };
    if (isString) {
        let s = obj.x; // Not narrowed because of is assigned in function body
    }
}
function f17(obj) {
    const isString = typeof obj[0] === 'string';
    if (isString) {
        let s = obj[0];
    }
}
function f18(obj) {
    const isString = typeof obj[0] === 'string';
    obj = [
        42
    ];
    if (isString) {
        let s = obj[0]; // Not narrowed because of is assigned in function body
    }
}
function f20(obj) {
    const isFoo = obj.kind === 'foo';
    if (isFoo) {
        obj.foo;
    } else {
        obj.bar;
    }
}
function f21(obj) {
    const isFoo = obj.kind === 'foo';
    if (isFoo) {
        obj.foo; // Not narrowed because isFoo has type annotation
    } else {
        obj.bar; // Not narrowed because isFoo has type annotation
    }
}
function f22(obj) {
    let isFoo = obj.kind === 'foo';
    if (isFoo) {
        obj.foo; // Not narrowed because isFoo is mutable
    } else {
        obj.bar; // Not narrowed because isFoo is mutable
    }
}
function f23(obj) {
    const isFoo = obj.kind === 'foo';
    obj = obj;
    if (isFoo) {
        obj.foo; // Not narrowed because obj is assigned in function body
    } else {
        obj.bar; // Not narrowed because obj is assigned in function body
    }
}
function f24(arg) {
    const obj = arg;
    const isFoo = obj.kind === 'foo';
    if (isFoo) {
        obj.foo;
    } else {
        obj.bar;
    }
}
function f25(arg) {
    let obj = arg;
    const isFoo = obj.kind === 'foo';
    if (isFoo) {
        obj.foo; // Not narrowed because obj is mutable
    } else {
        obj.bar; // Not narrowed because obj is mutable
    }
}
function f26(outer) {
    const isFoo = outer.obj.kind === 'foo';
    if (isFoo) {
        outer.obj.foo;
    } else {
        outer.obj.bar;
    }
}
function f27(outer) {
    const isFoo = outer.obj.kind === 'foo';
    if (isFoo) {
        outer.obj.foo; // Not narrowed because obj is mutable
    } else {
        outer.obj.bar; // Not narrowed because obj is mutable
    }
}
function f28(obj) {
    const isFoo = obj && obj.kind === 'foo';
    const isBar = obj && obj.kind === 'bar';
    if (isFoo) {
        obj.foo;
    }
    if (isBar) {
        obj.bar;
    }
}
// Narrowing by aliased discriminant property access
function f30(obj) {
    const kind = obj.kind;
    if (kind === 'foo') {
        obj.foo;
    } else {
        obj.bar;
    }
}
function f31(obj) {
    const { kind  } = obj;
    if (kind === 'foo') {
        obj.foo;
    } else {
        obj.bar;
    }
}
function f32(obj) {
    const { kind: k  } = obj;
    if (k === 'foo') {
        obj.foo;
    } else {
        obj.bar;
    }
}
function f33(obj) {
    const { kind  } = obj;
    switch(kind){
        case 'foo':
            obj.foo;
            break;
        case 'bar':
            obj.bar;
            break;
    }
}
class C10 {
    constructor(x){
        this.x = x;
        const thisX_isString = typeof this.x === 'string';
        const xIsString = typeof x === 'string';
        if (thisX_isString && xIsString) {
            let s;
            s = this.x;
            s = x;
        }
    }
}
class C11 {
    constructor(x){
        this.x = x;
        const thisX_isString = typeof this.x === 'string';
        const xIsString = typeof x === 'string';
        if (thisX_isString && xIsString) {
            // Some narrowings may be invalidated due to later assignments.
            let s;
            s = this.x;
            s = x;
        } else {
            this.x = 10;
            x = 10;
        }
    }
}
// Mixing of aliased discriminants and conditionals
function f40(obj) {
    const { kind  } = obj;
    const isFoo = kind == 'foo';
    if (isFoo && obj.foo) {
        let t = obj.foo;
    }
}
function gg2(obj) {
    if (obj.kind === 'str') {
        let t = obj.payload;
    } else {
        let t1 = obj.payload;
    }
}
function foo({ kind , payload  }) {
    if (kind === 'str') {
        let t = payload;
    } else {
        let t1 = payload;
    }
}
// Repro from #45830
const obj = {
    fn: ()=>true
};
if (a) {}
const a = obj.fn();
