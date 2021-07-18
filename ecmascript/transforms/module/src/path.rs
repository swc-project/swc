use anyhow::Error;
use pathdiff::diff_paths;
use std::{borrow::Cow, env::current_dir, path::Component, sync::Arc};
use swc_atoms::JsWord;
use swc_common::FileName;
use swc_ecma_loader::resolve::Resolve;

pub trait ImportResolver {
    /// Resolves `target` as a string usable by the modules pass.
    fn resolve_import(&self, base: &FileName, module_specifier: &str) -> Result<JsWord, Error>;
}

/// [ImportResolver] implementation which just uses orignal source.
#[derive(Debug, Clone, Copy, Default)]
pub struct NoopImportResolver;

impl ImportResolver for NoopImportResolver {
    fn resolve_import(&self, _: &FileName, module_specifier: &str) -> Result<JsWord, Error> {
        Ok(module_specifier.into())
    }
}

/// [ImportResolver] implementation for node.js
///
/// Supports [FileName::Real] and [FileName::Anon] for `base`, [FileName::Real]
/// and [FileName::Custom] for `target`. ([FileName::Custom] is used for core
/// modules)
#[derive(Debug, Clone, Default)]
pub struct NodeImportResolver<R>
where
    R: Resolve,
{
    resolver: R,
}

impl<R> NodeImportResolver<R>
where
    R: Resolve,
{
    pub fn new(resolver: R) -> Self {
        Self { resolver }
    }
}

impl<R> ImportResolver for NodeImportResolver<R>
where
    R: Resolve,
{
    fn resolve_import(&self, base: &FileName, module_specifier: &str) -> Result<JsWord, Error> {
        let target = self.resolver.resolve(base, module_specifier);
        let target = match target {
            Ok(v) => v,
            Err(_) => return Ok(module_specifier.into()),
        };

        let target = match target {
            FileName::Real(v) => v,
            FileName::Custom(s) => return Ok(s.into()),
            _ => {
                unreachable!(
                    "Node path provider does not support using `{:?}` as a target file name",
                    target
                )
            }
        };
        let base = match base {
            FileName::Real(v) => Cow::Borrowed(v),
            FileName::Anon => Cow::Owned(current_dir().expect("failed to get current directory")),
            _ => {
                unreachable!(
                    "Node path provider does not support using `{:?}` as a base file name",
                    base
                )
            }
        };

        let rel_path = diff_paths(
            &target,
            match base.parent() {
                Some(v) => v,
                None => &base,
            },
        );

        let rel_path = match rel_path {
            Some(v) => v,
            None => return Ok(module_specifier.into()),
        };

        {
            // Check for `node_modules`.

            for component in rel_path.components() {
                match component {
                    Component::Prefix(_) => {}
                    Component::RootDir => {}
                    Component::CurDir => {}
                    Component::ParentDir => {}
                    Component::Normal(c) => {
                        if c == "node_modules" {
                            return Ok(module_specifier.into());
                        }
                    }
                }
            }
        }

        debug_assert!(
            !rel_path.is_absolute(),
            "Resolved path should not be absolute (in swc repository) but found {}\nbase: \
             {}\ntarget: {}",
            rel_path.display(),
            base.display(),
            target.display(),
        );

        let s = rel_path.to_string_lossy();
        let s = if s.starts_with('.') || s.starts_with("/") {
            s
        } else {
            Cow::Owned(format!("./{}", s))
        };
        if cfg!(target_os = "windows") {
            Ok(s.replace('\\', "/").into())
        } else {
            Ok(s.into())
        }
    }
}

macro_rules! impl_ref {
    ($P:ident, $T:ty) => {
        impl<$P> ImportResolver for $T
        where
            $P: ImportResolver,
        {
            fn resolve_import(&self, base: &FileName, target: &str) -> Result<JsWord, Error> {
                (**self).resolve_import(base, target)
            }
        }
    };
}

impl_ref!(P, &'_ P);
impl_ref!(P, Box<P>);
impl_ref!(P, Arc<P>);
