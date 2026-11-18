### Fixture Test Addition Guide

- Preferred fixture roots in this crate: tests/fixture, tests/recovery, tests/iframe_srcdoc, tests/html5lib-tests-fixture, tests/html5lib-tests.
- Update generated fixture outputs with: UPDATE=1 cargo test -p swc_html_parser.
- Verify without UPDATE before finishing: cargo test -p swc_html_parser.
