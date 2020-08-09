use crate::{ImportInfo, Specifier};
use swc_atoms::js_word;
use swc_common::Spanned;
use swc_ecma_ast::*;
use swc_ecma_visit::Node;

#[derive(Debug)]
pub struct ImportFinder<'a> {
    pub(crate) to: &'a mut Vec<ImportInfo>,
}

impl swc_ecma_visit::Visit for ImportFinder<'_> {
    /// Extracts require('foo')
    fn visit_call_expr(&mut self, expr: &CallExpr, _: &dyn Node) {
        let span = expr.span();

        match expr.callee {
            ExprOrSuper::Expr(box Expr::Ident(ref i)) if i.sym == js_word!("require") => {
                let src = expr
                    .args
                    .iter()
                    .map(|v| match *v.expr {
                        Expr::Lit(Lit::Str(Str { ref value, .. })) => value.clone(),
                        _ => unimplemented!("error reporting for dynamic require"),
                    })
                    .next()
                    .unwrap();
                self.to.push(ImportInfo {
                    span,
                    all: true,
                    items: vec![],
                    src,
                });
            }
            _ => return,
        }
    }

    fn visit_import_decl(&mut self, import: &ImportDecl, _: &dyn Node) {
        let span = import.span();
        let mut items = vec![];
        let mut all = false;

        for s in &import.specifiers {
            match *s {
                ImportSpecifier::Default(ref default) => items.push(Specifier {
                    export: Ident::new(js_word!("default"), default.span).into(),
                    local: default.local.clone().into(),
                }),
                ImportSpecifier::Named(ref s) => {
                    items.push(Specifier {
                        export: s
                            .imported
                            .as_ref()
                            .map(|v| v.into())
                            .unwrap_or_else(|| s.local.clone().into()),
                        local: s.local.clone().into(),
                    });
                }
                ImportSpecifier::Namespace(..) => all = true,
            }
        }

        if !items.is_empty() {
            self.to.push(ImportInfo {
                span,
                items,
                all,
                src: import.src.value.clone(),
            });
        }
    }
}
