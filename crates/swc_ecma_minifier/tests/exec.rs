#![deny(warnings)]

extern crate swc_malloc;

use ansi_term::Color;
use anyhow::Error;
use serde::Deserialize;
use swc_common::{
    comments::SingleThreadedComments,
    errors::{Handler, HANDLER},
    sync::Lrc,
    FileName, Mark, SourceMap,
};
use swc_ecma_ast::Program;
use swc_ecma_codegen::{
    text_writer::{omit_trailing_semi, JsWriter, WriteJs},
    Emitter,
};
use swc_ecma_minifier::{
    optimize,
    option::{
        terser::TerserCompressorOptions, CompressOptions, ExtraOptions, MangleOptions,
        MinifyOptions,
    },
};
use swc_ecma_parser::{parse_file_as_module, EsSyntax, Syntax};
use swc_ecma_testing::{exec_node_js, JsExecOptions};
use swc_ecma_transforms_base::{fixer::fixer, hygiene::hygiene, resolver};
use swc_ecma_visit::VisitMutWith;
use testing::DebugUsingDisplay;
use tracing::{info, span, Level};

#[derive(Debug, Clone, Deserialize)]
struct TestOptions {
    #[serde(default)]
    defaults: bool,
}

fn parse_compressor_config(cm: Lrc<SourceMap>, s: &str) -> (bool, CompressOptions) {
    let opts: TestOptions =
        serde_json::from_str(s).expect("failed to deserialize value into a compressor config");
    let mut c: TerserCompressorOptions =
        serde_json::from_str(s).expect("failed to deserialize value into a compressor config");

    c.defaults = opts.defaults;

    (c.module, c.into_config(cm))
}

fn stdout_of(code: &str) -> Result<String, Error> {
    let stdout = exec_node_js(
        code,
        JsExecOptions {
            cache: true,
            module: false,
            ..Default::default()
        },
    )?;

    info!("Stdout: {}", stdout);

    Ok(stdout)
}

fn print<N: swc_ecma_codegen::Node>(
    cm: Lrc<SourceMap>,
    nodes: &[N],
    minify: bool,
    skip_semi: bool,
) -> String {
    let mut buf = Vec::new();

    {
        let mut wr: Box<dyn WriteJs> = Box::new(JsWriter::new(cm.clone(), "\n", &mut buf, None));
        if minify || skip_semi {
            wr = Box::new(omit_trailing_semi(wr));
        }

        let mut emitter = Emitter {
            cfg: swc_ecma_codegen::Config::default().with_minify(minify),
            cm,
            comments: None,
            wr,
        };

        for n in nodes {
            n.emit_with(&mut emitter).unwrap();
        }
    }

    String::from_utf8(buf).unwrap()
}

fn run(
    cm: Lrc<SourceMap>,
    handler: &Handler,
    input: &str,
    config: Option<&str>,
    mangle: Option<MangleOptions>,
) -> Option<Program> {
    let _ = rayon::ThreadPoolBuilder::new()
        .thread_name(|i| format!("rayon-{}", i + 1))
        .build_global();

    let compress_config = config.map(|config| parse_compressor_config(cm.clone(), config).1);

    let fm = cm.new_source_file(FileName::Anon.into(), input.into());
    let comments = SingleThreadedComments::default();

    eprintln!("---- {} -----\n{}", Color::Green.paint("Input"), fm.src);

    let unresolved_mark = Mark::new();
    let top_level_mark = Mark::new();

    let program = parse_file_as_module(
        &fm,
        Syntax::Es(EsSyntax {
            jsx: true,
            ..Default::default()
        }),
        Default::default(),
        Some(&comments),
        &mut Vec::new(),
    )
    .map_err(|err| {
        err.into_diagnostic(handler).emit();
    })
    .map(Program::Module)
    .map(|module| module.apply(&mut resolver(unresolved_mark, top_level_mark, false)));

    // Ignore parser errors.
    //
    // This is typically related to strict mode caused by module context.
    let program = match program {
        Ok(v) => v,
        _ => return None,
    };

    let run_hygiene = mangle.is_none();

    let mut output = optimize(
        program,
        cm,
        Some(&comments),
        None,
        &MinifyOptions {
            compress: compress_config,
            mangle,
            ..Default::default()
        },
        &ExtraOptions {
            unresolved_mark,
            top_level_mark,
            mangle_name_cache: None,
        },
    );

    if run_hygiene {
        output.visit_mut_with(&mut hygiene());
    }

    let output = output.apply(&mut fixer(None));

    Some(output)
}

fn run_exec_test(input_src: &str, config: &str, skip_mangle: bool) {
    eprintln!("---- {} -----\n{}", Color::Green.paint("Config"), config);

    let expected_output = stdout_of(input_src).unwrap();

    eprintln!(
        "---- {} -----\n{}",
        Color::Green.paint("Expected"),
        expected_output
    );

    testing::run_test2(false, |cm, handler| {
        HANDLER.set(&handler, || {
            let _tracing = span!(Level::ERROR, "compress-only").entered();

            let output = run(cm.clone(), &handler, input_src, Some(config), None);
            let output = output.expect("Parsing in base test should not fail");
            let output = print(cm, &[output], false, false);

            eprintln!(
                "---- {} -----\n{}",
                Color::Green.paint("Optimized code"),
                output
            );

            let actual_output = stdout_of(&output).expect("failed to execute the optimized code");
            assert_ne!(actual_output, "");

            assert_eq!(
                DebugUsingDisplay(&actual_output),
                DebugUsingDisplay(&expected_output)
            );

            Ok(())
        })
    })
    .unwrap();

    if !skip_mangle {
        testing::run_test2(false, |cm, handler| {
            let _tracing = span!(Level::ERROR, "with-mangle").entered();

            let output = run(
                cm.clone(),
                &handler,
                input_src,
                None,
                Some(MangleOptions {
                    keep_fn_names: true,
                    top_level: Some(true),
                    ..Default::default()
                }),
            );

            let output = output.expect("Parsing in base test should not fail");
            let output = print(cm, &[&output], true, false);

            eprintln!(
                "---- {} -----\n{}",
                Color::Green.paint("Optimized code"),
                output
            );

            let actual_output = stdout_of(&output).expect("failed to execute the optimized code");
            assert_ne!(actual_output, "");

            assert_eq!(
                DebugUsingDisplay(&actual_output),
                DebugUsingDisplay(&expected_output)
            );

            Ok(())
        })
        .unwrap();
    }
}

fn run_default_exec_test(input_src: &str) {
    let config = r#"{
        "defaults": true,
        "toplevel": true
    }"#;

    run_exec_test(input_src, config, false);
}

#[test]
fn next_feedback_1_capture_1() {
    let src = r###"
const arr = [];
const fns = [];

var _loop = function (i) {
    fns.push(() => {
        arr.push(i);
    })
}
for (var i = 0; i < 10; i++) _loop(i);

fns.forEach(fn => fn());

console.log(arr);"###;
    let config = r#"{
    "defaults": true,
    "toplevel": true
}"#;

    run_exec_test(src, config, false);
}

#[test]
fn conditionals_reduce_6() {
    let src = r#"function x() {
}
function y() {
    return "foo";
}
console.log((y() || false) && x());"#;
    let config = r#"{
    "booleans": true,
    "conditionals": true,
    "evaluate": true,
    "side_effects": true
}"#;

    run_exec_test(src, config, false);
}

#[test]
fn conditionals_reduce_1() {
    let src = r#"function x() {
}
function y() {
    return "foo";
}
console.log(x() && true && y());"#;
    let config = r#"{
    "booleans": true,
    "conditionals": true,
    "evaluate": true,
    "side_effects": true
}"#;

    run_exec_test(src, config, false);
}

#[test]
fn conditionals_reduce_4() {
    let src = r#"function x() {
}
function y() {
    return "foo";
}
console.log(y() || false || x());"#;
    let config = r#"{
    "booleans": true,
    "conditionals": true,
    "evaluate": true,
    "side_effects": true
}"#;

    run_exec_test(src, config, false);
}

#[test]
fn conditionals_reduce_3() {
    let src = r#"function x() {
}
function y() {
    return "foo";
}
console.log(x() || false || y());"#;
    let config = r#"{
    "booleans": true,
    "conditionals": true,
    "evaluate": true,
    "side_effects": true
}"#;

    run_exec_test(src, config, false);
}

#[test]
fn conditionals_reduce_2() {
    let src = r#"function x() {
}
function y() {
    return "foo";
}
console.log(y() && true && x());"#;
    let config = r#"{
    "booleans": true,
    "conditionals": true,
    "evaluate": true,
    "side_effects": true
}"#;

    run_exec_test(src, config, false);
}

#[test]
fn conditionals_reduce_5() {
    let src = r#"function x() {
}
function y() {
    return "foo";
}
console.log((x() || false) && y());"#;
    let config = r#"{
    "booleans": true,
    "conditionals": true,
    "evaluate": true,
    "side_effects": true
}"#;

    run_exec_test(src, config, false);
}

#[test]
fn vercel_001() {
    let src = r#"function _interop_require_default(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _class_call_check(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possible_constructor_return(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }


function ItemsList() {
    var _ref;

    var _temp, _this, _ret;

    _class_call_check(this, ItemsList);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = _possible_constructor_return(this, (_ref = ItemsList.__proto__ || Object.getPrototypeOf(ItemsList)).call.apply(_ref, [this].concat(args))), _this), _this.storeHighlightedItemReference = function (highlightedItem) {
        _this.props.onHighlightedItemChange(highlightedItem === null ? null : highlightedItem.item);
    }, _temp), _possible_constructor_return(_this, _ret);
}


new ItemsList();
console.log('PASS')"#;
    let config = r#"{
    "defaults": true,
    "toplevel": true
}"#;

    run_exec_test(src, config, false);
}

#[test]
fn vercel_002() {
    let src = r#"function _interop_require_default(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
function _class_call_check(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
    }
}
function _possible_constructor_return(self, call) {
    if (!self) {
        throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
    }
    return call && ("object" == typeof call || "function" == typeof call) ? call : self;
}
function _inherits(subClass, superClass) {
    if ("function" != typeof superClass && null !== superClass) {
        throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
    }
    subClass.prototype = Object.create(superClass && superClass.prototype, {
        constructor: {
            value: subClass,
            enumerable: false,
            writable: true,
            configurable: true
        }
    });
    if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
}
function ItemsList() {
    _class_call_check(this, ItemsList);
    for (var _ref, _temp, _this, _ret, _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
    }
    return _ret = (_temp = (_this = _possible_constructor_return(this, (_ref = ItemsList.__proto__ || Object.getPrototypeOf(ItemsList)).call.apply(_ref, [
        this
    ].concat(args))), _this), _this.storeHighlightedItemReference = function (highlightedItem) {
        _this.props.onHighlightedItemChange(null === highlightedItem ? null : highlightedItem.item);
    }, _temp), _possible_constructor_return(_this, _ret);
}
new ItemsList();
console.log("PASS");"#;
    let config = r#"{
    "defaults": true,
    "toplevel": true
}"#;

    run_exec_test(src, config, false);
}

#[test]
fn regexp_1() {
    let src = r#"

function compile(attributePattern, flags) {
    return new RegExp(`(?:^|;)\\s*${attributePattern}\\s*=\\s*` + `(` + `[^";\\s][^;\\s]*` + `|` + `"(?:[^"\\\\]|\\\\"?)+"?` + `)`, flags);
}

console.log(compile("foo", "g"));
console.log(compile("bar", "g"));
console.log(compile("baz", "g"));"#;
    let config = r#"{
    "defaults": true
}"#;

    run_exec_test(src, config, false);
}

#[test]
fn update_object_1() {
    let src = r###"console.log(function () {
    console.log({
        q: {
            p: 8
        }
    }.q.p++);
    return 8;
}());"###;
    let config = r###"{}"###;

    run_exec_test(src, config, false);
}

#[test]
fn update_object_3() {
    let src = r###"console.log(function () {
    var o = {
        p: 7
    };
    console.log([
        o
    ][0].p++);
    return o.p;
}());"###;
    let config = r###"{}"###;

    run_exec_test(src, config, false);
}

#[test]
fn update_object_2() {
    let src = r###"function inc() {
    this.p++;
}
console.log(function () {
    inc.call({
        p: 6
    });
    console.log(6);
    return 6;
}());"###;
    let config = r###"{}"###;

    run_exec_test(src, config, false);
}

#[test]
fn iife_reassign_1() {
    let src = r###"console.log(function c() {
    c = 6;
    return c;
}())"###;
    let config = r#"{
    "evaluate": true,
    "inline": true,
    "passes": 3,
    "reduce_vars": true,
    "side_effects": true,
    "unused": true
}"#;

    run_exec_test(src, config, false);
}

#[test]
fn emotion_react_1() {
    let src = r#"
/* harmony default export */
var emotion_memoize_browser_esm = (memoize);

var hyphenateRegex = /[A-Z]|^ms/g;
var animationRegex = /_EMO_([^_]+?)_([^]*?)_EMO_/g;


var unitlessKeys = {
    animationIterationCount: 1,
    borderImageOutset: 1,
    borderImageSlice: 1,
    borderImageWidth: 1,
    boxFlex: 1,
    boxFlexGroup: 1,
    boxOrdinalGroup: 1,
    columnCount: 1,
    columns: 1,
    flex: 1,
    flexGrow: 1,
    flexPositive: 1,
    flexShrink: 1,
    flexNegative: 1,
    flexOrder: 1,
    gridRow: 1,
    gridRowEnd: 1,
    gridRowSpan: 1,
    gridRowStart: 1,
    gridColumn: 1,
    gridColumnEnd: 1,
    gridColumnSpan: 1,
    gridColumnStart: 1,
    msGridRow: 1,
    msGridRowSpan: 1,
    msGridColumn: 1,
    msGridColumnSpan: 1,
    fontWeight: 1,
    lineHeight: 1,
    opacity: 1,
    order: 1,
    orphans: 1,
    tabSize: 1,
    widows: 1,
    zIndex: 1,
    zoom: 1,
    WebkitLineClamp: 1,
    // SVG-related properties
    fillOpacity: 1,
    floodOpacity: 1,
    stopOpacity: 1,
    strokeDasharray: 1,
    strokeDashoffset: 1,
    strokeMiterlimit: 1,
    strokeOpacity: 1,
    strokeWidth: 1
};

var unitless_browser_esm = (unitlessKeys);

var isCustomProperty = function isCustomProperty(property) {
    return property.charCodeAt(1) === 45;
};

var labelPattern = /label:\s*([^\s;\n{]+)\s*(;|$)/g;

var cursor;

var hash_browser_esm = (murmur2);


function handleInterpolation(mergedProps, registered, interpolation) {
    if (interpolation == null) {
        return '';
    }

    if (interpolation.__emotion_styles !== undefined) {
        if (false) { }

        return interpolation;
    }

    switch (typeof interpolation) {
        case 'boolean': {
            return '';
        }

        case 'object': {
            if (interpolation.anim === 1) {
                cursor = {
                    name: interpolation.name,
                    styles: interpolation.styles,
                    next: cursor
                };
                return interpolation.name;
            }

            if (interpolation.styles !== undefined) {
                var next = interpolation.next;

                if (next !== undefined) {
                    // not the most efficient thing ever but this is a pretty rare case
                    // and there will be very few iterations of this generally
                    while (next !== undefined) {
                        cursor = {
                            name: next.name,
                            styles: next.styles,
                            next: cursor
                        };
                        next = next.next;
                    }
                }

                var styles = interpolation.styles + ";";

                if (false) { }

                return styles;
            }

            return createStringFromObject(mergedProps, registered, interpolation);
        }

        case 'function': {
            if (mergedProps !== undefined) {
                var previousCursor = cursor;
                var result = interpolation(mergedProps);
                cursor = previousCursor;
                return handleInterpolation(mergedProps, registered, result);
            } else if (false) { }

            break;
        }

        case 'string':
            if (false) {
                var replaced, matched;
            }

            break;
    } // finalize string values (regular strings and functions interpolated into css calls)


    if (registered == null) {
        return interpolation;
    }

    var cached = registered[interpolation];
    return cached !== undefined ? cached : interpolation;
}


function serializeStyles(args, registered, mergedProps) {
    if (args.length === 1 && typeof args[0] === 'object' && args[0] !== null && args[0].styles !== undefined) {
        return args[0];
    }

    var stringMode = true;
    var styles = '';
    cursor = undefined;
    var strings = args[0];

    if (strings == null || strings.raw === undefined) {
        stringMode = false;
        console.log('stringMode = false')
        styles += handleInterpolation(mergedProps, registered, strings);
    } else {
        if (false) { }

        styles += strings[0];
    } // we start at 1 since we've already handled the first arg

    console.log(`Styles: ${styles}`)

    for (var i = 1; i < args.length; i++) {
        styles += handleInterpolation(mergedProps, registered, args[i]);

        if (stringMode) {
            if (false) { }

            styles += strings[i];
        }
    }

    console.log(`Styles: ${styles}`)

    var sourceMap;

    if (false) { } // using a global regex with .exec is stateful so lastIndex has to be reset each time


    labelPattern.lastIndex = 0;
    var identifierName = '';
    var match; // https://esbench.com/bench/5b809c2cf2949800a0f61fb5

    while ((match = labelPattern.exec(styles)) !== null) {
        identifierName += '-' + // $FlowFixMe we know it's not null
            match[1];
    }

    console.log(`styles = ${styles}`)
    console.log(`identifierName = ${identifierName}`)
    var name = hash_browser_esm(styles) + identifierName;

    if (false) { }

    return {
        name: name,
        styles: styles,
        next: cursor
    };
}

function createStringFromObject(mergedProps, registered, obj) {
    var string = '';

    if (Array.isArray(obj)) {
        for (var i = 0; i < obj.length; i++) {
            string += handleInterpolation(mergedProps, registered, obj[i]) + ";";
        }
    } else {
        for (var _key in obj) {
            var value = obj[_key];

            if (typeof value !== 'object') {
                if (registered != null && registered[value] !== undefined) {
                    string += _key + "{" + registered[value] + "}";
                } else if (isProcessableValue(value)) {
                    string += processStyleName(_key) + ":" + processStyleValue(_key, value) + ";";
                }
            } else {
                if (_key === 'NO_COMPONENT_SELECTOR' && "production" !== 'production') { }

                if (Array.isArray(value) && typeof value[0] === 'string' && (registered == null || registered[value[0]] === undefined)) {
                    for (var _i = 0; _i < value.length; _i++) {
                        if (isProcessableValue(value[_i])) {
                            string += processStyleName(_key) + ":" + processStyleValue(_key, value[_i]) + ";";
                        }
                    }
                } else {
                    var interpolated = handleInterpolation(mergedProps, registered, value);

                    switch (_key) {
                        case 'animation':
                        case 'animationName': {
                            string += processStyleName(_key) + ":" + interpolated + ";";
                            break;
                        }

                        default: {
                            if (false) { }

                            string += _key + "{" + interpolated + "}";
                        }
                    }
                }
            }
        }
    }

    return string;
}

function murmur2(str) {
    // 'm' and 'r' are mixing constants generated offline.
    // They're not really 'magic', they just happen to work well.
    // const m = 0x5bd1e995;
    // const r = 24;
    // Initialize the hash
    var h = 0; // Mix 4 bytes at a time into the hash

    var k,
        i = 0,
        len = str.length;

    for (; len >= 4; ++i, len -= 4) {
        k = str.charCodeAt(i) & 0xff | (str.charCodeAt(++i) & 0xff) << 8 | (str.charCodeAt(++i) & 0xff) << 16 | (str.charCodeAt(++i) & 0xff) << 24;
        console.log(`K1: ${k}`);
        k =
            /* Math.imul(k, m): */
            (k & 0xffff) * 0x5bd1e995 + ((k >>> 16) * 0xe995 << 16);
        console.log(`K2: ${k}`);
        k ^=
            /* k >>> r: */
            k >>> 24;
        console.log(`K3: ${k}`);
        h =
            /* Math.imul(k, m): */
            (k & 0xffff) * 0x5bd1e995 + ((k >>> 16) * 0xe995 << 16) ^
            /* Math.imul(h, m): */
            (h & 0xffff) * 0x5bd1e995 + ((h >>> 16) * 0xe995 << 16);
        console.log(`H: ${h}`);
    } // Handle the last few bytes of the input array


    switch (len) {
        case 3:
            h ^= (str.charCodeAt(i + 2) & 0xff) << 16;

        case 2:
            h ^= (str.charCodeAt(i + 1) & 0xff) << 8;

        case 1:
            h ^= str.charCodeAt(i) & 0xff;
            h =
                /* Math.imul(h, m): */
                (h & 0xffff) * 0x5bd1e995 + ((h >>> 16) * 0xe995 << 16);
    } // Do a few final mixes of the hash to ensure the last few
    // bytes are well-incorporated.


    h ^= h >>> 13;
    h =
        /* Math.imul(h, m): */
        (h & 0xffff) * 0x5bd1e995 + ((h >>> 16) * 0xe995 << 16);
    return ((h ^ h >>> 15) >>> 0).toString(36);
}

function isProcessableValue(value) {
    return value != null && typeof value !== 'boolean';
}

var processStyleName = /* #__PURE__ */ emotion_memoize_browser_esm(function (styleName) {
    return isCustomProperty(styleName) ? styleName : styleName.replace(hyphenateRegex, '-$&').toLowerCase();
});

var processStyleValue = function processStyleValue(key, value) {
    switch (key) {
        case 'animation':
        case 'animationName': {
            if (typeof value === 'string') {
                return value.replace(animationRegex, function (match, p1, p2) {
                    cursor = {
                        name: p1,
                        styles: p2,
                        next: cursor
                    };
                    return p1;
                });
            }
        }
    }

    if (unitless_browser_esm[key] !== 1 && !isCustomProperty(key) && typeof value === 'number' && value !== 0) {
        return value + 'px';
    }

    return value;
};

function memoize(fn) {
    var cache = Object.create(null);
    return function (arg) {
        if (cache[arg] === undefined) cache[arg] = fn(arg);
        return cache[arg];
    };
}


console.log(serializeStyles(`:root {
    --background-color: rebeccapurple;
  }`));
console.log(serializeStyles(`:root {
    --background-color: rebeccapurple;
  }`));
console.log(serializeStyles(`:root {
    --background-color: rebeccapurple;
  }`));
console.log(serializeStyles(`:root {
    --background-color: rebeccapurple;
  }`));
console.log(serializeStyles(`:root {
    --background-color: rebeccapurple;
  }`));
console.log(serializeStyles(`:root {
    --background-color: rebeccapurple;
  }`));"#;
    let config = r#"{
    "defaults": true,
    "toplevel": true
}"#;

    run_exec_test(src, config, false);
}

#[test]
fn simple_1() {
    let src = r###"console.log('PASS')"###;
    let config = r###"{}"###;

    run_exec_test(src, config, false);
}

#[test]
fn terser_issue_1588_unsafe_undefined() {
    let src = r###"var a, c;
console.log(
    (function (undefined) {
        return function () {
            if (a) return b;
            if (c) return d;
        };
    })()()
);"###;
    let config = r#"{
    "conditionals": true,
    "if_return": true,
    "unsafe_undefined": true
}"#;

    run_exec_test(src, config, false);
}

#[test]
fn terser_issue_1588_safe_undefined() {
    let src = r###"var a, c;
console.log(
    (function (undefined) {
        return function () {
            if (a) return b;
            if (c) return d;
        };
    })(1)()
);"###;
    let config = r#"{
    "conditionals": true,
    "if_return": true,
    "unsafe": false
}"#;

    run_exec_test(src, config, false);
}

#[test]
fn terser_drop_unused_drop_toplevel_retain() {
    let src = r###"var a,
    b = 1,
    c = g;
function f(d) {
    return function () {
        c = 2;
    };
}
a = 2;
function g() {}
function h() {}
console.log((b = 3));"###;
    let config = r#"{
    "top_retain": "f,a,o",
    "unused": true
}"#;

    run_exec_test(src, config, false);
}

#[test]
fn terser_drop_unused_issue_t161_top_retain_15() {
    let src = r###"class Alpha {
    num() {
        return x;
    }
}
class Beta {
    num() {
        return y;
    }
}
class Carrot {
    num() {
        return z;
    }
}
function f() {
    return x;
}
const g = () => y;
const h = () => z;
let x = 2,
    y = 3,
    z = 4;
console.log(
    x,
    y,
    z,
    x * y,
    x * z,
    y * z,
    f(),
    g(),
    h(),
    new Alpha().num(),
    new Beta().num(),
    new Carrot().num()
);"###;
    let config = r#"{
    "defaults": true,
    "inline": 3,
    "passes": 2,
    "top_retain": "Alpha,z"
}"#;

    run_exec_test(src, config, false);
}

#[test]
fn terser_drop_unused_issue_t161_top_retain_4() {
    let src = r###"function f() {
    return 2;
}
function g() {
    return 3;
}
console.log(f(), f(), g(), g());"###;
    let config = r#"{
    "defaults": true,
    "inline": 3,
    "passes": 3,
    "top_retain": "f"
}"#;

    run_exec_test(src, config, false);
}

#[test]
fn terser_drop_unused_issue_t161_top_retain_3() {
    let src = r###"function f() {
    return 2;
}
function g() {
    return 3;
}
console.log(f(), g());"###;
    let config = r#"{
    "defaults": true,
    "inline": 3,
    "passes": 3,
    "top_retain": "f"
}"#;

    run_exec_test(src, config, false);
}

#[test]
fn terser_drop_unused_double_assign_1() {
    let src = r###"function f1() {
    var a = {};
    var a = [];
    return a;
}
function f2() {
    var a = {};
    a = [];
    return a;
}
function f3() {
    a = {};
    var a = [];
    return a;
}
function f4(a) {
    a = {};
    a = [];
    return a;
}
function f5(a) {
    var a = {};
    a = [];
    return a;
}
function f6(a) {
    a = {};
    var a = [];
    return a;
}
console.log(f1(), f2(), f3(), f4(), f5(), f6());"###;
    let config = r#"{
    "passes": 2,
    "reduce_vars": true,
    "side_effects": true,
    "unused": true
}"#;

    run_exec_test(src, config, false);
}

#[test]
fn terser_drop_unused_issue_2846() {
    let src = r###"function f(a, b) {
    var a = 0;
    b && b(a);
    return a++;
}
var c = f();
console.log(c);"###;
    let config = r#"{
    "collapse_vars": true,
    "reduce_vars": true,
    "toplevel": true,
    "unused": true
}"#;

    run_exec_test(src, config, false);
}

#[test]
fn terser_drop_unused_issue_2660_2() {
    let src = r###"var a = 1;
function f(b) {
    b && f();
    --a, a.toString();
}
f();
console.log(a);"###;
    let config = r#"{
    "collapse_vars": true,
    "reduce_vars": true,
    "sequences": true,
    "side_effects": true,
    "toplevel": true,
    "unused": true
}"#;

    run_exec_test(src, config, false);
}

#[test]
fn terser_drop_unused_drop_toplevel_retain_array() {
    let src = r###"var a,
    b = 1,
    c = g;
function f(d) {
    return function () {
        c = 2;
    };
}
a = 2;
function g() {}
function h() {}
console.log((b = 3));"###;
    let config = r#"{
    "top_retain": ["f", "a", "o"],
    "unused": true
}"#;

    run_exec_test(src, config, false);
}

#[test]
fn terser_drop_unused_chained_3() {
    let src = r###"console.log(
    (function (a, b) {
        var c = a,
            c = b;
        b++;
        return c;
    })(1, 2)
);"###;
    let config = r#"{
    "reduce_vars": true,
    "unused": true
}"#;

    run_exec_test(src, config, false);
}

#[test]
fn terser_drop_unused_issue_2665() {
    let src = r#"var a = 1;
function g() {
    a-- && g();
}
typeof h == "function" && h();
function h() {
    typeof g == "function" && g();
}
console.log(a);"#;
    let config = r#"{
    "evaluate": true,
    "inline": true,
    "keep_fargs": false,
    "passes": 2,
    "reduce_funcs": true,
    "reduce_vars": true,
    "side_effects": true,
    "toplevel": true,
    "typeofs": true,
    "unused": true
}"#;

    run_exec_test(src, config, false);
}

#[test]
fn terser_drop_unused_issue_2516_2() {
    let src = r#"function foo() {
    function qux(x) {
        bar.call(null, x);
    }
    function bar(x) {
        var FOUR = 4;
        var trouble = x || never_called();
        var value = (FOUR - 1) * trouble;
        console.log(value == 6 ? "PASS" : value);
    }
    Baz = qux;
}
var Baz;
foo();
Baz(2);"#;
    let config = r#"{
    "collapse_vars": true,
    "passes": 2,
    "reduce_funcs": true,
    "reduce_vars": true,
    "unused": true
}"#;

    run_exec_test(src, config, false);
}

#[test]
fn terser_drop_unused_drop_toplevel_funcs_retain() {
    let src = r###"var a,
    b = 1,
    c = g;
function f(d) {
    return function () {
        c = 2;
    };
}
a = 2;
function g() {}
function h() {}
console.log((b = 3));"###;
    let config = r#"{
    "top_retain": "f,a,o",
    "toplevel": "funcs",
    "unused": true
}"#;

    run_exec_test(src, config, false);
}

#[test]
fn terser_drop_unused_issue_1709() {
    let src = r###"console.log(
    (function x() {
        var x = 1;
        return x;
    })(),
    (function y() {
        const y = 2;
        return y;
    })(),
    (function z() {
        function z() {}
        return z;
    })()
);"###;
    let config = r#"{
    "unused": true
}"#;

    run_exec_test(src, config, false);
}

#[test]
fn terser_drop_unused_drop_var() {
    let src = r###"var a;
console.log(a, b);
var a = 1,
    b = 2;
console.log(a, b);
var a = 3;
console.log(a, b);"###;
    let config = r#"{
    "toplevel": true,
    "unused": true
}"#;

    run_exec_test(src, config, false);
}

