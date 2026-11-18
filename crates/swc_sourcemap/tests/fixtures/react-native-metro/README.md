Similar to the Hermes example, this uses the metro bundler which generates scope mappings.

```sh
    $ npx react-native bundle --platform android --entry-file input.js --bundle-output output.js --sourcemap-output output.js.map
```

Running the bundled JS through node gives the following stack trace:

```
Error: lets throw!
    at foo (output.js:1289:11)
    at output.js:1280:19
    at loadModuleImplementation (output.js:271:7)
    at guardedLoadModule (output.js:163:23)
    at metroRequire (output.js:98:75)
    at Object.<anonymous> (output.js:1292:1)
    at Module._compile (internal/modules/cjs/loader.js:1151:30)
    at Object.Module._extensions..js (internal/modules/cjs/loader.js:1171:10)
    at Module.load (internal/modules/cjs/loader.js:1000:32)
    at Function.Module._load (internal/modules/cjs/loader.js:899:14)
```
