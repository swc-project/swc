var _dec, _dec1, _initClass, _dec2, _dec3, _dec4, _dec5, _dec6, _dec7, _dec8, _dec9, _init_a, _call_c, _init_d, _get___d, _set___d, _initProto, _initStatic;
let _A;
_dec = logClassDecoratorRun(0, 19, 29), _dec1 = logClassDecoratorRun(1, 18, 28), _dec2 = logAccessorDecoratorRun(2, 15, 31, 35), _dec3 = logAccessorDecoratorRun(3, 14, 30, 34), _dec4 = logMethodDecoratorRun(4, 11, 21, 25), _dec5 = logMethodDecoratorRun(5, 10, 20, 24), _dec6 = logMethodDecoratorRun(6, 13, 23, 27), _dec7 = logMethodDecoratorRun(7, 12, 22, 26), _dec8 = logAccessorDecoratorRun(8, 17, 33, 37), _dec9 = logAccessorDecoratorRun(9, 16, 32, 36);
new class extends _identity {
    constructor(){
        super(_A), (()=>{
            _A.b(), _A.#c();
        })(), _initClass();
    }
    static{
        class A {
            static{
                ({ e: [_call_c, _init_a, _init_d, _get___d, _set___d, _initProto, _initStatic], c: [_A, _initClass] } = _apply_decs_2203_r(this, [
                    [
                        [
                            _dec4,
                            _dec5
                        ],
                        7,
                        "b"
                    ],
                    [
                        [
                            _dec6,
                            _dec7
                        ],
                        7,
                        "c",
                        function() {}
                    ],
                    [
                        [
                            _dec2,
                            _dec3
                        ],
                        1,
                        "a"
                    ],
                    [
                        [
                            _dec8,
                            _dec9
                        ],
                        1,
                        "d",
                        function() {
                            return this.#__d_2;
                        },
                        function(_v) {
                            this.#__d_2 = _v;
                        }
                    ]
                ], [
                    _dec,
                    _dec1
                ]));
                _initStatic(this);
            }
            #___private_a_1 = (_initProto(this), _init_a(this));
            get a() {
                return this.#___private_a_1;
            }
            set a(_v) {
                this.#___private_a_1 = _v;
            }
            static b() {}
            #__d_2 = _init_d(this);
            get #d() {
                return _get___d(this);
            }
            set #d(_v) {
                _set___d(this, _v);
            }
            constructor(){
                this.a = this.#d = null;
            }
        }
    }
    get #c() {
        return _call_c;
    }
}();
