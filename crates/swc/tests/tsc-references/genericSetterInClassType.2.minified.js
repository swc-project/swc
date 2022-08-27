//// [genericSetterInClassType.ts]
var Generic;
!function(Generic) {
    var c = new class {
        get y() {
            return 1;
        }
        set y(v) {}
    }();
    c.y = c.y, new class {
        #value;
        get value() {
            return this.#value;
        }
        set value(value) {
            this.#value = value;
        }
    }().value = 3;
}(Generic || (Generic = {}));
