use std::path::{Component, PathBuf};

use anyhow::{bail, Context, Error};
use swc_common::FileName;
use tracing::{debug, info, trace, Level};

use crate::resolve::Resolve;

#[derive(Debug)]
enum Pattern {
    Wildcard {
        prefix: String,
    },
    /// No wildcard.
    Exact(String),
}

/// Support for `paths` of `tsconfig.json`.
///
/// See https://www.typescriptlang.org/docs/handbook/module-resolution.html#path-mapping
#[derive(Debug)]
pub struct TsConfigResolver<R>
where
    R: Resolve,
{
    inner: R,
    base_url: PathBuf,
    paths: Vec<(Pattern, Vec<String>)>,
}

impl<R> TsConfigResolver<R>
where
    R: Resolve,
{
    ///
    /// # Parameters
    ///
    /// ## base_url
    ///
    /// See https://www.typescriptlang.org/tsconfig#baseUrl
    ///
    /// The typescript documentation says `This must be specified if "paths"
    /// is.`.
    ///
    /// ## `paths`
    ///
    /// Pass `paths` map from `tsconfig.json`.
    ///
    /// See https://www.typescriptlang.org/tsconfig#paths
    ///
    /// Note that this is not a hashmap because value is not used as a hash map.
    pub fn new(inner: R, base_url: PathBuf, paths: Vec<(String, Vec<String>)>) -> Self {
        if cfg!(debug_assertions) {
            info!(
                base_url = tracing::field::display(base_url.display()),
                "jsc.paths"
            );
        }

        let paths = paths
            .into_iter()
            .map(|(from, to)| {
                assert!(
                    !to.is_empty(),
                    "value of `paths.{}` should not be an empty array",
                    from,
                );

                let pos = from.as_bytes().iter().position(|&c| c == b'*');
                let pat = if from.contains('*') {
                    if from.as_bytes().iter().rposition(|&c| c == b'*') != pos {
                        panic!("`paths.{}` should have only one wildcard", from)
                    }

                    Pattern::Wildcard {
                        prefix: from[..pos.unwrap()].to_string(),
                    }
                } else {
                    assert_eq!(
                        to.len(),
                        1,
                        "value of `paths.{}` should be an array with one element because the src \
                         path does not contains * (wildcard)",
                        from,
                    );

                    Pattern::Exact(from)
                };

                (pat, to)
            })
            .collect();

        Self {
            inner,
            base_url,
            paths,
        }
    }
}

impl<R> Resolve for TsConfigResolver<R>
where
    R: Resolve,
{
    fn resolve(&self, base: &FileName, src: &str) -> Result<FileName, Error> {
        let _tracing = if cfg!(debug_assertions) {
            Some(
                tracing::span!(
                    Level::ERROR,
                    "tsc.resolve",
                    base_url = tracing::field::display(self.base_url.display()),
                    base = tracing::field::display(base),
                    src = tracing::field::display(src),
                )
                .entered(),
            )
        } else {
            None
        };

        if src.starts_with('.') && (src == ".." || src.starts_with("./") || src.starts_with("../"))
        {
            return self
                .inner
                .resolve(base, src)
                .context("not processed by tsc resolver because it's relative import");
        }

        if cfg!(debug_assertions) {
            debug!("non-relative import");
        }

        if let FileName::Real(v) = base {
            if v.components().any(|c| match c {
                Component::Normal(v) => v == "node_modules",
                _ => false,
            }) {
                return self.inner.resolve(base, src).context(
                    "not processed by tsc resolver because base module is in node_modules",
                );
            }
        }

        // https://www.typescriptlang.org/docs/handbook/module-resolution.html#path-mapping
        for (from, to) in &self.paths {
            match from {
                Pattern::Wildcard { prefix } => {
                    let extra = src.strip_prefix(prefix);
                    let extra = match extra {
                        Some(v) => v,
                        None => {
                            if cfg!(debug_assertions) {
                                trace!("skip because src doesn't start with prefix");
                            }
                            continue;
                        }
                    };

                    if cfg!(debug_assertions) {
                        trace!("extra = {}", extra);
                    }

                    let mut errors = vec![];
                    for target in to {
                        let mut replaced = target.replace('*', extra);
                        let rel = format!("./{}", replaced);

                        let res = self.inner.resolve(base, &rel).with_context(|| {
                            format!(
                                "failed to resolve `{}`, which is expanded from `{}`",
                                replaced, src
                            )
                        });

                        errors.push(match res {
                            Ok(v) => return Ok(v),
                            Err(err) => err,
                        });

                        if cfg!(target_os = "windows") {
                            if replaced.starts_with("./") {
                                replaced = replaced[2..].to_string();
                            }
                            replaced = replaced.replace('/', "\\");
                        }

                        if to.len() == 1 {
                            return Ok(FileName::Real(self.base_url.join(replaced)));
                        }
                    }

                    bail!(
                        "`{}` matched `{}` (from tsconfig.paths) but failed to resolve:\n{:?}",
                        src,
                        prefix,
                        errors
                    )
                }
                Pattern::Exact(from) => {
                    // Should be exactly matched
                    if src == from {
                        let replaced = self.base_url.join(&to[0]);
                        if replaced.exists() {
                            return Ok(FileName::Real(replaced));
                        }

                        return self
                            .inner
                            .resolve(base, &format!("./{}", &to[0]))
                            .with_context(|| {
                                format!(
                                    "tried to resolve `{}` because `{}` was exactly matched",
                                    to[0], from
                                )
                            });
                    }
                }
            }
        }

        self.inner.resolve(base, src)
    }
}
