use swc_common::{input::StringInput, FileName};
use swc_ecma_ast::*;
use swc_ecma_parser::{lexer::Lexer, Parser};
use swc_ecma_visit::{All, VisitAll, VisitWith};

struct Issue1967;

impl VisitAll for Issue1967 {
    fn visit_expr(&mut self, _: &Expr) {
        panic!("intended")
    }
}

#[test]
#[should_panic = "intended"]
fn issue_1967() {
    testing::run_test2(false, |cm, _handler| {
        let fm = cm.new_source_file(
            FileName::Anon.into(),
            "function foo(){ return 'I'; }".to_string(),
        );
        let lexer = Lexer::new(
            Default::default(),
            EsVersion::latest(),
            StringInput::from(&*fm),
            None,
        );

        let mut parser = Parser::new_from(lexer);

        let m = parser.parse_module().unwrap();

        m.visit_with(&mut All {
            visitor: Issue1967 {},
        });

        Ok(())
    })
    .unwrap();
}
