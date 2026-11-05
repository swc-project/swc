enum Source { A = 1 }
(Source as any).A = 5;
const cached = Source.A;
enum Dest { B = Source.A, C, D = cached }
namespace Aliases { export import SourceAlias = Source; }
enum ViaAlias { A = Aliases.SourceAlias.A }
const enum Dependent { A = Source.A, B }
const dependent = Dependent.A;
enum FromDependent { A = Dependent.B, B }
const enum Stable { A = 7 }
enum FromConstEnum { A = Stable.A, B }
const folded = Stable.A;
enum TextSource { A = "before" }
(TextSource as any).A = 1;
enum TextDest { A = TextSource.A, B = (TextSource as any).A, C }

expect(Source.A).toBe(5);
expect(cached).toBe(5);
expect(Dest.B).toBe(1);
expect(Dest.C).toBe(2);
expect(Dest.D).toBe(1);
expect(ViaAlias.A).toBe(1);
expect(dependent).toBe(1);
expect(FromDependent.A).toBe(2);
expect(FromDependent.B).toBe(3);
expect(FromConstEnum.A).toBe(7);
expect(FromConstEnum.B).toBe(8);
expect(folded).toBe(7);
expect(eval("typeof Stable")).toBe("undefined");
expect(TextDest.A).toBe("before");
expect(TextDest.B).toBe(1);
expect(TextDest.C).toBeUndefined();
expect(TextDest[1]).toBe("B");
