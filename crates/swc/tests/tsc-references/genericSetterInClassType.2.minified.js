//// [genericSetterInClassType.ts]
var Generic, c;
Generic || (Generic = {}), c.y = (c = new class {
    get y() {
        return 1;
    }
    set y(v) {}
}()).y, new class {
    #value;
    get value() {
        return this.#value;
    }
    set value(value) {
        this.#value = value;
    }
}().value = 3;
