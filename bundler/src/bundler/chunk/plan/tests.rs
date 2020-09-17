use super::Plan;
use crate::bundler::tests::{suite, Tester};
use std::collections::{HashMap, HashSet};
use swc_common::FileName;

#[track_caller]
fn assert_normal(t: &mut Tester, p: &Plan, entry: &str, deps: &[&str]) {
    assert_normal_transitive(t, p, entry, deps, &[]);
}

#[track_caller]
fn assert_normal_transitive(
    t: &mut Tester,
    p: &Plan,
    entry: &str,
    deps: &[&str],
    transitive_deps: &[&str],
) {
    if deps.is_empty() {
        if let Some(v) = p.normal.get(&t.id(&format!("{}.js", entry))) {
            assert_eq!(v.chunks, vec![], "Should be empty");
        }

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

    assert_eq!(
        p.normal[&t.id(&format!("{}.js", entry))]
            .transitive_chunks
            .iter()
            .cloned()
            .collect::<HashSet<_>>(),
        transitive_deps
            .into_iter()
            .map(|s| format!("{}.js", s))
            .map(|s| t.id(&s))
            .collect::<HashSet<_>>(),
        "Should merge {:?} transitivly",
        transitive_deps
    )
}

#[track_caller]
fn assert_circular(t: &mut Tester, p: &Plan, entry: &str, members: &[&str]) {
    assert_eq!(
        p.circular[&t.id(&format!("{}.js", entry))]
            .chunks
            .iter()
            .cloned()
            .collect::<HashSet<_>>(),
        members
            .into_iter()
            .map(|s| format!("{}.js", s))
            .map(|s| t.id(&s))
            .collect::<HashSet<_>>(),
        "[circular] `{}` should merge {:?}",
        entry,
        members
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

            let p = t.bundler.calculate_plan(entries)?;

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

            let p = t.bundler.calculate_plan(entries)?;

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

            let p = t.bundler.calculate_plan(entries)?;

            assert_eq!(p.circular.len(), 0);
            assert_eq!(p.normal.len(), 2);
            assert_normal(t, &p, "main", &["a"]);
            assert_normal(t, &p, "a", &["b"]);
            assert_normal(t, &p, "b", &[]);

            Ok(())
        });
}

#[test]
fn circular_001() {
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
            import { B } from './b'
        ",
        )
        .file(
            "b.js",
            "
            import { A } from './a';
            ",
        )
        .run(|t| {
            let module = t
                .bundler
                .load_transformed(&FileName::Real("main.js".into()))?
                .unwrap();
            let mut entries = HashMap::default();
            entries.insert("main.js".to_string(), module.clone());

            let p = t.bundler.calculate_plan(entries)?;

            dbg!(&p);

            assert_circular(t, &p, "a", &["b"]);
            assert_normal(t, &p, "main", &["a", "b"]);
            assert_normal(t, &p, "a", &[]);
            assert_normal(t, &p, "b", &[]);

            Ok(())
        });
}

#[test]
fn transitive_001() {
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

            let p = t.bundler.calculate_plan(entries)?;

            dbg!(&p);

            assert_eq!(p.circular.len(), 0);
            assert_normal_transitive(t, &p, "main", &["a", "b"], &["common"]);
            assert_normal_transitive(t, &p, "a", &[], &[]);
            assert_normal_transitive(t, &p, "b", &[], &[]);

            Ok(())
        });
}

