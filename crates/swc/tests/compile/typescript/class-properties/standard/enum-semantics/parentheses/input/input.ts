namespace N {
    export const x = 31;
    export enum E { A = 2, "\ud800" = "surrogate" }
}
enum Values {
    Dot = ((N)).x,
    Computed = N[("x")],
    AfterComputed,
    Enum = ((N)[("E")])[("A")],
    AfterEnum
}
const grouped = ((N)[("E")])[("A")];
const surrogate = (N.E)[("\ud800")];
