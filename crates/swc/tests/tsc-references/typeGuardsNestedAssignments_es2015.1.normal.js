// @strictNullChecks: true
class Foo {
}
function f1() {
    let foo;
    if ((foo = getFooOrNull()) !== null) {
        foo; // Foo
    }
}
function f2() {
    let foo1;
    let foo2;
    if ((foo1 = getFooOrNull(), foo2 = foo1) !== null) {
        foo1; // Foo | null
        foo2; // Foo
    }
}
function f3() {
    let obj;
    if ((obj = getFooOrNull()) instanceof Foo) {
        obj;
    }
}
function f4() {
    let x;
    if (typeof (x = getStringOrNumberOrNull()) === "number") {
        x;
    }
}
// Repro from #8851
const re = /./g;
let match;
while((match = re.exec("xxx")) != null){
    const length = match[1].length + match[2].length;
}
