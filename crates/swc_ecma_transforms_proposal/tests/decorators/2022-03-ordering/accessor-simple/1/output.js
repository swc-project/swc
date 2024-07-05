var _initClass, _init_b, _init_c, _get___c, _set___c, _call_d, _initProto, _initStatic;
let _A;
new class extends _identity {
    constructor(){
        super(_A), _initClass();
    }
    static{
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
                            return this.#__c_2;
                        },
                        function(_v) {
                            this.#__c_2 = _v;
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
            static get b() {
                return this.#___private_b_1;
            }
            static set b(_v) {
                this.#___private_b_1 = _v;
            }
            get #d() {
                return _call_d;
            }
        }
    }
    #___private_b_1 = _init_b(this);
    #__c_2 = _init_c(this);
    get #c() {
        return _get___c(this);
    }
    set #c(_v) {
        _set___c(this, _v);
    }
}();
