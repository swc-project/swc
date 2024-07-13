# Minifier

EcmaScript minifier for the SWC project. This is basically a port of terser.

# Note

Currently name mangler is very simple. To focus on creating a MVP, I (kdy1) will use simple logic for name mangler and implement the content-aware name mangler after publishing first non-beta version.

## Debugging tips

If the output contains variables named `e`, `t`, `n` it typically means the original library is published in a minified form and the input contains `eval`.
The current swc name mangler does not do anything if `eval` is used.

# Profiling the minifier

From mac os x, run

```
./scripts/instrument/all.sh path/to/input/dir
```

# Contributing

## Testing

Please prefer execution tests over unit tests. Execution tests are more useful because there's no chance of human error while reviewing.

### Execution tests

You can add a test to [`./tests/exec.rs`](https://github.com/swc-project/swc/blob/main/crates/swc_ecma_minifier/tests/exec.rs)

You can run `./scripts/exec.sh` from `./crates/swc_ecma_minifier` to run execution tests of SWC minifier. `exec.sh` runs the cargo test with `--features debug`, and it makes the cargo test print lots of debug logging. You can search for `"change"`, and you can know the code responsible the optimization. The minifier has `report_change!` macro, and it prints the location of the relevant code.

### Fixture tests

You can add a test to [`./tests/fixture`](https://github.com/swc-project/swc/blob/main/crates/swc_ecma_minifier/tests/fixture/). You can select any directory, but please prefer to use the `issues` directory. You can run `./scripts/test.sh` from `./crates/swc_ecma_minifier` to run fixture tests. You can run it like `./scripts/test.sh foo` to run test cases only with `foo` in the file path. If you want to get location of change, you can do `./scripts/test.sh foo --features debug`.
