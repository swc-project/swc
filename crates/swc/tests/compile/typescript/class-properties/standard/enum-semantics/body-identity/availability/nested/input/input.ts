enum Outer {
    First = (() => {
        enum Local { A = "local", B = A }
        const text = "text";
        enum Derived { A = text }
        return Local.B + Derived.A;
    })(),
    Next = "next",
    Prior = (Next as string),
    Shorthand = (() => ({ Next }))().Next,
    Forward = (Last as string),
    Last = "last"
}
function nested() {
    enum E {
        A = (() => { enum Local { A = "a", B = A } return Local.B; })(),
        B = "b",
        C = (() => B)(),
    }
    return E;
}
