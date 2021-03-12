use self::scope::Scope;
use crate::{Hook, Load, ModuleId, Resolve};
use ahash::AHashMap;
use anyhow::{Context, Error};
use std::collections::HashMap;
use swc_atoms::JsWord;
use swc_common::{sync::Lrc, FileName, Globals, Mark, SourceMap, SyntaxContext, DUMMY_SP, GLOBALS};
use swc_ecma_ast::Module;

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

    /// List of modules which should be preserved.
    pub external_modules: Vec<JsWord>,

    /// Type of emitted module
    pub module: ModuleType,
}

#[derive(Debug, PartialEq, Eq, Hash)]
pub enum ModuleType {
    Es,
    Iife,
}

impl Default for ModuleType {
    fn default() -> Self {
        ModuleType::Es
    }
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

    globals: &'a Globals,
    cm: Lrc<SourceMap>,
    loader: L,
    resolver: R,

    /// [Mark] used while tree shaking
    used_mark: Mark,
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
        GLOBALS.set(&globals, || {
            let used_mark = Mark::fresh(Mark::root());
            log::debug!("Used mark: {:?}", DUMMY_SP.apply_mark(used_mark).ctxt());
            let helper_ctxt = SyntaxContext::empty().apply_mark(Mark::fresh(Mark::root()));
            log::debug!("Helper ctxt: {:?}", helper_ctxt);
            let synthesized_ctxt = SyntaxContext::empty().apply_mark(Mark::fresh(Mark::root()));
            log::debug!("Synthesized ctxt: {:?}", synthesized_ctxt);
            let injected_ctxt = SyntaxContext::empty().apply_mark(Mark::fresh(Mark::root()));
            log::debug!("Injected ctxt: {:?}", injected_ctxt);

            Bundler {
                config,
                globals,
                cm,
                loader,
                resolver,
                used_mark,
                _helper_ctxt: helper_ctxt,
                synthesized_ctxt,
                injected_ctxt,
                scope: Default::default(),
                hook,
            }
        })
    }

    ///
    ///
    ///
    /// Note: This method will panic if entries references each other in
    /// circular manner. However, it applies only to the provided `entries`, and
    /// dependencies with circular reference is ok.
    pub fn bundle(&self, entries: HashMap<String, FileName>) -> Result<Vec<Bundle>, Error> {
        let results = entries
            .into_iter()
            .map(|(name, path)| -> Result<_, Error> {
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

        let bundles = self.finalize(bundles)?;
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
