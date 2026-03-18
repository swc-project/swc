# Hermes Flow Corpus

This directory stores a synced snapshot of Hermes Flow parser fixtures from
`facebook/hermes` (`external/flowtest/test/flow`).

## Sync upstream corpus

Run:

```sh
./crates/swc_ecma_parser/scripts/sync_flow_hermes.sh
```

Optional branch override:

```sh
./crates/swc_ecma_parser/scripts/sync_flow_hermes.sh <branch>
```

The sync script updates:

- `corpus/**` (upstream fixture files)
- `expected-errors.txt` (file -> expected error-presence from upstream `.tree.json`)
- `known-fail.txt` (experimental syntax allowlist candidates)
- `metadata.json` (upstream commit/count metadata)
- `upstream-flowtest-README.md`

## Update core known-fail baseline

`known-fail-core.txt` tracks current parser parity gaps for non-experimental
fixtures. Regenerate it with:

```sh
./crates/swc_ecma_parser/scripts/update_flow_hermes_core_known_fail.sh
```
