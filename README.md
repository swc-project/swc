<p align="center">
  <a href="https://swc.rs/">
    <img alt="babel" src="https://raw.githubusercontent.com/swc-project/logo/master/swc.png" width="546">
  </a>
</p>

<p align="center">
   Make the web (development) faster.
</p>

<p align="center">
   <a href="https://www.npmjs.com/package/@swc/core">
      <img alt="npm Downloads" src="https://img.shields.io/npm/dw/@swc/core">
   </a>
    <a href="https://crates.io/crates/swc_ecma_parser">
      <img alt="undefined" src="https://img.shields.io/crates/d/swc_ecma_parser.svg?label=crates.io%20downloads">
    </a>
</p>
<p align="center">
   <a href="https://travis-ci.com/github/swc-project/swc">
      <img alt="Travis Status" src="https://img.shields.io/travis/swc-project/swc/master.svg?label=travis&maxAge=43200">
   </a>
   <a href="https://codecov.io/gh/swc-project/swc">
      <img alt="Coverage" src="https://codecov.io/gh/swc-project/swc/branch/master/graph/badge.svg">
   </a>
</p>

swc is a super-fast typescript / javascript compiler written in rust.

# Documentation

Check out the documentation [in the website](https://swc.rs/docs/installation/).

# Features

Please see [comparison with babel](https://swc.rs/docs/comparison-babel).

# Performance

The lower bound of the speedup compared to babel is **18**. The benchmarks were run on Macbook pro, dual core, 2.3GHz Intel Core i5, 16 GB ram

|                    |              performance               |
| ------------------ | :------------------------------------: |
| swc (es3)          |  761 ops/sec ±0.23% (89 runs sampled)  |
| swc (es2015)       |  800 ops/sec ±1.02% (87 runs sampled)  |
| swc (es2016)       | 2123 ops/sec ±0.84% (88 runs sampled)  |
| swc (es2017)       | 2131 ops/sec ±1.13% (90 runs sampled)  |
| swc (es2018)       | 2981 ops/sec ±0.25% (90 runs sampled)  |
| swc-optimize (es3) |  712 ops/sec ±0.21% (86 runs sampled)  |
| babel              | 41.75 ops/sec ±8.07% (56 runs sampled) |

<h2 align="center">Supporting swc</h2>

<p align="center">
   <a href="#backers">
      <img alt="Backers on Open Collective" src="https://opencollective.com/swc/tiers/backer/badge.svg?label=backer&color=brightgreen" />
   </a>
   <a href="#gold-sponsors">
      <img alt="Gold sponsors on Open Collective" src="https://opencollective.com/swc/tiers/gold-sponsors/badge.svg?label=Gold%20sponsors&color=brightgreen"/>
   </a>
   <a href="#silver-sponsors">
      <img alt="Silver sponsors on Open Collective" src="https://opencollective.com/swc/tiers/silver-sponsors/badge.svg?label=Silver%20sponsors&color=brightgreen"/>
   </a>
   <a href="#bronze-sponsors">
      <img alt="Bronze sponsors on Open Collective" src="https://opencollective.com/swc/tiers/bronze-sponsors/badge.svg?label=Bronze%20sponsors&color=brightgreen"/>
   </a>
</p>

swc is a community-driven project, and is maintained by a group of [volunteers](https://opencollective.com/swc#team). If you'd like to help support the future of the project, please consider:

- Giving developer time on the project. (Message us on [Github discussions](https://github.com/swc-project/swc/discussions) (preferred) or [Slack](https://swc-org.slack.com/) for guidance!)
- [Slackin for swc](https://swc-slackin.herokuapp.com)
- Giving funds by becoming a sponsor (see below)!

## Open Collective Sponsors

Become a sponsor and get your logo on our README on Github with a link to your site. [[Become a sponsor](https://opencollective.com/swc#sponsor)]

<h2 id="gold-sponsers" align="center">Gold Sponsors</h2>
<a href="https://opencollective.com/swc">
    <img src="https://opencollective.com/swc/tiers/gold-sponsers.svg?avatarHeight=64">
</a>

<h2 id="silver-sponsers" align="center">Silver Sponsors</h2>
<a href="https://opencollective.com/swc">
    <img src="https://opencollective.com/swc/tiers/silver-sponsers.svg?avatarHeight=64">
</a>

<h2 id="bronze-sponsers" align="center">Bronze Sponsors</h2>
<a href="https://opencollective.com/swc">
    <img src="https://opencollective.com/swc/tiers/bronze-sponsers.svg?avatarHeight=64">
</a>

<h2 id="backers" align="center">Backers</h2>
<a href="https://opencollective.com/swc">
    <img src="https://opencollective.com/swc/tiers/backer.svg?avatarHeight=64">
</a>

[Become a backer](https://opencollective.com/swc#backer) and get your image on our README on Github with a link to your site.

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md). You may also find the architecture
documentation useful ([ARCHITECTURE.md](ARCHITECTURE.md)).

## License

swc is primarily distributed under the terms of both the MIT license
and the Apache License (Version 2.0).

See LICENSE-APACHE and LICENSE-MIT for details.

[babel]: https://github.com/babel/babel
[closure compiler]: https://github.com/google/closure-compiler
[rust]: https://www.rust-lang.org
