declare namespace Ambient {
    const enum E { A = 30, B }
    const x = 32;
}
import Alias = Ambient.E;
const folded = (Alias)[("B")];
enum Values { A = Ambient.x, B = Ambient.E.B, C }
declare enum Plain { A = 33, B }
enum FromPlain { A = Plain.A, B = Plain.B }
const runtimeRead = Plain.A;
