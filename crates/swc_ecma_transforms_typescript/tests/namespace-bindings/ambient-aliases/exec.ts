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

expect(value).toBe(1);
expect(eval("typeof E")).toBe("undefined");
expect(eval("typeof Ambient")).toBe("undefined");
expect(eval("typeof Qualified")).toBe("undefined");
expect(eval("typeof GlobalAmbient")).toBe("undefined");
expect(Runtime.Alias.A).toBe(2);
