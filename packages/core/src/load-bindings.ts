import { resolve } from "path";
import * as assert from "assert";

type LoadModule = (path: string) => any;

type BindingLoadResult = {
    binding?: any;
    fallbackBindings?: any;
};

export function loadBindings(
    bindingsOverride: string | undefined,
    loadNative: LoadModule = (path) => require(path),
    loadWasm: () => any = () => require("@swc/wasm")
): BindingLoadResult {
    try {
        const binding = loadNative(
            bindingsOverride ? resolve(bindingsOverride) : "./binding.js"
        );

        // If native binding loaded successfully, it should return proper target triple constant.
        const triple = binding.getTargetTriple();
        assert.ok(triple, "Failed to read target triple from native binary.");
        return { binding };
    } catch (_) {
        // postinstall supposed to install `@swc/wasm` already
        return { fallbackBindings: loadWasm() };
    }
}
