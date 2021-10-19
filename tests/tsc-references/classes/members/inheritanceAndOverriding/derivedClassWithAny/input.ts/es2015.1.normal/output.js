class C {
    get X() {
        return 1;
    }
    foo() {
        return 1;
    }
    static get Y() {
        return 1;
    }
    static bar() {
        return 1;
    }
}
class D extends C {
    get X() {
        return null;
    }
    foo() {
        return 1;
    }
    static get Y() {
        return null;
    }
    static bar() {
        return null;
    }
}
// if D is a valid class definition than E is now not safe tranisitively through C
class E extends D {
    get X() {
        return '';
    }
    foo() {
        return '';
    }
    static get Y() {
        return '';
    }
    static bar() {
        return '';
    }
}
var c;
var d;
var e;
c = d;
c = e;
var r = c.foo(); // e.foo would return string
