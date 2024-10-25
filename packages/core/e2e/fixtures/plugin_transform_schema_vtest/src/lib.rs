use swc_core::{
    ast::*,
    atoms::*,
    common::DUMMY_SP,
    plugin::{metadata::TransformPluginProgramMetadata, plugin_transform},
    visit::*,
};

struct ConsoleOutputReplacer;

impl VisitMut for ConsoleOutputReplacer {
    fn visit_mut_call_expr(&mut self, call: &mut CallExpr) {
        if let Callee::Expr(expr) = &call.callee {
            if let Expr::Member(MemberExpr { obj, .. }) = &**expr {
                if let Expr::Ident(ident) = &**obj {
                    if ident.sym == *"console" {
                        call.args[0].expr = Box::new(Expr::Lit(Lit::Str(Str {
                            span: DUMMY_SP,
                            value: JsWord::from("plugin_transform_schema_vtest"),
                            raw: Some(Atom::from("\"plugin_transform_schema_vtest\"")),
                        })));
                    }
                }
            }
        }
    }
}

#[plugin_transform]
pub fn process(program: Program, _metadata: TransformPluginProgramMetadata) -> Program {
    // Ensure this plugin uses vtest AST struct schema, by compile-time validating
    // it does have new enum for the testing purpose.
    match &program {
        Program::Script(..) => {}
        Program::Module(..) => {}
    }
    program.fold_with(&mut visit_mut_pass(ConsoleOutputReplacer))
}
