//// [accessorsOverrideProperty.ts]
class A {
    p = 'yep';
}
class B extends A {
    get p() {
        return 'oh no';
    }
}
class C {
    p = 101;
}
class D extends C {
    _secret = 11;
    get p() {
        return this._secret;
    }
    set p(value) {
        this._secret = value;
    }
}
