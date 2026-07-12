use swc_common::{
    errors::{ColorConfig, Handler},
    sync::Lrc,
    FileName, SourceMap,
};
use swc_ecma_parser::{ModuleKind, Parser, SourceType, Syntax};

fn main() {
    let cm: Lrc<SourceMap> = Default::default();
    let handler = Handler::with_tty_emitter(ColorConfig::Auto, true, false, Some(cm.clone()));

    // Real usage
    // let fm = cm
    //     .load_file(Path::new("test.ts"))
    //     .expect("failed to load test.ts");

    let fm = cm.new_source_file(
        FileName::Custom("test.ts".into()).into(),
        "interface Foo {}",
    );

    let (source_type, options) = SourceType::from_legacy(
        Syntax::Typescript(Default::default()),
        ModuleKind::Module,
        Default::default(),
    );
    let result = Parser::new(&fm.src, source_type)
        .with_options(options)
        .with_start_pos(fm.start_pos)
        .parse();
    for error in result.diagnostics {
        error.into_diagnostic(&handler).emit();
    }
    assert!(!result.panicked, "Failed to parse module.");
    let _module = result.program;
}
