use crate::bundler::{import::ImportHandler, tests::test_bundler};
use std::path::Path;

#[test]
#[ignore]
fn ns_import_deglob_simple() {
    test_bundler(|t| {
        let m = t.parse(
            "
import * as ns from 'foo';
ns.foo();
",
        );
        let mut v = ImportHandler {
            path: &Path::new("index.js"),
            bundler: &t.bundler,
            top_level: false,
            info: Default::default(),
            forces_ns: Default::default(),
            ns_usage: Default::default(),
            deglob_phase: false,
        };
        let m = m.fold_with(&mut v);
        assert!(v.forces_ns.is_empty());
        assert_eq!(v.info.imports.len(), 1);

        t.assert_eq(&m, "foo();");
    })
}

#[test]
#[ignore]
fn ns_import_deglob_multi() {
    test_bundler(|t| {
        let m = t.parse(
            "
import * as ns from 'foo';
ns.foo();
ns.bar();
",
        );
        let mut v = ImportHandler {
            path: &Path::new("index.js"),
            bundler: &t.bundler,
            top_level: false,
            info: Default::default(),
            forces_ns: Default::default(),
            ns_usage: Default::default(),
            deglob_phase: false,
        };
        let m = m.fold_with(&mut v);
        assert!(v.forces_ns.is_empty());
        assert_eq!(v.info.imports.len(), 1);
        assert_eq!(v.info.imports[0].specifiers.len(), 2);
        assert!(!format!("{:?}", v.info.imports[0].specifiers).contains("ns"));

        t.assert_eq(
            &m,
            "foo();
bar();",
        );
    })
}
