//// [genericSetterInClassType.ts]
var Generic, c;
Generic || (Generic = {}), (c = new class {
    get y() {
        return 1;
    }
    set y(v) {}
}()).y = c.y, new class {
    #value;
    get value() {
        return this.#value;
    }
    set value(value) {
        this.#value = value;
    }
}().value = 3;
