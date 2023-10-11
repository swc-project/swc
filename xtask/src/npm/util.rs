use std::process::Command;

use anyhow::Result;
use cargo_metadata::MetadataCommand;

use crate::util::repository_root;

/// Get the list of swc crates in the main swc repository.
fn get_swc_crates_of_bindings() -> Result<Vec<String>> {
    let md = MetadataCommand::new()
        .current_dir(repository_root()?.join("bindings"))
        .exec()?;

    Ok(md
        .packages
        .iter()
        .filter(|p| p.repository.as_deref() == Some("https://github.com/swc-project/swc.git"))
        .map(|p| p.name.clone())
        .collect::<Vec<_>>())
}

pub fn update_swc_crates() -> Result<()> {
    let mut c = Command::new("cargo");
    c.current_dir(repository_root()?.join("bindings"));
    c.arg("upgrade")
        .arg("--incompatible")
        .arg("--recursive")
        .arg("false");

    for pkg in get_swc_crates_of_bindings()? {
        c.arg("--package").arg(pkg);
    }

    c.status()?;

    Ok(())
}
