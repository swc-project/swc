use crate::Resolver;
use std::collections::HashMap;
use std::path::Path;
use swc_atoms::JsWord;
use swc_common::errors::Diagnostic;
use swc_common::FileName;

/// `paths` of `tsconfig.json`.
pub type Paths = HashMap<String, Vec<String>, ahash::RandomState>;

/// Implementation of [Resolver] which mimics behavior of tsc.
///
/// # Type parameters
///
/// `R`: Raw resolver, which does not care about `paths` of tsconfig.
pub struct TscResolver<R>
where
    R: Resolver,
{
    paths: Paths,
    raw: R,
}

impl<R> TscResolver<R>
where
    R: Resolver,
{
    pub fn new(paths: Paths, raw: R) -> Self {
        for (matcher, paths) in &paths {
            assert!(
                matcher.ends_with("/*"),
                "Currently, swc only supports key of `paths` ending with `/*`"
            );

            for path in paths {
                debug_assert!(
                    path.ends_with("/*"),
                    "Currently, swc only supports value of `paths` ending with `/*`"
                );
            }
        }
        Self { paths, raw }
    }
}

impl<R> Resolver for TscResolver<R>
where
    R: Resolver,
{
    fn resolve(&self, base: &FileName, target: &JsWord) -> Result<FileName, Diagnostic> {
        for (matcher, paths) in self.paths.iter() {
            debug_assert!(matcher.ends_with("/*"));

            let prefix = &matcher[0..matcher.len() - 2];

            // Path not matched.
            if !target.starts_with(prefix) {
                continue;
            }

            let remaining = &target[prefix.len()..];

            for path in paths {
                debug_assert!(path.ends_with("/*"));

                let path = &path[0..path.len() - 2];

                let new_path = Path::new(path).join(remaining);

                if new_path.exists() {
                    return Ok(FileName::Real(new_path));
                }
            }
        }

        self.raw.resolve(base, target)
    }
}
