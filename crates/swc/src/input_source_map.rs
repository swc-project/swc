//! Input source-map discovery and decoding.

use std::{fs::File, io::ErrorKind, path::PathBuf};

use anyhow::{bail, Context, Error};
use base64::prelude::{Engine, BASE64_STANDARD};
use swc_common::{comments::Comment, FileName, SourceFile};
#[cfg(debug_assertions)]
use tracing::warn;
use url::Url;

use crate::{config::InputSourceMap, sourcemap, Compiler};

impl Compiler {
    pub(crate) fn get_orig_src_map(
        &self,
        fm: &SourceFile,
        input_src_map: &InputSourceMap,
        comments: &[Comment],
        is_default: bool,
    ) -> Result<Option<sourcemap::SourceMap>, Error> {
        self.run(|| -> Result<_, Error> {
            let name = &fm.name;

            let read_inline_sourcemap =
                |data_url: &str| -> Result<Option<sourcemap::SourceMap>, Error> {
                    let url = Url::parse(data_url).with_context(|| {
                        format!("failed to parse inline source map url\n{data_url}")
                    })?;

                    let idx = match url.path().find("base64,") {
                        Some(v) => v,
                        None => {
                            bail!("failed to parse inline source map: not base64: {url:?}")
                        }
                    };

                    let content = url.path()[idx + "base64,".len()..].trim();

                    let res = BASE64_STANDARD
                        .decode(content.as_bytes())
                        .context("failed to decode base64-encoded source map")?;

                    Ok(Some(sourcemap::SourceMap::from_slice(&res).context(
                        "failed to read input source map from inlined base64 encoded string",
                    )?))
                };

            let read_file_sourcemap =
                |data_url: Option<&str>| -> Result<Option<sourcemap::SourceMap>, Error> {
                    match &**name {
                        FileName::Real(filename) => {
                            let dir = match filename.parent() {
                                Some(v) => v,
                                None => {
                                    bail!("unexpected: root directory is given as a input file")
                                }
                            };

                            let map_path = match data_url {
                                Some(data_url) => {
                                    let mut map_path = dir.join(data_url);
                                    if !map_path.exists() {
                                        // Old behavior. This check would prevent regressions.
                                        // Perhaps it shouldn't be supported. Sometimes developers
                                        // don't want to expose their source code. Map files are for
                                        // internal troubleshooting convenience.
                                        let fallback_map_path =
                                            PathBuf::from(format!("{}.map", filename.display()));
                                        if fallback_map_path.exists() {
                                            map_path = fallback_map_path;
                                        } else {
                                            bail!(
                                                "failed to find input source map file {:?} in {:?} \
                                                 file as either {:?} or with appended .map",
                                                data_url,
                                                filename.display(),
                                                map_path.display(),
                                            )
                                        }
                                    }

                                    Some(map_path)
                                }
                                None => {
                                    // Old behavior.
                                    let map_path =
                                        PathBuf::from(format!("{}.map", filename.display()));
                                    if map_path.exists() {
                                        Some(map_path)
                                    } else {
                                        None
                                    }
                                }
                            };

                            match map_path {
                                Some(map_path) => {
                                    let path = map_path.display().to_string();
                                    let file = File::open(&path);

                                    // If file is not found, we should return None. Some libraries
                                    // generate source maps but omit them from the npm package.
                                    //
                                    // See
                                    // https://github.com/swc-project/swc/issues/8789#issuecomment-2105055772
                                    if file
                                        .as_ref()
                                        .is_err_and(|err| err.kind() == ErrorKind::NotFound)
                                    {
                                        #[cfg(debug_assertions)]
                                        warn!(target: "swc",
                                            "source map is specified by sourceMappingURL but \
                                             there's no source map at `{}`",
                                            path
                                        );
                                        return Ok(None);
                                    }

                                    // Old behavior.
                                    let file = if !is_default {
                                        file?
                                    } else {
                                        match file {
                                            Ok(v) => v,
                                            Err(_) => return Ok(None),
                                        }
                                    };

                                    Ok(Some(sourcemap::SourceMap::from_reader(file).with_context(
                                        || {
                                            format!(
                                                "failed to read input source map
                                from file at {path}"
                                            )
                                        },
                                    )?))
                                }
                                None => Ok(None),
                            }
                        }
                        _ => Ok(None),
                    }
                };

            let read_sourcemap = || -> Option<sourcemap::SourceMap> {
                let s = "sourceMappingURL=";

                let text = comments.iter().rev().find_map(|c| {
                    let idx = c.text.rfind(s)?;
                    let (_, url) = c.text.split_at(idx + s.len());

                    Some(url.trim())
                });

                // Load original source map if possible
                let result = match text {
                    Some(text) if text.starts_with("data:") => read_inline_sourcemap(text),
                    _ => read_file_sourcemap(text),
                };
                match result {
                    Ok(r) => r,
                    Err(err) => {
                        #[cfg(debug_assertions)]
                        tracing::error!(target: "swc", "failed to read input source map: {:?}", err);
                        #[cfg(not(debug_assertions))]
                        let _ = err;
                        None
                    }
                }
            };

            // Load original source map
            match input_src_map {
                InputSourceMap::Bool(false) => Ok(None),
                InputSourceMap::Bool(true) => Ok(read_sourcemap()),
                InputSourceMap::Str(ref s) => {
                    if s == "inline" {
                        Ok(read_sourcemap())
                    } else {
                        // Load source map passed by user
                        Ok(Some(
                            swc_sourcemap::SourceMap::from_slice(s.as_bytes()).context(
                                "failed to read input source map from user-provided sourcemap",
                            )?,
                        ))
                    }
                }
            }
        })
    }
}
