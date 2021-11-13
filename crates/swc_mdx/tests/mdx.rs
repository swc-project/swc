//! Tests ported from https://github.com/mdx-js/mdx/blob/2393084548f856fa07920cb07668db66d952a560/packages/mdx/test/compile.js

fn expect(input: &str, output: &str) {}

#[test]
fn empty() {
    expect("", "");
}
