# Contributing to swc

Thank you for your interest in contributing to swc! Good places to start are this document, ARCHITECTURE.md, which describes the high-level structure of swc and E-easy bugs on the issue tracker.

## Code of Conduct

All contributors are expected to follow our [Code of Conduct].

## Bug reports

We can't fix what we don't know about, so please report problems liberally. This
includes problems with understanding the documentation, unhelpful error messages,
and unexpected behavior.

Opening an issue is as easy as following [this link][new-issues] and filling out
the fields. Here's a template that you can use to file an issue, though it's not
necessary to use it exactly:

    <short summary of the problem>

    I tried this: <minimal example that causes the problem>

    I expected to see this happen: <explanation>

    Instead, this happened: <explanation>

    I'm using <output of `swc --version`>

All three components are important: what you did, what you expected, what
happened instead. Please use https://gist.github.com/ if your examples run long.

## Feature requests

Please feel free to open an issue or to send a pr.

## Working on issues

If you're looking for somewhere to start, check out the [E-easy][e-easy] and
[E-mentor][e-mentor] tags.

Feel free to ask for guidelines on how to tackle a problem on [gitter][] or open a
[new issue][new-issues]. This is especially important if you want to add new
features to swc or make large changes to the already existing code-base.
swc's core developers will do their best to provide help.

If you start working on an already-filed issue, post a comment on this issue to
let people know that somebody is working it. Feel free to ask for comments if
you are unsure about the solution you would like to submit.

We use the "fork and pull" model [described here][development-models], where
contributors push changes to their personal fork and create pull requests to
bring those changes into the source repository. This process is partly
automated: Pull requests are made against swc's master-branch, tested and
reviewed. Once a change is approved to be merged, a friendly bot merges the
changes into an internal branch, runs the full test-suite on that branch
and only then merges into master. This ensures that swc's master branch
passes the test-suite at all times.

Your basic steps to get going:

- Fork swc and create a branch from master for the issue you are working on.
- Make sure you have the `make` utility installed, along with Rust and C/C++
  compilers.
- Please adhere to the code style that you see around the location you are
  working on.
- [Commit as you go][githelp].
- Include tests that cover all non-trivial code. The existing tests
  in `test/` provide templates on how to test swc's behavior in a
  sandbox-environment. The internal crate `testing` provides a vast amount
  of helpers to minimize boilerplate. See [`testing/lib.rs`] for an
  introduction to writing tests.
- Make sure `cargo test` passes.
- All code changes are expected to comply with the formatting suggested by `rustfmt`.
  You can use `rustup component add --toolchain nightly rustfmt-preview` to install `rustfmt` and use
  `rustfmt +nightly --unstable-features --skip-children` on the changed files to automatically format your code.
- Push your commits to GitHub and create a pull request against swc's `master` branch.

## Getting your development environment set up

After cloning the project there are a few steps required to get the project running.

1.  Fetch submodules to pull ECMAScript test suites.

    ```bash
    git submodule update --init --recursive
    ```

2.  Install js dependencies.

    ```bash
    yarn add browserslist
    ( cd ecmascript/transforms; yarn install )
    ```

3.  Setup some environment variables which is required for tests.

    ```bash
    export RUSTFLAGS='--cfg procmacro2_semver_exempt'
    export RUST_BACKTRACE=full
    export PATH="$PATH:$PWD/ecmascript/transforms/node_modules/.bin"
    ```

4.  Install deno, if you are going to work on the bundler.

    See [official install guide of deno](https://deno.land/manual/getting_started/installation) to install it.

5.  Run tests

    ```bash
    cargo test --all --all-features
    ```

## Pull requests

After the pull request is made, one of the swc project developers will review your code.
The review-process will make sure that the proposed changes are sound.
Please give the assigned reviewer sufficient time, especially during weekends.
If you don't get a reply, you may poke the core developers on [gitter].

A merge of swc's master-branch and your changes is immediately queued
to be tested after the pull request is made. In case unforeseen
problems are discovered during this step (e.g. a failure on a platform you
originally did not develop on), you may ask for guidance. Push additional
commits to your branch to tackle these problems.

The reviewer might point out changes deemed necessary. Please add them as
extra commits; this ensures that the reviewer can see what has changed since
the code was previously reviewed. Large or tricky changes may require several
passes of review and changes.

Once the reviewer approves your pull request, a friendly bot picks it up
and merges it into swc's `master` branch.

## Contributing to the documentation

TODO

## Issue Triage

Sometimes an issue will stay open, even though the bug has been fixed. And
sometimes, the original bug may go stale because something has changed in the
meantime.

It can be helpful to go through older bug reports and make sure that they are
still valid. Load up an older issue, double check that it's still true, and
leave a comment letting us know if it is or is not. The [least recently
updated sort][lru] is good for finding issues like this.

Contributors with sufficient permissions on the Rust-repository can help by
adding labels to triage issues:

- Yellow, **A**-prefixed labels state which **area** of the project an issue
  relates to.

- Magenta, **B**-prefixed labels identify bugs which are **blockers**.

- Red, **C**-prefixed labels represent the **category** of an issue.
  In particular, **C-feature-request** marks _proposals_ for new features. If
  an issue is **C-feature-request**, but is not **Feature accepted**,
  then it was not thoroughly discussed, and might need some additional design
  or perhaps should be implemented as an external subcommand first. Ping
  @swc-projcet/swc if you want to send a PR for an such issue.

- Green, **E**-prefixed labels explain the level of **experience** or
  **effort** necessary to fix the issue. [**E-mentor**][e-mentor] issues also
  have some instructions on how to get started.

- Purple gray, **O**-prefixed labels are the **operating system** or platform
  that this issue is specific to.

- Orange, **P**-prefixed labels indicate a bug's **priority**.
- Light orange, **L**-prefixed labels indicate language related to the bug.

[gist]: https://gist.github.com/
[new-issues]: https://github.com/swc-project/swc/issues/new
[e-easy]: https://github.com/swc-project/swc/labels/E-easy
[e-mentor]: https://github.com/swc-project/swc/labels/E-mentor
[code of conduct]: https://www.rust-lang.org/conduct.html
[gitter]: https://gitter.im/swcproject/Lobby
[`testing/lib.rs`]: https://github.com/swc-project/swc/blob/master/testing/src/lib.rs
[irlo]: https://internals.rust-lang.org/
[subcommands]: https://doc.rust-lang.org/cargo/reference/external-tools.html#custom-subcommands
