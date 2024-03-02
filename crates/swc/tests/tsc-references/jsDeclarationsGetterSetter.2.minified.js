//// [index.js]
export class A {
    get x() {
        return 12;
    }
}
export class B {
    set x(_arg) {}
}
export class C {
    get x() {
        return 12;
    }
    set x(_arg) {}
}
export class D {
}
Object.defineProperty(D.prototype, "x", {
    get: ()=>12
});
export class E {
}
Object.defineProperty(E.prototype, "x", {
    set (_arg) {}
});
export class F {
}
Object.defineProperty(F.prototype, "x", {
    get: ()=>12,
    set (_arg) {}
});
export class G {
}
Object.defineProperty(G.prototype, "x", {
    set (...args) {}
});
export class H {
}
Object.defineProperty(H.prototype, "x", {
    set () {}
});
export class I {
}
Object.defineProperty(I.prototype, "x", {
    set: (v)=>{}
});
export class J {
}
Object.defineProperty(J.prototype, "x", {
    set: (v)=>{}
});
export class K {
}
Object.defineProperty(K.prototype, "x", {
    set: Math.random() ? (v)=>{} : (v)=>{}
});
export class L {
}
Object.defineProperty(L.prototype, "x", {
    set: Math.random() ? (v)=>{} : (v)=>{}
});
export class M {
}
Object.defineProperty(M.prototype, "x", {
    set: Math.random() ? (v)=>{} : (v)=>{}
});
