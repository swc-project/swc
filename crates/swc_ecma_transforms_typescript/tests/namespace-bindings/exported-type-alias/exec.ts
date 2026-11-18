namespace Types {
    export interface Shape {}
    export type ShapeAlias = Shape;
}
namespace Direct { export import X = Types.Shape; }
namespace Aliased { export import X = Types.ShapeAlias; }
namespace Nested {
    export namespace Inner { export import X = Types.Shape; }
}
namespace Dotted.Inner { export import X = Types.Shape; }
namespace Private { import X = Types.Shape; }
namespace Values { export const X = 1; }
namespace ValueAlias { export import X = Values.X; }
const observed = [Direct, Aliased, Nested.Inner, Dotted.Inner, ValueAlias.X];

expect(observed).toEqual([{}, {}, {}, {}, 1]);
expect(eval("typeof Types")).toBe("undefined");
expect(eval("typeof Private")).toBe("undefined");
