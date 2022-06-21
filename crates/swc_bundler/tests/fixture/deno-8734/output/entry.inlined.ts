const m = "test";
if (!m) {
    throw new Error("b");
}
class Comparator {
    constructor(comp, optionsOrLoose = {}){}
    parse(comp) {
        const m = "another";
        if (!m) {
            throw new TypeError("Invalid comparator: " + comp);
        }
        const m1 = m[1];
        console.log(m1);
        if (!m[2]) {
            console.log("other");
        }
    }
}
const x = new Comparator("boo");
x.parse("test");
export { Comparator as Comparator };
