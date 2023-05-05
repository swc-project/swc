use rustc_hash::FxHashSet;
use swc_atoms::{js_word, JsWord};
use swc_common::{
    collections::{AHashMap, AHashSet},
    Mark, Span, SyntaxContext,
};
use swc_ecma_ast::*;
use swc_ecma_utils::{find_pat_ids, IsDirective};
use swc_ecma_visit::{
    as_folder, noop_visit_mut_type, visit_mut_obj_and_computed, Fold, VisitMut, VisitMutWith,
};
use tracing::{debug, span, Level};

use crate::scope::{DeclKind, IdentType, ScopeKind};

#[cfg(test)]
mod tests;

const LOG: bool = false && cfg!(debug_assertions);

/// See [Ident] for know how does swc manages identifiers.
///
/// # When to run
///
/// The resolver expects 'clean' ast. You can get clean ast by parsing, or by
/// removing all syntax context in ast nodes.
///
/// # What does it do
///
/// Firstly all scopes (fn, block) has it's own SyntaxContext.
/// Resolver visits all identifiers in module, and look for binding identifies
/// in the scope. Those identifiers now have the SyntaxContext of scope (fn,
/// block). While doing so, resolver tries to resolve normal identifiers (no
/// hygiene info) as a reference to identifier of scope. If the resolver find
/// suitable variable, the identifier reference will have same context as the
/// variable.
///
///
/// # Panics
///
/// `top_level_mark` should not be root.
///
/// # Example
///
/// ```js
/// let a = 1;
/// {
///     let a = 2;
///     use(a);
/// }
/// use(a)
/// ```
///
/// resolver does
///
/// 1.  Define `a` with top level context.
///
/// 2.  Found a block, so visit block with a new syntax context.
///
/// 3. Defined `a` with syntax context of the block statement.
////
/// 4. Found usage of `a`, and determines that it's reference to `a` in the
/// block. So the reference to `a` will have same syntax context as `a` in the
/// block.
///
/// 5. Found usage of `a` (last line), and determines that it's a
/// reference to top-level `a`, and change syntax context of `a` on last line to
/// top-level syntax context.
///
///
/// # Parameters
///
/// ## `unresolved_mark`
///
/// [Mark] applied to unresolved references.
///
/// A pass should accept this [Mark] if it's going to generate a refernce to
/// globals like `require`.
///
/// e.g. `common_js` pass generates calls to `require`, and this should not
/// be shadowed by a declaration named `require` in the same file.
/// So it uses this value.
///
/// ## `top_level_mark`
///
/// [Mark] applied to top-level bindings.
///
/// **NOTE**: This is **not** globals. This is for top level items declared by
/// users.
///
/// A pass should accept this [Mark] if it requires user-defined top-level
/// items.
///
/// e.g. `jsx` pass requires to call `React` imported by the user.
///
/// ```js
/// import React from 'react';
/// ```
///
/// In the code above, `React` has this [Mark]. `jsx` passes need to
/// reference this [Mark], so it accpets this.
///
/// This [Mark] should be used for referencing top-level bindings written by
/// user. If you are going to create a binding, use `private_ident`
/// instead.
///
/// In other words, **this [Mark] should not be used for determining if a
/// variable is top-level.** This is simply a configuration of the `resolver`
/// pass.
///
///
/// ## `typescript`
///
/// Enable this only if you are going to strip types or apply type-aware
/// passes like decorators pass.
///
///
/// # FAQ
///
/// ## Does a pair `(JsWord, SyntaxContext)` always uniquely identifiers a
/// variable binding?
///
/// Yes, but multiple variables can have the exactly same name.
///
/// In the code below,
///
/// ```js
/// var a = 1, a = 2;
/// ```
///
/// both of them have the same name, so the `(JsWord, SyntaxContext)` pair will
/// be also identical.
pub fn resolver(
    unresolved_mark: Mark,
    top_level_mark: Mark,
    typescript: bool,
) -> impl 'static + Fold + VisitMut {
    assert_ne!(
        unresolved_mark,
        Mark::root(),
        "Marker provided to resolver should not be the root mark"
    );

    let _ = SyntaxContext::empty().apply_mark(unresolved_mark);
    let _ = SyntaxContext::empty().apply_mark(top_level_mark);

    as_folder(Resolver {
        current: Scope::new(ScopeKind::Fn, top_level_mark, None),
        ident_type: IdentType::Ref,
        in_type: false,
        in_ts_module: false,
        decl_kind: DeclKind::Lexical,
        strict_mode: false,
        config: InnerConfig {
            handle_types: typescript,
            unresolved_mark,
            top_level_mark,
        },
    })
}

#[derive(Debug, Clone)]
struct Scope<'a> {
    /// Parent scope of the scope
    parent: Option<&'a Scope<'a>>,

    /// Kind of the scope.
    kind: ScopeKind,

    /// [Mark] of the current scope.
    mark: Mark,

    /// All declarations in the scope
    declared_symbols: AHashMap<JsWord, DeclKind>,

    /// All types declared in the scope
    declared_types: AHashSet<JsWord>,
}

impl<'a> Scope<'a> {
    pub fn new(kind: ScopeKind, mark: Mark, parent: Option<&'a Scope<'a>>) -> Self {
        Scope {
            parent,
            kind,
            mark,
            declared_symbols: Default::default(),
            declared_types: Default::default(),
        }
    }

    fn is_declared(&self, symbol: &JsWord) -> Option<&DeclKind> {
        self.declared_symbols
            .get(symbol)
            .or_else(|| self.parent?.is_declared(symbol))
    }
}

/// # Phases
///
/// ## Hoisting phase
///
/// ## Resolving phase
struct Resolver<'a> {
    current: Scope<'a>,
    ident_type: IdentType,
    in_type: bool,
    in_ts_module: bool,
    decl_kind: DeclKind,
    strict_mode: bool,

    config: InnerConfig,
}

#[derive(Debug, Clone, Copy)]
struct InnerConfig {
    handle_types: bool,
    unresolved_mark: Mark,
    top_level_mark: Mark,
}

impl<'a> Resolver<'a> {
    #[cfg(test)]
    fn new(current: Scope<'a>, config: InnerConfig) -> Self {
        Resolver {
            current,
            ident_type: IdentType::Ref,
            in_type: false,
            in_ts_module: false,
            config,
            decl_kind: DeclKind::Lexical,
            strict_mode: false,
        }
    }