#[test]
fn terser_drop_unused_drop_toplevel_funcs() {
    let src = r###"var a,
    b = 1,
    c = g;
function f(d) {
    return function () {
        c = 2;
    };
}
a = 2;
function g() {}
function h() {}
console.log((b = 3));"###;
    let config = r#"{
    "toplevel": "funcs",
    "unused": true
}"#;

    run_exec_test(src, config, false);
}

#[test]
fn terser_drop_unused_delete_assign_1() {
    let src = r###"var a;
console.log(delete (a = undefined));
console.log(delete (a = void 0));
console.log(delete (a = Infinity));
console.log(delete (a = 1 / 0));
console.log(delete (a = NaN));
console.log(delete (a = 0 / 0));"###;
    let config = r#"{
    "booleans": true,
    "side_effects": true,
    "toplevel": true,
    "unused": true
}"#;

    run_exec_test(src, config, false);
}

#[test]
fn terser_drop_unused_issue_2226_3() {
    let src = r###"console.log(
    (function (a, b) {
        a += b;
        return a;
    })(1, 2)
);"###;
    let config = r#"{
    "collapse_vars": true,
    "side_effects": true,
    "unused": true
}"#;

    run_exec_test(src, config, false);
}

#[test]
#[ignore]
fn terser_drop_unused_issue_3146_3() {
    let src = r#"var g = "PASS";
(function (f) {
    var g = "FAIL";
    f("console.log(g)", g[g]);
})(function (a) {
    eval(a);
});"#;
    let config = r#"{
    "collapse_vars": true,
    "unused": true
}"#;

    run_exec_test(src, config, false);
}

#[test]
#[ignore]
fn terser_drop_unused_issue_3146_4() {
    let src = r#"var g = "PASS";
(function (f) {
    var g = "FAIL";
    f("console.log(g)", g[g]);
})(function (a) {
    eval(a);
});"#;
    let config = r#"{
    "reduce_vars": true,
    "unused": true
}"#;

    run_exec_test(src, config, false);
}

#[test]
fn terser_drop_unused_drop_toplevel_vars_retain() {
    let src = r###"var a,
    b = 1,
    c = g;
function f(d) {
    return function () {
        c = 2;
    };
}
a = 2;
function g() {}
function h() {}
console.log((b = 3));"###;
    let config = r#"{
    "top_retain": "f,a,o",
    "toplevel": "vars",
    "unused": true
}"#;

    run_exec_test(src, config, false);
}

#[test]
fn terser_drop_unused_issue_2226_2() {
    let src = r###"console.log(
    (function (a, b) {
        a += b;
        return a;
    })(1, 2)
);"###;
    let config = r#"{
    "collapse_vars": true,
    "sequences": true,
    "side_effects": true,
    "unused": true
}"#;

    run_exec_test(src, config, false);
}

#[test]
fn terser_drop_unused_drop_fargs() {
    let src = r###"function f(a) {
    var b = a;
}

console.log(f())"###;
    let config = r#"{
    "keep_fargs": false,
    "unused": true
}"#;

    run_exec_test(src, config, false);
}

#[test]
fn terser_drop_unused_issue_2136_3() {
    let src = r###"function f(x) {
    console.log(x);
}
!(function (a, ...b) {
    f(b[0]);
})(1, 2, 3);"###;
    let config = r#"{
    "collapse_vars": true,
    "evaluate": true,
    "inline": true,
    "passes": 3,
    "reduce_funcs": true,
    "reduce_vars": true,
    "side_effects": true,
    "toplevel": true,
    "unsafe": true,
    "unused": true
}"#;

    run_exec_test(src, config, false);
}

#[test]
fn terser_drop_unused_issue_2660_1() {
    let src = r###"var a = 2;
function f(b) {
    return (b && f()) || a--;
}
f(1);
console.log(a);"###;
    let config = r#"{
    "reduce_vars": true,
    "side_effects": true,
    "toplevel": true,
    "unused": true
}"#;

    run_exec_test(src, config, false);
}

#[test]
fn terser_drop_unused_double_assign_2() {
    let src = r###"for (var i = 0; i < 2; i++) (a = void 0), (a = {}), console.log(a);
var a;"###;
    let config = r#"{
    "reduce_vars": true,
    "toplevel": true,
    "unused": true
}"#;

    run_exec_test(src, config, false);
}

#[test]
fn terser_drop_unused_issue_2136_2() {
    let src = r###"function f(x) {
    console.log(x);
}
!(function (a, ...b) {
    f(b[0]);
})(1, 2, 3);"###;
    let config = r#"{
    "collapse_vars": true,
    "inline": true,
    "side_effects": true,
    "unused": true
}"#;

    run_exec_test(src, config, false);
}

#[test]
fn terser_drop_unused_issue_t183() {
    let src = r#"function foo(val) {
    function bar(x) {
        if (x) return x;
        bar(x - 1);
    }
    return bar(val);
}
console.log(foo("PASS"));"#;
    let config = r#"{
    "defaults": true,
    "top_retain": []
}"#;

    run_exec_test(src, config, false);
}

#[test]
fn terser_drop_unused_drop_toplevel_vars() {
    let src = r###"var a,
    b = 1,
    c = g;
function f(d) {
    return function () {
        c = 2;
    };
}
a = 2;
function g() {}
function h() {}
console.log((b = 3));"###;
    let config = r#"{
    "toplevel": "vars",
    "unused": true
}"#;

    run_exec_test(src, config, false);
}

#[test]
fn terser_drop_unused_issue_2516_1() {
    let src = r#"function foo() {
    function qux(x) {
        bar.call(null, x);
    }
    function bar(x) {
        var FOUR = 4;
        var trouble = x || never_called();
        var value = (FOUR - 1) * trouble;
        console.log(value == 6 ? "PASS" : value);
    }
    Baz = qux;
}
var Baz;
foo();
Baz(2);"#;
    let config = r#"{
    "collapse_vars": true,
    "reduce_vars": true,
    "unused": true
}"#;

    run_exec_test(src, config, false);
}

#[test]
fn terser_drop_unused_defun_lambda_same_name() {
    let src = r###"function f(n) {
    return n ? n * f(n - 1) : 1;
}
console.log(
    (function f(n) {
        return n ? n * f(n - 1) : 1;
    })(5)
);"###;
    let config = r#"{
    "toplevel": true,
    "unused": true
}"#;

    run_exec_test(src, config, false);
}

#[test]
fn terser_drop_unused_drop_toplevel_vars_fargs() {
    let src = r###"var a,
    b = 1,
    c = g;
function f(d) {
    return function () {
        c = 2;
    };
}
a = 2;
function g() {}
function h() {}
console.log((b = 3));"###;
    let config = r#"{
    "keep_fargs": false,
    "toplevel": "vars",
    "unused": true
}"#;

    run_exec_test(src, config, false);
}

#[test]
fn terser_drop_unused_issue_1968() {
    let src = r###"function f(c) {
    var a;
    if (c) {
        let b;
        return (a = 2) + (b = 3);
    }
}
console.log(f(1));"###;
    let config = r#"{
    "unused": true
}"#;

    run_exec_test(src, config, false);
}

#[test]
fn terser_drop_unused_issue_1715_4() {
    let src = r###"var a = 1;
!(function a() {
    a++;
    try {
        x();
    } catch (a) {
        var a;
    }
})();
console.log(a);"###;
    let config = r#"{
    "unused": true
}"#;

    run_exec_test(src, config, false);
}

#[test]
fn terser_drop_unused_drop_assign() {
    let src = r###"function f1() {
    var a;
    a = 1;
}
function f2() {
    var a = 1;
    a = 2;
}
function f3(a) {
    a = 1;
}
function f4() {
    var a;
    return (a = 1);
}
function f5() {
    var a;
    return function () {
        a = 1;
    };
}

console.log(f1())
console.log(f2())
console.log(f3())
console.log(f4())
console.log(f5())"###;
    let config = r#"{
    "unused": true
}"#;

    run_exec_test(src, config, false);
}

#[test]
fn terser_drop_unused_issue_3146_1() {
    let src = r#"(function (f) {
    f("g()");
})(function (a) {
    eval(a);
    function g(b) {
        if (!b) b = "PASS";
        console.log(b);
    }
});"#;
    let config = r#"{
    "collapse_vars": true,
    "unused": true
}"#;

    run_exec_test(src, config, false);
}

#[test]
fn terser_drop_unused_delete_assign_2() {
    let src = r###"var a;
console.log(delete (a = undefined));
console.log(delete (a = void 0));
console.log(delete (a = Infinity));
console.log(delete (a = 1 / 0));
console.log(delete (a = NaN));
console.log(delete (a = 0 / 0));"###;
    let config = r#"{
    "booleans": true,
    "keep_infinity": true,
    "side_effects": true,
    "toplevel": true,
    "unused": true
}"#;

    run_exec_test(src, config, false);
}

#[test]
fn terser_drop_unused_drop_toplevel_all_retain() {
    let src = r###"var a,
    b = 1,
    c = g;
function f(d) {
    return function () {
        c = 2;
    };
}
a = 2;
function g() {}
function h() {}
console.log((b = 3));"###;
    let config = r#"{
    "top_retain": "f,a,o",
    "toplevel": true,
    "unused": true
}"#;

    run_exec_test(src, config, false);
}

#[test]
fn terser_comparing_issue_2857_6() {
    let src = r###"function f(a) {
    if ({}.b === undefined || {}.b === null)
        return a.b !== undefined && a.b !== null;
}
console.log(
    f({
        a: [null],
        get b() {
            return this.a.shift();
        },
    })
);"###;
    let config = r#"{
    "comparisons": true,
    "pure_getters": "strict",
    "reduce_vars": true
}"#;

    run_exec_test(src, config, false);
}

#[test]
fn terser_pure_getters_impure_getter_2() {
    let src = r###"({
    get a() {
        console.log(1);
    },
    b: 1,
}.a);
({
    get a() {
        console.log(1);
    },
    b: 1,
}.b);"###;
    let config = r#"{
    "pure_getters": true,
    "side_effects": true
}"#;

    run_exec_test(src, config, false);
}

#[test]
fn terser_pure_getters_issue_2838() {
    let src = r#"function f(a, b) {
    (a || b).c = "PASS";
    (function () {
        return f(a, b);
    }.prototype.foo = "bar");
}
var o = {};
f(null, o);
console.log(o.c);"#;
    let config = r#"{
    "pure_getters": true,
    "side_effects": true
}"#;

    run_exec_test(src, config, false);
}

#[test]
fn terser_pure_getters_issue_2938_4() {
    let src = r#"var Parser = function Parser() {};
var p = Parser.prototype;
var unused = p.x;
p.initialContext = function initialContext() {
    p.y;
    console.log("PASS");
};
p.braceIsBlock = function () {};
new Parser().initialContext();"#;
    let config = r#"{
    "pure_getters": true,
    "side_effects": true,
    "toplevel": true,
    "unused": true
}"#;

    run_exec_test(src, config, false);
}

#[test]
fn terser_pure_getters_set_mutable_1() {
    let src = r#"!(function a() {
    a.foo += "";
    if (a.foo) console.log("PASS");
    else console.log("FAIL");
})();"#;
    let config = r#"{
    "collapse_vars": true,
    "evaluate": true,
    "pure_getters": "strict",
    "reduce_funcs": true,
    "reduce_vars": true,
    "unused": true
}"#;

    run_exec_test(src, config, false);
}

#[test]
fn terser_pure_getters_issue_2938_3() {
    let src = r#"function f(a) {
    var unused = a.a;
    a.b = "PASS";
    a.c;
}
var o = {};
o.d;
f(o);
console.log(o.b);"#;
    let config = r#"{
    "pure_getters": true,
    "side_effects": true,
    "unused": true
}"#;

    run_exec_test(src, config, false);
}

#[test]
fn terser_pure_getters_set_immutable_6() {
    let src = r#"var a = 1;
a.foo += "";
if (a.foo) console.log("FAIL");
else console.log("PASS");"#;
    let config = r#"{
    "collapse_vars": true,
    "conditionals": true,
    "evaluate": true,
    "pure_getters": "strict",
    "reduce_funcs": true,
    "reduce_vars": true,
    "side_effects": true,
    "toplevel": true,
    "unused": true
}"#;

    run_exec_test(src, config, false);
}

#[test]
fn terser_pure_getters_set_immutable_1() {
    let src = r#"var a = 1;
a.foo += "";
if (a.foo) console.log("FAIL");
else console.log("PASS");"#;
    let config = r#"{
    "collapse_vars": true,
    "evaluate": true,
    "pure_getters": "strict",
    "reduce_funcs": true,
    "reduce_vars": true,
    "toplevel": true,
    "unused": true
}"#;

    run_exec_test(src, config, false);
}

#[test]
fn terser_pure_getters_set_mutable_2() {
    let src = r#"!(function a() {
    a.foo += "";
    if (a.foo) console.log("PASS");
    else console.log("FAIL");
})();"#;
    let config = r#"{
    "collapse_vars": true,
    "conditionals": true,
    "pure_getters": "strict",
    "reduce_funcs": true,
    "reduce_vars": true,
    "sequences": true,
    "side_effects": true
}"#;

    run_exec_test(src, config, false);
}

#[test]
fn terser_dead_code_issue_2860_1() {
    let src = r###"console.log(
    (function (a) {
        return (a ^= 1);
    })()
);"###;
    let config = r#"{
    "dead_code": true,
    "evaluate": true,
    "reduce_vars": true
}"#;

    run_exec_test(src, config, false);
}

#[test]
fn terser_dead_code_global_fns() {
    let src = r###"Boolean(1, 2);
decodeURI(1, 2);
decodeURIComponent(1, 2);
Date(1, 2);
encodeURI(1, 2);
encodeURIComponent(1, 2);
Error(1, 2);
escape(1, 2);
EvalError(1, 2);
isFinite(1, 2);
isNaN(1, 2);
Number(1, 2);
Object(1, 2);
parseFloat(1, 2);
parseInt(1, 2);
RangeError(1, 2);
ReferenceError(1, 2);
String(1, 2);
SyntaxError(1, 2);
TypeError(1, 2);
unescape(1, 2);
URIError(1, 2);
try {
    Function(1, 2);
} catch (e) {
    console.log(e.name);
}
try {
    RegExp(1, 2);
} catch (e) {
    console.log(e.name);
}
try {
    Array(NaN);
} catch (e) {
    console.log(e.name);
}"###;
    let config = r#"{
    "side_effects": true,
    "unsafe": true
}"#;

    run_exec_test(src, config, false);
}

#[test]
fn terser_block_scope_issue_334() {
    let src = r#"(function (A) {
    (function () {
        doPrint();
    })();
    function doPrint() {
        print(A);
    }
})("Hello World!");
function print(A) {
    if (!A.x) {
        console.log(A);
    }
}"#;
    let config = r#"{
    "defaults": true,
    "toplevel": true
}"#;

    run_exec_test(src, config, false);
}

#[test]
fn terser_hoist_props_issue_3021() {
    let src = r###"var a = 1,
    b = 2;
(function () {
    b = a;
    if (a++ + b--) return 1;
    return;
    var b = {};
})();
console.log(a, b);"###;
    let config = r#"{
    "hoist_props": true,
    "reduce_vars": true
}"#;

    run_exec_test(src, config, false);
}

#[test]
#[ignore = "Function (anonymous)"]
fn terser_hoist_props_contains_this_2() {
    let src = r###"var o = {
    u: function () {
        return this === this;
    },
    p: 1,
};
console.log(o.p, o.p, o.u);"###;
    let config = r#"{
    "evaluate": true,
    "hoist_props": true,
    "inline": true,
    "passes": 2,
    "reduce_funcs": true,
    "reduce_vars": true,
    "toplevel": true,
    "unused": true
}"#;

    run_exec_test(src, config, false);
}

#[test]
#[ignore]
fn terser_hoist_props_issue_851_hoist_to_conflicting_name() {
    let src = r#"const BBB = { CCC: "PASS" };
if (id(true)) {
    const BBB_CCC = BBB.CCC;
    console.log(BBB_CCC);
}"#;
    let config = r#"{
    "hoist_props": true,
    "reduce_vars": true,
    "toplevel": true
}"#;

    run_exec_test(src, config, false);
}

#[test]
fn terser_hoist_props_name_collision_1() {
    let src = r#"var obj_foo = 1;
var obj_bar = 2;
function f() {
    var obj = { foo: 3, bar: 4, "b-r": 5, "b+r": 6, "b!r": 7 };
    console.log(obj_foo, obj.foo, obj.bar, obj["b-r"], obj["b+r"], obj["b!r"]);
}
f();"#;
    let config = r#"{
    "hoist_props": true,
    "reduce_funcs": true,
    "reduce_vars": true,
    "toplevel": true
}"#;

    run_exec_test(src, config, false);
}

#[test]
fn terser_hoist_props_new_this() {
    let src = r###"var o = {
    a: 1,
    b: 2,
    f: function (a) {
        this.b = a;
    },
};
console.log(new o.f(o.a).b, o.b);"###;
    let config = r#"{
    "evaluate": true,
    "hoist_props": true,
    "inline": true,
    "passes": 2,
    "reduce_funcs": true,
    "reduce_vars": true,
    "toplevel": true,
    "unused": true
}"#;

    run_exec_test(src, config, false);
}

#[test]
fn terser_hoist_props_toplevel_let() {
    let src = r###"let a = { b: 1, c: 2 };
console.log(a.b + a.c);"###;
    let config = r#"{
    "hoist_props": true,
    "reduce_vars": true,
    "toplevel": false
}"#;

    run_exec_test(src, config, false);
}

#[test]
fn terser_hoist_props_undefined_key() {
    let src = r###"var a,
    o = {};
o[a] = 1;
o.b = 2;
console.log(o[a] + o.b);"###;
    let config = r#"{
    "evaluate": true,
    "hoist_props": true,
    "join_vars": true,
    "passes": 4,
    "reduce_vars": true,
    "toplevel": true,
    "unused": true
}"#;

    run_exec_test(src, config, false);
}

#[test]
fn terser_hoist_props_direct_access_1() {
    let src = r###"var a = 0;
var obj = { a: 1, b: 2 };
for (var k in obj) a++;
console.log(a, obj.a);"###;
    let config = r#"{
    "hoist_props": true,
    "reduce_funcs": true,
    "reduce_vars": true,
    "toplevel": true,
    "unused": true
}"#;

    run_exec_test(src, config, false);
}

#[test]
fn terser_hoist_props_issue_2473_3() {
    let src = r###"var o = { a: 1, b: 2 };
console.log(o.a, o.b);"###;
    let config = r#"{
    "hoist_props": true,
    "reduce_vars": true,
    "top_retain": "o",
    "toplevel": true,
    "unused": true
}"#;

    run_exec_test(src, config, false);
}

#[test]
fn terser_hoist_props_issue_2473_4() {
    let src = r###"(function () {
    var o = { a: 1, b: 2 };
    console.log(o.a, o.b);
})();"###;
    let config = r#"{
    "hoist_props": true,
    "reduce_vars": true,
    "top_retain": "o",
    "toplevel": true,
    "unused": true
}"#;

    run_exec_test(src, config, false);
}

#[test]
fn terser_hoist_props_toplevel_const() {
    let src = r###"const a = { b: 1, c: 2 };
console.log(a.b + a.c);"###;
    let config = r#"{
    "hoist_props": true,
    "reduce_vars": true,
    "toplevel": false
}"#;

    run_exec_test(src, config, false);
}

#[test]
fn terser_hoist_props_issue_2377_3() {
    let src = r###"var obj = {
    foo: 1,
    bar: 2,
    square: function (x) {
        return x * x;
    },
    cube: function (x) {
        return x * x * x;
    },
};
console.log(obj.foo, obj.cube(3));"###;
    let config = r#"{
    "evaluate": true,
    "hoist_props": true,
    "inline": true,
    "passes": 4,
    "reduce_funcs": true,
    "reduce_vars": true,
    "side_effects": true,
    "toplevel": true,
    "unused": true
}"#;

    run_exec_test(src, config, false);
}

#[test]
fn terser_hoist_props_issue_2508_2() {
    let src = r###"var o = {
    a: { b: 2 },
    f: function (x) {
        console.log(x);
    },
};
o.f(o.a);"###;
    let config = r#"{
    "collapse_vars": true,
    "hoist_props": true,
    "reduce_vars": true,
    "toplevel": true,
    "unused": true
}"#;

    run_exec_test(src, config, false);
}

#[test]
#[ignore = "Function anonymous"]
fn terser_hoist_props_issue_2508_5() {
    let src = r###"var o = {
    f: function (x) {
        console.log(x);
    },
};
o.f(o.f);"###;
    let config = r#"{
    "collapse_vars": true,
    "hoist_props": true,
    "reduce_vars": true,
    "toplevel": true,
    "unused": true
}"#;

    run_exec_test(src, config, false);
}

#[test]
fn terser_hoist_props_issue_2377_2() {
    let src = r###"var obj = {
    foo: 1,
    bar: 2,
    square: function (x) {
        return x * x;
    },
    cube: function (x) {
        return x * x * x;
    },
};
console.log(obj.foo, obj.cube(3));"###;
    let config = r#"{
    "evaluate": true,
    "hoist_props": true,
    "inline": true,
    "passes": 2,
    "reduce_funcs": true,
    "reduce_vars": true,
    "toplevel": true,
    "unused": true
}"#;

    run_exec_test(src, config, false);
}

#[test]
fn terser_hoist_props_toplevel_var() {
    let src = r###"var a = { b: 1, c: 2 };
console.log(a.b + a.c);"###;
    let config = r#"{
    "hoist_props": true,
    "reduce_vars": true,
    "toplevel": false
}"#;

    run_exec_test(src, config, false);
}

#[test]
fn terser_hoist_props_issue_3046() {
    let src = r###"console.log(
    (function (a) {
        do {
            var b = { c: a++ };
        } while (b.c && a);
        return a;
    })(0)
);"###;
    let config = r#"{
    "hoist_props": true,
    "reduce_vars": true
}"#;

    run_exec_test(src, config, false);
}

#[test]
fn terser_hoist_props_name_collision_3() {
    let src = r#"var o = {
        p: 1,
        "+": function (x) {
            return x;
        },
        "-": function (x) {
            return x + 1;
        },
    },
    o__$0 = 2,
    o__$1 = 3;
console.log(o.p === o.p, o["+"](4), o["-"](5));"#;
    let config = r#"{
    "hoist_props": true,
    "reduce_funcs": true,
    "reduce_vars": true,
    "toplevel": true
}"#;

    run_exec_test(src, config, false);
}

#[test]
fn terser_hoist_props_hoist_class_with_new() {
    let src = r###"var o = {
    p: class Foo {
        constructor(value) {
            this.value = value * 10;
        }
    },
    x: 1,
    y: 2,
};
console.log(o.p.name, o.p === o.p, new o.p(o.x).value, new o.p(o.y).value);"###;
    let config = r#"{
    "comparisons": true,
    "evaluate": true,
    "hoist_props": true,
    "inline": true,
    "keep_classnames": true,
    "keep_fnames": true,
    "passes": 2,
    "reduce_funcs": true,
    "reduce_vars": true,
    "toplevel": true,
    "unused": true
}"#;

    run_exec_test(src, config, true);
}

#[test]
fn terser_hoist_props_hoist_function_with_call() {
    let src = r###"var o = {
    p: function Foo(value) {
        return 10 * value;
    },
    x: 1,
    y: 2,
};
console.log(o.p.name, o.p === o.p, o.p(o.x), o.p(o.y));"###;
    let config = r#"{
    "comparisons": true,
    "evaluate": true,
    "hoist_props": true,
    "inline": true,
    "keep_fnames": true,
    "passes": 2,
    "reduce_funcs": true,
    "reduce_vars": true,
    "toplevel": true,
    "unused": true
}"#;

    run_exec_test(src, config, false);
}

#[test]
fn terser_hoist_props_name_collision_2() {
    let src = r#"var o = {
        p: 1,
        "+": function (x) {
            return x;
        },
        "-": function (x) {
            return x + 1;
        },
    },
    o__$0 = 2,
    o__$1 = 3;
console.log(o.p === o.p, o["+"](4), o["-"](5), o__$0, o__$1);"#;
    let config = r#"{
    "hoist_props": true,
    "reduce_funcs": true,
    "reduce_vars": true,
    "toplevel": true
}"#;

    run_exec_test(src, config, false);
}

#[test]
fn terser_hoist_props_direct_access_2() {
    let src = r#"var o = { a: 1 };
var f = function (k) {
    if (o[k]) return "PASS";
};
console.log(f("a"));"#;
    let config = r#"{
    "hoist_props": true,
    "reduce_funcs": true,
    "reduce_vars": true,
    "toplevel": true,
    "unused": true
}"#;

    run_exec_test(src, config, false);
}

#[test]
fn terser_hoist_props_hoist_class() {
    let src = r###"function run(c, v) {
    return new c(v).value;
}
var o = {
    p: class Foo {
        constructor(value) {
            this.value = value * 10;
        }
    },
    x: 1,
    y: 2,
};
console.log(o.p.name, o.p === o.p, run(o.p, o.x), run(o.p, o.y));"###;
    let config = r#"{
    "comparisons": true,
    "evaluate": true,
    "hoist_props": true,
    "inline": true,
    "keep_classnames": true,
    "keep_fnames": true,
    "passes": 2,
    "reduce_funcs": true,
    "reduce_vars": true,
    "toplevel": true,
    "unused": true
}"#;

    run_exec_test(src, config, true);
}

#[test]
fn terser_hoist_props_issue_2519() {
    let src = r###"function testFunc() {
    var dimensions = { minX: 5, maxX: 6 };
    var scale = 1;
    var d = { x: (dimensions.maxX + dimensions.minX) / 2 };
    return d.x * scale;
}
console.log(testFunc());"###;
    let config = r#"{
    "collapse_vars": true,
    "evaluate": true,
    "hoist_props": true,
    "reduce_vars": true,
    "unused": true
}"#;

    run_exec_test(src, config, false);
}

#[test]
fn terser_hoist_props_issue_2377_1() {
    let src = r###"var obj = {
    foo: 1,
    bar: 2,
    square: function (x) {
        return x * x;
    },
    cube: function (x) {
        return x * x * x;
    },
};
console.log(obj.foo, obj.cube(3));"###;
    let config = r#"{
    "evaluate": true,
    "hoist_props": true,
    "inline": true,
    "reduce_funcs": true,
    "reduce_vars": true,
    "toplevel": true,
    "unused": true
}"#;

    run_exec_test(src, config, false);
}

#[test]
#[ignore = "Function anoymous"]
fn terser_hoist_props_issue_2508_6() {
    let src = r###"var o = {
    f: (x) => {
        console.log(x);
    },
};
o.f(o.f);"###;
    let config = r#"{
    "collapse_vars": true,
    "hoist_props": true,
    "reduce_vars": true,
    "toplevel": true,
    "unused": true
}"#;

    run_exec_test(src, config, false);
}

#[test]
fn terser_hoist_props_issue_2508_1() {
    let src = r###"var o = {
    a: [1],
    f: function (x) {
        console.log(x);
    },
};
o.f(o.a);"###;
    let config = r#"{
    "collapse_vars": true,
    "hoist_props": true,
    "reduce_vars": true,
    "toplevel": true,
    "unused": true
}"#;

    run_exec_test(src, config, false);
}

#[test]
fn terser_identity_inline_identity_extra_params() {
    let src = r###"const id = (x) => x;
console.log(id(1, console.log(2)), id(3, 4));"###;
    let config = r#"{
    "inline": true,
    "reduce_vars": true,
    "unused": true,
    "toplevel": true
}"#;

    run_exec_test(src, config, false);
}

#[test]
fn terser_identity_inline_identity_function() {
    let src = r###"function id(x) {
    return x;
}
console.log(id(1), id(2));"###;
    let config = r#"{
    "inline": true,
    "reduce_vars": true,
    "unused": true,
    "toplevel": true
}"#;

    run_exec_test(src, config, false);
}

#[test]
fn terser_identity_inline_identity_duplicate_arg_var() {
    let src = r###"const id = (x) => {
    return x;
    var x;
};
console.log(id(1), id(2));"###;
    let config = r#"{
    "inline": true,
    "reduce_vars": true,
    "unused": true,
    "toplevel": true
}"#;

    run_exec_test(src, config, false);
}

#[test]
fn terser_template_string_regex_2() {
    let src = r#"console.log(`${/a/} ${6 / 2} ${/b/.test("b")} ${1 ? /c/ : /d/}`);"#;
    let config = r#"{
    "evaluate": true,
    "unsafe": true
}"#;

    run_exec_test(src, config, false);
}

#[test]
fn terser_template_string_evaluate_nested_templates() {
    let src = r###"/*#__NOINLINE__*/ const any = 'any string, but should not be inlined';

var foo = `${`${`${`foo`}`}`}`;
var bar = `before ${`innerBefore ${any} innerAfter`} after`;
var baz = `1 ${2 + `3 ${any} 4` + 5} 6`;

console.log(foo);
console.log(bar);
console.log(baz);"###;
    let config = r#"{
    "evaluate": true
}"#;

    run_exec_test(src, config, false);
}

#[test]
fn terser_destructuring_destructuring_assign_of_computed_key() {
    let src = r###"let x;
let four = 4;
({ [5 + 2 - four]: x } = { [1 + 2]: 42 });
console.log(x);"###;
    let config = r#"{
    "evaluate": true,
    "unused": true
}"#;

    run_exec_test(src, config, false);
}

#[test]
fn terser_destructuring_unused_destructuring_getter_side_effect_2() {
    let src = r#"function extract(obj) {
    const { a: a, b: b } = obj;
    console.log(b);
}
extract({ a: 1, b: 2 });
extract({
    get a() {
        var s = "side effect";
        console.log(s);
        return s;
    },
    b: 4,
});"#;
    let config = r#"{
    "pure_getters": true,
    "unused": true
}"#;

    run_exec_test(src, config, false);
}

