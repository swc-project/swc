# spdy web compiler

[![Build Status](https://travis-ci.org/swc-project/swc.svg?branch=master)](https://travis-ci.org/swc-project/swc)
[![codecov](https://codecov.io/gh/swc-project/swc/branch/master/graph/badge.svg)](https://codecov.io/gh/swc-project/swc)

-----

Make the web (development) faster.

swc is rust port of [babel][] and [closure compiler][].


# Installation

Requires nightly version of [rust][].

```sh
RUSTFLAGS='--cfg procmacro2_semver_exempt --cfg parallel_queries' cargo install --git https://github.com/swc-project/swc.git
```

# Features

## Transforms
New generation javascript to old-days javascript.

 - es3
    - [x] member-expression-literals
    - [x] property-literals
    - [ ] reserved-words

 - es5
    - [ ] property-mutators

 - es2015
    - [x] arrow-functions
    - [ ] block-scoped-functions
    - [ ] block-scoping
    - [x] classes
    - [ ] computed-properties
    - [ ] destructuring
    - [ ] duplicate-keys
    - [ ] for-of
    - [x] function-name
    - [x] instanceof
    - [ ] literals
    - [x] new-target
    - [ ] object-super
    - [ ] parameters
    - [x] shorthand-properties
    - [x] spread
    - [x] sticky regex (`y` flag)
    - [x] template-literals
      - [ ] tagged template literals
    - [x] typeof-symbol
    - [ ] unicode-regex

 - es2016
    - [x] exponentiation-operator

 - es2017
    - [ ] async-to-generator

 - es2018
    - [ ] async-generator-functions
    - [ ] dotall-regex
    - [ ] object-rest-spread
    - [ ] optional-catch-binding
    - [ ] unicode-property-regex

# Usage

`test.js`:
```js
8 + 8;
use(8 + 8, 8 ** 8);
```

## Example

```sh
swc jsc test.js
```

### Output

```
8 + 8;
use(8 + 8, Math.pow(8, 8));
```

## Example

```sh
swc jsc --optimize test.js
```

### Output

```
use(8 + 8, Math.pow(8, 8));
```

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md). You may also find the architecture
documentation useful ([ARCHITECTURE.md](ARCHITECTURE.md)).

## License

swc is primarily distributed under the terms of both the MIT license
and the Apache License (Version 2.0).

See LICENSE-APACHE and LICENSE-MIT for details.



[babel]:https://github.com/babel/babel
[closure compiler]:https://github.com/google/closure-compiler
[rust]:https://www.rust-lang.org
