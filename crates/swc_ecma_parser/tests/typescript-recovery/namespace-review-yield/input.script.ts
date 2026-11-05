function* outer() {
    namespace N {
        const expression = yield value;
        const bare = yield;
        const delegated = yield* values;
        namespace Nested { const nested = yield value; }
        function regular() { let yield = 1; return yield + 1; }
    }
    yield value;
}
