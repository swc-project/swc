use super::Analyzer;
use crate::{
    analyzer::util::ResultExt,
    errors::Error,
    id::Id,
    ty::Type,
    validator::{Validate, ValidateWith},
    ValidationResult,
};
use macros::{validator, validator_method};
use std::mem::replace;
use swc_atoms::js_word;
use swc_common::{Span, Spanned, VisitMutWith, DUMMY_SP};
use swc_ecma_ast::*;

// ModuleDecl::ExportNamed(export) => {}
//
// ModuleDecl::ExportAll(export) => unimplemented!("export * from
// 'other-file';"),
//
// ModuleDecl::TsNamespaceExport(ns) =>
// unimplemented!("export namespace"),

impl Analyzer<'_, '_> {
    /// This methods exports unresolved expressions, which depends on
    /// expressions that comes after the expression.
    pub(super) fn handle_pending_exports(&mut self) {
        let pending_exports: Vec<_> = replace(&mut self.pending_exports, Default::default());

        for ((sym, _), mut expr) in pending_exports {
            // TODO: Allow multiple exports with same name.

            debug_assert_eq!(self.info.exports.vars.get(&sym), None);

            let tmp;
            let exported_sym = if sym.as_str() != "default" {
                Some(&sym)
            } else {
                match expr {
                    Expr::Ident(ref i) => {
                        tmp = i.clone().into();
                        Some(&tmp)
                    }
                    _ => None,
                }
            };
            let ty = match exported_sym
                .and_then(|exported_sym| self.scope.types.remove(&exported_sym))
            {
                Some(export) => {
                    self.info
                        .exports
                        .types
                        .entry(sym)
                        .or_default()
                        .extend(export);
                }
                None => match expr.validate_with(self) {
                    Ok(ty) => {
                        self.info.exports.types.entry(sym).or_default().push(ty);
                    }
                    Err(err) => {
                        self.info.errors.push(err);
                    }
                },
            };
        }

        assert_eq!(self.pending_exports, vec![]);

        if self.info.exports.types.is_empty() && self.info.exports.vars.is_empty() {
            self.info
                .exports
                .vars
                .extend(self.scope.vars.drain().map(|(k, v)| {
                    (
                        k,
                        v.ty.map(|ty| ty.freeze())
                            .unwrap_or_else(|| Type::any(DUMMY_SP)),
                    )
                }));
            self.info.exports.types.extend(
                self.scope
                    .types
                    .drain()
                    .map(|(k, v)| (k, v.into_iter().map(|v| v.freeze()).collect())),
            );
        }
    }

    pub(super) fn export_default_expr(&mut self, expr: &mut Expr) {
        assert_eq!(
            self.info.exports.vars.get(&Id::word(js_word!("default"))),
            None,
            "A module can export only one item as default"
        );

        let ty = match self.validate(expr) {
            Ok(ty) => ty,
            Err(err) => {
                match err {
                    // Handle hoisting. This allows
                    //
                    // export = React
                    // declare namespace React {}
                    Error::UndefinedSymbol { .. } => {
                        self.pending_exports
                            .push(((Id::word(js_word!("default")), expr.span()), expr.clone()));
                        return;
                    }
                    _ => {}
                }
                self.info.errors.push(err);
                return;
            }
        };
        self.info
            .exports
            .vars
            .insert(Id::word(js_word!("default")), ty);
    }
}

#[validator]
impl Validate<ExportDecl> for Analyzer<'_, '_> {
    type Output = ValidationResult<()>;

