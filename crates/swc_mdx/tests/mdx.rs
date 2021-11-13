//! Tests ported from https://github.com/mdx-js/mdx/blob/2393084548f856fa07920cb07668db66d952a560/packages/mdx/test/compile.js

#[derive(Debug, Default)]
struct TestOpts {
    pub jsx_runtime: String,
    pub pragma: String,
    pub pragma_frag: String,
    pub pragma_import_source: String,
    pub render: Option<fn(String) -> String>,
}

fn test_render(input: &str, output: &str, opts: TestOpts) {}

fn render_automatic(s: String) -> String {
    todo!()
}

fn render_preact(s: String) -> String {
    todo!()
}

#[test]
fn empty() {
    test_render("", "", Default::default());
}

#[test]
fn jsx_runtime_automatic() {
    test_render(
        "!",
        "<p>!</p>",
        TestOpts {
            jsx_runtime: "automatic".into(),
            render: Some(render_automatic),
            ..Default::default()
        },
    );
}

#[test]
fn jsx_pragma() {
    test_render(
        "!",
        "<p>!</p>",
        TestOpts {
            jsx_runtime: "classic".into(),
            pragma: "preact.createElement".into(),
            pragma_frag: "preact.Fragment".into(),
            pragma_import_source: "preact/compat".into(),
            render: Some(render_preact),
            ..Default::default()
        },
    );
}
