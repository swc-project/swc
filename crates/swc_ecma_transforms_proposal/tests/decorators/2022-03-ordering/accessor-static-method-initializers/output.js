var _initClass, _dec, _dec2, _dec3, _dec4, _init_a, _dec5, _dec6, _dec7, _dec8, _call_c, _dec9, _dec10, _init_d, _get_d, _set_d, _initProto, _initStatic;

let _A;
_dec = logClassDecoratorRun(0, 19, 29);
_dec2 = logClassDecoratorRun(1, 18, 28);
_dec3 = logAccessorDecoratorRun(2, 15, 31, 35);
_dec4 = logAccessorDecoratorRun(3, 14, 30, 34);
_dec5 = logMethodDecoratorRun(4, 11, 21, 25);
_dec6 = logMethodDecoratorRun(5, 10, 20, 24);
_dec7 = logMethodDecoratorRun(6, 13, 23, 27);
_dec8 = logMethodDecoratorRun(7, 12, 22, 26);
_dec9 = logAccessorDecoratorRun(8, 17, 33, 37);
_dec10 = logAccessorDecoratorRun(9, 16, 32, 36);
new class extends _identity {
    static {
        class A {
            static {
                ({
                    e: [_call_c, _init_a, _init_d, _get_d, _set_d, _initProto, _initStatic],
                    c: [_A, _initClass]
                } = _applyDecs2203R(this, [[[_dec5, _dec6], 7, "b"], [[_dec7, _dec8], 7, "c", function () { }], [[_dec3, _dec4], 1, "a"], [[_dec9, _dec10], 1, "d", function () {
                    return this.#B;
                }, function (value) {
                    this.#B = value;
                }]], [_dec, _dec2]));
                _initStatic(this);
            }
            #A = (_initProto(this), _init_a(this));
            get a() {
                return this.#A;
            }
            set a(v) {
                this.#A = v;
            }
            static b() { }
            #B = _init_d(this);
            set #d(v) {
                _set_d(this, v);
            }
            get #d() {
                return _get_d(this);
            }
            constructor() {
                this.a = this.#d = null;
            }
        }
    }
    #c = _call_c;
    constructor() {
        super(_A), (() => {
            _A.b(), _A.#c();
        })(), _initClass();
    }
}();