#[test]
fn terser_destructuring_mangle_destructuring_decl_array() {
    let src = r###"var [, t, e, n, s, o = 2, r = [1 + 2]] = [9, 8, 7, 6];
console.log(t, e, n, s, o, r);"###;
    let config = r#"{
    "evaluate": true,
    "unused": true,
    "toplevel": true
}"#;

    run_exec_test(src, config, false);
}

#[test]
fn terser_destructuring_issue_3205_4() {
    let src = r#"(function () {
    function f(o) {
        var { a: x } = o;
        console.log(x);
    }
    f({ a: "PASS" });
})();"#;
    let config = r#"{
    "inline": 3,
    "side_effects": true,
    "unused": true
}"#;

    run_exec_test(src, config, false);
}

#[test]
fn terser_destructuring_issue_3205_3() {
    let src = r#"(function () {
    function f(o, { a: x } = o) {
        console.log(x);
    }
    f({ a: "PASS" });
})();"#;
    let config = r#"{
    "inline": 3,
    "side_effects": true,
    "unused": true
}"#;

    run_exec_test(src, config, false);
}

#[test]
fn terser_destructuring_unused_destructuring_multipass() {
    let src = r###"let { w: w, x: y, z: z } = { x: 1, y: 2, z: 3 };
console.log(y);
if (0) {
    console.log(z);
}"###;
    let config = r#"{
    "conditionals": true,
    "evaluate": true,
    "toplevel": true,
    "passes": 2,
    "pure_getters": true,
    "side_effects": true,
    "unused": true
}"#;

    run_exec_test(src, config, false);
}

#[test]
fn terser_destructuring_arrow_func_with_destructuring_args() {
    let src = r###"(({ foo: foo = 1 + 0, bar: bar = 2 }, [car = 3, far = 4]) => {
    console.log(foo, bar, car, far);
})({ bar: 5 - 0 }, [, 6]);"###;
    let config = r#"{
    "evaluate": true,
    "unused": true,
    "toplevel": true
}"#;

    run_exec_test(src, config, false);
}

#[test]
fn terser_destructuring_issue_3205_2() {
    let src = r#"(function () {
    function f() {
        var o = { a: "PASS" },
            { a: x } = o;
        console.log(x);
    }
    f();
})();"#;
    let config = r#"{
    "inline": 3,
    "side_effects": true,
    "unused": true
}"#;

    run_exec_test(src, config, false);
}

#[test]
fn terser_destructuring_empty_object_destructuring_3() {
    let src = r#"var {} = Object;
let { L: L } = Object,
    L2 = "foo";
const bar = "bar",
    { prop: C1, C2: C2 = console.log("side effect"), C3: C3 } = Object;"#;
    let config = r#"{
    "pure_getters": true,
    "toplevel": true,
    "unused": true
}"#;

    run_exec_test(src, config, false);
}

#[test]
fn terser_destructuring_empty_object_destructuring_4() {
    let src = r#"var {} = Object;
let { L: L } = Object,
    L2 = "foo";
const bar = "bar",
    { prop: C1, C2: C2 = console.log("side effect"), C3: C3 } = Object;"#;
    let config = r#"{
    "pure_getters": true,
    "toplevel": true,
    "unsafe": true,
    "unused": true
}"#;

    run_exec_test(src, config, false);
}

#[test]
fn terser_destructuring_issue_3205_5() {
    let src = r#"(function () {
    function f(g) {
        var o = g,
            { a: x } = o;
        console.log(x);
    }
    f({ a: "PASS" });
})();"#;
    let config = r#"{
    "inline": 3,
    "passes": 4,
    "reduce_vars": true,
    "side_effects": true,
    "unused": true
}"#;

    run_exec_test(src, config, false);
}

#[test]
fn terser_destructuring_unused_destructuring_decl_1() {
    let src = r###"let { x: L, y: y } = { x: 2 };
var { U: u, V: V } = { V: 3 };
const { C: C, D: D } = { C: 1, D: 4 };
console.log(L, V);"###;
    let config = r#"{
    "pure_getters": true,
    "toplevel": true,
    "unused": true
}"#;

    run_exec_test(src, config, false);
}

#[test]
fn terser_destructuring_mangle_destructuring_decl() {
    let src = r###"function test(opts) {
    let a = opts.a || { e: 7, n: 8 };
    let { t: t, e: e, n: n, s: s = 5 + 4, o: o, r: r } = a;
    console.log(t, e, n, s, o, r);
}
test({ a: { t: 1, e: 2, n: 3, s: 4, o: 5, r: 6 } });
test({});"###;
    let config = r#"{
    "evaluate": true,
    "unused": true
}"#;

    run_exec_test(src, config, false);
}

#[test]
fn terser_destructuring_unused_destructuring_arrow_param() {
    let src = r#"let bar = ({ w: w = console.log("side effect"), x: x, y: z }) => {
    console.log(x);
};
bar({ x: 4, y: 5, z: 6 });"#;
    let config = r#"{
    "pure_getters": true,
    "unused": true
}"#;

    run_exec_test(src, config, false);
}

#[test]
fn terser_destructuring_anon_func_with_destructuring_args() {
    let src = r###"(function ({ foo: foo = 1 + 0, bar: bar = 2 }, [car = 3, far = 4]) {
    console.log(foo, bar, car, far);
})({ bar: 5 - 0 }, [, 6]);"###;
    let config = r#"{
    "evaluate": true,
    "unused": true,
    "toplevel": true
}"#;

    run_exec_test(src, config, false);
}

#[test]
fn terser_destructuring_mangle_destructuring_assign_toplevel_true() {
    let src = r###"function test(opts) {
    let s, o, r;
    let a = opts.a || { e: 7, n: 8 };
    ({ t, e, n, s = 5 + 4, o, r } = a);
    console.log(t, e, n, s, o, r);
}
let t, e, n;
test({ a: { t: 1, e: 2, n: 3, s: 4, o: 5, r: 6 } });
test({});"###;
    let config = r#"{
    "toplevel": true,
    "evaluate": true,
    "unused": true
}"#;

    run_exec_test(src, config, false);
}

#[test]
fn terser_destructuring_mangle_destructuring_decl_collapse_vars() {
    let src = r###"function test(opts) {
    let a = opts.a || { e: 7, n: 8 };
    let { t: t, e: e, n: n, s: s = 5 + 4, o: o, r: r } = a;
    console.log(t, e, n, s, o, r);
}
test({ a: { t: 1, e: 2, n: 3, s: 4, o: 5, r: 6 } });
test({});"###;
    let config = r#"{
    "collapse_vars": true,
    "evaluate": true,
    "unused": true
}"#;

    run_exec_test(src, config, false);
}

#[test]
fn terser_destructuring_unused_destructuring_decl_5() {
    let src = r###"const { a: a, b: c, d: d = new Object(1) } = { b: 7 };
let { e: e, f: g, h: h = new Object(2) } = { e: 8 };
var { w: w, x: y, z: z = new Object(3) } = { w: 4, x: 5, y: 6 };
console.log(c, e, z + 0);"###;
    let config = r#"{
    "pure_getters": true,
    "toplevel": true,
    "top_retain": ["a", "e", "w"],
    "unused": true
}"#;

    run_exec_test(src, config, false);
}

#[test]
fn terser_destructuring_mangle_destructuring_assign_toplevel_false() {
    let src = r###"function test(opts) {
    let s, o, r;
    let a = opts.a || { e: 7, n: 8 };
    ({ t, e, n, s = 9, o, r } = a);
    console.log(t, e, n, s, o, r);
}
let t, e, n;
test({ a: { t: 1, e: 2, n: 3, s: 4, o: 5, r: 6 } });
test({});"###;
    let config = r#"{
    "toplevel": false,
    "evaluate": true,
    "unused": true
}"#;

    run_exec_test(src, config, false);
}

#[test]
fn terser_arrow_issue_2105_2() {
    let src = r#"((factory) => {
    factory();
})(() =>
    ((fn) => {
        fn()().prop();
    })(() => {
        let bar = () => {
            var quux = () => {
                    console.log("PASS");
                },
                foo = () => {
                    console.log;
                    quux();
                };
            return { prop: foo };
        };
        return bar;
    })
);"#;
    let config = r#"{
    "collapse_vars": true,
    "inline": true,
    "passes": 2,
    "reduce_funcs": true,
    "reduce_vars": true,
    "side_effects": true,
    "unused": true
}"#;

    run_exec_test(src, config, false);
}

#[test]
fn terser_arrow_issue_2105_1() {
    let src = r#"!(function (factory) {
    factory();
})(function () {
    return (function (fn) {
        fn()().prop();
    })(function () {
        function bar() {
            var quux = function () {
                    console.log("PASS");
                },
                foo = function () {
                    console.log;
                    quux();
                };
            return { prop: foo };
        }
        return bar;
    });
});"#;
    let config = r#"{
    "unsafe_arrows": true,
    "collapse_vars": true,
    "ecma": 2015,
    "inline": true,
    "passes": 3,
    "reduce_funcs": true,
    "reduce_vars": true,
    "side_effects": true,
    "unsafe_methods": true,
    "unused": true
}"#;

    run_exec_test(src, config, false);
}

#[test]
fn terser_arrow_issue_2084() {
    let src = r###"var c = 0;
!(function () {
    !(function (c) {
        c = 1 + c;
        var c = 0;
        function f14(a_1) {
            if (((c = 1 + c), 0 !== (23).toString()))
                (c = 1 + c), a_1 && (a_1[0] = 0);
        }
        f14();
    })(-1);
})();
console.log(c);"###;
    let config = r#"{
    "unsafe_arrows": true,
    "collapse_vars": true,
    "conditionals": true,
    "ecma": 2015,
    "evaluate": true,
    "inline": true,
    "passes": 2,
    "reduce_funcs": true,
    "reduce_vars": true,
    "sequences": true,
    "side_effects": true,
    "unused": true
}"#;

    run_exec_test(src, config, false);
}

#[test]
fn terser_issue_t120_issue_t120_4() {
    let src = r###"for (
    var x = 1,
        t = (o) => {
            var i = +o;
            return console.log(i + i) && 0;
        };
    x--;
    t(2)
);"###;
    let config = r#"{
    "defaults": true,
    "inline": 3,
    "toplevel": true
}"#;

    run_exec_test(src, config, false);
}

#[test]
fn terser_issue_t120_issue_t120_5() {
    let src = r###"for (
    var x = 1,
        t = (o) => {
            var i = +o;
            return console.log(i + i) && 0;
        };
    x--;

)
    t(3);"###;
    let config = r#"{
    "defaults": true,
    "inline": 3,
    "toplevel": true
}"#;

    run_exec_test(src, config, false);
}

#[test]
fn terser_class_properties_mangle_keep_quoted() {
    let src = r#"class Foo {
    bar = "bar";
    static zzz = "zzz";
    toString() {
        return this.bar + Foo.zzz;
    }
}

console.log(new Foo().toString())"#;
    let config = r###"{}"###;

    run_exec_test(src, config, false);
}

#[test]
fn terser_class_properties_static_means_execution() {
    let src = r#"let x = 0;
class NoProps {}
class WithProps {
    prop = (x = x === 1 ? "PASS" : "FAIL");
}
class WithStaticProps {
    static prop = (x = x === 0 ? 1 : "FAIL");
}
new NoProps();
new WithProps();
new WithStaticProps();
console.log(x);"#;
    let config = r#"{
    "toplevel": true,
    "reduce_vars": true,
    "unused": true
}"#;

    run_exec_test(src, config, false);
}

#[test]
fn terser_issue_1447_conditional_false_stray_else_in_loop() {
    let src = r###"for (var i = 1; i <= 4; ++i) {
    if (i <= 2) continue;
    console.log(i);
}"###;
    let config = r#"{
    "booleans": true,
    "comparisons": true,
    "conditionals": false,
    "dead_code": true,
    "evaluate": true,
    "hoist_vars": true,
    "if_return": true,
    "join_vars": true,
    "loops": true,
    "side_effects": true,
    "unused": true
}"#;

    run_exec_test(src, config, false);
}

#[test]
fn terser_harmony_object_spread_unsafe() {
    let src = r###"var o1 = { x: 1, y: 2 };
var o2 = { x: 3, z: 4 };
var cloned = { ...o1 };
var merged = { ...o1, ...o2 };
console.log(cloned, merged);"###;
    let config = r#"{
    "collapse_vars": true,
    "evaluate": true,
    "join_vars": true,
    "passes": 3,
    "reduce_funcs": true,
    "reduce_vars": true,
    "side_effects": true,
    "toplevel": true,
    "unsafe": true,
    "unused": true
}"#;

    run_exec_test(src, config, false);
}

#[test]
fn terser_harmony_issue_2794_4() {
    let src = r###"for (var x of ([1, 2], [3, 4])) {
    console.log(x);
}"###;
    let config = r###"{}"###;

    run_exec_test(src, config, false);
}

#[test]
fn terser_harmony_issue_2794_3() {
    let src = r###"function foo() {
    for (const a of func(value)) {
        console.log(a);
    }
    function func(va) {
        return doSomething(va);
    }
}
function doSomething(x) {
    return [x, 2 * x, 3 * x];
}
const value = 10;
foo();"###;
    let config = r#"{
    "collapse_vars": true,
    "evaluate": true,
    "inline": 3,
    "passes": 3,
    "properties": true,
    "reduce_funcs": true,
    "reduce_vars": true,
    "toplevel": true,
    "side_effects": true,
    "unused": true
}"#;

    run_exec_test(src, config, false);
}

#[test]
fn terser_harmony_array_spread_of_sequence() {
    let src = r###"var a = [1];
console.log([...(a, a)]);
console.log([...a, a]);
console.log([...(a || a)]);
console.log([...(a || a)]);"###;
    let config = r###"{}"###;

    run_exec_test(src, config, false);
}

#[test]
fn terser_harmony_issue_2794_2() {
    let src = r###"function foo() {
    for (const a of func(value)) {
        console.log(a);
    }
    function func(va) {
        return doSomething(va);
    }
}
function doSomething(x) {
    return [x, 2 * x, 3 * x];
}
const value = 10;
foo();"###;
    let config = r#"{
    "collapse_vars": true,
    "evaluate": true,
    "inline": true,
    "passes": 1,
    "properties": true,
    "reduce_funcs": true,
    "reduce_vars": true,
    "toplevel": false,
    "side_effects": true,
    "unused": true
}"#;

    run_exec_test(src, config, false);
}

#[test]
fn terser_harmony_issue_2874_1() {
    let src = r#"(function () {
    function foo() {
        let letters = ["A", "B", "C"];
        let result = [2, 1, 0].map((key) => bar(letters[key] + key));
        return result;
    }
    function bar(value) {
        return () => console.log(value);
    }
    foo().map((fn) => fn());
})();"#;
    let config = r#"{
    "collapse_vars": true,
    "evaluate": true,
    "inline": 3,
    "reduce_funcs": true,
    "reduce_vars": true,
    "sequences": true,
    "side_effects": true,
    "unused": true
}"#;

    run_exec_test(src, config, false);
}

#[test]
fn terser_harmony_issue_2762() {
    let src = r###"var bar = 1,
    T = true;
(function () {
    if (T) {
        const a = function () {
            var foo = bar;
            console.log(foo, a.prop, b.prop);
        };
        a.prop = 2;
        const b = { prop: 3 };
        a();
    }
})();"###;
    let config = r###"{}"###;

    run_exec_test(src, config, false);
}

#[test]
fn terser_harmony_issue_1898() {
    let src = r###"class Foo {
    bar() {
        for (const x of [6, 5]) {
            for (let y of [4, 3]) {
                for (var z of [2, 1]) {
                    console.log(x, y, z);
                }
            }
        }
    }
}
new Foo().bar();"###;
    let config = r###"{}"###;

    run_exec_test(src, config, false);
}

#[test]
fn terser_harmony_issue_2794_6() {
    let src = r###"for (let e of ([1, 2], [3, 4, 5])) {
    console.log(e);
}"###;
    let config = r###"{}"###;

    run_exec_test(src, config, false);
}

#[test]
fn terser_harmony_issue_2794_1() {
    let src = r###"function foo() {
    for (const a of func(value)) {
        console.log(a);
    }
    function func(va) {
        return doSomething(va);
    }
}
function doSomething(x) {
    return [x, 2 * x, 3 * x];
}
const value = 10;
foo();"###;
    let config = r#"{
    "collapse_vars": true,
    "evaluate": true,
    "inline": true,
    "passes": 1,
    "properties": true,
    "reduce_funcs": true,
    "reduce_vars": true,
    "toplevel": false,
    "side_effects": true,
    "unused": true
}"#;

    run_exec_test(src, config, false);
}

#[test]
fn terser_harmony_issue_2874_2() {
    let src = r#"(function () {
    let keys = [];
    function foo() {
        var result = [2, 1, 0].map((value) => {
            keys.push(value);
            return bar();
        });
        return result;
    }
    function bar() {
        var letters = ["A", "B", "C"],
            key = keys.shift();
        return () => console.log(letters[key] + key);
    }
    foo().map((fn) => fn());
})();"#;
    let config = r#"{
    "collapse_vars": true,
    "evaluate": true,
    "inline": 3,
    "reduce_funcs": true,
    "reduce_vars": true,
    "sequences": true,
    "side_effects": true,
    "unused": true
}"#;

    run_exec_test(src, config, false);
}

#[test]
fn terser_harmony_issue_t80() {
    let src = r#"function foo(data = []) {
    var u,
        v = "unused";
    if (arguments.length == 1) {
        data = [data];
    }
    return data;
}
console.log(JSON.stringify([foo(), foo(null), foo(5, 6)]));"#;
    let config = r#"{
    "unused": true
}"#;

    run_exec_test(src, config, false);
}

#[test]
fn terser_harmony_issue_2349() {
    let src = r#"function foo(boo, key) {
    const value = boo.get();
    return value.map(({ [key]: bar }) => bar);
}
console.log(foo({ get: () => [{ blah: 42 }] }, "blah"));"#;
    let config = r###"{}"###;

    run_exec_test(src, config, false);
}

#[test]
fn terser_harmony_issue_2874_3() {
    let src = r#"function f() {
    return x + y;
}
let x, y;
let a = (z) => {
    x = "A";
    y = z;
    console.log(f());
};
a(1);
a(2);"#;
    let config = r#"{
    "collapse_vars": true,
    "evaluate": true,
    "inline": 3,
    "reduce_funcs": false,
    "reduce_vars": true,
    "sequences": true,
    "side_effects": true,
    "toplevel": true,
    "unused": true
}"#;

    run_exec_test(src, config, false);
}

#[test]
fn terser_harmony_issue_2349b() {
    let src = r#"function foo(boo, key) {
    const value = boo.get();
    return value.map(function ({ [key]: bar }) {
        return bar;
    });
}
console.log(
    foo(
        {
            get: function () {
                return [{ blah: 42 }];
            },
        },
        "blah"
    )
);"#;
    let config = r#"{
    "arrows": true,
    "collapse_vars": true,
    "ecma": 2015,
    "evaluate": true,
    "inline": true,
    "passes": 3,
    "properties": true,
    "reduce_funcs": true,
    "reduce_vars": true,
    "toplevel": true,
    "side_effects": true,
    "unsafe_arrows": true,
    "unused": true
}"#;

    run_exec_test(src, config, false);
}

#[test]
fn terser_issue_1275_string_plus_optimization() {
    let src = r#"function foo(anything) {
    function throwing_function() {
        throw "nope";
    }
    try {
        console.log("0" + throwing_function() ? "yes" : "no");
    } catch (ex) {
        console.log(ex);
    }
    console.log("0" + anything ? "yes" : "no");
    console.log(anything + "0" ? "Yes" : "No");
    console.log("" + anything);
    console.log(anything + "");
}
foo();"#;
    let config = r#"{
    "booleans": true,
    "comparisons": true,
    "conditionals": true,
    "dead_code": true,
    "evaluate": true,
    "hoist_funs": true,
    "if_return": true,
    "join_vars": true,
    "side_effects": true,
    "unused": true
}"#;

    run_exec_test(src, config, false);
}

#[test]
fn terser_async_async_inline() {
    let src = r#"(async function () {
    return await 3;
})();
(async function (x) {
    await console.log(x);
})(4);
function invoke(x, y) {
    return x(y);
}
invoke(async function () {
    return await 1;
});
invoke(async function (x) {
    await console.log(x);
}, 2);
function top() {
    console.log("top");
}
top();
async function async_top() {
    console.log("async_top");
}
async_top();"#;
    let config = r#"{
    "collapse_vars": true,
    "conditionals": true,
    "evaluate": true,
    "inline": true,
    "negate_iife": true,
    "reduce_funcs": true,
    "reduce_vars": true,
    "side_effects": true,
    "toplevel": true,
    "unused": true
}"#;

    run_exec_test(src, config, false);
}

#[test]
#[ignore]
fn terser_logical_assignments_assign_in_conditional_part() {
    let src = r#"var status = "PASS";
var nil = null;
var nil_prop = { prop: null };
nil &&= console.log((status = "FAIL"));
nil_prop.prop &&= console.log((status = "FAIL"));
console.log(status);"#;
    let config = r#"{
    "toplevel": true,
    "evaluate": true,
    "reduce_vars": true,
    "unused": true
}"#;

    run_exec_test(src, config, false);
}

#[test]
#[ignore]
fn terser_logical_assignments_assignment_in_left_part() {
    let src = r#"var status = "FAIL";
var x = {};
x[(status = "PASS")] ||= 1;
console.log(status);"#;
    let config = r#"{
    "toplevel": true,
    "evaluate": true,
    "reduce_vars": true,
    "unused": true
}"#;

    run_exec_test(src, config, false);
}

#[test]
fn terser_labels_labels_4() {
    let src = r###"out: for (var i = 0; i < 5; ++i) {
    if (i < 3) continue out;
    console.log(i);
}"###;
    let config = r#"{
    "conditionals": true,
    "dead_code": true,
    "if_return": true
}"#;

    run_exec_test(src, config, false);
}

#[test]
fn terser_labels_labels_3() {
    let src = r###"for (var i = 0; i < 5; ++i) {
    if (i < 3) continue;
    console.log(i);
}"###;
    let config = r#"{
    "conditionals": true,
    "dead_code": true,
    "if_return": true
}"#;

    run_exec_test(src, config, false);
}

#[test]
fn terser_labels_labels_6() {
    let src = r###"out: break out;

console.log('PASS')"###;
    let config = r###"{}"###;

    run_exec_test(src, config, false);
}

#[test]
fn terser_issue_t292_no_flatten_with_var_colliding_with_arg_value_inner_scope() {
    let src = r#"var g = ["a"];
function problem(arg) {
    return g.indexOf(arg);
}
function unused(arg) {
    return problem(arg);
}
function a(arg) {
    return problem(arg);
}
function b(test) {
    var problem = test * 2;
    console.log(problem);
    return g[problem];
}
function c(arg) {
    return b(a(arg));
}
console.log(c("a"));"#;
    let config = r#"{
    "collapse_vars": true,
    "inline": true,
    "reduce_funcs": true,
    "reduce_vars": true,
    "sequences": true,
    "toplevel": true,
    "unused": true
}"#;

    run_exec_test(src, config, false);
}

#[test]
fn terser_issue_t292_no_flatten_with_arg_colliding_with_arg_value_inner_scope() {
    let src = r#"var g = ["a"];
function problem(arg) {
    return g.indexOf(arg);
}
function unused(arg) {
    return problem(arg);
}
function a(arg) {
    return problem(arg);
}
function b(problem) {
    return g[problem];
}
function c(arg) {
    return b(a(arg));
}
console.log(c("a"));"#;
    let config = r#"{
    "collapse_vars": true,
    "inline": true,
    "reduce_funcs": true,
    "reduce_vars": true,
    "sequences": true,
    "toplevel": true,
    "unused": true
}"#;

    run_exec_test(src, config, false);
}

#[test]
fn terser_issue_1770_numeric_literal() {
    let src = r#"var obj = {
    0: 0,
    "-0": 1,
    42: 2,
    42: 3,
    37: 4,
    o: 5,
    1e42: 6,
    j: 7,
    1e42: 8,
};

console.log(obj[-0], obj[-""], obj["-0"]);

console.log(obj[42], obj["42"]);

console.log(obj[37], obj["o"], obj[37], obj["37"]);

console.log(obj[1e42], obj["j"], obj["1e+42"]);"#;
    let config = r###"{}"###;

    run_exec_test(src, config, false);
}

#[test]
fn terser_issue_1770_mangle_props() {
    let src = r#"var obj = { undefined: 1, NaN: 2, Infinity: 3, "-Infinity": 4, null: 5 };
console.log(
    obj[void 0],
    obj[undefined],
    obj["undefined"],
    obj[0 / 0],
    obj[NaN],
    obj["NaN"],
    obj[1 / 0],
    obj[Infinity],
    obj["Infinity"],
    obj[-1 / 0],
    obj[-Infinity],
    obj["-Infinity"],
    obj[null],
    obj["null"]
);"#;
    let config = r###"{}"###;

    run_exec_test(src, config, false);
}

#[test]
fn terser_issue_1105_infinity_not_in_with_scope() {
    let src = r#"var o = { Infinity: "oInfinity" };
var vInfinity = "Infinity";
vInfinity = Infinity;

console.log(o)
console.log(vInfinity)"#;
    let config = r#"{
    "unused": true
}"#;

    run_exec_test(src, config, false);
}

#[test]
fn terser_reduce_vars_issue_3113_1() {
    let src = r###"var c = 0;
(function () {
    function f() {
        while (g());
    }
    var a = f();
    function g() {
        a && a[c++];
    }
    g((a = 1));
})();
console.log(c);"###;
    let config = r#"{
    "evaluate": true,
    "reduce_vars": true
}"#;

    run_exec_test(src, config, false);
}

#[test]
fn terser_reduce_vars_issue_2799_2() {
    let src = r#"(function () {
    function foo() {
        Function.prototype.call.apply(console.log, [null, "PASS"]);
    }
    foo();
})();"#;
    let config = r#"{
    "reduce_vars": true,
    "unsafe_proto": true,
    "unused": true
}"#;

    run_exec_test(src, config, false);
}

#[test]
fn terser_reduce_vars_recursive_inlining_1() {
    let src = r#"!(function () {
    function foo() {
        bar();
    }
    function bar() {
        foo();
    }
    console.log("PASS");
})();"#;
    let config = r#"{
    "reduce_funcs": true,
    "reduce_vars": true,
    "unused": true
}"#;

    run_exec_test(src, config, false);
}

#[test]
fn terser_reduce_vars_var_assign_2() {
    let src = r###"!(function () {
    var a;
    if ((a = 2)) console.log(a);
})();"###;
    let config = r#"{
    "evaluate": true,
    "reduce_funcs": true,
    "reduce_vars": true,
    "sequences": true,
    "side_effects": true,
    "unused": true
}"#;

    run_exec_test(src, config, false);
}

#[test]
fn terser_reduce_vars_issue_2757_1() {
    let src = r###"let u;
(function () {
    let v;
    console.log(u, v);
})();"###;
    let config = r#"{
    "evaluate": true,
    "inline": true,
    "reduce_vars": true,
    "side_effects": true,
    "unused": true
}"#;

    run_exec_test(src, config, false);
}

#[test]
fn terser_reduce_vars_inverted_var() {
    let src = r#"console.log(
    (function () {
        var a = 1;
        return a;
    })(),
    (function () {
        var b;
        b = 2;
        return b;
    })(),
    (function () {
        c = 3;
        return c;
        var c;
    })(),
    (function (c) {
        c = 4;
        return c;
    })(),
    (function (c) {
        c = 5;
        return c;
        var c;
    })(),
    (function c() {
        c = 6;
        return typeof c;
    })(),
    (function c() {
        c = 7;
        return c;
        var c;
    })(),
    (function () {
        c = 8;
        return c;
        var c = "foo";
    })()
);"#;
    let config = r#"{
    "evaluate": true,
    "inline": true,
    "passes": 3,
    "reduce_vars": true,
    "side_effects": true,
    "unused": true
}"#;

    run_exec_test(src, config, false);
}

#[test]
fn terser_reduce_vars_pure_getters_3() {
    let src = r###"var a;
var a = a && a.b;
console.log(a && a.b)"###;
    let config = r#"{
    "pure_getters": true,
    "reduce_funcs": true,
    "reduce_vars": true,
    "toplevel": true,
    "unused": true
}"#;

    run_exec_test(src, config, false);
}

#[test]
fn terser_reduce_vars_unsafe_evaluate_side_effect_free_1() {
    let src = r###"console.log(
    (function () {
        var o = { p: 1 };
        console.log(o.p);
        return o.p;
    })()
);
console.log(
    (function () {
        var o = { p: 2 };
        console.log(o.p);
        return o;
    })()
);
console.log(
    (function () {
        var o = { p: 3 };
        console.log([o][0].p);
        return o.p;
    })()
);"###;
    let config = r#"{
    "evaluate": true,
    "reduce_funcs": true,
    "reduce_vars": true,
    "unsafe": true,
    "unused": true
}"#;

    run_exec_test(src, config, false);
}

#[test]
fn terser_reduce_vars_issue_2420_2() {
    let src = r#"function f() {
    var that = this;
    if (that.bar) that.foo();
    else
        !(function (that, self) {
            console.log(this === that, self === this, that === self);
        })(that, this);
}
f.call({
    bar: 1,
    foo: function () {
        console.log("foo", this.bar);
    },
});
f.call({});"#;
    let config = r#"{
    "reduce_funcs": true,
    "reduce_vars": true,
    "unused": true
}"#;

    run_exec_test(src, config, false);
}

