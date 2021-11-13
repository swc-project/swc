//! Tests ported from https://github.com/mdx-js/mdx/blob/2393084548f856fa07920cb07668db66d952a560/packages/mdx/test/compile.js

use std::collections::HashMap;
use swc_common::{sync::Lrc, SourceMap};
use swc_ecma_ast::{FnExpr, ObjectLit};

#[derive(Debug, Default)]
struct TestOpts {
    pub jsx_runtime: String,
    pub jsx_import_source: String,

    pub pragma: String,
    pub pragma_frag: String,
    pub pragma_import_source: String,

    pub components: HashMap<String, FnExpr>,

    pub render: Option<fn(String) -> String>,
}

fn test_render(input: &str, output: &str, opts: impl FnOnce(Lrc<SourceMap>) -> TestOpts) {}

fn test_error(input: &str, expected_msg: &str, opts: impl FnOnce(Lrc<SourceMap>) -> TestOpts) {}

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
            obj(&cm, m)
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
            obj(&cm, m)
        },
        ..Default::default()
    });
}

#[test]
fn components_member_complex() {
    test_render(
        "<X /> and <X.Y />",
        "<p><span>!</span> and <span>?</span></p>",
        |cm| TestOpts {
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
                m.insert(
                    "X.Y".into(),
                    "
                    function () {
                        return React.createElement('span', props, '?')
                    }
                    "
                    .into(),
                );
                obj(&cm, m)
            },
            ..Default::default()
        },
    );
}

#[test]
fn components_overwrite() {
    test_render("*a*", "<p><i>a</i></p>", |cm| TestOpts {
        components: {
            let mut m = HashMap::new();
            m.insert(
                "em".into(),
                "
                    function (props) {
                        return React.createElement('i', props)
                    }
                    "
                .into(),
            );

            obj(&cm, m)
        },
        ..Default::default()
    });
}

#[test]
fn components_no_overwrite_in_exports() {
    test_render(
        "export var X = () => <em>a</em>\n\n*a*, <X>b</X>",
        "<p><i>a</i>, <em>a</em></p>",
        |cm| TestOpts {
            components: {
                let mut m = HashMap::new();
                m.insert(
                    "em".into(),
                    "
                    function (props) {
                        return React.createElement('i', props)
                    }
                    "
                    .into(),
                );

                obj(&cm, m)
            },
            ..Default::default()
        },
    );
}

#[test]
fn components_error_for_missing_in_export() {
    test_error(
        "export var X = () => <Y />\n\n<X />",
        "Y is not defined",
        |_cm| TestOpts {
            ..Default::default()
        },
    );
}

#[test]
fn custom_components_in_expored_components() {
    test_render(
        "export function Foo({Box = 'div'}) { return <Box>a</Box>; }\n\n<Foo />",
        "<div>a</div>",
        |_cm| TestOpts {
            ..Default::default()
        },
    );
}

#[test]
fn demy_multiple_layout_1() {
    test_error(
        "export default function a() {}\n\nexport default function b() {}\n\n.",
        "Cannot specify multiple layouts",
        |_cm| TestOpts {
            ..Default::default()
        },
    );
}

#[test]
fn demy_multiple_layout_2() {
    test_error(
        "export default function a() {}\n\nexport {Layout as default} from './components.js'\n\n.",
        "Cannot specify multiple layouts",
        |_cm| TestOpts {
            ..Default::default()
        },
    );
}

fn obj(cm: &Lrc<SourceMap>, m: HashMap<String, String>) -> HashMap<String, FnExpr> {
    todo!()
}
