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
