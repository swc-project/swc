use plugin::PluginCommand;
use structopt::StructOpt;

mod plugin;

#[derive(Debug, StructOpt)]

pub enum Cmd {
    Plugin(PluginCommand),
}

fn main() {
    let cmd = Cmd::from_args();

    match cmd {
        Cmd::Plugin(..) => {
            todo!()
        }
    }
}
