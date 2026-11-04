namespace Source {
    export const value = 1;
    export namespace Nested { export const value = 2; }
}
namespace Other { export const value = 3; }
namespace Aliases {
    export import Whole = Source;
    export import Value = Source.value;
    export import NestedValue = Source.Nested.value;
    export import OtherValue = Other.value;
}
namespace Aliases {
    export import Forward = Aliases.NestedValue;
}

expect(Aliases.Whole.value).toBe(1);
expect(Aliases.Value).toBe(1);
expect(Aliases.NestedValue).toBe(2);
expect(Aliases.OtherValue).toBe(3);
expect(Aliases.Forward).toBe(2);
