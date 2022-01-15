use std::path::PathBuf;
use swc_common::{input::SourceFileInput, Mark, SyntaxContext};
use swc_ecma_ast::*;
use swc_ecma_parser::{lexer::Lexer, Parser, Syntax, TsConfig};
use swc_ecma_transforms_base::resolver::ts_resolver;
use swc_ecma_visit::{FoldWith, Visit, VisitWith};
use testing::fixture;

#[fixture("../swc_ecma_parser/tests/typescript/**/*.ts")]
#[fixture("../swc_ecma_parser/tests/typescript/**/*.tsx")]
fn no_empty(input: PathBuf) {
    eprintln!("{}", input.display());

    testing::run_test2(false, |cm, _handler| {
        let fm = cm.load_file(&input).expect("failed to load file");

        let lexer = Lexer::new(
            Syntax::Typescript(TsConfig {
                tsx: input.ends_with("tsx"),
                decorators: true,
                no_early_errors: true,
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

        module.visit_with(&mut AssertNoEmptyCtxt);

        Ok(())
    })
    .unwrap();
}

struct AssertNoEmptyCtxt;

impl Visit for AssertNoEmptyCtxt {
    fn visit_class_prop(&mut self, n: &ClassProp) {
        if let PropName::Computed(key) = &n.key {
            key.expr.visit_with(self);
        }

        n.value.visit_with(self);
        n.type_ann.visit_with(self);
        n.decorators.visit_with(self);
    }

    fn visit_expr(&mut self, n: &Expr) {
        n.visit_children_with(self);

        if let Expr::Ident(i) = n {
            if i.span.ctxt == SyntaxContext::empty() {
                unreachable!("ts_resolver has a bug")
            }
        }
    }

    fn visit_member_expr(&mut self, n: &MemberExpr) {
        n.obj.visit_with(self);
        if let MemberProp::Computed(c) = &n.prop {
            c.visit_with(self);
        }
    }

    fn visit_pat(&mut self, n: &Pat) {
        n.visit_children_with(self);

        if let Pat::Ident(i) = n {
            if i.id.span.ctxt == SyntaxContext::empty() {
                unreachable!("ts_resolver has a bug")
            }
        }
    }

    fn visit_super_prop_expr(&mut self, n: &SuperPropExpr) {
        if let SuperProp::Computed(c) = &n.prop {
            c.visit_with(self);
        }
    }

    fn visit_ts_getter_signature(&mut self, n: &TsGetterSignature) {
        if n.computed {
            n.key.visit_with(self);
        }

        n.type_ann.visit_with(self);
    }

    fn visit_ts_method_signature(&mut self, n: &TsMethodSignature) {
        if n.computed {
            n.key.visit_with(self);
        }

        n.params.visit_with(self);
        n.type_ann.visit_with(self);
        n.type_params.visit_with(self);
    }

    fn visit_ts_property_signature(&mut self, n: &TsPropertySignature) {
        if n.computed {
            n.key.visit_with(self);
        }

        n.init.visit_with(self);
        n.params.visit_with(self);
        n.type_ann.visit_with(self);
        n.type_params.visit_with(self);
    }

    fn visit_ts_setter_signature(&mut self, n: &TsSetterSignature) {
        if n.computed {
            n.key.visit_with(self);
        }

        n.param.visit_with(self);
    }

    fn visit_ts_tuple_element(&mut self, n: &TsTupleElement) {
        n.ty.visit_with(self);
    }
}
