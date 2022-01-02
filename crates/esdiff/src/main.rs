use crate::minified::DiffMinifiedCommand;
use structopt::StructOpt;

mod minified;

#[derive(Debug, StructOpt)]
enum Cmd {
    Minified(DiffMinifiedCommand),
}

fn main() {
    println!("Hello, world!");
}
