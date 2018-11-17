#![feature(box_syntax)]

#[macro_use]
extern crate clap;
extern crate rayon;
#[macro_use]
extern crate slog;
pub extern crate libswc as swc;
extern crate slog_envlogger;
extern crate slog_term;
use clap::{AppSettings, Arg, ArgMatches, SubCommand};
use slog::{Drain, Logger};
use std::{
    error::Error,
    io::{self, Write},
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

    let comp = Compiler::new(logger(), cm.clone(), handler);

    if let Some(ref matches) = matches.subcommand_matches("jsc") {
        let input = matches.value_of("input file").unwrap();
        let res = comp.parse_js(Path::new(input));
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
    use swc::ecmascript::transforms::{compat, simplifier};
    let helpers = Arc::new(compat::helpers::Helpers::default());

    let pass: Box<Fold<Module>> = box compat::es2016()
        .then(compat::es2015(helpers.clone()))
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

    pass
}

fn logger() -> Logger {
    fn no_timestamp(_: &mut Write) -> io::Result<()> {
        Ok(())
    }
    fn root() -> Logger {
        let dec = slog_term::TermDecorator::new()
            .force_color()
            .stderr()
            .build();
        let drain = slog_term::FullFormat::new(dec)
            .use_custom_timestamp(no_timestamp)
            .build();
        let drain = slog_envlogger::new(drain);
        let drain = std::sync::Mutex::new(drain).fuse();
        let logger = Logger::root(drain, o!());

        logger
    }

    root()
}
