//! In-tree testing for deno integration.
//!
//! This module exists because this is way easier than using copying requires
//! files.
use anyhow::{Context, Error};
use sha1::{Digest, Sha1};
use std::{
    collections::{HashMap, HashSet},
    env,
    fs::{create_dir_all, read_to_string, write},
    path::PathBuf,
    process::{Command, Stdio},
};
use swc_atoms::js_word;
use swc_bundler::{Bundler, Load, ModuleData, ModuleRecord, Resolve};
use swc_common::{comments::SingleThreadedComments, sync::Lrc, FileName, SourceMap, Span, GLOBALS};
use swc_ecma_ast::{
    Bool, ClassDecl, ExportDecl, ExportSpecifier, Expr, ExprOrSuper, FnDecl, Ident, KeyValueProp,
    Lit, MemberExpr, MetaPropExpr, Module, PropName, Str,
};
use swc_ecma_codegen::{text_writer::JsWriter, Emitter};
use swc_ecma_parser::{lexer::Lexer, JscTarget, Parser, StringInput, Syntax, TsConfig};
use swc_ecma_transforms::{proposals::decorators, react, typescript::strip};
use swc_ecma_utils::{find_ids, Id};
use swc_ecma_visit::{FoldWith, Node, Visit, VisitWith};
use testing::assert_eq;
use url::Url;

#[test]
fn oak_6_3_1_application() {
    run(
        "https://deno.land/x/oak@v6.3.1/application.ts",
        &[
            "ApplicationErrorEvent",
            "ApplicationListenEvent",
            "Application",
        ],
    );
}

#[test]
fn oak_6_3_1_mod() {
    run(
        "https://deno.land/x/oak@v6.3.1/mod.ts",
        &[
            "Application",
            "Context",
            "helpers",
            "Cookies",
            "HttpError",
            "httpErrors",
            "isHttpError",
            "composeMiddleware",
            "FormDataReader",
            "Request",
            "REDIRECT_BACK",
            "Response",
            "Router",
            "send",
            "ServerSentEvent",
            "ServerSentEventTarget",
            "isErrorStatus",
            "isRedirectStatus",
            "Status",
            "STATUS_TEXT",
        ],
    );
}

#[test]
fn std_0_74_0_http_server() {
    run(
        "https://deno.land/std@0.74.0/http/server.ts",
        &[
            "ServerRequest",
            "Server",
            "_parseAddrFromStr",
            "serve",
            "listenAndServe",
            "serveTLS",
            "listenAndServeTLS",
        ],
    );
}

#[test]
#[ignore = "Does not finish by default"]
fn oak_6_3_1_example_server() {
    run("https://deno.land/x/oak@v6.3.1/examples/server.ts", &[]);
}

#[test]
#[ignore = "Does not finish by default"]
fn oak_6_3_1_example_sse_server() {
    run("https://deno.land/x/oak@v6.3.1/examples/sseServer.ts", &[]);
}

#[test]
fn deno_8188() {
    run(
        "https://raw.githubusercontent.com/nats-io/nats.ws/master/src/mod.ts",
        &[
            "connect",
            "NatsConnectionImpl",
            "Nuid",
            "nuid",
            "ErrorCode",
            "NatsError",
            "DebugEvents",
            "Empty",
            "Events",
            "MsgImpl",
            "SubscriptionImpl",
            "Subscriptions",
            "setTransportFactory",
            "setUrlParseFn",
            "Connect",
            "createInbox",
            "INFO",
            "ProtocolHandler",
            "deferred",
            "delay",
            "extractProtocolMessage",
            "render",
            "timeout",
            "headers",
            "MsgHdrsImpl",
            "Heartbeat",
            "MuxSubscription",
            "DataBuffer",
            "checkOptions",
            "Request",
            "credsAuthenticator",
            "jwtAuthenticator",
            "nkeyAuthenticator",
            "JSONCodec",
            "StringCodec",
            "QueuedIterator",
            "Kind",
            "Parser",
            "State",
            "DenoBuffer",
            "MAX_SIZE",
            "readAll",
            "writeAll",
            "Bench",
            "Metric",
            "TD",
            "TE",
            "isIP",
            "parseIP",
            "nkeys",
        ],
    );
}

