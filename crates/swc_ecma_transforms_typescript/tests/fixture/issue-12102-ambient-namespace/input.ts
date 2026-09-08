declare namespace D { enum A { X = 1 } }
enum E { P = D.A.X, Q }

declare namespace B1 { const enum K { Z = 3 } }
enum F { P = B1.K.Z, Q }

declare namespace AC { export const c = 7; }
enum G { P = AC.c, Q }

declare namespace AD { namespace Inner { enum E { X = 1 } } }
enum H { P = AD.Inner.E.X, Q }

declare namespace AE { export namespace Inner { export const c = 5; } }
enum I { P = AE.Inner.c, Q }

declare namespace AF.Dotted { const k = 9; }
enum J { P = AF.Dotted.k, Q }

namespace Con { export declare namespace Amb { const v = 1; } }
enum K { P = Con.Amb.v, Q }

declare namespace Amb2 { namespace Inner { const w = 2; } }
enum L { P = Amb2.Inner.w, Q }