#[test]
fn terser_reduce_vars_escape_expansion() {
    let src = r#"function main() {
    var thing = baz();
    if (thing !== (thing = baz())) console.log("FAIL");
    else console.log("PASS");
}
function foo() {}
function bar(...x) {
    return x[0];
}
function baz() {
    return bar(...[foo]);
}
main();"#;
    let config = r#"{
    "reduce_funcs": true,
    "reduce_vars": true,
    "toplevel": true,
    "unused": true
}"#;

    run_exec_test(src, config, false);
}

#[test]
fn terser_reduce_vars_obj_arg_1() {
    let src = r###"var C = 1;
function f(obj) {
    return obj.bar();
}
console.log(
    f({
        bar: function () {
            return C + C;
        },
    })
);"###;
    let config = r#"{
    "collapse_vars": true,
    "evaluate": true,
    "inline": true,
    "passes": 2,
    "reduce_funcs": true,
    "reduce_vars": true,
    "toplevel": true,
    "unused": true
}"#;

    run_exec_test(src, config, false);
}

#[test]
fn terser_reduce_vars_issue_2420_3() {
    let src = r#"function f() {
    var that = this;
    if (that.bar) that.foo();
    else
        ((that, self) => {
            console.log(this === that, self === this, that === self);
        })(that, this);
}
f.call({
    bar: 1,
    foo: function () {
        console.log("foo", this.bar);
    },
});
f.call({});"#;
    let config = r#"{
    "reduce_funcs": true,
    "reduce_vars": true,
    "unused": true
}"#;

    run_exec_test(src, config, false);
}

#[test]
#[ignore]
fn terser_reduce_vars_iife_eval_2() {
    let src = r#"(function () {
    var x = function f() {
        return f;
    };
    console.log(x() === eval("x"));
})();"#;
    let config = r#"{
    "reduce_funcs": true,
    "reduce_vars": true,
    "unused": true
}"#;

    run_exec_test(src, config, false);
}

#[test]
fn terser_reduce_vars_pure_getters_2() {
    let src = r###"var a;
var a = a && a.b;
console.log(a && a.b)"###;
    let config = r#"{
    "pure_getters": "strict",
    "reduce_funcs": true,
    "reduce_vars": true,
    "toplevel": true,
    "unused": true
}"#;

    run_exec_test(src, config, false);
}

#[test]
fn terser_reduce_vars_func_modified() {
    let src = r###"function f(a) {
    function a() {
        return 1;
    }
    function b() {
        return 2;
    }
    function c() {
        return 3;
    }
    b.inject = [];
    c = function () {
        return 4;
    };
    return a() + b() + c();
}

console.log(f(1423796))"###;
    let config = r#"{
    "inline": true,
    "reduce_funcs": true,
    "reduce_vars": true,
    "unused": true
}"#;

    run_exec_test(src, config, false);
}

#[test]
fn terser_reduce_vars_issue_2860_1() {
    let src = r###"console.log(
    (function (a) {
        return (a ^= 1);
        a ^= 2;
    })()
);"###;
    let config = r#"{
    "dead_code": true,
    "evaluate": true,
    "reduce_vars": true
}"#;

    run_exec_test(src, config, false);
}

#[test]
fn terser_reduce_vars_issue_2836() {
    let src = r#"function f() {
    return "FAIL";
}
console.log(f());
function f() {
    return "PASS";
}"#;
    let config = r#"{
    "reduce_vars": true,
    "toplevel": true,
    "unused": true
}"#;

    run_exec_test(src, config, false);
}

#[test]
fn terser_reduce_vars_chained_assignments() {
    let src = r###"function f() {
    var a = [94, 173, 190, 239];
    var b = 0;
    b |= a[0];
    b <<= 8;
    b |= a[1];
    b <<= 8;
    b |= a[2];
    b <<= 8;
    b |= a[3];
    return b;
}
console.log(f().toString(16));"###;
    let config = r#"{
    "evaluate": true,
    "inline": true,
    "reduce_vars": true,
    "sequences": true,
    "side_effects": true,
    "toplevel": true,
    "unsafe": true,
    "unused": true
}"#;

    run_exec_test(src, config, false);
}

#[test]
fn terser_reduce_vars_obj_for_1() {
    let src = r###"var o = { a: 1 };
for (var i = o.a--; i; i--) console.log(i);"###;
    let config = r#"{
    "reduce_funcs": true,
    "reduce_vars": true,
    "toplevel": true,
    "unused": true
}"#;

    run_exec_test(src, config, false);
}

#[test]
fn terser_reduce_vars_iife() {
    let src = r###"!(function (a, b, c) {
    b++;
    console.log(a - 1, b * 1, c + 2);
})(1, 2, 3);"###;
    let config = r#"{
    "evaluate": true,
    "reduce_funcs": true,
    "reduce_vars": true
}"#;

    run_exec_test(src, config, false);
}

#[test]
fn terser_reduce_vars_inner_var_label() {
    let src = r###"function f(a) {
    l: {
        if (a) break l;
        var t = 1;
    }
    console.log(t);
}

f(123123)
f(0)"###;
    let config = r#"{
    "evaluate": true,
    "reduce_funcs": true,
    "reduce_vars": true
}"#;

    run_exec_test(src, config, false);
}

#[test]
fn terser_reduce_vars_side_effects_assign() {
    let src = r###"var a = typeof void (a && a.in == 1, 0);
console.log(a);"###;
    let config = r#"{
    "evaluate": true,
    "reduce_funcs": true,
    "reduce_vars": true,
    "sequences": true,
    "side_effects": true,
    "toplevel": true
}"#;

    run_exec_test(src, config, false);
}

#[test]
fn terser_reduce_vars_defun_catch_6() {
    let src = r###"try {
    throw 42;
} catch (a) {
    console.log(a);
}
function a() {}"###;
    let config = r#"{
    "reduce_vars": true,
    "toplevel": true,
    "unused": true
}"#;

    run_exec_test(src, config, false);
}

#[test]
fn terser_reduce_vars_passes() {
    let src = r###"function f() {
    var a = 1,
        b = 2,
        c = 3;
    if (a) {
        b = c;
    } else {
        c = b;
    }
    console.log(a + b);
    console.log(b + c);
    console.log(a + c);
    console.log(a + b + c);
}

f()"###;
    let config = r#"{
    "conditionals": true,
    "evaluate": true,
    "passes": 2,
    "reduce_funcs": true,
    "reduce_vars": true,
    "unused": true
}"#;

    run_exec_test(src, config, false);
}

#[test]
fn terser_reduce_vars_defun_catch_1() {
    let src = r###"function a() {}
try {
    throw 42;
} catch (a) {
    console.log(a);
}"###;
    let config = r#"{
    "reduce_vars": true,
    "toplevel": true,
    "unused": true
}"#;

    run_exec_test(src, config, false);
}

#[test]
fn terser_reduce_vars_unsafe_evaluate_array_2() {
    let src = r###"var arr = [
    1,
    2,
    function (x) {
        return x * x;
    },
    function (x) {
        return x * x * x;
    },
];
console.log(arr[0], arr[1], arr[2](2), arr[3]);"###;
    let config = r#"{
    "evaluate": true,
    "reduce_funcs": true,
    "reduce_vars": true,
    "toplevel": true,
    "unsafe": true
}"#;

    run_exec_test(src, config, false);
}

#[test]
fn terser_reduce_vars_issue_1670_6() {
    let src = r###"(function (a) {
    switch (1) {
        case (a = 1):
            console.log(a);
            break;
        default:
            console.log(2);
            break;
    }
})(1);"###;
    let config = r#"{
    "dead_code": true,
    "evaluate": true,
    "keep_fargs": false,
    "reduce_funcs": true,
    "reduce_vars": true,
    "side_effects": true,
    "switches": true,
    "unused": true
}"#;

    run_exec_test(src, config, false);
}

#[test]
fn terser_reduce_vars_redefine_farg_1() {
    let src = r###"function f(a) {
    var a;
    return typeof a;
}
function g(a) {
    var a = 42;
    return typeof a;
}
function h(a, b) {
    var a = b;
    return typeof a;
}
console.log(f([]), g([]), h([]));"###;
    let config = r#"{
    "evaluate": true,
    "keep_fargs": false,
    "reduce_funcs": true,
    "reduce_vars": true,
    "unused": true
}"#;

    run_exec_test(src, config, false);
}

#[test]
fn terser_reduce_vars_issue_1670_1() {
    let src = r#"(function f() {
    switch (1) {
        case 0:
            var a = true;
            break;
        default:
            if (typeof a === "undefined") console.log("PASS");
            else console.log("FAIL");
    }
})();"#;
    let config = r#"{
    "comparisons": true,
    "conditionals": true,
    "dead_code": true,
    "evaluate": true,
    "reduce_funcs": true,
    "reduce_vars": true,
    "side_effects": true,
    "switches": true,
    "typeofs": true,
    "unused": true
}"#;

    run_exec_test(src, config, false);
}

#[test]
fn terser_reduce_vars_perf_3() {
    let src = r###"var foo = function (x, y, z) {
    return x < y ? x * y + z : x * z - y;
};
var indirect_foo = function (x, y, z) {
    return foo(x, y, z);
};
var sum = 0;
for (var i = 0; i < 100; ++i) sum += indirect_foo(i, i + 1, 3 * i);
console.log(sum);"###;
    let config = r#"{
    "reduce_funcs": true,
    "reduce_vars": true,
    "toplevel": true,
    "unused": true
}"#;

    run_exec_test(src, config, false);
}

#[test]
fn terser_reduce_vars_defun_var_3() {
    let src = r###"function a() {}
function b() {}
console.log(typeof a, typeof b);
var a = 42,
    b;"###;
    let config = r#"{
    "evaluate": true,
    "reduce_vars": true,
    "toplevel": true,
    "typeofs": true,
    "unused": true
}"#;

    run_exec_test(src, config, false);
}

#[test]
fn terser_reduce_vars_accessor_2() {
    let src = r###"var A = 1;
var B = {
    get c() {
        console.log(A);
    },
};
B.c;"###;
    let config = r#"{
    "collapse_vars": true,
    "evaluate": true,
    "reduce_funcs": true,
    "reduce_vars": true,
    "toplevel": true,
    "unused": true
}"#;

    run_exec_test(src, config, false);
}

#[test]
fn terser_reduce_vars_unused_modified() {
    let src = r#"console.log(
    (function () {
        var b = 1,
            c = "FAIL";
        if (0 || b--) c = "PASS";
        b = 1;
        return c;
    })()
);"#;
    let config = r#"{
    "reduce_vars": true,
    "unused": true
}"#;

    run_exec_test(src, config, false);
}

#[test]
fn terser_reduce_vars_unsafe_evaluate_object_1() {
    let src = r###"function f0() {
    var a = 1;
    var b = {};
    b[a] = 2;
    console.log(a + 3);
}
function f1() {
    var a = { b: 1 };
    a.b = 2;
    console.log(a.b + 3);
}

f0()
f1()"###;
    let config = r#"{
    "evaluate": true,
    "reduce_funcs": true,
    "reduce_vars": true,
    "unsafe": true
}"#;

    run_exec_test(src, config, false);
}

#[test]
fn terser_reduce_vars_duplicate_lambda_defun_name_1() {
    let src = r###"console.log(
    (function f(a) {
        function f() {}
        return f.length;
    })()
);"###;
    let config = r#"{
    "reduce_vars": true
}"#;

    run_exec_test(src, config, false);
}

#[test]
fn terser_reduce_vars_issue_2423_5() {
    let src = r###"function x() {
    y();
}
function y() {
    console.log(1);
}
function z() {
    function y() {
        console.log(2);
    }
    x();
}
z();
z();"###;
    let config = r#"{
    "inline": true,
    "passes": 2,
    "reduce_funcs": true,
    "reduce_vars": true,
    "side_effects": true,
    "toplevel": true,
    "unused": true
}"#;

    run_exec_test(src, config, false);
}

#[test]
fn terser_reduce_vars_unsafe_evaluate_array_4() {
    let src = r###"var arr = [
    1,
    2,
    function () {
        return ++this[0];
    },
];
console.log(arr[0], arr[1], arr[2], arr[0]);"###;
    let config = r#"{
    "evaluate": true,
    "reduce_funcs": true,
    "reduce_vars": true,
    "toplevel": true,
    "unsafe": true
}"#;

    run_exec_test(src, config, false);
}

#[test]
fn terser_reduce_vars_issue_2774() {
    let src = r###"console.log(
    {
        get a() {
            var b;
            (b = true) && b.c;
            b = void 0;
        },
    }.a
);"###;
    let config = r#"{
    "reduce_vars": true,
    "unused": true
}"#;

    run_exec_test(src, config, false);
}

#[test]
fn terser_reduce_vars_lvalues_def_2() {
    let src = r###"var b = 1;
var a = (b += 1),
    b = NaN;
console.log(a, b);"###;
    let config = r#"{
    "reduce_vars": true,
    "toplevel": true,
    "unused": true
}"#;

    run_exec_test(src, config, false);
}

#[test]
fn terser_reduce_vars_func_arg_2() {
    let src = r###"var a = 42;
!(function (a) {
    console.log(a());
})(function (a) {
    return a;
});"###;
    let config = r#"{
    "evaluate": true,
    "inline": true,
    "passes": 2,
    "reduce_funcs": true,
    "reduce_vars": true,
    "side_effects": true,
    "toplevel": true,
    "unused": true
}"#;

    run_exec_test(src, config, false);
}

#[test]
fn terser_reduce_vars_unsafe_evaluate() {
    let src = r###"function f0() {
    var a = { b: 1 };
    console.log(a.b + 3);
}
function f1() {
    var a = { b: { c: 1 }, d: 2 };
    console.log(a.b + 3, a.d + 4, a.b.c + 5, a.d.c + 6);
}

console.log(f0())
console.log(f1())"###;
    let config = r#"{
    "evaluate": true,
    "reduce_funcs": true,
    "reduce_vars": true,
    "side_effects": true,
    "unsafe": true,
    "unused": true
}"#;

    run_exec_test(src, config, false);
}

#[test]
fn terser_reduce_vars_issue_2423_3() {
    let src = r###"function c() {
    return 1;
}
function p() {
    console.log(c());
}
p();"###;
    let config = r#"{
    "reduce_funcs": true,
    "reduce_vars": true,
    "toplevel": true,
    "unused": true
}"#;

    run_exec_test(src, config, false);
}

#[test]
fn terser_reduce_vars_defun_inline_3() {
    let src = r###"function f() {
    return g(2);
    function g(b) {
        return b;
    }
}

console.log(f())"###;
    let config = r#"{
    "evaluate": true,
    "inline": true,
    "passes": 3,
    "reduce_funcs": true,
    "reduce_vars": true,
    "side_effects": true,
    "unused": true
}"#;

    run_exec_test(src, config, false);
}

#[test]
fn terser_reduce_vars_issue_3113_2() {
    let src = r###"var c = 0;
(function () {
    function f() {
        while (g());
    }
    var a = f();
    function g() {
        a && a[c++];
    }
    a = 1;
    g();
})();
console.log(c);"###;
    let config = r#"{
    "evaluate": true,
    "reduce_vars": true
}"#;

    run_exec_test(src, config, false);
}

#[test]
fn terser_reduce_vars_issue_2799_1() {
    let src = r###"console.log(
    (function () {
        return f;
        function f(n) {
            function g(i) {
                return i && i + g(i - 1);
            }
            function h(j) {
                return g(j);
            }
            return h(n);
        }
    })()(5)
);"###;
    let config = r#"{
    "reduce_funcs": true,
    "reduce_vars": true,
    "unused": true
}"#;

    run_exec_test(src, config, false);
}

#[test]
fn terser_reduce_vars_iife_new() {
    let src = r###"var A = new (function (a, b, c) {
    b++;
    console.log(a - 1, b * 1, c + 2);
})(1, 2, 3);"###;
    let config = r#"{
    "evaluate": true,
    "reduce_funcs": true,
    "reduce_vars": true
}"#;

    run_exec_test(src, config, false);
}

#[test]
fn terser_reduce_vars_recursive_inlining_3() {
    let src = r#"!(function () {
    function foo(x) {
        console.log("foo", x);
        if (x) bar(x - 1);
    }
    function bar(x) {
        console.log("bar", x);
        if (x) qux(x - 1);
    }
    function qux(x) {
        console.log("qux", x);
        if (x) foo(x - 1);
    }
    qux(4);
})();"#;
    let config = r#"{
    "passes": 2,
    "reduce_funcs": true,
    "reduce_vars": true,
    "unused": true
}"#;

    run_exec_test(src, config, false);
}

#[test]
fn terser_reduce_vars_recursive_inlining_4() {
    let src = r#"!(function () {
    function foo(x) {
        console.log("foo", x);
        if (x) bar(x - 1);
    }
    function bar(x) {
        console.log("bar", x);
        if (x) qux(x - 1);
    }
    function qux(x) {
        console.log("qux", x);
        if (x) foo(x - 1);
    }
    qux(4);
    bar(5);
})();"#;
    let config = r#"{
    "reduce_funcs": true,
    "reduce_vars": true,
    "unused": true
}"#;

    run_exec_test(src, config, false);
}

#[test]
fn terser_reduce_vars_issue_2757_2() {
    let src = r###"(function () {
    let bar;
    const unused = function () {
        bar = true;
    };
    if (!bar) {
        console.log(1);
    }
    console.log(2);
})();"###;
    let config = r#"{
    "conditionals": true,
    "evaluate": true,
    "inline": true,
    "passes": 2,
    "reduce_vars": true,
    "sequences": true,
    "side_effects": true,
    "unused": true
}"#;

    run_exec_test(src, config, false);
}

#[test]
fn terser_reduce_vars_recursive_inlining_2() {
    let src = r#"!(function () {
    function foo() {
        qux();
    }
    function bar() {
        foo();
    }
    function qux() {
        bar();
    }
    console.log("PASS");
})();"#;
    let config = r#"{
    "reduce_funcs": true,
    "reduce_vars": true,
    "unused": true
}"#;

    run_exec_test(src, config, false);
}

#[test]
fn terser_reduce_vars_var_assign_1() {
    let src = r###"!(function () {
    var a;
    a = 2;
    console.log(a);
})();"###;
    let config = r#"{
    "evaluate": true,
    "reduce_funcs": true,
    "reduce_vars": true,
    "sequences": true,
    "side_effects": true,
    "unused": true
}"#;

    run_exec_test(src, config, false);
}

#[test]
fn terser_reduce_vars_issue_1865() {
    let src = r###"function f(some) {
    some.thing = false;
}
console.log(
    (function () {
        var some = { thing: true };
        f(some);
        return some.thing;
    })()
);"###;
    let config = r#"{
    "evaluate": true,
    "reduce_funcs": true,
    "reduce_vars": true,
    "unsafe": true
}"#;

    run_exec_test(src, config, false);
}

#[test]
fn terser_reduce_vars_issue_2449() {
    let src = r#"var a = "PASS";
function f() {
    return a;
}
function g() {
    return f();
}
(function () {
    var a = "FAIL";
    if (a == a) console.log(g());
})();"#;
    let config = r#"{
    "passes": 10,
    "reduce_funcs": true,
    "reduce_vars": true,
    "toplevel": true,
    "unused": true
}"#;

    run_exec_test(src, config, false);
}

#[test]
fn terser_reduce_vars_issue_2420_1() {
    let src = r#"function run() {
    var self = this;
    if (self.count++) self.foo();
    else self.bar();
}
var o = {
    count: 0,
    foo: function () {
        console.log("foo");
    },
    bar: function () {
        console.log("bar");
    },
};
run.call(o);
run.call(o);"#;
    let config = r#"{
    "reduce_funcs": true,
    "reduce_vars": true,
    "unused": true
}"#;

    run_exec_test(src, config, false);
}

#[test]
fn terser_reduce_vars_issue_2485() {
    let src = r###"var foo = function (bar) {
    var n = function (a, b) {
        return a + b;
    };
    var sumAll = function (arg) {
        return arg.reduce(n, 0);
    };
    var runSumAll = function (arg) {
        return sumAll(arg);
    };
    bar.baz = function (arg) {
        var n = runSumAll(arg);
        return (n.get = 1), n;
    };
    return bar;
};
var bar = foo({});
console.log(bar.baz([1, 2, 3]));"###;
    let config = r#"{
    "reduce_funcs": true,
    "reduce_vars": true,
    "unused": true
}"#;

    run_exec_test(src, config, false);
}

#[test]
fn terser_reduce_vars_inner_var_for_2() {
    let src = r###"!(function () {
    var a = 1;
    for (var b = 1; --b; ) var a = 2;
    console.log(a);
})();"###;
    let config = r#"{
    "evaluate": true,
    "reduce_funcs": true,
    "reduce_vars": true,
    "unused": true
}"#;

    run_exec_test(src, config, false);
}

#[test]
fn terser_reduce_vars_obj_arg_2() {
    let src = r###"var C = 1;
function f(obj) {
    return obj.bar();
}
console.log(
    f({
        bar: function () {
            return C + C;
        },
    })
);"###;
    let config = r#"{
    "collapse_vars": true,
    "evaluate": true,
    "inline": true,
    "passes": 3,
    "properties": true,
    "reduce_funcs": true,
    "reduce_vars": true,
    "side_effects": true,
    "toplevel": true,
    "unused": true
}"#;

    run_exec_test(src, config, false);
}

#[test]
#[ignore]
fn terser_reduce_vars_reduce_vars() {
    let src = r#"var A = 1;
(function f0() {
    var a = 2;
    console.log(a - 5);
    console.log(A - 5);
})();
(function f1() {
    var a = 2;
    console.log(a - 5);
    eval("console.log(a);");
})();
(function f2(eval) {
    var a = 2;
    console.log(a - 5);
    eval("console.log(a);");
})(eval);
(function f3() {
    var b = typeof C !== "undefined";
    var c = 4;
    if (b) {
        return "yes";
    } else {
        return "no";
    }
})();
console.log(A + 1);"#;
    let config = r#"{
    "conditionals": true,
    "evaluate": true,
    "global_defs": {
        "C": 0
    },
    "inline": true,
    "reduce_funcs": true,
    "reduce_vars": true,
    "toplevel": true,
    "unused": true
}"#;

    run_exec_test(src, config, false);
}

#[test]
fn terser_reduce_vars_modified() {
    let src = r#"function f0() {
    var a = 1,
        b = 2;
    b++;
    console.log(a + 1);
    console.log(b + 1);
}
function f1() {
    var a = 1,
        b = 2;
    --b;
    console.log(a + 1);
    console.log(b + 1);
}
function f2() {
    var a = 1,
        b = 2,
        c = 3;
    b = c;
    console.log(a + b);
    console.log(b + c);
    console.log(a + c);
    console.log(a + b + c);
}
function f3() {
    var a = 1,
        b = 2,
        c = 3;
    b *= c;
    console.log(a + b);
    console.log(b + c);
    console.log(a + c);
    console.log(a + b + c);
}
function f4() {
    var a = 1,
        b = 2,
        c = 3;
    if (a) {
        b = c;
    } else {
        c = b;
    }
    console.log(a + b);
    console.log(b + c);
    console.log(a + c);
    console.log(a + b + c);
}
function f5(a) {
    B = a;
    console.log(typeof A ? "yes" : "no");
    console.log(typeof B ? "yes" : "no");
}
f0(), f1(), f2(), f3(), f4(), f5();"#;
    let config = r#"{
    "conditionals": true,
    "evaluate": true,
    "reduce_funcs": true,
    "reduce_vars": true,
    "unused": true
}"#;

    run_exec_test(src, config, false);
}

#[test]
fn terser_reduce_vars_unsafe_evaluate_escaped() {
    let src = r###"console.log(
    (function () {
        var o = { p: 1 };
        console.log(o, o.p);
        return o.p;
    })()
);
console.log(
    (function () {
        var o = { p: 2 };
        console.log(o.p, o);
        return o.p;
    })()
);
console.log(
    (function () {
        var o = { p: 3 },
            a = [o];
        console.log(a[0].p++);
        return o.p;
    })()
);"###;
    let config = r#"{
    "evaluate": true,
    "reduce_funcs": true,
    "reduce_vars": true,
    "unsafe": true,
    "unused": true
}"#;

    run_exec_test(src, config, false);
}

#[test]
fn terser_reduce_vars_issue_2669() {
    let src = r#"let foo;
console.log(([foo] = ["PASS"]) && foo);"#;
    let config = r#"{
    "evaluate": true,
    "reduce_vars": true,
    "toplevel": true,
    "unused": true
}"#;

    run_exec_test(src, config, false);
}

#[test]
fn terser_reduce_vars_defun_catch_3() {
    let src = r###"try {
    throw 42;
    function a() {}
} catch (a) {
    console.log(a);
}"###;
    let config = r#"{
    "reduce_vars": true,
    "toplevel": true,
    "unused": true
}"#;

    run_exec_test(src, config, false);
}

#[test]
fn terser_reduce_vars_issue_2860_2() {
    let src = r###"console.log(
    (function (a) {
        return (a ^= 1);
        a ^= 2;
    })()
);"###;
    let config = r#"{
    "dead_code": true,
    "evaluate": true,
    "inline": true,
    "passes": 2,
    "reduce_vars": true
}"#;

    run_exec_test(src, config, false);
}

#[test]
fn terser_reduce_vars_delay_def() {
    let src = r###"function f() {
    return a;
    var a;
}
function g() {
    return a;
    var a = 1;
}
console.log(f(), g());"###;
    let config = r#"{
    "evaluate": true,
    "reduce_funcs": true,
    "reduce_vars": true,
    "unused": true
}"#;

    run_exec_test(src, config, false);
}

#[test]
fn terser_reduce_vars_issue_2496() {
    let src = r#"function execute(callback) {
    callback();
}
class Foo {
    constructor(message) {
        this.message = message;
    }
    go() {
        this.message = "PASS";
        console.log(this.message);
    }
    run() {
        execute(() => {
            this.go();
        });
    }
}
new Foo("FAIL").run();"#;
    let config = r#"{
    "passes": 2,
    "reduce_funcs": true,
    "reduce_vars": true,
    "toplevel": true,
    "unused": true
}"#;

    run_exec_test(src, config, false);
}

#[test]
fn terser_reduce_vars_defun_catch_2() {
    let src = r###"try {
    function a() {}
    throw 42;
} catch (a) {
    console.log(a);
}"###;
    let config = r#"{
    "reduce_vars": true,
    "toplevel": true,
    "unused": true
}"#;

    run_exec_test(src, config, false);
}

#[test]
fn terser_reduce_vars_issue_2450_5() {
    let src = r###"var a;
function f(b) {
    console.log(a === b);
    a = b;
}
function g() {}
[1, 2, 3].forEach(function () {
    f(g);
});"###;
    let config = r#"{
    "reduce_funcs": true,
    "reduce_vars": true,
    "toplevel": true,
    "unused": true
}"#;

    run_exec_test(src, config, false);
}

#[test]
fn terser_reduce_vars_issue_1850_2() {
    let src = r###"function f() {
    console.log(a, a, a);
}
var a = 1;
f();"###;
    let config = r#"{
    "reduce_funcs": true,
    "reduce_vars": true,
    "toplevel": "funcs",
    "unused": true
}"#;

    run_exec_test(src, config, false);
}

#[test]
fn terser_reduce_vars_issue_3110_3() {
    let src = r#"(function () {
    function foo() {
        return isDev ? "foo" : "bar";
    }
    console.log(foo());
    var isDev = true;
    var obj = { foo: foo };
    console.log(obj.foo());
})();"#;
    let config = r#"{
    "conditionals": true,
    "evaluate": true,
    "inline": true,
    "properties": true,
    "reduce_vars": true,
    "sequences": true,
    "side_effects": true,
    "unused": true
}"#;

    run_exec_test(src, config, false);
}

#[test]
fn terser_reduce_vars_defun_redefine() {
    let src = r###"function f() {
    function g() {
        return 1;
    }
    function h() {
        return 2;
    }
    g = function () {
        return 3;
    };
    return g() + h();
}

console.log(f())"###;
    let config = r#"{
    "inline": true,
    "reduce_funcs": true,
    "reduce_vars": true,
    "unused": true
}"#;

    run_exec_test(src, config, false);
}

#[test]
fn terser_reduce_vars_issue_2423_6() {
    let src = r###"function x() {
    y();
}
function y() {
    console.log(1);
}
function z() {
    function y() {
        console.log(2);
    }
    x();
    y();
}
z();
z();"###;
    let config = r#"{
    "inline": true,
    "passes": 2,
    "reduce_funcs": true,
    "reduce_vars": true,
    "side_effects": true,
    "toplevel": true,
    "unused": true
}"#;

    run_exec_test(src, config, false);
}

#[test]
fn terser_reduce_vars_unsafe_evaluate_object_2() {
    let src = r###"var obj = {
    foo: 1,
    bar: 2,
    square: function (x) {
        return x * x;
    },
    cube: function (x) {
        return x * x * x;
    },
};
console.log(obj.foo, obj.bar, obj.square(2), obj.cube);"###;
    let config = r#"{
    "evaluate": true,
    "reduce_funcs": true,
    "reduce_vars": true,
    "toplevel": true,
    "unsafe": true
}"#;

    run_exec_test(src, config, false);
}

#[test]
fn terser_reduce_vars_issue_2423_1() {
    let src = r###"function c() {
    return 1;
}
function p() {
    console.log(c());
}
p();
p();"###;
    let config = r#"{
    "reduce_funcs": true,
    "reduce_vars": true,
    "toplevel": true,
    "unused": true
}"#;

    run_exec_test(src, config, false);
}

#[test]
fn terser_reduce_vars_redefine_farg_2() {
    let src = r###"function f(a) {
    var a;
    return typeof a;
}
function g(a) {
    var a = 42;
    return typeof a;
}
function h(a, b) {
    var a = b;
    return typeof a;
}
console.log(f([]), g([]), h([]));"###;
    let config = r#"{
    "evaluate": true,
    "inline": true,
    "keep_fargs": false,
    "reduce_funcs": true,
    "reduce_vars": true,
    "side_effects": true,
    "toplevel": true,
    "unused": true
}"#;

    run_exec_test(src, config, false);
}

