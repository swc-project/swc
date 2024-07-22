use std::{
    cmp::Reverse,
    env::current_dir,
    fs::{self, create_dir_all, read_dir, remove_dir_all},
    path::{Path, PathBuf},
    process::{Command, Stdio},
    sync::Arc,
};

use anyhow::{bail, Context, Result};
use clap::Args;
use dialoguer::{console::Term, theme::ColorfulTheme, Select};
use rayon::{
    prelude::{IntoParallelIterator, ParallelBridge, ParallelIterator},
    str::ParallelString,
};
use serde::{de::DeserializeOwned, Deserialize};
use swc_common::{errors::HANDLER, SourceMap, GLOBALS};
use tracing::info;

use crate::util::{
    gzipped_size, make_pretty,
    minifier::{get_minified, get_terser_output},
    print_js, wrap_task,
};

#[derive(Debug, Args)]
pub struct CheckSizeCommand {
    /// The directory store inputs to the swc minifier.
    #[clap(long, short = 'w', default_value = ".next/dbg-swc/minifier-check-size")]
    workspace: PathBuf,

    /// Rerun `npm run build` even if `workspace` is not empty.
    #[clap(long)]
    ensure_fresh: bool,

    /// Show every file, even if the output of swc minifier was smaller.
    #[clap(long)]
    show_all: bool,
}

impl CheckSizeCommand {
    pub fn run(self, cm: Arc<SourceMap>) -> Result<()> {
        let app_dir = current_dir().context("failed to get current directory")?;

        let files = self.store_minifier_inputs(&app_dir)?;

        info!("Running minifier");

        let mut files = GLOBALS.with(|globals| {
            HANDLER.with(|handler| {
                files
                    .into_par_iter()
                    .map(|file| {
                        GLOBALS.set(globals, || {
                            HANDLER.set(handler, || self.minify_file(cm.clone(), &file))
                        })
                    })
                    .collect::<Result<Vec<_>>>()
            })
        })?;

        if !self.show_all {
            info!(
                "Skiping files which are smaller than terser output, as `--show-all` is not \
                 specified"
            );

            files.retain(|f| f.swc > f.terser);
        }
        files.sort_by_key(|f| Reverse(f.swc as i32 - f.terser as i32));

        for file in &files {
            println!(
                "{}: {} bytes (swc) vs {} bytes (terser)",
                file.path
                    .strip_prefix(self.workspace.join("inputs"))
                    .unwrap()
                    .display(),
                file.swc,
                file.terser
            );
        }

        if !files.is_empty() {
            println!("Select a file to open diff");
        }

        let items = files
            .iter()
            .map(|f| {
                format!(
                    "{}: Diff: {} bytes; {} bytes (swc) vs {} bytes (terser)",
                    f.path
                        .strip_prefix(self.workspace.join("inputs"))
                        .unwrap()
                        .display(),
                    f.swc as i32 - f.terser as i32,
                    f.swc,
                    f.terser,
                )
            })
            .collect::<Vec<_>>();

        let selection = Select::with_theme(&ColorfulTheme::default())
            .items(&items)
            .default(0)
            .interact_on_opt(&Term::stderr())?;

        if let Some(selection) = selection {
            let swc_path = self.workspace.join("swc.output.js");
            let terser_path = self.workspace.join("terser.output.js");

            let swc = get_minified(cm.clone(), &files[selection].path, true, false)?;

            std::fs::write(&swc_path, print_js(cm, &swc.module, true)?.as_bytes())
                .context("failed to write swc.output.js")?;

            make_pretty(&swc_path)?;

            let terser = get_terser_output(&files[selection].path, true, false)?;

            std::fs::write(&terser_path, terser.as_bytes())
                .context("failed to write terser.output.js")?;

            make_pretty(&terser_path)?;

            {
                let mut c = Command::new("code");
                c.arg("--diff");
                c.arg(swc_path);
                c.arg(terser_path);
                c.output().context("failed to run vscode")?;
            }
        }

        Ok(())
    }

