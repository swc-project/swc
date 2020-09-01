use crate::bundler::tests::suite;
use std::collections::HashMap;
use swc_common::FileName;

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

            let determined = t.bundler.determine_entries(entries)?;

            assert_eq!(determined.circular.len(), 0);
            assert_eq!(determined.normal.len(), 2);

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

            let determined = t.bundler.determine_entries(entries)?;

            assert_eq!(determined.circular.len(), 0);
            assert_eq!(determined.normal.len(), 2);

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

            let determined = t.bundler.determine_entries(entries)?;

            assert_eq!(determined.circular.len(), 0);
            assert_eq!(determined.normal.len(), 2);
            assert_eq!(
                determined.normal[&t.id("main.js")].chunks.len(),
                1,
                "Should merge a.js"
            );
            assert_eq!(
                determined.normal[&t.id("a.js")].chunks.len(),
                1,
                "Sould merge b.js"
            );
            assert_eq!(
                determined.normal[&t.id("b.js")].chunks.len(),
                0,
                "No import"
            );

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

            let determined = t.bundler.determine_entries(entries)?;

            assert_eq!(determined.circular.len(), 0);
            assert_eq!(determined.normal.len(), 3);

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

            let determined = t.bundler.determine_entries(entries)?;

            assert_eq!(determined.circular.len(), 0);
            assert_eq!(determined.normal.len(), 3);

            assert_eq!(determined.normal[&t.id("main.js")].chunks.len(), 2, "a, b");
            assert_eq!(determined.normal[&t.id("main.js")].chunks.len(), 2);

            Ok(())
        });
}
