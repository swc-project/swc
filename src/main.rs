#[macro_use]
extern crate clap;
extern crate rayon;
#[macro_use]
extern crate slog;
extern crate slog_envlogger;
extern crate slog_term;
pub extern crate swc;
use clap::{AppSettings, Arg, SubCommand};
use slog::{Drain, Logger};
use std::error::Error;
use std::io::{self, Write};
use swc::Compiler;

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
                .arg(Arg::with_name("input file").takes_value(true)),
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

    let mut comp = Compiler::new(logger(), thread_pool);

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
