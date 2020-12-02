#![feature(test)]

extern crate test;

use anyhow::{bail, Context, Error};
use reqwest::Url;
use sha1::{Digest, Sha1};
use std::{
    self,
    collections::HashMap,
    env,
    fs::{create_dir_all, read_dir, read_to_string, write},
    io,
    path::{Path, PathBuf},
};
use swc_atoms::js_word;
use swc_bundler::{BundleKind, Bundler, Config, Load, ModuleData, ModuleRecord, Resolve};
use swc_common::{sync::Lrc, FileName, Globals, SourceMap, Span};
use swc_ecma_ast::{
    Bool, Expr, ExprOrSuper, Ident, KeyValueProp, Lit, MemberExpr, MetaPropExpr, PropName, Str,
};
use swc_ecma_codegen::{text_writer::JsWriter, Emitter};
use swc_ecma_parser::{lexer::Lexer, JscTarget, Parser, StringInput, Syntax, TsConfig};
use swc_ecma_transforms::{fixer, typescript::strip};
use swc_ecma_visit::FoldWith;
use test::{
    test_main, DynTestFn, Options, ShouldPanic::No, TestDesc, TestDescAndFn, TestName, TestType,
};
use testing::NormalizedOutput;
use walkdir::WalkDir;

fn add_test<F: FnOnce() + Send + 'static>(
    tests: &mut Vec<TestDescAndFn>,
    name: String,
    ignore: bool,
    f: F,
) {
    tests.push(TestDescAndFn {
        desc: TestDesc {
            test_type: TestType::UnitTest,
            name: TestName::DynTestName(name.replace("-", "_").replace("/", "::")),
            ignore,
            should_panic: No,
            allow_fail: false,
        },
        testfn: DynTestFn(Box::new(f)),
    });
}

fn reference_tests(tests: &mut Vec<TestDescAndFn>, errors: bool) -> Result<(), io::Error> {
    let root = {
        let mut root = Path::new(env!("CARGO_MANIFEST_DIR")).to_path_buf();
        root.push("tests");
        root.push(if errors { "error" } else { "fixture" });
        root
    };

    eprintln!("Loading tests from {}", root.display());

    let dir = root;

    for entry in WalkDir::new(&dir).into_iter() {
        let entry = entry?;
        if !entry.path().join("input").exists() {
            continue;
        }

        let ignore = entry
            .path()
            .file_name()
            .unwrap()
            .to_string_lossy()
            .starts_with(".");

        let dir_name = entry
            .path()
            .strip_prefix(&dir)
            .expect("failed to strip prefix")
            .to_str()
            .unwrap()
            .to_string();

        let _ = create_dir_all(entry.path().join("output"));

        let entries = read_dir(entry.path().join("input"))?
            .filter(|e| match e {
                Ok(e) => {
                    if e.path()
                        .file_name()
                        .unwrap()
                        .to_string_lossy()
                        .starts_with("entry")
                    {
                        true
                    } else {
                        false
                    }
                }
                _ => false,
            })
            .map(|e| -> Result<_, io::Error> {
                let e = e?;
                Ok((
                    e.file_name().to_string_lossy().to_string(),
                    FileName::Real(e.path()),
                ))
            })
            .collect::<Result<HashMap<_, _>, _>>()?;

        let name = format!(
            "fixture::{}::{}",
            if errors { "error" } else { "pass" },
            dir_name
        );

        let ignore = ignore
            || !name.contains(
                &env::var("TEST")
                    .ok()
                    .unwrap_or("".into())
                    .replace("::", "/")
                    .replace("_", "-"),
            );

        add_test(tests, name, ignore, move || {
            eprintln!("\n\n========== Running reference test {}\n", dir_name);

            testing::run_test2(false, |cm, _| {
                let globals = Globals::default();
                let bundler = Bundler::new(
                    &globals,
                    cm.clone(),
                    Loader { cm: cm.clone() },
                    NodeResolver::new(),
                    Config {
                        require: true,
                        disable_inliner: true,
                        external_modules: vec![
                            "assert",
                            "buffer",
                            "child_process",
                            "console",
                            "cluster",
                            "crypto",
                            "dgram",
                            "dns",
                            "events",
                            "fs",
                            "http",
                            "http2",
                            "https",
                            "net",
                            "os",
                            "path",
                            "perf_hooks",
                            "process",
                            "querystring",
                            "readline",
                            "repl",
                            "stream",
                            "string_decoder",
                            "timers",
                            "tls",
                            "tty",
                            "url",
                            "util",
                            "v8",
                            "vm",
                            "wasi",
                            "worker",
                            "zlib",
                        ]
                        .into_iter()
                        .map(From::from)
                        .collect(),
                        module: Default::default(),
                    },
                    Box::new(Hook),
                );

                let modules = bundler
                    .bundle(entries)
                    .map_err(|err| println!("{:?}", err))?;
                println!("Bundled as {} modules", modules.len());

                let mut error = false;

                for bundled in modules {
                    let code = {
                        let mut buf = vec![];

                        {
                            let mut emitter = Emitter {
                                cfg: swc_ecma_codegen::Config {
                                    ..Default::default()
                                },
                                cm: cm.clone(),
                                comments: None,
                                wr: Box::new(JsWriter::new(cm.clone(), "\n", &mut buf, None)),
                            };

                            emitter
                                .emit_module(&bundled.module.fold_with(&mut fixer(None)))
                                .unwrap();
                        }

                        String::from_utf8_lossy(&buf).to_string()
                    };

                    let name = match bundled.kind {
                        BundleKind::Named { name } | BundleKind::Lib { name } => {
                            PathBuf::from(name)
                        }
                        BundleKind::Dynamic => format!("dynamic.{}.js", bundled.id).into(),
                    };

                    let output_path = entry.path().join("output").join(name.file_name().unwrap());

                    println!("Printing {}", output_path.display());

                    let s = NormalizedOutput::from(code.to_string());

                    match s.compare_to_file(&output_path) {
                        Ok(_) => {}
                        Err(err) => {
                            println!("Diff: {:?}", err);
                            error = true;
                        }
                    }
                }

                if error {
                    return Err(());
                }

                Ok(())
            })
            .expect("failed to process a module");
        });
    }

    Ok(())
}

