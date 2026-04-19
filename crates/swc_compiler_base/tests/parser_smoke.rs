use std::io::sink;

use swc_common::{
    comments::SingleThreadedComments, errors::Handler, sync::Lrc, FileName, SourceMap,
};
use swc_compiler_base::parse_js;
use swc_config::is_module::IsModule;
use swc_ecma_ast::{EsVersion, Program};
use swc_ecma_parser::{EsSyntax, Syntax};

#[test]
fn parse_js_preserves_fast_parser_contract() {
    let cm: Lrc<SourceMap> = Default::default();
    let fm = cm.new_source_file(
        FileName::Real("input.js".into()).into(),
        "// leading\nexport const answer = 42;\n",
    );
    let handler = Handler::with_emitter_writer(Box::new(sink()), Some(cm.clone()));
    let comments = SingleThreadedComments::default();

    let program = parse_js(
        cm,
        fm,
        &handler,
        EsVersion::Es2022,
        Syntax::Es(EsSyntax::default()),
        IsModule::Bool(true),
        Some(&comments),
    )
    .expect("module should parse");

    assert!(matches!(program, Program::Module(_)));

    let (leading, trailing) = comments.take_all();
    let leading = leading.borrow();
    assert!(leading
        .values()
        .flatten()
        .any(|comment| comment.text.trim() == "leading"));
    assert!(trailing.borrow().is_empty());
}
