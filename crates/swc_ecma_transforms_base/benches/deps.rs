use criterion::{black_box, criterion_group, criterion_main, Bencher, Criterion};
use swc_common::{FileName, DUMMY_SP};
use swc_ecma_ast::*;
use swc_ecma_parser::{lexer::Lexer, parse_file_as_module, Parser, StringInput, Syntax};
use swc_ecma_transforms_base::pass::noop;
use swc_ecma_utils::ExprFactory;
use swc_ecma_visit::{FoldWith, Visit, VisitWith};

static SOURCE: &str = include_str!("assets/AjaxObservable.ts");

fn module_clone(b: &mut Bencher) {
    let _ = ::testing::run_test(false, |cm, handler| {
        let fm = cm.new_source_file(FileName::Anon, SOURCE.into());

        let mut errors = vec![];
        let module = parse_file_as_module(
            &fm,
            Syntax::Typescript(Default::default()),
            Default::default(),
            None,
            &mut errors,
        )
        .map_err(|e| {
            e.into_diagnostic(handler).emit();
        })
        .unwrap();

        for e in errors {
            e.into_diagnostic(handler).emit();
        }

        b.iter(|| black_box(module.clone()));
        Ok(())
    });
}

fn fold_empty(b: &mut Bencher) {
    let _ = ::testing::run_test(false, |cm, handler| {
        let fm = cm.new_source_file(FileName::Anon, SOURCE.into());

        let mut errors = vec![];
        let module = parse_file_as_module(
            &fm,
            Syntax::Typescript(Default::default()),
            Default::default(),
            None,
            &mut errors,
        )
        .map_err(|e| {
            e.into_diagnostic(handler).emit();
        })
        .unwrap();

        for e in errors {
            e.into_diagnostic(handler).emit();
        }

        let mut folder = noop();

        b.iter(|| black_box(module.clone().fold_with(&mut folder)));
        Ok(())
    });
}

/// Optimized out

fn fold_noop_impl_all(b: &mut Bencher) {
    let _ = ::testing::run_test(false, |cm, handler| {
        let fm = cm.new_source_file(FileName::Anon, SOURCE.into());

        let mut errors = vec![];
        let module = parse_file_as_module(
            &fm,
            Syntax::Typescript(Default::default()),
            Default::default(),
            None,
            &mut errors,
        )
        .map_err(|e| e.into_diagnostic(handler).emit())
        .unwrap();

        for e in errors {
            e.into_diagnostic(handler).emit();
        }

        let mut folder = noop();

        b.iter(|| black_box(module.clone().fold_with(&mut folder)));
        Ok(())
    });
}

/// Optimized out

fn fold_noop_impl_vec(b: &mut Bencher) {
    let _ = ::testing::run_test(false, |cm, handler| {
        let fm = cm.new_source_file(FileName::Anon, SOURCE.into());
        let mut errors = vec![];
        let module = parse_file_as_module(
            &fm,
            Syntax::Typescript(Default::default()),
            Default::default(),
            None,
            &mut errors,
        )
        .map_err(|e| {
            e.into_diagnostic(handler).emit();
        })
        .unwrap();

        for e in errors {
            e.into_diagnostic(handler).emit();
        }

        let mut folder = noop();

        b.iter(|| black_box(module.clone().fold_with(&mut folder)));
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

fn boxing_boxed_clone(b: &mut Bencher) {
    let _ = ::testing::run_test(false, |_, _| {
        let expr = Box::new(mk_expr());

        b.iter(|| black_box(expr.clone()));
        Ok(())
    });
}

fn boxing_unboxed_clone(b: &mut Bencher) {
    let _ = ::testing::run_test(false, |_, _| {
        let expr = mk_expr();

        b.iter(|| black_box(expr.clone()));
        Ok(())
    });
}

fn boxing_boxed(b: &mut Bencher) {
    let _ = ::testing::run_test(false, |_, _| {
        let mut folder = noop();
        let expr = Box::new(mk_expr());

        b.iter(|| black_box(expr.clone().fold_with(&mut folder)));
        Ok(())
    });
}

fn boxing_unboxed(b: &mut Bencher) {
    let _ = ::testing::run_test(false, |_, _| {
        let mut folder = noop();
        let expr = mk_expr();

        b.iter(|| black_box(expr.clone().fold_with(&mut folder)));
        Ok(())
    });
}

fn visit_empty(b: &mut Bencher) {
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

        b.iter(|| black_box(()));
        Ok(())
    });
}

fn visit_contains_this(b: &mut Bencher) {
    fn contains_this_expr(body: &Module) -> bool {
        struct Visitor {
            found: bool,
        }

        impl Visit for Visitor {
            /// Don't recurse into fn
            fn visit_fn_expr(&mut self, _: &FnExpr) {}

            /// Don't recurse into fn
            fn visit_fn_decl(&mut self, _: &FnDecl) {}

            fn visit_this_expr(&mut self, _: &ThisExpr) {
                self.found = true;
            }
        }

        let mut visitor = Visitor { found: false };
        body.visit_with(&mut visitor);
        visitor.found
    }

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

        b.iter(|| black_box(contains_this_expr(&module)));
        Ok(())
    });
}

fn bench_cases(c: &mut Criterion) {
    c.bench_function("es/visitor/base-perf/module_clone", module_clone);
    c.bench_function("es/visitor/base-perf/fold_empty", fold_empty);
    c.bench_function(
        "es/visitor/base-perf/fold_noop_impl_all",
        fold_noop_impl_all,
    );
    c.bench_function(
        "es/visitor/base-perf/fold_noop_impl_vec",
        fold_noop_impl_vec,
    );
    c.bench_function(
        "es/visitor/base-perf/boxing_boxed_clone",
        boxing_boxed_clone,
    );
    c.bench_function(
        "es/visitor/base-perf/boxing_unboxed_clone",
        boxing_unboxed_clone,
    );
    c.bench_function("es/visitor/base-perf/boxing_boxed", boxing_boxed);
    c.bench_function("es/visitor/base-perf/boxing_unboxed", boxing_unboxed);
    c.bench_function("es/visitor/base-perf/visit_empty", visit_empty);
    c.bench_function(
        "es/visitor/base-perf/visit_contains_this",
        visit_contains_this,
    );
}

criterion_group!(benches, bench_cases);
criterion_main!(benches);
