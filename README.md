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
      <img alt="npm Downloads" src="https://img.shields.io/npm/dm/@swc/core">
   </a>
    <a href="https://crates.io/crates/swc_ecma_parser">
      <img alt="undefined" src="https://img.shields.io/crates/d/swc_ecma_parser.svg?label=crates.io%20downloads">
    </a>
    <img alt="GitHub release (latest SemVer)" src="https://img.shields.io/github/v/release/swc-project/swc">
</p>

<p align="center">
   <img alt="GitHub code size in bytes" src="https://img.shields.io/github/languages/code-size/swc-project/swc">
   <a href="https://github.com/swc-project/swc/actions/workflows/cargo.yml">
      <img alt="CI Status" src="https://github.com/swc-project/swc/actions/workflows/cargo.yml/badge.svg?event=push">
   </a>
   <img alt="node-current (scoped)" src="https://img.shields.io/node/v/@swc/core">
</p>

<p align="center">
   <a href="https://discord.com/invite/GnHbXTdZz6">
      <img alt="Discord" src="https://img.shields.io/discord/889779439272075314">
   </a>
</p>

SWC (stands for `Speedy Web Compiler`) is a super-fast TypeScript / JavaScript compiler written in Rust. It's a library for Rust and JavaScript at the same time. If you are using SWC from Rust, see [rustdoc](https://rustdoc.swc.rs/swc/) and for most users, your entry point for using the library will be [parser](https://rustdoc.swc.rs/swc_ecma_parser/).

Also, SWC tries to ensure that

> If you select the latest version of each crates, it will work

for rust users. Without such guarantee, using SWC would be too hard as SWC is a large, modular project and typically you have to use many modules.

---

If you are using SWC from JavaScript, please refer to [docs on the website](https://swc.rs/docs/installation/).

# Documentation

Check out the documentation [in the website](https://swc.rs/docs/installation/).

# Features

Please see [comparison with babel](https://swc.rs/docs/migrating-from-babel).

# Performance

Please see [benchmark results](https://swc.rs/docs/benchmark-transform) on the website.

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

SWC is a community-driven project, and is maintained by a group of [volunteers](https://opencollective.com/swc#team). If you'd like to help support the future of the project, please consider:

-   Giving developer time on the project. (Message us on [Discord](https://discord.gg/GnHbXTdZz6) (preferred) or [Github discussions](https://github.com/swc-project/swc/discussions) for guidance!)
-   Giving funds by becoming a sponsor (see https://opencollective.com/swc)!

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md). You may also find the architecture
documentation useful ([ARCHITECTURE.md](ARCHITECTURE.md)).

## License

SWC is primarily distributed under the terms of both the MIT license
and the Apache License (Version 2.0).

See LICENSE-APACHE and LICENSE-MIT for details.

[babel]: https://github.com/babel/babel
[closure compiler]: https://github.com/google/closure-compiler
[rust]: https://www.rust-lang.org
