//// [genericSetterInClassTypeJsDoc.js]
/**
 * @template T
 */ new class {
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
}(3).value = 3;
