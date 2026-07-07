use std::{
    borrow::Cow,
    env::current_dir,
    fs::canonicalize,
    io,
    path::{Component, Path, PathBuf},
    sync::Arc,
};

use anyhow::{anyhow, Context, Error};
use path_clean::PathClean;
use pathdiff::diff_paths;
use swc_atoms::Atom;
use swc_common::{FileName, Mark, Span, SyntaxContext, DUMMY_SP};
use swc_ecma_ast::*;
use swc_ecma_loader::resolve::{Resolution, Resolve};
use swc_ecma_utils::{quote_ident, ExprFactory};
#[cfg(debug_assertions)]
use tracing::{debug, info, warn, Level};

#[derive(Default)]
pub enum Resolver {
    Real {
        base: FileName,
        resolver: Arc<dyn ImportResolver>,
    },
    #[default]
    Default,
}

impl Resolver {
    pub(crate) fn resolve(&self, src: Atom) -> Atom {
        match self {
            Self::Real { resolver, base } => resolver
                .resolve_import(base, &src)
                .with_context(|| format!("failed to resolve import `{src}`"))
                .unwrap(),
            Self::Default => src,
        }
    }

    pub(crate) fn make_require_call(
        &self,
        unresolved_mark: Mark,
        src: Atom,
        src_span: Span,
    ) -> Expr {
        let src = self.resolve(src);

        CallExpr {
            span: DUMMY_SP,
            callee: quote_ident!(
                SyntaxContext::empty().apply_mark(unresolved_mark),
                "require"
            )
            .as_callee(),
            args: vec![Lit::Str(Str {
                span: src_span,
                raw: None,
                value: src.into(),
            })
            .as_arg()],
            ..Default::default()
        }
        .into()
    }
}

pub trait ImportResolver {
    /// Resolves `target` as a string usable by the modules pass.
    ///
    /// The returned string will be used as a module specifier.
    fn resolve_import(&self, base: &FileName, module_specifier: &str) -> Result<Atom, Error>;
}

/// [`ImportResolver`] implementation which just uses original source.
#[derive(Debug, Clone, Copy, Default)]
pub struct NoopImportResolver;

impl ImportResolver for NoopImportResolver {
    fn resolve_import(&self, _: &FileName, module_specifier: &str) -> Result<Atom, Error> {
        Ok(module_specifier.into())
    }
}

/// [`ImportResolver`] implementation for node.js
///
/// Supports [`FileName::Real`] and [`FileName::Anon`] for `base`,
/// [`FileName::Real`] and [`FileName::Custom`] for `target`.
/// ([`FileName::Custom`] is used for core modules)
#[derive(Debug, Clone, Default)]
pub struct NodeImportResolver<R>
where
    R: Resolve,
{
    resolver: R,
    config: Config,
    preserve_symlinks: bool,
}

#[derive(Debug, Clone)]
pub struct Config {
    pub base_dir: Option<PathBuf>,
    pub resolve_fully: bool,
    pub file_extension: String,
}

impl Default for Config {
    fn default() -> Config {
        Config {
            file_extension: crate::util::Config::default_js_ext(),
            resolve_fully: bool::default(),
            base_dir: Option::default(),
        }
    }
}

impl<R> NodeImportResolver<R>
where
    R: Resolve,
{
    pub fn with_config(resolver: R, config: Config) -> Self {
        Self::with_config_inner(resolver, config, false)
    }

    /// Creates a resolver that preserves symlink paths when rewriting module
    /// specifiers.
    pub fn with_config_preserving_symlinks(resolver: R, config: Config) -> Self {
        Self::with_config_inner(resolver, config, true)
    }

    fn with_config_inner(resolver: R, config: Config, preserve_symlinks: bool) -> Self {
        #[cfg(not(all(target_arch = "wasm32", not(target_os = "wasi"))))]
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

        Self {
            resolver,
            config,
            preserve_symlinks,
        }
    }
}

