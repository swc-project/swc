/// Use memory allocator
extern crate swc_node_base;

use anyhow::{bail, Error};
use path_clean::PathClean;
use std::{
    collections::HashMap,
    env, fs,
    path::{Path, PathBuf},
    time::{Duration, Instant},
};
use swc_atoms::js_word;
use swc_bundler::{Bundle, Bundler, Load, ModuleData, ModuleRecord, Resolve};
use swc_common::{
    errors::{ColorConfig, Handler},
    sync::Lrc,
    FileName, Globals, Mark, SourceMap, Span, GLOBALS,
};
use swc_ecma_ast::*;
use swc_ecma_codegen::{
    text_writer::{omit_trailing_semi, JsWriter, WriteJs},
    Emitter,
};
use swc_ecma_loader::{
    resolvers::{lru::CachingResolver, node::NodeModulesResolver},
    TargetEnv,
};
use swc_ecma_minifier::option::{
    CompressOptions, ExtraOptions, MangleOptions, MinifyOptions, TopLevelOptions,
};
use swc_ecma_parser::{lexer::Lexer, EsConfig, Parser, StringInput, Syntax};
use swc_ecma_transforms_base::fixer::fixer;
use swc_ecma_visit::VisitMutWith;

fn print_bundles(cm: Lrc<SourceMap>, modules: Vec<Bundle>, minify: bool) {
    for bundled in modules {
        let code = {
            let mut buf = vec![];

            {
                let wr = JsWriter::new(cm.clone(), "\n", &mut buf, None);
                let mut emitter = Emitter {
                    cfg: swc_ecma_codegen::Config {
                        minify,
                        ..Default::default()
                    },
                    cm: cm.clone(),
                    comments: None,
                    wr: if minify {
                        Box::new(omit_trailing_semi(wr)) as Box<dyn WriteJs>
                    } else {
                        Box::new(wr) as Box<dyn WriteJs>
                    },
                };

                emitter.emit_module(&bundled.module).unwrap();
            }

            String::from_utf8_lossy(&buf).to_string()
        };

        #[cfg(feature = "concurrent")]
        rayon::spawn(move || drop(bundled));

        println!("Created output.js ({}kb)", code.len() / 1024);
        fs::write("output.js", &code).unwrap();
    }
}

fn do_test(_entry: &Path, entries: HashMap<String, FileName>, inline: bool, minify: bool) {
    testing::run_test2(false, |cm, _| {
        let start = Instant::now();

        let globals = Box::leak(Box::new(Globals::default()));
        let mut bundler = Bundler::new(
            globals,
            cm.clone(),
            Loader { cm: cm.clone() },
            CachingResolver::new(
                4096,
                NodeModulesResolver::new(TargetEnv::Node, Default::default()),
            ),
            swc_bundler::Config {
                require: false,
                disable_inliner: !inline,
                external_modules: Default::default(),
                disable_fixer: minify,
                disable_hygiene: minify,
                disable_dce: false,
                module: Default::default(),
            },
            Box::new(Hook),
        );

        let mut modules = bundler
            .bundle(entries)
            .map_err(|err| println!("{:?}", err))?;
        println!("Bundled as {} modules", modules.len());

        #[cfg(feature = "concurrent")]
        rayon::spawn(move || {
            drop(bundler);
        });

        {
            let dur = start.elapsed();
            println!("Bundler.bundle() took {}", to_ms(dur));
        }

        let error = false;
        if minify {
            let start = Instant::now();

            modules = modules
                .into_iter()
                .map(|mut b| {
                    GLOBALS.set(&globals, || {
                        b.module = swc_ecma_minifier::optimize(
                            b.module,
                            cm.clone(),
                            None,
                            None,
                            &MinifyOptions {
                                compress: Some(CompressOptions {
                                    top_level: Some(TopLevelOptions { functions: true }),
                                    ..Default::default()
                                }),
                                mangle: Some(MangleOptions {
                                    top_level: true,
                                    ..Default::default()
                                }),
                                ..Default::default()
                            },
                            &ExtraOptions {
                                top_level_mark: Mark::fresh(Mark::root()),
                            },
                        );
                        b.module.visit_mut_with(&mut fixer(None));
                        b
                    })
                })
                .collect();

            let dur = start.elapsed();
            println!("Minification took {}", to_ms(dur));
        }

        {
            let cm = cm.clone();
            print_bundles(cm, modules, minify);
        }

        if error {
            return Err(());
        }

        Ok(())
    })
    .expect("failed to process a module");
}

fn to_ms(dur: Duration) -> String {
    format!("{}ms", dur.as_millis())
}

fn main() -> Result<(), Error> {
    let minify = env::var("MINIFY").unwrap_or_else(|_| "0".to_string()) == "1";

    let main_file = env::args().nth(1).unwrap();
    let mut entries = HashMap::default();
    entries.insert("main".to_string(), FileName::Real(main_file.clone().into()));

    let start = Instant::now();
    do_test(Path::new(&main_file), entries, false, minify);
    let dur = start.elapsed();
    println!("Took {}", to_ms(dur));

    Ok(())
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
                    kind: Default::default(),
                }))),
            },
            KeyValueProp {
                key: PropName::Ident(Ident::new(js_word!("main"), span)),
                value: Box::new(if module_record.is_entry {
                    Expr::Member(MemberExpr {
                        span,
                        obj: Box::new(Expr::MetaProp(MetaPropExpr {
                            span,
                            kind: MetaPropKind::ImportMeta,
                        })),
                        prop: MemberProp::Ident(Ident::new(js_word!("main"), span)),
                    })
                } else {
                    Expr::Lit(Lit::Bool(Bool { span, value: false }))
                }),
            },
        ])
    }
}

pub struct Loader {
    pub cm: Lrc<SourceMap>,
}

impl Load for Loader {
    fn load(&self, f: &FileName) -> Result<ModuleData, Error> {
        let fm = match f {
            FileName::Real(path) => self.cm.load_file(&path)?,
            _ => unreachable!(),
        };

        let lexer = Lexer::new(
            Syntax::Es(EsConfig {
                ..Default::default()
            }),
            EsVersion::Es2020,
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
        let base = match base {
            FileName::Real(v) => v,
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
