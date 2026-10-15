//! Enum initializer rewriting and runtime object emission.

use std::{borrow::Borrow, iter};

use rustc_hash::FxHashSet;
use swc_atoms::Wtf8Atom;
use swc_common::{source_map::PURE_SP, Span, SyntaxContext, DUMMY_SP};
use swc_ecma_ast::*;
use swc_ecma_utils::{ExprFactory, QueryRef, RefRewriter};
use swc_ecma_visit::VisitMutWith;

use super::{FoldedDecl, InitArg, Transform};
use crate::{
    shared::enum_member_name,
    ts_enum::{EnumValueComputer, EvalCtx, TsEnumRecordKey, TsEnumRecordValue},
    utils::Factory,
};

impl Transform<'_> {
    pub(super) fn transform_ts_enum(
        &mut self,
        ts_enum: TsEnumDecl,
        is_first: bool,
        is_export: bool,
    ) -> FoldedDecl {
        let TsEnumDecl {
            span,
            declare,
            is_const,
            id,
            members,
        } = ts_enum;

        debug_assert!(!declare);

        let ts_enum_safe_remove = !self.verbatim_module_syntax
            && is_const
            && !is_export
            && !self.semantic.exported_binding.contains_key(&id.to_id());

        let member_names = self
            .semantic
            .enum_record
            .keys()
            .filter(|k| k.enum_id == id.to_id())
            .map(|k| k.member_name.clone())
            .collect();

        let enum_computer = EnumValueComputer {
            enum_id: &id.to_id(),
            unresolved_ctxt: self.unresolved_ctxt,
            record: &self.semantic.enum_record,
            const_vars: &self.semantic.const_vars,
            const_enum_only: None,
            ambient_record: &self.semantic.ambient_enum_record,
            ambient_const_enum_only: None,
        };

        let member_list: Vec<_> = members
            .into_iter()
            .map(|m| {
                let span = m.span;
                let name = enum_member_name(&m.id);

                let key = TsEnumRecordKey {
                    enum_id: id.to_id(),
                    member_name: name.clone(),
                };

                let mut value = self.semantic.enum_record.get(&key).unwrap().clone();

                if matches!(value, TsEnumRecordValue::Opaque(..)) {
                    if let Some(init) = m.init {
                        // Recompute from the original initializer so enum member
                        // references can be rewritten to runtime property
                        // accesses. Implicit Flow enum members do not have an
                        // initializer, so keep the semantic value as-is.
                        let mut recomputed = enum_computer.compute(init, EvalCtx::RECOMPUTE);
                        if let TsEnumRecordValue::Opaque(expr) = &mut recomputed {
                            expr.visit_mut_with(&mut RefRewriter {
                                query: EnumMemberRefQuery {
                                    enum_id: &id.to_id(),
                                    member_names: &member_names,
                                    unresolved_ctxt: self.unresolved_ctxt,
                                },
                            });
                        }
                        value = recomputed;
                    }
                }

                EnumMemberItem { span, name, value }
            })
            .filter(|m| !ts_enum_safe_remove || !m.is_const())
            .collect();

        if member_list.is_empty() && is_const {
            return FoldedDecl::Empty;
        }

        let opaque = member_list
            .iter()
            .any(|item| matches!(item.value, TsEnumRecordValue::Opaque(..)));

        let stmts = member_list
            .into_iter()
            .filter(|item| !ts_enum_safe_remove || !item.is_const())
            .map(|item| item.build_assign(&id.to_id()));

        let namespace_export = self.namespace_id.is_some() && is_export;
        let iife = !is_first || namespace_export;

        let body = if !iife {
            let return_stmt: Stmt = ReturnStmt {
                arg: Some(id.clone().into()),
                ..Default::default()
            }
            .into();

            let stmts = stmts.chain(iter::once(return_stmt)).collect();

            BlockStmt {
                stmts,
                ..Default::default()
            }
        } else {
            BlockStmt {
                stmts: stmts.collect(),
                ..Default::default()
            }
        };

        let var_kind = if is_export || id.ctxt == self.top_level_ctxt {
            VarDeclKind::Var
        } else {
            VarDeclKind::Let
        };

        let init_arg = 'init_arg: {
            let init_arg = InitArg {
                id: &id,
                namespace_id: self.namespace_id.as_ref().filter(|_| is_export),
            };
            if !is_first {
                break 'init_arg init_arg.get();
            }

            if namespace_export {
                break 'init_arg init_arg.or_assign_empty();
            }

            if is_export || var_kind == VarDeclKind::Let {
                InitArg::empty()
            } else {
                init_arg.or_empty()
            }
        };

        let expr = Factory::function(vec![id.clone().into()], body).as_call(
            if iife || opaque { DUMMY_SP } else { PURE_SP },
            vec![init_arg],
        );

        if iife {
            FoldedDecl::Expr(
                ExprStmt {
                    span,
                    expr: expr.into(),
                }
                .into(),
            )
        } else {
            let var_declarator = VarDeclarator {
                span,
                name: id.into(),
                init: Some(expr.into()),
                definite: false,
            };

            FoldedDecl::Decl(
                VarDecl {
                    span,
                    kind: var_kind,
                    decls: vec![var_declarator],
                    ..Default::default()
                }
                .into(),
            )
        }
    }
}

struct EnumMemberRefQuery<'a> {
    enum_id: &'a Id,
    member_names: &'a FxHashSet<Wtf8Atom>,
    unresolved_ctxt: SyntaxContext,
}

impl QueryRef for EnumMemberRefQuery<'_> {
    fn query_ref(&self, ident: &Ident) -> Option<Box<Expr>> {
        if ident.ctxt == self.unresolved_ctxt && self.member_names.contains(ident.sym.borrow()) {
            Some(
                self.enum_id
                    .clone()
                    .make_member(ident.clone().into())
                    .into(),
            )
        } else {
            None
        }
    }

    fn query_lhs(&self, ident: &Ident) -> Option<Box<Expr>> {
        self.query_ref(ident)
    }

    fn query_jsx(&self, ident: &Ident) -> Option<JSXElementName> {
        if ident.ctxt == self.unresolved_ctxt && self.member_names.contains(ident.sym.borrow()) {
            Some(
                JSXMemberExpr {
                    span: DUMMY_SP,
                    obj: JSXObject::Ident(self.enum_id.clone().into()),
                    prop: ident.clone().into(),
                }
                .into(),
            )
        } else {
            None
        }
    }
}

struct EnumMemberItem {
    span: Span,
    name: Wtf8Atom,
    value: TsEnumRecordValue,
}

impl EnumMemberItem {
    fn is_const(&self) -> bool {
        self.value.is_const()
    }

    fn build_assign(self, enum_id: &Id) -> Stmt {
        let is_string = self.value.is_string();
        let value: Expr = self.value.into();
        let name: Expr = Str::from(self.name).into();

        let inner_assign = value.make_assign_to(
            op!("="),
            Ident::from(enum_id.clone())
                .computed_member(name.clone())
                .into(),
        );

        let outer_assign = if is_string {
            inner_assign
        } else {
            name.make_assign_to(
                op!("="),
                Ident::from(enum_id.clone())
                    .computed_member(inner_assign)
                    .into(),
            )
        };

        ExprStmt {
            span: self.span,
            expr: outer_assign.into(),
        }
        .into()
    }
}