    /// Invokes `npm run build` with appropriate environment variables, and
    /// store the result in `self.workspace`.
    fn store_minifier_inputs(&self, app_dir: &Path) -> Result<Vec<PathBuf>> {
        wrap_task(|| {
            if !self.ensure_fresh
                && self.workspace.is_dir()
                && read_dir(self.workspace.join("inputs"))
                    .context("failed to read workspace directory")?
                    .count()
                    != 0
            {
                info!(
                    "Skipping `npm run build` because the cache exists and `--ensure-fresh` is \
                     not set"
                );

                return get_all_files(&self.workspace.join("inputs"))
                    .context("failed to get files from cache");
            }

            let files = self.build_app(app_dir)?;

            files
                .into_par_iter()
                .map(|file| {
                    let file_path = self.workspace.join("inputs").join(file.name);
                    create_dir_all(file_path.parent().unwrap())
                        .context("failed to create a directory")?;
                    fs::write(&file_path, file.source).context("failed to write file")?;

                    Ok(file_path)
                })
                .collect::<Result<_>>()
        })
        .context("failed to extract inputs for the swc minifier")
    }

    /// Invokes `npm run build` and extacts the inputs for the swc minifier.
    fn build_app(&self, app_dir: &Path) -> Result<Vec<InputFile>> {
        wrap_task(|| {
            info!("Running `npm run build`");

            // Remove cache
            let _ = remove_dir_all(app_dir.join(".next"));

            let mut c = Command::new("npm");
            c.current_dir(app_dir);
            c.env("FORCE_COLOR", "3");
            c.env("NEXT_DEBUG_MINIFY", "1");
            c.arg("run").arg("build");

            c.stderr(Stdio::inherit());

            let output = c
                .output()
                .context("failed to get output of `npm run build`")?;

            if !output.status.success() {
                bail!("`npm run build` failed");
            }

            let output = String::from_utf8_lossy(&output.stdout);

            output
                .par_lines()
                .filter(|line| line.contains("{ name:"))
                .map(|line| {
                    parse_loose_json::<InputFile>(line).context("failed to parse input file")
                })
                .collect::<Result<_>>()
        })
        .with_context(|| format!("failed to build app in `{}`", app_dir.display()))
    }

    fn minify_file(&self, cm: Arc<SourceMap>, js_file: &Path) -> Result<CompareResult> {
        wrap_task(|| {
            let terser_full =
                get_terser_output(js_file, true, true).context("failed to get terser output")?;

            let swc_full = get_minified(cm.clone(), js_file, true, true)?;
            let swc_full = print_js(cm.clone(), &swc_full.module, true)?;

            Ok(CompareResult {
                terser: gzipped_size(&terser_full),
                swc: gzipped_size(&swc_full),
                path: js_file.to_owned(),
            })
        })
        .with_context(|| format!("failed to minify `{}`", js_file.display()))
    }
}

struct CompareResult {
    path: PathBuf,
    swc: usize,
    terser: usize,
}

#[derive(Deserialize)]
struct InputFile {
    name: String,
    source: String,
}

fn parse_loose_json<T>(s: &str) -> Result<T>
where
    T: DeserializeOwned,
{
    wrap_task(|| {
        let mut c = Command::new("node");

        c.arg("-e");
        c.arg(
            r#"
            function looseJsonParse(obj) {
                return Function('"use strict";return (' + obj + ")")();
            }
            console.log(JSON.stringify(looseJsonParse(process.argv[1])));
            "#,
        );

        c.arg(s);

        c.stderr(Stdio::inherit());

        let json_str = c
            .output()
            .context("failed to parse json loosely using node")?
            .stdout;

        serde_json::from_slice(&json_str).context("failed to parse json")
    })
    .with_context(|| format!("failed to parse loose json: {}", s))
}

fn get_all_files(path: &Path) -> Result<Vec<PathBuf>> {
    if path.is_dir() {
        let v = read_dir(path)
            .with_context(|| format!("failed to read directory at `{}`", path.display()))?
            .par_bridge()
            .map(|entry| get_all_files(&entry?.path()).context("failed get recurse"))
            .collect::<Result<Vec<_>>>()?;

        Ok(v.into_iter().flatten().collect())
    } else {
        Ok(vec![path.to_path_buf()])
    }
}
