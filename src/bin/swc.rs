#![feature(box_syntax)]

#[macro_use]
extern crate clap;
extern crate rayon;
pub extern crate libswc as swc;
use clap::{AppSettings, Arg, ArgMatches, SubCommand};
use std::{
    error::Error,
    path::Path,
    sync::Arc,
};
use swc::{
    common::{errors::Handler, sync::Lrc, FilePathMapping, Fold, SourceMap},
    ecmascript::{ast::Module, codegen},
    Compiler,
};

fn main() {
    let res = swc::common::GLOBALS.set(&swc::common::Globals::new(), || run());
    res.expect("failed to process module")
}

fn run() -> Result<(), Box<Error>> {
    let matches = app_from_crate!()
        .global_settings(&[AppSettings::StrictUtf8, AppSettings::GlobalVersion])
        .settings(&[AppSettings::SubcommandRequiredElseHelp])
        .arg(
            Arg::with_name("worker")
                .short("w")
                .long("worker")
                .help("Number of threads to use for cpu-intensive tasks")
                .takes_value(true)
                .value_name("N"),
        )
        .subcommand(
            SubCommand::with_name("jsc")
                .arg(
                    Arg::with_name("passes")
                        .short("p")
                        .long("passes")
                        .takes_value(true)
                        .multiple(true),
                )
                .arg(Arg::with_name("optimize").long("optimize"))
                .arg(Arg::with_name("minify").short("m").long("minify"))
                .arg(
                    Arg::with_name("input file")
                        .required(true)
                        .takes_value(true),
                ),
        )
        .get_matches();

    rayon::ThreadPoolBuilder::new()
        .thread_name(|i| format!("swc-worker-{}", i))
        .num_threads(
            matches
                .value_of("worker")
                .map(|v| v.parse().expect("expected number for --worker"))
                .unwrap_or(0),
        )
        .build_global()
        .expect("failed to configure rayon::ThreadPool");

    let cm = Lrc::new(SourceMap::new(FilePathMapping::empty()));

    let handler = Handler::with_tty_emitter(
        swc::common::errors::ColorConfig::Always,
        true,
        false,
        Some(cm.clone()),
    );

    let comp = Compiler::new( cm.clone(), handler);

    if let Some(ref matches) = matches.subcommand_matches("jsc") {
        let input = matches.value_of("input file").unwrap();
        let res = comp.parse_js_file(Path::new(input));
        let module = match res {
            Ok(module) => module,
            Err(()) => {
                panic!("failed to parse module");
            }
        };

        let mut pass = js_pass(cm, matches);

        let module = pass.fold(module);

        let stdout = std::io::stdout();
        let mut output = stdout.lock();
        comp.emit_module(
            &module,
            codegen::Config {
                ..Default::default()
            },
            &mut output,
        )
        .expect("failed to emit module");
    }

    Ok(())
}

fn js_pass(cm: Lrc<SourceMap>, matches: &ArgMatches) -> Box<Fold<Module>> {
    use swc::ecmascript::transforms::{compat, hygiene, simplifier};
    let helpers = Arc::new(compat::helpers::Helpers::default());

    let pass: Box<Fold<Module>> = box compat::es2016()
        .then(compat::es2015(&helpers))
        .then(compat::es3())
        .then(compat::helpers::InjectHelpers {
            cm,
            helpers: helpers.clone(),
        });

    let pass: Box<Fold<Module>> = if !matches.is_present("optimize") {
        box pass
    } else {
        box pass.then(simplifier())
    };

    box pass.then(hygiene())
}
