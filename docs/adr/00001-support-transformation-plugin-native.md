# Support transform plugin in native rust binaries

-   Status: accepted <!-- optional -->
-   Deciders: @kdy1, @kwonoj <!-- optional -->
-   Date: 2021-01-01 <!-- optional -->

Technical Story: [Issue](https://github.com/swc-project/swc/issues/2635) <!-- optional -->

## Context and Problem Statement

SWC wants to support load, run plugins in the native binary for the custom transform behavior. SWC already have priliminary support to load plugins in its node.js JS bindings but it has known limitations.

## Decision Drivers <!-- optional -->

-   Allow to write a plugin binary can be loaded in the SWC's native binary without involving JS binding interop.
-   Provide good, satisfactory performance while loading, running plugin's custom transformation.
-   Keep abi stability as much, plugin binary should work across different versions of SWC host binary except intended breaking changes.
-   Allow to write a plugin without caring much around the native platform targets binaries.

## Considered Options

-   [option 1] JS-based plugins, including babel plugins

-   [option 2] Plugins based on `abi_stable` and native dynamic libraries

-   [option 3] Wasm plugins based on `wasmtime`

-   **[option 4]** Wasm plugins based on `wasmer`

SWC embeds web assembly runtime (https://wasmer.io/), loads plugin built as web assembly.

## Decision Outcome

Chosen option: **[option 4] Wasm plugins based on `wasmer`**

This decision is taken because

-   It was relatively easy plugin author to generate single binary works across most of platforms SWC's host binary supports, without concern of cross-target compilations.
-   It was relatively easy to achieve abi-stable between SWC host to plugin binaries.
-   It doesn't require to have separate, specialized AST struct (named `plugin_ast`) to pass into ffi boundary of the plugin.
-   Its serialization / deserialization performance is near identical or faster than `abi_stable` based ffi

## Pros and Cons of the Options <!-- optional -->

### [option 1] JS-based plugins, including babel plugins

[example | description | pointer to more information | …] <!-- optional -->

-   Good, because [argument a]
-   Good, because [argument b]
-   Bad, because [argument c]
-   … <!-- numbers of pros and cons can vary -->

### [option 2] Plugins based on `abi_stable` and native dynamic libraries

[example | description | pointer to more information | …] <!-- optional -->

-   Good, because [argument a]
-   Good, because [argument b]
-   Bad, because [argument c]
-   … <!-- numbers of pros and cons can vary -->

### [option 3] Wasm plugins based on `wasmtime`

[example | description | pointer to more information | …] <!-- optional -->

-   Good, because [argument a]
-   Good, because [argument b]
-   Bad, because [argument c]
-   … <!-- numbers of pros and cons can vary -->

### [option 4] Wasm plugins based on `wasmer`

[example | description | pointer to more information | …] <!-- optional -->

-   Good, because [argument a]
-   Good, because [argument b]
-   Bad, because [argument c]
-   … <!-- numbers of pros and cons can vary -->

## Links

-   [Link type] [Link to ADR] <!-- example: Refined by [ADR-0005](0005-example.md) -->
-   … <!-- numbers of links can vary -->
