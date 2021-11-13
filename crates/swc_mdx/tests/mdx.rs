//! Tests ported from https://github.com/mdx-js/mdx/blob/2393084548f856fa07920cb07668db66d952a560/packages/mdx/test/compile.js

#[derive(Debug, Default)]
struct TestOpts {}

fn test_render(input: &str, output: &str, opts: TestOpts) {}

#[test]
fn empty() {
    test_render("", "", Default::default());
}
