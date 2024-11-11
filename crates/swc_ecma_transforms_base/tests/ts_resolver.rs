#![deny(warnings)]

use std::path::PathBuf;

use swc_common::{Mark, SyntaxContext};
use swc_ecma_ast::*;
use swc_ecma_parser::{parse_file_as_module, Syntax, TsSyntax};
use swc_ecma_transforms_base::resolver;
use swc_ecma_visit::{Visit, VisitWith};
use testing::fixture;

#[fixture("../swc_ecma_parser/tests/**/*.ts")]
#[fixture("../swc_ecma_parser/tests/**/*.tsx")]
fn no_empty(input: PathBuf) {
    eprintln!("{}", input.display());

    testing::run_test2(false, |cm, _handler| {
        let fm = cm.load_file(&input).expect("failed to load file");

        let module = match parse_file_as_module(
            &fm,
            Syntax::Typescript(TsSyntax {
                tsx: input.ends_with("tsx"),
                decorators: true,
                no_early_errors: true,
                ..Default::default()
            }),
            EsVersion::latest(),
            None,
            &mut Vec::new(),
        ) {
            Ok(v) => v,
            // We are not testing parser
            Err(..) => return Ok(()),
        };

        let module = Program::Module(module).apply(resolver(Mark::new(), Mark::new(), true));

        module.visit_with(&mut AssertNoEmptyCtxt);

        Ok(())
    })
    .unwrap();
}

struct AssertNoEmptyCtxt;

impl Visit for AssertNoEmptyCtxt {
    fn visit_expr(&mut self, n: &Expr) {
        n.visit_children_with(self);

        if let Expr::Ident(i) = n {
            if i.ctxt == SyntaxContext::empty() {
                unreachable!("ts_resolver has a bug")
            }
        }
    }

    fn visit_pat(&mut self, n: &Pat) {
        n.visit_children_with(self);

        if let Pat::Ident(i) = n {
            if i.ctxt == SyntaxContext::empty() {
                unreachable!("ts_resolver has a bug")
            }
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

        n.type_ann.visit_with(self);
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

    fn visit_var_decl(&mut self, node: &VarDecl) {
        if node.declare {
            return;
        }

        node.visit_children_with(self);
    }
}
