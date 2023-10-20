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
use tracing::{debug, info, warn, Level};

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
    config: Config,
}

#[derive(Debug, Clone, Default)]
pub struct Config {
    pub base_dir: Option<PathBuf>,
    pub resolve_fully: bool,
}

impl<R> NodeImportResolver<R>
where
    R: Resolve,
{
    #[deprecated(note = "Use `with_config`")]
    pub fn new(resolver: R) -> Self {
        Self::with_config(resolver, Default::default())
    }

    #[deprecated(note = "Use `with_config`")]
    pub fn with_base_dir(resolver: R, base_dir: Option<PathBuf>) -> Self {
        Self::with_config(
            resolver,
            Config {
                base_dir,
                ..Default::default()
            },
        )
    }

    pub fn with_config(resolver: R, config: Config) -> Self {
        #[cfg(not(target_arch = "wasm32"))]
        if let Some(base_dir) = &config.base_dir {
            assert!(
                base_dir.is_absolute(),
                "base_dir(`{}`) must be absolute. Please ensure that `jsc.baseUrl` is specified \
                 correctly. This cannot be deduced by SWC itself because SWC is a transpiler and \
                 it does not try to resolve project details. In other words, SWC does not know \
                 which directory should be used as a base directory. It can be deduced if \
                 `.swcrc` is used, but if not, there are many candidates. e.g. the directory \
                 containing `package.json`, or the current working directory. Because of that, \
                 the caller (typically the developer of the JavaScript package) should specify \
                 it. If you see this error, please report an issue to the package author.",
                base_dir.display()
            );
        }

        Self { resolver, config }
    }
}

impl<R> NodeImportResolver<R>
where
    R: Resolve,
{
    fn to_specifier(&self, mut target_path: PathBuf, orig_filename: Option<&str>) -> JsWord {
        debug!(
            "Creating a specifier for `{}` with original filename `{:?}`",
            target_path.display(),
            orig_filename
        );

        if let Some(orig_filename) = orig_filename {
            let is_resolved_as_index = if let Some(stem) = target_path.file_stem() {
                stem == "index"
            } else {
                false
            };

            let is_resolved_as_ts = if let Some(ext) = target_path.extension() {
                ext == "ts" || ext == "tsx"
            } else {
                false
            };

            let is_exact = if let Some(filename) = target_path.file_name() {
                filename == orig_filename
            } else {
                false
            };

            if !is_resolved_as_index && !is_exact {
                target_path.set_file_name(orig_filename);
            } else if is_resolved_as_ts && is_exact {
                if let Some(ext) = Path::new(orig_filename).extension() {
                    target_path.set_extension(ext);
                } else {
                    target_path.set_extension("js");
                }
            } else if self.config.resolve_fully && is_resolved_as_ts {
                target_path.set_extension("js");
            } else if is_resolved_as_ts && is_resolved_as_index {
                if orig_filename == "index" {
                    target_path.set_extension("");
                } else {
                    target_path.pop();
                }
            }
        } else {
            target_path.set_extension("");
        }

        if cfg!(target_os = "windows") {
            target_path.display().to_string().replace('\\', "/").into()
        } else {
            target_path.display().to_string().into()
        }
    }

    fn try_resolve_import(&self, base: &FileName, module_specifier: &str) -> Result<JsWord, Error> {
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

        let orig_filename = module_specifier.split('/').last();

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
            FileName::Real(v) => {
                // @nestjs/common should be preserved as a whole
                if v.starts_with(".") || v.starts_with("..") || v.is_absolute() {
                    v
                } else {
                    return Ok(self.to_specifier(v, orig_filename));
                }
            }
            FileName::Custom(s) => return Ok(self.to_specifier(s.into(), orig_filename)),
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
            base = Cow::Owned(absolute_path(self.config.base_dir.as_deref(), &base)?);
            target = absolute_path(self.config.base_dir.as_deref(), &target)?;
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
            None => return Ok(self.to_specifier(target, orig_filename)),
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

        Ok(self.to_specifier(s.into_owned().into(), orig_filename))
    }
}

impl<R> ImportResolver for NodeImportResolver<R>
where
    R: Resolve,
{
    fn resolve_import(&self, base: &FileName, module_specifier: &str) -> Result<JsWord, Error> {
        self.try_resolve_import(base, module_specifier)
            .or_else(|err| {
                warn!("Failed to resolve import: {}", err);
                Ok(module_specifier.into())
            })
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
