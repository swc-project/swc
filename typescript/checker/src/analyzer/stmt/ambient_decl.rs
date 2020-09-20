use crate::errors::{Error, Errors};
use swc_ecma_ast::*;
use swc_ecma_visit::Node;

/// Handles
///
/// ```ts
/// 
/// foo();
/// bar();
/// bar() {}
/// ```
pub struct AmbientFunctionHandler<'a> {
    pub last_ambient_name: Option<Ident>,
    pub errors: &'a mut Errors,
}

impl swc_ecma_visit::Visit for AmbientFunctionHandler<'_> {
    fn visit_stmt(&mut self, node: &Stmt, _: &dyn Node) {
        node.visit_children_with(self);

        match node {
            Stmt::Decl(Decl::Fn(..)) => {}
            _ => {
                // .take() is same as self.last_ambient_name = None
                if let Some(ref i) = self.last_ambient_name.take() {
                    self.errors.push(Error::TS2391 { span: i.span });
                }
            }
        }
    }

    fn visit_fn_decl(&mut self, node: &FnDecl, _: &dyn Node) {
        if node.declare {
            return;
        }

        if node.function.body.is_none() {
            if let Some(ref name) = self.last_ambient_name {
                if node.ident.sym != name.sym {
                    self.errors.push(Error::TS2389 { span: name.span });
                }
            }
            self.last_ambient_name = Some(node.ident.clone());
        } else {
            if let Some(ref name) = self.last_ambient_name {
                if node.ident.sym == name.sym {
                    self.last_ambient_name = None;
                } else {
                    self.errors.push(Error::TS2389 {
                        span: node.ident.span,
                    });
                    self.last_ambient_name = None;
                }
            }
        }
    }

    fn visit_ts_module_decl(&mut self, _: &TsModuleDecl, _: &dyn Node) {}
}
