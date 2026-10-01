type aw\u0061it = string;
type y\u0069eld = number;
let { aw\u{61}it = 1, y\u{69}eld = 2 } = obj;
async function f() {
    let { aw\u{61}it: x = 1 } = obj;
    ({ aw\u{61}it: 1 });
    function nested({ aw\u0061it = 1 }) {}
    await \u0066oo;
    await /* lookahead */ \u0066oo;
    type A<T> = T extends infer aw\u0061it ? T : never;
}
function* g() {
    let { y\u{69}eld: x = 1 } = obj;
    ({ y\u{69}eld: 1 });
    function nested({ y\u0069eld = 1 }) {}
}
class C {
    static {
        let { aw\u0061it: x = 1 } = obj;
        function nested({ aw\u0061it = 1 }) {}
    }
}
