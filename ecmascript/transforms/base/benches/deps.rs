#![feature(test)]
extern crate test;

use swc_common::{FileName, DUMMY_SP};
use swc_ecma_ast::*;
use swc_ecma_parser::{lexer::Lexer, Parser, StringInput, Syntax};
use swc_ecma_transforms_base::pass::noop;
use swc_ecma_utils::ExprFactory;
use swc_ecma_visit::{FoldWith, Node, Visit, VisitWith};
use test::Bencher;

static SOURCE: &str = include_str!("assets/AjaxObservable.ts");

#[bench]
fn module_clone(b: &mut Bencher) {
    b.bytes = SOURCE.len() as _;

    let _ = ::testing::run_test(false, |cm, handler| {
        let fm = cm.new_source_file(FileName::Anon, SOURCE.into());
        let lexer = Lexer::new(
            Syntax::Typescript(Default::default()),
            Default::default(),
            StringInput::from(&*fm),
            None,
        );
        let mut parser = Parser::new_from(lexer);
        let module = parser
            .parse_module()
            .map_err(|e| {
                e.into_diagnostic(handler).emit();
            })
            .unwrap();

        for e in parser.take_errors() {
            e.into_diagnostic(handler).emit();
        }

        b.iter(|| test::black_box(module.clone()));
        Ok(())
    });
}

#[bench]
fn fold_empty(b: &mut Bencher) {
    b.bytes = SOURCE.len() as _;

    let _ = ::testing::run_test(false, |cm, handler| {
        let fm = cm.new_source_file(FileName::Anon, SOURCE.into());
        let lexer = Lexer::new(
            Syntax::Typescript(Default::default()),
            Default::default(),
            StringInput::from(&*fm),
            None,
        );
        let mut parser = Parser::new_from(lexer);
        let module = parser
            .parse_module()
            .map_err(|e| {
                e.into_diagnostic(&handler).emit();
            })
            .unwrap();

        for e in parser.take_errors() {
            e.into_diagnostic(&handler).emit();
        }

        let mut folder = noop();

        b.iter(|| test::black_box(module.clone().fold_with(&mut folder)));
        Ok(())
    });
}

/// Optimized out
#[bench]
fn fold_noop_impl_all(b: &mut Bencher) {
    b.bytes = SOURCE.len() as _;

    let _ = ::testing::run_test(false, |cm, handler| {
        let fm = cm.new_source_file(FileName::Anon, SOURCE.into());

        let lexer = Lexer::new(
            Syntax::Typescript(Default::default()),
            Default::default(),
            StringInput::from(&*fm),
            None,
        );
        let mut parser = Parser::new_from(lexer);
        let module = parser
            .parse_module()
            .map_err(|e| e.into_diagnostic(&handler).emit())
            .unwrap();

        for e in parser.take_errors() {
            e.into_diagnostic(&handler).emit();
        }

        let mut folder = noop();

        b.iter(|| test::black_box(module.clone().fold_with(&mut folder)));
        Ok(())
    });
}

/// Optimized out
#[bench]
fn fold_noop_impl_vec(b: &mut Bencher) {
    b.bytes = SOURCE.len() as _;

    let _ = ::testing::run_test(false, |cm, handler| {
        let fm = cm.new_source_file(FileName::Anon, SOURCE.into());
        let lexer = Lexer::new(
            Syntax::Typescript(Default::default()),
            Default::default(),
            StringInput::from(&*fm),
            None,
        );
        let mut parser = Parser::new_from(lexer);
        let module = parser
            .parse_module()
            .map_err(|e| {
                e.into_diagnostic(&handler).emit();
            })
            .unwrap();

        for e in parser.take_errors() {
            e.into_diagnostic(&handler).emit();
        }

        let mut folder = noop();

        b.iter(|| test::black_box(module.clone().fold_with(&mut folder)));
        Ok(())
    });
}

fn mk_expr() -> Expr {
    Expr::Call(CallExpr {
        span: DUMMY_SP,
        callee: Ident::new("foo".into(), DUMMY_SP).as_callee(),
        args: vec![],
        type_args: None,
    })
}

#[bench]
fn boxing_boxed_clone(b: &mut Bencher) {
    let _ = ::testing::run_test(false, |_, _| {
        let expr = Box::new(mk_expr());

        b.iter(|| test::black_box(expr.clone()));
        Ok(())
    });
}

#[bench]
fn boxing_unboxed_clone(b: &mut Bencher) {
    let _ = ::testing::run_test(false, |_, _| {
        let expr = mk_expr();

        b.iter(|| test::black_box(expr.clone()));
        Ok(())
    });
}

#[bench]
fn boxing_boxed(b: &mut Bencher) {
    let _ = ::testing::run_test(false, |_, _| {
        let mut folder = noop();
        let expr = Box::new(mk_expr());

        b.iter(|| test::black_box(expr.clone().fold_with(&mut folder)));
        Ok(())
    });
}

#[bench]
fn boxing_unboxed(b: &mut Bencher) {
    let _ = ::testing::run_test(false, |_, _| {
        let mut folder = noop();
        let expr = mk_expr();

        b.iter(|| test::black_box(expr.clone().fold_with(&mut folder)));
        Ok(())
    });
}

#[bench]
fn visit_empty(b: &mut Bencher) {
    b.bytes = SOURCE.len() as _;

    let _ = ::testing::run_test(false, |cm, _| {
        let fm = cm.new_source_file(FileName::Anon, SOURCE.into());
        let lexer = Lexer::new(
            Syntax::Typescript(Default::default()),
            Default::default(),
            StringInput::from(&*fm),
            None,
        );
        let mut parser = Parser::new_from(lexer);
        let _module = parser.parse_module().map_err(|_| ()).unwrap();

        b.iter(|| test::black_box(()));
        Ok(())
    });
}

#[bench]
fn visit_contains_this(b: &mut Bencher) {
    fn contains_this_expr(body: &Module) -> bool {
        struct Visitor {
            found: bool,
        }

        impl Visit for Visitor {
            /// Don't recurse into fn
            fn visit_fn_expr(&mut self, _: &FnExpr, _: &dyn Node) {}

            /// Don't recurse into fn
            fn visit_fn_decl(&mut self, _: &FnDecl, _: &dyn Node) {}

            fn visit_this_expr(&mut self, _: &ThisExpr, _: &dyn Node) {
                self.found = true;
            }
        }

        let mut visitor = Visitor { found: false };
        body.visit_with(&Invalid { span: DUMMY_SP } as _, &mut visitor);
        visitor.found
    }

    b.bytes = SOURCE.len() as _;

    let _ = ::testing::run_test(false, |cm, _| {
        let fm = cm.new_source_file(FileName::Anon, SOURCE.into());
        let lexer = Lexer::new(
            Syntax::Typescript(Default::default()),
            Default::default(),
            StringInput::from(&*fm),
            None,
        );
        let mut parser = Parser::new_from(lexer);
        let module = parser.parse_module().map_err(|_| ()).unwrap();

        b.iter(|| test::black_box(contains_this_expr(&module)));
        Ok(())
    });
}
