use std::collections::HashMap;

use anyhow::{Context, Error};
use swc_atoms::JsWord;
use swc_common::{
    collections::AHashMap, sync::Lrc, FileName, Globals, Mark, SourceMap, SyntaxContext, GLOBALS,
};
use swc_ecma_ast::Module;

use self::scope::Scope;
use crate::{Hook, Load, ModuleId, Resolve};

mod chunk;
mod export;
mod finalize;
mod helpers;
mod import;
mod keywords;
mod load;
mod optimize;
mod scope;
#[cfg(test)]
pub(crate) mod tests;

#[derive(Debug, Default)]
pub struct Config {
    /// If it's true, [Bundler] searches for require calls.
    pub require: bool,

    /// If it's true, many temporary variables will be generated.
    ///
    /// This option exists mainly for testing. As inlining and dce removes all
    /// temporary variables, it's really hard to see what's going on.
    pub disable_inliner: bool,

    /// Useful if you are going to minify the code.
    pub disable_hygiene: bool,

    pub disable_fixer: bool,

    /// Disable tree-shaking optimization.
    pub disable_dce: bool,

    /// List of modules which should be preserved.
    pub external_modules: Vec<JsWord>,

    /// Type of emitted module
    pub module: ModuleType,
}

#[derive(Debug, PartialEq, Eq, Hash, Default)]
pub enum ModuleType {
    #[default]
    Es,
    Iife,
}

#[derive(Debug, Clone, PartialEq, Eq, PartialOrd, Ord, Hash)]
pub enum BundleKind {
    /// User-provided entry
    Named { name: String },
    /// Auto-generated entry (created by import expression)
    Dynamic,
    /// A lazy-loaded shared library
    Lib { name: String },
}

/// Built bundle
#[derive(Debug)]
pub struct Bundle {
    pub kind: BundleKind,
    pub id: ModuleId,
    /// Merged module.
    pub module: Module,
}

pub struct Bundler<'a, L, R>
where
    L: Load,
    R: Resolve,
{
    config: Config,

    unresolved_mark: Mark,

    globals: &'a Globals,
    cm: Lrc<SourceMap>,
    loader: L,
    resolver: R,

    _helper_ctxt: SyntaxContext,
    /// Used to mark nodes as synthesized.
    ///
    /// We can check if a span is a dummy for now, but in future we may improve
    /// spans.
    synthesized_ctxt: SyntaxContext,

    /// Used to mark a variable declaration as injected.
    pub(crate) injected_ctxt: SyntaxContext,

    scope: Scope,

    hook: Box<dyn 'a + Hook>,
}

impl<'a, L, R> Bundler<'a, L, R>
where
    L: Load,
    R: Resolve,
{
    pub fn new(
        globals: &'a Globals,
        cm: Lrc<SourceMap>,
        loader: L,
        resolver: R,
        config: Config,
        hook: Box<dyn 'a + Hook>,
    ) -> Self {
        GLOBALS.set(globals, || {
            let helper_ctxt = SyntaxContext::empty().apply_mark(Mark::fresh(Mark::root()));
            tracing::debug!("Helper ctxt: {:?}", helper_ctxt);
            let synthesized_ctxt = SyntaxContext::empty().apply_mark(Mark::fresh(Mark::root()));
            tracing::debug!("Synthesized ctxt: {:?}", synthesized_ctxt);
            let injected_ctxt = SyntaxContext::empty().apply_mark(Mark::fresh(Mark::root()));
            tracing::debug!("Injected ctxt: {:?}", injected_ctxt);

            Bundler {
                config,
                globals,
                cm,
                loader,
                resolver,
                _helper_ctxt: helper_ctxt,
                synthesized_ctxt,
                injected_ctxt,
                scope: Default::default(),
                hook,
                unresolved_mark: Mark::new(),
            }
        })
    }

    pub(crate) fn is_external(&self, src: &JsWord) -> bool {
        self.config.external_modules.iter().any(|v| v == src)
    }

    ///
    ///
    ///
    /// Note: This method will panic if entries references each other in
    /// circular manner. However, it applies only to the provided `entries`, and
    /// dependencies with circular reference is ok.
    pub fn bundle(&mut self, entries: HashMap<String, FileName>) -> Result<Vec<Bundle>, Error> {
        let results = entries
            .into_iter()
            .map(|(name, path)| -> Result<_, Error> {
                let path = match path {
                    FileName::Real(path) => {
                        if cfg!(target_os = "windows") {
                            let path = path
                                .canonicalize()
                                .context("failed to canonicalize entry")?;
                            FileName::Real(path)
                        } else {
                            FileName::Real(path)
                        }
                    }
                    _ => path,
                };

                let res = self
                    .load_transformed(&path)
                    .context("load_transformed failed")?;
                Ok((name, res))
            })
            .collect::<Vec<_>>();

        // We collect at here to handle dynamic imports
        // TODO: Handle dynamic imports

        let local = {
            let mut output = AHashMap::default();

            for res in results {
                let (name, m) = res?;
                let m = m.unwrap();

                output.insert(name, m);
            }

            output
        };

        let bundles = self.chunk(local)?;

        let bundles = self.finalize(bundles, self.unresolved_mark)?;

        #[cfg(feature = "concurrent")]
        {
            let scope = std::mem::take(&mut self.scope);
            rayon::spawn(move || drop(scope))
        }

        Ok(bundles)
    }

    /// Sets `swc_common::GLOBALS`
    #[inline]
    fn run<F, Ret>(&self, op: F) -> Ret
    where
        F: FnOnce() -> Ret,
    {
        GLOBALS.set(self.globals, op)
    }
}
