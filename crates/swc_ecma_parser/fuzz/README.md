# Parser fuzzing

The `parse` target feeds valid UTF-8 through every source classification and
both token-collection modes. This covers parser-directed lexer rescans,
checkpoint rewind, comments, JSX/TS angle tokens, templates, regular
expressions, and Unicode boundaries.

Run it with:

```sh
cargo fuzz run parse
```

Run the parser tests under Miri separately so the same cursor and rewind paths
are checked by the interpreter:

```sh
cargo +nightly miri test -p swc_ecma_parser --test next_api
```
