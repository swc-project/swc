# TODOs
 - [ ] ES6 import
   - [x] normal import
   - [x] aliased import
   - [ ] namespaced import
       - [x] de-globing (& tree shaking)
       - [ ] namespaced import with dynamic key
       
Webpack uses prefixes to determine if a file should be included.

e.g. Code like below
```js
function load(name) {
    if (Math.random() > 0.5) {
        return import(`./components/a/${name}`)   
    } else {
        return import(`./components/b/${name}`)       
    }
}
```

make `./components/a/*` and `./components/b/*` be included, even in the case that it's not used in actually.

Otherwise, rollup does not touch import expressions with dynamic path.

 
      
 - [x] Tree shaking
 - [ ] Chunking
 - [ ] Correct execution order
   - [x] import statements
   - [ ] dynamic imports
 - [ ] Dynamic imports
   - [x] Loading
 - [x] Export filtering (in usage_analysis)
 - [ ] Optimize helpers (remove duplicate)
 - [x] .swcrc integration
 - [ ] "esnext" in package.json
 - [ ] `spack.config.js`
 - [ ] Merging of SourceFile

 We also need a way to provide config while testing.

 - [ ] neon integration





 
## TODOs (postponed)
 - [ ] common js import (require)
   - [ ] Execution order
   - [x] Loading
   - [ ] Optional dependency

# Ideas


## constant optimizations 

We can move all **pure** constants to top level function.
If those are marked with correct hygiene id, 
it will be resolved differently and can be removed by uglifyjs.


# Fixture tests

```yaml
  # Stores input files  
  - /input
    # Entries (this includes entry.js)
    - /input/entry*
  # Stores reference outputs
  - /output
    # Output entries
    - /output/entry*
    # Shared modules.
    - /output/chunk*
```