export {};
namespace FunctionOnly { declare function value(): void; }
namespace ConstEnumOnly { const enum Value { A = 1 } }
namespace AmbientConstEnumOnly { declare const enum Value { A = 1 } }
namespace Outer { declare namespace Inner { const value: number; } }
declare namespace Ambient { const value: number; }
namespace TypesOnly { interface Value {} }
