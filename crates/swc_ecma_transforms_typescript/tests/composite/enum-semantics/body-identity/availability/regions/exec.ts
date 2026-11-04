function deferred() { enum E { A = outer } return E; }
const arrow = () => { enum E { A = outer } return E; };
class C {
    field = (() => { enum E { A = outer } return E; })();
    constructor() { enum E { A = outer } this.ctor = E; }
    method() { enum E { A = outer } return E; }
}
function staticField() { class S { static field = (() => { enum E { A = local } return E; })(); } const local = "local"; return S; }
function cachedBefore() {
    function prime() { enum E { A = local } return E; }
    enum Before { A = local }
    const local = "local";
    return [prime(), Before];
}
const outer = "outer";
expect(deferred()).toEqual({ A: "outer" });
expect(arrow()).toEqual({ A: "outer" });
const c = new C();
expect(c.field).toEqual({ A: "outer" });
expect(c.ctor).toEqual({ A: "outer" });
expect(c.method()).toEqual({ A: "outer" });
expect(staticField).toThrow(ReferenceError);
expect(cachedBefore).toThrow(ReferenceError);
function enumDeferred() { enum E { A = Later.A } return E; }
function enumCachedBefore() {
    function prime() { enum E { A = Local.A } return E; }
    enum Before { A = Local.A }
    enum Local { A = "local" }
    return [prime(), Before];
}
enum Later { A = "later" }
expect(enumDeferred()).toEqual({ A: "later" });
expect(enumCachedBefore).toThrow(ReferenceError);
