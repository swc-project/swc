extern crate swc_node_base;

use anyhow::Error;
use plugin::PluginCommand;
use structopt::StructOpt;
use tracing_subscriber::EnvFilter;

mod plugin;
mod util;

#[derive(Debug, StructOpt)]

pub enum Cmd {
    Plugin(PluginCommand),
}

#[tokio::main]
async fn main() -> Result<(), Error> {
    let logger = tracing_subscriber::FmtSubscriber::builder()
        .without_time()
        .with_target(false)
        .with_ansi(true)
        .with_env_filter(EnvFilter::from_default_env())
        .pretty()
        .finish();

    let _tracing = tracing::subscriber::set_default(logger);

    let cmd = Cmd::from_args();

    match cmd {
        Cmd::Plugin(cmd) => {
            cmd.run().await?;
        }
    }

    Ok(())
}
