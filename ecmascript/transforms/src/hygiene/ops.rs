use ast::*;
use swc_atoms::JsWord;
use swc_common::{Fold, FoldWith, SyntaxContext};

#[derive(Debug)]
pub(super) enum ScopeOp {
    Rename {
        from: (JsWord, SyntaxContext),
        to: JsWord,
    },
}

pub(super) struct Operator<'a>(pub &'a [ScopeOp]);

impl<'a> Fold<Prop> for Operator<'a> {
    fn fold(&mut self, prop: Prop) -> Prop {
        match prop {
            Prop::Shorthand(i) => {
                // preserve key
                match self.rename_ident(i.clone()) {
                    Ok(renamed) => Prop::KeyValue(KeyValueProp {
                        key: PropName::Ident(Ident {
                            // clear mark
                            span: i.span.with_ctxt(SyntaxContext::empty()),
                            ..i
                        }),
                        value: box Expr::Ident(renamed),
                    }),
                    Err(i) => Prop::Shorthand(i),
                }
            }
            _ => prop.fold_children(self),
        }
    }
}

impl<'a> Operator<'a> {
    /// Returns `Ok(renamed_ident)` if ident should be renamed.
    fn rename_ident(&mut self, ident: Ident) -> Result<Ident, Ident> {
        for op in self.0 {
            match *op {
                ScopeOp::Rename { ref from, ref to }
                    if *from.0 == ident.sym && from.1 == ident.span.ctxt() =>
                {
                    return Ok(Ident {
                        // Clear mark
                        span: ident.span.with_ctxt(SyntaxContext::empty()),
                        sym: to.clone(),
                        ..ident
                    });
                }
                _ => {}
            }
        }
        Err(ident)
    }
}

impl<'a> Fold<Ident> for Operator<'a> {
    fn fold(&mut self, ident: Ident) -> Ident {
        match self.rename_ident(ident) {
            Ok(i) | Err(i) => i,
        }
    }
}
