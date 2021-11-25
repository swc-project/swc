## How tests work

The babel-compat tests are mostly written as fixtures, similar to the [@babel/parser tests](https://github.com/babel/babel/tree/main/packages/babel-parser/test/fixtures). The `src/convert.rs` test runner looks in the `fixtures/` directory for input and expected output files. Input files are parsed into an SWC AST and converted to a Babel AST in Rust. Output files are parsed directly into a Babel AST. The two ASTs are then compared, with any differences causing the test to fail.

## How to write a test

**Step 1**: Create a new fixture dir and input file.

```bash
mkdir fixtures/my-test
echo "var a = true;" > fixtures/my-test/input.js
```

**Step 2**: Generate an output file with the expected Babel AST as JSON. There's a utility script available to help, but you can do this however you like.

```bash
# If using the babelgen.js utility, run `npm install` first to get @babel/parser dependency.
node babelgen.js fixtures/my-test/input.js > fixtures/my-test/output.json
```

**Step 3**: `cargo test` should now pick up your new test automatically.

> There's a small, insignificant different between the default Babel AST and the converted one causing my test to fail.

This happens a lot with `None` and `Some(false)`. You'll probably want to add a normalizer function to the Normalizer visitor in `src/normalize/mod.rs`.

## Other random utlities

-   `swcgen.js`: Prints the SWC AST as JSON.
-   `compare.sh`: prints the Babel and SWC ASTs side-by-side.
