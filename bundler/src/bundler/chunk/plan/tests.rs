use crate::bundler::tests::suite;
use std::collections::HashMap;
use swc_common::FileName;

#[test]
fn concurrency_01_1() {
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

            assert_eq!(determined.normal.len(), 2);
            assert_eq!(determined.circular.len(), 0);

            Ok(())
        });
}

#[test]
fn concurrency_01_2() {
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

            assert_eq!(determined.normal.len(), 2);
            assert_eq!(determined.circular.len(), 0);

            Ok(())
        });
}
