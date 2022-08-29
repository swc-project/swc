//// [genericSetterInClassTypeJsDoc.js]
/**
 * @template T
 */ class Box {
    #value;
    /** @param {T} initialValue */ constructor(initialValue){
        this.#value = initialValue;
    }
    /** @type {T} */ get value() {
        return this.#value;
    }
    set value(value) {
        this.#value = value;
    }
}
new Box(3).value = 3;