#[test]
fn deno_8189() {
    run(
        "https://deno.land/x/lz4/mod.ts",
        &["compress", "decompress"],
    );
}

#[test]
fn deno_8211() {
    run(
        "https://unpkg.com/luxon@1.25.0/src/luxon.js",
        &[
            "DateTime",
            "Duration",
            "Interval",
            "Info",
            "Zone",
            "FixedOffsetZone",
            "IANAZone",
            "InvalidZone",
            "LocalZone",
            "Settings",
        ],
    );
}

#[test]
fn deno_8246() {
    run("https://raw.githubusercontent.com/nats-io/nats.deno/v1.0.0-11/nats-base-client/internal_mod.ts",&[
        "NatsConnectionImpl",
        "Nuid",
        "nuid",
        "ErrorCode",
        "NatsError",
        "DebugEvents",
        "Empty",
        "Events",
        "MsgImpl",
        "SubscriptionImpl",
        "Subscriptions",
        "setTransportFactory",
        "setUrlParseFn",
        "Connect",
        "createInbox",
        "INFO",
        "ProtocolHandler",
        "deferred",
        "delay",
        "extractProtocolMessage",
        "render",
        "timeout",
        "headers",
        "MsgHdrsImpl",
        "Heartbeat",
        "MuxSubscription",
        "DataBuffer",
        "checkOptions",
        "Request",
        "credsAuthenticator",
        "jwtAuthenticator",
        "nkeyAuthenticator",
        "JSONCodec",
        "StringCodec",
        "QueuedIterator",
        "Kind",
        "Parser",
        "State",
        "DenoBuffer",
        "MAX_SIZE",
        "readAll",
        "writeAll",
        "Bench",
        "Metric",
        "TD",
        "TE",
        "isIP",
        "parseIP",
        "nkeys",
    ]);
}

#[test]
#[ignore = "document is not defined when I use deno run"]
fn deno_6802() {
    run("tests/deno/issue-6802/input.tsx", &[]);
}

fn run(url: &str, exports: &[&str]) {
    let dir = tempfile::tempdir().expect("failed to crate temp file");
    let path = dir.path().join("main.js");
    println!("{}", path.display());

    let src = bundle(url);
    write(&path, &src).unwrap();

    ::testing::run_test2(false, |cm, _| {
        let fm = cm.load_file(&path).unwrap();
        let loader = Loader { cm: cm.clone() };
        let module = loader.load(&fm.name).unwrap().module;

        let mut actual_exports = collect_exports(&module).into_iter().collect::<Vec<_>>();
        actual_exports.sort();
        let mut expected_exports = exports
            .into_iter()
            .map(|s| s.to_string())
            .collect::<Vec<_>>();
        expected_exports.sort();

        assert_eq!(expected_exports, actual_exports);

        Ok(())
    })
    .unwrap();

    if env::var("CI").is_ok() {
        return;
    }

    let output = Command::new("deno")
        .arg("run")
        .arg("--allow-all")
        .arg("--no-check")
        .arg(&path)
        .stdout(Stdio::inherit())
        .stderr(Stdio::inherit())
        .status()
        .unwrap();

    std::mem::forget(dir);

    dbg!(output);
    assert!(output.success());
}

fn bundle(url: &str) -> String {
    let result = testing::run_test2(false, |cm, _handler| {
        GLOBALS.with(|globals| {
            let bundler = Bundler::new(
                globals,
                cm.clone(),
                Loader { cm: cm.clone() },
                Resolver,
                swc_bundler::Config {
                    require: false,
                    disable_inliner: false,
                    ..Default::default()
                },
                Box::new(Hook),
            );
            let mut entries = HashMap::new();
            entries.insert(
                "main".to_string(),
                if url.starts_with("http") {
                    FileName::Custom(url.to_string())
                } else {
                    FileName::Real(url.to_string().into())
                },
            );
            let output = bundler.bundle(entries).unwrap();
            let module = output.into_iter().next().unwrap().module;

            let mut buf = vec![];
            {
                Emitter {
                    cfg: swc_ecma_codegen::Config { minify: false },
                    cm: cm.clone(),
                    comments: None,
                    wr: Box::new(JsWriter::new(cm.clone(), "\n", &mut buf, None)),
                }
                .emit_module(&module)
                .unwrap();
            }

            Ok(String::from_utf8_lossy(&buf).to_string())
        })
    })
    .unwrap();

    result
}

