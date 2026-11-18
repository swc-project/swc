// Every target keeps its reference identity after erasing type syntax.
enum WrappedAssertions {
    A = 1,
    NonNull = ((A!) = 2),
    TypeAssertion = ((<number>A) = 3),
    Satisfies = ((A satisfies number) = 4),
    Instantiation = ((A<number>) = 6),
    Nested = (((((<number>(A as number))!) satisfies number) as number) = 7),
}
