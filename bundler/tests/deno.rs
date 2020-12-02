//! In-tree testing for deno integration.
//!
//! This module exists because this is way easier than using copying requires
//! files.

use self::common::*;
use anyhow::Error;
use std::{
    collections::{HashMap, HashSet},
    env,
    fs::write,
    process::{Command, Stdio},
};
use swc_atoms::js_word;
use swc_bundler::{Bundler, Load, ModuleRecord};
use swc_common::{FileName, Span, GLOBALS};
use swc_ecma_ast::*;
use swc_ecma_codegen::{text_writer::JsWriter, Emitter};
use swc_ecma_utils::{find_ids, Id};
use swc_ecma_visit::{Node, Visit, VisitWith};
use testing::assert_eq;

#[path = "common/mod.rs"]
mod common;

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
fn deno_8188_full() {
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
fn deno_8188_01() {
    run(
        "https://raw.githubusercontent.com/nats-io/nats.deno/v1.0.0-12/nats-base-client/nkeys.ts",
        &["nkeys"],
    );
}

#[test]
fn deno_8188_02() {
    run(
        "https://raw.githubusercontent.com/nats-io/nkeys.js/v1.0.0-7/modules/esm/mod.ts",
        &[
            "NKeysError",
            "NKeysErrorCode",
            "createAccount",
            "createOperator",
            "createPair",
            "createUser",
            "decode",
            "encode",
            "fromPublic",
            "fromSeed",
        ],
    );
}

#[test]
fn deno_8188_03() {
    run(
        "https://raw.githubusercontent.com/nats-io/nkeys.js/v1.0.0-7/modules/esm/deps.ts",
        &["denoHelper"],
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

/// https://github.com/denoland/deno/issues/8211#issuecomment-736498065
#[test]
fn deno_8211_1() {
    run("tests/deno/deno-8211-1/input/entry.ts", &[]);
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

#[test]
fn deno_8314_1() {
    run("tests/deno/issue-8314/input.ts", &[]);
}

#[test]
fn deno_8314_2() {
    run("https://dev.jspm.io/ngraph.graph", &["default"]);
}

#[test]
fn deno_8302() {
    run("tests/deno/issue-8302/input.ts", &["DB", "Empty", "Status"]);
}

#[test]
fn deno_8399_1() {
    run("tests/deno/issue-8399-1/input.ts", &[]);
}

#[test]
fn deno_8399_2() {
    run("tests/deno/issue-8399-2/input.ts", &[]);
}

#[test]
fn deno_8486_1() {
    run("tests/deno/issue-8486-1/input.ts", &["myCLI"]);
}

#[test]
fn deno_7288_1() {
    run("tests/deno/deno-7288-1/input.ts", &[]);
}

#[test]
fn deno_8481_1() {
    run(
        "https://raw.githubusercontent.com/nats-io/nats.ws/master/src/mod.ts",
        &[
            "Bench",
            "Connect",
            "DataBuffer",
            "DebugEvents",
            "DenoBuffer",
            "Empty",
            "ErrorCode",
            "Events",
            "Heartbeat",
            "INFO",
            "JSONCodec",
            "Kind",
            "MAX_SIZE",
            "Metric",
            "MsgHdrsImpl",
            "MsgImpl",
            "MuxSubscription",
            "NatsConnectionImpl",
            "NatsError",
            "Nuid",
            "Parser",
            "ProtocolHandler",
            "QueuedIterator",
            "Request",
            "State",
            "StringCodec",
            "SubscriptionImpl",
            "Subscriptions",
            "TD",
            "TE",
            "checkOptions",
            "connect",
            "createInbox",
            "credsAuthenticator",
            "deferred",
            "delay",
            "extractProtocolMessage",
            "headers",
            "isIP",
            "jwtAuthenticator",
            "nkeyAuthenticator",
            "nkeys",
            "nuid",
            "parseIP",
            "readAll",
            "render",
            "setTransportFactory",
            "setUrlParseFn",
            "timeout",
            "writeAll",
        ],
    )
}

#[test]
fn deno_8530() {
    run("tests/deno/deno-8530/input/entry.ts", &[])
}

#[test]
#[ignore]
fn deno_8545() {
    run("tests/deno/deno-8545/input/entry.ts", &[])
}

#[test]
fn merging_order_01() {
    run(
        "https://deno.land/x/oak@v6.3.1/multipart.ts",
        &["FormDataReader"],
    );
}

#[test]
fn reexport_01() {
    run(
        "https://raw.githubusercontent.com/aricart/tweetnacl-deno/import-type-fixes/src/nacl.ts",
        &[
            "AuthLength",
            "ByteArray",
            "HalfArray",
            "HashLength",
            "IntArray",
            "NumArray",
            "SealedBoxLength",
            "SignLength",
            "WordArray",
            "_hash",
            "_verify_16",
            "_verify_32",
            "auth",
            "auth_full",
            "blake2b",
            "blake2b_final",
            "blake2b_init",
            "blake2b_update",
            "blake2s",
            "blake2s_final",
            "blake2s_init",
            "blake2s_update",
            "decodeBase64",
            "decodeHex",
            "decodeUTF8",
            "encodeBase64",
            "encodeHex",
            "encodeUTF8",
            "hash",
            "randomBytes",
            "scalarbase",
            "scalarmult",
            "sealedbox",
            "sealedbox_open",
            "sign",
            "sign_detached",
            "sign_detached_verify",
            "sign_keyPair",
            "sign_keyPair_fromSecretKey",
            "sign_keyPair_fromSeed",
            "sign_open",
            "validateBase64",
            "validateHex",
            "verify",
        ],
    );
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
                NodeResolver,
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
            ExportSpecifier::Default(_) => {
                self.exports.insert("default".into());
            }
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

    fn visit_export_default_decl(&mut self, _: &ExportDefaultDecl, _: &dyn Node) {
        self.exports.insert("default".into());
    }

    fn visit_export_default_expr(&mut self, _: &ExportDefaultExpr, _: &dyn Node) {
        self.exports.insert("default".into());
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
