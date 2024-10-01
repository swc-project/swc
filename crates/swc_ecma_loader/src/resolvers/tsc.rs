use std::{
    cmp::Ordering,
    path::{Component, Path, PathBuf},
};

use anyhow::{bail, Context, Error};
use swc_common::FileName;
use tracing::{debug, info, trace, warn, Level};

use crate::resolve::{Resolution, Resolve};

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

        let mut paths: Vec<(Pattern, Vec<String>)> = paths
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

        paths.sort_by(|(a, _), (b, _)| match (a, b) {
            (Pattern::Wildcard { .. }, Pattern::Exact(_)) => Ordering::Greater,
            (Pattern::Exact(_), Pattern::Wildcard { .. }) => Ordering::Less,
            (Pattern::Exact(_), Pattern::Exact(_)) => Ordering::Equal,
            (Pattern::Wildcard { prefix: prefix_a }, Pattern::Wildcard { prefix: prefix_b }) => {
                prefix_a.len().cmp(&prefix_b.len()).reverse()
            }
        });

        Self {
            inner,
            base_url_filename: FileName::Real(base_url.clone()),
            base_url,
            paths,
        }
    }

    fn invoke_inner_resolver(
        &self,
        base: &FileName,
        module_specifier: &str,
    ) -> Result<Resolution, Error> {
        let res = self.inner.resolve(base, module_specifier).with_context(|| {
            format!(
                "failed to resolve `{module_specifier}` from `{base}` using inner \
                 resolver\nbase_url={}",
                self.base_url_filename
            )
        });

        match res {
            Ok(resolved) => {
                info!(
                    "Resolved `{}` as `{}` from `{}`",
                    module_specifier, resolved.filename, base
                );

                let is_base_in_node_modules = if let FileName::Real(v) = base {
                    v.components().any(|c| match c {
                        Component::Normal(v) => v == "node_modules",
                        _ => false,
                    })
                } else {
                    false
                };
                let is_target_in_node_modules = if let FileName::Real(v) = &resolved.filename {
                    v.components().any(|c| match c {
                        Component::Normal(v) => v == "node_modules",
                        _ => false,
                    })
                } else {
                    false
                };

                // If node_modules is in path, we should return module specifier.
                if !is_base_in_node_modules && is_target_in_node_modules {
                    return Ok(Resolution {
                        filename: FileName::Real(module_specifier.into()),
                        ..resolved
                    });
                }

                Ok(resolved)
            }

            Err(err) => {
                warn!("{:?}", err);
                Err(err)
            }
        }
    }
}

impl<R> Resolve for TsConfigResolver<R>
where
    R: Resolve,
{
    fn resolve(&self, base: &FileName, module_specifier: &str) -> Result<Resolution, Error> {
        let _tracing = if cfg!(debug_assertions) {
            Some(
                tracing::span!(
                    Level::ERROR,
                    "TsConfigResolver::resolve",
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
                .invoke_inner_resolver(base, module_specifier)
                .context("not processed by tsc resolver because it's relative import");
        }

        if let FileName::Real(v) = base {
            if v.components().any(|c| match c {
                Component::Normal(v) => v == "node_modules",
                _ => false,
            }) {
                return self.invoke_inner_resolver(base, module_specifier).context(
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

                    let mut errors = Vec::new();
                    for target in to {
                        let replaced = target.replace('*', extra);

                        let _tracing = if cfg!(debug_assertions) {
                            Some(
                                tracing::span!(
                                    Level::ERROR,
                                    "TsConfigResolver::resolve::jsc.paths",
                                    replaced = tracing::field::display(&replaced),
                                )
                                .entered(),
                            )
                        } else {
                            None
                        };

                        let relative = format!("./{}", replaced);

                        let res = self
                            .invoke_inner_resolver(base, module_specifier)
                            .or_else(|_| {
                                self.invoke_inner_resolver(&self.base_url_filename, &relative)
                            })
                            .or_else(|_| {
                                self.invoke_inner_resolver(&self.base_url_filename, &replaced)
                            });

                        errors.push(match res {
                            Ok(resolved) => return Ok(resolved),
                            Err(err) => err,
                        });

                        if to.len() == 1 && !prefix.is_empty() {
                            info!(
                                "Using `{}` for `{}` because the length of the jsc.paths entry is \
                                 1",
                                replaced, module_specifier
                            );
                            return Ok(Resolution {
                                slug: Some(
                                    replaced
                                        .split([std::path::MAIN_SEPARATOR, '/'])
                                        .last()
                                        .unwrap()
                                        .into(),
                                ),
                                filename: FileName::Real(replaced.into()),
                            });
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

                    let tp = Path::new(&to[0]);
                    let slug = to[0]
                        .split([std::path::MAIN_SEPARATOR, '/'])
                        .last()
                        .filter(|&slug| slug != "index.ts" && slug != "index.tsx")
                        .map(|v| v.rsplit_once('.').map(|v| v.0).unwrap_or(v))
                        .map(From::from);

                    if tp.is_absolute() {
                        return Ok(Resolution {
                            filename: FileName::Real(tp.into()),
                            slug,
                        });
                    }

                    if let Ok(res) = self
                        .invoke_inner_resolver(&self.base_url_filename, &format!("./{}", &to[0]))
                    {
                        return Ok(Resolution { slug, ..res });
                    }

                    return Ok(Resolution {
                        filename: FileName::Real(self.base_url.join(&to[0])),
                        slug,
                    });
                }
            }
        }

        if !module_specifier.starts_with('.') {
            let path = self.base_url.join(module_specifier);

            // https://www.typescriptlang.org/docs/handbook/modules/reference.html#baseurl
            if let Ok(v) = self.invoke_inner_resolver(base, &path.to_string_lossy()) {
                return Ok(v);
            }
        }

        self.invoke_inner_resolver(base, module_specifier)
    }
}
