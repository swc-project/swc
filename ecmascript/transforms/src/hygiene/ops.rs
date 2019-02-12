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

impl<'a> Fold<NamedExportSpecifier> for Operator<'a> {
    fn fold(&mut self, s: NamedExportSpecifier) -> NamedExportSpecifier {
        if s.exported.is_some() {
            return NamedExportSpecifier {
                orig: s.orig.fold_with(self),
                ..s
            };
        }

        let exported = s.orig.clone();

        match self.rename_ident(s.orig) {
            Ok(orig) => NamedExportSpecifier {
                exported: Some(exported),
                orig,
                ..s
            },
            Err(orig) => NamedExportSpecifier { orig, ..s },
        }
    }
}

impl<'a> Fold<ImportSpecific> for Operator<'a> {
    fn fold(&mut self, s: ImportSpecific) -> ImportSpecific {
        if s.imported.is_some() {
            return ImportSpecific {
                local: s.local.fold_with(self),
                ..s
            };
        }

        let imported = s.local.clone();
        let local = self.rename_ident(s.local);

        match local {
            Ok(local) => ImportSpecific {
                imported: Some(imported),
                local,
                ..s
            },
            Err(local) => ImportSpecific { local, ..s },
        }
    }
}