    fn with_child<F>(&self, kind: ScopeKind, op: F)
    where
        F: for<'aa> FnOnce(&mut Resolver<'aa>),
    {
        let mut child = Resolver {
            current: Scope::new(
                kind,
                Mark::fresh(self.config.top_level_mark),
                Some(&self.current),
            ),
            ident_type: IdentType::Ref,
            config: self.config,
            in_type: self.in_type,
            in_ts_module: self.in_ts_module,
            decl_kind: self.decl_kind,
            strict_mode: self.strict_mode,
        };

        op(&mut child);
    }

    fn visit_mut_stmt_within_child_scope(&mut self, s: &mut Stmt) {
        self.with_child(ScopeKind::Block, |child| match s {
            Stmt::Block(s) => {
                child.mark_block(&mut s.span);
                s.visit_mut_children_with(child);
            }
            _ => s.visit_mut_with(child),
        });
    }

    /// Returns a [Mark] for an identifier reference.
    fn mark_for_ref(&self, sym: &JsWord) -> Option<Mark> {
        self.mark_for_ref_inner(sym, false)
    }

    fn mark_for_ref_inner(&self, sym: &JsWord, stop_an_fn_scope: bool) -> Option<Mark> {
        // NaN always points the globals
        if *sym == js_word!("NaN") {
            return Some(self.config.unresolved_mark);
        }

        if self.config.handle_types && self.in_type {
            let mut mark = self.current.mark;
            let mut scope = Some(&self.current);

            while let Some(cur) = scope {
                // if cur.declared_types.contains(sym) ||
                // cur.hoisted_symbols.borrow().contains(sym) {
                if cur.declared_types.contains(sym) {
                    if mark == Mark::root() {
                        break;
                    }
                    return Some(mark);
                }

                if cur.kind == ScopeKind::Fn && stop_an_fn_scope {
                    return None;
                }

                if let Some(parent) = &cur.parent {
                    mark = parent.mark;
                }
                scope = cur.parent;
            }
        }

        let mut mark = self.current.mark;
        let mut scope = Some(&self.current);

        while let Some(cur) = scope {
            if cur.declared_symbols.contains_key(sym) {
                if mark == Mark::root() {
                    return None;
                }
                return Some(mark);
            }

            if cur.kind == ScopeKind::Fn && stop_an_fn_scope {
                return None;
            }

            if let Some(parent) = &cur.parent {
                mark = parent.mark;
            }
            scope = cur.parent;
        }

        None
    }

    /// Modifies a binding identifier.
    fn modify(&mut self, ident: &mut Ident, kind: DeclKind) {
        if cfg!(debug_assertions) && LOG {
            debug!(
                "Binding (type = {}) {}{:?} {:?}",
                self.in_type,
                ident.sym,
                ident.span.ctxt(),
                kind
            );
        }

        if ident.span.ctxt() != SyntaxContext::empty() {
            return;
        }

        if self.in_type {
            self.current.declared_types.insert(ident.sym.clone());
            let mark = self.current.mark;

            ident.span = if mark == Mark::root() {
                ident.span
            } else {
                let span = ident.span.apply_mark(mark);
                if cfg!(debug_assertions) && LOG {
                    debug!("\t-> {:?}", span.ctxt());
                }
                span
            };
            return;
        }

        let mark = self.current.mark;

        self.current
            .declared_symbols
            .insert(ident.sym.clone(), kind);

        ident.span = if mark == Mark::root() {
            ident.span
        } else {
            let span = ident.span.apply_mark(mark);
            if cfg!(debug_assertions) && LOG {
                debug!("\t-> {:?}", span.ctxt());
            }
            span
        };
    }

    fn mark_block(&mut self, span: &mut Span) {
        if span.ctxt() != SyntaxContext::empty() {
            return;
        }

        let mark = self.current.mark;

        if mark != Mark::root() {
            *span = span.apply_mark(mark)
        }
    }

    fn try_resolving_as_type(&mut self, i: &mut Ident) {
        if i.span.ctxt.outer() == self.config.unresolved_mark {
            i.span.ctxt = SyntaxContext::empty()
        }

        self.in_type = true;
        i.visit_mut_with(self);
        self.in_type = false;
    }
}

macro_rules! typed {
    ($name:ident, $T:ty) => {
        fn $name(&mut self, node: &mut $T) {
            if self.config.handle_types {
                node.visit_mut_children_with(self)
            }
        }
    };
}

macro_rules! typed_ref {
    ($name:ident, $T:ty) => {
        fn $name(&mut self, node: &mut $T) {
            if self.config.handle_types {
                let in_type = self.in_type;
                let ident_type = self.ident_type;
                self.in_type = true;
                node.visit_mut_children_with(self);
                self.ident_type = ident_type;
                self.in_type = in_type;
            }
        }
    };
}

macro_rules! typed_ref_init {
    ($name:ident, $T:ty) => {
        fn $name(&mut self, node: &mut $T) {
            if self.config.handle_types {
                let in_type = self.in_type;
                let ident_type = self.ident_type;
                self.ident_type = IdentType::Ref;
                self.in_type = true;
                node.visit_mut_children_with(self);
                self.ident_type = ident_type;
                self.in_type = in_type;
            }
        }
    };
}

macro_rules! typed_decl {
    ($name:ident, $T:ty) => {
        fn $name(&mut self, node: &mut $T) {
            if self.config.handle_types {
                let in_type = self.in_type;
                self.ident_type = IdentType::Binding;
                self.in_type = true;
                node.visit_mut_children_with(self);
                self.in_type = in_type;
            }
        }
    };
}

macro_rules! noop {
    ($name:ident, $T:ty) => {
        #[inline]
        fn $name(&mut self, _: &mut $T) {}
    };
}

impl<'a> VisitMut for Resolver<'a> {
    noop!(visit_mut_accessibility, Accessibility);

    noop!(visit_mut_true_plus_minus, TruePlusMinus);

    noop!(visit_mut_ts_keyword_type, TsKeywordType);

    noop!(visit_mut_ts_keyword_type_kind, TsKeywordTypeKind);

    noop!(visit_mut_ts_type_operator_op, TsTypeOperatorOp);

    noop!(visit_mut_ts_enum_member_id, TsEnumMemberId);

    noop!(visit_mut_ts_external_module_ref, TsExternalModuleRef);

    noop!(visit_mut_ts_module_name, TsModuleName);

    noop!(visit_mut_ts_this_type, TsThisType);

    typed_ref!(visit_mut_ts_array_type, TsArrayType);

    typed_ref!(visit_mut_ts_conditional_type, TsConditionalType);

    typed_ref_init!(
        visit_mut_ts_type_param_instantiation,
        TsTypeParamInstantiation
    );

    typed_ref!(visit_mut_ts_type_query, TsTypeQuery);

    typed_ref!(visit_mut_ts_type_query_expr, TsTypeQueryExpr);

    typed_ref!(visit_mut_ts_type_operator, TsTypeOperator);

    typed_ref_init!(visit_mut_ts_type, TsType);

    typed_ref_init!(visit_mut_ts_type_ann, TsTypeAnn);

    typed!(
        visit_mut_ts_union_or_intersection_type,
        TsUnionOrIntersectionType
    );

    typed!(visit_mut_ts_fn_or_constructor_type, TsFnOrConstructorType);

    typed_ref!(visit_mut_ts_union_type, TsUnionType);

    typed_ref!(visit_mut_ts_infer_type, TsInferType);

    typed_ref!(visit_mut_ts_import_type, TsImportType);

    typed_ref!(visit_mut_ts_tuple_type, TsTupleType);

    typed_ref!(visit_mut_ts_intersection_type, TsIntersectionType);

    typed_ref!(visit_mut_ts_type_ref, TsTypeRef);

