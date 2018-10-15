#[macro_use]
extern crate clap;
extern crate rayon;
#[macro_use]
extern crate slog;
extern crate slog_envlogger;
extern crate slog_term;
pub extern crate swc;
pub extern crate swc_common;
use clap::{AppSettings, Arg, SubCommand};
use slog::{Drain, Logger};
use std::{
    error::Error,
    io::{self, Write},
    path::Path,
    rc::Rc,
};
use swc::Compiler;
use swc_common::errors::{CodeMap, FilePathMapping, Handler};

fn main() {
    run().unwrap()
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
            SubCommand::with_name("js")
                .arg(
                    Arg::with_name("passes")
                        .short("p")
                        .long("passes")
                        .takes_value(true)
                        .multiple(true),
                )
                .arg(
                    Arg::with_name("input file")
                        .required(true)
                        .takes_value(true),
                ),
        )
        .get_matches();

    let thread_pool = rayon::Configuration::new()
        .thread_name(|i| format!("swc-worker-{}", i))
        .num_threads(
            matches
                .value_of("worker")
                .map(|v| v.parse().expect("expected number for --worker"))
                .unwrap_or(0),
        )
        .build()
        .expect("failed to create rayon::ThreadPool?");

    let cm = Rc::new(CodeMap::new(FilePathMapping::empty()));

    let handler = Handler::with_tty_emitter(
        ::swc_common::errors::ColorConfig::Always,
        true,
        false,
        Some(cm.clone()),
    );

    let comp = Compiler::new(logger(), cm.clone(), handler, thread_pool);

    if let Some(ref matches) = matches.subcommand_matches("js") {
        let input = matches.value_of("input file").unwrap();
        let res = comp.parse_js(Path::new(input));
        match res {
            Ok(module) => println!("Module {:?}", module),
            Err(err) => {
                err.emit();
                panic!("Failed to parse module");
            }
        }
    }

    Ok(())
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
