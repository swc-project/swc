use std::{
    borrow::Cow,
    env::current_dir,
    io,
    path::{Component, Path, PathBuf},
    sync::Arc,
};

use anyhow::{Context, Error};
use path_clean::PathClean;
use pathdiff::diff_paths;
use swc_atoms::JsWord;
use swc_common::{FileName, Mark, Span, DUMMY_SP};
use swc_ecma_ast::*;
use swc_ecma_loader::resolve::Resolve;
use swc_ecma_utils::{quote_ident, ExprFactory};
use tracing::{debug, trace, warn, Level};

pub(crate) enum Resolver {
    Real {
        base: FileName,
        resolver: Box<dyn ImportResolver>,
    },
    Default,
}

impl Resolver {
    pub(crate) fn resolve(&self, src: JsWord) -> JsWord {
        match self {
            Self::Real { resolver, base } => resolver
                .resolve_import(base, &src)
                .with_context(|| format!("failed to resolve import `{}`", src))
                .unwrap(),
            Self::Default => src,
        }
    }

    pub(crate) fn make_require_call(
        &self,
        unresolved_mark: Mark,
        src: JsWord,
        src_span: Span,
    ) -> Expr {
        let src = self.resolve(src);

        Expr::Call(CallExpr {
            span: DUMMY_SP,
            callee: quote_ident!(DUMMY_SP.apply_mark(unresolved_mark), "require").as_callee(),
            args: vec![Lit::Str(Str {
                span: src_span,
                raw: None,
                value: src,
            })
            .as_arg()],

            type_args: Default::default(),
        })
    }
}

pub trait ImportResolver {
    /// Resolves `target` as a string usable by the modules pass.
    ///
    /// The returned string will be used as a module specifier.
    fn resolve_import(&self, base: &FileName, module_specifier: &str) -> Result<JsWord, Error>;
}

/// [ImportResolver] implementation which just uses original source.
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
        fn to_specifier(
            target_path: &str,
            is_file: Option<bool>,
            orig_ext: Option<&str>,
        ) -> JsWord {
            let mut p = PathBuf::from(target_path);

            if cfg!(debug_assertions) {
                trace!("to_specifier: orig_ext={:?}", orig_ext);
            }

            let dot_count = p
                .file_name()
                .map(|s| s.to_string_lossy())
                .map(|v| v.as_bytes().iter().filter(|&&c| c == b'.').count())
                .unwrap_or(0);

            match orig_ext {
                Some(orig_ext) => {
                    if is_file.unwrap_or_else(|| p.is_file()) {
                        if let Some(..) = p.extension() {
                            if orig_ext == "ts"
                                || orig_ext == "tsx"
                                || orig_ext == "js"
                                || orig_ext == "jsx"
                                || dot_count == 1
                            {
                                p.set_extension(orig_ext);
                            } else {
                                p.set_extension("");
                            }
                        }
                    }
                }
                _ => {
                    if is_file.unwrap_or_else(|| p.is_file()) {
                        if let Some(v) = p.extension() {
                            if v == "ts" || v == "tsx" || v == "js" || v == "jsx" {
                                p.set_extension("");
                            }
                        }
                    }
                }
            }

            p.display().to_string().into()
        }

        let _tracing = if cfg!(debug_assertions) {
            Some(
                tracing::span!(
                    Level::ERROR,
                    "resolve_import",
                    base = tracing::field::display(base),
                    module_specifier = tracing::field::display(module_specifier),
                )
                .entered(),
            )
        } else {
            None
        };

        if cfg!(debug_assertions) {
            debug!("invoking resolver");
        }

        let orig_ext = module_specifier.split('/').last().and_then(|s| {
            if s.contains('.') {
                s.split('.').last()
            } else {
                None
            }
        });

        let target = self.resolver.resolve(base, module_specifier);
        let target = match target {
            Ok(v) => v,
            Err(err) => {
                warn!("import rewriter: failed to resolve: {}", err);
                return Ok(module_specifier.into());
            }
        };

        let mut target = match target {
            FileName::Real(v) => v,
            FileName::Custom(s) => return Ok(to_specifier(&s, None, orig_ext)),
            _ => {
                unreachable!(
                    "Node path provider does not support using `{:?}` as a target file name",
                    target
                )
            }
        };
        let mut base = match base {
            FileName::Real(v) => Cow::Borrowed(v),
            FileName::Anon => {
                if cfg!(target_arch = "wasm32") {
                    panic!("Please specify `filename`")
                } else {
                    Cow::Owned(current_dir().expect("failed to get current directory"))
                }
            }
            _ => {
                unreachable!(
                    "Node path provider does not support using `{:?}` as a base file name",
                    base
                )
            }
        };

        let is_file = target.is_file();

        if base.is_absolute() != target.is_absolute() {
            base = Cow::Owned(absolute_path(&base)?);
            target = absolute_path(&target)?;
        }

        let rel_path = diff_paths(
            &target,
            match base.parent() {
                Some(v) => v,
                None => &base,
            },
        );

        let rel_path = match rel_path {
            Some(v) => v,
            None => {
                return Ok(to_specifier(
                    &target.display().to_string(),
                    Some(is_file),
                    orig_ext,
                ))
            }
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

        let s = rel_path.to_string_lossy();
        let s = if s.starts_with('.') || s.starts_with('/') || rel_path.is_absolute() {
            s
        } else {
            Cow::Owned(format!("./{}", s))
        };
        if cfg!(target_os = "windows") {
            Ok(to_specifier(&s.replace('\\', "/"), Some(is_file), orig_ext))
        } else {
            Ok(to_specifier(&s, Some(is_file), orig_ext))
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

fn absolute_path(path: &Path) -> io::Result<PathBuf> {
    let absolute_path = if path.is_absolute() {
        path.to_path_buf()
    } else {
        std::env::current_dir()?.join(path)
    }
    .clean();

    Ok(absolute_path)
}
