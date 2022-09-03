//// [genericSetterInClassTypeJsDoc.js]
class Box {
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
}
new Box(3).value = 3;
