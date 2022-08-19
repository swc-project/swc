class Private {
    constructor(...args){}
}
class Protected {
    constructor(...args){}
}
class Protected2 {
    constructor(...args){}
}
class Public {
    constructor(...args){}
}
class Public2 {
    constructor(...args){}
}
Mix(Private, class {
    constructor(...args){}
}), Mix(Private, Protected), Mix(Private, Public);
class C4 extends Mix(Protected, Protected2) {
    f(c4, c5, c6) {
        c4.p, c5.p, c6.p;
    }
    static g() {
        C4.s, C5.s, C6.s;
    }
}
class C5 extends Mix(Protected, Public) {
    f(c4, c5, c6) {
        c4.p, c5.p, c6.p;
    }
    static g() {
        C4.s, C5.s, C6.s;
    }
}
class C6 extends Mix(Public, Public2) {
    f(c4, c5, c6) {
        c4.p, c5.p, c6.p;
    }
    static g() {
        C4.s, C5.s, C6.s;
    }
}
