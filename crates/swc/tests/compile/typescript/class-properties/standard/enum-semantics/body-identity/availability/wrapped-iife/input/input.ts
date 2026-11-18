function asArrow() {
    ((<T>() => { enum E { A = later } return E.A; }) as any)();
    const later = 1;
}
function asFunction() {
    ((function<T>() { enum E { A = later } return E.A; }) as any)();
    const later = 1;
}
function satisfiesArrow() {
    ((<T>() => { enum E { A = later } return E.A; }) satisfies Function)();
    const later = 1;
}
function nonNullFunction() {
    ((function<T>() { enum E { A = later } return E.A; })!)();
    const later = 1;
}
function assertionArrow() {
    (<any>(<T>() => { enum E { A = later } return E.A; }))();
    const later = 1;
}
function instantiationFunction() {
    ((function<T>() { enum E { A = later } return E.A; })<number>)();
    const later = 1;
}
function parenthesizedArrow() {
    (((() => { enum E { A = later } return E.A; })))();
    const later = 1;
}
function parenthesizedFunction() {
    (((function() { enum E { A = later } return E.A; })))();
    const later = 1;
}
function wrappedLocalArrow() {
    ((() => { enum E { A = later } const later = 1; return E.A; }) as any)();
}
