async function f() {
    let { aw\u0061it } = obj;
    let [{ aw\u{61}it = 1 }] = xs;
    for (let { aw\u0061it = 1 } of xs) {}
    ({ aw\u0061it });
    ({ aw\u0061it = 1 }) => 0;
}
function* g() {
    let { y\u0069eld } = obj;
    let [{ y\u{69}eld = 1 }] = xs;
    for (let { y\u0069eld = 1 } of xs) {}
    ({ y\u0069eld = 1 } = obj);
    ({ y\u0069eld = 1 }) => 0;
}
class C {
    static {
        let { aw\u0061it } = obj;
        ({ aw\u0061it = 1 }) => 0;
    }
}
