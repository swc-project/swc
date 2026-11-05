namespace Fixture {
    namespace Values {
        export const enum E { A = 31, B }
    }
    import Direct = Values.E.B;
    const direct = Direct;

    const enum ObjectValues { A = 41 }
    const shorthand = { ObjectValues };

    const enum AliasValues { A = 51 }
    import Live = AliasValues;
    const aliases = { Live };

    const enum Mutating { A = 61 }
    Mutating.A++;
    const mutation = Reflect.get(Mutating, "A");

    expect(direct).toBe(32);
    expect(Reflect.get(shorthand.ObjectValues, "A")).toBe(41);
    expect(Reflect.get(aliases.Live, "A")).toBe(51);
    expect(mutation).toBe(62);
}
