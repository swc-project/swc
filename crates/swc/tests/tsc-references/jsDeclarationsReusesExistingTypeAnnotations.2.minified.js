//// [index.js]
class С1 {
    p1 = void 0;
    p2 = void 0;
    p3 = null;
    p4 = null;
}
class С2 {
    get p1() {}
    get p2() {}
    get p3() {
        return null;
    }
    get p4() {
        return null;
    }
}
class С3 {
    get p1() {}
    set p1(value) {
        this.p1 = value;
    }
    get p2() {}
    set p2(value) {
        this.p2 = value;
    }
    get p3() {
        return null;
    }
    set p3(value) {
        this.p3 = value;
    }
    get p4() {
        return null;
    }
    set p4(value) {
        this.p4 = value;
    }
}
class С4 {
    set p1(value) {
        this.p1 = value;
    }
    set p2(value) {
        this.p2 = value;
    }
    set p3(value) {
        this.p3 = value;
    }
    set p4(value) {
        this.p4 = value;
    }
}
