var _initClass, _init_b, _init_c, _get___c, _set___c, _call_d, _initProto, _initStatic;
let _A;
class A {
    static{
        ({ e: [_init_b, _init_c, _get___c, _set___c, _call_d, _initProto, _initStatic], c: [_A, _initClass] } = _apply_decs_2203_r(this, [
            [
                dec3,
                6,
                "b"
            ],
            [
                dec4,
                6,
                "c",
                function() {
                    return this.#__c;
                },
                function(_v) {
                    this.#__c = _v;
                }
            ],
            [
                dec2,
                2,
                "a"
            ],
            [
                dec5,
                2,
                "d",
                function() {}
            ]
        ], [
            dec1
        ]));
        _initStatic(this);
    }
    constructor(){
        _initProto(this);
    }
    a() {}
    static #___private_b = _init_b(this);
    static get b() {
        return this.#___private_b;
    }
    static set b(_v) {
        this.#___private_b = _v;
    }
    static #__c = _init_c(this);
    static get #c() {
        return _get___c(this);
    }
    static set #c(_v) {
        _set___c(this, _v);
    }
    get #d() {
        return _call_d;
    }
    static{
        _initClass();
    }
}
