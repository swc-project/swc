namespace VariableOnly { declare var value: number; }
namespace FunctionOnly { declare function value(): void; }
export { FunctionOnly };
export default FunctionOnly;
namespace ClassOnly { declare class Value {} }
namespace EnumOnly { declare enum Value { A } }
export namespace ExportedFunction { export declare function value(): void; }
namespace Qualified.FunctionOnly { declare function value(): void; }

namespace Outer {
    declare namespace Inner { const value: number; }
}
namespace Nested {
    namespace Inner { declare function value(): void; }
}
declare namespace Ambient { const value: number; }
namespace TypesOnly { interface Value {} type Alias = number; }
namespace ConstEnumOnly { const enum Value { A = 1 } }
namespace AmbientConstEnumOnly { declare const enum Value { A = 1 } }

namespace Merged { interface Value {} }
namespace Merged { declare function value(): void; }
console.log(Merged);
namespace Merged { export const value = 1; }
namespace Merged {}
console.log(Merged.value);
