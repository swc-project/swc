//! In-tree testing for deno integration.
//!
//! This module exists because this is way easier than using copying requires
//! files.

use self::common::*;
use anyhow::Error;
use ntest::timeout;
use std::path::PathBuf;
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
#[timeout(60000)]
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
#[timeout(60000)]
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
#[timeout(60000)]
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
#[timeout(60000)]
#[ignore = "Does not finish by default"]
fn oak_6_3_1_example_server() {
    run("https://deno.land/x/oak@v6.3.1/examples/server.ts", &[]);
}

#[test]
#[timeout(60000)]
#[ignore = "Does not finish by default"]
fn oak_6_3_1_example_sse_server() {
    run("https://deno.land/x/oak@v6.3.1/examples/sseServer.ts", &[]);
}

#[test]
#[ignore = "Will be fixed by #1264"]
#[timeout(60000)]
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
#[timeout(60000)]
fn deno_8188_01() {
    run(
        "https://raw.githubusercontent.com/nats-io/nats.deno/v1.0.0-12/nats-base-client/nkeys.ts",
        &["nkeys"],
    );
}

#[test]
#[timeout(60000)]
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
#[timeout(60000)]
fn deno_8188_03() {
    run(
        "https://raw.githubusercontent.com/nats-io/nkeys.js/v1.0.0-7/modules/esm/deps.ts",
        &["denoHelper"],
    );
}

#[test]
#[timeout(60000)]
fn deno_8189() {
    run(
        "https://deno.land/x/lz4/mod.ts",
        &["compress", "decompress"],
    );
}