    typed_decl!(visit_mut_ts_type_param_decl, TsTypeParamDecl);

    typed!(visit_mut_ts_fn_param, TsFnParam);

    typed!(visit_mut_ts_indexed_access_type, TsIndexedAccessType);

    typed!(visit_mut_ts_index_signature, TsIndexSignature);

    typed!(visit_mut_ts_interface_body, TsInterfaceBody);

    typed!(visit_mut_ts_parenthesized_type, TsParenthesizedType);

    typed!(visit_mut_ts_type_lit, TsTypeLit);

    typed!(visit_mut_ts_type_element, TsTypeElement);

    typed!(visit_mut_ts_optional_type, TsOptionalType);

    typed!(visit_mut_ts_rest_type, TsRestType);

    typed!(visit_mut_ts_type_predicate, TsTypePredicate);

    typed_ref!(visit_mut_ts_this_type_or_ident, TsThisTypeOrIdent);

    visit_mut_obj_and_computed!();

    // TODO: How should I handle this?
    typed!(visit_mut_ts_namespace_export_decl, TsNamespaceExportDecl);

    fn visit_mut_arrow_expr(&mut self, e: &mut ArrowExpr) {
        self.with_child(ScopeKind::Fn, |child| {
            e.type_params.visit_mut_with(child);

            let old = child.ident_type;
            child.ident_type = IdentType::Binding;
            {
                let params = e
                    .params
                    .iter()
                    .filter(|p| !p.is_rest())
                    .flat_map(find_pat_ids)
                    .collect::<Vec<Id>>();

                for id in params {
                    child.current.declared_symbols.insert(id.0, DeclKind::Param);
                }
            }
            e.params.visit_mut_with(child);
            child.ident_type = old;

            match &mut *e.body {
                BlockStmtOrExpr::BlockStmt(s) => {
                    child.mark_block(&mut s.span);

                    let old_strict_mode = child.strict_mode;
                    child.strict_mode = s
                        .stmts
                        .first()
                        .map(|stmt| stmt.is_use_strict())
                        .unwrap_or(false);
                    // Prevent creating new scope.
                    s.stmts.visit_mut_with(child);
                    child.strict_mode = old_strict_mode;
                }
                BlockStmtOrExpr::Expr(e) => e.visit_mut_with(child),
            }

            e.return_type.visit_mut_with(child);
        });
    }

    fn visit_mut_assign_pat(&mut self, node: &mut AssignPat) {
        // visit the type first so that it doesn't resolve any
        // identifiers from the others
        node.type_ann.visit_mut_with(self);
        node.left.visit_mut_with(self);
        node.right.visit_mut_with(self);
    }

    fn visit_mut_binding_ident(&mut self, i: &mut BindingIdent) {
        let ident_type = self.ident_type;
        let in_type = self.in_type;

        self.ident_type = IdentType::Ref;
        i.type_ann.visit_mut_with(self);

        self.ident_type = ident_type;
        i.id.visit_mut_with(self);

        self.in_type = in_type;
        self.ident_type = ident_type;
    }

    fn visit_mut_block_stmt(&mut self, block: &mut BlockStmt) {
        self.with_child(ScopeKind::Block, |child| {
            child.mark_block(&mut block.span);
            block.visit_mut_children_with(child);
        })
    }

    fn visit_mut_break_stmt(&mut self, s: &mut BreakStmt) {
        let old = self.ident_type;
        self.ident_type = IdentType::Label;
        s.label.visit_mut_with(self);
        self.ident_type = old;
    }

    fn visit_mut_catch_clause(&mut self, c: &mut CatchClause) {
        // Child folder

        self.with_child(ScopeKind::Fn, |child| {
            child.ident_type = IdentType::Binding;
            c.param.visit_mut_with(child);
            child.ident_type = IdentType::Ref;

            child.mark_block(&mut c.body.span);
            c.body.visit_mut_children_with(child);
        });
    }

    fn visit_mut_class(&mut self, c: &mut Class) {
        let old_strict_mode = self.strict_mode;
        self.strict_mode = true;

        let old = self.ident_type;
        self.ident_type = IdentType::Ref;
        c.decorators.visit_mut_with(self);

        self.ident_type = IdentType::Ref;
        c.super_class.visit_mut_with(self);

        self.ident_type = IdentType::Binding;
        c.type_params.visit_mut_with(self);

        self.ident_type = IdentType::Ref;
        c.super_type_params.visit_mut_with(self);

        self.ident_type = IdentType::Ref;
        c.implements.visit_mut_with(self);
        self.ident_type = old;

        c.body.visit_mut_with(self);
        self.strict_mode = old_strict_mode;
    }

    fn visit_mut_class_decl(&mut self, n: &mut ClassDecl) {
        self.modify(&mut n.ident, DeclKind::Lexical);

        n.class.decorators.visit_mut_with(self);

        // Create a child scope. The class name is only accessible within the class.

        self.with_child(ScopeKind::Fn, |child| {
            child.ident_type = IdentType::Ref;

            n.class.visit_mut_with(child);
        });
    }

    fn visit_mut_class_expr(&mut self, n: &mut ClassExpr) {
        // Create a child scope. The class name is only accessible within the class.

        self.with_child(ScopeKind::Fn, |child| {
            child.ident_type = IdentType::Binding;
            n.ident.visit_mut_with(child);
            child.ident_type = IdentType::Ref;

            n.class.visit_mut_with(child);
        });
    }

    fn visit_mut_class_method(&mut self, m: &mut ClassMethod) {
        m.key.visit_mut_with(self);

        for p in m.function.params.iter_mut() {
            p.decorators.visit_mut_with(self);
        }

        self.with_child(ScopeKind::Fn, |child| m.function.visit_mut_with(child));
    }

    fn visit_mut_class_prop(&mut self, p: &mut ClassProp) {
        p.decorators.visit_mut_with(self);

        if let PropName::Computed(key) = &mut p.key {
            let old = self.ident_type;
            self.ident_type = IdentType::Binding;
            key.expr.visit_mut_with(self);
            self.ident_type = old;
        }

        let old = self.ident_type;
        self.ident_type = IdentType::Ref;
        p.value.visit_mut_with(self);
        self.ident_type = old;

        p.type_ann.visit_mut_with(self);
    }

    fn visit_mut_constructor(&mut self, c: &mut Constructor) {
        for p in c.params.iter_mut() {
            match p {
                ParamOrTsParamProp::TsParamProp(p) => {
                    p.decorators.visit_mut_with(self);
                }
                ParamOrTsParamProp::Param(p) => {
                    p.decorators.visit_mut_with(self);
                }
            }
        }

        self.with_child(ScopeKind::Fn, |child| {
            let old = child.ident_type;
            child.ident_type = IdentType::Binding;
            {
                let params = c
                    .params
                    .iter()
                    .filter(|p| match p {
                        ParamOrTsParamProp::TsParamProp(_) => false,
                        ParamOrTsParamProp::Param(p) => !p.pat.is_rest(),
                    })
                    .flat_map(find_pat_ids)
                    .collect::<Vec<Id>>();

                for id in params {
                    child.current.declared_symbols.insert(id.0, DeclKind::Param);
                }
            }
            c.params.visit_mut_with(child);
            child.ident_type = old;

            match &mut c.body {
                Some(body) => {
                    child.mark_block(&mut body.span);
                    body.visit_mut_children_with(child);
                }
                None => {}
            }
        });
    }

