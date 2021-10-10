use anyhow::{Context, Error};
use cargo::{
    core::{compiler::CompileMode, shell::Verbosity, Workspace},
    ops::{CompileFilter, CompileOptions, Packages},
    util::{important_paths, interning::InternedString},
    Config,
};
use std::path::PathBuf;
use structopt::StructOpt;
use tokio::task::spawn_blocking;
use tracing::{info, subscriber::with_default};

/// Used for commands involving `cargo build`

#[derive(Debug, StructOpt)]
pub struct BaseCargoCommand {
    /// Build for production.
    #[structopt(long)]
    pub release: bool,

    /// Build one crate
    #[structopt(long)]
    pub crate_name: Vec<String>,

    /// Build all crates in a workspace.
    #[structopt(long)]
    pub all: bool,

    /// Target triple.
    #[structopt(long)]
    pub target: Option<String>,

    /// Flags to pass to cargo.
    #[structopt(long)]
    pub cargo_flags: Option<String>,
}

impl BaseCargoCommand {
    fn to_compile_opts(&self, config: &Config) -> Result<CompileOptions, Error> {
        let profile = if self.release { "release" } else { "dev" };

        let mut opts = CompileOptions::new(&config, CompileMode::Build)
            .context("failed to create default compile options")?;
        opts.build_config.requested_profile = InternedString::new(profile);

        opts.spec = Packages::from_flags(self.all, Default::default(), self.crate_name.clone())?;

        opts.filter = CompileFilter::from_raw_arguments(
            true,
            Default::default(),
            false,
            Default::default(),
            false,
            Default::default(),
            false,
            Default::default(),
            false,
            false,
        );

        Ok(opts)
    }

    fn run_sync(&self) -> Result<Vec<PathBuf>, Error> {
        let dylibs = with_default(
            tracing::subscriber::NoSubscriber::default(),
            || -> Result<_, Error> {
                let cargo_config =
                    Config::default().context("failed to create default cargo config")?;
                let manifest_path = important_paths::find_root_manifest_for_wd(cargo_config.cwd())
                    .context("failed to find root manifest for working directory")?;
                let workspace = Workspace::new(&manifest_path, &cargo_config)
                    .context("failed to create cargo workspace")?;

                workspace.config().shell().set_verbosity(Verbosity::Normal);

                let compile_opts = self.to_compile_opts(&cargo_config)?;

                let compilation = cargo::ops::compile(&workspace, &compile_opts)
                    .context("failed to compile using cargo")?;

                let dylibs = compilation
                    .cdylibs
                    .into_iter()
                    .map(|v| v.path)
                    .collect::<Vec<_>>();

                Ok(dylibs)
            },
        )?;

        info!("Built {:?}", dylibs);

        Ok(dylibs)
    }

    pub async fn run(self) -> Result<Vec<PathBuf>, Error> {
        spawn_blocking(move || self.run_sync())
            .await
            .context("failed to await")?
    }
}

/// Build your plugin using `cargo`.
#[derive(Debug, StructOpt)]
pub struct BuildCommand {
    #[structopt(flatten)]
    pub cargo: BaseCargoCommand,
}

impl BuildCommand {
    pub async fn run(self) -> Result<(), Error> {
        let libs = self.cargo.run().await?;

        Ok(())
    }
}
