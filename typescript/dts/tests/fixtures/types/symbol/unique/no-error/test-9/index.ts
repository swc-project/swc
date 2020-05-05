// declarations with call initializer
const constCall = Symbol();
let letCall = Symbol();
var varCall = Symbol();

// ambient declaration with type
declare const constType: unique symbol;

// declaration with type and call initializer
const constTypeAndCall: unique symbol = Symbol();

// type literals
type L = {
    readonly readonlyType: unique symbol;
    nested: {
        readonly readonlyNestedType: unique symbol;
    }
};
declare const l: L;

const constInitToLReadonlyType = l.readonlyType;
const constInitToLReadonlyNestedType = l.nested.readonlyNestedType;
const constInitToLReadonlyTypeWithTypeQuery: typeof l.readonlyType = l.readonlyType;
const constInitToLReadonlyNestedTypeWithTypeQuery: typeof l.nested.readonlyNestedType = l.nested.readonlyNestedType;
const constInitToLReadonlyTypeWithIndexedAccess: L["readonlyType"] = l.readonlyType;
const constInitToLReadonlyNestedTypeWithIndexedAccess: L["nested"]["readonlyNestedType"] = l.nested.readonlyNestedType;

// type argument inference
const promiseForConstCall = Promise.resolve(constCall);
const arrayOfConstCall = [constCall];

// unique symbol widening in expressions
declare const s: unique symbol;
declare namespace N {
    const s: unique symbol;
}
declare const o: { [s]: "a", [N.s]: "b" };

declare function f<T>(x: T): T;

declare function g(x: typeof s): void;
declare function g(x: typeof N.s): void;


// argument inference
f(s);
f(N.s);
f(N["s"]);

// array literal elements
[s];
[N.s];
[N["s"]];

// property assignments/methods
const o2 = {
    a: s,
    b: N.s,
    c: N["s"],

    method1() {
        return s;
    },
    async method2() {
        return s;
    },
    async* method3() {
        yield s;
    },
    * method4() {
        yield s;
    },
    method5(p = s) {
        return p;
    }
};

// property initializers
class C0 {
    static readonly a = s;
    static readonly b = N.s;
    static readonly c = N["s"];

    static d = s;
    static e = N.s;
    static f = N["s"];

    readonly a = s;
    readonly b = N.s;
    readonly c = N["s"];

    d = s;
    e = N.s;
    f = N["s"];

    method1() {
        return s;
    }

    async method2() {
        return s;
    }

    async* method3() {
        yield s;
    }

    * method4() {
        yield s;
    }

    method5(p = s) {
        return p;
    }
}

// non-widening positions

// element access
o[s];
o[N.s];
o[N["s"]];

// arguments (no-inference)
f<typeof s>(s);
f<typeof N.s>(N.s);
f<typeof N.s>(N["s"]);
g(s);
g(N.s);
g(N["s"]);

// falsy expressions
s || "";
N.s || "";
N["s"] || "";

// conditionals
Math.random() * 2 ? s : "a";
Math.random() * 2 ? N.s : "a";
Math.random() * 2 ? N["s"] : "a";

// computed property names
({
    [s]: "a",
    [N.s]: "b",
});

class C1 {
    static [s]: "a";
    static [N.s]: "b";

    [s]: "a";
    [N.s]: "b";
}

// contextual types

interface Context {
    method1(): typeof s;

    method2(): Promise<typeof s>;

    method3(): AsyncIterableIterator<typeof s>;

    method4(): IterableIterator<typeof s>;

    method5(p?: typeof s): typeof s;
}

const o4: Context = {
    method1() {
        return s; // return type should not widen due to contextual type
    },
    async method2() {
        return s; // return type should not widen due to contextual type
    },
    async* method3() {
        yield s; // yield type should not widen due to contextual type
    },
    * method4() {
        yield s; // yield type should not widen due to contextual type
    },
    method5(p = s) { // parameter should not widen due to contextual type
        return p;
    }
};