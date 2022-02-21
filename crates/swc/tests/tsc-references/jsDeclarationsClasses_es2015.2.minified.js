export class A {
}
export class B {
}
B.cat = "cat";
export class C {
}
C.Cls = class {
};
export class D {
    constructor(a, b){}
}
export class E {
    get f1() {
        return null;
    }
    set f1(_p) {}
    get f2() {
        return null;
    }
    set f3(_p) {}
    static get s1() {
        return "";
    }
    static set s1(_p) {}
    static get s2() {
        return "";
    }
    static set s3(_p) {}
    constructor(a, b){
        this.initializedField = 12;
    }
}
E.staticInitializedField = 12;
export class F {
    static create(a, b) {
        return new F(a, b);
    }
    constructor(a, b){}
}
class G {
}
class HH {
}
export class I {
}
export class J {
}
export class K {
    method() {
        return this.p1;
    }
    constructor(){
        this.p1 = 12, this.p2 = "ok";
    }
}
export class L extends K {
}
export class M extends null {
    constructor(){
        this.prop = 12;
    }
}
export class N extends L {
    constructor(param){
        super(), this.another = param;
    }
}
export class O extends N {
    constructor(param){
        super(param), this.another2 = param;
    }
}
var x = null;
export class VariableBase extends x {
}
export class HasStatics {
    static staticMethod() {}
}
export class ExtendsStatics extends HasStatics {
    static also() {}
}
export { G, HH as H, I as II, J as JJ };
