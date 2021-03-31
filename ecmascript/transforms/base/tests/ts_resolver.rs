use std::path::PathBuf;
use swc_common::input::SourceFileInput;
use swc_common::Mark;
use swc_common::SyntaxContext;
use swc_common::DUMMY_SP;
use swc_ecma_ast::*;
use swc_ecma_parser::lexer::Lexer;
use swc_ecma_parser::Parser;
use swc_ecma_parser::Syntax;
use swc_ecma_parser::TsConfig;
use swc_ecma_transforms_base::resolver::ts_resolver;
use swc_ecma_visit::FoldWith;
use swc_ecma_visit::Node;
use swc_ecma_visit::Visit;
use swc_ecma_visit::VisitWith;
use testing::fixture;

#[fixture("../../../parser/tests/typescript/**/*.ts")]
#[fixture("../../../parser/tests/typescript/**/*.tsx")]
fn no_empty(input: PathBuf) {
    eprintln!("{}", input.display());

    testing::run_test2(false, |cm, _handler| {
        let fm = cm.load_file(&input).expect("failed to load file");

        let lexer = Lexer::new(
            Syntax::Typescript(TsConfig {
                tsx: input.ends_with("tsx"),
                decorators: true,
                dynamic_import: true,
                no_early_errors: true,
                import_assertions: true,
                ..Default::default()
            }),
            EsVersion::latest(),
            SourceFileInput::from(&*fm),
            None,
        );

        let mut parser = Parser::new_from(lexer);
        let module = match parser.parse_module() {
            Ok(v) => v,
            // We are not testing parser
            Err(..) => return Ok(()),
        };

        let module = module.fold_with(&mut ts_resolver(Mark::fresh(Mark::root())));

        module.visit_with(&Invalid { span: DUMMY_SP }, &mut AssertNoEmptyCtxt);

        Ok(())
    })
    .unwrap();
}

struct AssertNoEmptyCtxt;

impl Visit for AssertNoEmptyCtxt {
    fn visit_member_expr(&mut self, n: &MemberExpr, _: &dyn Node) {
        n.obj.visit_with(n, self);
        if n.computed {
            n.prop.visit_with(n, self);
        }
    }

    fn visit_expr(&mut self, n: &Expr, _: &dyn Node) {
        n.visit_children_with(self);

        match n {
            Expr::Ident(i) => {
                if i.span.ctxt == SyntaxContext::empty() {
                    unreachable!("ts_resolver has a bug")
                }
            }
            _ => {}
        }
    }
}
