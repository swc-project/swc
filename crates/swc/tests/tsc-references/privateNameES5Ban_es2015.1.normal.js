var _method = new WeakSet(), _acc = new WeakSet(), _acc = new WeakSet();
// @target: es5, es3
class A {
    constructor(){
        _field.set(this, {
            writable: true,
            value: 123
        });
        _method.add(this);
        _acc.add(this);
        _acc.add(this);
    }
}
var _field = new WeakMap();
var _sField = {
    writable: true,
    value: "hello world"
};
function method() {}
function sMethod() {}
function acc() {
    return "";
}
function acc(x) {}
function sAcc() {
    return 0;
}
function sAcc(x) {}
