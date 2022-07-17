// @declaration: true
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
function f1(x) {
    x.p; // Error, private constituent makes property inaccessible
}
function f2(x) {
    x.p; // Error, private constituent makes property inaccessible
}
function f3(x) {
    x.p; // Error, private constituent makes property inaccessible
}
function f4(x) {
    x.p; // Error, protected when all constituents are protected
}
function f5(x) {
    x.p; // Ok, public if any constituent is public
}
function f6(x) {
    x.p; // Ok, public if any constituent is public
}
// Can't derive from type with inaccessible properties
class C1 extends Mix(Private, Private2) {
}
class C2 extends Mix(Private, Protected) {
}
class C3 extends Mix(Private, Public) {
}
class C4 extends Mix(Protected, Protected2) {
    f(c4, c5, c6) {
        c4.p;
        c5.p;
        c6.p;
    }
    static g() {
        C4.s;
        C5.s;
        C6.s;
    }
}
class C5 extends Mix(Protected, Public) {
    f(c4, c5, c6) {
        c4.p; // Error, not in class deriving from Protected2
        c5.p;
        c6.p;
    }
    static g() {
        C4.s; // Error, not in class deriving from Protected2
        C5.s;
        C6.s;
    }
}
class C6 extends Mix(Public, Public2) {
    f(c4, c5, c6) {
        c4.p; // Error, not in class deriving from Protected2
        c5.p;
        c6.p;
    }
    static g() {
        C4.s; // Error, not in class deriving from Protected2
        C5.s;
        C6.s;
    }
}
class ProtectedGeneric {
    privateMethod() {}
    protectedMethod() {}
}
class ProtectedGeneric2 {
    privateMethod() {}
    protectedMethod() {}
}
function f7(x) {
    x.privateMethod(); // Error, private constituent makes method inaccessible
    x.protectedMethod(); // Error, protected when all constituents are protected
}
function f8(x) {
    x.privateMethod(); // Error, private constituent makes method inaccessible
    x.protectedMethod(); // Error, protected when all constituents are protected
}
function f9(x) {
    x.privateMethod(); // Error, private constituent makes method inaccessible
    x.protectedMethod(); // Error, protected when all constituents are protected
}
