//// [genericSetterInClassTypeJsDoc.js]
new class {
    #value;
    constructor(initialValue){
        this.#value = initialValue;
    }
    get value() {
        return this.#value;
    }
    set value(value) {
        this.#value = value;
    }
}(3).value = 3;
