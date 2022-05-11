# Reserve `BytePos(0)` for dummy spans

-   Status: accepted
-   Deciders: @kdy1
-   Date: 2020-05-11

## Context and Problem Statement

`BytePos(0)` was causing lots of problems because a span generated for user input can have `BytePos(0)`.
We tried various ways to distinguish the user input from synthesized spans, but all were not successful.
It especially caused various issues on source maps.

## Decision Drivers <!-- optional -->

-   Source map issues, cause by `BytePos(0)`.

## Considered Options

-   Adding one empty file to `SourceMap` each time we create one.

## Decision Outcome

Reserving `0` of `BytePos` provides guarantee which can be used by various codegen crates.
As `BytePos(0)` is reserved, `swc_ecma_codegen` can know if a `BytePos` is dummy without checking both of `lo` and `hi`.

### Positive Consequences

-   Cleaner code, as detecting if a `BytePos` is dummy become easier.

### Adding one empty file to `SourceMap` each time we create one.

This is a code smell, and if we select this, we can't depend on the fact `BytePos(0)` is dummy.
