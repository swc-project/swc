<p align="center">
  <a href="https://swc-project.github.io/">
    <img alt="babel" src="https://raw.githubusercontent.com/swc-project/logo/master/swc.png" width="546">
  </a>
</p>

<p align="center">
   Make the web (development) faster.
</p>

<p align="center">
   <a href="https://www.npmjs.com/package/@swc/core">
      <img alt="npm Downloads" src="https://img.shields.io/npm/dm/swc.svg?maxAge=43200&label=npm%20downloads">
   </a>
    <a href="https://crates.io/crates/swc_ecma_parser">
      <img alt="undefined" src="https://img.shields.io/crates/d/swc_ecma_parser.svg?label=crates.io%20dowloads">
    </a>
</p>
<p align="center">
   <a href="https://travis-ci.org/swc-project/swc">
      <img alt="Travis Status" src="https://img.shields.io/travis/swc-project/swc/master.svg?label=travis&maxAge=43200">
   </a>
   <a href="https://codecov.io/gh/swc-project/swc">
      <img alt="Coverage" src="https://codecov.io/gh/swc-project/swc/branch/master/graph/badge.svg">
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

- Giving developer time on the project. (Message us on [Slack](https://swc-org.slack.com/) for guidance!)
- Giving funds by becoming a sponsor (see below)! [Slackin for swc](https://swc-slackin.herokuapp.com)

## Open Collective Sponsors

Become a sponsor and get your logo on our README on Github with a link to your site. [[Become a sponsor](https://opencollective.com/swc#sponsor)]

<h2 align="center">Gold Sponsors</h2>

<h2 align="center">Silver Sponsors</h2>

<h2 align="center">Bronze Sponsors</h2>

<h2 align="center">Backers</h2>

[Become a backer](https://opencollective.com/swc#backer) and get your image on our README on Github with a link to your site.

<a href="https://opencollective.com/swc/backer/0/website?requireActive=false" target="_blank"><img src="https://opencollective.com/swc/backer/0/avatar.svg?requireActive=false"></a>
<a href="https://opencollective.com/swc/backer/1/website?requireActive=false" target="_blank"><img src="https://opencollective.com/swc/backer/1/avatar.svg?requireActive=false"></a>
<a href="https://opencollective.com/swc/backer/2/website?requireActive=false" target="_blank"><img src="https://opencollective.com/swc/backer/2/avatar.svg?requireActive=false"></a>
<a href="https://opencollective.com/swc/backer/3/website?requireActive=false" target="_blank"><img src="https://opencollective.com/swc/backer/3/avatar.svg?requireActive=false"></a>
<a href="https://opencollective.com/swc/backer/4/website?requireActive=false" target="_blank"><img src="https://opencollective.com/swc/backer/4/avatar.svg?requireActive=false"></a>
<a href="https://opencollective.com/swc/backer/5/website?requireActive=false" target="_blank"><img src="https://opencollective.com/swc/backer/5/avatar.svg?requireActive=false"></a>
<a href="https://opencollective.com/swc/backer/6/website?requireActive=false" target="_blank"><img src="https://opencollective.com/swc/backer/6/avatar.svg?requireActive=false"></a>
<a href="https://opencollective.com/swc/backer/7/website?requireActive=false" target="_blank"><img src="https://opencollective.com/swc/backer/7/avatar.svg?requireActive=false"></a>
<a href="https://opencollective.com/swc/backer/8/website?requireActive=false" target="_blank"><img src="https://opencollective.com/swc/backer/8/avatar.svg?requireActive=false"></a>


# Documentation

Check out the documentation [in the website](https://swc-project.github.io/docs/installation).

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
| swc (es3)                | 610 ops/sec ±1.76% (82 runs sampled)   |
| swc (es2015)             | 682 ops/sec ±0.63% (88 runs sampled)   |
| swc (es2016)             | 1,659 ops/sec ±4.32% (79 runs sampled) |
| swc (es2017)             | 1,384 ops/sec ±7.24% (82 runs sampled) |
| swc (es2018)             | 1,765 ops/sec ±11.78% (82 runs sampled)|
| swc-optimize (es3)       | 535 ops/sec ±1.01% (83 runs sampled)   |
| babel                    | 42.12 ops/sec ±6.27% (55 runs sampled) |


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