    fn visit_mut_continue_stmt(&mut self, s: &mut ContinueStmt) {
        let old = self.ident_type;
        self.ident_type = IdentType::Label;
        s.label.visit_mut_with(self);
        self.ident_type = old;
    }

    fn visit_mut_export_default_decl(&mut self, e: &mut ExportDefaultDecl) {
        // Treat default exported functions and classes as declarations
        // even though they are parsed as expressions.
        match &mut e.decl {
            DefaultDecl::Fn(f) => {
                if f.ident.is_some() {
                    self.with_child(ScopeKind::Fn, |child| {
                        f.function.visit_mut_with(child);
                    });
                } else {
                    f.visit_mut_with(self)
                }
            }
            DefaultDecl::Class(c) => {
                // Skip class expression visitor to treat as a declaration.
                c.class.visit_mut_with(self)
            }
            _ => e.visit_mut_children_with(self),
        }
    }

    fn visit_mut_export_default_expr(&mut self, node: &mut ExportDefaultExpr) {
        node.expr.visit_mut_with(self);

        if self.config.handle_types {
            if let Expr::Ident(i) = &mut *node.expr {
                self.try_resolving_as_type(i);
            }
        }
    }

    fn visit_mut_export_named_specifier(&mut self, e: &mut ExportNamedSpecifier) {
        e.visit_mut_children_with(self);

        if self.config.handle_types {
            match &mut e.orig {
                ModuleExportName::Ident(orig) => {
                    self.try_resolving_as_type(orig);
                }
                ModuleExportName::Str(_) => {}
            }
        }
    }

    fn visit_mut_export_specifier(&mut self, s: &mut ExportSpecifier) {
        let old = self.ident_type;
        self.ident_type = IdentType::Ref;
        s.visit_mut_children_with(self);
        self.ident_type = old;
    }

    fn visit_mut_expr(&mut self, expr: &mut Expr) {
        let _span = if LOG {
            Some(span!(Level::ERROR, "visit_mut_expr").entered())
        } else {
            None
        };

        let old = self.ident_type;
        self.ident_type = IdentType::Ref;
        expr.visit_mut_children_with(self);
        self.ident_type = old;
    }

    fn visit_mut_fn_decl(&mut self, node: &mut FnDecl) {
        // We don't fold ident as Hoister handles this.
        node.function.decorators.visit_mut_with(self);

        self.with_child(ScopeKind::Fn, |child| node.function.visit_mut_with(child));
    }

    fn visit_mut_fn_expr(&mut self, e: &mut FnExpr) {
        e.function.decorators.visit_mut_with(self);

        if let Some(ident) = &mut e.ident {
            self.with_child(ScopeKind::Fn, |child| {
                child.modify(ident, DeclKind::Function);
                child.with_child(ScopeKind::Fn, |child| {
                    e.function.visit_mut_with(child);
                });
            });
        } else {
            self.with_child(ScopeKind::Fn, |child| {
                e.function.visit_mut_with(child);
            });
        }
    }

    fn visit_mut_for_in_stmt(&mut self, n: &mut ForInStmt) {
        self.with_child(ScopeKind::Block, |child| {
            n.left.visit_mut_with(child);
            n.right.visit_mut_with(child);

            child.visit_mut_stmt_within_child_scope(&mut n.body);
        });
    }

    fn visit_mut_for_of_stmt(&mut self, n: &mut ForOfStmt) {
        self.with_child(ScopeKind::Block, |child| {
            n.left.visit_mut_with(child);
            n.right.visit_mut_with(child);

            child.visit_mut_stmt_within_child_scope(&mut n.body);
        });
    }

    fn visit_mut_for_stmt(&mut self, n: &mut ForStmt) {
        self.with_child(ScopeKind::Block, |child| {
            child.ident_type = IdentType::Binding;
            n.init.visit_mut_with(child);
            child.ident_type = IdentType::Ref;
            n.test.visit_mut_with(child);
            child.ident_type = IdentType::Ref;
            n.update.visit_mut_with(child);

            child.visit_mut_stmt_within_child_scope(&mut n.body);
        });
    }

    fn visit_mut_function(&mut self, f: &mut Function) {
        self.mark_block(&mut f.span);
        f.type_params.visit_mut_with(self);

        self.ident_type = IdentType::Ref;
        f.decorators.visit_mut_with(self);

        {
            let params = f
                .params
                .iter()
                .filter(|p| !p.pat.is_rest())
                .flat_map(find_pat_ids)
                .collect::<Vec<Id>>();

            for id in params {
                self.current.declared_symbols.insert(id.0, DeclKind::Param);
            }
        }
        self.ident_type = IdentType::Binding;
        f.params.visit_mut_with(self);

        f.return_type.visit_mut_with(self);

        self.ident_type = IdentType::Ref;
        match &mut f.body {
            Some(body) => {
                self.mark_block(&mut body.span);
                let old_strict_mode = self.strict_mode;
                self.strict_mode = body
                    .stmts
                    .first()
                    .map(|stmt| stmt.is_use_strict())
                    .unwrap_or(false);
                // Prevent creating new scope.
                body.visit_mut_children_with(self);
                self.strict_mode = old_strict_mode;
            }
            None => {}
        }
    }

    fn visit_mut_getter_prop(&mut self, f: &mut GetterProp) {
        let old = self.ident_type;
        self.ident_type = IdentType::Ref;
        f.key.visit_mut_with(self);
        self.ident_type = old;

        f.type_ann.visit_mut_with(self);

        f.body.visit_mut_with(self);
    }

    fn visit_mut_ident(&mut self, i: &mut Ident) {
        if i.span.ctxt != SyntaxContext::empty() {
            return;
        }

        match self.ident_type {
            IdentType::Binding => self.modify(i, self.decl_kind),
            IdentType::Ref => {
                let Ident { span, sym, .. } = i;

                if cfg!(debug_assertions) && LOG {
                    debug!(
                        "IdentRef (type = {}) {}{:?}",
                        self.in_type,
                        sym,
                        span.ctxt()
                    );
                }

                if span.ctxt() != SyntaxContext::empty() {
                    return;
                }

                if let Some(mark) = self.mark_for_ref(sym) {
                    let span = span.apply_mark(mark);

                    if cfg!(debug_assertions) && LOG {
                        debug!("\t -> {:?}", span.ctxt());
                    }
                    i.span = span;
                } else {
                    if cfg!(debug_assertions) && LOG {
                        debug!("\t -> Unresolved");
                    }

                    let span = span.apply_mark(self.config.unresolved_mark);

                    if cfg!(debug_assertions) && LOG {
                        debug!("\t -> {:?}", span.ctxt());
                    }

                    i.span = span;
                    // Support hoisting
                    self.modify(i, self.decl_kind)
                }
            }
            // We currently does not touch labels
            IdentType::Label => {}
        }
    }

