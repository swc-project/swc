// @target: esnext,es2015,es5
// @lib: esnext
// @noEmitHelpers: true
// @noTypesAndSymbols: true

// https://github.com/microsoft/TypeScript/issues/37686
async function* f(a: { b?: number }) {
    let c = a.b ?? 10;
    while (c) {
        yield c--;
    }
}
