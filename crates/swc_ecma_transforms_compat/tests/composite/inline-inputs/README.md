# Inputs for inline snapshot tests

These files contain the inputs for `test!` cases in the corresponding Rust test
files. Each test still specifies its parser and transform in Rust and compares
its result with the existing `__swc_snapshots__` output.

Keep these inputs outside the transform fixture directories: their `input.js`
globs run a fixed transform and could otherwise execute a case with a different
pipeline. When moving a case to a fixture runner, verify its parser, pass order,
configuration, ignored status, and expected output first.
