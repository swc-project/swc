// @strict: true
// @declaration: true
// Narrowing by aliased conditional expressions
function f10(x) {
    const isString = typeof x === "string";
    if (isString) {
        let t = x;
    } else {
        let t = x;
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
        let t = x;
    }
}
function f13(x) {
    const isString = typeof x === "string";
    const isNumber = typeof x === "number";
    const isStringOrNumber = isString || isNumber;
    if (isStringOrNumber) {
        let t = x;
    } else {
        let t = x;
    }
}
function f14(x) {
    const notUndefined = x !== undefined;
    return notUndefined ? x : 0;
}
function f15(obj1) {
    const isString = typeof obj1.x === 'string';
    if (isString) {
        let s = obj1.x;
    }
}
function f16(obj2) {
    const isString = typeof obj2.x === 'string';
    obj2 = {
        x: 42
    };
    if (isString) {
        let s = obj2.x; // Not narrowed because of is assigned in function body
    }
}
function f17(obj3) {
    const isString = typeof obj3[0] === 'string';
    if (isString) {
        let s = obj3[0];
    }
}
function f18(obj4) {
    const isString = typeof obj4[0] === 'string';
    obj4 = [
        42
    ];
    if (isString) {
        let s = obj4[0]; // Not narrowed because of is assigned in function body
    }
}
function f20(obj5) {
    const isFoo = obj5.kind === 'foo';
    if (isFoo) {
        obj5.foo;
    } else {
        obj5.bar;
    }
}
function f21(obj6) {
    const isFoo = obj6.kind === 'foo';
    if (isFoo) {
        obj6.foo; // Not narrowed because isFoo has type annotation
    } else {
        obj6.bar; // Not narrowed because isFoo has type annotation
    }
}
function f22(obj7) {
    let isFoo = obj7.kind === 'foo';
    if (isFoo) {
        obj7.foo; // Not narrowed because isFoo is mutable
    } else {
        obj7.bar; // Not narrowed because isFoo is mutable
    }
}
function f23(obj8) {
    const isFoo = obj8.kind === 'foo';
    obj8 = obj8;
    if (isFoo) {
        obj8.foo; // Not narrowed because obj is assigned in function body
    } else {
        obj8.bar; // Not narrowed because obj is assigned in function body
    }
}
function f24(arg) {
    const obj9 = arg;
    const isFoo = obj9.kind === 'foo';
    if (isFoo) {
        obj9.foo;
    } else {
        obj9.bar;
    }
}
function f25(arg) {
    let obj10 = arg;
    const isFoo = obj10.kind === 'foo';
    if (isFoo) {
        obj10.foo; // Not narrowed because obj is mutable
    } else {
        obj10.bar; // Not narrowed because obj is mutable
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
function f28(obj11) {
    const isFoo = obj11 && obj11.kind === 'foo';
    const isBar = obj11 && obj11.kind === 'bar';
    if (isFoo) {
        obj11.foo;
    }
    if (isBar) {
        obj11.bar;
    }
}
// Narrowing by aliased discriminant property access
function f30(obj12) {
    const kind = obj12.kind;
    if (kind === 'foo') {
        obj12.foo;
    } else {
        obj12.bar;
    }
}
function f31(obj13) {
    const { kind  } = obj13;
    if (kind === 'foo') {
        obj13.foo;
    } else {
        obj13.bar;
    }
}
function f32(obj14) {
    const { kind: k  } = obj14;
    if (k === 'foo') {
        obj14.foo;
    } else {
        obj14.bar;
    }
}
function f33(obj15) {
    const { kind  } = obj15;
    switch(kind){
        case 'foo':
            obj15.foo;
            break;
        case 'bar':
            obj15.bar;
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
function f40(obj16) {
    const { kind  } = obj16;
    const isFoo = kind == 'foo';
    if (isFoo && obj16.foo) {
        let t = obj16.foo;
    }
}
function gg2(obj17) {
    if (obj17.kind === 'str') {
        let t = obj17.payload;
    } else {
        let t = obj17.payload;
    }
}
function foo({ kind , payload  }) {
    if (kind === 'str') {
        let t = payload;
    } else {
        let t = payload;
    }
}
// Repro from #45830
const obj = {
    fn: ()=>true
};
if (a) {}
const a = obj.fn();
