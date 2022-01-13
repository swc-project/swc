use std::path::{Path, PathBuf};
use swc_common::{input::SourceFileInput, sync::Lrc, SourceMap};
use swc_ecma_ast::Module;
use swc_ecma_codegen::{
    text_writer::{JsWriter, WriteJs},
    Emitter,
};
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

    parser.parse_module().unwrap()
}

#[testing::fixture("tests/diff/**/l.js")]
fn diff(l: PathBuf) {
    let r = l.with_file_name("r.js");
    let spec = l.with_file_name("output.swc-diff");

    let (diff_str, l_str, r_str) = testing::run_test(false, |cm, _handler| {
        let mut l = parse(cm.clone(), &l);
        let mut r = parse(cm.clone(), &r);

        let mut ctx = Ctx::new(Config { ignore_span: true });
        let res = l.diff(&mut r, &mut ctx);

        let l = print(cm.clone(), &[l]);
        let r = print(cm, &[r]);

        Ok((format!("{}", res), l, r))
    })
    .unwrap();

    NormalizedOutput::from(l_str)
        .compare_to_file(&l.with_file_name("l.output.js"))
        .unwrap();

    NormalizedOutput::from(r_str)
        .compare_to_file(&r.with_file_name("r.output.js"))
        .unwrap();

    NormalizedOutput::from(diff_str)
        .compare_to_file(&spec)
        .unwrap();
}

fn print<N: swc_ecma_codegen::Node>(cm: Lrc<SourceMap>, nodes: &[N]) -> String {
    let mut buf = vec![];

    {
        let wr: Box<dyn WriteJs> = Box::new(JsWriter::new(cm.clone(), "\n", &mut buf, None));

        let mut emitter = Emitter {
            cfg: swc_ecma_codegen::Config { minify: false },
            cm,
            comments: None,
            wr,
        };

        for n in nodes {
            n.emit_with(&mut emitter).unwrap();
        }
    }

    String::from_utf8(buf).unwrap()
}
