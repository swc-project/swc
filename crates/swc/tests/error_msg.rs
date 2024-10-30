use std::path::{Path, PathBuf};

use swc::{
    config::{Config, IsModule, JscConfig, JscExperimental, Options},
    try_with_handler, Compiler, HandlerOpts,
};
use swc_common::{errors::ColorConfig, sync::Lrc, FilePathMapping, SourceMap, GLOBALS};
use testing::{NormalizedOutput, Tester};

fn file(f: impl AsRef<Path>) -> NormalizedOutput {
    Tester::new()
        .print_errors(|cm, handler| -> Result<NormalizedOutput, _> {
            let c = Compiler::new(cm.clone());

            let fm = cm.load_file(f.as_ref()).expect("failed to load file");
            let s = c.process_js_file(
                fm,
                &handler,
                &Options {
                    swcrc: true,
                    ..Default::default()
                },
            );
            if let Err(e) = s {
                return Ok(format!("{:?}", e).into());
            }

            panic!("invalid swcrc should abort build, but got {:?}", s);
        })
        .unwrap()
}

#[test]
fn swcrc_simple() {
    let f = file("tests/swcrc_errors/simple/foo.js");
    println!("{}", f);
}

#[testing::fixture("tests/errors/**/input.js")]
#[testing::fixture("tests/errors/**/input.ts")]
fn fixture(input: PathBuf) {
    let _log = testing::init();
    let output_path = input.parent().unwrap().join("output.swc-stderr");

    let cm = Lrc::new(SourceMap::new(FilePathMapping::empty()));
    let err = GLOBALS.set(&Default::default(), || {
        try_with_handler(
            cm.clone(),
            HandlerOpts {
                skip_filename: true,
                color: ColorConfig::Never,
            },
            |handler| {
                let c = Compiler::new(cm.clone());

                let fm = cm.load_file(&input).expect("failed to load file");

                match c.process_js_file(
                    fm,
                    handler,
                    &Options {
                        config: Config {
                            is_module: Some(IsModule::Unknown),
                            jsc: JscConfig {
                                experimental: JscExperimental {
                                    disable_all_lints: false.into(),
                                    ..Default::default()
                                },
                                ..Default::default()
                            },
                            ..Default::default()
                        },
                        swcrc: true,

                        ..Default::default()
                    },
                ) {
                    Ok(..) => {}
                    Err(err) => return Err(err),
                }

                Ok(())
            },
        )
        .expect_err("should fail")
    });

    let output = NormalizedOutput::from(format!("{}", err));

    output.compare_to_file(output_path).unwrap();
}
