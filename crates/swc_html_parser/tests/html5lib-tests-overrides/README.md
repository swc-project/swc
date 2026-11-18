# Modern select expectations

The pinned html5lib tree-construction data uses the older `in select` rules and
regenerates its DOM and error fixtures on every full test run. For cases affected
by customizable selects, this directory holds the current expectations without
changing the upstream data. Each `.error-count` file contains the expected
number of parser errors, and the matching `.dom.rust-debug` file contains the
expected tree. The test harness prefers these files when present.

The JSON and span snapshots remain in `html5lib-tests-fixture`. Regenerate them
with `UPDATE=1 cargo test -p swc_html_parser`, then run the same command without
`UPDATE` to verify the checked-in expectations.