    fn visit_mut_import_decl(&mut self, n: &mut ImportDecl) {
        // Always resolve the import declaration identifiers even if it's type only.
        // We need to analyze these identifiers for type stripping purposes.
        self.ident_type = IdentType::Binding;
        let old_in_type = self.in_type;
        self.in_type = n.type_only;
        n.visit_mut_children_with(self);
        self.in_type = old_in_type;
    }

    fn visit_mut_import_named_specifier(&mut self, s: &mut ImportNamedSpecifier) {
        let old = self.ident_type;
        self.ident_type = IdentType::Binding;
        s.local.visit_mut_with(self);
        if self.config.handle_types {
            self.current.declared_types.insert(s.local.sym.clone());
        }
        self.ident_type = old;
    }

    fn visit_mut_import_specifier(&mut self, s: &mut ImportSpecifier) {
        let old = self.ident_type;
        self.ident_type = IdentType::Binding;

        match s {
            ImportSpecifier::Named(ImportNamedSpecifier { imported: None, .. })
            | ImportSpecifier::Namespace(..)
            | ImportSpecifier::Default(..) => s.visit_mut_children_with(self),
            ImportSpecifier::Named(s) => s.local.visit_mut_with(self),
        }

        self.ident_type = old;
    }

    /// Ignore.
    ///
    /// See https://github.com/swc-project/swc/issues/2854
    fn visit_mut_jsx_attr_name(&mut self, _: &mut JSXAttrName) {}

    fn visit_mut_key_value_pat_prop(&mut self, n: &mut KeyValuePatProp) {
        n.key.visit_mut_with(self);
        n.value.visit_mut_with(self);
    }

    fn visit_mut_labeled_stmt(&mut self, s: &mut LabeledStmt) {
        let old = self.ident_type;
        self.ident_type = IdentType::Label;
        s.label.visit_mut_with(self);
        self.ident_type = old;

        s.body.visit_mut_with(self);
    }

    fn visit_mut_method_prop(&mut self, m: &mut MethodProp) {
        m.key.visit_mut_with(self);

        // Child folder
        self.with_child(ScopeKind::Fn, |child| m.function.visit_mut_with(child));
    }

    fn visit_mut_module(&mut self, module: &mut Module) {
        self.strict_mode = true;
        module.visit_mut_children_with(self)
    }

    fn visit_mut_module_items(&mut self, stmts: &mut Vec<ModuleItem>) {
        if !self.in_ts_module && self.current.kind != ScopeKind::Fn {
            return stmts.visit_mut_children_with(self);
        }

        // Phase 1: Handle hoisting
        {
            let mut hoister = Hoister {
                kind: self.decl_kind,
                resolver: self,
                in_block: false,
                in_catch_body: false,
                catch_param_decls: Default::default(),
                excluded_from_catch: Default::default(),
            };
            stmts.visit_mut_with(&mut hoister)
        }

        // Phase 2.
        stmts.visit_mut_children_with(self)
    }

    fn visit_mut_named_export(&mut self, e: &mut NamedExport) {
        if e.src.is_some() {
            return;
        }

        e.visit_mut_children_with(self);
    }

    fn visit_mut_object_lit(&mut self, o: &mut ObjectLit) {
        self.with_child(ScopeKind::Block, |child| {
            o.visit_mut_children_with(child);
        });
    }

    fn visit_mut_param(&mut self, param: &mut Param) {
        self.ident_type = IdentType::Binding;
        param.visit_mut_children_with(self);
    }

    fn visit_mut_pat(&mut self, p: &mut Pat) {
        p.visit_mut_children_with(self);
    }

    fn visit_mut_private_method(&mut self, m: &mut PrivateMethod) {
        m.key.visit_mut_with(self);

        {
            // Child folder

            self.with_child(ScopeKind::Fn, |child| m.function.visit_mut_with(child));
        }
    }

    fn visit_mut_private_name(&mut self, _: &mut PrivateName) {}

    fn visit_mut_prop_name(&mut self, n: &mut PropName) {
        if let PropName::Computed(c) = n {
            c.visit_mut_with(self);
        }
    }

    fn visit_mut_rest_pat(&mut self, node: &mut RestPat) {
        node.arg.visit_mut_with(self);
        node.type_ann.visit_mut_with(self);
    }

    fn visit_mut_script(&mut self, script: &mut Script) {
        self.strict_mode = script
            .body
            .first()
            .map(|stmt| stmt.is_use_strict())
            .unwrap_or(false);
        script.visit_mut_children_with(self)
    }

    fn visit_mut_setter_prop(&mut self, n: &mut SetterProp) {
        n.key.visit_mut_with(self);

        {
            self.with_child(ScopeKind::Fn, |child| {
                child.ident_type = IdentType::Binding;
                n.param.visit_mut_with(child);
                n.body.visit_mut_with(child);
            });
        };
    }

    fn visit_mut_stmts(&mut self, stmts: &mut Vec<Stmt>) {
        let _span = if LOG {
            Some(span!(Level::ERROR, "visit_mut_stmts").entered())
        } else {
            None
        };

        // Phase 1: Handle hoisting
        {
            let _span = if LOG {
                Some(span!(Level::ERROR, "hoist").entered())
            } else {
                None
            };

            let mut hoister = Hoister {
                kind: self.decl_kind,
                resolver: self,
                in_block: false,
                in_catch_body: false,
                catch_param_decls: Default::default(),
                excluded_from_catch: Default::default(),
            };
            stmts.visit_mut_with(&mut hoister)
        }

        // Phase 2.
        stmts.visit_mut_children_with(self)
    }

    fn visit_mut_switch_case(&mut self, n: &mut SwitchCase) {
        n.cons.visit_mut_with(self);

        n.test.visit_mut_with(self);
    }

    fn visit_mut_switch_stmt(&mut self, s: &mut SwitchStmt) {
        s.discriminant.visit_mut_with(self);

        self.with_child(ScopeKind::Block, |child| {
            s.cases.visit_mut_with(child);
        });
    }

    fn visit_mut_ts_as_expr(&mut self, n: &mut TsAsExpr) {
        if self.config.handle_types {
            n.type_ann.visit_mut_with(self);
        }

        n.expr.visit_mut_with(self);
    }

    fn visit_mut_ts_call_signature_decl(&mut self, n: &mut TsCallSignatureDecl) {
        if !self.config.handle_types {
            return;
        }

        self.with_child(ScopeKind::Fn, |child| {
            child.in_type = true;

            n.type_params.visit_mut_with(child);
            n.params.visit_mut_with(child);
            n.type_ann.visit_mut_with(child);
        });
    }

    fn visit_mut_ts_construct_signature_decl(&mut self, decl: &mut TsConstructSignatureDecl) {
        if !self.config.handle_types {
            return;
        }

        // Child folder
        self.with_child(ScopeKind::Fn, |child| {
            child.in_type = true;

            // order is important
            decl.type_params.visit_mut_with(child);
            decl.params.visit_mut_with(child);
            decl.type_ann.visit_mut_with(child);
        });
    }

