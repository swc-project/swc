//! Tests ported from https://github.com/mdx-js/mdx/blob/2393084548f856fa07920cb07668db66d952a560/packages/mdx/test/compile.js

use std::collections::HashMap;
use swc_common::{sync::Lrc, SourceMap};
use swc_ecma_ast::ObjectLit;

#[derive(Debug, Default)]
struct TestOpts {
    pub jsx_runtime: String,
    pub jsx_import_source: String,

    pub pragma: String,
    pub pragma_frag: String,
    pub pragma_import_source: String,

    pub components: Option<ObjectLit>,

    pub render: Option<fn(String) -> String>,
}

fn test_render(input: &str, output: &str, opts: impl FnOnce(Lrc<SourceMap>) -> TestOpts) {}

fn render_automatic(s: String) -> String {
    todo!()
}

fn render_preact(s: String) -> String {
    todo!()
}

#[test]
fn empty() {
    test_render("", "", |_| Default::default());
}

#[test]
fn jsx_runtime_automatic() {
    test_render("!", "<p>!</p>", |_| TestOpts {
        jsx_runtime: "automatic".into(),
        render: Some(render_automatic),
        ..Default::default()
    });
}

#[test]
fn jsx_preact_pragma() {
    test_render("<>%</>", "%", |_| TestOpts {
        jsx_runtime: "classic".into(),
        pragma: "preact.createElement".into(),
        pragma_frag: "preact.Fragment".into(),
        pragma_import_source: "preact/compat".into(),
        render: Some(render_preact),
        ..Default::default()
    });
}

#[test]
fn jsx_preact_import_source() {
    test_render("<>1</>", "1", |_| TestOpts {
        jsx_import_source: "preact".into(),
        render: Some(render_preact),
        ..Default::default()
    });
}

#[test]
#[ignore]
fn jsx_emotion_import_source() {
    // assert.equal(
    //     renderToStaticMarkup(
    //         React.createElement(
    //             await run(
    //                 String(
    //                     compileSync('<>+</>', { jsxImportSource:
    // '@emotion/react' })                 ).replace(
    //                     /\/jsx-runtime(?=["'])/g,
    //                     '$&/dist/emotion-react-jsx-runtime.cjs.prod.js'
    //                 )
    //             )
    //         )
    //     ),
    //     '+',
    //     'should support `jsxImportSource` for `emotion`'
    // )
}

#[test]
fn components() {
    test_render("<X />", "<span>!</span>", |cm| TestOpts {
        components: {
            let mut m = HashMap::new();
            m.insert(
                "X".into(),
                "
                    function () {
                        return React.createElement('span', props, '!')
                    }
                    "
                .into(),
            );
            Some(obj(&cm, m))
        },
        ..Default::default()
    });
}

#[test]
fn components_member() {
    test_render("<x.y />", "<span>?</span>", |cm| TestOpts {
        components: {
            let mut m = HashMap::new();
            m.insert(
                "x.y".into(),
                "
                    function () {
                        return React.createElement('span', props, '?')
                    }
                    "
                .into(),
            );
            Some(obj(&cm, m))
        },
        ..Default::default()
    });
}

fn obj(cm: &Lrc<SourceMap>, m: HashMap<String, String>) -> ObjectLit {}
