//// [genericSetterInClassType.ts]
(function(Generic) {
    class C {
        get y() {
            return 1;
        }
        set y(v) {}
    }
    var c = new C();
    c.y = c.y;
    class Box {
        #value;
        get value() {
            return this.#value;
        }
        set value(value) {
            this.#value = value;
        }
    }
    new Box().value = 3;
})(Generic || (Generic = {}));
var Generic;
