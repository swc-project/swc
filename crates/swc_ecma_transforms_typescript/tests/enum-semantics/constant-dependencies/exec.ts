const source = 10;
const intermediate = source + 2;
const enum Dependent { A = intermediate, B }
expect([Dependent.A, Dependent.B]).toEqual([12, 13]);
expect(eval("typeof Dependent")).toBe("undefined");
