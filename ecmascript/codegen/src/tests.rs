use self::swc_ecma_parser::{EsConfig, Parser, StringInput, Syntax};
use super::*;
use crate::config::Config;
use std::{
    fmt::{self, Debug, Display, Formatter},
    io::Write,
    sync::{Arc, RwLock},
};
use swc_common::{comments::SingleThreadedComments, FileName, SourceMap};
use swc_ecma_parser;

struct Builder {
    cfg: Config,
    cm: Lrc<SourceMap>,
    comments: SingleThreadedComments,
}

impl Builder {
    pub fn with<F, Ret>(self, src: &str, s: &mut Vec<u8>, op: F) -> Ret
    where
        F: FnOnce(&mut Emitter<'_>) -> Ret,
    {
        let mut e = Emitter {
            cfg: self.cfg,
            cm: self.cm.clone(),
            wr: Box::new(text_writer::JsWriter::new(self.cm.clone(), "\n", s, None)),
            comments: Some(&self.comments),
        };

        let ret = op(&mut e);

        ret
    }

    pub fn text<F>(self, src: &str, op: F) -> String
    where
        F: FnOnce(&mut Emitter<'_>),
    {
        let mut buf = vec![];

        self.with(src, &mut buf, op);

        String::from_utf8(buf).unwrap()
    }
}

fn parse_then_emit(from: &str, cfg: Config, syntax: Syntax) -> String {
    ::testing::run_test(false, |cm, handler| {
        let src = cm.new_source_file(FileName::Real("custom.js".into()), from.to_string());
        println!(
            "--------------------\nSource: \n{}\nPos: {:?} ~ {:?}\n",
            from, src.start_pos, src.end_pos
        );

        let comments = Default::default();
        let res = {
            let mut parser = Parser::new(syntax, StringInput::from(&*src), Some(&comments));
            let res = parser
                .parse_module()
                .map_err(|e| e.into_diagnostic(handler).emit());

            for err in parser.take_errors() {
                err.into_diagnostic(handler).emit()
            }

            res?
        };

        let out = Builder { cfg, cm, comments }.text(from, |e| e.emit_module(&res).unwrap());
        Ok(out)
    })
    .unwrap()
}

pub(crate) fn assert_min(from: &str, to: &str) {
    let out = parse_then_emit(from, Config { minify: true }, Syntax::default());

    assert_eq!(DebugUsingDisplay(out.trim()), DebugUsingDisplay(to),);
}

pub(crate) fn assert_pretty(from: &str, to: &str) {
    let out = parse_then_emit(from, Config { minify: false }, Syntax::default());

    assert_eq!(DebugUsingDisplay(&out.trim()), DebugUsingDisplay(to),);
}

fn test_from_to(from: &str, expected: &str) {
    let out = parse_then_emit(from, Default::default(), Syntax::default());

    dbg!(&out);
    dbg!(&expected);

    assert_eq!(
        DebugUsingDisplay(out.trim()),
        DebugUsingDisplay(expected.trim()),
    );
}

fn test_identical(from: &str) {
    test_from_to(from, from)
}

fn test_from_to_custom_config(from: &str, to: &str, cfg: Config, syntax: Syntax) {
    let out = parse_then_emit(from, cfg, syntax);

    assert_eq!(DebugUsingDisplay(out.trim()), DebugUsingDisplay(to.trim()),);
}

#[test]
fn empty_stmt() {
    test_from_to(";", ";");
}

#[test]
fn comment_1() {
    test_from_to(
        "// foo
a",
        "// foo
a;",
    );
}

#[test]
fn comment_2() {
    test_from_to("a // foo", "a; // foo");
}

#[test]
fn comment_3() {
    test_from_to(
        "// foo
// bar
a
// foo
b // bar",
        "// foo
// bar
a;
// foo
b; // bar",
    );
}

#[test]
fn comment_4() {
    test_from_to(
        "/** foo */
a",
        "/** foo */
a;",
    );
}

#[test]
fn comment_5() {
    test_from_to(
        "// foo
// bar
a",
        "// foo
// bar
a;",
    );
}

#[test]
fn no_octal_escape() {
    test_from_to(
        r#"'\x00a';
'\x000';
'\x001';
'\x009'"#,
        r#"'\0a';
'\x000';
'\x001';
'\x009';"#,
    );
}

#[test]
fn empty_named_export() {
    test_from_to("export { }", "export { };");
}

#[test]
fn empty_named_export_min() {
    test_from_to_custom_config(
        "export { }",
        "export{};",
        Config { minify: true },
        Default::default(),
    );
}

#[test]
fn empty_named_export_from() {
    test_from_to("export { } from 'foo';", "export { } from 'foo';");
}

#[test]
fn empty_named_export_from_min() {
    test_from_to_custom_config(
        "export { } from 'foo';",
        "export{}from'foo';",
        Config { minify: true },
        Default::default(),
    );
}

#[test]
fn named_export_from() {
    test_from_to("export { bar } from 'foo';", "export { bar } from 'foo';");
}

#[test]
fn named_export_from_min() {
    test_from_to_custom_config(
        "export { bar } from 'foo';",
        "export{bar}from'foo';",
        Config { minify: true },
        Default::default(),
    );
}

#[test]
fn export_namespace_from() {
    test_from_to_custom_config(
        "export * as Foo from 'foo';",
        "export * as Foo from 'foo';",
        Default::default(),
        Syntax::Es(EsConfig {
            export_namespace_from: true,
            ..EsConfig::default()
        }),
    );
}

#[test]
fn export_namespace_from_min() {
    test_from_to_custom_config(
        "export * as Foo from 'foo';",
        "export*as Foo from'foo';",
        Config { minify: true },
        Syntax::Es(EsConfig {
            export_namespace_from: true,
            ..EsConfig::default()
        }),
    );
}

#[test]
fn named_and_namespace_export_from() {
    test_from_to_custom_config(
        "export * as Foo, { bar } from 'foo';",
        "export * as Foo, { bar } from 'foo';",
        Default::default(),
        Syntax::Es(EsConfig {
            export_namespace_from: true,
            ..EsConfig::default()
        }),
    );
}

#[test]
fn named_and_namespace_export_from_min() {
    test_from_to_custom_config(
        "export * as Foo, { bar } from 'foo';",
        "export*as Foo,{bar}from'foo';",
        Config { minify: true },
        Syntax::Es(EsConfig {
            export_namespace_from: true,
            ..EsConfig::default()
        }),
    );
}

#[test]
fn issue_450() {
    test_from_to(
        r#"console.log(`
\`\`\`html
<h1>It works!</h1>
\`\`\`
`);"#,
        r#"console.log(`\n\`\`\`html\n<h1>It works!</h1>\n\`\`\`\n`);"#,
    );
}

#[test]
fn issue_546() {
    test_from_to(
        "import availabilities, * as availabilityFunctions from 'reducers/availabilities';",
        "import availabilities, * as availabilityFunctions from 'reducers/availabilities';",
    );
}

#[test]
fn issue_637() {
    test_from_to(
        r"`\
`;", r"`\
`;",
    );
}

#[test]
fn issue_639() {
    test_from_to(r"`\x1b[33m Yellow \x1b[0m`;", r"`\x1b[33m Yellow \x1b[0m`;");
}

#[test]
fn issue_910() {
    test_from_to(
        "console.log(\"Hello World\");",
        "console.log(\"Hello World\");",
    );

    test_from_to("console.log('Hello World');", "console.log('Hello World');");

    test_from_to(
        "console.log(\"Hello\\\" World\");",
        "console.log(\"Hello\\\" World\");",
    );

    test_from_to(
        "console.log('Hello\\' World');",
        "console.log('Hello\\' World');",
    );
}

#[test]
fn tpl_1() {
    test_from_to(
        "`id '${id}' must be a non-empty string`;",
        "`id '${id}' must be a non-empty string`;",
    )
}

#[test]
fn tpl_2() {
    test_from_to(
        "`${Module.wrapper[0]}${script}${Module.wrapper[1]}`",
        "`${Module.wrapper[0]}${script}${Module.wrapper[1]}`;",
    );
}

#[test]
fn tpl_escape_1() {
    test_from_to(
        "`${parent.path}\x00${request}`",
        "`${parent.path}\x00${request}`;",
    )
}

#[test]
fn tpl_escape_2() {
    test_from_to("`${arg}\0`", "`${arg}\0`;");
}

#[test]
fn tpl_escape_3() {
    test_from_to(
        r#"`${resolvedDevice.toLowerCase()}\\`"#,
        r#"`${resolvedDevice.toLowerCase()}\\`;"#,
    );
}

#[test]
fn tpl_escape_4() {
    test_from_to(
        r#"`\\\\${firstPart}\\${path.slice(last)}`"#,
        r#"`\\\\${firstPart}\\${path.slice(last)}`;"#,
    );
}

#[test]
fn tpl_escape_5() {
    test_from_to(
        r#"const data = text.encode(`${arg}\0`);"#,
        r#"const data = text.encode(`${arg}\0`);"#,
    );
}

#[test]
fn tpl_escape_6() {
    let from = r#"export class MultipartReader {
    newLine = encoder.encode("\r\n");
    newLineDashBoundary = encoder.encode(`\r\n--${this.boundary}`);
    dashBoundaryDash = encoder.encode(`--${this.boundary}--`);
}"#;
    let to = r#"export class MultipartReader {
    newLine = encoder.encode("\r\n");
    newLineDashBoundary = encoder.encode(`\r\n--${this.boundary}`);
    dashBoundaryDash = encoder.encode(`--${this.boundary}--`);
}"#;

    let out = parse_then_emit(
        from,
        Default::default(),
        Syntax::Typescript(Default::default()),
    );
    assert_eq!(DebugUsingDisplay(out.trim()), DebugUsingDisplay(to.trim()),);
}

