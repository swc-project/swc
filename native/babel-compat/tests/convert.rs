use swc_babel_compat::ast::common::{TestNode, BaseNode, Loc, LineCol};

#[cfg(test)]
use pretty_assertions::{assert_eq};
// use pretty_assertions::{assert_eq, assert_ne};

// #[cfg(feature = "babel_test")]
#[test]
pub fn t1() {
    let a = TestNode {
        base: BaseNode {
            leading_comments: Default::default(),
            inner_comments: Default::default(),
            trailing_comments: Default::default(),
            start: Some(0),
            end: Some(4),
            loc: Some(Loc {
                start: LineCol { line: 0, column: 0 },
                end: LineCol { line: 1, column: 4 },
            }),
            extra: Default::default(),
        },
        is_optional: true,
    };
    let mut b = a.clone();
    b.base.start = None;
    assert_eq!(a, b);
}

// #![feature(test)]
//
// mod ast;
//
// use swc_babel_compat::{
//     ast::common::BaseNode,
//     ast::module::{Program, SrcType},
//     convert::{Context, Babelify},
// };
//
// #[test]
// fn a() {
//     let p1 = Program {
//         base: BaseNode {
//             leading_comments: vec![],
//             inner_comments: vec![],
//             trailing_comments: vec![],
//             start: Some(0),
//             end: Some(4),
//             loc: None,
//             extra: None,
//         },
//         body: vec![],
//         directives: vec![],
//         source_type: SrcType::Script,
//         interpreter: None,
//         source_file: Default::default(),
//     };
//
//     let p2 = Program {
//         base: BaseNode {
//             leading_comments: vec![],
//             inner_comments: vec![],
//             trailing_comments: vec![],
//             start: Some(0),
//             end: Some(4),
//             loc: None,
//             extra: None,
//         },
//         body: vec![],
//         directives: vec![],
//         source_type: SrcType::Script,
//         interpreter: None,
//         source_file: Default::default(),
//     };
//
//     assert_eq!(p1, p2);
// }
//
