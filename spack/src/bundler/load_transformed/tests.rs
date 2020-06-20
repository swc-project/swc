use crate::bundler::tests::test_bundler;

#[test]
fn basic() {
    test_bundler(|t| {
        t.parse("");
    });
}
