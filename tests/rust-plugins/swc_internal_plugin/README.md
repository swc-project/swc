# SWC plugin

## Multivalue-polyfill

Once plugin completes transform, transformed `Program` will be re-serialized into array bytes.
Host (SWC) will reconstruct & deserialize it via raw pointer to the array bytes plugin's `process` returns.
However since size of serialized array bytes is non-deterministic plugin also should return size of the array as well.
In result, signature of raw plugin process fn looks like this:

```
fn proces(...args) -> (i32, i32)
```

Rust compiler have target feature (`target-feature=+multivalue`) to genetare wasm binary with these multivalue support, but
there are some known upstream issues like https://github.com/rust-lang/rust/issues/73755 prevents to use it. The other way around is to use
bindings like `wasm-bindgen`.

In this plugin example generated binary polyfills multivalue only instead of relying on whole wasm-bindgen workflow (https://github.com/vmx/wasm-multi-value-reverse-polyfill).
This polyfill can be removed once upstream compiler feature works as expected or if we decide to use wasm-bindgen fully.

Since cargo doesn't support workflow like `post-build` integrating whole process into build is bit unergonomic. `build.*` is naive substitution
to mimic those behaviors. Or otherwise `multivalue-polyfill` can be excuted manually after main plugin build steps.
