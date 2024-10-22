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

Feel free to ask for guidelines on how to tackle a problem on [Discord][discord] or open a
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
and only then merges into main. This ensures that SWC passes the test-suite at all times.

Steps to get started:

-   Fork SWC and create a branch from main for the issue you are working on.
-   Make sure you have the `make` utility installed, along with Rust and C/C++
    compilers.
-   Please adhere to the code style that you see around the location you are
    working on.
-   Commit as you go.
-   Include tests that cover all non-trivial code. The existing tests
    in `tests/` provide templates on how to test SWC's behavior in a
    sandbox-environment. The internal crate `testing` provides a vast amount
    of helpers to minimize boilerplate. See [`testing/lib.rs`] for an
    introduction to writing tests.
-   Run `cargo test` and make sure that it passes.
-   All code changes are expected to comply with the formatting suggested by `rustfmt`.
    You can use `rustup component add --toolchain nightly rustfmt-preview` to install `rustfmt` and use
    `rustfmt +nightly --unstable-features --skip-children` on the changed files to automatically format your code.
-   Push your commits to GitHub and create a pull request against the `swc-project/swc` `main` branch.

## Getting your development environment set up

### Optional CLI tools

CLI tools below will help development.
Note that these tools are optional.

-   [fd](https://github.com/sharkdp/fd)

This is used for performant file operations in git hooks.

---

After cloning the project there are a few steps required to get the project running.
For running all tests, take the following steps:

1. Fetch submodules to pull ECMAScript test suites.

    ```bash
    git submodule update --init --recursive
    ```

2. Install js dependencies.
   Ensure [Yarn Package Manager is installed](https://yarnpkg.com/getting-started/install)

    ```bash
    yarn
    ```

3. Setup some environment variables which is required for tests.

    ```bash
    export RUST_BACKTRACE=full
    export PATH="$PATH:$PWD/node_modules/.bin"
    export RUST_MIN_STACK=16777216
    ```

4. Install deno

    See [official install guide of deno](https://docs.deno.com/runtime/manual/getting_started/installation/) to install it.

5. Add wasm32-wasi target

    `rustup target add wasm32-wasi`

6. Ensure you're using Node.JS >= 16

    Since tests make use of `atob` which was only introduced in node 16.

7. Run tests

    ```bash
    cargo test --all --no-default-features --features swc_v1 --features filesystem_cache
    ```

    Or

    ```bash
    cargo test --all --no-default-features --features swc_v2 --features filesystem_cache
    ```

    **TIP**: If you see errors while attempting to run the commands above, we usually do not run all tests at once. Instead, we run tests per package ([see below](#running-tests-per-package)), which you can use to verify your local setup.

## Running tests per package

While working on specific packages, individual tests can be run by specifying a package to the
cargo test runner, e.g.

```bash
cargo test -p swc_ecma_transforms --all-features
```

## Pull requests

After the pull request is made, one of the SWC project developers will review your code.
The review-process will make sure that the proposed changes are sound.
Please give the assigned reviewer sufficient time, especially during weekends.
If you don't get a reply, you may ping the core developers on [Discord][discord].

A merge of SWC's main-branch and your changes is immediately queued
to be tested after the pull request is made. In case unforeseen
problems are discovered during this step (e.g. a failure on a platform you
originally did not develop on), you may ask for guidance. Push additional
commits to your branch to tackle these problems.

The reviewer might point out changes deemed necessary. Please add them as
extra commits; this ensures that the reviewer can see what has changed since
the code was previously reviewed. Large or tricky changes may require several
passes of review and changes.

Once the reviewer approves your pull request, a friendly bot picks it up
and merges it into the SWC `main` branch.

SWC uses changeset for changelog management with a bit of custom logic.
A changeset for SWC looks like this:

```markdown
---
swc_core: patch
swc_ecma_transforms_base: patch
---

fix(es/renamer): Check `preserved` in normal renaming mode
```

You need to list the `crate names: patch | minor | major` in the front matter (`---` section).
If you are not sure, you can skip it and the maintainer will help you.

## Contributing to the documentation

The SWC documentation can be found at [`swc-project/website`](https://github.com/swc-project/website/tree/main/pages/docs).

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
[development-models]: https://docs.github.com/en/pull-requests/collaborating-with-pull-requests/getting-started/about-collaborative-development-models
[discord]: https://discord.com/invite/GnHbXTdZz6
[`testing/lib.rs`]: https://github.com/swc-project/swc/blob/main/crates/testing/src/lib.rs
[irlo]: https://internals.rust-lang.org/
[lru]: https://docs.github.com/en/search-github/getting-started-with-searching-on-github/sorting-search-results#sort-by-updated-date
[subcommands]: https://doc.rust-lang.org/cargo/reference/external-tools.html#custom-subcommands
[issue-tracker]: https://github.com/swc-project/swc/issues
