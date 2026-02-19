### Fixture Test Addition Guide

- Preferred fixture roots in this crate: tests/fixture, tests/options, ../swc_xml_parser/tests/fixture, ../swc_xml_parser/tests/recovery.
- Update generated fixture outputs with: UPDATE=1 cargo test -p swc_xml_codegen.
- Verify without UPDATE before finishing: cargo test -p swc_xml_codegen.
