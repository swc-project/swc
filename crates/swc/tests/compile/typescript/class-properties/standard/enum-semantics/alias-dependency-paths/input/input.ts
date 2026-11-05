namespace Constants {
    export namespace Nested {
        export interface OnlyType {}
        export const enum E { A = 21 }
    }
}
namespace Aliases {
    export import Through = Aliases.Forward.Nested;
    export import TypeTerminal = Aliases.Through.OnlyType;
    export import MemberTerminal = Aliases.Forward.Nested.E.A;
    export import Forward = Constants;
    export import CycleA = Aliases.CycleB;
    export import CycleB = Aliases.CycleA;
    export import Missing = Aliases.Forward.Missing;
}
const result = Aliases.MemberTerminal;
