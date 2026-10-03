//! Enum initializer rewriting and runtime object emission.

use std::iter;

use rustc_hash::FxHashMap;
use swc_atoms::Wtf8Atom;
use swc_common::{source_map::PURE_SP, Mark, Span, SyntaxContext, DUMMY_SP};
use swc_ecma_ast::*;
use swc_ecma_utils::{
    ts_bindings::{TsBindings, TsContainerId, TsMemberId},
    ExprFactory, QueryRef, RefRewriter,
};
use swc_ecma_visit::VisitMutWith;

use super::{ContainerContext, FoldedDecl, InitArg, Transform};
use crate::{
    semantic::{EnumDeclaration, EnumInitializer, EnumValue},
    shared::enum_member_name,
    utils::Factory,
};

/// State selected while visiting the initializer and consumed by lowering.
pub(super) struct EnumEmission<'a> {
    object: Id,
    declaration: &'a EnumDeclaration,
}

impl<'a> Transform<'a> {
    pub(super) fn visit_enum(&mut self, node: &mut TsEnumDecl) {
        let declaration = self
            .semantic
            .enums
            .declaration(&self.semantic.bindings, node)
            .expect("every retained enum declaration must have pre-erasure semantic facts");
        // The emitted IIFE parameter is a JS binding of its own. Sharing the
        // source enum's ID makes compressor inlining merge unrelated scopes.
        let object = (
            node.id.sym.clone(),
            SyntaxContext::empty().apply_mark(Mark::new()),
        );
        let previous_initializer = self.enum_initializer.replace(declaration.initializer);
        // An enum IIFE has its own object parameter, but contributes no local
        // enum binding to the surrounding namespace body's emitted scope.
        self.container_contexts.push(ContainerContext {
            container: declaration.container,
            object: object.clone(),
            locals: FxHashMap::default(),
        });
        node.members.visit_mut_with(self);
        self.enum_initializer = previous_initializer;
        self.container_contexts.pop();
        // Nested declarations consume their own state before this visit ends.
        // The facts remain borrowed from immutable pre-erasure semantic storage.
        self.enum_emissions.push(EnumEmission {
            object,
            declaration,
        });
    }
}

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

        let EnumEmission {
            object,
            declaration,
        } = self
            .enum_emissions
            .pop()
            .expect("enum lowering must consume the state selected by its preceding visit");
        if self
            .semantic
            .enums
            .can_erase(declaration.container, self.verbatim_module_syntax)
            && !is_export
            && !self.semantic.exported_binding.contains_key(&id.to_id())
        {
            return FoldedDecl::Empty;
        }

        let member_list: Vec<_> = members
            .into_iter()
            .enumerate()
            .map(|(index, m)| {
                let span = m.span;
                let name = enum_member_name(&m.id);

                let value = declaration.values.get(index).unwrap_or(&EnumValue::Unknown);
                let is_string = value.is_string();
                let is_constant = value.is_constant();
                let expression = value
                    .literal()
                    .map(Box::new)
                    .or(m.init)
                    .unwrap_or_else(|| Expr::undefined(DUMMY_SP));
                let mut expression = expression;
                if !is_constant {
                    expression.visit_mut_with(&mut RefRewriter {
                        query: EnumMemberRefQuery {
                            enum_id: &object,
                            bindings: &self.semantic.bindings,
                            enums: &self.semantic.enums,
                            initializer: declaration.initializer,
                            mutable: self.ts_enum_is_mutable,
                            verbatim: self.verbatim_module_syntax,
                            owner: declaration.container,
                            unresolved_ctxt: self.unresolved_ctxt,
                        },
                    });
                }
                EnumMemberItem {
                    span,
                    name,
                    expression,
                    is_string,
                    is_constant,
                }
            })
            .collect();

        if member_list.is_empty() && is_const {
            return FoldedDecl::Empty;
        }

        let opaque = member_list.iter().any(|item| !item.is_constant);

        let stmts = member_list
            .into_iter()
            .map(|item| item.build_assign(&object));

        let namespace_export = self.namespace_id.is_some() && is_export;
        let iife = !is_first || namespace_export;

        let body = if !iife {
            let return_stmt: Stmt = ReturnStmt {
                arg: Some(object.clone().into()),
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

        let expr = Factory::function(vec![Ident::from(object).into()], body).as_call(
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

impl Transform<'_> {
    pub(super) fn enter_expr_for_inline_enum(&mut self, node: &mut Expr) {
        if self.is_lhs {
            return;
        }
        if let Some(value) = self
            .semantic
            .enums
            .inline_value(
                &self.semantic.bindings,
                node,
                self.ts_enum_is_mutable,
                self.verbatim_module_syntax,
                self.enum_initializer,
            )
            .and_then(EnumValue::literal)
        {
            *node = value;
        }
    }
}

struct EnumMemberRefQuery<'a> {
    enum_id: &'a Id,
    bindings: &'a TsBindings,
    enums: &'a crate::semantic::EnumFacts,
    initializer: EnumInitializer,
    mutable: bool,
    verbatim: bool,
    owner: TsContainerId,
    unresolved_ctxt: SyntaxContext,
}

impl QueryRef for EnumMemberRefQuery<'_> {
    fn query_ref(&self, ident: &Ident) -> Option<Box<Expr>> {
        if let Some(member) = self.member(ident) {
            if !self.verbatim {
                if let Some(value) = self
                    .enums
                    .member_value(
                        self.bindings,
                        member,
                        self.mutable,
                        ident.span,
                        Some(self.initializer),
                    )
                    .and_then(EnumValue::literal)
                {
                    return Some(Box::new(value));
                }
            }
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
        self.member(ident).map(|_| {
            self.enum_id
                .clone()
                .make_member(ident.clone().into())
                .into()
        })
    }

    fn query_jsx(&self, ident: &Ident) -> Option<JSXElementName> {
        if self.member(ident).is_some() {
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

impl EnumMemberRefQuery<'_> {
    fn member(&self, ident: &Ident) -> Option<TsMemberId> {
        if ident.ctxt != self.unresolved_ctxt {
            return None;
        }
        self.bindings
            .named_member(self.owner, &ident.sym.clone().into())
            .filter(|member| self.bindings.member(*member).is_enum_member())
    }
}

struct EnumMemberItem {
    span: Span,
    name: Wtf8Atom,
    expression: Box<Expr>,
    is_string: bool,
    is_constant: bool,
}

impl EnumMemberItem {
    fn build_assign(self, enum_id: &Id) -> Stmt {
        let value = *self.expression;
        let name: Expr = Str::from(self.name).into();

        let inner_assign = value.make_assign_to(
            op!("="),
            Ident::from(enum_id.clone())
                .computed_member(name.clone())
                .into(),
        );

        let outer_assign = if self.is_string {
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
