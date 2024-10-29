use std::{
    env::current_dir,
    fs::{create_dir_all, read_to_string, write},
    io::Write,
    path::{Path, PathBuf},
};

use anyhow::{bail, Context, Error};
use path_clean::PathClean;
use reqwest::Url;
use sha1::{Digest, Sha1};
use swc_bundler::{Load, ModuleData, Resolve};
use swc_common::{
    comments::SingleThreadedComments,
    errors::{ColorConfig, Handler},
    sync::Lrc,
    FileName, Mark, SourceMap,
};
use swc_ecma_ast::{EsVersion, Program};
use swc_ecma_loader::resolve::Resolution;
use swc_ecma_parser::{parse_file_as_module, Syntax, TsSyntax};
use swc_ecma_transforms_base::{
    helpers::{inject_helpers, Helpers, HELPERS},
    resolver,
};
use swc_ecma_transforms_proposal::decorators;
use swc_ecma_transforms_react::react;
use swc_ecma_transforms_typescript::strip;

pub struct Loader {
    pub cm: Lrc<SourceMap>,
}

fn calc_hash(s: &str) -> String {
    let mut hasher = Sha1::new();
    hasher.update(s.as_bytes());
    let sum = hasher.finalize();

    hex::encode(sum)
}

fn calc_cache_path(cache_dir: &Path, url: &Url) -> PathBuf {
    let hash = calc_hash(url.as_ref());
    let s = url.to_string();
    if s.starts_with("https://deno.land/") {
        return cache_dir.join("deno").join(&hash);
    }

    cache_dir.join("untrusted").join(hash)
}

/// Load url. This method does caching.
fn load_url(url: Url) -> Result<String, Error> {
    let cache_dir = current_dir()
        .expect("the test requires an environment variable named `CARGO_MANIFEST_DIR`")
        .join("tests")
        .join(".cache");

    let cache_path = calc_cache_path(&cache_dir, &url).with_extension("ts");

    create_dir_all(cache_path.parent().unwrap()).context("failed to create cache dir")?;

    if let Ok(v) = read_to_string(&cache_path) {
        return Ok(v);
    }

    if let Ok("1") = std::env::var("CI").as_deref() {
        panic!("The bundler test suite should not download files from CI")
    }

    eprintln!("Storing `{}` at `{}`", url, cache_path.display());

    let resp = reqwest::blocking::get(url.clone())
        .with_context(|| format!("failed to fetch `{}`", url))?;

    let bytes = resp
        .bytes()
        .with_context(|| format!("failed to read data from `{}`", url))?;

    let mut content = Vec::new();
    write!(content, "// Loaded from {}\n\n\n", url).unwrap();
    content.extend_from_slice(&bytes);

    write(&cache_path, &content)?;

    Ok(String::from_utf8_lossy(&bytes).to_string())
}

impl Load for Loader {
    fn load(&self, f: &FileName) -> Result<ModuleData, Error> {
        eprintln!("load: {}", f);

        let unresolved_mark = Mark::new();
        let top_level_mark = Mark::new();

        let tsx;
        let fm = match f {
            FileName::Real(path) => {
                tsx = path.to_string_lossy().ends_with(".tsx");
                self.cm.load_file(path)?
            }
            FileName::Custom(url) => {
                tsx = url.ends_with(".tsx");
                // Hack for jszip, which depends on invalid url.
                let url = url.replace("https://deno.land/std@v", "https://deno.land/std@");

                let url = Url::parse(&url).context("failed to parse url")?;

                let src = load_url(url.clone())?;

                self.cm
                    .new_source_file(FileName::Custom(url.to_string()).into(), src)
            }
            _ => unreachable!(),
        };

        let module = parse_file_as_module(
            &fm,
            Syntax::Typescript(TsSyntax {
                decorators: true,
                tsx,
                ..Default::default()
            }),
            EsVersion::Es2020,
            None,
            &mut Vec::new(),
        )
        .unwrap_or_else(|err| {
            let handler =
                Handler::with_tty_emitter(ColorConfig::Always, false, false, Some(self.cm.clone()));
            err.into_diagnostic(&handler).emit();
            panic!("failed to parse")
        });

        let module = HELPERS.set(&Helpers::new(false), || {
            Program::Module(module)
                .apply(resolver(unresolved_mark, top_level_mark, false))
                .apply(decorators(decorators::Config {
                    legacy: true,
                    emit_metadata: Default::default(),
                    use_define_for_class_fields: false,
                }))
                .apply(strip(unresolved_mark, top_level_mark))
                .apply(react::<SingleThreadedComments>(
                    self.cm.clone(),
                    None,
                    Default::default(),
                    top_level_mark,
                    unresolved_mark,
                ))
                .apply(inject_helpers(unresolved_mark))
                .module()
                .unwrap()
        });

        Ok(ModuleData {
            fm,
            module,
            helpers: Default::default(),
        })
    }
}

pub struct NodeResolver;

static EXTENSIONS: &[&str] = &["ts", "tsx", "js", "jsx", "json", "node"];

impl NodeResolver {
    fn wrap(&self, path: PathBuf) -> Result<FileName, Error> {
        let path = path.clean();
        Ok(FileName::Real(path))
    }

