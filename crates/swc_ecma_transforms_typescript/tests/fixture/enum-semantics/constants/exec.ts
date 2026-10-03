namespace Fixture {
    namespace N {
        export namespace Inner {
            export const x = 40;
            export const y = x + 2;
            export const annotated: number = 9;
        }
        export import Y = N.Inner.y;
        export import Z = N.Y;
    }
    import Inner = N.Inner;
    import X = Inner.x;
    import Y = N.Z;
    const seed = X + 2;
    enum Values {
        A = seed,
        B,
        C = Y,
        D = Inner.y,
        E = Inner.annotated,
        S = `value=${Values.A}`
    }
    const result = [Values.A, Values.B, Values.C, Values.D, Values.E, Values.S];

    expect(result).toEqual([42, 43, 42, 42, 9, "value=42"]);
}
