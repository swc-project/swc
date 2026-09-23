### Instructions

- You can run execution tests by doing ./scripts/exec.sh to see if your changes are working.
- Investigate execution test failures against the semantic assumptions and
  implementation and review policy below. Fix regressions in supported behavior;
  report policy conflicts explicitly instead of hiding failures or arbitrarily
  changing or removing existing tests.
- Always run execution tests after making changes.
- You can run fixture tests by doing ./scripts/test.sh, and you can do UPDATE=1 ./scripts/test.sh to update fixtures.

### Decorators

- Decorators are lowered before minification and are never present in minifier input.
- Do not add decorator-specific handling or defensive code to the minifier.
- Do not add tests for decorator syntax or decorator transform behavior to minifier test suites. Place these tests in the parser or decorator transform suites instead.

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

#### Implementation and Review Policy

The following is a project policy for minifier implementation and review,
separate from the public documentation assumptions listed above:

- Prioritize correctness for common usage, performance, and simple, maintainable
  minifier code.
- Do not require additional defensive logic or analysis solely to preserve
  extreme edge cases involving monkey-patched globals or built-in objects,
  unusual reassignment of `arguments.length`, bindings introduced by direct
  `eval`, or dynamic name resolution inside `with`.
- Semantic differences that depend only on these cases are not mandatory review
  fixes. A required fix must demonstrate an impact on common usage or identify an
  explicit support contract that the change violates.
- Continue to account for ordinary lexical shadowing, side effects, and
  exceptions within the supported assumptions. This policy does not authorize
  blanket removal of existing `eval` or `with` handling or tests.

If a minifier change relies on an assumption beyond this list and policy, update the
public minification documentation or leave an explicit code comment describing
the narrower local invariant. The edge cases explicitly covered by this policy
do not require repeated, case-specific justification.

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
