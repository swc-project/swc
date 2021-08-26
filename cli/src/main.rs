use anyhow::Error;
use plugin::PluginCommand;
use structopt::StructOpt;

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
