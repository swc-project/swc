use swc_common::{
    comments::{Comment, CommentKind, Comments, SingleThreadedComments},
    source_map::PURE_SP,
    BytePos, Globals, Span, DUMMY_SP, GLOBALS,
};
use swc_ecma_ast::{CallExpr, Expr, NewExpr, OptCall, OptChainBase, OptChainExpr, TaggedTpl};

use super::{has_pure_comment_before, InfoMarker, Marks, State};

/// Delegates storage operations while intentionally inheriting the default
/// consuming implementation of [`Comments::has_flag`].
#[derive(Default)]
struct DefaultFlagComments(SingleThreadedComments);

impl Comments for DefaultFlagComments {
    fn add_leading(&self, pos: BytePos, comment: Comment) {
        self.0.add_leading(pos, comment);
    }

    fn add_leading_comments(&self, pos: BytePos, comments: Vec<Comment>) {
        self.0.add_leading_comments(pos, comments);
    }

    fn has_leading(&self, pos: BytePos) -> bool {
        self.0.has_leading(pos)
    }

    fn move_leading(&self, from: BytePos, to: BytePos) {
        self.0.move_leading(from, to);
    }

    fn take_leading(&self, pos: BytePos) -> Option<Vec<Comment>> {
        self.0.take_leading(pos)
    }

    fn get_leading(&self, pos: BytePos) -> Option<Vec<Comment>> {
        self.0.get_leading(pos)
    }

    fn add_trailing(&self, pos: BytePos, comment: Comment) {
        self.0.add_trailing(pos, comment);
    }

    fn add_trailing_comments(&self, pos: BytePos, comments: Vec<Comment>) {
        self.0.add_trailing_comments(pos, comments);
    }

    fn has_trailing(&self, pos: BytePos) -> bool {
        self.0.has_trailing(pos)
    }

    fn move_trailing(&self, from: BytePos, to: BytePos) {
        self.0.move_trailing(from, to);
    }

    fn take_trailing(&self, pos: BytePos) -> Option<Vec<Comment>> {
        self.0.take_trailing(pos)
    }

    fn get_trailing(&self, pos: BytePos) -> Option<Vec<Comment>> {
        self.0.get_trailing(pos)
    }

    fn add_pure_comment(&self, pos: BytePos) {
        self.0.add_pure_comment(pos);
    }
}

#[test]
fn synthetic_pure_call_like_callees_do_not_mark_outer_invocations_pure() {
    GLOBALS.set(&Globals::new(), || {
        let marker = InfoMarker {
            options: None,
            pure_funcs: None,
            pure_callee: Default::default(),
            comments: None,
            marks: Marks::new(),
            state: State::default(),
        };
        let callees = [
            Expr::Call(CallExpr {
                span: PURE_SP,
                ..Default::default()
            }),
            Expr::New(NewExpr {
                span: PURE_SP,
                ..Default::default()
            }),
            Expr::TaggedTpl(TaggedTpl {
                span: PURE_SP,
                ..Default::default()
            }),
            Expr::OptChain(OptChainExpr {
                span: PURE_SP,
                base: Box::new(OptChainBase::Call(OptCall {
                    span: PURE_SP,
                    ..Default::default()
                })),
                ..Default::default()
            }),
        ];

        for callee in &callees {
            assert!(!marker.is_pure_callee(callee, DUMMY_SP));
        }
    });
}

#[test]
fn pure_comment_ownership_check_does_not_consume_leading_comments() {
    let comments = DefaultFlagComments::default();
    let callee_span = Span::new(BytePos(10), BytePos(20));
    comments.add_leading(
        callee_span.lo,
        Comment {
            kind: CommentKind::Block,
            span: Span::new(BytePos(1), BytePos(9)),
            text: "#__PURE__".into(),
        },
    );

    assert!(has_pure_comment_before(
        Some(&comments),
        callee_span,
        callee_span.lo,
    ));
    assert!(comments.has_leading(callee_span.lo));
    assert!(!comments.has_trailing(callee_span.lo));
}

// use swc_common::{input::SourceFileInput, FileName, Mark, Span, DUMMY_SP};
// use swc_ecma_ast::*;
// use swc_ecma_parser::{lexer::Lexer, Parser};
// use swc_ecma_transforms::resolver_with_mark;
// use swc_ecma_visit::{Node, Visit, VisitMutWith, VisitWith};

// use crate::marks::Marks;

// use super::info_marker;

// fn assert_standalone(src: &str, expected: usize) {
//     testing::run_test(false, |cm, _handler| {
//         let marks = Marks::new();
//         let top_level_mark = Mark::fresh(Mark::root());
//         let fm = cm.new_source_file(FileName::Anon, src.to_string());

//         let lexer = Lexer::new(
//             Default::default(),
//             EsVersion::latest(),
//             SourceFileInput::from(&*fm),
//             None,
//         );

//         let mut parser = Parser::new_from(lexer);

//         let mut m = parser.parse_module().expect("failed to parse");
//         m.visit_mut_with(&mut resolver_with_mark(top_level_mark));

//         m.visit_mut_with(&mut info_marker(None, marks, top_level_mark));

//         eprintln!("Expected: {} modules in bundle", expected);
//         let actual = {
//             let mut counter = MarkCounter {
//                 mark: marks.standalone,
//                 count: 0,
//             };
//             m.visit_with( &mut counter);
//             counter.count
//         };
//         eprintln!("Actual: {} modules in bundle", actual);

//         assert_eq!(expected, actual);

//         if expected != 0 {
//             assert!(
//                 m.span.has_mark(marks.bundle_of_standalones),
//                 "Expected module to be marked as a bundle"
//             );
//         } else {
//             assert!(
//                 !m.span.has_mark(marks.bundle_of_standalones),
//                 "Expected module to be not marked as a bundle"
//             );
//         }

//         Ok(())
//     })
//     .unwrap();
// }

// struct MarkCounter {
//     mark: Mark,
//     count: usize,
// }

// impl Visit for MarkCounter {
//     fn visit_span(&mut self, span: &Span) {
//         if span.has_mark(self.mark) {
//             self.count += 1;
//         }
//     }
// }

// #[test]
// fn standalone_base() {
//     assert_standalone("function foo() {}", 0);
// }

// #[test]
// fn standalone_no_usage() {
//     assert_standalone(
//         "function foo() {
//         declare(function (module, exports) {

//         }, function (module, exports) {

//         });
//     }",
//         2,
//     );
// }

// #[test]
// fn usage_of_var_1() {
//     assert_standalone(
//         "function foo() {
//             var bar = 2;
//         declare(function (module, exports) {
//             bar = 1;
//         }, function (module, exports) {

//         });
//     }",
//         1,
//     );
// }

// #[test]
// fn usage_of_class_1() {
//     assert_standalone(
//         "function foo() {
//             class Foo {

//             }
//         declare(function (module, exports) {
//             const bar = new Foo();
//         }, function (module, exports) {

//         });
//     }",
//         1,
//     );
// }

// #[test]
// fn usage_of_fn_1() {
//     assert_standalone(
//         "function foo() {
//             function bar() {

//             }
//         declare(function (module, exports) {
//             const baz = new bar();
//         }, function (module, exports) {

//         });
//     }",
//         1,
//     );
// }

// #[test]
// fn usage_of_var_2() {
//     assert_standalone(
//         "var C = 1;
//         var obj = {
//             bar: function (module, exports) {
//                 return C + C;
//             },
//         };
//         console.log(obj.bar());
//         ",
//         0,
//     );
// }

// #[test]
// fn export_default_fn_1() {
//     assert_standalone("export default function f(module, exports) {}", 0);
// }
