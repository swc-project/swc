The sourcemap here was generated like this:

Basically this is the same that the `react-native` gradle file does, see:
https://github.com/facebook/react-native/blob/4185a45be40e014d5e6315c70de00fe5f76c726a/react.gradle#L156-L204

```sh
    $ npx react-native bundle --platform android --entry-file input.js --bundle-output intermediate.js --sourcemap-output intermediate.js.map
    $ hermes -O -emit-binary -output-source-map -out=intermediate2 intermediate.js
    $ node react-native/scripts/compose-source-maps.js intermediate.js.map intermediate2.map -o output.map
```

When running the bytecode, we will get the following stacktrace
(probably a bit different when done in react-native properly):

```
Error: lets throw!
    at foo (address at unknown:1:11939)
    at anonymous (address at unknown:1:11857)
    at loadModuleImplementation (address at unknown:1:2608)
    at guardedLoadModule (address at unknown:1:1973)
    at metroRequire (address at unknown:1:1494)
    at global (address at unknown:1:508)
```