    fn visit_mut_ts_constructor_type(&mut self, ty: &mut TsConstructorType) {
        if !self.config.handle_types {
            return;
        }

        self.with_child(ScopeKind::Fn, |child| {
            child.in_type = true;

            ty.type_params.visit_mut_with(child);
            ty.params.visit_mut_with(child);
            ty.type_ann.visit_mut_with(child);
        });
    }

    fn visit_mut_ts_enum_decl(&mut self, decl: &mut TsEnumDecl) {
        self.modify(&mut decl.id, DeclKind::Lexical);

        self.with_child(ScopeKind::Block, |child| {
            // add the enum member names as declared symbols for this scope
            // Ex. `enum Foo { a, b = a }`
            let member_names = decl.members.iter().filter_map(|m| match &m.id {
                TsEnumMemberId::Ident(id) => Some((id.sym.clone(), DeclKind::Lexical)),
                TsEnumMemberId::Str(_) => None,
            });
            child.current.declared_symbols.extend(member_names);

            decl.members.visit_mut_with(child);
        });
    }

    fn visit_mut_ts_export_assignment(&mut self, node: &mut TsExportAssignment) {
        node.expr.visit_mut_with(self);

        if self.config.handle_types {
            if let Some(i) = leftmost(&mut node.expr) {
                self.try_resolving_as_type(i);
            }
        }
    }

    fn visit_mut_ts_expr_with_type_args(&mut self, n: &mut TsExprWithTypeArgs) {
        if self.config.handle_types {
            let old = self.in_type;
            self.in_type = true;
            n.visit_mut_children_with(self);
            self.in_type = old;
        }
    }

    fn visit_mut_ts_fn_type(&mut self, ty: &mut TsFnType) {
        if !self.config.handle_types {
            return;
        }

        self.with_child(ScopeKind::Fn, |child| {
            child.in_type = true;

            ty.type_params.visit_mut_with(child);
            ty.params.visit_mut_with(child);
            ty.type_ann.visit_mut_with(child);
        });
    }

    fn visit_mut_ts_getter_signature(&mut self, n: &mut TsGetterSignature) {
        if n.computed {
            n.key.visit_mut_with(self);
        }

        n.type_ann.visit_mut_with(self);
    }

    fn visit_mut_ts_import_equals_decl(&mut self, n: &mut TsImportEqualsDecl) {
        self.modify(&mut n.id, DeclKind::Lexical);

        n.module_ref.visit_mut_with(self);
    }

    fn visit_mut_ts_interface_decl(&mut self, n: &mut TsInterfaceDecl) {
        // always resolve the identifier for type stripping purposes
        let old_in_type = self.in_type;
        self.in_type = true;
        self.modify(&mut n.id, DeclKind::Type);

        if !self.config.handle_types {
            self.in_type = old_in_type;
            return;
        }

        self.with_child(ScopeKind::Fn, |child| {
            child.in_type = true;

            n.type_params.visit_mut_with(child);
            n.extends.visit_mut_with(child);
            n.body.visit_mut_with(child);
        });
        self.in_type = old_in_type;
    }

    fn visit_mut_ts_mapped_type(&mut self, n: &mut TsMappedType) {
        if !self.config.handle_types {
            return;
        }

        self.ident_type = IdentType::Binding;
        n.type_param.visit_mut_with(self);
        self.ident_type = IdentType::Ref;
        n.name_type.visit_mut_with(self);

        self.ident_type = IdentType::Ref;
        n.type_ann.visit_mut_with(self);
    }

    fn visit_mut_ts_method_signature(&mut self, n: &mut TsMethodSignature) {
        if !self.config.handle_types {
            return;
        }

        self.with_child(ScopeKind::Fn, |child| {
            child.in_type = true;

            n.type_params.visit_mut_with(child);
            if n.computed {
                n.key.visit_mut_with(child);
            }
            n.params.visit_mut_with(child);
            n.type_ann.visit_mut_with(child);
        });
    }

    fn visit_mut_ts_module_decl(&mut self, decl: &mut TsModuleDecl) {
        match &mut decl.id {
            TsModuleName::Ident(i) => {
                self.modify(i, DeclKind::Lexical);
            }
            TsModuleName::Str(_) => {}
        }

        self.with_child(ScopeKind::Block, |child| {
            child.in_ts_module = true;

            decl.body.visit_mut_children_with(child);
        });
    }

    fn visit_mut_ts_namespace_decl(&mut self, n: &mut TsNamespaceDecl) {
        self.modify(&mut n.id, DeclKind::Lexical);

        n.body.visit_mut_with(self);
    }

    fn visit_mut_ts_param_prop_param(&mut self, n: &mut TsParamPropParam) {
        self.ident_type = IdentType::Binding;
        n.visit_mut_children_with(self)
    }

    fn visit_mut_ts_property_signature(&mut self, n: &mut TsPropertySignature) {
        if !self.config.handle_types {
            return;
        }

        if n.computed {
            n.key.visit_mut_with(self);
        }

        self.with_child(ScopeKind::Fn, |child| {
            child.in_type = true;

            n.type_params.visit_mut_with(child);
            n.init.visit_mut_with(child);
            n.params.visit_mut_with(child);
            n.type_ann.visit_mut_with(child);
        });
    }

    fn visit_mut_ts_qualified_name(&mut self, n: &mut TsQualifiedName) {
        self.ident_type = IdentType::Ref;

        n.left.visit_mut_with(self)
    }

    fn visit_mut_ts_satisfies_expr(&mut self, n: &mut TsSatisfiesExpr) {
        if self.config.handle_types {
            n.type_ann.visit_mut_with(self);
        }

        n.expr.visit_mut_with(self);
    }

    fn visit_mut_ts_setter_signature(&mut self, n: &mut TsSetterSignature) {
        if n.computed {
            n.key.visit_mut_with(self);
        }

        n.param.visit_mut_with(self);
    }

    fn visit_mut_ts_tuple_element(&mut self, e: &mut TsTupleElement) {
        if !self.config.handle_types {
            return;
        }
        self.ident_type = IdentType::Ref;
        e.ty.visit_mut_with(self);
    }

    fn visit_mut_ts_type_alias_decl(&mut self, n: &mut TsTypeAliasDecl) {
        // always resolve the identifier for type stripping purposes
        let old_in_type = self.in_type;
        self.in_type = true;
        self.modify(&mut n.id, DeclKind::Type);

        if !self.config.handle_types {
            self.in_type = old_in_type;
            return;
        }

        self.with_child(ScopeKind::Fn, |child| {
            child.in_type = true;

            n.type_params.visit_mut_with(child);
            n.type_ann.visit_mut_with(child);
        });
        self.in_type = old_in_type;
    }

    fn visit_mut_ts_type_assertion(&mut self, n: &mut TsTypeAssertion) {
        if self.config.handle_types {
            n.type_ann.visit_mut_with(self);
        }

        n.expr.visit_mut_with(self);
    }

