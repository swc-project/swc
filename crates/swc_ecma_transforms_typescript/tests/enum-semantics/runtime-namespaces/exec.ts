namespace N {
    const enum E { A = 1 }
}
const n = N;
namespace Nested.Qualified {
    const enum E { A = 4 }
}
const nested = Nested.Qualified;
namespace Aliased {
    const enum E { A = 5 }
}
namespace Fixture {
    import Alias = Aliased;
    export const alias = Alias;
}
namespace Unused {
    const enum E { A = 6 }
}
expect(Object.keys(n)).toEqual([]);
expect(Object.keys(nested)).toEqual([]);
expect(Fixture.alias).toBe(Aliased);
