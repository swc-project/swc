1. Write performant code. Always prefer performance over other things.
2. Write comments and documentations in English.
3. Do not use unstable, nightly only features of rustc.
4. When creating Atom instances, it's better to use `Cow<str>` or `&str` instead of `String`. Note that `&str` is better than `Cow<str>` here.
5. Write unit tests for your code.
6. When instructed to fix tests, do not remove or modify existing tests.
7. Write documentation for your code.
8. Run `cargo fmt --all` before commiting files.
9. Place all import statements at the top of the file for consistency. Do not use inline `use` statements within functions or impl blocks.
