use super::Plan;
use crate::bundler::tests::{suite, Tester};
use std::collections::{HashMap, HashSet};
use swc_common::FileName;

fn assert_normal(t: &mut Tester, p: &Plan, entry: &str, deps: &[&str]) {
    if deps.is_empty() {
        return;
    }

    assert_eq!(
        p.normal[&t.id(&format!("{}.js", entry))]
            .chunks
            .iter()
            .cloned()
            .collect::<HashSet<_>>(),
        deps.into_iter()
            .map(|s| format!("{}.js", s))
            .map(|s| t.id(&s))
            .collect::<HashSet<_>>(),
        "Should merge {:?}",
        deps
    );
}

#[test]
fn concurrency_001() {
    suite()
        .file(
            "main.js",
            "
            export { b } from './b';
            export { a } from './a';
            ",
        )
        .file(
            "a.js",
            "
            import { b } from './b';
            export const a = '1';
            console.log(b);
            ",
        )
        .file(
            "b.js",
            "
            export const b = '1'
            ",
        )
        .run(|t| {
            let module = t
                .bundler
                .load_transformed(&FileName::Real("main.js".into()))?
                .unwrap();
            let mut entries = HashMap::default();
            entries.insert("main.js".to_string(), module);

            let p = t.bundler.determine_entries(entries)?;

            assert_eq!(p.circular.len(), 0);

            assert_normal(t, &p, "main", &["a"]);
            assert_normal(t, &p, "a", &["b"]);
            assert_normal(t, &p, "b", &[]);

            Ok(())
        });
}

#[test]
fn concurrency_002() {
    suite()
        .file(
            "main.js",
            "
            export { a } from './a';
            export { b } from './b';
            ",
        )
        .file(
            "a.js",
            "
            import { b } from './b';
            export const a = '1';
            console.log(b);
            ",
        )
        .file(
            "b.js",
            "
            export const b = '1'
            ",
        )
        .run(|t| {
            let module = t
                .bundler
                .load_transformed(&FileName::Real("main.js".into()))?
                .unwrap();
            let mut entries = HashMap::default();
            entries.insert("main.js".to_string(), module);

            let p = t.bundler.determine_entries(entries)?;

            assert_eq!(p.circular.len(), 0);

            assert_normal(t, &p, "main", &["a"]);
            assert_normal(t, &p, "a", &["b"]);
            assert_normal(t, &p, "b", &[]);

            Ok(())
        });
}

#[test]
fn concurrency_003() {
    suite()
        .file(
            "main.js",
            "
            import { A } from './a';
            import { B } from './b';

            console.log(A, B);
            ",
        )
        .file(
            "a.js",
            "
            import { B } from './b';

            export class A extends B { }
            ",
        )
        .file(
            "b.js",
            "
            export class B { }
            ",
        )
        .run(|t| {
            let module = t
                .bundler
                .load_transformed(&FileName::Real("main.js".into()))?
                .unwrap();
            let mut entries = HashMap::default();
            entries.insert("main.js".to_string(), module);

            let p = t.bundler.determine_entries(entries)?;

            assert_eq!(p.circular.len(), 0);
            assert_eq!(p.normal.len(), 2);
            assert_normal(t, &p, "main", &["a"]);
            assert_normal(t, &p, "a", &["b"]);
            assert_normal(t, &p, "b", &[]);

            Ok(())
        });
}

#[test]
fn es6_concurrency() {
    suite()
        .file(
            "main.js",
            "
                import './a';
                import './b';
                ",
        )
        .file("a.js", "import './common';")
        .file("b.js", "import './common';")
        .file("common.js", r#"console.log('foo')"#)
        .run(|t| {
            let module = t
                .bundler
                .load_transformed(&FileName::Real("main.js".into()))?
                .unwrap();
            let mut entries = HashMap::default();
            entries.insert("main.js".to_string(), module);

            let p = t.bundler.determine_entries(entries)?;

            assert_eq!(p.circular.len(), 0);
            assert_eq!(p.normal.len(), 3);

            Ok(())
        });
}

#[test]
fn cjs_concurrency() {
    suite()
        .file(
            "main.js",
            "
                require('./a');
                require('./b');
                ",
        )
        .file("a.js", "require('./common')")
        .file("b.js", "require('./common')")
        .file("common.js", r#"console.log('foo')"#)
        .run(|t| {
            let module = t
                .bundler
                .load_transformed(&FileName::Real("main.js".into()))?
                .unwrap();
            let mut entries = HashMap::default();
            entries.insert("main.js".to_string(), module.clone());

            let p = t.bundler.determine_entries(entries)?;

            assert_eq!(p.circular.len(), 0);

            assert_normal(t, &p, "main", &["a", "b"]);

            Ok(())
        });
}
