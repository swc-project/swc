### Fixture Test Addition Guide

- Preferred fixture roots in this crate: tests/arrow, tests/async-to-generator, tests/block-scoping, tests/class-properties, tests/class_fields_use_set, tests/classes, tests/destructuring, tests/for-of, tests/new-target, tests/object-rest-spread, tests/optional-chaining, tests/optional-chaining-loose, tests/parameters, tests/private-in-object, tests/shorthand_properties, tests/static-blocks.
- Update generated fixture outputs with: UPDATE=1 cargo test -p swc_ecma_transforms_compat.
- Verify without UPDATE before finishing: cargo test -p swc_ecma_transforms_compat.
