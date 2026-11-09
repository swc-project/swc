---
swc_core: minor
swc_ecma_parser: minor
---

fix(es/parser): Avoid exponential speculative parsing of nested TypeScript and Flow syntax. Share postfix and type parsing, bound parameter probes, and reuse successful and failed computed-key boundaries across binding and type members. Commit accessor and loop heads without reparsing their bodies. Add optional token-source hooks for disposable lookahead.
