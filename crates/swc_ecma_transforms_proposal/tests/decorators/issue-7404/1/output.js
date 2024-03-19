var _init_bar, _initProto;
function minusTwo({ set, get }) {
    return {
        set (v) {
            set.call(this, v - 2);
            set.call(this, v - 2);
        },
        init (v) {
            return v - 2;
        }
    };
}
function timesFour({ set, get }) {
    return {
        set (v) {
            set.call(this, v * 4);
        },
        init (v) {
            return v * 4;
        }
    };
}
class Foo {
    static{
        ({ e: [_init_bar, _initProto] } = _apply_decs_2203_r(this, [
            [
                [
                    timesFour,
                    minusTwo
                ],
                1,
                "bar"
            ]
        ], []));
    }
    #___private_bar = (_initProto(this), _init_bar(this, 5));
    get bar() {
        return this.#___private_bar;
    }
    set bar(_v) {
        this.#___private_bar = _v;
    }
}
const foo = new Foo();
console.log({
    init: foo.bar
});
foo.bar = 5;
console.log({
    set: foo.bar
});
