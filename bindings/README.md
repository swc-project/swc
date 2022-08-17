## SWC bindings

This folder contains actual bindings binary SWC will build for the supported platforms (`@swc/core`, `swc_cli`, `@swc/wasm`).

All the bindings binary uses publicly published `swc_core` SDK to build deterministic host binary for the specific changes, in result Cargo's workspace gets confused to select dependency versions if it belongs to the workspace contains unpublished packages. To avoid those problems, these bindings are not being built as part of the workspace.