#[test]
fn pass() {
    let args: Vec<_> = env::args().collect();
    let mut tests = Vec::new();
    reference_tests(&mut tests, false).unwrap();
    test_main(&args, tests, Some(Options::new()));
}

struct Hook;

impl swc_bundler::Hook for Hook {
    fn get_import_meta_props(
        &self,
        span: Span,
        module_record: &ModuleRecord,
    ) -> Result<Vec<KeyValueProp>, Error> {
        Ok(vec![
            KeyValueProp {
                key: PropName::Ident(Ident::new(js_word!("url"), span)),
                value: Box::new(Expr::Lit(Lit::Str(Str {
                    span,
                    value: module_record.file_name.to_string().into(),
                    has_escape: false,
                }))),
            },
            KeyValueProp {
                key: PropName::Ident(Ident::new(js_word!("main"), span)),
                value: Box::new(if module_record.is_entry {
                    Expr::Member(MemberExpr {
                        span,
                        obj: ExprOrSuper::Expr(Box::new(Expr::MetaProp(MetaPropExpr {
                            meta: Ident::new(js_word!("import"), span),
                            prop: Ident::new(js_word!("meta"), span),
                        }))),
                        prop: Box::new(Expr::Ident(Ident::new(js_word!("main"), span))),
                        computed: false,
                    })
                } else {
                    Expr::Lit(Lit::Bool(Bool { span, value: false }))
                }),
            },
        ])
    }
}

pub struct Loader {
    cm: Lrc<SourceMap>,
}

fn calc_hash(s: &str) -> String {
    let mut hasher = Sha1::new();
    hasher.update(s.as_bytes());
    let sum = hasher.finalize();

    hex::encode(sum)
}

/// Load url. This method does caching.
fn load_url(url: Url) -> Result<String, Error> {
    let cache_dir = PathBuf::from(env!("OUT_DIR")).join("deno-cache");
    create_dir_all(&cache_dir).context("failed to create cache dir")?;

    let hash = calc_hash(&url.to_string());

    let cache_path = cache_dir.join(&hash);

    match read_to_string(&cache_path) {
        Ok(v) => return Ok(v),
        _ => {}
    }

    let resp = reqwest::blocking::get(url.clone())
        .with_context(|| format!("failed to fetch `{}`", url))?;

    let bytes = resp
        .bytes()
        .with_context(|| format!("failed to read data from `{}`", url))?;

    write(&cache_path, &bytes)?;

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
                ..Default::default()
            }),
            JscTarget::Es2020,
            StringInput::from(&*fm),
            None,
        );

        let mut parser = Parser::new_from(lexer);
        let module = parser.parse_module().unwrap();

        let module = module.fold_with(&mut strip());

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
    pub fn new() -> Self {
        Self
    }

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
        let base_dir = base.parent().unwrap_or(&cwd);

        if target.starts_with("./") || target.starts_with("../") {
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