#[test]
fn terser_reduce_vars_issue_1670_2() {
    let src = r#"(function f() {
    switch (1) {
        case 0:
            var a = true;
            break;
        default:
            if (typeof a === "undefined") console.log("PASS");
            else console.log("FAIL");
    }
})();"#;
    let config = r#"{
    "conditionals": true,
    "dead_code": true,
    "evaluate": true,
    "passes": 2,
    "reduce_funcs": true,
    "reduce_vars": true,
    "side_effects": true,
    "switches": true,
    "unused": true
}"#;

    run_exec_test(src, config, false);
}

#[test]
fn terser_reduce_vars_unsafe_evaluate_array_1() {
    let src = r###"function f0() {
    var a = 1;
    var b = [];
    b[a] = 2;
    console.log(a + 3);
}
function f1() {
    var a = [1];
    a[2] = 3;
    console.log(a.length);
}
function f2() {
    var a = [1];
    a.push(2);
    console.log(a.length);
}

console.log(f0())
console.log(f1())
console.log(f2())"###;
    let config = r#"{
    "evaluate": true,
    "reduce_funcs": true,
    "reduce_vars": true,
    "unsafe": true
}"#;

    run_exec_test(src, config, false);
}

#[test]
fn terser_reduce_vars_perf_7() {
    let src = r###"var indirect_foo = function (x, y, z) {
    var foo = function (x, y, z) {
        return x < y ? x * y + z : x * z - y;
    };
    return foo(x, y, z);
};
var sum = 0;
for (var i = 0; i < 100; ++i) sum += indirect_foo(i, i + 1, 3 * i);
console.log(sum);"###;
    let config = r#"{
    "reduce_funcs": true,
    "reduce_vars": true,
    "toplevel": true,
    "unused": true
}"#;

    run_exec_test(src, config, false);
}

#[test]
fn terser_reduce_vars_issue_1670_5() {
    let src = r###"(function (a) {
    switch (1) {
        case a:
            console.log(a);
            break;
        default:
            console.log(2);
            break;
    }
})(1);"###;
    let config = r#"{
    "dead_code": true,
    "evaluate": true,
    "keep_fargs": false,
    "reduce_funcs": true,
    "reduce_vars": true,
    "side_effects": true,
    "switches": true,
    "unused": true
}"#;

    run_exec_test(src, config, false);
}

#[test]
fn terser_reduce_vars_escaped_prop_3() {
    let src = r###"var a;
function f(b) {
    if (a) console.log(a === b.c);
    a = b.c;
}
function g() {}
function h() {
    f({ c: g });
}
h();
h();"###;
    let config = r#"{
    "reduce_funcs": true,
    "reduce_vars": true,
    "toplevel": true,
    "unused": true
}"#;

    run_exec_test(src, config, false);
}

#[test]
fn terser_reduce_vars_defun_call() {
    let src = r###"function f() {
    return g() + h(1) - h(g(), 2, 3);
    function g() {
        return 4;
    }
    function h(a) {
        return a;
    }
}


console.log(f())"###;
    let config = r#"{
    "evaluate": true,
    "inline": true,
    "reduce_funcs": true,
    "reduce_vars": true,
    "unused": true
}"#;

    run_exec_test(src, config, false);
}

#[test]
fn terser_reduce_vars_defun_label() {
    let src = r###"!(function () {
    function f(a) {
        L: {
            if (a) break L;
            return 1;
        }
    }
    console.log(f(2));
})();"###;
    let config = r#"{
    "passes": 2,
    "reduce_funcs": true,
    "reduce_vars": true,
    "unused": true
}"#;

    run_exec_test(src, config, false);
}

#[test]
#[ignore]
fn terser_reduce_vars_unsafe_evaluate_modified() {
    let src = r#"console.log(
    (function () {
        var o = { p: 1 };
        o.p++;
        console.log(o.p);
        return o.p;
    })()
);
console.log(
    (function () {
        var o = { p: 2 };
        --o.p;
        console.log(o.p);
        return o.p;
    })()
);
console.log(
    (function () {
        var o = { p: 3 };
        o.p += "";
        console.log(o.p);
        return o.p;
    })()
);
console.log(
    (function () {
        var o = { p: 4 };
        o = {};
        console.log(o.p);
        return o.p;
    })()
);
console.log(
    (function () {
        var o = { p: 5 };
        o.p = -9;
        console.log(o.p);
        return o.p;
    })()
);
function inc() {
    this.p++;
}
console.log(
    (function () {
        var o = { p: 6 };
        inc.call(o);
        console.log(o.p);
        return o.p;
    })()
);
console.log(
    (function () {
        var o = { p: 7 };
        console.log([o][0].p++);
        return o.p;
    })()
);
console.log(
    (function () {
        var o = { p: 8 };
        console.log({ q: o }.q.p++);
        return o.p;
    })()
);"#;
    let config = r#"{
    "evaluate": true,
    "reduce_funcs": true,
    "reduce_vars": true,
    "unsafe": true,
    "unused": true
}"#;

    run_exec_test(src, config, false);
}

#[test]
fn terser_reduce_vars_lvalues_def_1() {
    let src = r###"var b = 1;
var a = b++,
    b = NaN;
console.log(a, b);"###;
    let config = r#"{
    "reduce_vars": true,
    "toplevel": true,
    "unused": true
}"#;

    run_exec_test(src, config, false);
}

#[test]
fn terser_reduce_vars_func_arg_1() {
    let src = r###"var a = 42;
!(function (a) {
    console.log(a());
})(function () {
    return a;
});"###;
    let config = r#"{
    "evaluate": true,
    "inline": true,
    "passes": 2,
    "reduce_funcs": true,
    "reduce_vars": true,
    "side_effects": true,
    "toplevel": true,
    "unused": true
}"#;

    run_exec_test(src, config, false);
}

#[test]
fn terser_reduce_vars_escape_local_sequence() {
    let src = r#"function main() {
    var thing = baz();
    if (thing !== (thing = baz())) console.log("PASS");
    else console.log("FAIL");
}
function baz() {
    function foo() {}
    function bar() {}
    return foo, bar;
}
main();"#;
    let config = r#"{
    "reduce_funcs": true,
    "reduce_vars": true,
    "toplevel": true,
    "unused": true
}"#;

    run_exec_test(src, config, false);
}

#[test]
fn terser_reduce_vars_regex_loop() {
    let src = r#"function f(x) {
    for (var r, s = "acdabcdeabbb"; (r = x().exec(s)); ) console.log(r[0]);
}
var a = /ab*/g;
f(function () {
    return a;
});"#;
    let config = r#"{
    "reduce_funcs": true,
    "reduce_vars": true,
    "toplevel": true,
    "unused": true
}"#;

    run_exec_test(src, config, false);
}

#[test]
fn terser_reduce_vars_issue_3140_4() {
    let src = r#"(function () {
    var a;
    function f() {}
    f.g = function g() {
        var o = { p: this };
        function h() {
            console.log(a ? "PASS" : "FAIL");
        }
        a = true;
        o.p();
        a = false;
        h.g = g;
        return h;
    };
    return f;
})()
    .g()
    .g();"#;
    let config = r#"{
    "reduce_vars": true,
    "unused": true
}"#;

    run_exec_test(src, config, false);
}

#[test]
fn terser_reduce_vars_issue_1670_4() {
    let src = r#"(function f() {
    switch (1) {
        case 0:
            var a = true;
            break;
        case 1:
            if (typeof a === "undefined") console.log("PASS");
            else console.log("FAIL");
    }
})();"#;
    let config = r#"{
    "conditionals": true,
    "dead_code": true,
    "evaluate": true,
    "passes": 2,
    "reduce_funcs": true,
    "reduce_vars": true,
    "side_effects": true,
    "switches": true,
    "unused": true
}"#;

    run_exec_test(src, config, false);
}

#[test]
fn terser_reduce_vars_redefine_farg_3() {
    let src = r###"function f(a) {
    var a;
    return typeof a;
}
function g(a) {
    var a = 42;
    return typeof a;
}
function h(a, b) {
    var a = b;
    return typeof a;
}
console.log(f([]), g([]), h([]));"###;
    let config = r#"{
    "collapse_vars": true,
    "evaluate": true,
    "inline": true,
    "keep_fargs": false,
    "passes": 3,
    "reduce_funcs": true,
    "reduce_vars": true,
    "sequences": true,
    "side_effects": true,
    "toplevel": true,
    "unused": true
}"#;

    run_exec_test(src, config, false);
}

#[test]
fn terser_reduce_vars_issue_3140_3() {
    let src = r#"(function () {
    var a;
    function f() {}
    f.g = function g() {
        var self = this;
        function h() {
            console.log(a ? "PASS" : "FAIL");
        }
        a = true;
        (function () {
            return self;
        })()();
        a = false;
        h.g = g;
        return h;
    };
    return f;
})()
    .g()
    .g();"#;
    let config = r#"{
    "reduce_vars": true,
    "unused": true
}"#;

    run_exec_test(src, config, false);
}

#[test]
fn terser_reduce_vars_issue_1670_3() {
    let src = r#"(function f() {
    switch (1) {
        case 0:
            var a = true;
            break;
        case 1:
            if (typeof a === "undefined") console.log("PASS");
            else console.log("FAIL");
    }
})();"#;
    let config = r#"{
    "comparisons": true,
    "conditionals": true,
    "dead_code": true,
    "evaluate": true,
    "reduce_funcs": true,
    "reduce_vars": true,
    "side_effects": true,
    "switches": true,
    "typeofs": true,
    "unused": true
}"#;

    run_exec_test(src, config, false);
}

#[test]
fn terser_reduce_vars_perf_1() {
    let src = r###"function foo(x, y, z) {
    return x < y ? x * y + z : x * z - y;
}
function indirect_foo(x, y, z) {
    return foo(x, y, z);
}
var sum = 0;
for (var i = 0; i < 100; ++i) {
    sum += indirect_foo(i, i + 1, 3 * i);
}
console.log(sum);"###;
    let config = r#"{
    "reduce_funcs": true,
    "reduce_vars": true,
    "toplevel": true,
    "unused": true
}"#;

    run_exec_test(src, config, false);
}

#[test]
fn terser_collapse_vars_issue_2187_2() {
    let src = r###"var b = 1;
console.log(
    (function (a) {
        return a && ++b;
    })(b--)
);"###;
    let config = r#"{
    "collapse_vars": true,
    "unused": true
}"#;

    run_exec_test(src, config, false);
}

#[test]
fn terser_collapse_vars_issue_2436_14() {
    let src = r#"var a = "PASS";
var b = {};
(function () {
    var c = a;
    c &&
        (function (c, d) {
            console.log(c, d);
        })(b, c);
})();"#;
    let config = r#"{
    "collapse_vars": true,
    "reduce_vars": true,
    "unused": true
}"#;

    run_exec_test(src, config, false);
}

#[test]
fn terser_collapse_vars_issue_2506() {
    let src = r###"var c = 0;
function f0(bar) {
    function f1(Infinity_2) {
        function f13(NaN) {
            if ((false <= NaN) & (this >> 1 >= 0)) {
                c++;
            }
        }
        var b_2 = f13(NaN, c++);
    }
    var bar = f1(-3, -1);
}
f0(false);
console.log(c);"###;
    let config = r#"{
    "collapse_vars": true,
    "passes": 2,
    "reduce_vars": true,
    "unused": true
}"#;

    run_exec_test(src, config, false);
}

#[test]
fn terser_collapse_vars_issue_2436_13() {
    let src = r#"var a = "PASS";
(function () {
    function f(b) {
        (function g(b) {
            var b = b && (b.null = "FAIL");
        })(a);
    }
    f();
})();
console.log(a);"#;
    let config = r#"{
    "collapse_vars": true,
    "passes": 2,
    "reduce_vars": true,
    "unused": true
}"#;

    run_exec_test(src, config, false);
}

#[test]
fn terser_collapse_vars_issue_2187_3() {
    let src = r###"var b = 1;
console.log(
    (function (a) {
        return a && ++b;
    })(b--)
);"###;
    let config = r#"{
    "collapse_vars": true,
    "inline": true,
    "unused": true
}"#;

    run_exec_test(src, config, false);
}

#[test]
fn terser_collapse_vars_issue_2203_1() {
    let src = r#"a = "FAIL";
console.log(
    {
        a: "PASS",
        b: function () {
            return (function (c) {
                return c.a;
            })((String, Object, this));
        },
    }.b()
);"#;
    let config = r#"{
    "collapse_vars": true,
    "unused": true
}"#;

    run_exec_test(src, config, false);
}

#[test]
fn terser_collapse_vars_issue_2914_2() {
    let src = r###"function read(input) {
    var i = 0;
    var e = 0;
    var t = 0;
    while (e < 32) {
        var n = input[i++];
        t = (127 & n) << e;
        if (0 === (128 & n)) return t;
        e += 7;
    }
}
console.log(read([129]));"###;
    let config = r#"{
    "collapse_vars": true
}"#;

    run_exec_test(src, config, false);
}

#[test]
fn terser_collapse_vars_issue_2319_1() {
    let src = r###"console.log(
    (function (a) {
        return a;
    })(
        !(function () {
            return this;
        })()
    )
);"###;
    let config = r#"{
    "collapse_vars": true,
    "unused": true
}"#;

    run_exec_test(src, config, false);
}

#[test]
fn terser_collapse_vars_cascade_forin() {
    let src = r###"var a;
function f(b) {
    return [b, b, b];
}
for (var c in ((a = console), f(a))) console.log(c);"###;
    let config = r#"{
    "collapse_vars": true
}"#;

    run_exec_test(src, config, false);
}

#[test]
fn terser_collapse_vars_inner_lvalues() {
    let src = r###"var a,
    b = 10;
var a = (--b || a || 3).toString(),
    c = --b + -a;
console.log(null, a, b);"###;
    let config = r#"{
    "collapse_vars": true,
    "unused": true
}"#;

    run_exec_test(src, config, false);
}

#[test]
fn terser_collapse_vars_issue_2298() {
    let src = r#"!(function () {
    function f() {
        var a = undefined;
        var undefined = a++;
        try {
            !(function g(b) {
                b[1] = "foo";
            })();
            console.log("FAIL");
        } catch (e) {
            console.log("PASS");
        }
    }
    f();
})();"#;
    let config = r#"{
    "collapse_vars": true,
    "passes": 2,
    "reduce_funcs": true,
    "reduce_vars": true,
    "unused": true
}"#;

    run_exec_test(src, config, false);
}

#[test]
fn terser_collapse_vars_chained_3() {
    let src = r###"console.log(
    (function (a, b) {
        var c = a,
            c = b;
        b++;
        return c;
    })(1, 2)
);"###;
    let config = r#"{
    "collapse_vars": true,
    "unused": true
}"#;

    run_exec_test(src, config, false);
}

#[test]
fn terser_collapse_vars_collapse_vars_self_reference() {
    let src = r###"function f1() {
    var self = {
        inner: function () {
            return self;
        },
    };
    console.log(self)
}
function f2() {
    var self = { inner: self };
    console.log(self)
}

f1()
f2()"###;
    let config = r#"{
    "booleans": true,
    "collapse_vars": true,
    "comparisons": true,
    "conditionals": true,
    "dead_code": true,
    "evaluate": true,
    "hoist_funs": true,
    "if_return": true,
    "join_vars": true,
    "keep_fargs": true,
    "loops": true,
    "properties": true,
    "sequences": true,
    "side_effects": true,
    "unused": false
}"#;

    run_exec_test(src, config, false);
}

#[test]
fn terser_collapse_vars_chained_2() {
    let src = r###"var a;
var a = 2;
a = 3 / a;
console.log(a);"###;
    let config = r#"{
    "collapse_vars": true,
    "unused": true
}"#;

    run_exec_test(src, config, false);
}

#[test]
fn terser_collapse_vars_cond_branch_1() {
    let src = r###"function f1(b, c) {
    var log = console.log;
    var a = ++c;
    if (b) b++;
    log(a, b);
}
function f2(b, c) {
    var log = console.log;
    var a = ++c;
    b && b++;
    log(a, b);
}
function f3(b, c) {
    var log = console.log;
    var a = ++c;
    b ? b++ : b--;
    log(a, b);
}
f1(1, 2);
f2(3, 4);
f3(5, 6);"###;
    let config = r#"{
    "collapse_vars": true,
    "sequences": true,
    "unused": true
}"#;

    run_exec_test(src, config, false);
}

#[test]
fn terser_collapse_vars_var_side_effects_2() {
    let src = r#"var print = console.log.bind(console);
function foo(x) {
    var twice = x.y * 2;
    print("Foo:", twice);
}
foo({ y: 10 });"#;
    let config = r#"{
    "collapse_vars": true,
    "unused": true
}"#;

    run_exec_test(src, config, false);
}

#[test]
fn terser_collapse_vars_issue_3032() {
    let src = r###"console.log(
    {
        f: function () {
            this.a = 42;
            return [this.a, !1];
        },
    }.f()[0]
);"###;
    let config = r#"{
    "collapse_vars": true,
    "pure_getters": true
}"#;

    run_exec_test(src, config, false);
}

#[test]
fn terser_collapse_vars_var_side_effects_3() {
    let src = r#"var print = console.log.bind(console);
function foo(x) {
    var twice = x.y * 2;
    print("Foo:", twice);
}
foo({ y: 10 });"#;
    let config = r#"{
    "collapse_vars": true,
    "pure_getters": true,
    "unsafe": true,
    "unused": true
}"#;

    run_exec_test(src, config, false);
}

#[test]
fn terser_collapse_vars_collapse_vars_throw() {
    let src = r###"var f1 = function (x, y) {
    var a,
        b,
        r = x + y,
        q = r * r,
        z = q - r;
    (a = z), (b = 7);
    throw a + b;
};
try {
    f1(1, 2);
} catch (e) {
    console.log(e);
}"###;
    let config = r#"{
    "booleans": true,
    "collapse_vars": true,
    "comparisons": true,
    "conditionals": true,
    "dead_code": true,
    "evaluate": true,
    "hoist_funs": true,
    "if_return": true,
    "join_vars": true,
    "keep_fargs": true,
    "loops": true,
    "properties": true,
    "sequences": true,
    "side_effects": true,
    "unused": true
}"#;

    run_exec_test(src, config, false);
}

#[test]
fn terser_collapse_vars_issue_2203_4() {
    let src = r#"a = "FAIL";
console.log(
    {
        a: "PASS",
        b: function () {
            return ((c) => c.a)((String, Object, (() => this)()));
        },
    }.b()
);"#;
    let config = r#"{
    "collapse_vars": true,
    "unused": true
}"#;

    run_exec_test(src, config, false);
}

#[test]
fn terser_collapse_vars_issue_2203_3() {
    let src = r#"a = "FAIL";
console.log(
    {
        a: "PASS",
        b: function () {
            return (function (c) {
                return c.a;
            })((String, Object, (() => this)()));
        },
    }.b()
);"#;
    let config = r#"{
    "collapse_vars": true,
    "unused": true
}"#;

    run_exec_test(src, config, false);
}

#[test]
fn terser_collapse_vars_issue_2187_1() {
    let src = r###"var a = 1;
!(function (foo) {
    foo();
    var a = 2;
    console.log(a);
})(function () {
    console.log(a);
});"###;
    let config = r#"{
    "collapse_vars": true,
    "unused": true
}"#;

    run_exec_test(src, config, false);
}

#[test]
fn terser_collapse_vars_var_defs() {
    let src = r#"var f1 = function (x, y) {
    var a,
        b,
        r = x + y,
        q = r * r,
        z = q - r,
        a = z,
        b = 7;
    console.log(a + b);
};
f1("1", 0);"#;
    let config = r#"{
    "booleans": true,
    "collapse_vars": true,
    "comparisons": true,
    "conditionals": true,
    "dead_code": true,
    "evaluate": true,
    "hoist_funs": true,
    "if_return": true,
    "join_vars": true,
    "keep_fargs": true,
    "loops": true,
    "properties": true,
    "sequences": true,
    "side_effects": true,
    "unused": true
}"#;

    run_exec_test(src, config, false);
}

#[test]
fn terser_collapse_vars_issue_2203_2() {
    let src = r#"a = "PASS";
console.log(
    {
        a: "FAIL",
        b: function () {
            return (function (c) {
                return c.a;
            })(
                (String,
                Object,
                (function () {
                    return this;
                })())
            );
        },
    }.b()
);"#;
    let config = r#"{
    "collapse_vars": true,
    "unused": true
}"#;

    run_exec_test(src, config, false);
}

#[test]
fn terser_collapse_vars_collapse_vars_seq() {
    let src = r###"var f1 = function (x, y) {
    var a,
        b,
        r = x + y,
        q = r * r,
        z = q - r;
    (a = z), (b = 7);
    return a + b;
};
console.log(f1(1, 2));"###;
    let config = r#"{
    "booleans": true,
    "collapse_vars": true,
    "comparisons": true,
    "conditionals": true,
    "dead_code": true,
    "evaluate": true,
    "hoist_funs": true,
    "if_return": true,
    "join_vars": true,
    "keep_fargs": true,
    "loops": true,
    "properties": true,
    "sequences": true,
    "side_effects": true,
    "unused": true
}"#;

    run_exec_test(src, config, false);
}

#[test]
fn terser_collapse_vars_issue_2319_3() {
    let src = r#""use strict";
console.log(
    (function (a) {
        return a;
    })(
        !(function () {
            return this;
        })()
    )
);"#;
    let config = r#"{
    "collapse_vars": true,
    "unused": true
}"#;

    run_exec_test(src, config, false);
}

#[test]
fn terser_collapse_vars_may_throw_2() {
    let src = r###"function f(b) {
    try {
        var a = x();
        ++b;
        return b(a);
    } catch (e) {}
    console.log(b);
}
f(0);"###;
    let config = r#"{
    "collapse_vars": true,
    "unused": true
}"#;

    run_exec_test(src, config, false);
}

#[test]
fn terser_collapse_vars_issue_2453() {
    let src = r###"function log(n) {
    console.log(n);
}
const a = 42;
log(a);"###;
    let config = r#"{
    "collapse_vars": true,
    "conditionals": true,
    "inline": true,
    "join_vars": true,
    "passes": 2,
    "reduce_funcs": true,
    "reduce_vars": true,
    "sequences": true,
    "side_effects": true,
    "toplevel": true
}"#;

    run_exec_test(src, config, false);
}

#[test]
fn terser_collapse_vars_cond_branch_2() {
    let src = r###"function f1(b, c) {
    var log = console.log;
    var a = ++c;
    if (b) b += a;
    log(a, b);
}
function f2(b, c) {
    var log = console.log;
    var a = ++c;
    b && (b += a);
    log(a, b);
}
function f3(b, c) {
    var log = console.log;
    var a = ++c;
    b ? (b += a) : b--;
    log(a, b);
}
f1(1, 2);
f2(3, 4);
f3(5, 6);"###;
    let config = r#"{
    "collapse_vars": true,
    "sequences": true,
    "unused": true
}"#;

    run_exec_test(src, config, false);
}

#[test]
fn terser_collapse_vars_chained_1() {
    let src = r###"var a = 2;
var a = 3 / a;
console.log(a);"###;
    let config = r#"{
    "collapse_vars": true,
    "unused": true
}"#;

    run_exec_test(src, config, false);
}

#[test]
fn terser_collapse_vars_reduce_vars_assign() {
    let src = r###"!(function () {
    var a = 1;
    (a = [].length), console.log(a);
})();"###;
    let config = r#"{
    "collapse_vars": true,
    "reduce_funcs": true,
    "reduce_vars": true
}"#;

    run_exec_test(src, config, false);
}

#[test]
fn terser_inline_inline_within_extends_2() {
    let src = r#"class Baz extends foo(bar(Array)) {
    constructor() {
        super(...arguments);
    }
}
function foo(foo_base) {
    return class extends foo_base {
        constructor() {
            super(...arguments);
        }
        second() {
            return this[1];
        }
    };
}
function bar(bar_base) {
    return class extends bar_base {
        constructor(...args) {
            super(...args);
        }
    };
}
console.log(new Baz(1, "PASS", 3).second());"#;
    let config = r#"{
    "defaults": true,
    "evaluate": true,
    "inline": 3,
    "passes": 3,
    "reduce_funcs": true,
    "reduce_vars": true,
    "side_effects": true,
    "collapse_vars": false,
    "unused": true,
    "toplevel": true
}"#;

    run_exec_test(src, config, false);
}

#[test]
fn terser_evaluate_unsafe_float_key() {
    let src = r#"console.log(
    { 2.72: 1 } + 1,
    { 2.72: 1 }[2.72] + 1,
    { 2.72: 1 }["2.72"] + 1,
    { 2.72: 1 }[3.14] + 1,
    { 2.72: 1 }[2.72][3.14] + 1,
    { 2.72: 1 }[2.72]["3.14"] + 1
);"#;
    let config = r#"{
    "evaluate": true,
    "unsafe": true
}"#;

    run_exec_test(src, config, false);
}

#[test]
fn terser_evaluate_unsafe_float_key_complex() {
    let src = r#"console.log(
    { 2.72: { 3.14: 1 }, 3.14: 1 } + 1,
    { 2.72: { 3.14: 1 }, 3.14: 1 }[2.72] + 1,
    { 2.72: { 3.14: 1 }, 3.14: 1 }["2.72"] + 1,
    { 2.72: { 3.14: 1 }, 3.14: 1 }[3.14] + 1,
    { 2.72: { 3.14: 1 }, 3.14: 1 }[2.72][3.14] + 1,
    { 2.72: { 3.14: 1 }, 3.14: 1 }[2.72]["3.14"] + 1
);"#;
    let config = r#"{
    "evaluate": true,
    "unsafe": true
}"#;

    run_exec_test(src, config, false);
}

#[test]
fn terser_issue_892_dont_mangle_arguments() {
    let src = r###"(function () {
    var arguments = arguments,
        not_arguments = 9;
    console.log(not_arguments, arguments);
})(5, 6, 7);"###;
    let config = r#"{
    "booleans": true,
    "comparisons": true,
    "conditionals": true,
    "dead_code": true,
    "drop_debugger": true,
    "evaluate": true,
    "hoist_funs": true,
    "hoist_vars": true,
    "if_return": true,
    "join_vars": true,
    "keep_fargs": true,
    "keep_fnames": false,
    "loops": true,
    "negate_iife": false,
    "properties": true,
    "sequences": true,
    "side_effects": true,
    "unused": true
}"#;

    run_exec_test(src, config, false);
}

#[test]
fn terser_properties_issue_t64() {
    let src = r#"var obj = {};
obj.Base = class {
    constructor() {
        this.id = "PASS";
    }
};
obj.Derived = class extends obj.Base {
    constructor() {
        super();
        console.log(this.id);
    }
};
new obj.Derived();"#;
    let config = r#"{
    "collapse_vars": true,
    "join_vars": true,
    "properties": true,
    "reduce_vars": true,
    "side_effects": true,
    "unused": true
}"#;

    run_exec_test(src, config, false);
}

#[test]
fn terser_properties_computed_property() {
    let src = r#"console.log({ a: "bar", [console.log("foo")]: 42 }.a);"#;
    let config = r#"{
    "properties": true,
    "side_effects": true
}"#;

    run_exec_test(src, config, false);
}

#[test]
fn terser_properties_sub_properties() {
    let src = r#"const a = {};

a[0] = 0;
a["0"] = 1;
a[3.14] = 2;
a["3" + ".14"] = 3;
a["i" + "f"] = 4;
a["foo" + " bar"] = 5;
a[0 / 0] = 6;
a[null] = 7;
a[undefined] = 8;

console.log(a)"#;
    let config = r#"{
    "evaluate": true,
    "properties": true
}"#;

    run_exec_test(src, config, false);
}

#[test]
fn terser_properties_dont_mangle_computed_property_2() {
    let src = r#"const prop = Symbol("foo");
const obj = {
    [prop]: "bar",
    baz: 1,
    qux: 2,
    [3 + 4]: "seven",
    0: "zero",
    1: "one",
    null: "Null",
    undefined: "Undefined",
    Infinity: "infinity",
    NaN: "nan",
    void: "Void",
};
console.log(
    obj[prop],
    obj["baz"],
    obj.qux,
    obj[7],
    obj[0],
    obj[1 + 0],
    obj[null],
    obj[undefined],
    obj[1 / 0],
    obj[NaN],
    obj.void
);
console.log(obj.null, obj.undefined, obj.Infinity, obj.NaN);"#;
    let config = r#"{
    "defaults": true,
    "toplevel": true
}"#;

    run_exec_test(src, config, false);
}

#[test]
fn terser_properties_prop_side_effects_2() {
    let src = r#"var C = 1;
console.log(C);
var obj = {
    "": function () {
        return C + C;
    },
};
console.log(obj[""]());"#;
    let config = r#"{
    "evaluate": true,
    "inline": true,
    "passes": 2,
    "properties": true,
    "reduce_funcs": true,
    "reduce_vars": true,
    "side_effects": true,
    "toplevel": true,
    "unused": true
}"#;

    run_exec_test(src, config, false);
}

#[test]
fn terser_properties_join_object_assignments_negative() {
    let src = r###"var o = {};
o[0] = 0;
o[-0] = 1;
o[-1] = 2;
console.log(o[0], o[-0], o[-1]);"###;
    let config = r#"{
    "evaluate": true,
    "join_vars": true,
    "properties": true
}"#;

    run_exec_test(src, config, false);
}

#[test]
fn terser_properties_issue_2208_4() {
    let src = r###"function foo() {}
console.log(
    {
        a: foo(),
        p: function () {
            return 42;
        },
    }.p()
);"###;
    let config = r#"{
    "inline": true,
    "properties": true,
    "side_effects": true
}"#;

    run_exec_test(src, config, false);
}

