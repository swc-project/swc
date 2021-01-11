const m = "test";
if (!m) {
    throw new Error('b');
}
class Comparator {
    constructor(comp1, optionsOrLoose = {
    }){
    }
    parse(comp) {
        const m1 = "another";
        if (!m1) {
            throw new TypeError("Invalid comparator: " + comp);
        }
        const m11 = m1[1];
        console.log(m11);
        if (!m1[2]) {
            console.log('other');
        }
    }
}
const x = new Comparator('boo');
x.parse('test');
const Comparator1 = Comparator;
export { Comparator as Comparator };
