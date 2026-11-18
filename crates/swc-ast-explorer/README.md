# swc-ast-explorer

A small binary to print SWC EcmaScript and TypeScript abstract syntax trees.

```shell
echo "console.log('hello')" | cargo run -p swc-ast-explorer
```

Use `--spans` to keep span fields in the printed tree.
