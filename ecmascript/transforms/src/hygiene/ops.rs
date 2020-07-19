use swc_atoms::JsWord;
use swc_common::{util::move_map::MoveMap, Spanned, SyntaxContext, DUMMY_SP};
use swc_ecma_ast::*;
use swc_ecma_visit::{Fold, FoldWith};

#[derive(Debug)]
pub(super) enum ScopeOp {
    Rename {
        from: (JsWord, SyntaxContext),
        to: JsWord,
    },
}

pub(super) struct Operator<'a>(pub &'a [ScopeOp]);

noop_fold_type!(Operator<'_>);

impl<'a> Fold for Operator<'a> {
    fn fold_module_items(&mut self, items: Vec<ModuleItem>) -> Vec<ModuleItem> {
        let mut stmts = Vec::with_capacity(items.len());

        for item in items {
            let span = item.span();

            macro_rules! export {
                ($orig:expr, $ident:expr) => {
                    stmts.push(ModuleItem::ModuleDecl(ModuleDecl::ExportNamed(
                        NamedExport {
                            span,
                            specifiers: vec![ExportSpecifier::Named(ExportNamedSpecifier {
                                span: DUMMY_SP,
                                orig: $ident,
                                exported: Some($orig),
                            })],
                            src: None,
                            type_only: false,
                        },
                    )));
                };
            }

            match item {
                ModuleItem::ModuleDecl(ModuleDecl::ExportDecl(ExportDecl {
                    span,
                    decl:
                        Decl::Class(ClassDecl {
                            ident,
                            class,
                            declare,
                        }),
                })) => {
                    let class = class.fold_with(self);
                    let orig_ident = ident.clone();
                    match self.rename_ident(ident) {
                        Ok(ident) => {
                            stmts.push(ModuleItem::Stmt(Stmt::Decl(Decl::Class(ClassDecl {
                                ident: ident.clone(),
                                class,
                                declare,
                            }))));
                            export!(orig_ident, ident);
                        }
                        Err(ident) => {
                            stmts.push(ModuleItem::ModuleDecl(ModuleDecl::ExportDecl(ExportDecl {
                                span,
                                decl: Decl::Class(ClassDecl {
                                    ident,
                                    class,
                                    declare,
                                }),
                            })))
                        }
                    }
                }
                ModuleItem::ModuleDecl(ModuleDecl::ExportDecl(ExportDecl {
                    span,
                    decl:
                        Decl::Fn(FnDecl {
                            ident,
                            function,
                            declare,
                        }),
                })) => {
                    let function = function.fold_with(self);
                    let orig_ident = ident.clone();
                    match self.rename_ident(ident) {
                        Ok(ident) => {
                            stmts.push(ModuleItem::Stmt(Stmt::Decl(Decl::Fn(FnDecl {
                                ident: ident.clone(),
                                function,
                                declare,
                            }))));
                            export!(orig_ident, ident);
                        }
                        Err(ident) => {
                            stmts.push(ModuleItem::ModuleDecl(ModuleDecl::ExportDecl(ExportDecl {
                                span,
                                decl: Decl::Fn(FnDecl {
                                    ident,
                                    function,
                                    declare,
                                }),
                            })))
                        }
                    }
                }
                ModuleItem::ModuleDecl(ModuleDecl::ExportDecl(ExportDecl {
                    decl: Decl::Var(var),
                    ..
                })) => {
                    let decls = var.decls;

                    let mut renamed: Vec<ExportSpecifier> = vec![];
                    let decls = decls.move_map(|decl| {
                        let name = decl.name.fold_with(&mut VarFolder {
                            orig: self,
                            renamed: &mut renamed,
                        });
                        let init = decl.init.fold_with(self);
                        VarDeclarator { name, init, ..decl }
                    });
                    if renamed.is_empty() {
                        stmts.push(ModuleItem::ModuleDecl(ModuleDecl::ExportDecl(ExportDecl {
                            span,
                            decl: Decl::Var(VarDecl { decls, ..var }),
                        })));
                        continue;
                    }
                    stmts.push(ModuleItem::Stmt(Stmt::Decl(Decl::Var(VarDecl {
                        decls,
                        ..var
                    }))));
                    stmts.push(ModuleItem::ModuleDecl(ModuleDecl::ExportNamed(
                        NamedExport {
                            span,
                            specifiers: renamed,
                            src: None,
                            type_only: false,
                        },
                    )));
                }
                _ => stmts.push(item.fold_with(self)),
            }
        }

        stmts
    }

    /// Preserve key of properties.
    fn fold_assign_pat_prop(&mut self, p: AssignPatProp) -> AssignPatProp {
        match p.value {
            Some(value) => AssignPatProp {
                value: Some(value.fold_children_with(self)),
                ..p
            },
            None => p,
        }
    }

    fn fold_export_named_specifier(&mut self, s: ExportNamedSpecifier) -> ExportNamedSpecifier {
        if s.exported.is_some() {
            return ExportNamedSpecifier {
                orig: s.orig.fold_with(self),
                ..s
            };
        }

        let exported = s.orig.clone();

        match self.rename_ident(s.orig) {
            Ok(orig) => ExportNamedSpecifier {
                exported: Some(exported),
                orig,
                ..s
            },
            Err(orig) => ExportNamedSpecifier { orig, ..s },
        }
    }

    fn fold_ident(&mut self, ident: Ident) -> Ident {
        match self.rename_ident(ident) {
            Ok(i) | Err(i) => i,
        }
    }

    fn fold_import_named_specifier(&mut self, s: ImportNamedSpecifier) -> ImportNamedSpecifier {
        if s.imported.is_some() {
            return ImportNamedSpecifier {
                local: s.local.fold_with(self),
                ..s
            };
        }

        let imported = s.local.clone();
        let local = self.rename_ident(s.local);

        match local {
            Ok(local) => ImportNamedSpecifier {
                imported: Some(imported),
                local,
                ..s
            },
            Err(local) => ImportNamedSpecifier { local, ..s },
        }
    }

    /// Preserve key of properties.
    fn fold_key_value_pat_prop(&mut self, p: KeyValuePatProp) -> KeyValuePatProp {
        KeyValuePatProp {
            key: p.key.fold_with(self),
            value: p.value.fold_with(self),
            ..p
        }
    }

    fn fold_key_value_prop(&mut self, p: KeyValueProp) -> KeyValueProp {
        KeyValueProp {
            value: p.value.fold_with(self),
            ..p
        }
    }

    fn fold_member_expr(&mut self, expr: MemberExpr) -> MemberExpr {
        let span = expr.span.fold_with(self);
        let obj = expr.obj.fold_with(self);

        let prop = if expr.computed {
            expr.prop.fold_with(self)
        } else {
            expr.prop
        };
        MemberExpr {
            span,
            obj,
            prop,
            computed: expr.computed,
        }
    }

    fn fold_object_pat_prop(&mut self, p: ObjectPatProp) -> ObjectPatProp {
        let p = p.fold_children_with(self);

        match p {
            ObjectPatProp::Assign(p) => match self.rename_ident(p.key.clone()) {
                Ok(renamed) => KeyValuePatProp {
                    key: PropName::Ident(p.key),

                    value: box Pat::Ident(renamed),
                }
                .into(),
                Err(_) => p.into(),
            },
            _ => p,
        }
    }

    fn fold_prop(&mut self, prop: Prop) -> Prop {
        match prop {
            Prop::Shorthand(i) => {
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
            _ => prop.fold_children_with(self),
        }
    }

    fn fold_prop_name(&mut self, n: PropName) -> PropName {
        match n {
            PropName::Computed(c) => PropName::Computed(c.fold_with(self)),
            _ => n,
        }
    }
}

struct VarFolder<'a, 'b> {
    orig: &'a mut Operator<'b>,
    renamed: &'a mut Vec<ExportSpecifier>,
}

impl Fold for VarFolder<'_, '_> {
    fn fold_expr(&mut self, n: Expr) -> Expr {
        n
    }

    fn fold_ident(&mut self, i: Ident) -> Ident {
        let orig = i.clone();
        match self.orig.rename_ident(i) {
            Ok(i) => {
                self.renamed
                    .push(ExportSpecifier::Named(ExportNamedSpecifier {
                        span: i.span,
                        exported: Some(orig),
                        orig: i.clone(),
                    }));
                i
            }
            Err(i) => i,
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
