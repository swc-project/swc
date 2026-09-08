enum Fwd { A = Later.baz, B = "b" }
namespace Later { export const baz = "u"; }

namespace NotExported { const hidden = "h"; }
enum Hid { A = NotExported.hidden, B = "b" }

namespace Mut { export let m = "v"; }
enum MutE { A = Mut.m, B = "b" }

const objLit = { k: "w" } as const;
enum Obj { A = objLit.k, B = "b" }

declare namespace D2 { const c: string; }
enum H { A = D2.c, B = "b" }

namespace T { export const typed: string = "annotated"; }
enum Typed { A = T.typed, B = "b" }

namespace Outer { namespace Hidden { export const v = "h"; } }
enum Nested { A = Outer.Hidden.v, B = "b" }

namespace WithHidden { export const live = 0; declare const hidden = 1; }
enum FalseAmbient { A = WithHidden.hidden, B = "b" }

enum LateConst { A = LaterNs.b, B = "b" }
namespace LaterNs { export const b = "post"; }

enum LateEnum { A = LaterEnumNs.Inner.X, B = "b" }

namespace Elem { export namespace Seg { export const x = 1; } export const y = 2; }
enum ComputedSeg { A = Elem["Seg"].x, B = "b" }
enum ComputedProp { A = Elem["y"], B = "b" }
enum TplSeg { A = Elem[`Seg`].x, B = "b" }

namespace Paren { export const p = "p"; }
enum ParenObj { A = (Paren).p, B = "b" }

declare global { const g = 1; }
const global = { g: 99 };
enum GlobalObj { A = global.g, B = "b" }

namespace PrivAmb { export const live = 0; declare enum HiddenE { X = 1 } }
enum HiddenEnum { A = PrivAmb.HiddenE.X, B = "b" }

namespace PrivNs { export const live = 0; declare namespace HiddenN { const x = "s"; } }
enum HiddenNs { A = PrivNs.HiddenN.x, B = "b" }

namespace PrivC { export const live = 0; declare const enum HiddenC { Z = 3 } }
enum HiddenConst { A = PrivC.HiddenC.Z, B = "b" }
namespace LaterEnumNs { export enum Inner { X = 1 } }
