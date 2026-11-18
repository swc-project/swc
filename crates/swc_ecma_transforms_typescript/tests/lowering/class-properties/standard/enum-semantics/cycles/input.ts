export {};

import A = B;
import B = A;
enum AliasCycle { X = A }
const x = y;
const y = x;
enum ConstCycle { X = x, Y }
enum MemberCycle { X = Y, Y = X }
namespace N {
    export import X = N.Y;
    export import Y = N.X;
}
enum NamespaceCycle { X = N.X }
