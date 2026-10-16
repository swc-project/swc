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