#[test]
fn transitive_002() {
    suite()
        .file(
            "main.js",
            "
                import './a';
                import './b';
                import './c';
                import './d';
                ",
        )
        .file(
            "a.js",
            "
                import './common1';
                import './common2';
                ",
        )
        .file(
            "b.js",
            "
                import './common2';
                import './common1';
                ",
        )
        .file(
            "c.js",
            "
                import './common3';
                import './common2';
                ",
        )
        .file(
            "d.js",
            "
                import './common1';
                import './common4';
                ",
        )
        .file("common1.js", r#"console.log(1)"#)
        .file("common2.js", r#"console.log(2)"#)
        .file("common3.js", r#"console.log(3)"#)
        .file("common4.js", r#"console.log(4)"#)
        .run(|t| {
            let module = t
                .bundler
                .load_transformed(&FileName::Real("main.js".into()))?
                .unwrap();
            let mut entries = HashMap::default();
            entries.insert("main.js".to_string(), module);

            let p = t.bundler.calculate_plan(entries)?;

            dbg!(&p);

            assert_eq!(p.circular.len(), 0);
            assert_normal_transitive(
                t,
                &p,
                "main",
                &["a", "b", "c", "d"],
                &["common1", "common2"],
            );
            assert_normal_transitive(t, &p, "a", &[], &[]);
            assert_normal_transitive(t, &p, "b", &[], &[]);
            assert_normal_transitive(t, &p, "b", &[], &["common3"]);
            assert_normal_transitive(t, &p, "b", &[], &["common4"]);

            Ok(())
        });
}

#[test]
fn cjs_001() {
    suite()
        .file(
            "main.js",
            "
                require('./a')
                const b = require('./b');
                console.log(b);
                ",
        )
        .file(
            "a.js",
            "
                require('./b')
                ",
        )
        .file(
            "b.js",
            "
                module.exports = 'b';
                ",
        )
        .run(|t| {
            let module = t
                .bundler
                .load_transformed(&FileName::Real("main.js".into()))?
                .unwrap();
            let mut entries = HashMap::default();
            entries.insert("main.js".to_string(), module);

            let p = t.bundler.calculate_plan(entries)?;

            dbg!(&p);

            assert_eq!(p.circular.len(), 0);
            assert_normal(t, &p, "main", &["a", "b"]);
            assert_normal(t, &p, "a", &[]);

            Ok(())
        });
}

#[test]
fn cjs_002() {
    suite()
        .file(
            "main.js",
            "
                require('./a')
                ",
        )
        .file(
            "a.js",
            "
                require('./b')
                ",
        )
        .file(
            "b.js",
            "
                module.exports = 'b';
                ",
        )
        .run(|t| {
            let module = t
                .bundler
                .load_transformed(&FileName::Real("main.js".into()))?
                .unwrap();
            let mut entries = HashMap::default();
            entries.insert("main.js".to_string(), module);

            let p = t.bundler.calculate_plan(entries)?;

            dbg!(&p);

            assert_eq!(p.circular.len(), 0);
            assert_normal(t, &p, "main", &["a"]);
            assert_normal(t, &p, "a", &["b"]);

            Ok(())
        });
}

#[test]
fn cjs_003() {
    suite()
        .file(
            "main.js",
            "
                import './a';
                import './b';
                ",
        )
        .file(
            "a.js",
            "
                module.exports = require('./common')
                ",
        )
        .file(
            "b.js",
            "
                module.exports = require('./common')
                ",
        )
        .file(
            "common.js",
            "
                module.exports = 'common'
                ",
        )
        .run(|t| {
            let module = t
                .bundler
                .load_transformed(&FileName::Real("main.js".into()))?
                .unwrap();
            let mut entries = HashMap::default();
            entries.insert("main.js".to_string(), module);

            let p = t.bundler.calculate_plan(entries)?;

            dbg!(&p);

            assert_eq!(p.circular.len(), 0);
            // As both of a and b depend on `common`, it should be merged into a parent
            // module.
            assert_normal_transitive(t, &p, "main", &["a", "b"], &["common"]);
            assert_normal(t, &p, "a", &[]);
            assert_normal(t, &p, "b", &[]);

            Ok(())
        });
}

#[test]
fn cjs_004() {
    suite()
        .file(
            "main.js",
            "
            import './entry';
            ",
        )
        .file(
            "entry.js",
            "
            require('./a');
            require('./b');
            ",
        )
        .file(
            "a.js",
            "
                module.exports = require('./common')
                ",
        )
        .file(
            "b.js",
            "
                module.exports = require('./common')
                ",
        )
        .file(
            "common.js",
            "
                module.exports = 'common'
                ",
        )
        .run(|t| {
            let module = t
                .bundler
                .load_transformed(&FileName::Real("main.js".into()))?
                .unwrap();
            let mut entries = HashMap::default();
            entries.insert("main.js".to_string(), module);

            let p = t.bundler.calculate_plan(entries)?;

            dbg!(&p);

            assert_eq!(p.circular.len(), 0);
            // As both of a and b depend on `common`, it should be merged into a parent
            // module.
            assert_normal(t, &p, "main", &["entry"]);
            assert_normal_transitive(t, &p, "entry", &["a", "b"], &["common"]);
            assert_normal(t, &p, "a", &[]);
            assert_normal(t, &p, "b", &[]);

            Ok(())
        });
}

#[test]
fn cjs_005() {
    suite()
        .file(
            "main.js",
            "
            require('./a')
            const b = require('./b');
            require('./c')
            ",
        )
        .file(
            "a.js",
            "
            require('./b');
            ",
        )
        .file(
            "b.js",
            "
            module.exports = 'b'
            ",
        )
        .file(
            "c.js",
            "
            module.exports = 'c'
            ",
        )
        .run(|t| {
            let module = t
                .bundler
                .load_transformed(&FileName::Real("main.js".into()))?
                .unwrap();
            let mut entries = HashMap::default();
            entries.insert("main.js".to_string(), module);

            let p = t.bundler.calculate_plan(entries)?;

            dbg!(&p);

            assert_eq!(p.circular.len(), 0);
            // As both of a and b depend on `common`, it should be merged into a parent
            // module.
            assert_normal(t, &p, "main", &["a", "b", "c"]);
            assert_normal(t, &p, "a", &[]);
            assert_normal(t, &p, "b", &[]);
            assert_normal(t, &p, "c", &[]);

            Ok(())
        });
}

#[test]
fn deno_001() {
    suite()
        .file(
            "main.js",
            r#"
            import { listenAndServe } from "./http-server";
            "#,
        )
        .file(
            "http-server.js",
            r#"
            import { BufReader, BufWriter } from "./io-bufio";
            import { bodyReader } from "./_io";
            "#,
        )
        .file(
            "_io.js",
            r#"
            import { BufReader, BufWriter } from "./io-bufio";
            import { ServerRequest, Response } from "./http-server";
            "#,
        )
        .file(
            "io-bufio.js",
            r#"
            "#,
        )
        .run(|t| {
            let module = t
                .bundler
                .load_transformed(&FileName::Real("main.js".into()))?
                .unwrap();
            let mut entries = HashMap::default();
            entries.insert("main.js".to_string(), module);

            let p = t.bundler.calculate_plan(entries)?;

            dbg!(&p);

            assert_normal(t, &p, "main", &["http-server"]);
            assert_normal(t, &p, "io-bufio", &[]);

            assert_circular(t, &p, "http-server", &["_io"]);
            // assert_circular(t, &p, "_io", &["http-server"]);

            Ok(())
        });
}

#[test]
fn circular_002() {
    suite()
        .file(
            "main.js",
            "
            import './a';
            ",
        )
        .file(
            "a.js",
            "
            import './b';
        ",
        )
        .file(
            "b.js",
            "
            import './c';
            ",
        )
        .file(
            "c.js",
            "
            import './a';
            ",
        )
        .run(|t| {
            let module = t
                .bundler
                .load_transformed(&FileName::Real("main.js".into()))?
                .unwrap();
            let mut entries = HashMap::default();
            entries.insert("main.js".to_string(), module.clone());

            let p = t.bundler.calculate_plan(entries)?;

            dbg!(&p);

            assert_normal(t, &p, "main", &["a"]);
            assert_circular(t, &p, "a", &["b", "c"]);

            Ok(())
        });
}

#[test]
fn deno_002() {
    suite()
        .file(
            "main.js",
            "
            export * from './http-server'
            ",
        )
        .file(
            "http-server.js",
            r#"
            import { encode } from "./encoding-utf8";
            import { BufReader, BufWriter } from "./io-bufio";
            import { assert } from "./_util-assert";
            import { deferred, Deferred, MuxAsyncIterator } from "./async-mod";
            import {
                bodyReader,
                chunkedBodyReader,
                emptyReader,
                writeResponse,
                readRequest,
            } from "./http-_io";
            "#,
        )
        .file(
            "encoding-utf8.js",
            "
            // Skipped
            ",
        )
        .file(
            "io-bufio.js",
            r#"
            import { copyBytes } from "./bytes-mod";
            import { assert } from "./_util-assert";
            "#,
        )
        .file(
            "_util-assert.js",
            r#"
            // Skipped
            "#,
        )
        .file(
            "async-mod.js",
            r#"
            export * from "./async-deferred";
            export * from "./async-mux_async_iterator";
            "#,
        )
        .file(
            "http-_io.js",
            r#"
            import { BufReader, BufWriter } from "./io-bufio";
            import { TextProtoReader } from "./textproto-mod";
            import { assert } from "./_util-assert";
            import { encoder } from "./encoding-utf8";
            import { ServerRequest, Response } from "./http-server";
            import { STATUS_TEXT } from "./http-http_status";
            "#,
        )
        .file(
            "textproto-mod.js",
            r#"
            import { BufReader } from "./io-bufio";
            import { concat } from "./bytes-mod";
            import { decode } from "./encoding-utf8";
            "#,
        )
        .file(
            "_util-assert.js",
            r#"
            // Skipped
            "#,
        )
        .file("bytes-mod.js", "")
        .file(
            "async-mux_async_iterator.js",
            r#"
            import { Deferred, deferred } from "./async-deferred";
            "#,
        )
        .file("async-deferred.js", "")
        .file("http-http_status.js", "")
        .run(|t| {
            let module = t
                .bundler
                .load_transformed(&FileName::Real("main.js".into()))?
                .unwrap();
            let mut entries = HashMap::default();
            entries.insert("main.js".to_string(), module.clone());

            let p = t.bundler.calculate_plan(entries)?;

            dbg!(&p);

            assert_normal(t, &p, "main", &["http-server"]);

            assert_normal_transitive(t, &p, "http-server", &["async-mod"], &[]);
            assert_circular(t, &p, "http-server", &["http-_io"]);

            assert_normal(t, &p, "encoding-utf8", &[]);

            assert_normal(t, &p, "io-bufio", &["bytes-mod"]);

            assert_normal(t, &p, "_util-assert", &[]);

            assert_normal_transitive(
                t,
                &p,
                "http-_io",
                &["textproto-mod", "http-http_status"],
                &["encoding-utf8", "io-bufio", "_util-assert"],
            );
            assert_circular(t, &p, "http-_io", &["http-server"]);

            assert_normal(t, &p, "textproto-mod", &[]);

            assert_normal(t, &p, "_util-assert", &[]);

            assert_normal_transitive(
                t,
                &p,
                "async-mod",
                &["async-mux_async_iterator"],
                &["async-deferred"],
            );

            assert_normal(t, &p, "bytes-mod", &[]);

            assert_normal(t, &p, "async-mux_async_iterator", &[]);

            Ok(())
        });
}

#[test]
fn circular_root_entry_1() {
    suite()
        .file(
            "main.js",
            "
            import './a';
            ",
        )
        .file(
            "a.js",
            "
            import './main';
            import './b';
        ",
        )
        .file("b.js", "")
        .run(|t| {
            let module = t
                .bundler
                .load_transformed(&FileName::Real("main.js".into()))?
                .unwrap();
            let mut entries = HashMap::default();
            entries.insert("main.js".to_string(), module.clone());

            let p = t.bundler.calculate_plan(entries)?;

            dbg!(&p);

            assert_circular(t, &p, "main", &["a"]);
            assert_normal(t, &p, "a", &["b"]);

            Ok(())
        });
}

#[test]
fn circular_root_entry_2() {
    suite()
        .file(
            "main.js",
            "
            import './a';
            import './b';
            ",
        )
        .file(
            "a.js",
            "
            import './main';
            import './b';
        ",
        )
        .file("b.js", "")
        .run(|t| {
            let module = t
                .bundler
                .load_transformed(&FileName::Real("main.js".into()))?
                .unwrap();
            let mut entries = HashMap::default();
            entries.insert("main.js".to_string(), module.clone());

            let p = t.bundler.calculate_plan(entries)?;

            dbg!(&p);

            assert_normal(t, &p, "main", &["b"]);
            assert_circular(t, &p, "main", &["a"]);
            assert_normal(t, &p, "a", &[]);

            Ok(())
        });
}
