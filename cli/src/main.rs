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
    let fmt_subscriber = tracing_subscriber::fmt::Subscriber::new();
    tracing::subscriber::set_global_default(fmt_subscriber)
        .expect("setting tracing default failed");

    let cmd = Cmd::from_args();

    match cmd {
        Cmd::Plugin(cmd) => {
            cmd.run().await?;
        }
    }

    Ok(())
}
