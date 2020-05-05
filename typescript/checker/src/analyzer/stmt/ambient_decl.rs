use crate::errors::{Error, Errors};
use swc_common::{Visit, VisitWith};
use swc_ecma_ast::*;

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

impl Visit<Stmt> for AmbientFunctionHandler<'_> {
    fn visit(&mut self, node: &Stmt) {
        node.visit_children(self);

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
}

impl Visit<FnDecl> for AmbientFunctionHandler<'_> {
    fn visit(&mut self, node: &FnDecl) {
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
}

impl Visit<TsModuleDecl> for AmbientFunctionHandler<'_> {
    fn visit(&mut self, node: &TsModuleDecl) {}
}
