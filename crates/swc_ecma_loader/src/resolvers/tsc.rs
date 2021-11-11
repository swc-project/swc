use crate::resolve::Resolve;
use anyhow::{bail, Context, Error};
use dashmap::DashMap;
use once_cell::sync::Lazy;
use regex::Regex;
use std::path::{Component, PathBuf};
use swc_common::FileName;

#[derive(Debug)]
enum Pattern {
    Regex(Regex),
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
        let paths = paths
            .into_iter()
            .map(|(from, to)| {
                assert!(
                    !to.is_empty(),
                    "value of `paths.{}` should not be an empty array",
                    from,
                );

                let pat = if from.contains('*') {
                    if from.as_bytes().iter().rposition(|&c| c == b'*')
                        != from.as_bytes().iter().position(|&c| c == b'*')
                    {
                        panic!("`paths.{}` should have only one wildcard", from)
                    }

                    Pattern::Regex(compile_regex(from))
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
        if src.starts_with(".") {
            if src == ".." || src.starts_with("./") || src.starts_with("../") {
                return self
                    .inner
                    .resolve(base, src)
                    .context("not processed by tsc resolver because it's relative import");
            }
        }

        match base {
            FileName::Real(v) => {
                if v.components().any(|c| match c {
                    Component::Normal(v) => v == "node_modules",
                    _ => false,
                }) {
                    return self.inner.resolve(base, src).context(
                        "not processed by tsc resolver because base module is in node_modules",
                    );
                }
            }
            _ => {}
        }

        // https://www.typescriptlang.org/docs/handbook/module-resolution.html#path-mapping
        for (from, to) in &self.paths {
            match from {
                Pattern::Regex(from) => {
                    let captures = from.captures(src);
                    let captures = match captures {
                        Some(v) => v,
                        None => continue,
                    };

                    let mut iter = captures.iter();
                    let _ = iter.next();

                    let capture = iter.next().flatten().expect(
                        "capture group should be created by initializer of TsConfigResolver",
                    );
                    let mut errors = vec![];
                    for target in to {
                        let mut replaced = target.replace('*', capture.as_str());
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
                        from.as_str(),
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

fn compile_regex(src: String) -> Regex {
    static CACHE: Lazy<DashMap<String, Regex, ahash::RandomState>> =
        Lazy::new(|| Default::default());

    if !CACHE.contains_key(&*src) {
        // Create capture group
        let regex_pat = src.replace("*", "(.*)");
        let re = Regex::new(&regex_pat).unwrap_or_else(|err| {
            panic!("failed to compile `{}` as a pattern: {:?}", regex_pat, err)
        });
        CACHE.insert(src.clone(), re);
    }

    let re = CACHE.get(&*src).unwrap();

    (*re).clone()
}
