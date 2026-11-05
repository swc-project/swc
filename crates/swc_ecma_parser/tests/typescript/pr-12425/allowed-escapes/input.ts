async function f() {
    let { aw\u0061it: x = 1 } = obj;
    ({ aw\u0061it: 1 });
    type A<T> = T extends infer aw\u0061it ? T : never;
    function nested() { let { aw\u0061it = 1 } = obj; }
}
function* g() {
    let { y\u0069eld: x = 1 } = obj;
    ({ y\u0069eld: 1 });
}
let { aw\u0061it = 1, y\u0069eld = 2 } = obj;
