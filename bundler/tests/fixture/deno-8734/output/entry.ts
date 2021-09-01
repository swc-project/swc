const m = "test";
if (!m) {
    throw new Error('b');
}
class Comparator1 {
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
const x = new Comparator1('boo');
x.parse('test');
export { Comparator1 as Comparator };
