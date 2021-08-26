use anyhow::Error;
use plugin::PluginCommand;
use structopt::StructOpt;

mod plugin;

#[derive(Debug, StructOpt)]

pub enum Cmd {
    Plugin(PluginCommand),
}

#[tokio::main]
async fn main() -> Result<(), Error> {
    let cmd = Cmd::from_args();

    match cmd {
        Cmd::Plugin(cmd) => {
            cmd.run().await?;
        }
    }

    Ok(())
}
