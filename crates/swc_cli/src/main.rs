use clap::Parser;
use commands::{Command, CommandRunner, PluginSubcommand, SwcCliOptions};

mod commands;

fn main() -> anyhow::Result<()> {
    let command = SwcCliOptions::parse().command;

    match &command {
        Command::Plugin(PluginSubcommand::New(options)) => options.execute(),
        Command::Compile(options) => options.execute(),
    }
}
