module.exports = class {
    bar() {
        return 1;
    }
};
import A from './mod1';
A.prototype.foo = 0, A.prototype.func = function() {
    this._func = 0;
}, Object.defineProperty(A.prototype, "def", {
    value: 0
}), new A().bar, new A().foo, new A().func(), new A().def;
