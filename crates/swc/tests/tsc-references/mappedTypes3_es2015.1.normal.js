// @declaration: true
class Box {
}
function f1(b) {
    let bb = boxify(b);
    let isPerfect = bb.isPerfect.value;
    let weight = bb.weight.value;
}
function f2(bb) {
    let b = unboxify(bb); // Infer Bacon for T
    let bool = b.isPerfect;
    let weight = b.weight;
}
function f3(bb) {
    let b = unboxify(bb); // Explicit type parameter required
    let bool = b.isPerfect;
    let weight = bb.weight;
}
