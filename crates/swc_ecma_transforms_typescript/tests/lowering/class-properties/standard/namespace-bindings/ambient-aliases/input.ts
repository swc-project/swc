export {};
const enum E { A = 1 }
declare namespace Ambient {
    export import Alias = E;
    namespace Nested { export import Other = Alias; }
}
declare namespace Qualified.Inner { export import Alias = E; }
declare module "ambient-alias-fixture" {
    export import Alias = E;
    namespace Nested { export import Other = Alias; }
}
declare global {
    namespace GlobalAmbient { export import Alias = E; }
}
const value: Ambient.Alias = E.A;
enum RuntimeValue { A = 2 }
namespace Runtime { export import Alias = RuntimeValue; }
