import { loadBindings } from "../src/load-bindings";

it("uses wasm when native binding validation fails", () => {
    const wasmBinding = {};

    const result = loadBindings(
        undefined,
        () => ({
            getTargetTriple() {
                throw new Error("native binding is invalid");
            },
        }),
        () => wasmBinding
    );

    expect(result.binding).toBeUndefined();
    expect(result.fallbackBindings).toBe(wasmBinding);
});

it("preserves errors thrown while loading wasm fallback", () => {
    const wasmError = new Error("wasm binding failed to load");

    expect(() =>
        loadBindings(
            undefined,
            () => ({
                getTargetTriple() {
                    throw new Error("native binding is invalid");
                },
            }),
            () => {
                throw wasmError;
            }
        )
    ).toThrow(wasmError);
});