    fn validate(&mut self, export: &mut ExportDecl) -> Self::Output {
        let span = export.span;

        match export.decl {
            Decl::Fn(ref mut f) => {
                f.visit_mut_with(self);
                self.export(f.span(), f.ident.clone().into(), None)
            }
            Decl::TsInterface(ref mut i) => {
                i.visit_mut_with(self);

                self.export(i.span(), i.id.clone().into(), None)
            }

            Decl::Class(ref mut c) => {
                c.visit_mut_with(self);
                self.export(c.span(), c.ident.clone().into(), None)
            }
            Decl::Var(ref mut var) => {
                // unimplemented!("export var Foo = a;")
                for decl in &mut var.decls {
                    let res = self.declare_vars_inner(var.kind, &mut decl.name, true);
                    match res {
                        Ok(..) => {}
                        Err(err) => self.info.errors.push(err),
                    }
                }
            }
            Decl::TsEnum(ref mut e) => {
                let span = e.span();

                let ty = e
                    .validate_with(self)
                    .store(&mut self.info.errors)
                    .map(Type::from);

                self.info
                    .exports
                    .types
                    .entry(e.id.clone().into())
                    .or_default()
                    .push(ty.unwrap_or_else(|| Type::any(span)));
            }
            Decl::TsModule(..) => unimplemented!("export module "),
            Decl::TsTypeAlias(ref mut decl) => {
                decl.visit_mut_with(self);
                // export type Foo = 'a' | 'b';
                // export type Foo = {};

                // TODO: Handle type parameters.

                self.export(span, decl.id.clone().into(), None)
            }
        }

        Ok(())
    }
}

#[validator]
impl Validate<ExportDefaultDecl> for Analyzer<'_, '_> {
    type Output = ValidationResult<()>;

    fn validate(&mut self, export: &mut ExportDefaultDecl) -> Self::Output {
        let span = export.span();

        match export.decl {
            DefaultDecl::Fn(ref mut f) => {
                let i = f
                    .ident
                    .as_ref()
                    .map(|v| v.into())
                    .unwrap_or_else(|| Id::word(js_word!("default")));
                let fn_ty = match f.function.validate_with(self) {
                    Ok(ty) => ty,
                    Err(err) => {
                        self.info.errors.push(err);
                        return Ok(());
                    }
                };
                self.register_type(i.clone(), fn_ty.clone().into())
                    .store(&mut self.info.errors);
                if let Some(ref i) = f.ident {
                    self.override_var(VarDeclKind::Var, i.into(), fn_ty.into())
                        .store(&mut self.info.errors);
                }

                self.export(f.span(), Id::word(js_word!("default")), Some(i))
            }
            DefaultDecl::Class(ref c) => {
                let c = c
                    .ident
                    .as_ref()
                    .map(|v| v.into())
                    .unwrap_or_else(|| Id::word(js_word!("default")));
                export.visit_mut_children(self);

                // TODO: Register type

                self.export(span, Id::word(js_word!("default")), Some(c));
            }
            DefaultDecl::TsInterfaceDecl(ref i) => {
                let i = i.id.clone().into();
                export.visit_mut_children(self);

                // TODO: Register type

                self.export(span, Id::word(js_word!("default")), Some(i))
            }
        };

        Ok(())
    }
}

impl Analyzer<'_, '_> {
    /// Exports a type.
    ///
    /// `scope.regsiter_type` should be called before calling this method.
    ///
    ///
    /// Note: We don't freeze types at here because doing so may prevent proper
    /// finalization.
    #[validator_method]
    fn export(&mut self, span: Span, name: Id, orig_name: Option<Id>) {
        let orig_name = orig_name.unwrap_or_else(|| name.clone());

        let ty = match self.find_type(&orig_name) {
            Some(ty) => ty,
            None => unreachable!(".register_type() should be called before calling .export()"),
        };

        let iter = ty
            .into_iter()
            .cloned()
            .map(|v| v.freeze())
            .collect::<Vec<_>>();

        self.info
            .exports
            .types
            .entry(name)
            .or_default()
            .extend(iter);
    }

    /// Exports a variable.
    fn export_expr(&mut self, _: Id, e: &Expr) {
        unimplemented!("export_expr")
    }
}

/// Done
#[validator]
impl Validate<TsExportAssignment> for Analyzer<'_, '_> {
    type Output = ValidationResult<()>;

    fn validate(&mut self, s: &mut TsExportAssignment) -> Self::Output {
        self.export_expr(Id::word(js_word!("default")), &s.expr);

        Ok(())
    }
}

/// Done
#[validator]
impl Validate<ExportDefaultExpr> for Analyzer<'_, '_> {
    type Output = ValidationResult<()>;

    fn validate(&mut self, s: &mut ExportDefaultExpr) -> Self::Output {
        self.export_expr(Id::word(js_word!("default")), &s.expr);

        Ok(())
    }
}