    fn visit_mut_ts_type_param(&mut self, param: &mut TsTypeParam) {
        if !self.config.handle_types {
            return;
        }
        param.name.visit_mut_with(self);

        let ident_type = self.ident_type;
        param.default.visit_mut_with(self);
        param.constraint.visit_mut_with(self);
        self.ident_type = ident_type;
    }

    fn visit_mut_ts_type_params(&mut self, params: &mut Vec<TsTypeParam>) {
        for param in params.iter_mut() {
            param.name.visit_mut_with(self);
        }

        params.visit_mut_children_with(self);
    }

    fn visit_mut_var_decl(&mut self, decl: &mut VarDecl) {
        let old_kind = self.decl_kind;
        self.decl_kind = decl.kind.into();
        decl.decls.visit_mut_with(self);
        self.decl_kind = old_kind;
    }

    fn visit_mut_var_declarator(&mut self, decl: &mut VarDeclarator) {
        // order is important

        let old_type = self.ident_type;
        self.ident_type = IdentType::Binding;
        decl.name.visit_mut_with(self);
        self.ident_type = old_type;

        decl.init.visit_mut_children_with(self);
    }
}

fn leftmost(expr: &mut Expr) -> Option<&mut Ident> {
    match expr {
        Expr::Ident(i) => Some(i),
        Expr::Member(MemberExpr { obj, .. }) => leftmost(obj),
        Expr::Paren(ParenExpr { expr, .. }) => leftmost(expr),
        _ => None,
    }
}

/// The folder which handles var / function hoisting.
struct Hoister<'a, 'b> {
    resolver: &'a mut Resolver<'b>,
    kind: DeclKind,
    /// Hoister should not touch let / const in the block.
    in_block: bool,

    in_catch_body: bool,

    excluded_from_catch: FxHashSet<JsWord>,
    catch_param_decls: FxHashSet<JsWord>,
}

impl Hoister<'_, '_> {
    fn add_pat_id(&mut self, id: &mut Ident) {
        if self.in_catch_body {
            // If we have a binding, it's different variable.
            if self.resolver.mark_for_ref_inner(&id.sym, true).is_some()
                && self.catch_param_decls.contains(&id.sym)
            {
                return;
            }

            self.excluded_from_catch.insert(id.sym.clone());
        } else {
            // Behavior is different
            if self.catch_param_decls.contains(&id.sym)
                && !self.excluded_from_catch.contains(&id.sym)
            {
                return;
            }
        }

        self.resolver.modify(id, self.kind)
    }
}

impl VisitMut for Hoister<'_, '_> {
    noop_visit_mut_type!();

    #[inline]
    fn visit_mut_arrow_expr(&mut self, _: &mut ArrowExpr) {}

    fn visit_mut_assign_pat_prop(&mut self, node: &mut AssignPatProp) {
        node.visit_mut_children_with(self);

        self.add_pat_id(&mut node.key);
    }

    fn visit_mut_block_stmt(&mut self, n: &mut BlockStmt) {
        let old_in_block = self.in_block;
        self.in_block = true;
        n.visit_mut_children_with(self);
        self.in_block = old_in_block;
    }

    /// The code below prints "PASS"
    ///
    /// ```js
    /// 
    ///      var a = "PASS";
    ///      try {
    ///          throw "FAIL1";
    ///          } catch (a) {
    ///          var a = "FAIL2";
    ///      }
    ///      console.log(a);
    /// ```
    ///
    /// While the code below does not throw **ReferenceError** for `b`
    ///
    /// ```js
    /// 
    ///      b()
    ///      try {
    ///      } catch (b) {
    ///          var b;
    ///      }
    /// ```
    ///
    /// while the code below throws **ReferenceError**
    ///
    /// ```js
    /// 
    ///      b()
    ///      try {
    ///      } catch (b) {
    ///      }
    /// ```
    #[inline]
    fn visit_mut_catch_clause(&mut self, c: &mut CatchClause) {
        let old_exclude = self.excluded_from_catch.clone();
        self.excluded_from_catch = Default::default();

        let old_in_catch_body = self.in_catch_body;

        let params: Vec<Id> = find_pat_ids(&c.param);

        self.catch_param_decls
            .extend(params.into_iter().map(|v| v.0));

        self.in_catch_body = true;
        c.body.visit_mut_with(self);

        let orig = self.catch_param_decls.clone();

        // let mut excluded = find_ids::<_, Id>(&c.body);

        // excluded.retain(|id| {
        //     // If we already have a declartion named a, `var a` in the catch body is
        //     // different var.

        //     self.resolver.mark_for_ref(&id.0).is_none()
        // });

        self.in_catch_body = false;
        c.param.visit_mut_with(self);

        self.catch_param_decls = orig;

        self.in_catch_body = old_in_catch_body;
        self.excluded_from_catch = old_exclude;
    }

    fn visit_mut_class_decl(&mut self, node: &mut ClassDecl) {
        if self.in_block {
            return;
        }
        self.resolver.modify(&mut node.ident, DeclKind::Lexical);

        if self.resolver.config.handle_types {
            self.resolver
                .current
                .declared_types
                .insert(node.ident.sym.clone());
        }
    }

    #[inline]
    fn visit_mut_constructor(&mut self, _: &mut Constructor) {}

    #[inline]
    fn visit_mut_decl(&mut self, decl: &mut Decl) {
        decl.visit_mut_children_with(self);

        if self.resolver.config.handle_types {
            match decl {
                Decl::TsInterface(i) => {
                    let old_in_type = self.resolver.in_type;
                    self.resolver.in_type = true;
                    self.resolver.modify(&mut i.id, DeclKind::Type);
                    self.resolver.in_type = old_in_type;
                }

                Decl::TsTypeAlias(a) => {
                    let old_in_type = self.resolver.in_type;
                    self.resolver.in_type = true;
                    self.resolver.modify(&mut a.id, DeclKind::Type);
                    self.resolver.in_type = old_in_type;
                }

                Decl::TsEnum(e) => {
                    if !self.in_block {
                        let old_in_type = self.resolver.in_type;
                        self.resolver.in_type = false;
                        self.resolver.modify(&mut e.id, DeclKind::Lexical);
                        self.resolver.in_type = old_in_type;
                    }
                }

                Decl::TsModule(v)
                    if matches!(
                        &**v,
                        TsModuleDecl {
                            global: false,
                            id: TsModuleName::Ident(_),
                            ..
                        },
                    ) =>
                {
                    if !self.in_block {
                        let old_in_type = self.resolver.in_type;
                        self.resolver.in_type = false;
                        self.resolver
                            .modify(v.id.as_mut_ident().unwrap(), DeclKind::Lexical);
                        self.resolver.in_type = old_in_type;
                    }
                }
                _ => {}
            }
        }
    }

    fn visit_mut_export_default_decl(&mut self, node: &mut ExportDefaultDecl) {
        // Treat default exported functions and classes as declarations
        // even though they are parsed as expressions.
        match &mut node.decl {
            DefaultDecl::Fn(f) => {
                if let Some(id) = &mut f.ident {
                    self.resolver.modify(id, DeclKind::Var);
                }

                f.visit_mut_with(self)
            }
            DefaultDecl::Class(c) => {
                if let Some(id) = &mut c.ident {
                    self.resolver.modify(id, DeclKind::Lexical);
                }

                c.visit_mut_with(self)
            }
            _ => {
                node.visit_mut_children_with(self);
            }
        }
    }

