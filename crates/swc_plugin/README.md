# SWC Plugin

This crate provides necessary types and macros for creating a custom plugin for SWC (https://swc.rs/), which are WebAssembly modules that may be used to modify behavior of SWC. Currently only `trasnform` (https://swc.rs/docs/usage/core#transform) is supported.

**Disclaimer: currently SWC plugin support is experimental, there may be possible breaking changes or unexpected behaviors. Please provide issues, feedbacks to https://github.com/swc-project/swc/discussions .**

## Writing a plugin

All plugin require adding crate-type = ['cdylib'] to the Cargo.toml. For a quick setup, SWC provides a simple commandline to create project for the plugin.

```
// if you haven't, add build targets for webassembly
rustup target add wasm32-wasi wasm32-unknown-unknown

cargo install swc_cli

swc plugin new ${plugin_name} --target-type wasm32-wasi
```

When create a new project cli require to specify target type between `wasm32-wasi` or `wasm32-unknown-unknown`. `wasm32-unknown-unknown` will generate slighly smaller binary, but it doesn't support system interfaces as well as macros like `printn!()`.

Generated project will contain a fn with macro `#[plugin_transform]` which internally does necessary interop for communication between host to the plugin.

There are few references like SWC's [jest transform](https://github.com/swc-project/swc/blob/90d080c16b41b73f34151c1f5ecbcbf0b5d8e236/crates/swc_ecma_ext_transforms/src/jest.rs) for writing actual `VisitMut`.