use std::{
    borrow::Cow,
    env::current_dir,
    ffi::OsStr,
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
use tracing::{debug, info, trace, warn, Level};

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
    base_dir: Option<PathBuf>,
}

impl<R> NodeImportResolver<R>
where
    R: Resolve,
{
    #[deprecated(note = "Use `with_base_dir`")]
    pub fn new(resolver: R) -> Self {
        Self::with_base_dir(resolver, None)
    }

    pub fn with_base_dir(resolver: R, base_dir: Option<PathBuf>) -> Self {
        #[cfg(not(target_arch = "wasm32"))]
        if let Some(base_dir) = &base_dir {
            assert!(
                base_dir.is_absolute(),
                "base_dir(`{}`) must be absolute. Please ensure that `jsc.baseUrl` is specified \
                 correctly. This cannot be deduced by SWC itself because SWC is a transpiler and \
                 it does not try to resolve project details. In other works, SWC does not know \
                 which directory should be used as a base directory. It can be deduced if \
                 `.swcrc` is used, but if not, there are many candidates. e.g. the directory \
                 containing `package.json`, or the current working directory. Because of that, \
                 the caller (typically the developer of the JavaScript package) should specify \
                 it. If you see this error, please report an issue to the package author.",
                base_dir.display()
            );
        }

        Self { resolver, base_dir }
    }
}

impl<R> ImportResolver for NodeImportResolver<R>
where
    R: Resolve,
{
    fn resolve_import(&self, base: &FileName, module_specifier: &str) -> Result<JsWord, Error> {
        fn to_specifier(target_path: PathBuf, orig_filename: Option<&OsStr>) -> JsWord {
            debug!(
                "Creating a specifier for {} with original filename {:?}",
                target_path.display(),
                orig_filename
            );

            let mut p = target_path;

            if let Some(orig_ext) = orig_ext {
                let use_orig = if let Some(ext) = p.extension() {
                    ext == "ts" || ext == "tsx"
                } else {
                    false
                };

                if use_orig {
                    if matches!(orig_ext, "js" | "mjs" | "cjs" | "jsx") {
                        p.set_extension(orig_ext);
                    } else {
                        p.set_extension("");
                    }
                }
            } else {
                p.set_extension("");
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

        info!("Resolved to {}", target);

        let mut target = match target {
            FileName::Real(v) => v,
            FileName::Custom(s) => return Ok(to_specifier(&s, orig_ext)),
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

        if base.is_absolute() != target.is_absolute() {
            base = Cow::Owned(absolute_path(self.base_dir.as_deref(), &base)?);
            target = absolute_path(self.base_dir.as_deref(), &target)?;
        }

        debug!(
            "Comparing values (after normalizing absoluteness)\nbase={}\ntarget={}",
            base.display(),
            target.display()
        );

        let rel_path = diff_paths(
            &target,
            match base.parent() {
                Some(v) => v,
                None => &base,
            },
        );

        let rel_path = match rel_path {
            Some(v) => v,
            None => return Ok(to_specifier(&target.display().to_string(), orig_ext)),
        };

        debug!("Relative path: {}", rel_path.display());

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
            Ok(to_specifier(&s.replace('\\', "/"), orig_ext))
        } else {
            Ok(to_specifier(&s, orig_ext))
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

fn absolute_path(base_dir: Option<&Path>, path: &Path) -> io::Result<PathBuf> {
    let absolute_path = if path.is_absolute() {
        path.to_path_buf()
    } else {
        match base_dir {
            Some(base_dir) => base_dir.join(path),
            None => current_dir()?.join(path),
        }
    }
    .clean();

    Ok(absolute_path)
}
