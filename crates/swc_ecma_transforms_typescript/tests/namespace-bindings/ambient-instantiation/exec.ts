namespace FunctionOnly { declare function value(): void; }
expect(FunctionOnly).toEqual({});

namespace Merged { interface Value {} }
namespace Merged { declare function value(): void; }
namespace Merged {}
expect(Merged).toEqual({});
namespace Merged { export const later = 1; }
expect(Merged.later).toBe(1);

namespace Outer {
    declare namespace Inner { function value(): void; }
}
expect(Outer).toEqual({});
