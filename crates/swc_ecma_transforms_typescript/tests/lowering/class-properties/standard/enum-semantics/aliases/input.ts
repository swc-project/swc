export {};

namespace N {
    export const enum E { A = 21, B }
}
import A = N.E;
import B = A;
const folded = B.B;
const enum Private { A = 23, B }
import Unused = Private;
const privateValue = Unused.A;
const enum Kept { A = 24, B }
import Live = Kept;
const object = Live;
namespace Exported {
    const enum E { A = 25, B }
    export import Live = E;
}