    #[inline]
    fn visit_mut_expr(&mut self, _: &mut Expr) {}

    fn visit_mut_fn_decl(&mut self, node: &mut FnDecl) {
        if self.catch_param_decls.contains(&node.ident.sym) {
            return;
        }

        if self.in_block {
            // function declaration is block scoped in strict mode
            if self.resolver.strict_mode {
                return;
            }
            // If we are in nested block, and variable named `foo` is lexically declared or
            // a parameter, we should ignore function foo while handling upper scopes.
            if let Some(DeclKind::Lexical | DeclKind::Param) =
                self.resolver.current.is_declared(&node.ident.sym)
            {
                return;
            }
        }

        self.resolver.modify(&mut node.ident, DeclKind::Function);
    }

    #[inline]
    fn visit_mut_function(&mut self, _: &mut Function) {}

    fn visit_mut_import_default_specifier(&mut self, n: &mut ImportDefaultSpecifier) {
        n.visit_mut_children_with(self);

        self.resolver.modify(&mut n.local, DeclKind::Lexical);

        if self.resolver.config.handle_types {
            self.resolver
                .current
                .declared_types
                .insert(n.local.sym.clone());
        }
    }

    fn visit_mut_import_named_specifier(&mut self, n: &mut ImportNamedSpecifier) {
        n.visit_mut_children_with(self);

        self.resolver.modify(&mut n.local, DeclKind::Lexical);

        if self.resolver.config.handle_types {
            self.resolver
                .current
                .declared_types
                .insert(n.local.sym.clone());
        }
    }

    fn visit_mut_import_star_as_specifier(&mut self, n: &mut ImportStarAsSpecifier) {
        n.visit_mut_children_with(self);

        self.resolver.modify(&mut n.local, DeclKind::Lexical);

        if self.resolver.config.handle_types {
            self.resolver
                .current
                .declared_types
                .insert(n.local.sym.clone());
        }
    }

    #[inline]
    fn visit_mut_param(&mut self, _: &mut Param) {}

    fn visit_mut_pat(&mut self, node: &mut Pat) {
        match node {
            Pat::Ident(i) => {
                self.add_pat_id(&mut i.id);
            }

            _ => node.visit_mut_children_with(self),
        }
    }

    #[inline]
    fn visit_mut_pat_or_expr(&mut self, _: &mut PatOrExpr) {}

    #[inline]
    fn visit_mut_setter_prop(&mut self, _: &mut SetterProp) {}

    fn visit_mut_switch_stmt(&mut self, s: &mut SwitchStmt) {
        s.discriminant.visit_mut_with(self);

        let old_in_block = self.in_block;
        self.in_block = true;
        s.cases.visit_mut_with(self);
        self.in_block = old_in_block;
    }

    #[inline]
    fn visit_mut_tagged_tpl(&mut self, _: &mut TaggedTpl) {}

    #[inline]
    fn visit_mut_tpl(&mut self, _: &mut Tpl) {}

    #[inline]
    fn visit_mut_ts_module_block(&mut self, _: &mut TsModuleBlock) {}

    fn visit_mut_var_decl(&mut self, node: &mut VarDecl) {
        if self.in_block {
            match node.kind {
                VarDeclKind::Const | VarDeclKind::Let => return,
                _ => {}
            }
        }

        let old_kind = self.kind;
        self.kind = node.kind.into();

        node.visit_mut_children_with(self);

        self.kind = old_kind;
    }

    fn visit_mut_var_decl_or_expr(&mut self, n: &mut VarDeclOrExpr) {
        match n {
            VarDeclOrExpr::VarDecl(v)
                if matches!(
                    &**v,
                    VarDecl {
                        kind: VarDeclKind::Let | VarDeclKind::Const,
                        ..
                    }
                ) => {}
            _ => {
                n.visit_mut_children_with(self);
            }
        }
    }

    fn visit_mut_var_decl_or_pat(&mut self, n: &mut VarDeclOrPat) {
        match n {
            VarDeclOrPat::VarDecl(v)
                if matches!(
                    &**v,
                    VarDecl {
                        kind: VarDeclKind::Let | VarDeclKind::Const,
                        ..
                    }
                ) => {}
            // Hoister should not handle lhs of for in statement below
            //
            // const b = [];
            // {
            //   let a;
            //   for (a in b) {
            //     console.log(a);
            //   }
            // }
            VarDeclOrPat::Pat(..) => {}
            _ => {
                n.visit_mut_children_with(self);
            }
        }
    }

    #[inline]
    fn visit_mut_var_declarator(&mut self, node: &mut VarDeclarator) {
        node.name.visit_mut_with(self);
    }

    /// should visit var decls first, cause var decl may appear behind the
    /// usage. this can deal with code below:
    /// ```js
    /// try {} catch (Ic) {
    ///   throw Ic;
    /// }
    /// var Ic;
    /// ```
    /// the `Ic` defined by catch param and the `Ic` defined by `var Ic` are
    /// different variables.
    /// If we deal with the `var Ic` first, we can know
    /// that there is already an global declaration of Ic when deal with the try
    /// block.
    fn visit_mut_module_items(&mut self, items: &mut Vec<ModuleItem>) {
        let mut other_items = vec![];

        for item in items {
            match item {
                ModuleItem::Stmt(Stmt::Decl(Decl::Var(v)))
                | ModuleItem::ModuleDecl(ModuleDecl::ExportDecl(ExportDecl {
                    decl: Decl::Var(v),
                    ..
                })) if matches!(
                    &**v,
                    VarDecl {
                        kind: VarDeclKind::Var,
                        ..
                    }
                ) =>
                {
                    item.visit_mut_with(self);
                }

                ModuleItem::Stmt(Stmt::Decl(Decl::Fn(..)))
                | ModuleItem::ModuleDecl(ModuleDecl::ExportDecl(ExportDecl {
                    decl: Decl::Fn(..),
                    ..
                })) => {
                    item.visit_mut_with(self);
                }
                _ => {
                    other_items.push(item);
                }
            }
        }

        for other_item in other_items {
            other_item.visit_mut_with(self);
        }
    }

    /// see docs for `self.visit_mut_module_items`
    fn visit_mut_stmts(&mut self, stmts: &mut Vec<Stmt>) {
        let mut other_stmts = vec![];

        for item in stmts {
            match item {
                Stmt::Decl(Decl::Var(v))
                    if matches!(
                        &**v,
                        VarDecl {
                            kind: VarDeclKind::Var,
                            ..
                        }
                    ) =>
                {
                    item.visit_mut_with(self);
                }
                Stmt::Decl(Decl::Fn(..)) => {
                    item.visit_mut_with(self);
                }
                _ => {
                    other_stmts.push(item);
                }
            }
        }

        for other_stmt in other_stmts {
            other_stmt.visit_mut_with(self);
        }
    }
}