#[derive(Clone)]
struct Loader {
    cm: Lrc<SourceMap>,
}

fn cacl_hash(s: &str) -> String {
    let mut hasher = Sha1::new();
    hasher.update(s.as_bytes());
    let sum = hasher.finalize();

    hex::encode(sum)
}

/// Load url. This method does caching.
fn load_url(url: Url) -> Result<String, Error> {
    let cache_dir = PathBuf::from(env!("OUT_DIR")).join("deno-cache");
    create_dir_all(&cache_dir).context("failed to create cache dir")?;

    let hash = cacl_hash(&url.to_string());

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
    fn load(&self, file: &FileName) -> Result<ModuleData, Error> {
        eprintln!("{}", file);

        let tsx;

        let fm = match file {
            FileName::Real(path) => {
                tsx = path.to_string_lossy().ends_with(".tsx");
                self.cm.load_file(path)?
            }
            FileName::Custom(url) => {
                tsx = url.ends_with(".tsx");

                let url = Url::parse(&url).context("failed to parse url")?;

                let src = load_url(url.clone())?;

                self.cm
                    .new_source_file(FileName::Custom(url.to_string()), src.to_string())
            }
            _ => unreachable!("this test only uses url"),
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
        let module = module
            .fold_with(&mut decorators::decorators(decorators::Config {
                legacy: true,
                emit_metadata: false,
            }))
            .fold_with(&mut react::react::<SingleThreadedComments>(
                self.cm.clone(),
                None,
                Default::default(),
            ))
            .fold_with(&mut strip());

        Ok(ModuleData {
            fm,
            module,
            helpers: Default::default(),
        })
    }
}

#[derive(Debug, Clone, Copy)]
struct Resolver;

impl Resolve for Resolver {
    fn resolve(&self, base: &FileName, module_specifier: &str) -> Result<FileName, Error> {
        match Url::parse(module_specifier) {
            Ok(v) => return Ok(FileName::Custom(v.to_string())),
            Err(_) => {}
        }

        let base_url = match base {
            FileName::Custom(v) => v,
            _ => unreachable!("this test only uses url"),
        };
        let base_url = Url::parse(&base_url).context("failed to parse url")?;

        let options = Url::options();
        let base_url = options.base_url(Some(&base_url));
        let url = base_url
            .parse(module_specifier)
            .with_context(|| format!("failed to resolve `{}`", module_specifier))?;

        return Ok(FileName::Custom(url.to_string()));
    }
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

fn collect_exports(module: &Module) -> HashSet<String> {
    let mut v = ExportCollector::default();
    module.visit_with(module, &mut v);

    v.exports
}

#[derive(Default)]
struct ExportCollector {
    exports: HashSet<String>,
}

impl Visit for ExportCollector {
    fn visit_export_specifier(&mut self, s: &ExportSpecifier, _: &dyn Node) {
        match s {
            ExportSpecifier::Namespace(ns) => {
                self.exports.insert(ns.name.sym.to_string());
            }
            ExportSpecifier::Default(_) => {}
            ExportSpecifier::Named(named) => {
                self.exports.insert(
                    named
                        .exported
                        .as_ref()
                        .unwrap_or(&named.orig)
                        .sym
                        .to_string(),
                );
            }
        }
    }

    fn visit_export_decl(&mut self, export: &ExportDecl, _: &dyn Node) {
        match &export.decl {
            swc_ecma_ast::Decl::Class(ClassDecl { ident, .. })
            | swc_ecma_ast::Decl::Fn(FnDecl { ident, .. }) => {
                self.exports.insert(ident.sym.to_string());
            }
            swc_ecma_ast::Decl::Var(var) => {
                let ids: Vec<Id> = find_ids(var);
                self.exports
                    .extend(ids.into_iter().map(|v| v.0.to_string()));
            }
            _ => {}
        }
    }
}
