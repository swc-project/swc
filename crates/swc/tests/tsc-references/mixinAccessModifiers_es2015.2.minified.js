class Private {
    constructor(...args){}
}
class Private2 {
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
class C1 extends Mix(Private, Private2) {
}
class C2 extends Mix(Private, Protected) {
}
class C3 extends Mix(Private, Public) {
}
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
