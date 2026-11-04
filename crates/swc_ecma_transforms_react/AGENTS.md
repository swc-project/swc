### Fixture Test Addition Guide

- For every behavior that can be expressed by this crate's preset runner,
  add a preset fixture, including when the behavior also has a composite or
  specialized test. Keep those tests when they cover additional execution
  semantics or assertions.
- Test transform behavior with fixtures, not Rust unit tests.

- Organize React preset fixtures under tests/preset. Use tests/composite for fixtures requiring a combination of transforms or a different test pipeline, including standalone transforms.
- Use tests/preset for React preset tests. Its options.json files contain the jsc.transform.react portion of .swcrc and inherit options from parent directories.
- Update generated fixture outputs with: UPDATE=1 cargo test -p swc_ecma_transforms_react.
- Verify without UPDATE before finishing: cargo test -p swc_ecma_transforms_react.
