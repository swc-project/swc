var _fooMethod = new WeakSet(), _fooProp = new WeakSet(), _fooProp = new WeakSet();
// @strict: true
// @target: es6
class A {
    constructor(){
        _fooField.set(this, {
            writable: true,
            value: 3
        });
        _fooMethod.add(this);
        _fooProp.add(this);
        _fooProp.add(this);
        this.bar = 3;
        this.baz = 3;
    }
}
var _fooField = new WeakMap();
function fooMethod() {}
function fooProp() {
    return 1;
}
function fooProp(value) {}
// `keyof A` should not include '#foo*'
let k = "bar"; // OK
k = "baz"; // OK
k = "#fooField"; // Error
k = "#fooMethod"; // Error
k = "#fooProp"; // Error
k = "fooField"; // Error
k = "fooMethod"; // Error
k = "fooProp"; // Error
