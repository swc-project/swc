# [short title of solved problem and solution]

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

-   Preserving current semantics.

## Decision Outcome

Chosen option: "[option 1]", because [justification. e.g., only option, which meets k.o. criterion decision driver | which resolves force force | … | comes out best (see below)].

### Positive Consequences <!-- optional -->

-   [e.g., improvement of quality attribute satisfaction, follow-up decisions required, …]
-   …

### Negative Consequences <!-- optional -->

-   [e.g., compromising quality attribute, follow-up decisions required, …]
-   …

## Pros and Cons of the Options <!-- optional -->

### [option 1]

[example | description | pointer to more information | …] <!-- optional -->

-   Good, because [argument a]
-   Good, because [argument b]
-   Bad, because [argument c]
-   … <!-- numbers of pros and cons can vary -->

### [option 2]

[example | description | pointer to more information | …] <!-- optional -->

-   Good, because [argument a]
-   Good, because [argument b]
-   Bad, because [argument c]
-   … <!-- numbers of pros and cons can vary -->

### [option 3]

[example | description | pointer to more information | …] <!-- optional -->

-   Good, because [argument a]
-   Good, because [argument b]
-   Bad, because [argument c]
-   … <!-- numbers of pros and cons can vary -->

## Links <!-- optional -->

-   [Link type] [Link to ADR] <!-- example: Refined by [ADR-0005](0005-example.md) -->
-   … <!-- numbers of links can vary -->
