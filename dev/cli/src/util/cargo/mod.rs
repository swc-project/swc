use anyhow::{Context, Error};
use cargo_metadata::MetadataCommand;
use std::path::{Path, PathBuf};
use tokio::task::spawn_blocking;

pub mod add;
pub mod upgrade;

pub async fn cargo_metadata(
    mut cmd: MetadataCommand,
    from: &Path,
) -> Result<cargo_metadata::Metadata, Error> {
    let from = from.to_path_buf();
    spawn_blocking(move || {
        let result = cmd
            .current_dir(&from)
            .exec()
            .context("failed to execute `cargo metadata`")?;

        Ok(result)
    })
    .await
    .context("failed to join the task for `cargo metadata`")?
}

pub async fn cargo_target_dir(from: &Path) -> Result<PathBuf, Error> {
    let mut cmd = MetadataCommand::new();
    cmd.no_deps();
    let md = cargo_metadata(cmd, from).await?;

    Ok(md.target_directory.as_std_path().to_path_buf())
}
