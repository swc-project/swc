use std::path::{Path, PathBuf};
use swc_common::{input::SourceFileInput, sync::Lrc, SourceMap};
use swc_ecma_ast::Module;
use swc_ecma_diff::{Config, Ctx, Diff};
use swc_ecma_parser::{lexer::Lexer, EsConfig, Parser, Syntax};
use testing::NormalizedOutput;

fn parse(cm: Lrc<SourceMap>, path: &Path) -> Module {
    let fm = cm.load_file(path).unwrap();

    let lexer = Lexer::new(
        Syntax::Es(EsConfig {
            jsx: true,
            ..Default::default()
        }),
        Default::default(),
        SourceFileInput::from(&*fm),
        None,
    );

    let mut parser = Parser::new_from(lexer);
    let program = parser.parse_module().unwrap();

    program
}

#[testing::fixture("tests/diff/**/l.js")]
fn diff(l: PathBuf) {
    let r = l.with_file_name("r.js");
    let spec = l.with_file_name("output.swc-diff");

    let diff_str = testing::run_test(false, |cm, _handler| {
        let mut l = parse(cm.clone(), &l);
        let mut r = parse(cm.clone(), &r);

        let mut ctx = Ctx::new(Config { ignore_span: true });
        let res = l.diff(&mut r, &mut ctx);

        Ok(format!("{}", res))
    })
    .map(NormalizedOutput::from)
    .unwrap();

    diff_str.compare_to_file(&spec).unwrap();
}
