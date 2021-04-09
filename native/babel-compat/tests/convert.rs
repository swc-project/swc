use swc_babel_compat::ast::module::File;
use swc_babel_compat::convert::{Context, Babelify};
use swc::Compiler;
use swc_common::{
    FilePathMapping, SourceMap, FileName, SourceFile,
    errors::{ColorConfig, Handler},
};
use anyhow::Result;
use std::sync::Arc;
use std::fs;

#[cfg(test)]
use pretty_assertions::{assert_eq};
// use pretty_assertions::{assert_eq, assert_ne};

#[test]
pub fn t1() -> Result<()> {
    let src = fs::read_to_string("x.js")?;

    let cm = Arc::new(SourceMap::new(FilePathMapping::empty()));
    let handler = Arc::new(Handler::with_tty_emitter(
        ColorConfig::Always,
        true,
        false,
        Some(cm.clone()),
    ));
    let compiler = Compiler::new(cm.clone(), handler);
    let fm = compiler.cm.new_source_file(FileName::Anon, src);

    let swc_ast = compiler.parse_js(
        fm.clone(),
        Default::default(),
        Default::default(),
        false,
        Default::default(),
    )?;

    let ctx = Context {
        fm: fm,
        cm: cm,
        comments: Arc::new(compiler.comments().clone()),
    };
    let ast = swc_ast.babelify(&ctx);

    let output = fs::read_to_string("x.json")?;
    let expected_ast: File = serde_json::from_str(&output)?;

    // assert_eq!(ast, expected_ast);
    println!("FROM SWC\n\n{:#?}\n\nFROM BABEL\n\n{:#?}", ast, expected_ast);

    Ok(())
}

// // #[cfg(feature = "babel_test")]
// #[test]
// pub fn t1() {
//     let a = TestNode {
//         base: BaseNode {
//             leading_comments: Default::default(),
//             inner_comments: Default::default(),
//             trailing_comments: Default::default(),
//             start: Some(0),
//             end: Some(4),
//             loc: Some(Loc {
//                 start: LineCol { line: 0, column: 0 },
//                 end: LineCol { line: 1, column: 4 },
//             }),
//             extra: Default::default(),
//         },
//         is_optional: true,
//     };
//     let mut b = a.clone();
//     b.base.start = None;
//     assert_eq!(a, b);
// }

