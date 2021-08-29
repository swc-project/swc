use swc_common::{input::SourceFileInput, FileName};
use swc_ecma_ast::*;
use swc_ecma_minifier::{
    eval::{EvalResult, Evaluator},
    marks::Marks,
};
use swc_ecma_parser::{lexer::Lexer, Parser};
use swc_ecma_visit::{noop_visit_mut_type, VisitMut, VisitMutWith};

fn eval(module: &str, expr: &str) -> Option<String> {
    testing::run_test2(false, |cm, _handler| {
        let fm = cm.new_source_file(FileName::Anon, module.to_string());
        let marks = Marks::new();

        let module_ast = {
            let lexer = Lexer::new(
                Default::default(),
                EsVersion::latest(),
                SourceFileInput::from(&*fm),
                None,
            );
            let mut parser = Parser::new_from(lexer);
            parser.parse_module().unwrap()
        };

        let expr_ast = {
            let fm = cm.new_source_file(FileName::Anon, expr.to_string());

            let lexer = Lexer::new(
                Default::default(),
                EsVersion::latest(),
                SourceFileInput::from(&*fm),
                None,
            );
            let mut parser = Parser::new_from(lexer);
            parser.parse_expr().unwrap()
        };

        let mut evaluator = Evaluator::new(module_ast, marks);

        let res = evaluator.eval(&expr_ast);

        match res {
            Some(res) => match res {
                EvalResult::Lit(l) => match l {
                    swc_ecma_ast::Lit::Str(v) => Ok(Some(v.value.to_string())),
                    swc_ecma_ast::Lit::Bool(v) => Ok(Some(v.value.to_string())),
                    swc_ecma_ast::Lit::Num(v) => Ok(Some(v.value.to_string())),
                    swc_ecma_ast::Lit::Null(_) => Ok(Some("null".into())),
                    _ => unreachable!(),
                },
                EvalResult::Undefined => Ok(Some("undefined".into())),
            },
            None => Ok(None),
        }
    })
    .unwrap()
}

#[test]

fn simple() {
    assert_eq!(eval("const foo = 4", "foo").unwrap(), "4");
}

struct PartialInliner {
    marks: Marks,
    eval: Option<Evaluator>,
}

impl PartialInliner {
    fn run_test<F>(src: &str, op: F)
    where
        F: FnOnce(Module, &mut PartialInliner),
    {
        testing::run_test2(false, |cm, _handler| {
            let fm = cm.new_source_file(FileName::Anon, src.to_string());
            let marks = Marks::new();

            let module = {
                let lexer = Lexer::new(
                    Default::default(),
                    EsVersion::latest(),
                    SourceFileInput::from(&*fm),
                    None,
                );
                let mut parser = Parser::new_from(lexer);
                parser.parse_module().unwrap()
            };

            let mut inliner = PartialInliner {
                marks,
                eval: Default::default(),
            };

            op(module, &mut inliner);

            Ok(())
        })
        .unwrap();
    }

    fn test(src: &str, expected: &str) {}
}

impl VisitMut for PartialInliner {
    noop_visit_mut_type!();

    fn visit_mut_module(&mut self, module: &mut Module) {
        self.eval = Some(Evaluator::new(module.clone(), self.marks));
        module.visit_mut_children_with(self);
    }
}

#[test]
fn partial_1() {
    PartialInliner::run_test(
        "
            const color = 'red'

            export default () => (
            <div>
                <p>test</p>
                <style jsx>{`
                div.${color} {
                    color: ${otherColor};
                }
                `}</style>
            </div>
            )
            ",
        |mut module, inliner| {
            module.visit_mut_with(inliner);
        },
    );
}
