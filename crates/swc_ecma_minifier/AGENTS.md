### Instructions

- You can run execution tests by doing ./scripts/exec.sh to see if your changes are working.
- If an execution test fails, you are wrong.
- Always run execution tests after making changes.
- You can run fixture tests by doing ./scripts/test.sh, and you can do UPDATE=1 ./scripts/test.sh to update fixtures.

### Minifier Semantic Assumptions

The ECMAScript minifier may rely on the documented assumptions from the SWC
minification guide:

- Calls to primitive coercion helpers such as `toString` and `valueOf` are
  side-effect free, and built-in object implementations have not been
  overridden.
- `undefined`, `NaN`, and `Infinity` have not been externally redefined.
- `arguments.callee`, `arguments.caller`, and `Function.prototype.caller` are
  not used.
- Code does not depend on the exact contents of `Function.prototype.toString()`
  or `Error.prototype.stack`.
- Getting or setting properties on a plain object does not trigger side effects
  through `watch`, `Proxy`, or similar mechanisms.
- Object properties can be added, removed, and modified unless the change is
  intentionally handling frozen, sealed, non-extensible, or descriptor-locked
  objects.
- `document.all` is treated as not `null`.
- Assigning properties to classes is assumed to be side-effect free and
  non-throwing.
- Accessing declared top-level identifiers is assumed to be side-effect free.
- TDZ violations are not preserved.
- Arithmetic expressions are treated as side-effect free, including runtime
  exceptions such as mixing `bigint` and `number`.

If a minifier change relies on an assumption beyond this list, update the
public minification documentation or leave an explicit code comment describing
the narrower local invariant.

### Fixture Test Addition Guide

- Preferred fixture roots in this crate: tests/fixture, tests/mangle, tests/pass-1, tests/pass-default, tests/full, tests/projects, benches/full.
- Do not add new regression coverage to tests/terser. Use SWC-owned fixtures such as tests/fixture/issues instead.
- Update generated fixture outputs with: UPDATE=1 cargo test -p swc_ecma_minifier.
- Verify without UPDATE before finishing: cargo test -p swc_ecma_minifier.

### Terser Fixture Backlog Workflow

`tests/TODO.txt` and `tests/postponed.txt` are equivalent backlogs of ignored
Terser compressor fixtures. Work on exactly one entry from either list at a
time; there is no priority between the lists. An entry such as
`arrays/constant_join_3/input.js` identifies the fixture at
`tests/terser/compress/arrays/constant_join_3`:

- `config.json` defines the Terser compression options to reproduce.
- `input.js` is the source program to minify.
- `output.js` is the expected Terser-compatible output.

Before changing the minifier, delete only the selected entry from the list
where it appears. This activates the existing fixture test; leave every other
backlog entry untouched. Then change the minifier implementation so that the
fixture passes. Do not make a failing fixture pass by changing its Terser
fixture input or expected output.

Verify the activated fixture first with:

```sh
cargo test -p swc_ecma_minifier --test compress fixture_tests__terser__compress__
```

Then run the full crate fixture suite without `UPDATE`, followed by the
execution tests required above. Do not use `scripts/update-list.sh` while
processing an individual entry: it regenerates the lists and can change
unrelated backlog items.
