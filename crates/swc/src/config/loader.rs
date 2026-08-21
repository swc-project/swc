//! `.swcrc` discovery, parsing, and loading.

use std::{
    fs::read_to_string,
    path::{Path, PathBuf},
};

use anyhow::{bail, Context, Error};
use jsonc_parser::{parse_to_serde_value, ParseOptions};
use once_cell::sync::Lazy;
use serde_json::error::Category;
use swc_common::FileName;

use super::{Config, ConfigFile, Options, Rc, RootMode};
use crate::Compiler;

impl Compiler {
    #[cfg_attr(debug_assertions, tracing::instrument(target = "swc", skip_all))]
    pub fn read_config(&self, opts: &Options, name: &FileName) -> Result<Option<Config>, Error> {
        static CUR_DIR: Lazy<PathBuf> = Lazy::new(|| {
            if cfg!(target_arch = "wasm32") {
                PathBuf::new()
            } else {
                ::std::env::current_dir().unwrap()
            }
        });

        self.run(|| -> Result<_, Error> {
            let Options {
                ref root,
                root_mode,
                swcrc,
                config_file,
                ..
            } = opts;

            let root = root.as_ref().unwrap_or(&CUR_DIR);

            let swcrc_path = match config_file {
                Some(ConfigFile::Str(s)) => Some(PathBuf::from(s.clone())),
                _ => {
                    if *swcrc {
                        if let FileName::Real(ref path) = name {
                            // Canonicalize relative paths for proper parent traversal
                            let abs_path = if path.is_relative() {
                                root.join(path).canonicalize().ok()
                            } else {
                                path.canonicalize().ok()
                            };
                            let found = abs_path.and_then(|p| find_swcrc(&p, root, *root_mode));

                            // "upward" mode requires a .swcrc to be found
                            if found.is_none() && *root_mode == RootMode::Upward {
                                bail!(
                                    "Could not find .swcrc file while using rootMode \
                                     \"upward\".\nSearched from: {}",
                                    path.display()
                                );
                            }

                            found
                        } else {
                            None
                        }
                    } else {
                        None
                    }
                }
            };

            let config_file = match swcrc_path.as_deref() {
                Some(s) => Some(load_swcrc(s)?),
                _ => None,
            };
            let filename_path = match name {
                FileName::Real(p) => Some(&**p),
                _ => None,
            };

            if let Some(filename_path) = filename_path {
                if let Some(config) = config_file {
                    let dir = swcrc_path
                        .as_deref()
                        .and_then(|p| p.parent())
                        .expect(".swcrc path should have parent dir");

                    let mut config = config
                        .into_config(Some(filename_path))
                        .context("failed to process config file")?;

                    if let Some(c) = &mut config {
                        if c.jsc.base_url != PathBuf::new() {
                            let joined = dir.join(&c.jsc.base_url);
                            c.jsc.base_url = if cfg!(target_os = "windows")
                                && c.jsc.base_url.as_os_str() == "."
                            {
                                dir.canonicalize().with_context(|| {
                                    format!(
                                        "failed to canonicalize base url using the path of \
                                         .swcrc\nDir: {}\n(Used logic for windows)",
                                        dir.display(),
                                    )
                                })?
                            } else {
                                joined.canonicalize().with_context(|| {
                                    format!(
                                        "failed to canonicalize base url using the path of \
                                         .swcrc\nPath: {}\nDir: {}\nbaseUrl: {}",
                                        joined.display(),
                                        dir.display(),
                                        c.jsc.base_url.display()
                                    )
                                })?
                            };
                        }
                    }

                    return Ok(config);
                }

                let config_file = config_file.unwrap_or_default();
                let config = config_file.into_config(Some(filename_path))?;

                return Ok(config);
            }

            let config = match config_file {
                Some(config_file) => config_file.into_config(None)?,
                None => Rc::default().into_config(None)?,
            };

            match config {
                Some(config) => Ok(Some(config)),
                None => {
                    bail!("no config matched for file ({name})")
                }
            }
        })
        .with_context(|| format!("failed to read .swcrc file for input file at `{name}`"))
    }
}

fn find_swcrc(path: &Path, root: &Path, root_mode: RootMode) -> Option<PathBuf> {
    let mut parent = path.parent();
    while let Some(dir) = parent {
        let swcrc = dir.join(".swcrc");

        if swcrc.exists() {
            return Some(swcrc);
        }

        if dir == root && root_mode == RootMode::Root {
            break;
        }
        parent = dir.parent();
    }

    None
}

#[cfg_attr(debug_assertions, tracing::instrument(target = "swc", skip_all))]
fn load_swcrc(path: &Path) -> Result<Rc, Error> {
    let content = read_to_string(path).context("failed to read config (.swcrc) file")?;

    parse_swcrc(&content)
}

pub(super) fn parse_swcrc(s: &str) -> Result<Rc, Error> {
    fn convert_json_err(e: serde_json::Error) -> Error {
        let line = e.line();
        let column = e.column();

        let msg = match e.classify() {
            Category::Io => "io error",
            Category::Syntax => "syntax error",
            Category::Data => "unmatched data",
            Category::Eof => "unexpected eof",
        };
        Error::new(e).context(format!(
            "failed to deserialize .swcrc (json) file: {msg}: {line}:{column}"
        ))
    }

    let v = parse_to_serde_value(
        s.trim_start_matches('\u{feff}'),
        &ParseOptions {
            allow_comments: true,
            allow_trailing_commas: true,
            allow_loose_object_property_names: false,
        },
    )?
    .ok_or_else(|| Error::msg("failed to deserialize empty .swcrc (json) file"))?;

    if let Ok(rc) = serde_json::from_value(v.clone()) {
        return Ok(rc);
    }

    serde_json::from_value(v)
        .map(Rc::Single)
        .map_err(convert_json_err)
}
