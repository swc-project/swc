# SWC Test262 conformance runner

The runner uses a pinned, shallow clone of the official Test262 repository.
Fixtures are managed under `vendor/` and are never committed.

```bash
cargo test262 setup
cargo test262 run parser
cargo test262 run parser --filter language/expressions/class --detail
cargo test262 status
cargo test262 explain language/expressions/class/example.js
```

`cargo test262` runs every non-runtime conformance suite. A filtered run never
reads or updates the complete-suite baseline. Use `--update` only after reviewing
all changed failures and unexpected passes.
