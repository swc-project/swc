# speedy web compiler

[![Build Status](https://travis-ci.org/swc-project/swc.svg?branch=master)](https://travis-ci.org/swc-project/swc)
[![codecov](https://codecov.io/gh/swc-project/swc/branch/master/graph/badge.svg)](https://codecov.io/gh/swc-project/swc)

-----

Make the web (development) faster.

swc is rust port of [babel][] and [closure compiler][].


# Installation

Currently this requires nightly version of [rust][].

```sh
npm i -SD @swc-project/swc
```
or 
```sh
yarn add --dev @swc-project/swc
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
    - [x] block-scoped-functions
    - [x] block-scoping
      - Note: this might be buggy (at this time)
    - [x] classes
      - [ ] getter / setter
    - [x] computed-properties
    - [x] destructuring
    - [x] duplicate-keys
    - [x] for-of
    - [x] function-name
    - [x] instanceof
    - [x] literals
    - [x] new-target
    - [ ] object-super
    - [x] parameters
    - [x] shorthand-properties
    - [x] spread
    - [x] sticky regex (`y` flag)
    - [x] template-literals
      - [ ] invalid escape sequences inside tagged template literals. (aka es2018)
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

# Performance

The benchmarks were run on Macbook pro, dual core, 2.3GHz Intel Core i5, 16 GB ram

|                          |                performance             |
| ------------------------ |:--------------------------------------:|
| swc (ffi)                | 1,086 ops/sec ±0.77% (84 runs sampled) |
| swc-optimize (ffi)       | 1,060 ops/sec ±0.63% (87 runs sampled) |
| swc (ffi, simd)          | 1,295 ops/sec ±0.87% (89 runs sampled) |
| swc-optimize (ffi, simd) | 1,270 ops/sec ±0.24% (89 runs sampled) |
| babel                    | 65.72 ops/sec ±6.45% (62 runs sampled) |


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
