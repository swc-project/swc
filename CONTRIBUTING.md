# Contributing to SWC

Thank you for your interest in contributing to SWC! Good places to start are:

-   Reading this document
-   Reading the high-level structure of SWC in [ARCHITECTURE.md](ARCHITECTURE.md)
-   [E-easy][e-easy] labeled issues on the [issue tracker][issue-tracker]

## Code of Conduct

All contributors are expected to follow our [Code of Conduct].

## Bug reports

We can't fix what we don't know about, so please report problems. This
includes problems with understanding the documentation, unhelpful error messages,
and unexpected behavior.

You can open a new issue by following [this link][new-issues] and choosing one of the issue templates.

## Feature requests

Please feel free to open an issue using the [feature request template][new-issues].

## Working on issues

If you're looking for somewhere to start, check out the [E-easy][e-easy] and
[E-mentor][e-mentor] tags.

Feel free to ask for guidelines on how to tackle a problem on [gitter][] or open a
[new issue][new-issues]. This is especially important if you want to add new
features to SWC or make large changes to the already existing code-base.
The SWC core developers will do their best to provide help.

If you start working on an already-filed issue, post a comment on this issue to
let people know that somebody is working it. Feel free to ask for comments if
you are unsure about the solution you would like to submit.

We use the "fork and pull" model [described here][development-models], where
contributors push changes to their personal fork and create pull requests to
bring those changes into the source repository. This process is partly
automated: Pull requests are made against SWC's repository, tested and
reviewed. Once a change is approved to be merged, a friendly bot merges the
changes into an internal branch, runs the full test-suite on that branch
and only then merges into master. This ensures that SWC passes the test-suite at all times.

Steps to get started:

-   Fork SWC and create a branch from master for the issue you are working on.
-   Make sure you have the `make` utility installed, along with Rust and C/C++
    compilers.
-   Please adhere to the code style that you see around the location you are
    working on.
-   [Commit as you go][githelp].
-   Include tests that cover all non-trivial code. The existing tests
    in `test/` provide templates on how to test SWC's behavior in a
    sandbox-environment. The internal crate `testing` provides a vast amount
    of helpers to minimize boilerplate. See [`testing/lib.rs`] for an
    introduction to writing tests.
-   Run `cargo test` and make sure that it passes.
-   All code changes are expected to comply with the formatting suggested by `rustfmt`.
    You can use `rustup component add --toolchain nightly rustfmt-preview` to install `rustfmt` and use
    `rustfmt +nightly --unstable-features --skip-children` on the changed files to automatically format your code.
-   Push your commits to GitHub and create a pull request against the `swc-project/swc` `master` branch.

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

After the pull request is made, one of the SWC project developers will review your code.
The review-process will make sure that the proposed changes are sound.
Please give the assigned reviewer sufficient time, especially during weekends.
If you don't get a reply, you may ping the core developers on [gitter].

A merge of SWC's master-branch and your changes is immediately queued
to be tested after the pull request is made. In case unforeseen
problems are discovered during this step (e.g. a failure on a platform you
originally did not develop on), you may ask for guidance. Push additional
commits to your branch to tackle these problems.

The reviewer might point out changes deemed necessary. Please add them as
extra commits; this ensures that the reviewer can see what has changed since
the code was previously reviewed. Large or tricky changes may require several
passes of review and changes.

Once the reviewer approves your pull request, a friendly bot picks it up
and merges it into the SWC `master` branch.

## Contributing to the documentation

The SWC documentation can be found at [`swc-project/website`](https://github.com/swc-project/website/tree/master/pages/docs).

At the bottom of each page on [swc.rs](https://swc.rs) there is a `Edit this page on GitHub` button that immediately links to the right page to edit.

## Issue Triage

Sometimes an issue will stay open, even though the bug has been fixed. And
sometimes, the original bug may go stale because something has changed in the
meantime.

It can be helpful to go through older bug reports and make sure that they are
still valid. Load up an older issue, double check that it's still true, and
leave a comment letting us know if it is or is not. The [least recently
updated sort][lru] is good for finding issues like this.

Contributors with sufficient permissions on the SWC repository can help by
adding labels to triage issues:

-   Yellow, **A**-prefixed labels state which **area** of the project an issue
    relates to.

-   Magenta, **B**-prefixed labels identify bugs which are **blockers**.

-   Red, **C**-prefixed labels represent the **category** of an issue.
    In particular, **C-feature-request** marks _proposals_ for new features. If
    an issue is **C-feature-request**, but is not **Feature accepted**,
    then it was not thoroughly discussed, and might need some additional design
    or perhaps should be implemented as an external subcommand first. Ping
    `@swc-project/swc` if you want to send a PR for an such issue.

-   Green, **E**-prefixed labels explain the level of **experience** or
    **effort** necessary to fix the issue. [**E-mentor**][e-mentor] issues also
    have some instructions on how to get started.

-   Purple gray, **O**-prefixed labels are the **operating system** or platform
    that this issue is specific to.

-   Orange, **P**-prefixed labels indicate a bug's **priority**.
-   Light orange, **L**-prefixed labels indicate language related to the bug.

[gist]: https://gist.github.com/
[new-issues]: https://github.com/swc-project/swc/issues/new/choose
[e-easy]: https://github.com/swc-project/swc/labels/E-easy
[e-mentor]: https://github.com/swc-project/swc/labels/E-mentor
[code of conduct]: https://www.rust-lang.org/conduct.html
[gitter]: https://gitter.im/swcproject/Lobby
[`testing/lib.rs`]: https://github.com/swc-project/swc/blob/master/testing/src/lib.rs
[irlo]: https://internals.rust-lang.org/
[subcommands]: https://doc.rust-lang.org/cargo/reference/external-tools.html#custom-subcommands
[issue-tracker]: https://github.com/swc-project/swc/issues
