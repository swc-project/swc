//// [privateNameFieldDestructuredBinding.ts]
class A {
    #field;
    testObject() {
        return {
            x: 10,
            y: 6
        };
    }
    testArray() {
        return [
            10,
            11
        ];
    }
    constructor(){
        this.#field = 1;
        this.otherObject = new A();
        let y;
        ({ x: this.#field, y } = this.testObject());
        [this.#field, y] = this.testArray();
        ({ a: this.#field, b: [this.#field] } = {
            a: 1,
            b: [
                2
            ]
        });
        [this.#field, [this.#field]] = [
            1,
            [
                2
            ]
        ];
        ({ a: this.#field = 1, b: [this.#field = 1] } = {
            b: []
        });
        [this.#field = 2] = [];
        [this.otherObject.#field = 2] = [];
    }
    static test(_a) {
        [_a.#field] = [
            2
        ];
    }
}
