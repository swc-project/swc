use anyhow::{bail, Context, Error};
use reqwest::Url;
use sha1::{Digest, Sha1};
use std::io::Write;
use std::{
    self, env,
    fs::{create_dir_all, read_to_string, write},
    path::{Path, PathBuf},
};
use swc_bundler::{Load, ModuleData, Resolve};
use swc_common::errors::ColorConfig;
use swc_common::errors::Handler;
use swc_common::{comments::SingleThreadedComments, sync::Lrc, FileName, SourceMap};
use swc_ecma_parser::{lexer::Lexer, JscTarget, Parser, StringInput, Syntax, TsConfig};
use swc_ecma_transforms::{react, typescript::strip};
use swc_ecma_visit::FoldWith;
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
    let hash = calc_hash(&url.to_string());
    let s = url.to_string();
    if s.starts_with("https://deno.land/") {
        return cache_dir.join("deno").join(&hash);
    }

    cache_dir.join("untrusted").join(hash)
}

/// Load url. This method does caching.
fn load_url(url: Url) -> Result<String, Error> {
    let cache_dir = PathBuf::from(
        env::var("CARGO_MANIFEST_DIR")
            .expect("the test requires an environment variable named `CARGO_MANIFEST_DIR`"),
    )
    .join("tests")
    .join(".cache");

    let cache_path = calc_cache_path(&cache_dir, &url).with_extension("ts");

    create_dir_all(cache_path.parent().unwrap()).context("failed to create cache dir")?;

    match read_to_string(&cache_path) {
        Ok(v) => return Ok(v),
        _ => {}
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

    let mut content = vec![];
    write!(content, "// Loaded from {}\n\n\n", url).unwrap();
    content.extend_from_slice(&bytes);

    write(&cache_path, &content)?;

    return Ok(String::from_utf8_lossy(&bytes).to_string());
}

impl Load for Loader {
    fn load(&self, f: &FileName) -> Result<ModuleData, Error> {
        eprintln!("load: {}", f);

        let tsx;
        let fm = match f {
            FileName::Real(path) => {
                tsx = path.to_string_lossy().ends_with(".tsx");
                self.cm.load_file(&path)?
            }
            FileName::Custom(url) => {
                tsx = url.ends_with(".tsx");
                // Hack for jszip, which depends on invalid url.
                let url = url.replace("https://deno.land/std@v", "https://deno.land/std@");

                let url = Url::parse(&url).context("failed to parse url")?;

                let src = load_url(url.clone())?;

                self.cm
                    .new_source_file(FileName::Custom(url.to_string()), src.to_string())
            }
            _ => unreachable!(),
        };

        let lexer = Lexer::new(
            Syntax::Typescript(TsConfig {
                decorators: true,
                tsx,
                dynamic_import: true,
                ..Default::default()
            }),
            JscTarget::Es2020,
            StringInput::from(&*fm),
            None,
        );

        let mut parser = Parser::new_from(lexer);
        let module = parser.parse_module().unwrap_or_else(|err| {
            let handler =
                Handler::with_tty_emitter(ColorConfig::Always, false, false, Some(self.cm.clone()));
            err.into_diagnostic(&handler).emit();
            panic!("failed to parse")
        });
        let module = module
            .fold_with(&mut strip())
            .fold_with(&mut react::react::<SingleThreadedComments>(
                self.cm.clone(),
                None,
                Default::default(),
            ));

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
        Ok(FileName::Real(
            path.canonicalize().context("failaed to canonicalize")?,
        ))
    }

    /// Resolve a path as a file. If `path` refers to a file, it is
    /// returned; otherwise the `path` + each extension is tried.
    fn resolve_as_file(&self, path: &Path) -> Result<PathBuf, Error> {
        // 1. If X is a file, load X as JavaScript text.
        if path.is_file() {
            return Ok(path.to_path_buf());
        }

        for ext in EXTENSIONS {
            let ext_path = path.with_extension(ext);
            if ext_path.is_file() {
                return Ok(ext_path);
            }
        }

        bail!("file not found: {}", path.display())
    }

    /// Resolve a path as a directory, using the "main" key from a
    /// package.json file if it exists, or resolving to the
    /// index.EXT file if it exists.
    fn resolve_as_directory(&self, path: &PathBuf) -> Result<PathBuf, Error> {
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
    fn resolve_package_main(&self, _: &PathBuf) -> Result<PathBuf, Error> {
        bail!("package.json is not supported")
    }

    /// Resolve a directory to its index.EXT.
    fn resolve_index(&self, path: &PathBuf) -> Result<PathBuf, Error> {
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
}

impl Resolve for NodeResolver {
    fn resolve(&self, base: &FileName, target: &str) -> Result<FileName, Error> {
        match Url::parse(target) {
            Ok(v) => return Ok(FileName::Custom(v.to_string())),
            Err(_) => {}
        }

        let base = match base {
            FileName::Real(v) => v,
            FileName::Custom(base_url) => {
                let base_url = Url::parse(&base_url).context("failed to parse url")?;

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
        if target.starts_with("/") {
            let base_dir = &Path::new("/");

            let path = base_dir.join(target);
            return self
                .resolve_as_file(&path)
                .or_else(|_| self.resolve_as_directory(&path))
                .and_then(|p| self.wrap(p));
        }

        let cwd = &Path::new(".");
        let mut base_dir = base.parent().unwrap_or(&cwd);

        if target.starts_with("./") || target.starts_with("../") {
            let win_target;
            let target = if cfg!(target_os = "windows") {
                let t = if target.starts_with("./") {
                    &target[2..]
                } else {
                    base_dir = base_dir.parent().unwrap();
                    &target[3..]
                };
                win_target = t.replace("/", "\\");
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
