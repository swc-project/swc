// Every target keeps its reference identity after erasing type syntax.
var WrappedAssertions = function(WrappedAssertions) {
    WrappedAssertions[WrappedAssertions["A"] = 1] = "A";
    WrappedAssertions[WrappedAssertions["NonNull"] = WrappedAssertions.A = 2] = "NonNull";
    WrappedAssertions[WrappedAssertions["TypeAssertion"] = WrappedAssertions.A = 3] = "TypeAssertion";
    WrappedAssertions[WrappedAssertions["Satisfies"] = WrappedAssertions.A = 4] = "Satisfies";
    WrappedAssertions[WrappedAssertions["Instantiation"] = WrappedAssertions.A = 6] = "Instantiation";
    WrappedAssertions[WrappedAssertions["Nested"] = WrappedAssertions.A = 7] = "Nested";
    return WrappedAssertions;
}(WrappedAssertions || {});
