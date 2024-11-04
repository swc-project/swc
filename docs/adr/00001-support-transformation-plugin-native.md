# Support transform plugin in native rust binaries

-   Status: accepted <!-- optional -->
-   Deciders: @kdy1, @kwonoj <!-- optional -->
-   Date: 2022-01-01 <!-- optional -->

Technical Story: [Issue 2635](https://github.com/swc-project/swc/issues/2635) <!-- optional -->

## Context and Problem Statement

SWC wants to support load, run plugins in the native binary for the custom transform behavior. SWC already have preliminary support to load plugins in its node.js JS bindings but it has known limitations.

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

## Decision Outcome

Chosen option: **[option 4] Wasm plugins based on `wasmer`**

This decision is taken because

-   It was relatively easy plugin author to generate single binary works across most of platforms SWC's host binary supports, without concern of cross-target compilations.
-   It was relatively easy to achieve abi-stable between SWC host to plugin binaries.
-   It doesn't require to have separate, specialized AST struct (named `plugin_ast`) to pass into ffi boundary of the plugin.
-   Its serialization / deserialization performance is near identical or faster than `abi_stable` based ffi

## Pros and Cons of the Options <!-- optional -->

### [option 1] JS-based plugins, including babel plugins

SWC allow implementing plugins using javascript, and call it from worker threads as required.
This includes babel plugins, to make migration from babel more convenient.

-   Good, because users can use rich ecosystem of babel.
-   Good, because users are used to javascript.
-   Good, because all platforms are supported.
-   Bad, because passing data to and from javascript is very costly. ([SWC issue: Speed up `parse`](https://github.com/swc-project/swc/issues/2175))
-   Bad, because js plugins require and block the main javascript thread.
-   Bad, because the main javascript is singled threaded and be bottleneck.
-   Bad, because `napi` (renamed to `node-api`) does not provide a way to get the return value of a function called from other thread than js thread. To workaround this, we should implement a complex request-response system based using lots of mutex.
-   Bad, because node js worker thread is not an event loop. This means worker we cannot `yield` from a worker thread when we need to call js plugin. As a result, the when main js thread is busy because of js plugins, worker threads are also blocked without doing any task.

### [option 2] Plugins based on `abi_stable` and native dynamic libraries

Plugins are written in rust, and built as native libraries for each platforms. SWC pass data to plugin using special form of AST, which has stable memory representation regardless of the version of `rustc`.

-   Good, because it's fast, even on the first run.
-   Good, because it does not require very complex request-response system.
-   Good, because plugin authors can use all features of rust.
-   Bad, because configuring CI for publishing plugins is very hard.
-   Bad, because plugin developer cannot publish a plugin from a single machine.
-   Bad, because loading of plugins is complex. Path for dynamic libraries are platform-dependant.
-   Bad, because we have to handle quirks of each platforms.
-   Bad, because `@swc/wasm` has no way to support plugins.

### [option 3] Wasm plugins based on `wasmtime`

SWC embeds `wasmtime`, loads plugin built as web assembly.

-   Good, because it's fast except the first run.
-   Good, because configuring CI is simple.
-   Good, because plugin authors can publish a plugin without CI, even with a single machine.
-   Bad, because `@swc/wasm` has no way to support plugins.
-   Bad, because first run is slow.
-   Bad, because we have to manage the cache of compiled wasm files.
-   Bad, because `wasmtime` does not support all platforms.

### [option 4] Wasm plugins based on `wasmer`

SWC embeds web assembly runtime (https://wasmer.io/), loads plugin built as web assembly.

-   Good, because it's fast except the first run.
-   Good, because configuring CI is simple.
-   Good, because plugin authors can publish a plugin without CI, even with a single machine.
-   Good, because `@swc/wasm` can support plugins in future as `wasmer` officially supports using it within a wasm file.
-   Bad, because first run is slow.
-   Bad, because we have to manage the cache of compiled wasm files.
-   Bad, because `wasmer` does not support all platforms.

## Links
