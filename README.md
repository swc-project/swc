

<p align="center">
   Make the web (development) faster.
</p>

<p align="center">
   <a href="https://www.npmjs.com/package/swc">
      <img alt="npm Downloads" src="https://img.shields.io/npm/dm/swc.svg?maxAge=43200&label=npm%20downloads">
   </a>
    <a href="">
      <img alt="undefined" src="https://img.shields.io/crates/d/swc_common.svg?label=crates.io%20dowloads">
    </a>
</p>
<p align="center">
   <a href="https://travis-ci.org/swc-project/swc">
      <img alt="Travis Status" src="https://img.shields.io/travis/swc-project/swc/master.svg?label=travis&maxAge=43200">
   </a>
   <a href="https://codecov.io/gh/swc-project/swc">
      <img alt="Coverage" src="https://codecov.io/gh/swc-project/swc/branch/master/graph/badge.svg">
   </a>
   <a href="https://gitter.im/swcproject/Lobby">
      <img alt="Gitter" src="https://img.shields.io/gitter/room/swc-project/swc.svg">
   </a>
</p>



<h2 align="center">Supporting swc</h2>

<p align="center">
   <a href="#backers">
      <img alt="Backers on Open Collective" src="https://opencollective.com/swc/backers/badge.svg" />
   </a>
   <a href="#sponsors">
      <img alt="Sponsors on Open Collective" src="https://opencollective.com/swc/sponsors/badge.svg"/>
   </a>
</p>


swc is a community-driven project, and is maintained by a group of [volunteers](https://opencollective.com/swc#team). If you'd like to help support the future of the project, please consider:

- Giving developer time on the project. (Message us on [Gitter](https://gitter.im/swcproject/Lobby) for guidance!)
- Giving funds by becoming a sponsor (see below)!

## Open Collective Sponsors

Become a sponsor and get your logo on our README on Github with a link to your site. [[Become a sponsor](https://opencollective.com/swc#sponsor)]


# Documentation

Check out the documentation [in the website](https://swc-project.github.io/docs/introduction).


# Installation

Currently this requires nightly version of [rust][].

```sh
npm i -D swc
```
or 
```sh
yarn add --dev swc
```

# Features

## Parsers
 - [x] es2019
 - [x] jsx
 - [x] typescript

## Transforms
New generation javascript to old-days javascript.

 - es3
    - [x] member-expression-literals
    - [x] property-literals
    - [x] reserved-words

 - es5
    - [ ] property-mutators

 - es2015
    - [x] arrow-functions
    - [x] block-scoped-functions
    - [x] block-scoping
      - Note: this might be buggy (at this time)
    - [x] classes
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
    - [x] async-to-generator

 - es2018
    - [ ] async-generator-functions
    - [ ] dotall-regex
    - [x] object-rest-spread
      - [ ] Using symbol as a key
    - [ ] optional-catch-binding
    - [ ] unicode-property-regex
 
  - react
    - [x] jsx

# Performance

The lower bound of the speedup compared to babel is **16**. The benchmarks were run on Macbook pro, dual core, 2.3GHz Intel Core i5, 16 GB ram

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