    /// Resolve a path as a file. If `path` refers to a file, it is
    /// returned; otherwise the `path` + each extension is tried.
    fn resolve_as_file(&self, path: &Path) -> Result<PathBuf, Error> {
        // 1. If X is a file, load X as JavaScript text.
        if path.is_file() {
            return Ok(path.to_path_buf());
        }

        if let Some(name) = path.file_name() {
            let mut ext_path = path.to_path_buf();
            let name = name.to_string_lossy();
            for ext in EXTENSIONS {
                ext_path.set_file_name(format!("{}.{}", name, ext));
                if ext_path.is_file() {
                    return Ok(ext_path);
                }
            }

            // TypeScript-specific behavior: if the extension is ".js" or ".jsx",
            // try replacing it with ".ts" or ".tsx".
            ext_path.set_file_name(name.into_owned());
            let old_ext = path.extension().and_then(|ext| ext.to_str());

            if let Some(old_ext) = old_ext {
                let extensions = match old_ext {
                    // Note that the official compiler code always tries ".ts" before
                    // ".tsx" even if the original extension was ".jsx".
                    "js" => ["ts", "tsx"].as_slice(),
                    "jsx" => ["ts", "tsx"].as_slice(),
                    "mjs" => ["mts"].as_slice(),
                    "cjs" => ["cts"].as_slice(),
                    _ => [].as_slice(),
                };

                for ext in extensions {
                    ext_path.set_extension(ext);

                    if ext_path.is_file() {
                        return Ok(ext_path);
                    }
                }
            }
        }

        bail!("file not found: {}", path.display())
    }

    /// Resolve a path as a directory, using the "main" key from a
    /// package.json file if it exists, or resolving to the
    /// index.EXT file if it exists.
    fn resolve_as_directory(&self, path: &Path) -> Result<PathBuf, Error> {
        // 1. If X/package.json is a file, use it.
        let pkg_path = path.join("package.json");
        if pkg_path.is_file() {
            let main = self.resolve_package_main(&pkg_path);
            if main.is_ok() {
                return main;
            }
        }

        // 2. LOAD_INDEX(X)
        self.resolve_index(path)
    }

    /// Resolve using the package.json "main" key.
    fn resolve_package_main(&self, _: &Path) -> Result<PathBuf, Error> {
        bail!("package.json is not supported")
    }

    /// Resolve a directory to its index.EXT.
    fn resolve_index(&self, path: &Path) -> Result<PathBuf, Error> {
        // 1. If X/index.js is a file, load X/index.js as JavaScript text.
        // 2. If X/index.json is a file, parse X/index.json to a JavaScript object.
        // 3. If X/index.node is a file, load X/index.node as binary addon.
        for ext in EXTENSIONS {
            let ext_path = path.join(format!("index.{}", ext));
            if ext_path.is_file() {
                return Ok(ext_path);
            }
        }

        bail!("index not found: {}", path.display())
    }

    /// Resolve by walking up node_modules folders.
    fn resolve_node_modules(&self, base_dir: &Path, target: &str) -> Result<PathBuf, Error> {
        let node_modules = base_dir.join("node_modules");
        if node_modules.is_dir() {
            let path = node_modules.join(target);
            let result = self
                .resolve_as_file(&path)
                .or_else(|_| self.resolve_as_directory(&path));
            if result.is_ok() {
                return result;
            }
        }

        match base_dir.parent() {
            Some(parent) => self.resolve_node_modules(parent, target),
            None => bail!("not found"),
        }
    }

    fn resolve_inner(&self, base: &FileName, target: &str) -> Result<FileName, Error> {
        if let Ok(v) = Url::parse(target) {
            return Ok(FileName::Custom(v.to_string()));
        }

        let base = match base {
            FileName::Real(v) => v,
            FileName::Custom(base_url) => {
                let base_url = Url::parse(base_url).context("failed to parse url")?;

                let options = Url::options();
                let base_url = options.base_url(Some(&base_url));
                let url = base_url
                    .parse(target)
                    .with_context(|| format!("failed to resolve `{}`", target))?;

                return Ok(FileName::Custom(url.to_string()));
            }
            _ => bail!("node-resolver supports only files"),
        };

        // Absolute path
        if target.starts_with('/') {
            let base_dir = &Path::new("/");

            let path = base_dir.join(target);
            return self
                .resolve_as_file(&path)
                .or_else(|_| self.resolve_as_directory(&path))
                .and_then(|p| self.wrap(p));
        }

        let cwd = &Path::new(".");
        let mut base_dir = base.parent().unwrap_or(cwd);

        if target.starts_with("./") || target.starts_with("../") {
            let win_target;
            let target = if cfg!(target_os = "windows") {
                let t = if let Some(s) = target.strip_prefix("./") {
                    s
                } else {
                    base_dir = base_dir.parent().unwrap();
                    &target[3..]
                };
                win_target = t.replace('/', "\\");
                &*win_target
            } else {
                target
            };

            let path = base_dir.join(target);
            return self
                .resolve_as_file(&path)
                .or_else(|_| self.resolve_as_directory(&path))
                .and_then(|p| self.wrap(p));
        }

        self.resolve_node_modules(base_dir, target)
            .and_then(|p| self.wrap(p))
    }
}

impl Resolve for NodeResolver {
    fn resolve(&self, base: &FileName, module_specifier: &str) -> Result<Resolution, Error> {
        self.resolve_inner(base, module_specifier)
            .map(|filename| Resolution {
                filename,
                slug: None,
            })
    }
}
