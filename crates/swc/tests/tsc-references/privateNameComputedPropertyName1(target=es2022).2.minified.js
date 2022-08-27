//// [privateNameComputedPropertyName1.ts]
new class {
    #a = 'a';
    #b;
    #c = 'c';
    #d;
    #e = '';
    constructor(){
        this.#b = 'b', this.#d = 'd';
    }
    test() {
        let data = {
            a: 'a',
            b: 'b',
            c: 'c',
            d: 'd',
            e: 'e'
        }, { [this.#a]: a , [this.#b]: b , [this.#c]: c , [this.#d]: d , [this.#e = 'e']: e ,  } = data;
        console.log(a, b, c, d, e);
        let a1 = data[this.#a], b1 = data[this.#b], c1 = data[this.#c], d1 = data[this.#d];
        data[this.#e], console.log(a1, b1, c1, d1);
    }
}().test();
