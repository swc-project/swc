#![no_main]

use libfuzzer_sys::fuzz_target;
use swc_ecma_parser::next::{ModuleKind, ParseOptions, Parser, SourceType};

fuzz_target!(|data: &[u8]| {
    let Some((&selector, source_bytes)) = data.split_first() else {
        return;
    };
    let Ok(source) = std::str::from_utf8(source_bytes) else {
        return;
    };

    let (source_type, options) = match selector % 8 {
        0 => (SourceType::script(), ParseOptions::default()),
        1 => (SourceType::module(), ParseOptions::default()),
        2 => (SourceType::unambiguous(), ParseOptions::default()),
        3 => (SourceType::common_js(), ParseOptions::default()),
        4 => (SourceType::jsx(), ParseOptions::default()),
        5 => (SourceType::typescript(), ParseOptions::default()),
        6 => (SourceType::tsx(), ParseOptions::default()),
        _ => (
            SourceType::flow()
                .with_jsx(true)
                .with_module_kind(ModuleKind::Unambiguous),
            ParseOptions::default(),
        ),
    };

    // Token collection exercises comment ordering and parser-directed lexer
    // reinterpretation in addition to the default no-capture path.
    let parser = Parser::new(source, source_type).with_options(options);
    if selector & 0x80 != 0 {
        let _ = parser.with_tokens().parse();
    } else {
        let _ = parser.parse();
    }
});
