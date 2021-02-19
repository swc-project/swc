use crate::ext::MapWithMut;
use fxhash::FxHashMap;
use swc_atoms::JsWord;
use swc_common::{util::move_map::MoveMap, Spanned, SyntaxContext, DUMMY_SP};
use swc_ecma_ast::*;
use swc_ecma_utils::{ident::IdentLike, Id};
use swc_ecma_visit::{noop_visit_mut_type, VisitMut, VisitMutWith};
#[derive(Debug, Default)]
pub(super) struct Operations {
    pub rename: FxHashMap<Id, JsWord>,
}

pub(super) struct Operator<'a>(pub &'a Operations);

impl<'a> VisitMut for Operator<'a> {
    noop_visit_mut_type!();

    fn visit_mut_module_items(&mut self, items: &mut Vec<ModuleItem>) {
        let mut stmts = Vec::with_capacity(items.len());

        for mut item in items.take() {
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
                            asserts: None,
                        },
                    )));
                };
            }

            match item {
                ModuleItem::ModuleDecl(ModuleDecl::ExportDecl(ExportDecl {
                    span,
                    decl:
                        Decl::Class(ClassDecl {
                            mut ident,
                            mut class,
                            declare,
                        }),
                })) => {
                    class.visit_mut_with(self);
                    let orig_ident = ident.clone();
                    match self.rename_ident(&mut ident) {
                        Ok(..) => {
                            stmts.push(ModuleItem::Stmt(Stmt::Decl(Decl::Class(ClassDecl {
                                ident: ident.clone(),
                                class,
                                declare,
                            }))));
                            export!(orig_ident, ident);
                        }
                        Err(..) => {
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
                            mut ident,
                            mut function,
                            declare,
                        }),
                })) => {
                    function.visit_mut_with(self);
                    let orig_ident = ident.clone();
                    match self.rename_ident(&mut ident) {
                        Ok(..) => {
                            stmts.push(ModuleItem::Stmt(Stmt::Decl(Decl::Fn(FnDecl {
                                ident: ident.clone(),
                                function,
                                declare,
                            }))));
                            export!(orig_ident, ident);
                        }
                        Err(..) => {
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
                    let decls = decls.move_map(|mut decl| {
                        decl.name.visit_mut_with(&mut VarFolder {
                            orig: self,
                            renamed: &mut renamed,
                        });
                        decl.init.visit_mut_with(self);
                        decl
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
                            asserts: None,
                        },
                    )));
                }
                _ => {
                    item.visit_mut_with(self);
                    stmts.push(item)
                }
            }
        }

        *items = stmts
    }

    /// Preserve key of properties.
    fn visit_mut_assign_pat_prop(&mut self, p: &mut AssignPatProp) {
        match &mut p.value {
            Some(value) => {
                value.visit_mut_children_with(self);
            }
            None => {}
        }
    }

    fn visit_mut_export_named_specifier(&mut self, s: &mut ExportNamedSpecifier) {
        if s.exported.is_some() {
            s.orig.visit_mut_with(self);
            return;
        }

        let exported = s.orig.clone();

        match self.rename_ident(&mut s.orig) {
            Ok(..) => {
                s.exported = Some(exported);
            }
            Err(..) => {}
        }
    }

    fn visit_mut_ident(&mut self, ident: &mut Ident) {
        match self.rename_ident(ident) {
            Ok(i) | Err(i) => i,
        }
    }

    fn visit_mut_import_named_specifier(&mut self, s: &mut ImportNamedSpecifier) {
        if s.imported.is_some() {
            s.local.visit_mut_with(self);
            return;
        }

        let imported = s.local.clone();
        let local = self.rename_ident(&mut s.local);

        match local {
            Ok(..) => {
                s.imported = Some(imported);
            }
            Err(..) => {}
        }
    }

    /// Preserve key of properties.
    fn visit_mut_key_value_pat_prop(&mut self, p: &mut KeyValuePatProp) {
        p.key.visit_mut_with(self);
        p.value.visit_mut_with(self);
    }

    fn visit_mut_key_value_prop(&mut self, p: &mut KeyValueProp) {
        p.key.visit_mut_with(self);
        p.value.visit_mut_with(self);
    }

    fn visit_mut_member_expr(&mut self, expr: &mut MemberExpr) {
        expr.span.visit_mut_with(self);
        expr.obj.visit_mut_with(self);

        if expr.computed {
            expr.prop.visit_mut_with(self)
        }
    }

    fn visit_mut_object_pat_prop(&mut self, n: &mut ObjectPatProp) {
        n.visit_mut_children_with(self);

        match n {
            ObjectPatProp::Assign(p) => {
                let mut renamed = p.key.clone();
                match self.rename_ident(&mut renamed) {
                    Ok(..) => {
                        *n = KeyValuePatProp {
                            key: PropName::Ident(p.key.take()),
                            value: match p.value.take() {
                                Some(default_expr) => Box::new(Pat::Assign(AssignPat {
                                    span: p.span,
                                    left: Box::new(Pat::Ident(renamed.into())),
                                    right: default_expr,
                                    type_ann: None,
                                })),
                                None => Box::new(Pat::Ident(renamed.into())),
                            },
                        }
                        .into();
                    }
                    Err(_) => {}
                }
            }
            _ => {}
        }
    }

    fn visit_mut_prop(&mut self, prop: &mut Prop) {
        match prop {
            Prop::Shorthand(i) => {
                let mut renamed = i.clone();
                match self.rename_ident(&mut renamed) {
                    Ok(..) => {
                        *prop = Prop::KeyValue(KeyValueProp {
                            key: PropName::Ident(Ident {
                                // clear mark
                                span: i.span.with_ctxt(SyntaxContext::empty()),
                                ..i.clone()
                            }),
                            value: Box::new(Expr::Ident(renamed)),
                        })
                    }
                    Err(..) => {}
                }
            }
            _ => prop.visit_mut_children_with(self),
        }
    }

    fn visit_mut_prop_name(&mut self, n: &mut PropName) {
        match n {
            PropName::Computed(c) => c.visit_mut_with(self),
            _ => {}
        }
    }
}

struct VarFolder<'a, 'b> {
    orig: &'a mut Operator<'b>,
    renamed: &'a mut Vec<ExportSpecifier>,
}

impl VisitMut for VarFolder<'_, '_> {
    noop_visit_mut_type!();

    #[inline]
    fn visit_mut_expr(&mut self, _: &mut Expr) {}

    fn visit_mut_ident(&mut self, i: &mut Ident) {
        let orig = i.clone();
        match self.orig.rename_ident(i) {
            Ok(..) => {
                self.renamed
                    .push(ExportSpecifier::Named(ExportNamedSpecifier {
                        span: i.span,
                        exported: Some(orig),
                        orig: i.clone(),
                    }));
            }
            Err(..) => {}
        }
    }
}

impl<'a> Operator<'a> {
    /// Returns `Ok(renamed_ident)` if ident should be renamed.
    fn rename_ident(&mut self, ident: &mut Ident) -> Result<(), ()> {
        if let Some(sym) = self.0.rename.get(&ident.to_id()) {
            ident.span = ident.span.with_ctxt(SyntaxContext::empty());
            ident.sym = sym.clone();
            return Ok(());
        }

        Err(())
    }
}