#[test]
fn terser_properties_issue_869_1() {
    let src = r#"var o = { p: "FAIL" };
Object.defineProperty(o, "p", {
    get: function () {
        return "PASS";
    },
});
console.log(o.p);"#;
    let config = r###"{}"###;

    run_exec_test(src, config, false);
}

#[test]
fn terser_properties_join_object_assignments_undefined_2() {
    let src = r###"var o = {};
o[undefined] = 1;
console.log(o[undefined]);"###;
    let config = r#"{
    "evaluate": true,
    "join_vars": true,
    "properties": true
}"#;

    run_exec_test(src, config, false);
}

#[test]
fn terser_properties_issue_2208_5() {
    let src = r#"console.log(
    {
        p: "FAIL",
        p: function () {
            return 42;
        },
    }.p()
);"#;
    let config = r#"{
    "inline": true,
    "properties": true,
    "side_effects": true
}"#;

    run_exec_test(src, config, false);
}

#[test]
fn terser_properties_issue_2513() {
    let src = r#"!(function (Infinity, NaN, undefined) {
    console.log("a"[1 / 0], "b"["Infinity"]);
    console.log("c"[0 / 0], "d"["NaN"]);
    console.log("e"[void 0], "f"["undefined"]);
})(0, 0, 0);"#;
    let config = r#"{
    "evaluate": true,
    "properties": true
}"#;

    run_exec_test(src, config, false);
}

#[test]
fn terser_properties_join_object_assignments_return_1() {
    let src = r#"console.log(
    (function () {
        var o = { p: 3 };
        return (o.q = "foo");
    })()
);"#;
    let config = r#"{
    "join_vars": true
}"#;

    run_exec_test(src, config, false);
}

#[test]
fn terser_properties_issue_2816_ecma6() {
    let src = r#""use strict";
var o = { a: 1 };
o.b = 2;
o.a = 3;
o.c = 4;
console.log(o.a, o.b, o.c);"#;
    let config = r#"{
    "ecma": "6",
    "join_vars": true
}"#;

    run_exec_test(src, config, false);
}

#[test]
fn terser_properties_join_object_assignments_1() {
    let src = r#"console.log(
    (function () {
        var x = { a: 1, c: (console.log("c"), "C") };
        x.b = 2;
        (x[3] = function () {
            console.log(x);
        }),
            (x["a"] = /foo/),
            (x.bar = x);
        return x;
    })()
);"#;
    let config = r#"{
    "evaluate": true,
    "join_vars": true
}"#;

    run_exec_test(src, config, false);
}

#[test]
fn terser_properties_dont_mangle_computed_property_1() {
    let src = r#""AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA";
"BBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBB";
"CCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCC";
const prop = Symbol("foo");
const obj = {
    [prop]: "bar",
    baz: 1,
    qux: 2,
    [3 + 4]: "seven",
    0: "zero",
    1: "one",
    null: "Null",
    undefined: "Undefined",
    Infinity: "infinity",
    NaN: "nan",
    void: "Void",
};
console.log(
    obj[prop],
    obj["baz"],
    obj.qux,
    obj[7],
    obj[0],
    obj[1 + 0],
    obj[null],
    obj[undefined],
    obj[1 / 0],
    obj[NaN],
    obj.void
);
console.log(obj.null, obj.undefined, obj.Infinity, obj.NaN);"#;
    let config = r###"{}"###;

    run_exec_test(src, config, false);
}

#[test]
fn terser_properties_join_object_assignments_if() {
    let src = r#"console.log(
    (function () {
        var o = {};
        if ((o.a = "PASS")) return o.a;
    })()
);"#;
    let config = r#"{
    "join_vars": true
}"#;

    run_exec_test(src, config, false);
}

#[test]
fn terser_properties_join_object_assignments_nan_2() {
    let src = r###"var o = {};
o[NaN] = 1;
o[0 / 0] = 2;
console.log(o[NaN], o[NaN]);"###;
    let config = r#"{
    "evaluate": true,
    "join_vars": true,
    "properties": true
}"#;

    run_exec_test(src, config, false);
}

#[test]
fn terser_properties_prop_side_effects_1() {
    let src = r###"var C = 1;
console.log(C);
var obj = {
    bar: function () {
        return C + C;
    },
};
console.log(obj.bar());"###;
    let config = r#"{
    "evaluate": true,
    "inline": true,
    "properties": true,
    "reduce_funcs": true,
    "reduce_vars": true,
    "side_effects": true,
    "toplevel": true,
    "unused": true
}"#;

    run_exec_test(src, config, false);
}

#[test]
fn terser_properties_join_object_assignments_null_1() {
    let src = r###"var o = {};
o[null] = 1;
console.log(o[null]);"###;
    let config = r#"{
    "evaluate": true,
    "join_vars": true,
    "properties": true
}"#;

    run_exec_test(src, config, false);
}

#[test]
fn terser_properties_issue_2208_7() {
    let src = r###"console.log(
    {
        p() {
            return 42;
        },
    }.p()
);"###;
    let config = r#"{
    "ecma": 2015,
    "inline": true,
    "properties": true,
    "side_effects": true,
    "unsafe_arrows": true
}"#;

    run_exec_test(src, config, false);
}

#[test]
fn terser_properties_issue_869_2() {
    let src = r#"var o = { p: "FAIL" };
Object.defineProperties(o, {
    p: {
        get: function () {
            return "PASS";
        },
    },
});
console.log(o.p);"#;
    let config = r###"{}"###;

    run_exec_test(src, config, false);
}

#[test]
fn terser_properties_issue_2208_9() {
    let src = r###"a = 42;
console.log(
    {
        p: () =>
            (function () {
                return this.a;
            })(),
    }.p()
);"###;
    let config = r#"{
    "inline": true,
    "properties": true,
    "side_effects": true
}"#;

    run_exec_test(src, config, false);
}

#[test]
fn terser_properties_join_object_assignments_undefined_1() {
    let src = r###"var o = {};
o[undefined] = 1;
console.log(o[undefined]);"###;
    let config = r#"{
    "join_vars": true
}"#;

    run_exec_test(src, config, false);
}

#[test]
fn terser_properties_join_object_assignments_forin() {
    let src = r#"console.log(
    (function () {
        var o = {};
        for (var a in ((o.a = "PASS"), o)) return o[a];
    })()
);"#;
    let config = r#"{
    "join_vars": true
}"#;

    run_exec_test(src, config, false);
}

#[test]
fn terser_properties_join_object_assignments_void_0() {
    let src = r###"var o = {};
o[void 0] = 1;
console.log(o[void 0]);"###;
    let config = r#"{
    "evaluate": true,
    "join_vars": true
}"#;

    run_exec_test(src, config, false);
}

#[test]
fn terser_properties_join_object_assignments_return_2() {
    let src = r#"console.log(
    (function () {
        var o = { p: 3 };
        return (o.q = /foo/), (o.r = "bar");
    })()
);"#;
    let config = r#"{
    "join_vars": true
}"#;

    run_exec_test(src, config, false);
}

#[test]
fn terser_properties_join_object_assignments_regex() {
    let src = r###"var o = {};
o[/rx/] = 1;
console.log(o[/rx/]);"###;
    let config = r#"{
    "evaluate": true,
    "join_vars": true,
    "properties": true
}"#;

    run_exec_test(src, config, false);
}

#[test]
fn terser_properties_join_object_assignments_2() {
    let src = r###"var o = { foo: 1 };
o.bar = 2;
o.baz = 3;
console.log(o.foo, o.bar + o.bar, o.foo * o.bar * o.baz);"###;
    let config = r#"{
    "evaluate": true,
    "hoist_props": true,
    "join_vars": true,
    "passes": 3,
    "reduce_vars": true,
    "toplevel": true,
    "unused": true
}"#;

    run_exec_test(src, config, false);
}

#[test]
fn terser_properties_join_object_assignments_return_3() {
    let src = r#"console.log(
    (function () {
        var o = { p: 3 };
        return (o.q = "foo"), (o.p += ""), console.log(o.q), o.p;
    })()
);"#;
    let config = r#"{
    "join_vars": true
}"#;

    run_exec_test(src, config, false);
}

#[test]
fn terser_issue_1321_issue_1321_no_debug() {
    let src = r#"var x = {};
x.foo = 1;
x["a"] = 2 * x.foo;
console.log(x.foo, x["a"]);"#;
    let config = r###"{}"###;

    run_exec_test(src, config, false);
}

#[test]
fn terser_issue_1321_issue_1321_with_quoted() {
    let src = r#"var x = {};
x.foo = 1;
x["a"] = 2 * x.foo;
console.log(x.foo, x["a"]);"#;
    let config = r###"{}"###;

    run_exec_test(src, config, false);
}

#[test]
fn terser_issue_1321_issue_1321_debug() {
    let src = r#"var x = {};
x.foo = 1;
x["_$foo$_"] = 2 * x.foo;
console.log(x.foo, x["_$foo$_"]);"#;
    let config = r###"{}"###;

    run_exec_test(src, config, false);
}

#[test]
fn terser_issue_976_eval_collapse_vars() {
    let src = r#"function f1() {
    var e = 7;
    var s = "abcdef";
    var i = 2;
    var eval = console.log.bind(console);
    var x = s.charAt(i++);
    var y = s.charAt(i++);
    var z = s.charAt(i++);
    eval(x, y, z, e);
}
function p1() {
    var a = foo(),
        b = bar(),
        eval = baz();
    return a + b + eval;
}
function p2() {
    var a = foo(),
        b = bar(),
        eval = baz;
    return a + b + eval();
}
(function f2(eval) {
    var a = 2;
    console.log(a - 5);
    eval("console.log(a);");
})(eval);"#;
    let config = r#"{
    "booleans": true,
    "collapse_vars": true,
    "comparisons": true,
    "conditionals": true,
    "dead_code": true,
    "evaluate": true,
    "hoist_funs": true,
    "if_return": true,
    "join_vars": true,
    "keep_fargs": true,
    "loops": true,
    "properties": true,
    "sequences": false,
    "side_effects": true,
    "unused": true
}"#;

    run_exec_test(src, config, false);
}

#[test]
fn terser_array_constructor_unsafe() {
    let src = r#"const foo = 'string'

console.log(new Array());
console.log(new Array(0));
console.log(new Array(1));
console.log(new Array(11));
console.log(Array(11));
console.log(new Array(12));
console.log(Array(12));
console.log(new Array(foo));
console.log(Array(foo));
console.log(new Array("foo"));
console.log(Array("foo"));"#;
    let config = r#"{
    "unsafe": true
}"#;

    run_exec_test(src, config, false);
}

#[test]
fn terser_sequences_forin() {
    let src = r#"var o = [];
o.push("PASS");
for (var a in o) console.log(o[a]);"#;
    let config = r#"{
    "sequences": true
}"#;

    run_exec_test(src, config, false);
}

#[test]
fn terser_sequences_for_init_var() {
    let src = r#"var a = "PASS";
(function () {
    var b = 42;
    for (var c = 5; c > 0; ) c--;
    a = "FAIL";
    var a;
})();
console.log(a);"#;
    let config = r#"{
    "join_vars": true,
    "unused": false
}"#;

    run_exec_test(src, config, false);
}

#[test]
fn terser_sequences_func_def_1() {
    let src = r###"function f() {
    return (f = 0), !!f;
}
console.log(f());"###;
    let config = r#"{
    "collapse_vars": true,
    "side_effects": true
}"#;

    run_exec_test(src, config, false);
}

#[test]
fn terser_issue_1639_issue_1639_1() {
    let src = r###"var a = 100,
    b = 10;
var L1 = 5;
while (--L1 > 0) {
    if ((--b, false)) {
        if (b) {
            var ignore = 0;
        }
    }
}
console.log(a, b);"###;
    let config = r#"{
    "booleans": true,
    "collapse_vars": true,
    "conditionals": true,
    "evaluate": true,
    "join_vars": true,
    "loops": true,
    "sequences": true,
    "side_effects": true
}"#;

    run_exec_test(src, config, false);
}

#[test]
fn terser_issue_1639_issue_1639_2() {
    let src = r###"var a = 100,
    b = 10;
function f19() {
    if ((++a, false)) if (a) if (++a);
}
f19();
console.log(a, b);"###;
    let config = r#"{
    "booleans": true,
    "collapse_vars": true,
    "conditionals": true,
    "evaluate": true,
    "join_vars": true,
    "sequences": true,
    "side_effects": true
}"#;

    run_exec_test(src, config, false);
}

#[test]
fn terser_arrays_for_loop() {
    let src = r###"function f0() {
    var a = [1, 2, 3];
    var b = 0;
    for (var i = 0; i < a.length; i++) b += a[i];
    return b;
}
function f1() {
    var a = [1, 2, 3];
    var b = 0;
    for (var i = 0, len = a.length; i < len; i++) b += a[i];
    return b;
}
function f2() {
    var a = [1, 2, 3];
    for (var i = 0; i < a.length; i++) a[i]++;
    return a[2];
}
console.log(f0(), f1(), f2());"###;
    let config = r#"{
    "evaluate": true,
    "reduce_funcs": true,
    "reduce_vars": true,
    "unsafe": true,
    "unused": true
}"#;

    run_exec_test(src, config, false);
}

#[test]
fn terser_keep_quoted_strict_keep_quoted_strict() {
    let src = r#"var propa = 1;
var a = {
    propa,
    get propb() {
        return 2;
    },
    propc: 3,
    get propd() {
        return 4;
    },
};
var b = {
    propa: 5,
    get propb() {
        return 6;
    },
    propc: 7,
    get propd() {
        return 8;
    },
};
var c = {};
Object.defineProperty(c, "propa", { value: 9 });
Object.defineProperty(c, "propc", { value: 10 });
console.log(a.propa, a.propb, a.propc, a["propc"], a.propd, a["propd"]);
console.log(b["propa"], b["propb"], b.propc, b["propc"], b.propd, b["propd"]);
console.log(c.propa, c["propc"]);"#;
    let config = r#"{
    "evaluate": true,
    "properties": true
}"#;

    run_exec_test(src, config, false);
}

#[test]
fn terser_switch_issue_1663() {
    let src = r###"var a = 100,
    b = 10;
function f() {
    switch (1) {
        case 1:
            b = a++;
            return ++b;
        default:
            var b;
    }
}
f();
console.log(a, b);"###;
    let config = r#"{
    "dead_code": true,
    "evaluate": true,
    "side_effects": true,
    "switches": true
}"#;

    run_exec_test(src, config, false);
}

#[test]
fn terser_functions_issue_2107() {
    let src = r###"var c = 0;
!(function () {
    c++;
})(
    c++ +
        new (function () {
            this.a = 0;
            var a = (c = c + 1) + (c = 1 + c);
            return c++ + a;
        })()
);
console.log(c);"###;
    let config = r#"{
    "collapse_vars": true,
    "inline": true,
    "passes": 3,
    "sequences": true,
    "side_effects": true,
    "unused": true
}"#;

    run_exec_test(src, config, false);
}

#[test]
fn terser_functions_issue_2630_5() {
    let src = r###"var c = 1;
!(function () {
    do {
        c *= 10;
    } while (f());
    function f() {
        return (function () {
            return (c = 2 + c) < 100;
        })((c = c + 3));
    }
})();
console.log(c);"###;
    let config = r#"{
    "collapse_vars": true,
    "inline": true,
    "reduce_vars": true,
    "unused": true
}"#;

    run_exec_test(src, config, false);
}

#[test]
fn terser_functions_issue_2630_2() {
    let src = r###"var c = 0;
!(function () {
    while (f()) {}
    function f() {
        var not_used = (function () {
            c = 1 + c;
        })((c = c + 1));
    }
})();
console.log(c);"###;
    let config = r#"{
    "collapse_vars": true,
    "inline": true,
    "passes": 2,
    "reduce_vars": true,
    "sequences": true,
    "side_effects": true,
    "unused": true
}"#;

    run_exec_test(src, config, false);
}

#[test]
fn terser_functions_issue_2101() {
    let src = r###"a = {};
console.log(
    (function () {
        return (function () {
            return this.a;
        })();
    })() ===
        (function () {
            return a;
        })()
);"###;
    let config = r#"{
    "inline": true
}"#;

    run_exec_test(src, config, false);
}

#[test]
fn terser_functions_issue_2630_3() {
    let src = r###"var x = 2,
    a = 1;
(function () {
    function f1(a) {
        f2();
        --x >= 0 && f1({});
    }
    f1(a++);
    function f2() {
        a++;
    }
})();
console.log(a);"###;
    let config = r#"{
    "inline": true,
    "reduce_vars": true,
    "unused": true
}"#;

    run_exec_test(src, config, false);
}

#[test]
fn terser_functions_issue_2630_4() {
    let src = r###"var x = 3,
    a = 1,
    b = 2;
(function () {
    (function f1() {
        while (--x >= 0 && f2());
    })();
    function f2() {
        a++ + (b += a);
    }
})();
console.log(a);"###;
    let config = r#"{
    "collapse_vars": true,
    "inline": true,
    "reduce_vars": true,
    "side_effects": true,
    "unused": true
}"#;

    run_exec_test(src, config, false);
}

#[test]
fn terser_functions_issue_1841_2() {
    let src = r#"var b = 10;
!(function (arg) {
    for (var key in "hi") var n = arg.baz, n = [(b = 42)];
})(--b);
console.log(b);"#;
    let config = r#"{
    "keep_fargs": false,
    "pure_getters": false,
    "reduce_funcs": true,
    "reduce_vars": true,
    "unused": true
}"#;

    run_exec_test(src, config, false);
}

#[test]
fn terser_functions_issue_t131a() {
    let src = r###"(function () {
    function thing() {
        return { a: 1 };
    }
    function one() {
        return thing();
    }
    function two() {
        var x = thing();
        x.a = 2;
        x.b = 3;
        return x;
    }
    console.log(JSON.stringify(one()), JSON.stringify(two()));
})();"###;
    let config = r#"{
    "inline": 1,
    "join_vars": true,
    "reduce_vars": true,
    "side_effects": true,
    "passes": 2,
    "unused": true
}"#;

    run_exec_test(src, config, false);
}

#[test]
fn terser_functions_unsafe_apply_1() {
    let src = r#"(function (a, b) {
    console.log(a, b);
}.apply("foo", ["bar"]));
(function (a, b) {
    console.log(this, a, b);
}.apply("foo", ["bar"]));
(function (a, b) {
    console.log(a, b);
}.apply("foo", ["bar"], "baz"));"#;
    let config = r#"{
    "inline": true,
    "passes": 2,
    "reduce_vars": true,
    "side_effects": true,
    "unsafe": true,
    "unused": true
}"#;

    run_exec_test(src, config, false);
}

#[test]
fn terser_functions_issue_2898() {
    let src = r###"var c = 0;
(function () {
    while (f());
    function f() {
        var b = ((c = 1 + c), void (c = 1 + c));
        b && b[0];
    }
})();
console.log(c);"###;
    let config = r#"{
    "collapse_vars": true,
    "inline": true,
    "reduce_vars": true,
    "sequences": true,
    "unused": true
}"#;

    run_exec_test(src, config, false);
}

#[test]
fn terser_functions_inline_1() {
    let src = r###"(function () {
    console.log(1);
})();
(function (a) {
    console.log(a);
})(2);
(function (b) {
    var c = b;
    console.log(c);
})(3);"###;
    let config = r#"{
    "inline": 1,
    "side_effects": true,
    "toplevel": true
}"#;

    run_exec_test(src, config, false);
}

#[test]
fn terser_functions_issue_3125() {
    let src = r#"console.log(
    function () {
        return "PASS";
    }.call()
);"#;
    let config = r#"{
    "inline": true,
    "unsafe": true
}"#;

    run_exec_test(src, config, false);
}

#[test]
fn terser_functions_issue_3016_2() {
    let src = r###"var b = 1;
do {
    (function (a) {
        return a[b];
        try {
            a = 2;
        } catch (a) {
            var a;
        }
    })(3);
} while (0);
console.log(b);"###;
    let config = r#"{
    "dead_code": true,
    "inline": true,
    "toplevel": true
}"#;

    run_exec_test(src, config, false);
}

#[test]
fn terser_functions_issue_2531_1() {
    let src = r#"function outer() {
    function inner(value) {
        function closure() {
            return value;
        }
        return function () {
            return closure();
        };
    }
    return inner("Hello");
}
console.log("Greeting:", outer()());"#;
    let config = r#"{
    "evaluate": true,
    "inline": true,
    "reduce_funcs": true,
    "reduce_vars": true,
    "unused": true
}"#;

    run_exec_test(src, config, false);
}

#[test]
fn terser_functions_use_before_init_in_loop() {
    let src = r#"var a = "PASS";
for (var b = 2; --b >= 0; )
    (function () {
        var c = (function () {
            return 1;
        })(c && (a = "FAIL"));
    })();
console.log(a);"#;
    let config = r#"{
    "inline": true,
    "side_effects": true,
    "toplevel": true
}"#;

    run_exec_test(src, config, false);
}

#[test]
fn terser_functions_unsafe_apply_expansion_2() {
    let src = r###"var values = [2, 3];
console.log.apply(console, [1, ...values, 4]);"###;
    let config = r#"{
    "unsafe": true
}"#;

    run_exec_test(src, config, false);
}

#[test]
fn terser_functions_issue_2663_2() {
    let src = r###"(function () {
    var i;
    function fn(j) {
        return (function () {
            console.log(j);
        })();
    }
    for (i in { a: 1, b: 2, c: 3 }) fn(i);
})();"###;
    let config = r#"{
    "inline": true,
    "reduce_vars": true,
    "side_effects": true,
    "unused": true
}"#;

    run_exec_test(src, config, false);
}

#[test]
fn terser_functions_unsafe_call_3() {
    let src = r#"console.log(
    function () {
        return arguments[0] + eval("arguments")[1];
    }.call(0, 1, 2)
);"#;
    let config = r#"{
    "side_effects": true,
    "unsafe": true
}"#;

    run_exec_test(src, config, false);
}

#[test]
fn terser_functions_unsafe_call_expansion_1() {
    let src = r###"(function (...a) {
    console.log(...a);
}.call(console, 1, ...[2, 3], 4));"###;
    let config = r#"{
    "unsafe": true
}"#;

    run_exec_test(src, config, false);
}

#[test]
fn terser_functions_issue_2630_1() {
    let src = r###"var c = 0;
(function () {
    while (f());
    function f() {
        var a = (function () {
            var b = c++,
                d = (c = 1 + c);
        })();
    }
})();
console.log(c);"###;
    let config = r#"{
    "collapse_vars": true,
    "inline": true,
    "passes": 2,
    "reduce_funcs": true,
    "reduce_vars": true,
    "sequences": true,
    "side_effects": true,
    "unused": true
}"#;

    run_exec_test(src, config, false);
}

#[test]
fn terser_functions_issue_203() {
    let src = r#"var m = {};
var fn = Function("require", "module", "exports", "module.exports = 42;");
fn(null, m, m.exports);
console.log(m.exports);"#;
    let config = r#"{
    "keep_fargs": false,
    "side_effects": true,
    "unsafe_Function": true,
    "unused": true
}"#;

    run_exec_test(src, config, false);
}

#[test]
fn terser_functions_issue_2842() {
    let src = r###"(function () {
    function inlinedFunction(data) {
        return data[data[0]];
    }
    function testMinify() {
        if (true) {
            const data = inlinedFunction([1, 2, 3]);
            console.log(data);
        }
    }
    return testMinify();
})();"###;
    let config = r#"{
    "side_effects": true,
    "reduce_vars": true,
    "unused": true
}"#;

    run_exec_test(src, config, false);
}

#[test]
fn terser_functions_issue_1841_1() {
    let src = r#"var b = 10;
!(function (arg) {
    for (var key in "hi") var n = arg.baz, n = [(b = 42)];
})(--b);
console.log(b);"#;
    let config = r#"{
    "keep_fargs": false,
    "pure_getters": "strict",
    "reduce_funcs": true,
    "reduce_vars": true,
    "unused": true
}"#;

    run_exec_test(src, config, false);
}

#[test]
fn terser_functions_issue_2476() {
    let src = r###"function foo(x, y, z) {
    return x < y ? x * y + z : x * z - y;
}
for (var sum = 0, i = 0; i < 10; i++) sum += foo(i, i + 1, 3 * i);
console.log(sum);"###;
    let config = r#"{
    "inline": true,
    "reduce_vars": true,
    "toplevel": true,
    "unused": true
}"#;

    run_exec_test(src, config, false);
}

#[test]
fn terser_functions_issue_t131b() {
    let src = r###"(function () {
    function thing() {
        return { a: 1 };
    }
    function one() {
        return thing();
    }
    function two() {
        var x = thing();
        x.a = 2;
        x.b = 3;
        return x;
    }
    console.log(JSON.stringify(one()), JSON.stringify(two()));
})();"###;
    let config = r#"{
    "defaults": true,
    "passes": 2
}"#;

    run_exec_test(src, config, false);
}

#[test]
fn terser_functions_inline_2() {
    let src = r###"(function () {
    console.log(1);
})();
(function (a) {
    console.log(a);
})(2);
(function (b) {
    var c = b;
    console.log(c);
})(3);"###;
    let config = r#"{
    "inline": 2,
    "side_effects": true,
    "toplevel": true
}"#;

    run_exec_test(src, config, false);
}

#[test]
fn terser_functions_issue_2531_3() {
    let src = r#"function outer() {
    function inner(value) {
        function closure() {
            return value;
        }
        return function () {
            return closure();
        };
    }
    return inner("Hello");
}
console.log("Greeting:", outer()());"#;
    let config = r#"{
    "evaluate": true,
    "inline": true,
    "passes": 3,
    "reduce_funcs": true,
    "reduce_vars": true,
    "side_effects": true,
    "toplevel": true,
    "unused": true
}"#;

    run_exec_test(src, config, false);
}

#[test]
fn terser_functions_inline_3() {
    let src = r###"(function () {
    console.log(1);
})();
(function (a) {
    console.log(a);
})(2);
(function (b) {
    var c = b;
    console.log(c);
})(3);"###;
    let config = r#"{
    "inline": 3,
    "side_effects": true,
    "toplevel": true
}"#;

    run_exec_test(src, config, false);
}

#[test]
fn terser_functions_issue_2657() {
    let src = r#""use strict";
console.log(
    (function f() {
        return h;
        function g(b) {
            return b || b();
        }
        function h(a) {
            g(a);
            return a;
        }
    })()(42)
);"#;
    let config = r#"{
    "inline": true,
    "reduce_vars": true,
    "sequences": true,
    "passes": 2,
    "unused": true
}"#;

    run_exec_test(src, config, false);
}

#[test]
fn terser_functions_unsafe_apply_expansion_1() {
    let src = r###"console.log.apply(console, [1, ...[2, 3], 4]);"###;
    let config = r#"{
    "unsafe": true
}"#;

    run_exec_test(src, config, false);
}

#[test]
fn terser_functions_issue_3016_1() {
    let src = r###"var b = 1;
do {
    (function (a) {
        return a[b];
        var a;
    })(3);
} while (0);
console.log(b);"###;
    let config = r#"{
    "inline": true,
    "toplevel": true
}"#;

    run_exec_test(src, config, false);
}

#[test]
fn terser_functions_issue_2531_2() {
    let src = r#"function outer() {
    function inner(value) {
        function closure() {
            return value;
        }
        return function () {
            return closure();
        };
    }
    return inner("Hello");
}
console.log("Greeting:", outer()());"#;
    let config = r#"{
    "evaluate": true,
    "inline": true,
    "passes": 3,
    "reduce_funcs": true,
    "reduce_vars": true,
    "side_effects": true,
    "unused": true
}"#;

    run_exec_test(src, config, false);
}

#[test]
fn terser_functions_unsafe_call_expansion_2() {
    let src = r###"var values = [2, 3];
(function (...a) {
    console.log(...a);
}.call(console, 1, ...values, 4));"###;
    let config = r#"{
    "unsafe": true
}"#;

    run_exec_test(src, config, false);
}

#[test]
fn terser_functions_issue_2783() {
    let src = r#"(function () {
    return g;
    function f(a) {
        var b = a.b;
        if (b) return b;
        return a;
    }
    function g(o, i) {
        while (i--) {
            console.log(f(o));
        }
    }
})()({ b: "PASS" }, 1);"#;
    let config = r#"{
    "collapse_vars": true,
    "conditionals": true,
    "if_return": true,
    "inline": true,
    "reduce_vars": true,
    "unused": true
}"#;

    run_exec_test(src, config, false);
}

#[test]
fn terser_functions_unsafe_call_1() {
    let src = r#"(function (a, b) {
    console.log(a, b);
}.call("foo", "bar"));
(function (a, b) {
    console.log(this, a, b);
}.call("foo", "bar"));"#;
    let config = r#"{
    "inline": true,
    "passes": 2,
    "reduce_vars": true,
    "side_effects": true,
    "unsafe": true,
    "unused": true
}"#;

    run_exec_test(src, config, false);
}

#[test]
fn terser_issue_1466_different_variable_in_multiple_for_of() {
    let src = r#"var test = ["a", "b", "c"];
for (let tmp of test) {
    console.log(tmp);
    let dd;
    dd = ["e", "f", "g"];
    for (let t of dd) {
        console.log(t);
    }
}"#;
    let config = r#"{
    "hoist_funs": true,
    "dead_code": true,
    "conditionals": true,
    "comparisons": true,
    "evaluate": true,
    "booleans": true,
    "loops": true,
    "unused": true,
    "keep_fargs": true,
    "if_return": true,
    "join_vars": true,
    "side_effects": true,
    "collapse_vars": true
}"#;

    run_exec_test(src, config, false);
}

