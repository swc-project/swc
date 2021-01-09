class Comparator {
    constructor(comp1, optionsOrLoose = {
    }){
    }
    parse(comp) {
        const m = "another";
        if (!m) {
            throw new TypeError("Invalid comparator: " + comp);
        }
        const m1 = m[1];
        console.log(m1);
        if (!m[2]) {
            console.log('other');
        }
    }
}
const x = new Comparator('boo');
x.parse('test');
const Comparator1 = Comparator;
export { Comparator as Comparator };
