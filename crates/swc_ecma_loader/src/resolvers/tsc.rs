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
    base_url_filename: FileName,
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
            base_url_filename: FileName::Real(base_url.clone()),
            base_url,
            paths,
        }
    }
}

impl<R> Resolve for TsConfigResolver<R>
where
    R: Resolve,
{
    fn resolve(&self, base: &FileName, module_specifier: &str) -> Result<FileName, Error> {
        let _tracing = if cfg!(debug_assertions) {
            Some(
                tracing::span!(
                    Level::ERROR,
                    "tsc.resolve",
                    base_url = tracing::field::display(self.base_url.display()),
                    base = tracing::field::display(base),
                    src = tracing::field::display(module_specifier),
                )
                .entered(),
            )
        } else {
            None
        };

        if module_specifier.starts_with('.')
            && (module_specifier == ".."
                || module_specifier.starts_with("./")
                || module_specifier.starts_with("../"))
        {
            return self
                .inner
                .resolve(base, module_specifier)
                .context("not processed by tsc resolver because it's relative import");
        }

        if let FileName::Real(v) = base {
            if v.components().any(|c| match c {
                Component::Normal(v) => v == "node_modules",
                _ => false,
            }) {
                return self.inner.resolve(base, module_specifier).context(
                    "not processed by tsc resolver because base module is in node_modules",
                );
            }
        }

        info!("Checking `jsc.paths`");

        // https://www.typescriptlang.org/docs/handbook/module-resolution.html#path-mapping
        for (from, to) in &self.paths {
            match from {
                Pattern::Wildcard { prefix } => {
                    debug!("Checking `{}` in `jsc.paths`", prefix);

                    let extra = module_specifier.strip_prefix(prefix);
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
                        debug!("Extra: `{}`", extra);
                    }

                    let mut errors = vec![];
                    for target in to {
                        let replaced = target.replace('*', extra);

                        let res = self
                            .inner
                            .resolve(base, module_specifier)
                            .or_else(|_| {
                                self.inner
                                    .resolve(&self.base_url_filename, &format!("./{}", replaced))
                            })
                            .or_else(|_| {
                                self.inner
                                    .resolve(&self.base_url_filename, module_specifier)
                            })
                            .with_context(|| format!("failed to resolve `{}`", module_specifier));

                        errors.push(match res {
                            Ok(resolved) => {
                                info!(
                                    "Resolved `{}` as `{}` from `{}`",
                                    module_specifier, resolved, base
                                );
                                return Ok(resolved);
                            }
                            Err(err) => {
                                info!(
                                    "Failed to resolve `{}` from `{}`: {:?}",
                                    module_specifier, base, err
                                );
                                err
                            }
                        });

                        if to.len() == 1 {
                            info!(
                                "Using `{}` for `{}` because the length of the jsc.paths entry is \
                                 1",
                                replaced, module_specifier
                            );
                            return Ok(FileName::Real(replaced.into()));
                        }
                    }

                    bail!(
                        "`{}` matched `{}` (from tsconfig.paths) but failed to resolve:\n{:?}",
                        module_specifier,
                        prefix,
                        errors
                    )
                }
                Pattern::Exact(from) => {
                    // Should be exactly matched
                    if module_specifier != from {
                        continue;
                    }

                    if self.base_url_filename == *base {
                        // Prevent infinite loop

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
                    } else {
                        return self.resolve(&self.base_url_filename, &to[0]);
                    }
                }
            }
        }

        if let Ok(v) = self
            .inner
            .resolve(&self.base_url_filename, module_specifier)
        {
            return Ok(v);
        }

        self.inner.resolve(base, module_specifier)
    }
}
