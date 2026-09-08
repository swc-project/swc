namespace N { export const foo = "s"; }
enum E { A = N.foo, B = "b" }

namespace M { export namespace Inner { export const bar = "t"; } }
enum F { A = M.Inner.bar, B = "b" }

namespace C1 { export namespace C2 { export namespace C3 { export const deep = "d"; } } }
enum G { A = C1.C2.C3.deep, B = "b" }

namespace Dot.Sub { export const x = "dotted"; }
enum H { A = Dot.Sub.x, B = "b" }

enum Merged { foo = 1 }
namespace Merged { export const bar = "merged"; }
enum I { A = Merged.foo, B = Merged.bar, C = "c" }

namespace WithEnum { export enum Inner { X = 1 } }
enum J { A = WithEnum.Inner.X, B = "b" }

namespace SelfQ { export const a = "x"; export enum E { A = SelfQ.a, B = "b" } }
namespace OuterQ { export const a = "y"; export namespace Inner { export enum E { A = OuterQ.a, B = "b" } } }

namespace ConDE { export declare enum DE { X = 3 } }
enum K { A = ConDE.DE.X, B = "b" }

namespace Opt { export namespace I { export const x = "s"; } }
enum L { A = Opt?.I.x, B = "b" }
enum M2 { A = Opt.I?.x, B = "b" }
enum N2 { A = Opt?.I?.x, B = "b" }

namespace Opt3 { export namespace H { export namespace K { export const y = "t"; } } }
enum O2 { A = Opt3?.H?.K.y, B = "b" }
