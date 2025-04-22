use swc_common::{
    errors::{ColorConfig, Handler},
    input::StringInput,
    sync::Lrc,
    FileName, SourceMap,
};
use swc_ecma_lexer::{lexer, lexer::Lexer, Syntax};

fn main() {
    let cm: Lrc<SourceMap> = Default::default();
    let handler = Handler::with_tty_emitter(ColorConfig::Auto, true, false, Some(cm.clone()));

    // Real usage
    // let fm = cm
    //     .load_file(Path::new("test.js"))
    //     .expect("failed to load test.js");

    let fm = cm.new_source_file(
        FileName::Custom("test.js".into()).into(),
        "function foo() {}".into(),
    );

    let l = Lexer::new(
        Syntax::Es(Default::default()),
        Default::default(),
        StringInput::from(&*fm),
        None,
    );

    let tokens = lexer(l)
        .map_err(|e| e.into_diagnostic(&handler).emit())
        .expect("Failed to lex.");
    println!("Tokens: {tokens:?}",);
}
