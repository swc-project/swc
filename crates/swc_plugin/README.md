# SWC Plugin

This crate provides necessary types and macros for creating a custom plugin for SWC (https://swc.rs/), which are WebAssembly modules that may be used to modify behavior of SWC. Currently only `trasnform` (https://swc.rs/docs/usage/core#transform) is supported.

**Disclaimer: currently SWC plugin support is experimental, there may be possible breaking changes or unexpected behaviors. Please provide issues, feedbacks to https://github.com/swc-project/swc/discussions .**

## Writing a plugin


https://github.com/infinyon/fluvio/blob/master/crates/fluvio-smartmodule/README.md