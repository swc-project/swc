let _call_a, _call_b, _call_c, _call_s, _initProto, _initStatic;
const dec = ()=>{};
class Foo {
    static{
        ({ e: [_call_s, _call_a, _call_b, _call_c, _initProto, _initStatic] } = _apply_decs_2311(this, [], [
            [
                dec,
                10,
                "s",
                function(x) {
                    return x;
                }
            ],
            [
                dec,
                2,
                "a",
                function(x, y) {
                    return this.value + x + y;
                }
            ],
            [
                dec,
                2,
                "b",
                function(x = 1, ...rest) {
                    return [
                        x,
                        rest
                    ];
                }
            ],
            [
                dec,
                2,
                "c",
                function({ x }, [y]) {
                    return x + y;
                }
            ]
        ], 0, (o)=>#a in o));
        _initStatic(this);
    }
    value = (_initProto(this), 1);
    get #a() {
        return _call_a;
    }
    get #b() {
        return _call_b;
    }
    get #c() {
        return _call_c;
    }
    static get #s() {
        return _call_s;
    }
    call() {
        return [
            this.#a(1, 2),
            this.#b(),
            this.#c({
                x: 1
            }, [
                2
            ])
        ];
    }
}
