use std::error::Error;

use vergen::{BuildBuilder, CargoBuilder, Emitter};

fn main() -> Result<(), Box<dyn Error>> {
    let build = BuildBuilder::all_build()?;
    let cargo = CargoBuilder::default()
        .dependencies(true)
        .name_filter("*_ast")
        .build()?;

    Emitter::default()
        .add_instructions(&build)?
        .add_instructions(&cargo)?
        .emit()?;

    Ok(())
}
