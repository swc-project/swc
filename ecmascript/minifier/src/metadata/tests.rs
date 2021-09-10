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
//             m.visit_with(&Invalid { span: DUMMY_SP }, &mut counter);
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
//     fn visit_span(&mut self, span: &Span, _: &dyn Node) {
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
