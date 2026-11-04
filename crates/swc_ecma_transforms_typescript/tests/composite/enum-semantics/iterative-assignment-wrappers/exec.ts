// Every target keeps its reference identity after erasing type syntax.
enum WrappedAssertions {
    A = 1,
    NonNull = ((A!) = 2),
    TypeAssertion = ((<number>A) = 3),
    Satisfies = ((A satisfies number) = 4),
    Instantiation = ((A<number>) = 6),
    Nested = (((((<number>(A as number))!) satisfies number) as number) = 7),
}

expect(WrappedAssertions.NonNull).toBe(2);
expect(WrappedAssertions.TypeAssertion).toBe(3);
expect(WrappedAssertions.Satisfies).toBe(4);
expect(WrappedAssertions.Instantiation).toBe(6);
expect(WrappedAssertions.Nested).toBe(7);
expect(Reflect.get(WrappedAssertions, "A")).toBe(7);