impl<R> NodeImportResolver<R>
where
    R: Resolve,
{
    fn to_specifier(&self, mut target_path: PathBuf, orig_filename: Option<&str>) -> Atom {
        #[cfg(debug_assertions)]
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

            let is_resolved_as_non_js = if let Some(ext) = target_path.extension() {
                ext.to_string_lossy() != self.config.file_extension
            } else {
                false
            };

            let is_resolved_as_js = if let Some(ext) = target_path.extension() {
                ext.to_string_lossy() == self.config.file_extension
            } else {
                false
            };

            let is_exact = if let Some(filename) = target_path.file_name() {
                filename == orig_filename
            } else {
                false
            };

            let file_stem_matches = if let Some(stem) = target_path.file_stem() {
                stem == orig_filename
            } else {
                false
            };

            if self.config.resolve_fully && is_resolved_as_js {
            } else if orig_filename == "index" {
                // Import: `./foo/index`
                // Resolved: `./foo/index.js`

                if self.config.resolve_fully {
                    target_path.set_file_name(format!("index.{}", self.config.file_extension));
                } else {
                    target_path.set_file_name("index");
                }
            } else if is_resolved_as_index
                && is_resolved_as_js
                && orig_filename != format!("index.{}", self.config.file_extension)
            {
                // Import: `./foo`
                // Resolved: `./foo/index.js`

                target_path.pop();
            } else if is_resolved_as_non_js && self.config.resolve_fully && file_stem_matches {
                target_path.set_extension(self.config.file_extension.clone());
            } else if !is_resolved_as_js && !is_resolved_as_index && !is_exact {
                target_path.set_file_name(orig_filename);
            } else if is_resolved_as_non_js && is_exact {
                if let Some(ext) = Path::new(orig_filename).extension() {
                    target_path.set_extension(ext);
                } else {
                    target_path.set_extension(self.config.file_extension.clone());
                }
            } else if self.config.resolve_fully && is_resolved_as_non_js {
                target_path.set_extension(self.config.file_extension.clone());
            } else if is_resolved_as_non_js && is_resolved_as_index {
                if orig_filename == "index" {
                    target_path.set_extension("");
                } else if Path::new(orig_filename).file_stem()
                    == Some(std::ffi::OsStr::new("index"))
                {
                    // User explicitly imported an index file with extension
                    // (e.g. "./plugins/index.js"), so preserve it.
                    target_path.set_file_name(orig_filename);
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

    fn try_resolve_import(&self, base: &FileName, module_specifier: &str) -> Result<Atom, Error> {
        #[cfg(debug_assertions)]
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

        let orig_slug = module_specifier.split('/').next_back();

        let target = self.resolver.resolve(base, module_specifier);
        let mut target = match target {
            Ok(v) => v,
            Err(err) => {
                #[cfg(debug_assertions)]
                warn!("import rewriter: failed to resolve: {}", err);
                #[cfg(not(debug_assertions))]
                let _ = err;
                return Ok(module_specifier.into());
            }
        };

        if !self.preserve_symlinks {
            // Bazel uses symlink
            //
            // https://github.com/swc-project/swc/issues/8265
            if let FileName::Real(resolved) = &target.filename {
                if let Ok(orig) = canonicalize(resolved) {
                    target.filename = FileName::Real(orig);
                }
            }
        }

        let Resolution {
            filename: target,
            slug,
        } = target;
        let slug = slug.as_deref().or(orig_slug);

        #[cfg(debug_assertions)]
        info!("Resolved as {target:?} with slug = {slug:?}");

        let mut target = match target {
            FileName::Real(v) => v,
            FileName::Custom(s) => return Ok(self.to_specifier(s.into(), slug)),
            _ => {
                unreachable!(
                    "Node path provider does not support using `{:?}` as a target file name",
                    target
                )
            }
        };
        let mut base = match base {
            FileName::Real(v) => Cow::Borrowed(
                v.parent()
                    .ok_or_else(|| anyhow!("failed to get parent of {v:?}"))?,
            ),
            FileName::Anon => match &self.config.base_dir {
                Some(v) => Cow::Borrowed(&**v),
                None => {
                    if cfg!(target_arch = "wasm32") {
                        panic!("Please specify `filename`")
                    } else {
                        Cow::Owned(current_dir().expect("failed to get current directory"))
                    }
                }
            },
            _ => {
                unreachable!(
                    "Node path provider does not support using `{:?}` as a base file name",
                    base
                )
            }
        };

        if base.is_absolute() != target.is_absolute() {
            if base.is_absolute() {
                base = Cow::Owned(base.to_path_buf().clean());
            } else {
                base = Cow::Owned(absolute_base_path(self.config.base_dir.as_deref(), &base)?);
            }

            if target.is_absolute() {
                target = target.clean();
            } else {
                target = absolute_path(self.config.base_dir.as_deref(), &target)?;
            }
        }

        #[cfg(windows)]
        {
            (base, target) = normalize_extended_length_path_prefixes(
                self.config.base_dir.as_deref(),
                base,
                target,
            );
        }

        #[cfg(debug_assertions)]
        debug!(
            "Comparing values (after normalizing absoluteness)\nbase={}\ntarget={}",
            base.display(),
            target.display()
        );

        let rel_path = diff_paths(&target, &*base);

        let rel_path = match rel_path {
            Some(v) => v,
            None => return Ok(self.to_specifier(target, slug)),
        };

        #[cfg(debug_assertions)]
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
        // Check for actual relative path markers (./ or ../) or absolute paths.
        // Note: We can't just check `starts_with('.')` because that would match
        // hidden directories like `.foo`, which need a `./` prefix to be valid
        // relative imports. See https://github.com/swc-project/swc/issues/9551
        //
        // On Windows, we also need to check for backslash variants (.\ and ..\).
        let s = if s.starts_with("./")
            || s.starts_with("../")
            || s.starts_with(".\\")
            || s.starts_with("..\\")
            || s == ".."
            || s.starts_with('/')
            || rel_path.is_absolute()
        {
            s
        } else {
            Cow::Owned(format!("./{s}"))
        };

        Ok(self.to_specifier(s.into_owned().into(), slug))
    }
}

impl<R> ImportResolver for NodeImportResolver<R>
where
    R: Resolve,
{
    fn resolve_import(&self, base: &FileName, module_specifier: &str) -> Result<Atom, Error> {
        self.try_resolve_import(base, module_specifier)
            .or_else(|err| {
                #[cfg(debug_assertions)]
                warn!("Failed to resolve import: {}", err);
                #[cfg(not(debug_assertions))]
                let _ = err;
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
            fn resolve_import(&self, base: &FileName, target: &str) -> Result<Atom, Error> {
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

fn absolute_base_path(base_dir: Option<&Path>, path: &Path) -> io::Result<PathBuf> {
    if path.is_absolute() {
        return Ok(path.to_path_buf().clean());
    }

    let Some(base_dir) = base_dir else {
        return absolute_path(None, path);
    };

    let base_dir_path = base_dir.join(path).clean();
    let cwd = match current_dir() {
        Ok(path) => normalize_path_prefix_like(base_dir, path.clean()),
        Err(_) => return Ok(base_dir_path),
    };

    Ok(absolute_base_path_with_cwd(
        base_dir,
        path,
        &cwd,
        base_dir_path,
    ))
}

fn absolute_base_path_with_cwd(
    base_dir: &Path,
    path: &Path,
    cwd: &Path,
    base_dir_path: PathBuf,
) -> PathBuf {
    let cwd_path = cwd.join(path).clean();

    // Relative CLI filenames are rooted at the current process directory. Other
    // API callers commonly pass filenames relative to `jsc.baseUrl`, so keep
    // that legacy behavior unless the cwd-rooted path visibly enters baseUrl
    // from outside it. If cwd is already inside baseUrl, every relative path is
    // under baseUrl and the interpretation is ambiguous.
    if cwd_path.starts_with(base_dir) && !cwd.starts_with(base_dir) {
        cwd_path
    } else {
        base_dir_path
    }
}

#[cfg(windows)]
fn normalize_path_prefix_like(reference: &Path, path: PathBuf) -> PathBuf {
    let reference = reference.as_os_str().to_string_lossy();
    let path_str = path.as_os_str().to_string_lossy();

    normalize_extended_length_path_prefix(&reference, &path_str)
        .map(PathBuf::from)
        .unwrap_or(path)
}

#[cfg(not(windows))]
fn normalize_path_prefix_like(_: &Path, path: PathBuf) -> PathBuf {
    path
}

#[cfg(windows)]
fn normalize_extended_length_path_prefixes<'a>(
    base_dir: Option<&Path>,
    base: Cow<'a, Path>,
    target: PathBuf,
) -> (Cow<'a, Path>, PathBuf) {
    if !base.is_absolute() || !target.is_absolute() {
        return (base, target);
    }

    let reference = match base_dir {
        Some(base_dir) if has_extended_length_path_prefix(base_dir) => Some(base_dir.to_path_buf()),
        _ if has_extended_length_path_prefix(base.as_ref()) => Some(base.to_path_buf()),
        _ if has_extended_length_path_prefix(&target) => Some(target.clone()),
        _ => None,
    };

    let Some(reference) = reference else {
        return (base, target);
    };

    // Windows canonicalization often returns extended-length paths (`\\?\...`).
    // `pathdiff` treats those as a different prefix from ordinary absolute
    // paths, so align both sides before calculating a relative import.
    (
        Cow::Owned(normalize_path_prefix_like(&reference, base.into_owned())),
        normalize_path_prefix_like(&reference, target),
    )
}

#[cfg(windows)]
fn has_extended_length_path_prefix(path: &Path) -> bool {
    path.as_os_str().to_string_lossy().starts_with(r"\\?\")
}

#[cfg(any(test, windows))]
fn normalize_extended_length_path_prefix(reference: &str, path: &str) -> Option<String> {
    if !reference.starts_with(r"\\?\") || path.starts_with(r"\\?\") {
        return None;
    }

    if !is_windows_absolute_path(path) {
        return None;
    }

    if let Some(path) = path.strip_prefix(r"\\") {
        if path.starts_with(r".\") {
            return None;
        }

        return Some(format!(r"\\?\UNC\{path}"));
    }

    Some(format!(r"\\?\{path}"))
}

#[cfg(any(test, windows))]
fn is_windows_absolute_path(path: &str) -> bool {
    path.starts_with(r"\\") || has_windows_drive_prefix(path)
}

#[cfg(any(test, windows))]
fn has_windows_drive_prefix(path: &str) -> bool {
    let bytes = path.as_bytes();

    bytes.len() >= 3
        && bytes[0].is_ascii_alphabetic()
        && bytes[1] == b':'
        && matches!(bytes[2], b'/' | b'\\')
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn absolute_base_path_keeps_base_dir_when_cwd_is_inside_base_dir() {
        let base_dir = Path::new("/repo");
        let cwd = Path::new("/repo/packages/app");
        let path = Path::new("src");

        assert_eq!(
            absolute_base_path_with_cwd(base_dir, path, cwd, base_dir.join(path).clean()),
            PathBuf::from("/repo/src")
        );
    }

    #[test]
    fn absolute_base_path_uses_cwd_when_relative_path_enters_base_dir() {
        let base_dir = Path::new("/repo/bazel-out/foo-app");
        let cwd = Path::new("/repo");
        let path = Path::new("bazel-out/foo-app/src");

        assert_eq!(
            absolute_base_path_with_cwd(base_dir, path, cwd, base_dir.join(path).clean()),
            PathBuf::from("/repo/bazel-out/foo-app/src")
        );
    }

    #[test]
    fn extended_unc_prefix_uses_canonical_unc_form() {
        assert_eq!(
            normalize_extended_length_path_prefix(
                r"\\?\UNC\server\share\repo",
                r"\\server\share\repo\src"
            ),
            Some(r"\\?\UNC\server\share\repo\src".into())
        );
    }

    #[test]
    fn extended_drive_prefix_preserves_drive_form() {
        assert_eq!(
            normalize_extended_length_path_prefix(r"\\?\C:\repo", r"C:\repo\src"),
            Some(r"\\?\C:\repo\src".into())
        );
    }

    #[test]
    fn extended_drive_prefix_skips_relative_path() {
        assert_eq!(
            normalize_extended_length_path_prefix(r"\\?\C:\repo", r"repo\src"),
            None
        );
    }
}
