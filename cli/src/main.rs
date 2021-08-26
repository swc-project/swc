use anyhow::Error;
use plugin::PluginCommand;
use structopt::StructOpt;
use tracing::Level;

mod plugin;
mod util;

#[derive(Debug, StructOpt)]

pub enum Cmd {
    Plugin(PluginCommand),
}

#[tokio::main]
async fn main() -> Result<(), Error> {
    tracing_subscriber::fmt::Subscriber::builder()
        .with_target(false)
        .with_max_level(Level::DEBUG)
        .pretty()
        .init();

    let cmd = Cmd::from_args();

    match cmd {
        Cmd::Plugin(cmd) => {
            cmd.run().await?;
        }
    }

    Ok(())
}
