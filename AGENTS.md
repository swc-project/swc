### Instructions

-   Write performant code. Always prefer performance over other things.
-   Write comments and documentations in English.
-   Do not use unstable, nightly only features of rustc.
-   When creating Atom instances, it's better to use `Cow<str>` or `&str` instead of `String`. Note that `&str` is better than `Cow<str>` here.
-   Write unit tests for your code.
-   When instructed to fix tests, do not remove or modify existing tests.
-   Write documentation for your code.
-   Run `cargo fmt --all` before commiting files.
-   Commit your work as frequent as possible using git. Do NOT use `--no-verify` flag.
-   Prefer multiple small files over single large file.
