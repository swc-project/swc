const m = "test";
if (!m) {
    throw new Error("b");
}
class Comparator {
    constructor(comp, optionsOrLoose = {}){}
    parse(comp) {
        const m2 = "another";
        if (!m2) {
            throw new TypeError("Invalid comparator: " + comp);
        }
        const m1 = m2[1];
        console.log(m1);
        if (!m2[2]) {
            console.log("other");
        }
    }
}
const x = new Comparator("boo");
x.parse("test");
export { Comparator as Comparator };