#[test]
fn terser_issue_1466_same_variable_in_multiple_for_of() {
    let src = r#"var test = ["a", "b", "c"];
for (let tmp of test) {
    console.log(tmp);
    let dd;
    dd = ["e", "f", "g"];
    for (let tmp of dd) {
        console.log(tmp);
    }
}"#;
    let config = r#"{
    "hoist_funs": true,
    "dead_code": true,
    "conditionals": true,
    "comparisons": true,
    "evaluate": true,
    "booleans": true,
    "loops": true,
    "unused": true,
    "keep_fargs": true,
    "if_return": true,
    "join_vars": true,
    "side_effects": true,
    "collapse_vars": true
}"#;

    run_exec_test(src, config, false);
}

#[test]
fn terser_issue_1466_same_variable_in_multiple_for_of_sequences_let() {
    let src = r#"var test = ["a", "b", "c"];
for (let tmp of test) {
    console.log(tmp);
    let dd;
    dd = ["e", "f", "g"];
    for (let tmp of dd) {
        console.log(tmp);
    }
}"#;
    let config = r#"{
    "hoist_funs": true,
    "dead_code": true,
    "conditionals": true,
    "comparisons": true,
    "evaluate": true,
    "booleans": true,
    "loops": true,
    "unused": true,
    "keep_fargs": true,
    "if_return": true,
    "join_vars": true,
    "sequences": true,
    "side_effects": true,
    "collapse_vars": true
}"#;

    run_exec_test(src, config, false);
}

#[test]
fn terser_issue_1466_same_variable_in_multiple_for_in_sequences_const() {
    let src = r#"var test = ["a", "b", "c"];
for (const tmp in test) {
    console.log(tmp);
    let dd;
    dd = ["e", "f", "g"];
    for (const tmp in test) {
        console.log(tmp);
    }
}"#;
    let config = r#"{
    "hoist_funs": true,
    "dead_code": true,
    "conditionals": true,
    "comparisons": true,
    "evaluate": true,
    "booleans": true,
    "loops": true,
    "unused": false,
    "keep_fargs": true,
    "if_return": true,
    "join_vars": true,
    "sequences": true,
    "side_effects": true,
    "collapse_vars": true
}"#;

    run_exec_test(src, config, false);
}

#[test]
fn terser_issue_1466_more_variable_in_multiple_for() {
    let src = r###"for (let a = 9, i = 0; i < 20; i += a) {
    let b = a++ + i;
    console.log(a, b, i);
    for (let k = b, m = b * b, i = 0; i < 10; i++) {
        console.log(a, b, m, k, i);
    }
}"###;
    let config = r#"{
    "hoist_funs": true,
    "dead_code": true,
    "conditionals": true,
    "comparisons": true,
    "evaluate": true,
    "booleans": true,
    "loops": true,
    "unused": false,
    "keep_fargs": true,
    "if_return": true,
    "join_vars": true,
    "side_effects": true,
    "collapse_vars": true
}"#;

    run_exec_test(src, config, false);
}

#[test]
fn terser_issue_1466_different_variable_in_multiple_for_in() {
    let src = r#"var test = ["a", "b", "c"];
for (let tmp in test) {
    console.log(tmp);
    let dd;
    dd = ["e", "f", "g"];
    for (let t in test) {
        console.log(t);
    }
}"#;
    let config = r#"{
    "hoist_funs": true,
    "dead_code": true,
    "conditionals": true,
    "comparisons": true,
    "evaluate": true,
    "booleans": true,
    "loops": true,
    "unused": false,
    "keep_fargs": true,
    "if_return": true,
    "join_vars": true,
    "side_effects": true,
    "collapse_vars": true
}"#;

    run_exec_test(src, config, false);
}

#[test]
fn terser_issue_1466_same_variable_in_multiple_for_in() {
    let src = r#"var test = ["a", "b", "c"];
for (let tmp in test) {
    console.log(tmp);
    let dd;
    dd = ["e", "f", "g"];
    for (let tmp in test) {
        console.log(tmp);
    }
}"#;
    let config = r#"{
    "hoist_funs": true,
    "dead_code": true,
    "conditionals": true,
    "comparisons": true,
    "evaluate": true,
    "booleans": true,
    "loops": true,
    "unused": false,
    "keep_fargs": true,
    "if_return": true,
    "join_vars": true,
    "side_effects": true,
    "collapse_vars": true
}"#;

    run_exec_test(src, config, false);
}

#[test]
fn terser_issue_1466_same_variable_in_multiple_for_in_sequences_let() {
    let src = r#"var test = ["a", "b", "c"];
for (let tmp in test) {
    console.log(tmp);
    let dd;
    dd = ["e", "f", "g"];
    for (let tmp in test) {
        console.log(tmp);
    }
}"#;
    let config = r#"{
    "hoist_funs": true,
    "dead_code": true,
    "conditionals": true,
    "comparisons": true,
    "evaluate": true,
    "booleans": true,
    "loops": true,
    "unused": false,
    "keep_fargs": true,
    "if_return": true,
    "join_vars": true,
    "sequences": true,
    "side_effects": true,
    "collapse_vars": true
}"#;

    run_exec_test(src, config, false);
}

#[test]
fn terser_issue_1466_same_variable_in_multiple_for_of_sequences_const() {
    let src = r#"var test = ["a", "b", "c"];
for (const tmp of test) {
    console.log(tmp);
    let dd;
    dd = ["e", "f", "g"];
    for (const tmp of dd) {
        console.log(tmp);
    }
}"#;
    let config = r#"{
    "hoist_funs": true,
    "dead_code": true,
    "conditionals": true,
    "comparisons": true,
    "evaluate": true,
    "booleans": true,
    "loops": true,
    "unused": true,
    "keep_fargs": true,
    "if_return": true,
    "join_vars": true,
    "sequences": true,
    "side_effects": true,
    "collapse_vars": true
}"#;

    run_exec_test(src, config, false);
}

#[test]
fn terser_issue_747_dont_reuse_prop() {
    let src = r#""aaaaaaaaaabbbbb";
var obj = {};
obj.a = 123;
obj.asd = 256;
console.log(obj.a);"#;
    let config = r###"{}"###;

    run_exec_test(src, config, false);
}

#[test]
fn terser_issue_747_unmangleable_props_should_always_be_reserved() {
    let src = r#""aaaaaaaaaabbbbb";
var obj = {};
obj.asd = 256;
obj.a = 123;
console.log(obj.a);"#;
    let config = r###"{}"###;

    run_exec_test(src, config, false);
}

#[test]
fn terser_loops_issue_2740_7() {
    let src = r###"let a = 9,
    b = 0;
for (const a = 1; a < 3; ++b) break;
console.log(a, b);"###;
    let config = r#"{
    "dead_code": true,
    "loops": true
}"#;

    run_exec_test(src, config, false);
}

#[test]
fn terser_loops_issue_2740_8() {
    let src = r###"var a = 9,
    b = 0;
for (const a = 1; a < 3; ++b) break;
console.log(a, b);"###;
    let config = r#"{
    "dead_code": true,
    "loops": true
}"#;

    run_exec_test(src, config, false);
}

#[test]
fn terser_loops_issue_2740_6() {
    let src = r###"const a = 9,
    b = 0;
for (const a = 1; a < 3; ++b) break;
console.log(a, b);"###;
    let config = r#"{
    "dead_code": true,
    "loops": true
}"#;

    run_exec_test(src, config, false);
}

#[test]
fn terser_loops_issue_2740_3() {
    let src = r###"L1: for (var x = 0; x < 3; x++) {
    L2: for (var y = 0; y < 2; y++) {
        break L1;
    }
}
console.log(x, y);"###;
    let config = r#"{
    "dead_code": true,
    "loops": true
}"#;

    run_exec_test(src, config, false);
}

#[test]
fn terser_loops_issue_2740_4() {
    let src = r###"L1: for (var x = 0; x < 3; x++) {
    L2: for (var y = 0; y < 2; y++) {
        break L2;
    }
}
console.log(x, y);"###;
    let config = r#"{
    "dead_code": true,
    "loops": true,
    "passes": 2
}"#;

    run_exec_test(src, config, false);
}

#[test]
fn terser_loops_issue_2740_5() {
    let src = r###"L1: for (var x = 0; x < 3; x++) {
    break L1;
    L2: for (var y = 0; y < 2; y++) {
        break L2;
    }
}
console.log(x, y);"###;
    let config = r#"{
    "dead_code": true,
    "loops": true,
    "passes": 2
}"#;

    run_exec_test(src, config, false);
}

#[test]
fn terser_rename_function_iife_catch() {
    let src = r###"function f(n) {
    !(function () {
        try {
            throw 0;
        } catch (n) {
            var a = 1;
            console.log(n, a);
        }
    })();
}
f();"###;
    let config = r###"{}"###;

    run_exec_test(src, config, false);
}

#[test]
fn terser_rename_mangle_catch_var() {
    let src = r#"var a = "FAIL";
try {
    throw 1;
} catch (args) {
    var a = "PASS";
}
console.log(a);"#;
    let config = r#"{
    "ie8": false,
    "toplevel": false
}"#;

    run_exec_test(src, config, false);
}

#[test]
fn terser_negate_iife_issue_1254_negate_iife_true() {
    let src = r#"(function () {
    return function () {
        console.log("test");
    };
})()();"#;
    let config = r#"{
    "negate_iife": true
}"#;

    run_exec_test(src, config, false);
}

#[test]
fn terser_try_catch_catch_destructuring_with_sequence() {
    let src = r###"try {
    throw {};
} catch ({ xCover = (0, function () { }) }) {
    console.log(typeof xCover)
}"###;
    let config = r###"{}"###;

    run_exec_test(src, config, false);
}

#[test]
fn terser_issue_281_pure_annotation_1() {
    let src = r#"(function () {
    console.log("hello");
})();"#;
    let config = r#"{
    "inline": true,
    "side_effects": true
}"#;

    run_exec_test(src, config, false);
}

#[test]
fn terser_issue_281_keep_fargs() {
    let src = r###"var a = 1;
!(function (a_1) {
    a++;
})(a++ + (a && a.var));
console.log(a);"###;
    let config = r#"{
    "collapse_vars": true,
    "inline": true,
    "keep_fargs": true,
    "side_effects": true,
    "unused": true
}"#;

    run_exec_test(src, config, false);
}

#[test]
fn terser_issue_281_drop_fargs() {
    let src = r###"var a = 1;
!(function (a_1) {
    a++;
})(a++ + (a && a.var));
console.log(a);"###;
    let config = r#"{
    "collapse_vars": true,
    "inline": true,
    "keep_fargs": false,
    "side_effects": true,
    "unused": true
}"#;

    run_exec_test(src, config, false);
}

#[test]
fn terser_issue_281_pure_annotation_2() {
    let src = r#"(function (n) {
    console.log("hello", n);
})(42);"#;
    let config = r#"{
    "collapse_vars": true,
    "inline": true,
    "side_effects": true
}"#;

    run_exec_test(src, config, false);
}

#[test]
fn terser_arguments_duplicate_parameter_with_arguments() {
    let src = r#"(function (a, a) {
    console.log((a = "foo"), arguments[0]);
})("baz", "Bar");"#;
    let config = r#"{
    "arguments": true,
    "defaults": true
}"#;

    run_exec_test(src, config, false);
}

#[test]
fn terser_arguments_destructuring_1() {
    let src = r#"(function (a, { d: d }) {
    console.log((a = "foo"), arguments[0]);
})("baz", { d: "Bar" });"#;
    let config = r#"{
    "arguments": true,
    "defaults": true
}"#;

    run_exec_test(src, config, false);
}

#[test]
fn terser_arguments_destructuring_2() {
    let src = r#"(function ({ d: d }, a) {
    console.log((a = "foo"), arguments[0].d);
})({ d: "Bar" }, "baz");"#;
    let config = r#"{
    "arguments": true,
    "defaults": true
}"#;

    run_exec_test(src, config, false);
}

#[test]
fn terser_arguments_modified_strict() {
    let src = r#""use strict";
(function (a, b) {
    var c = arguments[0];
    var d = arguments[1];
    var a = "foo";
    b++;
    arguments[0] = "moo";
    arguments[1] *= 2;
    console.log(a, b, c, d, arguments[0], arguments[1]);
})("bar", 42);"#;
    let config = r#"{
    "arguments": true,
    "reduce_vars": true
}"#;

    run_exec_test(src, config, false);
}

#[test]
fn terser_arguments_replace_index() {
    let src = r#"var arguments = [];
console.log(arguments[0]);
(function () {
    console.log(arguments[1], arguments["1"], arguments["foo"]);
})("bar", 42);
(function (a, b) {
    console.log(arguments[1], arguments["1"], arguments["foo"]);
})("bar", 42);
(function (arguments) {
    console.log(arguments[1], arguments["1"], arguments["foo"]);
})("bar", 42);
(function () {
    var arguments;
    console.log(arguments[1], arguments["1"], arguments["foo"]);
})("bar", 42);"#;
    let config = r#"{
    "arguments": true,
    "evaluate": true,
    "properties": true
}"#;

    run_exec_test(src, config, false);
}

#[test]
fn terser_arguments_modified() {
    let src = r#"(function (a, b) {
    var c = arguments[0];
    var d = arguments[1];
    var a = "foo";
    b++;
    arguments[0] = "moo";
    arguments[1] *= 2;
    console.log(a, b, c, d, arguments[0], arguments[1]);
})("bar", 42);"#;
    let config = r#"{
    "arguments": true
}"#;

    run_exec_test(src, config, false);
}

#[test]
fn terser_arguments_replace_index_strict() {
    let src = r#""use strict";
(function () {
    console.log(arguments[1], arguments["1"], arguments["foo"]);
})("bar", 42);
(function (a, b) {
    console.log(arguments[1], arguments["1"], arguments["foo"]);
})("bar", 42);"#;
    let config = r#"{
    "arguments": true,
    "evaluate": true,
    "properties": true,
    "reduce_vars": true
}"#;

    run_exec_test(src, config, false);
}

#[test]
fn terser_arguments_issue_687() {
    let src = r###"function shouldBePure() {
    return arguments.length;
}
console.log(shouldBePure())"###;
    let config = r#"{
    "defaults": true,
    "toplevel": true
}"#;

    run_exec_test(src, config, false);
}

#[test]
fn terser_arguments_replace_index_keep_fargs() {
    let src = r#"var arguments = [];
console.log(arguments[0]);
(function () {
    console.log(arguments[1], arguments["1"], arguments["foo"]);
})("bar", 42);
(function (a, b) {
    console.log(arguments[1], arguments["1"], arguments["foo"]);
})("bar", 42);
(function (arguments) {
    console.log(arguments[1], arguments["1"], arguments["foo"]);
})("bar", 42);
(function () {
    var arguments;
    console.log(arguments[1], arguments["1"], arguments["foo"]);
})("bar", 42);"#;
    let config = r#"{
    "arguments": true,
    "evaluate": true,
    "keep_fargs": false,
    "properties": true
}"#;

    run_exec_test(src, config, false);
}

#[test]
fn terser_typeof_issue_2728_3() {
    let src = r###"(function () {
    function arguments() {}
    console.log(typeof arguments);
})();"###;
    let config = r#"{
    "evaluate": true,
    "reduce_vars": true,
    "typeofs": true
}"#;

    run_exec_test(src, config, false);
}

#[test]
fn terser_typeof_issue_2728_4() {
    let src = r###"function arguments() {}
console.log(typeof arguments);"###;
    let config = r#"{
    "evaluate": true,
    "reduce_vars": true,
    "toplevel": true,
    "typeofs": true
}"#;

    run_exec_test(src, config, false);
}

#[test]
fn terser_typeof_typeof_defun_1() {
    let src = r#"function f() {
    console.log("YES");
}
function g() {
    h = 42;
    console.log("NOPE");
}
function h() {
    console.log("YUP");
}
g = 42;
"function" == typeof f && f();
"function" == typeof g && g();
"function" == typeof h && h();"#;
    let config = r#"{
    "evaluate": true,
    "inline": true,
    "passes": 2,
    "reduce_vars": true,
    "side_effects": true,
    "toplevel": true,
    "typeofs": true,
    "unused": true
}"#;

    run_exec_test(src, config, false);
}

#[test]
#[ignore]
fn terser_pure_funcs_issue_3065_4() {
    let src = r#"var debug = function (msg) {
    console.log(msg);
};
debug(
    (function () {
        console.log("PASS");
        return "FAIL";
    })()
);"#;
    let config = r#"{
    "pure_funcs": ["debug"],
    "reduce_vars": true,
    "side_effects": true,
    "toplevel": true,
    "unused": true
}"#;

    run_exec_test(src, config, false);
}

#[test]
#[ignore]
fn terser_pure_funcs_issue_3065_3() {
    let src = r#"function debug(msg) {
    console.log(msg);
}
debug(
    (function () {
        console.log("PASS");
        return "FAIL";
    })()
);"#;
    let config = r#"{
    "pure_funcs": ["debug"],
    "reduce_vars": true,
    "side_effects": true,
    "toplevel": true,
    "unused": true
}"#;

    run_exec_test(src, config, false);
}

#[test]
fn issues_vercel_ms_1() {
    let src = r#"const s = 1000;
const m = s * 60;
const h = m * 60;
const d = h * 24;
const w = d * 7;
const y = d * 365.25;
function ms(value, options) {
    try {
        if (typeof value === "string" && value.length > 0) {
            return parse(value);
        } else if (typeof value === "number" && isFinite(value)) {
            return options?.long ? fmtLong(value) : fmtShort(value);
        }
        throw new Error("Value is not a string or number.");
    } catch (error) {
        const message = isError(error) ? `${error.message}. value=${JSON.stringify(value)}` : "An unknown error has occured.";
        throw new Error(message);
    }
}
function parse(str) {
    str = String(str);
    if (str.length > 100) {
        throw new Error("Value exceeds the maximum length of 100 characters.");
    }
    const match = /^(-?(?:\d+)?\.?\d+) *(milliseconds?|msecs?|ms|seconds?|secs?|s|minutes?|mins?|m|hours?|hrs?|h|days?|d|weeks?|w|years?|yrs?|y)?$/i.exec(str);
    if (!match) {
        return NaN;
    }
    const n = parseFloat(match[1]);
    const type = (match[2] || "ms").toLowerCase();
    switch (type) {
        case "years":
        case "year":
        case "yrs":
        case "yr":
        case "y":
            return n * y;
        case "weeks":
        case "week":
        case "w":
            return n * w;
        case "days":
        case "day":
        case "d":
            return n * d;
        case "hours":
        case "hour":
        case "hrs":
        case "hr":
        case "h":
            return n * h;
        case "minutes":
        case "minute":
        case "mins":
        case "min":
        case "m":
            return n * m;
        case "seconds":
        case "second":
        case "secs":
        case "sec":
        case "s":
            return n * s;
        case "milliseconds":
        case "millisecond":
        case "msecs":
        case "msec":
        case "ms":
            return n;
        default:
            throw new Error(`The unit ${type} was matched, but no matching case exists.`);
    }
}

function fmtShort(ms) {
    const msAbs = Math.abs(ms);
    if (msAbs >= d) {
        return `${Math.round(ms / d)}d`;
    }
    if (msAbs >= h) {
        return `${Math.round(ms / h)}h`;
    }
    if (msAbs >= m) {
        return `${Math.round(ms / m)}m`;
    }
    if (msAbs >= s) {
        return `${Math.round(ms / s)}s`;
    }
    return `${ms}ms`;
}
function fmtLong(ms) {
    const msAbs = Math.abs(ms);
    if (msAbs >= d) {
        return plural(ms, msAbs, d, "day");
    }
    if (msAbs >= h) {
        return plural(ms, msAbs, h, "hour");
    }
    if (msAbs >= m) {
        return plural(ms, msAbs, m, "minute");
    }
    if (msAbs >= s) {
        return plural(ms, msAbs, s, "second");
    }
    return `${ms} ms`;
}
function plural(ms, msAbs, n, name) {
    const isPlural = msAbs >= n * 1.5;
    return `${Math.round(ms / n)} ${name}${isPlural ? "s" : ""}`;
}
function isError(error) {
    return typeof error === "object" && error !== null && "message" in error;
}

console.log(ms(123))
console.log(ms('123day'))
console.log(ms(12321341234217))
console.log(ms(12321341234217))
console.log(ms(12321341234217))
console.log(ms(12321341234217))
console.log(ms(12321341234217))
console.log(ms(12321341234217))
console.log(ms(12321341234217))"#;
    let config = r#"{
    "defaults": true,
    "toplevel": true
}"#;

    run_exec_test(src, config, false);
}

#[test]
fn issues_2011_1() {
    let src = r###"class ClassA {
    constructor() {
        console.log('Class A');
    }
}

const cls = class ClassB {
    static MyA = ClassA;

    constructor() {
        console.log('Claas B');
    }

    it() {
        console.log('method it - start');

        this.bb = new ClassB.MyA();

        console.log('method it - end');
    }
}


new cls().it();"###;
    let config = r#"{
    "defaults": true
}"#;

    run_exec_test(src, config, false);
}

#[test]
fn issues_2011_2() {
    let src = r#"function _class_call_check(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
    }
}
function _defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
        var descriptor = props[i];
        descriptor.enumerable = descriptor.enumerable || false;
        descriptor.configurable = true;
        if ("value" in descriptor) descriptor.writable = true;
        Object.defineProperty(target, descriptor.key, descriptor);
    }
}
function _create_class(Constructor, protoProps, staticProps) {
    if (protoProps) _defineProperties(Constructor.prototype, protoProps);
    if (staticProps) _defineProperties(Constructor, staticProps);
    return Constructor;
}
function _define_property(obj, key, value) {
    if (key in obj) {
        Object.defineProperty(obj, key, {
            value: value,
            enumerable: true,
            configurable: true,
            writable: true
        });
    } else {
        obj[key] = value;
    }
    return obj;
}
var ClassA = function ClassA() {
    "use strict";
    _class_call_check(this, ClassA);
    console.log('Class A');
};
var cls = function () {
    var ClassB = /*#__PURE__*/ function () {
        "use strict";
        function ClassB() {
            _class_call_check(this, ClassB);
            console.log('Claas B');
        }
        _create_class(ClassB, [
            {
                key: "it",
                value: function it() {
                    console.log('method it - start');
                    this.bb = new ClassB.MyA();
                    console.log('method it - end');
                }
            }
        ]);
        return ClassB;
    }();
    _define_property(ClassB, "MyA", ClassA);
    return ClassB;
}();
new cls().it();"#;
    let config = r#"{
    "defaults": true
}"#;

    run_exec_test(src, config, false);
}

#[test]
fn murmur2_1() {
    let src = r#"function murmur2(str) {
    // 'm' and 'r' are mixing constants generated offline.
    // They're not really 'magic', they just happen to work well.
    // const m = 0x5bd1e995;
    // const r = 24;
    // Initialize the hash
    var h = 0; // Mix 4 bytes at a time into the hash

    var k,
        i = 0,
        len = str.length;

    for (; len >= 4; ++i, len -= 4) {
        k = str.charCodeAt(i) & 0xff | (str.charCodeAt(++i) & 0xff) << 8 | (str.charCodeAt(++i) & 0xff) << 16 | (str.charCodeAt(++i) & 0xff) << 24;
        k =
            /* Math.imul(k, m): */
            (k & 0xffff) * 0x5bd1e995 + ((k >>> 16) * 0xe995 << 16);
        k ^=
            /* k >>> r: */
            k >>> 24;
        h =
            /* Math.imul(k, m): */
            (k & 0xffff) * 0x5bd1e995 + ((k >>> 16) * 0xe995 << 16) ^
            /* Math.imul(h, m): */
            (h & 0xffff) * 0x5bd1e995 + ((h >>> 16) * 0xe995 << 16);
    } // Handle the last few bytes of the input array


    switch (len) {
        case 3:
            h ^= (str.charCodeAt(i + 2) & 0xff) << 16;

        case 2:
            h ^= (str.charCodeAt(i + 1) & 0xff) << 8;

        case 1:
            h ^= str.charCodeAt(i) & 0xff;
            h =
                /* Math.imul(h, m): */
                (h & 0xffff) * 0x5bd1e995 + ((h >>> 16) * 0xe995 << 16);
    } // Do a few final mixes of the hash to ensure the last few
    // bytes are well-incorporated.


    h ^= h >>> 13;
    h =
        /* Math.imul(h, m): */
        (h & 0xffff) * 0x5bd1e995 + ((h >>> 16) * 0xe995 << 16);
    return ((h ^ h >>> 15) >>> 0).toString(36);
}

console.log(murmur2("123421334"))
console.log(murmur2("123asd ;nv"))
console.log(murmur2("1va1ns`klj"))"#;
    let config = r#"{
    "defaults": true,
    "toplevel": true
}"#;

    run_exec_test(src, config, false);
}

#[test]
fn murmur2_reduced() {
    let src = r#"function murmur2(str) {
    var h = 0;
    var k, i = 0, len = str.length;
    for (; len >= 4; ++i, len -= 4) {
        k = 255 & str.charCodeAt(i) | (255 & str.charCodeAt(++i)) << 8 | (255 & str.charCodeAt(++i)) << 16 | (255 & str.charCodeAt(++i)) << 24;
        k = (65535 & k) * 1540483477 + ((k >>> 16) * 59797 << 16);
        k ^= k >>> 24;
        h = (65535 & k) * 1540483477 + ((k >>> 16) * 59797 << 16) ^ (65535 & h) * 1540483477 + ((h >>> 16) * 59797 << 16);
    }
    switch (len) {
        case 3:
            h ^= (255 & str.charCodeAt(i + 2)) << 16;
        case 2:
            h ^= (255 & str.charCodeAt(i + 1)) << 8;
        case 1:
            h ^= 255 & str.charCodeAt(i);
            h = (65535 & h) * 1540483477 + ((h >>> 16) * 59797 << 16);
    }
    h ^= h >>> 13;
    h = (65535 & h) * 1540483477 + ((h >>> 16) * 59797 << 16);
    return ((h ^ h >>> 15) >>> 0).toString(36);
}
console.log(murmur2("123421334"));
console.log(murmur2("123asd ;nv"));
console.log(murmur2("1va1ns`klj"));"#;
    let config = r#"{
    "defaults": true,
    "toplevel": true
}"#;

    run_exec_test(src, config, false);
}

#[test]
fn plotly_1() {
    let src = r###"
    function log2(v) {
        var r, shift;
        r =     (v > 0xFFFF) << 4; v >>>= r;
        shift = (v > 0xFF  ) << 3; v >>>= shift; r |= shift;
        shift = (v > 0xF   ) << 2; v >>>= shift; r |= shift;
        shift = (v > 0x3   ) << 1; v >>>= shift; r |= shift;
        return r | (v >> 1);
    }
    console.log(log2(65536))
    console.log(log2(2))
    console.log(log2(4))
    console.log(log2(8))
    "###;
    let config = r#"{
        "defaults": true,
        "toplevel": true
    }"#;

    run_exec_test(src, config, false);
}

#[test]
fn internal_1() {
    let src = r###"
    function H (x) {
        return function (y, z) {
            return x._ + y + z
        }
    }
    
    function P () {
        var a = 0
        a = {
            _: 1
        }
        a.calc = H(a)
        return a
    }
    
    console.log(P().calc(1, 1))
    "###;

    let config = r#"{
        "defaults": true,
        "toplevel": true
    }"#;

    run_exec_test(src, config, false);
}

#[test]
fn direct_eval_1() {
    let src = r###"
    const obj = {
        1: function () {
            const foo = 1;
            return {
                test: function (s) {
                    return eval(s)
                }
            }
        },
        2: function foo(mod1) {
            console.log(mod1.test('foo'))
        }
    };
    
    
    obj[2](obj[1]());
    "###;

    let config = r#"{
        "defaults": true,
        "toplevel": true
    }"#;

    run_exec_test(src, config, false);
}

#[test]
fn indirect_eval_1() {
    let src = r###"
    const obj = {
        1: function () {
            const foo = 1;
            return {
                test: function (s) {
                    const e = eval;
                    return e(s)
                }
            }
        },
        2: function foo(mod1) {
            let success = false;
            try {
                mod1.test('foo')
            } catch (e) {
                success = true;
                console.log('PASS');
            }
            if (!success) {
                throw new Error('indirect eval should not be direct eval');
            }
        }
    };
    
    
    obj[2](obj[1]());
    "###;

    let config = r#"{
        "defaults": true,
        "toplevel": true
    }"#;

    run_exec_test(src, config, false);
}

#[test]
fn try_catch_1() {
    let src = r#"
    var a = "FAIL";
    try {
        throw 1;
    } catch (args) {
        a = "PASS";
    }
    console.log(a);

    "#;

    run_default_exec_test(src);
}

#[test]
fn try_catch_2() {
    let src = r#"
    var a = "PASS";
    try {
        throw "FAIL1";
    } catch (a) {
        var a = "FAIL2";
    }
    console.log(a);
    "#;

    run_default_exec_test(src);
}

#[test]
fn try_catch_3() {
    let src = r#"
    var a = "FAIL";
    try {
        throw 1;
    } catch (args) {
        var a = "PASS";
    }
    console.log(a);
    "#;

    run_default_exec_test(src);
}

#[test]
fn try_catch_4() {
    let src = r#"
    "aaaaaaaa";
    var a = 1,
        b = "FAIL";
    try {
        throw 1;
    } catch (c) {
        try {
            throw 0;
        } catch (a) {
            if (c) b = "PASS";
        }
    }
    console.log(b);
    "#;

    run_default_exec_test(src);
}

#[test]
fn try_catch_5() {
    let src = r#"
    var a = "PASS";
    try {
        throw "FAIL1";
    } catch (a) {
        var a = "FAIL2";
    }
    console.log(a);
    "#;

    run_default_exec_test(src);
}

