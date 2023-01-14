#[test]
fn atom_macro_should_store_static_str() {
    use crate::{atom, Inner};
    let a = atom!("foo");
    assert!(matches!(a.0, Inner::Static(_)));
}
