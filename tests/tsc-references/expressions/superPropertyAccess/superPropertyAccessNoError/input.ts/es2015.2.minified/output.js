class SomeBaseClass {
    func() {
        return "";
    }
    static func() {
        return 3;
    }
    returnThis() {
        return this;
    }
}
new class extends SomeBaseClass {
    fn() {
        super.func();
    }
    get a() {
        return super.func(), null;
    }
    set a(n) {
        super.func();
    }
    static fn() {
        super.func();
    }
    static get a() {
        return super.func(), null;
    }
    static set a(n1) {
        super.func();
    }
    returnThis() {
        return super.returnThis();
    }
    constructor(){
        super(), super.func();
    }
}().returnThis().fn();
