enum Strings { A = "x", B = A, C = Strings.B }
const enum Constants { A = "x", B = A, C = Constants.B }
enum Numbers { A = 1, B = A + 1, C }
enum Merged { A = "merged" }
enum Merged { B = A }
enum Forward { A = B, B = "later" }
enum Cycle { A = B, B = A }
expect(Strings).toEqual({ A: "x", B: "x", C: "x" });
expect(Constants.C).toBe("x");
expect(Numbers).toEqual({ A: 1, B: 2, C: 3, 1: "A", 2: "B", 3: "C" });
expect(Merged).toEqual({ A: "merged", B: "merged" });
expect(Forward.A).toBeUndefined();
expect(Forward.B).toBe("later");
expect(Cycle.A).toBeUndefined();
expect(Cycle.B).toBeUndefined();
