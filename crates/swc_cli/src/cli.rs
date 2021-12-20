use std::path::PathBuf;

use structopt::StructOpt;

/// Transform, compile files.
#[derive(Debug, StructOpt)]
pub struct CompileCommand {
    ///Filename to use when reading from stdin - this will be used in
    /// source-maps, errors etc
    #[structopt(short = "f", long = "filename")]
    file_name: String,
    /// Path to a .swcrc file to use
    #[structopt(parse(from_os_str), long = "config-file")]
    config_file: PathBuf,
    /// The name of the 'env' to use when loading configs and plugins.
    /// Defaults to the value of SWC_ENV, or else NODE_ENV, or else
    /// 'development'.
    ///
    /// DEPRECATED: use --env flag instead.
    #[structopt(long = "env-name")]
    env_name: String,
}

#[derive(StructOpt, Debug)]
#[structopt(about = "Speedy Web Compiler")]
pub enum SwcCommand {
    Compile(CompileCommand),
}

impl SwcCommand {
    pub fn execute(self) {
        match self {
            SwcCommand::Compile(..) => {}
        };
    }
}
