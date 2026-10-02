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

expect(Values.Dot).toBe(31);
expect(Values.Computed).toBe(31);
expect(Values.AfterComputed).toBeUndefined();
expect(Values.Enum).toBe(2);
expect(Values.AfterEnum).toBeUndefined();
expect(grouped).toBe(2);
expect(surrogate).toBe("surrogate");
