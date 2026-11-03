function deferred() {
    const value = outer;
    enum E { A = value, B }
    return E.B;
}
class Instance {
    value = (() => { enum E { A = outer, B } return E.B; })();
}
class Methods {
    [(() => { enum E { A = outer, B } return E.B; })()]() { return 1; }
    get [(() => { enum E { A = outer } return E.A; })()]() { return 2; }
}
const methods = {
    [(() => { enum E { A = outer, B } return E.B; })()]() { return 3; },
    get [(() => { enum E { A = outer } return E.A; })()]() { return 4; }
};
const outer = 42;
let immediateFailed = false;
try {
    (() => { enum E { A = later, B } return E.B; })();
} catch { immediateFailed = true; }
const later = 7;