#[test]
fn issue_915_1() {
    test_identical(r#"relResolveCacheIdentifier = `${parent.path}\x00${request}`;"#);
}

#[test]
fn issue_915_2() {
    test_identical(r#"relResolveCacheIdentifier = `${parent.path}\x00${request}`;"#);
}

#[test]
fn issue_915_3() {
    test_identical(r#"encoder.encode("\\r\\n");"#);
}

#[test]
fn issue_915_4() {
    test_identical(r#"`\\r\\n--${this.boundary}`;"#);
}

#[test]
fn issue_1061() {
    test_identical(
        r#"
    /*!
 * TOAST UI Editor : i18n
 * @version 2.3.1
 * @author NHN FE Development Lab <dl_javascript@nhn.com>
 * @license MIT
 */
(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory(require("@toast-ui/editor"));
	else if(typeof define === 'function' && define.amd)
		define(["@toast-ui/editor"], factory);
	else {
		var a = typeof exports === 'object' ? factory(require("@toast-ui/editor")) : factory(root["toastui"]["Editor"]);
		for(var i in a) (typeof exports === 'object' ? exports : root)[i] = a[i];
	}
})(window, function(__WEBPACK_EXTERNAL_MODULE__0__) {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 18);
/******/ })
/************************************************************************/
/******/ ({

/***/ 0:
/***/ (function(module, exports) {

module.exports = __WEBPACK_EXTERNAL_MODULE__0__;

/***/ }),

/***/ 18:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _editor__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(0);
/* harmony import */ var _editor__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_editor__WEBPACK_IMPORTED_MODULE_0__);
/**
 * @fileoverview I18N for Chinese
 * @author NHN FE Development Lab <dl_javascript@nhn.com>
 */

_editor__WEBPACK_IMPORTED_MODULE_0___default.a.setLanguage('zh-CN', {
  Markdown: 'Markdown',
  WYSIWYG: '所见即所得',
  Write: '编辑',
  Preview: '预览',
  Headings: '标题',
  Paragraph: '文本',
  Bold: '加粗',
  Italic: '斜体字',
  Strike: '删除线',
  Code: '内嵌代码',
  Line: '水平线',
  Blockquote: '引用块',
  'Unordered list': '无序列表',
  'Ordered list': '有序列表',
  Task: '任务',
  Indent: '缩进',
  Outdent: '减少缩进',
  'Insert link': '插入链接',
  'Insert CodeBlock': '插入代码块',
  'Insert table': '插入表格',
  'Insert image': '插入图片',
  Heading: '标题',
  'Image URL': '图片网址',
  'Select image file': '选择图片文件',
  Description: '说明',
  OK: '确认',
  More: '更多',
  Cancel: '取消',
  File: '文件',
  URL: 'URL',
  'Link text': '链接文本',
  'Add row': '添加行',
  'Add col': '添加列',
  'Remove row': '删除行',
  'Remove col': '删除列',
  'Align left': '左对齐',
  'Align center': '居中对齐',
  'Align right': '右对齐',
  'Remove table': '删除表格',
  'Would you like to paste as table?': '需要粘贴为表格吗?',
  'Text color': '文字颜色',
  'Auto scroll enabled': '自动滚动已启用',
  'Auto scroll disabled': '自动滚动已禁用',
  'Choose language': '选择语言'
});

/***/ })

/******/ });
});
    "#,
    )
}

#[derive(Debug, Clone)]
struct Buf(Arc<RwLock<Vec<u8>>>);
impl Write for Buf {
    fn write(&mut self, data: &[u8]) -> io::Result<usize> {
        self.0.write().unwrap().write(data)
    }

    fn flush(&mut self) -> io::Result<()> {
        self.0.write().unwrap().flush()
    }
}

#[derive(PartialEq, Eq)]
struct DebugUsingDisplay<'a>(&'a str);

impl<'a> Debug for DebugUsingDisplay<'a> {
    fn fmt(&self, f: &mut Formatter<'_>) -> fmt::Result {
        Display::fmt(self.0, f)
    }
}