#[test]
#[timeout(60000)]
fn deno_8211_1() {
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
#[timeout(60000)]
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
#[timeout(60000)]
#[ignore = "document is not defined when I use deno run"]
fn deno_6802() {
    run("tests/deno/issue-6802/input.tsx", &[]);
}

#[test]
#[timeout(60000)]
fn deno_8314_1() {
    run("tests/deno/issue-8314/input.ts", &[]);
}

#[test]
#[timeout(60000)]
fn deno_8314_2() {
    run("https://dev.jspm.io/ngraph.graph", &["default"]);
}

#[test]
#[timeout(60000)]
fn deno_8302() {
    run("tests/deno/issue-8302/input.ts", &["DB", "Empty", "Status"]);
}

#[test]
#[timeout(60000)]
fn deno_8399_1() {
    run("tests/deno/issue-8399-1/input.ts", &[]);
}

#[test]
#[timeout(60000)]
fn deno_8399_2() {
    run("tests/deno/issue-8399-2/input.ts", &[]);
}

#[test]
#[timeout(60000)]
fn deno_8486_1() {
    run("tests/deno/issue-8486-1/input.ts", &["myCLI"]);
}

#[test]
#[timeout(60000)]
fn deno_7288_1() {
    run("tests/deno/deno-7288-1/input.ts", &[]);
}

#[test]
#[ignore = "Will be fixed by #1264"]
#[timeout(60000)]
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
#[ignore = "Will be fixed by #1264"]
#[timeout(60000)]
fn deno_8530() {
    run("tests/deno/deno-8530/input/entry.ts", &[])
}

#[test]
#[timeout(60000)]
fn deno_8573() {
    run("tests/deno/deno-8573/entry.ts", &[])
}

#[test]
#[timeout(120000)]
#[ignore = "The generated bundled aceesses `location`"]
fn deno_8597() {
    run(
        "https://cdn.skypack.dev/@tensorflow/tfjs@2.6.0",
        &[
            "Abs",
            "Acos",
            "Acosh",
            "AdadeltaOptimizer",
            "AdagradOptimizer",
            "AdamOptimizer",
            "AdamaxOptimizer",
            "Add",
            "AddN",
            "All",
            "Any",
            "ArgMax",
            "ArgMin",
            "Asin",
            "Asinh",
            "Atan",
            "Atan2",
            "Atanh",
            "AvgPool",
            "AvgPool3D",
            "AvgPool3DBackprop",
            "AvgPoolBackprop",
            "BatchMatMul",
            "BatchToSpaceND",
            "BroadcastTo",
            "Callback",
            "CallbackList",
            "Cast",
            "Ceil",
            "ClipByValue",
            "Complex",
            "Concat",
            "Conv2D",
            "Conv2DBackpropFilter",
            "Conv2DBackpropInput",
            "Conv3D",
            "Conv3DBackpropFilterV2",
            "Conv3DBackpropInputV2",
            "Cos",
            "Cosh",
            "CropAndResize",
            "Cumsum",
            "CustomCallback",
            "DataStorage",
            "DepthToSpace",
            "DepthwiseConv2dNative",
            "DepthwiseConv2dNativeBackpropFilter",
            "DepthwiseConv2dNativeBackpropInput",
            "Diag",
            "Dilation2D",
            "Dilation2DBackpropFilter",
            "Dilation2DBackpropInput",
            "Div",
            "ENV",
            "EarlyStopping",
            "Elu",
            "EluGrad",
            "Environment",
            "Equal",
            "Erf",
            "Exp",
            "Expm1",
            "FFT",
            "Fill",
            "FlipLeftRight",
            "Floor",
            "FloorDiv",
            "FromPixels",
            "FusedBatchNorm",
            "FusedConv2D",
            "FusedDepthwiseConv2D",
            "GatherNd",
            "GatherV2",
            "GraphModel",
            "Greater",
            "GreaterEqual",
            "History",
            "IFFT",
            "Identity",
            "Imag",
            "InputSpec",
            "IsFinite",
            "IsInf",
            "IsNan",
            "KernelBackend",
            "LRN",
            "LRNBackprop",
            "LayerVariable",
            "LayersModel",
            "Less",
            "LessEqual",
            "LinSpace",
            "Log",
            "Log1p",
            "LogSoftmax",
            "LogicalAnd",
            "LogicalNot",
            "LogicalOr",
            "Max",
            "MaxPool",
            "MaxPool3D",
            "MaxPool3DBackprop",
            "MaxPoolBackprop",
            "MaxPoolWithArgmax",
            "Maximum",
            "Mean",
            "Min",
            "Minimum",
            "Mod",
            "MomentumOptimizer",
            "Multiply",
            "Negate",
            "NonMaxSuppressionV3",
            "NonMaxSuppressionV4",
            "NonMaxSuppressionV5",
            "NotEqual",
            "OP_SCOPE_SUFFIX",
            "OneHot",
            "OnesLike",
            "Optimizer",
            "PadV2",
            "Pool",
            "Pow",
            "Prelu",
            "Prod",
            "RMSPropOptimizer",
            "RNN",
            "Range",
            "Rank",
            "Real",
            "Reciprocal",
            "Reduction",
            "Relu",
            "Relu6",
            "Reshape",
            "ResizeBilinear",
            "ResizeBilinearGrad",
            "ResizeNearestNeighbor",
            "ResizeNearestNeighborGrad",
            "Reverse",
            "RotateWithOffset",
            "Round",
            "Rsqrt",
            "SGDOptimizer",
            "ScatterNd",
            "SelectV2",
            "Selu",
            "Sequential",
            "Sigmoid",
            "Sign",
            "Sin",
            "Sinh",
            "Slice",
            "Softmax",
            "Softplus",
            "SpaceToBatchND",
            "SparseToDense",
            "SplitV",
            "Sqrt",
            "Square",
            "SquaredDifference",
            "Step",
            "StridedSlice",
            "Sub",
            "Sum",
            "SymbolicTensor",
            "Tan",
            "Tanh",
            "Tensor",
            "TensorBuffer",
            "Tile",
            "TopK",
            "Transpose",
            "Unique",
            "Unpack",
            "UnsortedSegmentSum",
            "Variable",
            "ZerosLike",
            "_FusedMatMul",
            "abs",
            "acos",
            "acosh",
            "add",
            "addN",
            "addStrict",
            "all",
            "any",
            "argMax",
            "argMin",
            "asin",
            "asinh",
            "atan",
            "atan2",
            "atanh",
            "avgPool",
            "avgPool3d",
            "backend",
            "backend_util",
            "basicLSTMCell",
            "batchNorm",
            "batchNorm2d",
            "batchNorm3d",
            "batchNorm4d",
            "batchToSpaceND",
            "booleanMaskAsync",
            "broadcastTo",
            "browser",
            "buffer",
            "callbacks",
            "cast",
            "ceil",
            "clipByValue",
            "clone",
            "complex",
            "concat",
            "concat1d",
            "concat2d",
            "concat3d",
            "concat4d",
            "constraints",
            "conv1d",
            "conv2d",
            "conv2dTranspose",
            "conv3d",
            "conv3dTranspose",
            "copyRegisteredKernels",
            "cos",
            "cosh",
            "cosineWindow",
            "cumsum",
            "customGrad",
            "data",
            "default",
            "deprecationWarn",
            "depthToSpace",
            "depthwiseConv2d",
            "deregisterOp",
            "device_util",
            "diag",
            "dilation2d",
            "disableDeprecationWarnings",
            "dispose",
            "disposeVariables",
            "div",
            "divNoNan",
            "divStrict",
            "dot",
            "dropout",
            "elu",
            "enableDebugMode",
            "enableProdMode",
            "enclosingPowerOfTwo",
            "engine",
            "env",
            "equal",
            "equalStrict",
            "erf",
            "exp",
            "expandDims",
            "expm1",
            "eye",
            "fft",
            "fill",
            "findBackend",
            "findBackendFactory",
            "floor",
            "floorDiv",
            "fused",
            "gather",
            "gatherND",
            "gather_util",
            "getBackend",
            "getGradient",
            "getKernel",
            "getKernelsForBackend",
            "grad",
            "grads",
            "greater",
            "greaterEqual",
            "greaterEqualStrict",
            "greaterStrict",
            "ifft",
            "imag",
            "image",
            "inTopKAsync",
            "initializers",
            "input",
            "io",
            "irfft",
            "isFinite",
            "isInf",
            "isNaN",
            "keep",
            "kernel_impls",
            "layers",
            "leakyRelu",
            "less",
            "lessEqual",
            "lessEqualStrict",
            "lessStrict",
            "linalg",
            "linspace",
            "loadGraphModel",
            "loadLayersModel",
            "localResponseNormalization",
            "log",
            "log1p",
            "logSigmoid",
            "logSoftmax",
            "logSumExp",
            "logicalAnd",
            "logicalNot",
            "logicalOr",
            "logicalXor",
            "losses",
            "matMul",
            "math",
            "max",
            "maxPool",
            "maxPool3d",
            "maxPoolWithArgmax",
            "maximum",
            "maximumStrict",
            "mean",
            "memory",
            "metrics",
            "min",
            "minimum",
            "minimumStrict",
            "mod",
            "modStrict",
            "model",
            "models",
            "moments",
            "movingAverage",
            "mul",
            "mulStrict",
            "multiRNNCell",
            "multinomial",
            "neg",
            "nextFrame",
            "norm",
            "notEqual",
            "notEqualStrict",
            "oneHot",
            "ones",
            "onesLike",
            "op",
            "outerProduct",
            "pad",
            "pad1d",
            "pad2d",
            "pad3d",
            "pad4d",
            "pool",
            "pow",
            "powStrict",
            "prelu",
            "print",
            "prod",
            "profile",
            "rand",
            "randomGamma",
            "randomNormal",
            "randomUniform",
            "range",
            "ready",
            "real",
            "reciprocal",
            "registerBackend",
            "registerCallbackConstructor",
            "registerGradient",
            "registerKernel",
            "registerOp",
            "regularizers",
            "relu",
            "relu6",
            "removeBackend",
            "reshape",
            "reverse",
            "reverse1d",
            "reverse2d",
            "reverse3d",
            "reverse4d",
            "rfft",
            "round",
            "rsqrt",
            "scalar",
            "scatterND",
            "scatter_util",
            "selu",
            "separableConv2d",
            "sequential",
            "serialization",
            "setBackend",
            "setPlatform",
            "setdiff1dAsync",
            "sigmoid",
            "sign",
            "signal",
            "sin",
            "sinh",
            "slice",
            "slice1d",
            "slice2d",
            "slice3d",
            "slice4d",
            "slice_util",
            "softmax",
            "softplus",
            "spaceToBatchND",
            "sparseToDense",
            "spectral",
            "split",
            "sqrt",
            "square",
            "squaredDifference",
            "squaredDifferenceStrict",
            "squeeze",
            "stack",
            "step",
            "stridedSlice",
            "sub",
            "subStrict",
            "sum",
            "sumOutType",
            "tan",
            "tanh",
            "tensor",
            "tensor1d",
            "tensor2d",
            "tensor3d",
            "tensor4d",
            "tensor5d",
            "tensor6d",
            "tensor_util",
            "test_util",
            "tidy",
            "tile",
            "time",
            "topk",
            "train",
            "transpose",
            "truncatedNormal",
            "unique",
            "unregisterGradient",
            "unregisterKernel",
            "unsortedSegmentSum",
            "unstack",
            "upcastType",
            "util",
            "valueAndGrad",
            "valueAndGrads",
            "variable",
            "variableGrads",
            "version",
            "version_converter",
            "version_core",
            "version_layers",
            "where",
            "whereAsync",
            "zeros",
            "zerosLike",
        ],
    )
}

#[test]
#[ignore = "Will be fixed by #1264"]
#[timeout(60000)]
fn deno_8620() {
    run("tests/deno/deno-8620/entry.ts", &[])
}

#[test]
#[timeout(60000)]
#[ignore = "Requires newer version of deno"]
fn deno_8627() {
    run("tests/deno/deno-8627/input.ts", &[])
}

#[test]
#[timeout(60000)]
fn merging_order_01() {
    run(
        "https://deno.land/x/oak@v6.3.1/multipart.ts",
        &["FormDataReader"],
    );
}

#[test]
#[timeout(60000)]
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
                    kind: Default::default(),
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

#[testing::fixture("deno-exec/**/entry.ts")]
fn exec(input: PathBuf) {
    let dir = tempfile::tempdir().expect("failed to crate temp file");
    let path = dir.path().join("main.js");
    println!("{}", path.display());

    let src = bundle(&input.to_string_lossy());
    write(&path, &src).unwrap();

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

    assert!(output.success());
}
