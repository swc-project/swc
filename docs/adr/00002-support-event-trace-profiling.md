# Support event trace for profiling

-   Status: accepted <!-- optional -->
-   Deciders: @kdy1, @kwonoj <!-- optional -->
-   Date: 2022-01-01 <!-- optional -->

Technical Story: [Issue 3071](https://github.com/swc-project/swc/issues/3071) <!-- optional -->

## Context and Problem Statement

SWC wants to provide user-level feature to collect diagnostic information for its performances to allow to monitor, resolve real-world performance issues if user encounters one.

## Decision Drivers <!-- optional -->

-   Allow to collect performance traces via commandline, or programmatic interfaces
-   Allow to collect traces without requiring additional binaries, or special flavor binary like debug build
-   Allow to collect traces platform-agnostic way does not need per-platform specific tools.
-   Provide good, satisfactory performance while loading, running plugin's custom transformation.
-   Provide reasonably easy tool to diagnose, visualize emitted traces.

## Considered Options

-   [option 1] Run profilers like [`perf`](https://perf.wiki.kernel.org/index.php/Main_Page), [`instruments`](https://developer.apple.com/forums/tags/instruments)

-   [option 2] Provide a `traceable` binary enables tracing capabilities all time, emits trace event format compatible output

-   **[option 3] Release binary provides runtime flags to enable tracing, emits trace event format compatible output**

-   [option 4] Either creating separate binary or provide runtime flags, emits raw trace outputs let user convert into own preferable way

## Decision Outcome

Chosen option: **[option 3] Release binary provides runtime flags to enable tracing, emits trace event format compatible output**

This decision is taken because

-   It was relatively easy to the users who want to run performance profiling against real world codebases, by opt-in via specific flag, or initialization interfaces
-   It was edge://tracing/ easy to visualize, diagnose via familiar UI (edge://tracing, chrome devtools)
-   Trace event format have well-defined [spec](https://docs.google.com/document/d/1CvAClvFfyA5R-PhYUmn5OOQtYMH4h6I0nSsKchNAySU/preview#!), widely used not only limited to chromium's internal traces
-   It doesn't require special setup for running profiling, like installing a new binary, or setting up per-platform tools which could be widely different between local dev machine to CI systems.

## Pros and Cons of the Options <!-- optional -->

### [option 1] Run profilers like [`perf`](https://perf.wiki.kernel.org/index.php/Main_Page), [`instruments`](https://developer.apple.com/forums/tags/instruments)

SWC does not implement any internal tracing features, let user rely on own profiler

-   Good, SWC does not have any overhead for its release binary to support trace.
-   Good, profilers provides close to bare metal performance profiling to see its internals
-   Bad, depends on build config some of symbols might missing in release binary
-   Bad, user have to setup per-platform specific profilers then have to translate its results

### [option 2] Provide a `traceable` binary enables tracing capabilities all time, emits trace event format compatible output

SWC implements internal logics to generate traceable outputs, which is compatible to trace event format. However, it is not included in normal release binary (`@swc/core`) but requires to install specific custom binary to opt in.

-   Good, SWC does not have any overhead for its release binary to support trace.
-   Good, users does not need to setup complex per-platform profilers
-   Good, users can use existing visualization tools (chromium).
-   Bad, it is non-trivial to setup programmatic opt-in to enabling traces, or setting up continuous monitoring on CI systems with normal release binary

### [option 3] Release binary provides runtime flags to enable tracing, emits trace event format compatible output

SWC implements internal logics to generate traceable outputs, which is compatible to trace event format. It is included in release binary by default which can be enabled via cli flags, or programmatic interfaces.

-   Good, users does not need to setup complex per-platform profilers
-   Good, users can use existing visualization tools (chromium).
-   Good, opt-in profiling is trivial as it can be controlled via programmatic interfaces without having separate binary
-   Bad, there are runtime overheads by having traceable logics, even when trace is not enabled

### [option 4] Either creating separate binary or provide runtime flags, emits raw trace outputs let user convert into own preferable way

SWC follows option 2 or 3, however its emitted output is not compatible to trace event format but raw values from [tracing infrastructure](https://github.com/tokio-rs/tracing)

-   Good, benefits for option 2 or 3 depends on the direction
-   Good, _slightly_ lower overhead by not converting traces into specific format
-   Bad, most of users have to reinvent wheel for translating trace outputs
-   Bad, no standard mechanism to collect trace. i.e, if user want to report perf issues with their diagnostics, it can be anything instead of raw format / or trace event format.

## Links

-   https://github.com/kdy1/cargo-profile
-   https://nnethercote.github.io/perf-book/profiling.html
-   https://docs.google.com/document/d/1CvAClvFfyA5R-PhYUmn5OOQtYMH4h6I0nSsKchNAySU/preview#!
-   https://github.com/tokio-rs/tracing
