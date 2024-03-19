function minusTwo({
    set,
    get
}) {
    return {
        set(v) {
            set.call(this, v - 2);
        },
        init(v) {
            return v - 2;
        }
    };
}
function timesFour({
    set,
    get
}) {
    return {
        set(v) {
            set.call(this, v * 4);
        },
        init(v) {
            return v * 4;
        }
    };
}
var _A = /*#__PURE__*/new WeakMap();
class Foo {
    constructor() {
        _classPrivateFieldInitSpec(this, _A, _init_bar(this, 5));
        _init_extra_bar(this);
    }
    get bar() {
        return _classPrivateFieldGet(_A, this);
    }
    set bar(v) {
        _classPrivateFieldSet(_A, this, v);
    }
}
_Foo = Foo;
[_init_bar, _init_extra_bar] = _applyDecs(_Foo, [], [[[minusTwo, timesFour], 1, "bar"]]).e;
const foo = new Foo();
console.log({
    init: foo.bar
});
foo.bar = 5;
console.log({
    set: foo.bar
});