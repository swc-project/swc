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

use std::hash::Hash;

use rustc_hash::FxHashSet;
use swc_common::{Mark, DUMMY_SP};
use swc_ecma_utils::{member_expr, quote_expr};

use super::HashEqIgnoreSpanExprRef;

#[test]
fn test_hash_eq_ignore_span_expr_ref() {
    use swc_ecma_ast::*;

    fn expr_ref<'a>(expr_ref: &'a Expr) -> HashEqIgnoreSpanExprRef<'a> {
        HashEqIgnoreSpanExprRef(expr_ref)
    }

    testing::run_test(false, |_cm, _handler| {
        let dummy_sp = DUMMY_SP;
        let meaningful_sp = dummy_sp.apply_mark(Mark::new());

        let meaningful_ident_expr = Expr::Ident(Ident::new("foo".into(), meaningful_sp));
        let dummy_ident_expr = Expr::Ident(Ident::new("foo".into(), dummy_sp));

        let meaningful_member_expr = member_expr!(meaningful_sp, foo.bar);
        let dummy_member_expr = member_expr!(dummy_sp, foo.bar);

        let meaningful_null_expr = quote_expr!(meaningful_sp, null);
        let dummy_null_expr = quote_expr!(dummy_sp, null);

        assert_eq!(
            expr_ref(&meaningful_ident_expr),
            expr_ref(&dummy_ident_expr)
        );

        let mut set = FxHashSet::from_iter([
            expr_ref(&meaningful_ident_expr),
            expr_ref(&meaningful_member_expr),
            expr_ref(&meaningful_null_expr),
        ]);

        assert!(set.contains(&expr_ref(&dummy_ident_expr)));
        assert!(set.contains(&expr_ref(&dummy_member_expr)));
        assert!(set.contains(&expr_ref(&dummy_null_expr)));

        set.insert(expr_ref(&dummy_ident_expr));
        set.insert(expr_ref(&dummy_member_expr));
        set.insert(expr_ref(&dummy_null_expr));
        assert_eq!(set.len(), 3);

        Ok(())
    })
    .unwrap();
}
