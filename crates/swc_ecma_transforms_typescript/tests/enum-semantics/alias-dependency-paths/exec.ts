namespace Fixture {
    namespace Constants {
        export namespace Nested {
            export const enum E { A = 21 }
        }
    }
    import Root = Constants;
    import Inner = Root.Nested;
    import Enum = Inner.E;
    import Member = Enum.A;
    expect(Member).toBe(21);
    namespace Cycles {
        export import A = Cycles.B;
        export import B = Cycles.A;
    }
    expect(Reflect.get(Cycles, "A")).toBeUndefined();
    expect(Reflect.get(Cycles, "B")).toBeUndefined();
}