#[test]
fn issue_4444_1() {
    let src = r#"
    const test = () => {
        let a = 0;
        let b = 0;
        let c = [1, 2, 3, 4, 5].map((i) => {
          a += i;
          b += i;
          return i;
        });
        return [a, b, c];
      };
      
      const [a, b, c] = test();
      console.log("test", a, b, c);
    "#;

    let config = r#"
    {
        "arguments": false,
        "arrows": false,
        "booleans": true,
        "booleans_as_integers": false,
        "collapse_vars": true,
        "comparisons": true,
        "computed_props": false,
        "conditionals": false,
        "dead_code": false,
        "directives": false,
        "drop_console": false,
        "drop_debugger": true,
        "evaluate": false,
        "expression": false,
        "hoist_funs": false,
        "hoist_props": false,
        "hoist_vars": false,
        "if_return": true,
        "join_vars": false,
        "keep_classnames": false,
        "keep_fargs": true,
        "keep_fnames": false,
        "keep_infinity": false,
        "loops": true,
        "negate_iife": false,
        "properties": true,
        "reduce_funcs": false,
        "reduce_vars": false,
        "side_effects": true,
        "switches": false,
        "typeofs": false,
        "unsafe": false,
        "unsafe_arrows": false,
        "unsafe_comps": false,
        "unsafe_Function": false,
        "unsafe_math": false,
        "unsafe_symbols": false,
        "unsafe_methods": false,
        "unsafe_proto": false,
        "unsafe_regexp": false,
        "unsafe_undefined": false,
        "unused": true
      }
    "#;

    run_exec_test(src, config, false);
}

#[test]
fn terser_insane_1() {
    let src = r###"
    function f() {
        a--;
        try {
            a++;
            x();
        } catch (a) {
            if (a) var a;
            var a = 10;
        }
        console.log(a)
    }
    f();
    "###;

    let config = r#"
    {
        "conditionals": true,
        "negate_iife": true,
        "passes": 2,
        "reduce_funcs": true,
        "reduce_vars": true,
        "side_effects": true,
        "toplevel": true,
        "unused": true
    }
    "#;

    run_exec_test(src, config, false);
}

#[test]
fn terser_insane_2() {
    let src = r###"
    function f() {
        console.log(a)
        a--;
        console.log(a)
        try {
            console.log(a)
            a++;
            console.log(a)
            x();
        } catch (a) {
            if (a) var a;
            var a = 10;
        }
        console.log(a)
    }
    f();
    "###;

    let config = r#"
    {
        "conditionals": true,
        "negate_iife": true,
        "passes": 2,
        "reduce_funcs": true,
        "reduce_vars": true,
        "side_effects": true,
        "toplevel": true,
        "unused": true
    }
    "#;

    run_exec_test(src, config, false);
}

#[test]
fn issue_4788_1() {
    let src = r#"
    let id = 0;

    const obj = {
        get foo() {
            console.log("foo", id++);
        },
    };

    obj.foo;

    const obj2 = {
        ...obj,
    };

    obj2.foo;

    const obj3 = {
        ...obj,
        foo: 1,
    };

    obj3.foo;
    "#;

    run_default_exec_test(src);
}

#[test]
fn issue_5645() {
    let src = r###"
    const t = {
        1: 'a',
        2: 'b'
    }
    function g(arg) {
        if (t[arg] === undefined) {
            var arg = 2
        }
        return t[arg]
    }
    
    console.log(g(1))
    "###;
    let config = r#"
    {
        "arguments": false,
        "arrows": false,
        "booleans": false,
        "booleans_as_integers": false,
        "collapse_vars": false,
        "comparisons": false,
        "computed_props": false,
        "conditionals": false,
        "dead_code": false,
        "directives": false,
        "drop_console": false,
        "drop_debugger": false,
        "evaluate": false,
        "expression": false,
        "hoist_funs": false,
        "hoist_props": false,
        "hoist_vars": false,
        "if_return": false,
        "join_vars": false,
        "keep_classnames": false,
        "keep_fargs": false,
        "keep_fnames": false,
        "keep_infinity": false,
        "loops": false,
        "negate_iife": false,
        "properties": false,
        "reduce_funcs": false,
        "reduce_vars": false,
        "side_effects": false,
        "switches": false,
        "typeofs": false,
        "unsafe": false,
        "unsafe_arrows": false,
        "unsafe_comps": false,
        "unsafe_Function": false,
        "unsafe_math": false,
        "unsafe_symbols": false,
        "unsafe_methods": false,
        "unsafe_proto": false,
        "unsafe_regexp": false,
        "unsafe_undefined": false,
        "unused": false,
        "const_to_let": false,
        "pristine_globals": false
    }
    "#;

    run_exec_test(src, config, false);
}

#[test]
fn issue_5799() {
    let src = r"
    console.log(`\u2014`)
    ";

    run_default_exec_test(src);
}

#[test]
fn issue_5914() {
    let src = r###"
        class Test {
            constructor(config) {
            const that = this;
            this.config = config;
            this.options = {
                get config() {
                    return that.config;
                },
            };
            }
        }
      
        const instance = new Test(42);
        console.log(instance.options.config); 
    "###;

    let config = r#"
        {
            "arguments": false,
            "arrows": true,
            "booleans": true,
            "booleans_as_integers": false,
            "collapse_vars": true,
            "comparisons": true,
            "computed_props": true,
            "conditionals": true,
            "dead_code": true,
            "directives": true,
            "drop_console": false,
            "drop_debugger": true,
            "evaluate": true,
            "expression": false,
            "hoist_funs": false,
            "hoist_props": true,
            "hoist_vars": false,
            "if_return": true,
            "join_vars": true,
            "keep_classnames": false,
            "keep_fargs": true,
            "keep_fnames": false,
            "keep_infinity": false,
            "loops": true,
            "negate_iife": true,
            "properties": true,
            "reduce_funcs": false,
            "reduce_vars": false,
            "side_effects": true,
            "switches": true,
            "typeofs": true,
            "unsafe": false,
            "unsafe_arrows": false,
            "unsafe_comps": false,
            "unsafe_Function": false,
            "unsafe_math": false,
            "unsafe_symbols": false,
            "unsafe_methods": false,
            "unsafe_proto": false,
            "unsafe_regexp": false,
            "unsafe_undefined": false,
            "unused": true,
            "const_to_let": true,
            "pristine_globals": true
        }
    "#;

    run_exec_test(src, config, false);
}

#[test]
fn feedback_regex_range() {
    let src = r###"
        const rtlRegEx = new RegExp(
            /* eslint-disable prettier/prettier */
            '[' +
            String.fromCharCode(0x00591) + '-' + String.fromCharCode(0x008ff) +
            String.fromCharCode(0x0fb1d) + '-' + String.fromCharCode(0x0fdff) +
            String.fromCharCode(0x0fe70) + '-' + String.fromCharCode(0x0fefc) +
            String.fromCharCode(0x10800) + '-' + String.fromCharCode(0x10fff) +
            String.fromCharCode(0x1e800) + '-' + String.fromCharCode(0x1efff) +
            ']'
            /* eslint-enable prettier/prettier */
        );
        console.log('PASS')
        "###;

    run_default_exec_test(src);
}

#[test]
fn issue_6004() {
    run_default_exec_test(
        r###"
        const props = {'a': 1, 'b': 2};
        const isBox = 'a' in props || 'b' in props;
        for (const p in props) {
            delete props[p];
        }
        console.log(isBox);
        "###,
    );
}

#[test]
fn issue_6047_1() {
    run_default_exec_test(
        r###"
        let foo = () => 1;

        const obj = {
            get 0() {
                foo = () => 2;
                return 40;
            },
        };
        console.log(obj)

        var c = obj[0];

        console.log(foo(c));
        "###,
    );
}

#[test]
fn issue_6047_2() {
    run_default_exec_test(
        r###"
        let foo = () => 1;

        const obj = new Proxy({}, {
            get () {
                foo = () => 2;
                return 40;
            },
        });
        console.log(obj)

        var c = obj[0];

        console.log(foo(c));
        "###,
    );
}

#[test]
fn issue_6039_1() {
    run_default_exec_test(
        r###"
        function foo() {
            let walker = 0;
        
            let arr = [];
        
            function bar(defaultValue) {
                const myIndex = walker;
                walker += 1;
        
                console.log({ arr });
        
                if (arr.length < myIndex + 1) {
                    arr[myIndex] = defaultValue;
                }
            }
        
            return bar;
        }
        
        const bar = foo();
        
        bar(null);
        bar(null);
        bar(null);
        bar(null);
        bar(null);
        "###,
    );
}

#[test]
fn issue_6039_2() {
    run_default_exec_test(
        r###"
        var foo = function foo() {
            var walker = 0;
            var arr = [];
            function bar(defaultValue) {
                var myIndex = walker;
                walker += 1;
                console.log({
                    arr: arr
                });
                if (arr.length < myIndex + 1) {
                    arr[myIndex] = defaultValue;
                }
            }
            return bar;
        };
        var bar = foo();
        bar(null);
        bar(null);
        bar(null);
        bar(null);
        bar(null);
    "###,
    );
}

#[test]
fn issue_6217_1() {
    run_exec_test(
        r###"
        var foo = function foo() {
            var walker = 0;
            var arr = [];
            function bar(defaultValue) {
                var myIndex = walker;
                walker += 1;
                console.log({
                    arr: arr
                });
                if (arr.length < myIndex + 1) {
                    arr[myIndex] = defaultValue;
                }
            }
            return bar;
        };
        var bar = foo();
        bar(null);
        bar(null);
        bar(null);
        bar(null);
        bar(null);
    "###,
        r#"
        {
            "arguments": false,
            "arrows": false,
            "booleans": false,
            "booleans_as_integers": false,
            "collapse_vars": true,
            "comparisons": false,
            "computed_props": false,
            "conditionals": false,
            "dead_code": false,
            "directives": false,
            "drop_console": false,
            "drop_debugger": false,
            "evaluate": false,
            "expression": false,
            "hoist_funs": false,
            "hoist_props": false,
            "hoist_vars": false,
            "if_return": false,
            "join_vars": false,
            "keep_classnames": false,
            "keep_fargs": false,
            "keep_fnames": false,
            "keep_infinity": false,
            "loops": false,
            "negate_iife": false,
            "properties": false,
            "reduce_funcs": false,
            "reduce_vars": false,
            "side_effects": false,
            "switches": false,
            "typeofs": false,
            "unsafe": false,
            "unsafe_arrows": false,
            "unsafe_comps": false,
            "unsafe_Function": false,
            "unsafe_math": false,
            "unsafe_symbols": false,
            "unsafe_methods": false,
            "unsafe_proto": false,
            "unsafe_regexp": false,
            "unsafe_undefined": false,
            "unused": false,
            "const_to_let": false,
            "pristine_globals": false
        }
        "#,
        false,
    );
}

#[test]
fn issue_6279_1() {
    run_default_exec_test(
        r###"
        function run(str, r) {
            let m
            while(m = r.exec(str)) {
            console.log(m)
            }
        }
        run('abcda', /a/g)
        "###,
    );
}

#[test]
fn issue_6279_2() {
    run_default_exec_test(
        r###"
        const r = new RegExp('a', 'g');
        function run(str, r) {
            let m
            while (m = r.exec(str)) {
                console.log(m)
            }
        }
        run('abcda', r)
        "###,
    );
}

#[test]
fn issue_6463_1() {
    run_default_exec_test(
        r#"
            var foo_1 = foo;

            function foo() {
                console.log("foo");
            }

            foo_1();
            foo_1();
        "#,
    );
}

#[test]
fn issue_6528() {
    run_default_exec_test(
        r#"
        const foo = {
            "+1": 1,
            "2": 2,
            "-3": 3,
        }

        console.log(foo[1]);
        console.log(foo["+1"]);
        console.log(foo["2"]);
        console.log(foo[2]);
        console.log(foo[-3]);
        console.log(foo["-3"]);
        "#,
    )
}

#[test]
fn issue_6641() {
    run_default_exec_test(
        r###"
        const iota = (i => () => 1 << ++i)(-1);

        const a = iota(), b = iota();
            
        console.log(a, b);
        "###,
    )
}

#[test]
fn issue_6728() {
    run_default_exec_test(
        r###"
        async function foo() {
            if (undefined_var_1) {
              let replace;
            
              if (undefined_var_2) {
                replace = 1;
              } else {
                replace = 2;
              }
            
              await a({ replace })
            }
        }
        console.log('PASS')
        "###,
    )
}

#[test]
fn issue_6750_1() {
    run_default_exec_test(
        r#"
        let current_component;

        function set_current_component(component) {
            current_component = component;
        }

        function f(component) {
            const parent = current_component
            set_current_component(component)
            parent.m()
        }

        const obj = {
            m() {
                console.log("call m()")
            }
        }

        try {
            f(obj)
        } catch (e) {
            console.log('PASS')
        }
        "#,
    )
}

#[test]
fn issue_6750_2() {
    run_exec_test(
        r#"
        let current_component;

        function set_current_component(component) {
            current_component = component;
        }

        function f(component) {
            const parent = current_component
            set_current_component(component)
            parent.m()
        }

        const obj = {
            m() {
                console.log("call m()")
            }
        }

        try {
            f(obj)
        } catch (e) {
            console.log('PASS')
        }
        "#,
        r#"{
            "defaults": true,
            "sequences": false
        }"#,
        false,
    )
}

#[test]
fn issue_6899_1() {
    run_exec_test(
        r#"
        // this the original code, just for comparison
        function Limit(min, max) {
        var length = Math.abs(min - max);

        function reachedMin(n) {
            return n < min;
        }

        function reachedMax(n) {
            return n > max;
        }

        function reachedAny(n) {
            return reachedMin(n) || reachedMax(n);
        }

        function constrain(n) {
            if (!reachedAny(n)) return n;
            return reachedMin(n) ? min : max;
        }

        function removeOffset(n) {
            if (!length) return n;
            return n - length * Math.ceil((n - max) / length);
        }

        var self = {
            length: length,
            max: max,
            min: min,
            constrain: constrain,
            reachedAny: reachedAny,
            reachedMax: reachedMax,
            reachedMin: reachedMin,
            removeOffset: removeOffset
        };
        return self;
        }
        console.log("The result should be 0. And it is:", Limit(0,3).constrain(-1))
        "#,
        r#"
        {
            "arguments": false,
            "arrows": true,
            "booleans": true,
            "booleans_as_integers": false,
            "collapse_vars": true,
            "comparisons": true,
            "computed_props": true,
            "conditionals": true,
            "dead_code": true,
            "directives": true,
            "drop_console": false,
            "drop_debugger": true,
            "evaluate": true,
            "expression": false,
            "hoist_funs": false,
            "hoist_props": true,
            "hoist_vars": false,
            "if_return": true,
            "join_vars": true,
            "keep_classnames": false,
            "keep_fargs": true,
            "keep_fnames": false,
            "keep_infinity": false,
            "loops": true,
            "negate_iife": true,
            "properties": true,
            "reduce_funcs": false,
            "reduce_vars": false,
            "side_effects": true,
            "switches": true,
            "typeofs": true,
            "unsafe": false,
            "unsafe_arrows": false,
            "unsafe_comps": false,
            "unsafe_Function": false,
            "unsafe_math": false,
            "unsafe_symbols": false,
            "unsafe_methods": false,
            "unsafe_proto": false,
            "unsafe_regexp": false,
            "unsafe_undefined": false,
            "unused": true,
            "const_to_let": true,
            "pristine_globals": true
        }
        "#,
        false,
    )
}

#[test]
fn issue_6899_2() {
    run_default_exec_test(
        r#"
        // this the original code, just for comparison
        function Limit(min, max) {
        var length = Math.abs(min - max);

        function reachedMin(n) {
            return n < min;
        }

        function reachedMax(n) {
            return n > max;
        }

        function reachedAny(n) {
            return reachedMin(n) || reachedMax(n);
        }

        function constrain(n) {
            if (!reachedAny(n)) return n;
            return reachedMin(n) ? min : max;
        }

        function removeOffset(n) {
            if (!length) return n;
            return n - length * Math.ceil((n - max) / length);
        }

        var self = {
            length: length,
            max: max,
            min: min,
            constrain: constrain,
            reachedAny: reachedAny,
            reachedMax: reachedMax,
            reachedMin: reachedMin,
            removeOffset: removeOffset
        };
        return self;
        }
        console.log("The result should be 0. And it is:", Limit(0,3).constrain(-1))
        "#,
    );
}

#[test]
fn issue_6899_3() {
    run_default_exec_test(
        r#"
        console.log("The result should be 0. And it is:", function(n, e) {
            var r = Math.abs(n - e);
        
            function t(e) {
                return e < n
            }
        
            function u(n) {
                return n > e
            }
        
            function c(n) {
                return t(n) || u(n)
            }
            return {
                length: r,
                max: e,
                min: n,
                constrain: function(r) {
                    return c(r) ? t(r) ? n : e : r
                },
                reachedAny: c,
                reachedMax: u,
                reachedMin: t,
                removeOffset: function(n) {
                    return r ? n - r * Math.ceil((n - e) / r) : n
                }
            }
        }(0, 3).constrain(-1));

        "#,
    );
}

#[test]
fn issue_6899_4() {
    run_exec_test(
        r#"
        console.log("The result should be 0. And it is:", function(n, e) {
            var r = Math.abs(n - e);
        
            function t(e) {
                return e < n
            }
        
            function u(n) {
                return n > e
            }
        
            function c(n) {
                return t(n) || u(n)
            }
            return {
                length: r,
                max: e,
                min: n,
                constrain: function(r) {
                    return c(r) ? t(r) ? n : e : r
                },
                reachedAny: c,
                reachedMax: u,
                reachedMin: t,
                removeOffset: function(n) {
                    return r ? n - r * Math.ceil((n - e) / r) : n
                }
            }
        }(0, 3).constrain(-1));

        "#,
        r#"
        {
            "inline": true,
            "passes": 2
        }
        "#,
        false,
    );
}

#[test]
fn issue_6899_5() {
    run_exec_test(
        r#"
        console.log("The result should be 0. And it is:", function(n, e) {
            var r = Math.abs(n - e);
        
            function t(e) {
                return e < n
            }
        
            function u(n) {
                return n > e
            }
        
            function c(n) {
                return t(n) || u(n)
            }
            return {
                constrain: function(r) {
                    return c(r) ? (t(r) ? n : e) : r
                },
                
            }
        }(0, 3).constrain(-1));
        "#,
        r#"
        {
            "inline": true,
            "passes": 2
        }
        "#,
        false,
    );
}

#[test]
fn issue_6903_1() {
    run_default_exec_test(
        r#"
        function test(a, b) {
            let wrapper = (e) => e
            wrapper = (e) => (["not", e])
            if (a) {
                return wrapper(b)
            }
            return wrapper(1)
        }
        console.log(test(true, "bad"))
        "#,
    );
}

#[test]
fn issue_6903_2() {
    run_exec_test(
        r#"
        function test(a, b) {
            let wrapper = (e) => e
            wrapper = (e) => (["not", e])
            if (a) {
                return wrapper(b)
            }
            return wrapper(1)
        }
        console.log(test(true, "bad"))
        "#,
        r#"
        {
            "if_return": true,
            "join_vars": true,
            "side_effects": true,
            "conditionals": true
        }"#,
        false,
    );
}

#[test]
fn issue_6903_3() {
    run_exec_test(
        r#"
        function test(a, b) {
            let wrapper = (e)=>e;
            return ((wrapper = (e)=>[
                    "not",
                    e
                ]), a) ? wrapper(b) : wrapper(1);
        }
        console.log(test(true, "bad"));
        "#,
        r#"
        {
            "conditionals": true
        }"#,
        false,
    );
}

#[test]
fn issue_6914_1() {
    run_default_exec_test(
        r###"
        console.log(doSomething())

        function doSomething() {
            return fabricateEvent()
        }

        function fabricateEvent() {
            let def = createEventDef()

            return {
                def,
                ui: compileEventUi(def),
            }
        }

        function compileEventUi(def) {
            let uis = []
            uis.push(def.ui)
            return uis
        }

        function createEventDef() {
            return {
                id: 'fakeId',
                ui: 'something'
            }
        }
    "###,
    );
}

#[test]
fn issue_6914_2() {
    run_exec_test(
        r###"
        console.log(doSomething())

        function doSomething() {
            return fabricateEvent()
        }

        function fabricateEvent() {
            let def = createEventDef()

            return {
                def,
                ui: compileEventUi(def),
            }
        }

        function compileEventUi(def) {
            let uis = []
            uis.push(def.ui)
            return uis
        }

        function createEventDef() {
            return {
                id: 'fakeId',
                ui: 'something'
            }
        }
        "###,
        r#"
        {
            "inline": true,
            "toplevel": true
        }
        "#,
        false,
    );
}

#[test]
fn issue_6914_3() {
    run_exec_test(
        r###"
            console.log(function() {
                return function() {
                    let def = function() {
                        return {
                            id: 'fakeId',
                            ui: 'something'
                        };
                    }();
                    return {
                        def,
                        ui: function(def) {
                            let uis = [];
                            uis.push(def.ui);
                            return uis;
                        }(def)
                    };
                }();
            }());
        "###,
        r#"
        {
            "inline": true,
            "toplevel": true
        }
        "#,
        false,
    );
}

#[test]
fn issue_7274() {
    run_default_exec_test(
        r#"
        if (
            // incorrect:
            "😋📋👌".length === 3
    
            // correct:
            // "😋📋👌".length === 6
        ) {
            // side effect
            new Response(123);
        }
        console.log('PASS');
        "#,
    );
}

#[test]
fn issue_8119_1() {
    run_exec_test(
        r#"
        const myArr = [];
        // function with side effect
        function foo(arr) {
            arr.push('foo');
            return 'foo';
        }
        let a;

        if (Math.random() > 1.1) {
            a = true;
        }

        // the function call below should always run
        // regardless of whether `a` is `undefined`
        let b = foo(myArr);

        // const seems to keep this line here instead of
        // moving it behind the logitcal nullish assignment
        // const b = foo(myArr);

        a ??= b;

        console.log(a);
        console.log(myArr);
        "#,
        r#"
        {
            "arguments": false,
            "arrows": true,
            "booleans": true,
            "booleans_as_integers": false,
            "collapse_vars": true,
            "comparisons": true,
            "computed_props": true,
            "conditionals": true,
            "dead_code": true,
            "directives": true,
            "drop_console": false,
            "drop_debugger": true,
            "evaluate": true,
            "expression": false,
            "hoist_funs": false,
            "hoist_props": true,
            "hoist_vars": false,
            "if_return": true,
            "join_vars": true,
            "keep_classnames": false,
            "keep_fargs": true,
            "keep_fnames": false,
            "keep_infinity": false,
            "loops": true,
            "negate_iife": true,
            "properties": true,
            "reduce_funcs": false,
            "reduce_vars": false,
            "side_effects": true,
            "switches": true,
            "typeofs": true,
            "unsafe": false,
            "unsafe_arrows": false,
            "unsafe_comps": false,
            "unsafe_Function": false,
            "unsafe_math": false,
            "unsafe_symbols": false,
            "unsafe_methods": false,
            "unsafe_proto": false,
            "unsafe_regexp": false,
            "unsafe_undefined": false,
            "unused": true,
            "const_to_let": true,
            "pristine_globals": true,
            "passes": 2
        }
        "#,
        false,
    );
}

#[test]
fn issue_8119_2() {
    run_exec_test(
        r#"
        const myArr = [];
        // function with side effect
        function foo(arr) {
            arr.push('foo');
            return 'foo';
        }
        let a;

        if (Math.random() > -0.1) {
            a = true;
        }

        // the function call below should always run
        // regardless of whether `a` is `undefined`
        let b = foo(myArr);

        // const seems to keep this line here instead of
        // moving it behind the logitcal nullish assignment
        // const b = foo(myArr);

        a ??= b;

        console.log(a);
        console.log(myArr);
        "#,
        r#"
        {
            "arguments": false,
            "arrows": true,
            "booleans": true,
            "booleans_as_integers": false,
            "collapse_vars": true,
            "comparisons": true,
            "computed_props": true,
            "conditionals": true,
            "dead_code": true,
            "directives": true,
            "drop_console": false,
            "drop_debugger": true,
            "evaluate": true,
            "expression": false,
            "hoist_funs": false,
            "hoist_props": true,
            "hoist_vars": false,
            "if_return": true,
            "join_vars": true,
            "keep_classnames": false,
            "keep_fargs": true,
            "keep_fnames": false,
            "keep_infinity": false,
            "loops": true,
            "negate_iife": true,
            "properties": true,
            "reduce_funcs": false,
            "reduce_vars": false,
            "side_effects": true,
            "switches": true,
            "typeofs": true,
            "unsafe": false,
            "unsafe_arrows": false,
            "unsafe_comps": false,
            "unsafe_Function": false,
            "unsafe_math": false,
            "unsafe_symbols": false,
            "unsafe_methods": false,
            "unsafe_proto": false,
            "unsafe_regexp": false,
            "unsafe_undefined": false,
            "unused": true,
            "const_to_let": true,
            "pristine_globals": true,
            "passes": 2
        }
        "#,
        false,
    );
}

#[test]
fn issue_8246_1() {
    run_exec_test(
        r#"
        function withLog(methods) {
            const result = {};
            for(const methodName in methods){
                result[methodName] = ((methodName)=>function() {
                        console.log(methodName + ' invoked');
                        return methods[methodName].apply(this, arguments);
                    })(methodName);
            }
            return result;
        }
        function main() {
            const result = withLog({
                test () {
                    console.log('method test executed');
                },
                another () {
                    console.log('method another executed');
                }
            });
            result.test();
        }
        main();
        "#,
        r#"
        {
            "ecma": 2015,
            "arguments": false,
            "arrows": true,
            "booleans": true,
            "booleans_as_integers": false,
            "collapse_vars": true,
            "comparisons": true,
            "computed_props": true,
            "conditionals": true,
            "dead_code": true,
            "directives": true,
            "drop_console": false,
            "drop_debugger": true,
            "evaluate": true,
            "expression": false,
            "hoist_funs": false,
            "hoist_props": true,
            "hoist_vars": false,
            "if_return": true,
            "join_vars": true,
            "keep_classnames": false,
            "keep_fargs": true,
            "keep_fnames": false,
            "keep_infinity": false,
            "loops": true,
            "negate_iife": true,
            "properties": true,
            "reduce_funcs": false,
            "reduce_vars": false,
            "side_effects": true,
            "switches": true,
            "typeofs": true,
            "unsafe": false,
            "unsafe_arrows": false,
            "unsafe_comps": false,
            "unsafe_Function": false,
            "unsafe_math": false,
            "unsafe_symbols": false,
            "unsafe_methods": false,
            "unsafe_proto": false,
            "unsafe_regexp": false,
            "unsafe_undefined": false,
            "unused": true,
            "const_to_let": true,
            "pristine_globals": true,
            "passes": 5
        }
        "#,
        false,
    );
}

#[test]
fn issue_8864_1() {
    run_default_exec_test(
        "
        class Renderer {
            renderStaticFrame(string1, string2) {
            const line1Text = `${string1} and ${string2}`.toUpperCase();
            const line2Text = 'line 2 text'.toUpperCase();
        
            const text = `${line1Text}\n${line2Text}`;
            return text;
            }
        }
      
        console.log(new Renderer().renderStaticFrame('a', 'b'));
      ",
    )
}

#[test]
fn issue_8886() {
    run_default_exec_test(
        "const bar = ((v) => v)(1);
const foo = ((v) => v)(2);

console.log(eval(bar));
console.log(eval(foo));",
    );
}

#[test]
fn issue_8942() {
    run_default_exec_test(
        "
        'use strict';
        const k = (() => {
            let x = 1;
            x **= undefined / x;
            return x;
        })();
        console.log(k);
        ",
    );
}

#[test]
fn issue_8937() {
    run_default_exec_test(
        "
        class Container {
            constructor(v) {
                this.a= v;
            }
            add(x) {
                this.a += x;
            }
            toString() {
                return this.a.toString();
            }
        };
        let x = Math.random();
        let a = new Container(x);
        let b = new Container(x+1);
        let comp = a < b;
        while (a < b) {
            a.add(1);
        }
        console.log(comp ? 'smaller' : 'not smaller');
        ",
    );
}

#[test]
fn issue_8943() {
    run_default_exec_test(
        "
        'use strict';
        const k = (() => {
            return '👨‍👩‍👦'.charCodeAt(0);
        });
        console.log(k());
        ",
    );
}

#[test]
fn issue_8964() {
    run_default_exec_test(
        "
        function foo(bit) {
            a = !(bit & 1)
            b = !(bit & 2)
            return a + b
        };
        
        console.log(foo(1));
        ",
    );
}

#[test]
fn issue_9008() {
    run_default_exec_test("console.log('💖'[0]);")
}

#[test]
fn issue_8982_1() {
    run_default_exec_test(
        "
        console.log(Math.max(0, -0));
        ",
    );
}

#[test]
fn issue_8982_2() {
    run_default_exec_test(
        "
        console.log(Math.min(0, -0));
        ",
    );
}

#[test]
fn issue_9010() {
    run_default_exec_test(
        r#"
        console.log(-0 + [])
        "#,
    );
}

#[test]
fn issue_9184() {
    run_default_exec_test(
        r#"
        let pi= Math.random() >1.1 ? "foo": "bar";
        console.log(`(${`${pi}`} - ${`\\*${pi}`})`)
"#,
    );
}

#[test]
fn issue_9184_2() {
    run_default_exec_test(
        r#"
        let pi= Math.random() < -1 ? "foo": "bar";
        console.log(`(${`${pi}`} - ${`\\*${pi}`})`)
"#,
    );
}

#[test]
fn issue_9499() {
    run_default_exec_test(
        "
        const o = {'a': 1, 'b': 2};
        function fn() {
            return 'a' in o;
        }
        console.log(fn());
",
    )
}

#[test]
fn issue_9356() {
    run_default_exec_test("console.log((function ({ } = 42) { }).length)");
}

#[test]
fn isssue_9498() {
    run_default_exec_test(
        "
        const x = {a: 1};
        const y = {...x, a: 2};
        console.log(y.a);
",
    )
}
