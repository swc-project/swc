var _initClass, _dec, _dec2, _dec3, _dec4, _dec5, _dec6, _dec7, _dec8, _call_c, _dec9, _dec10, _call_d, _dec11, _dec12, _init_e, _dec13, _dec14, _init_f, _dec15, _dec16, _init_g, _get_g, _set_g, _dec17, _dec18, _init_h, _get_h, _set_h, _initProto, _initStatic;
let _A;
_dec = logDecoratorRun(0, 35, 45);
_dec2 = logDecoratorRun(1, 34, 44);
_dec3 = logDecoratorRun(2, 27, 47);
_dec4 = logDecoratorRun(3, 26, 46);
_dec5 = logDecoratorRun(4, 19, 37);
_dec6 = logDecoratorRun(5, 18, 36);
_dec7 = logDecoratorRun(6, 21, 39);
_dec8 = logDecoratorRun(7, 20, 38);
_dec9 = logDecoratorRun(8, 29, 49);
_dec10 = logDecoratorRun(9, 28, 48);
_dec11 = logDecoratorRun(10, 31, 51);
_dec12 = logDecoratorRun(11, 30, 50);
_dec13 = logDecoratorRun(12, 23, 41);
_dec14 = logDecoratorRun(13, 22, 40);
_dec15 = logDecoratorRun(14, 25, 43);
_dec16 = logDecoratorRun(15, 24, 42);
_dec17 = logDecoratorRun(16, 33, 53);
_dec18 = logDecoratorRun(17, 32, 52);
new class extends _identity {
    static {
        class A {
            static {
                ({
                    e: [_call_c, _init_f, _init_g, _get_g, _set_g, _call_d, _init_e, _init_h, _get_h, _set_h, _initProto, _initStatic],
                    c: [_A, _initClass]
                } = _applyDecs2203R(this, [[[_dec5, _dec6], 7, "b"], [[_dec7, _dec8], 7, "c", function () { }], [[_dec13, _dec14], 6, "f"], [[_dec15, _dec16], 6, "g", function () {
                    return this.#C;
                }, function (value) {
                    this.#C = value;
                }], [[_dec3, _dec4], 2, "a"], [[_dec9, _dec10], 2, "d", function () { }], [[_dec11, _dec12], 1, "e"], [[_dec17, _dec18], 1, "h", function () {
                    return this.#D;
                }, function (value) {
                    this.#D = value;
                }]], [_dec, _dec2]));
                _initStatic(this);
            }
            #d = _call_d;
            a() { }
            static b() { }
            #A = (_initProto(this), _init_e(this));
            get e() {
                return this.#A;
            }
            set e(v) {
                this.#A = v;
            }
            static get f() {
                return this.#B;
            }
            static set f(v) {
                this.#B = v;
            }
            set #g(v) {
                _set_g(this, v);
            }
            get #g() {
                return _get_g(this);
            }
            #D = _init_h(this);
            set #h(v) {
                _set_h(this, v);
            }
            get #h() {
                return _get_h(this);
            }
        }
    }
    #c = _call_c;
    #B = _init_f(this);
    #C = _init_g(this);
    constructor() {
        super(_A), _initClass();
    }
}();