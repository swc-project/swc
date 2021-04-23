use crate::scope::{IdentType, ScopeKind};
use std::{cell::RefCell, collections::HashSet};
use swc_atoms::JsWord;
use swc_common::{Mark, SyntaxContext};
use swc_ecma_ast::*;
use swc_ecma_visit::{as_folder, noop_visit_mut_type, Fold, VisitMut, VisitMutWith};

#[cfg(test)]
mod tests;

const LOG: bool = false;

/// See [resolver_with_mark] for docs.
pub fn resolver() -> impl 'static + Fold {
    resolver_with_mark(Mark::fresh(Mark::root()))
}

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
pub fn resolver_with_mark(top_level_mark: Mark) -> impl 'static + Fold {
    assert_ne!(
        top_level_mark,
        Mark::root(),
        "Marker provided to resolver should not be the root mark"
    );
    as_folder(Resolver::new(
        top_level_mark,
        Scope::new(ScopeKind::Fn, None),
        false,
    ))
}

/// [resolver_with_mark] with typescript support enabled.
pub fn ts_resolver(top_level_mark: Mark) -> impl 'static + Fold {
    assert_ne!(
        top_level_mark,
        Mark::root(),
        "Marker provided to resolver should not be the root mark"
    );
    as_folder(Resolver::new(
        top_level_mark,
        Scope::new(ScopeKind::Fn, None),
        true,
    ))
}

#[derive(Debug, Clone)]
struct Scope<'a> {
    /// Parent scope of the scope
    parent: Option<&'a Scope<'a>>,

    /// Kind of the scope.
    kind: ScopeKind,

    /// All declarations in the scope
    declared_symbols: HashSet<JsWord>,
    hoisted_symbols: RefCell<HashSet<JsWord>>,

    /// All types declared in the scope
    declared_types: HashSet<JsWord>,
}

impl<'a> Default for Scope<'a> {
    fn default() -> Self {
        Scope::new(ScopeKind::Fn, None)
    }
}

impl<'a> Scope<'a> {
    pub fn new(kind: ScopeKind, parent: Option<&'a Scope<'a>>) -> Self {
        Scope {
            parent,
            kind,
            declared_symbols: Default::default(),
            hoisted_symbols: Default::default(),
            declared_types: Default::default(),
        }
    }
}

/// # Phases
///
/// ## Hoisting phase
///
/// ## Resolving phase
struct Resolver<'a> {
    hoist: bool,
    mark: Mark,
    current: Scope<'a>,
    ident_type: IdentType,
    handle_types: bool,
    in_type: bool,
}

impl<'a> Resolver<'a> {
    fn new(mark: Mark, current: Scope<'a>, handle_types: bool) -> Self {
        Resolver {
            hoist: false,
            mark,
            current,
            ident_type: IdentType::Ref,
            handle_types,
            in_type: false,
        }
    }

    fn visit_mut_stmt_within_same_scope(&mut self, s: &mut Stmt) {
        match s {
            Stmt::Block(s) => {
                s.visit_mut_children_with(self);
            }
            _ => s.visit_mut_with(self),
        }
    }

    /// Returns a [Mark] for an identifier reference.
    fn mark_for_ref(&self, sym: &JsWord) -> Option<Mark> {
        if self.handle_types && self.in_type {
            let mut mark = self.mark;
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
                mark = mark.parent();
                scope = cur.parent;
            }
        }

        let mut mark = self.mark;
        let mut scope = Some(&self.current);

        while let Some(cur) = scope {
            if cur.declared_symbols.contains(sym) || cur.hoisted_symbols.borrow().contains(sym) {
                if mark == Mark::root() {
                    return None;
                }
                return Some(mark);
            }
            mark = mark.parent();
            scope = cur.parent;
        }

        None
    }

    fn visit_mut_binding_ident(&mut self, ident: &mut Ident, kind: Option<VarDeclKind>) {
        if cfg!(debug_assertions) && LOG {
            eprintln!(
                "resolver: Binding {}{:?} {:?}",
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
            let mark = self.mark;

            ident.span = if mark == Mark::root() {
                ident.span
            } else {
                let span = ident.span.apply_mark(mark);
                if cfg!(debug_assertions) && LOG {
                    eprintln!("\t-> {:?}", span.ctxt());
                }
                span
            };
            return;
        }

        if self.hoist {
            // If there's no binding with same name, it means the code depends on hoisting
            //
            //   e.g.
            //
            //      function test() {
            //          if (typeof Missing == typeof EXTENDS) {
            //              console.log("missing")
            //          }
            //          var EXTENDS = "test";
            //      }
            let val = (|| {
                let mut cursor = Some(&self.current);
                let mut mark = self.mark;

                while let Some(c) = cursor {
                    if c.declared_symbols.contains(&ident.sym)
                        || c.hoisted_symbols.borrow().contains(&ident.sym)
                    {
                        c.hoisted_symbols.borrow_mut().insert(ident.sym.clone());
                        return None;
                    }
                    cursor = c.parent;
                    let m = mark.parent();
                    if m == Mark::root() {
                        return Some(mark);
                    }
                    mark = m;
                }

                None
            })();
            if let Some(mark) = val {
                ident.span = ident.span.apply_mark(mark);
                return;
            }
        }

        let mut mark = self.mark;

        if self.hoist {
            let mut cursor = Some(&self.current);

            match kind {
                Some(VarDeclKind::Var) | None => {
                    while let Some(c) = cursor {
                        if c.kind == ScopeKind::Fn {
                            c.hoisted_symbols.borrow_mut().insert(ident.sym.clone());
                            break;
                        }
                        cursor = c.parent;
                        mark = mark.parent();
                    }
                }
                Some(VarDeclKind::Let) | Some(VarDeclKind::Const) => {
                    self.current
                        .hoisted_symbols
                        .borrow_mut()
                        .insert(ident.sym.clone());
                }
            }
        } else {
            self.current.declared_symbols.insert(ident.sym.clone());
        }

        ident.span = if mark == Mark::root() {
            ident.span
        } else {
            let span = ident.span.apply_mark(mark);
            if cfg!(debug_assertions) && LOG {
                eprintln!("\t-> {:?}", span.ctxt());
            }
            span
        };
    }
}

macro_rules! typed {
    ($name:ident, $T:ty) => {
        fn $name(&mut self, node: &mut $T) {
            if self.handle_types {
                self.in_type = true;
                node.visit_mut_children_with(self)
            }
        }
    };
}

macro_rules! typed_ref {
    ($name:ident, $T:ty) => {
        fn $name(&mut self, node: &mut $T) {
            if self.handle_types {
                self.ident_type = IdentType::Ref;
                self.in_type = true;
                node.visit_mut_children_with(self)
            }
        }
    };
}

macro_rules! typed_decl {
    ($name:ident, $T:ty) => {
        fn $name(&mut self, node: &mut $T) {
            if self.handle_types {
                self.ident_type = IdentType::Binding;
                self.in_type = true;
                node.visit_mut_children_with(self)
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
    typed_ref!(visit_mut_ts_entity_name, TsEntityName);
    typed_ref!(
        visit_mut_ts_type_param_instantiation,
        TsTypeParamInstantiation
    );
    typed_ref!(visit_mut_ts_type_query, TsTypeQuery);
    typed_ref!(visit_mut_ts_type_query_expr, TsTypeQueryExpr);
    typed_ref!(visit_mut_ts_type_operator, TsTypeOperator);
    typed_ref!(visit_mut_ts_type, TsType);
    typed_ref!(visit_mut_ts_type_ann, TsTypeAnn);
    typed_ref!(visit_mut_ts_type_assertion, TsTypeAssertion);
    typed!(
        visit_mut_ts_union_or_intersection_type,
        TsUnionOrIntersectionType
    );
    typed!(visit_mut_ts_fn_or_constructor_type, TsFnOrConstructorType);
    typed_ref!(visit_mut_ts_union_type, TsUnionType);
    typed_ref!(visit_mut_ts_infer_type, TsInferType);
    typed_ref!(visit_mut_ts_mapped_type, TsMappedType);
    typed_ref!(visit_mut_ts_import_type, TsImportType);
    typed_ref!(visit_mut_ts_tuple_type, TsTupleType);
    typed_ref!(visit_mut_ts_intersection_type, TsIntersectionType);
    typed_ref!(visit_mut_ts_type_ref, TsTypeRef);
    typed_decl!(visit_mut_ts_type_param_decl, TsTypeParamDecl);
    typed!(visit_mut_ts_enum_member, TsEnumMember);
    typed!(visit_mut_ts_fn_param, TsFnParam);
    typed!(visit_mut_ts_indexed_access_type, TsIndexedAccessType);
    typed!(visit_mut_ts_index_signature, TsIndexSignature);
    typed!(visit_mut_ts_interface_body, TsInterfaceBody);
    typed!(visit_mut_ts_module_ref, TsModuleRef);
    typed!(visit_mut_ts_parenthesized_type, TsParenthesizedType);
    typed!(visit_mut_ts_type_lit, TsTypeLit);
    typed!(visit_mut_ts_type_element, TsTypeElement);
    typed!(visit_mut_ts_module_block, TsModuleBlock);
    typed!(visit_mut_ts_namespace_body, TsNamespaceBody);
    typed!(visit_mut_ts_optional_type, TsOptionalType);
    typed!(visit_mut_ts_param_prop, TsParamProp);
    typed!(visit_mut_ts_rest_type, TsRestType);
    typed!(visit_mut_ts_type_predicate, TsTypePredicate);
    typed_ref!(visit_mut_ts_this_type_or_ident, TsThisTypeOrIdent);

    fn visit_mut_arrow_expr(&mut self, e: &mut ArrowExpr) {
        let child_mark = Mark::fresh(self.mark);

        // Child folder
        let mut folder = Resolver::new(
            child_mark,
            Scope::new(ScopeKind::Fn, Some(&self.current)),
            self.handle_types,
        );

        e.type_params.visit_mut_with(&mut folder);

        let old_hoist = self.hoist;
        let old = folder.ident_type;
        folder.ident_type = IdentType::Binding;
        folder.hoist = false;
        e.params.visit_mut_with(&mut folder);
        folder.ident_type = old;
        folder.hoist = old_hoist;

        e.body.visit_mut_with(&mut folder);

        e.return_type.visit_mut_with(&mut folder);
    }

    fn visit_mut_binding_ident(&mut self, i: &mut BindingIdent) {
        let ident_type = self.ident_type;
        let in_type = self.in_type;
        i.type_ann.visit_mut_with(self);
        self.in_type = in_type;
        self.ident_type = ident_type;

        i.id.visit_mut_with(self);
    }

    fn visit_mut_block_stmt(&mut self, block: &mut BlockStmt) {
        let child_mark = Mark::fresh(self.mark);

        let mut child_folder = Resolver::new(
            child_mark,
            Scope::new(ScopeKind::Block, Some(&self.current)),
            self.handle_types,
        );

        block.visit_mut_children_with(&mut child_folder);
    }

    /// Handle body of the arrow functions
    fn visit_mut_block_stmt_or_expr(&mut self, node: &mut BlockStmtOrExpr) {
        match node {
            BlockStmtOrExpr::BlockStmt(block) => block.visit_mut_children_with(self).into(),
            BlockStmtOrExpr::Expr(e) => e.visit_mut_with(self).into(),
        }
    }

    fn visit_mut_catch_clause(&mut self, c: &mut CatchClause) {
        let child_mark = Mark::fresh(self.mark);

        // Child folder
        let mut folder = Resolver::new(
            child_mark,
            Scope::new(ScopeKind::Fn, Some(&self.current)),
            self.handle_types,
        );

        folder.ident_type = IdentType::Binding;
        c.param.visit_mut_with(&mut folder);
        folder.ident_type = IdentType::Ref;

        c.body.visit_mut_with(&mut folder);
    }

    fn visit_mut_class_expr(&mut self, n: &mut ClassExpr) {
        // Create a child scope. The class name is only accessible within the class.
        let child_mark = Mark::fresh(self.mark);

        let mut folder = Resolver::new(
            child_mark,
            Scope::new(ScopeKind::Fn, Some(&self.current)),
            self.handle_types,
        );

        folder.ident_type = IdentType::Binding;
        n.ident.visit_mut_with(&mut folder);
        folder.ident_type = IdentType::Ref;

        n.class.visit_mut_with(&mut folder);
    }

    fn visit_mut_class_method(&mut self, m: &mut ClassMethod) {
        m.key.visit_mut_with(self);

        {
            let child_mark = Mark::fresh(self.mark);

            // Child folder
            let mut child = Resolver::new(
                child_mark,
                Scope::new(ScopeKind::Fn, Some(&self.current)),
                self.handle_types,
            );

            m.function.visit_mut_with(&mut child)
        }
    }

    fn visit_mut_class_prop(&mut self, p: &mut ClassProp) {
        p.decorators.visit_mut_with(self);

        if p.computed {
            let old = self.ident_type;
            self.ident_type = IdentType::Binding;
            p.key.visit_mut_with(self);
            self.ident_type = old;
        }

        let old = self.ident_type;
        self.ident_type = IdentType::Ref;
        p.value.visit_mut_with(self);
        self.ident_type = old;

        p.type_ann.visit_mut_with(self);
    }

    fn visit_mut_constructor(&mut self, c: &mut Constructor) {
        let child_mark = Mark::fresh(self.mark);

        // Child folder
        let mut folder = Resolver::new(
            child_mark,
            Scope::new(ScopeKind::Fn, Some(&self.current)),
            self.handle_types,
        );

        let old = self.ident_type;
        self.ident_type = IdentType::Binding;
        c.params.visit_mut_with(&mut folder);
        self.ident_type = old;

        match &mut c.body {
            Some(body) => {
                body.visit_mut_children_with(&mut folder);
            }
            None => {}
        }
    }

    fn visit_mut_decl(&mut self, decl: &mut Decl) {
        self.in_type = false;
        decl.visit_mut_children_with(self)
    }

    fn visit_mut_expr(&mut self, expr: &mut Expr) {
        self.in_type = false;
        let old = self.ident_type;
        self.ident_type = IdentType::Ref;
        expr.visit_mut_children_with(self);
        self.ident_type = old;
    }

    fn visit_mut_fn_decl(&mut self, node: &mut FnDecl) {
        // We don't fold this as Hoister handles this.

        {
            let child_mark = Mark::fresh(self.mark);

            // Child folder
            let mut folder = Resolver::new(
                child_mark,
                Scope::new(ScopeKind::Fn, Some(&self.current)),
                self.handle_types,
            );

            node.function.visit_mut_with(&mut folder)
        }
    }

    fn visit_mut_fn_expr(&mut self, e: &mut FnExpr) {
        let child_mark = Mark::fresh(self.mark);

        // Child folder
        let mut folder = Resolver::new(
            child_mark,
            Scope::new(ScopeKind::Fn, Some(&self.current)),
            self.handle_types,
        );
        if let Some(ident) = &mut e.ident {
            folder.visit_mut_binding_ident(ident, None)
        }
        e.function.visit_mut_with(&mut folder);
    }

    fn visit_mut_export_default_decl(&mut self, e: &mut ExportDefaultDecl) {
        // Treat default exported functions and classes as declarations
        // even though they are parsed as expressions.
        match &mut e.decl {
            DefaultDecl::Fn(f) => {
                if f.ident.is_some() {
                    let child_mark = Mark::fresh(self.mark);

                    // Child folder
                    let mut folder = Resolver::new(
                        child_mark,
                        Scope::new(ScopeKind::Fn, Some(&self.current)),
                        self.handle_types,
                    );
                    f.function.visit_mut_with(&mut folder)
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

    fn visit_mut_for_in_stmt(&mut self, n: &mut ForInStmt) {
        let child_mark = Mark::fresh(self.mark);
        let mut child = Resolver::new(
            child_mark,
            Scope::new(ScopeKind::Block, Some(&self.current)),
            self.handle_types,
        );

        n.left.visit_mut_with(&mut child);
        n.right.visit_mut_with(&mut child);

        child.visit_mut_stmt_within_same_scope(&mut *n.body);
    }

    fn visit_mut_for_of_stmt(&mut self, n: &mut ForOfStmt) {
        let child_mark = Mark::fresh(self.mark);
        let mut child = Resolver::new(
            child_mark,
            Scope::new(ScopeKind::Block, Some(&self.current)),
            self.handle_types,
        );

        n.left.visit_mut_with(&mut child);
        n.right.visit_mut_with(&mut child);

        child.visit_mut_stmt_within_same_scope(&mut *n.body);
    }

    fn visit_mut_for_stmt(&mut self, n: &mut ForStmt) {
        let child_mark = Mark::fresh(self.mark);
        let mut child = Resolver::new(
            child_mark,
            Scope::new(ScopeKind::Block, Some(&self.current)),
            self.handle_types,
        );

        self.ident_type = IdentType::Binding;
        n.init.visit_mut_with(&mut child);
        self.ident_type = IdentType::Ref;
        n.test.visit_mut_with(&mut child);
        self.ident_type = IdentType::Ref;
        n.update.visit_mut_with(&mut child);

        child.visit_mut_stmt_within_same_scope(&mut *n.body);
    }

    fn visit_mut_function(&mut self, f: &mut Function) {
        f.type_params.visit_mut_with(self);

        self.in_type = false;
        self.ident_type = IdentType::Ref;
        f.decorators.visit_mut_with(self);

        self.ident_type = IdentType::Binding;
        f.params.visit_mut_with(self);

        self.ident_type = IdentType::Ref;
        match &mut f.body {
            Some(body) => {
                // Prevent creating new scope.
                body.visit_mut_children_with(self);
            }
            None => {}
        }

        f.return_type.visit_mut_with(self);
    }

    fn visit_mut_ident(&mut self, i: &mut Ident) {
        let ident_type = self.ident_type;
        let in_type = self.in_type;
        i.visit_mut_children_with(self);
        self.in_type = in_type;
        self.ident_type = ident_type;

        match self.ident_type {
            IdentType::Binding => self.visit_mut_binding_ident(i, None),
            IdentType::Ref => {
                let Ident { span, sym, .. } = i;

                if cfg!(debug_assertions) && LOG {
                    eprintln!(
                        "resolver: IdentRef (type = {}) {}{:?}",
                        self.in_type,
                        sym,
                        span.ctxt()
                    );
                }

                if span.ctxt() != SyntaxContext::empty() {
                    return;
                }

                if let Some(mark) = self.mark_for_ref(&sym) {
                    let span = span.apply_mark(mark);

                    if cfg!(debug_assertions) && LOG {
                        eprintln!("\t -> {:?}", span.ctxt());
                    }
                    i.span = span;
                } else {
                    if cfg!(debug_assertions) && LOG {
                        eprintln!("\t -> Unresolved");
                    }

                    let mark = {
                        let mut mark = self.mark;
                        let mut cur = Some(&self.current);
                        while let Some(scope) = cur {
                            cur = scope.parent;

                            if cur.is_none() {
                                break;
                            }
                            mark = mark.parent();
                        }

                        mark
                    };

                    let span = span.apply_mark(mark);

                    if cfg!(debug_assertions) && LOG {
                        eprintln!("\t -> {:?}", span.ctxt());
                    }

                    i.span = span;
                    // Support hoisting
                    self.visit_mut_binding_ident(i, None)
                }
            }
            // We currently does not touch labels
            IdentType::Label => {}
        }
    }

    fn visit_mut_import_named_specifier(&mut self, s: &mut ImportNamedSpecifier) {
        self.in_type = false;
        let old = self.ident_type;
        self.ident_type = IdentType::Binding;
        s.local.visit_mut_with(self);
        self.ident_type = old;
    }

    // TODO: How should I handle this?
    typed!(visit_mut_ts_namespace_export_decl, TsNamespaceExportDecl);

    track_ident_mut!();

    /// Leftmost one of a member expression should be resolved.
    fn visit_mut_member_expr(&mut self, e: &mut MemberExpr) {
        e.obj.visit_mut_with(self);

        if e.computed {
            e.prop.visit_mut_with(self);
        }
    }

    fn visit_mut_method_prop(&mut self, m: &mut MethodProp) {
        m.key.visit_mut_with(self);

        {
            let child_mark = Mark::fresh(self.mark);

            // Child folder
            let mut child = Resolver::new(
                child_mark,
                Scope::new(ScopeKind::Fn, Some(&self.current)),
                self.handle_types,
            );

            m.function.visit_mut_with(&mut child)
        };
    }

    fn visit_mut_module_items(&mut self, stmts: &mut Vec<ModuleItem>) {
        if self.current.kind != ScopeKind::Fn {
            return stmts.visit_mut_children_with(self);
        }

        // Phase 1: Handle hoisting
        {
            let mut hoister = Hoister {
                resolver: self,
                kind: None,
                in_block: false,
            };
            stmts.visit_mut_children_with(&mut hoister)
        }

        // Phase 2.
        stmts.visit_mut_children_with(self)
    }

    fn visit_mut_object_lit(&mut self, o: &mut ObjectLit) {
        let child_mark = Mark::fresh(self.mark);

        let mut child_folder = Resolver::new(
            child_mark,
            Scope::new(ScopeKind::Block, Some(&self.current)),
            self.handle_types,
        );

        o.visit_mut_children_with(&mut child_folder);
    }

    fn visit_mut_param(&mut self, param: &mut Param) {
        self.in_type = false;
        self.ident_type = IdentType::Binding;
        param.visit_mut_children_with(self);
    }

    fn visit_mut_pat(&mut self, p: &mut Pat) {
        self.in_type = false;
        p.visit_mut_children_with(self);
    }

    fn visit_mut_private_method(&mut self, m: &mut PrivateMethod) {
        m.key.visit_mut_with(self);

        {
            let child_mark = Mark::fresh(self.mark);

            // Child folder
            let mut child = Resolver::new(
                child_mark,
                Scope::new(ScopeKind::Fn, Some(&self.current)),
                self.handle_types,
            );

            m.function.visit_mut_with(&mut child)
        }
    }

    fn visit_mut_private_name(&mut self, _: &mut PrivateName) {}

    fn visit_mut_stmts(&mut self, stmts: &mut Vec<Stmt>) {
        // Phase 1: Handle hoisting
        {
            let mut hoister = Hoister {
                resolver: self,
                kind: None,
                in_block: false,
            };
            stmts.visit_mut_children_with(&mut hoister)
        }

        // Phase 2.
        stmts.visit_mut_children_with(self)
    }

    fn visit_mut_ts_call_signature_decl(&mut self, n: &mut TsCallSignatureDecl) {
        if !self.handle_types {
            return;
        }

        self.in_type = true;
        let child_mark = Mark::fresh(self.mark);

        // Child folder
        let mut child = Resolver::new(
            child_mark,
            Scope::new(ScopeKind::Fn, Some(&self.current)),
            self.handle_types,
        );
        child.in_type = true;

        n.type_params.visit_mut_with(&mut child);
        n.params.visit_mut_with(&mut child);
        n.type_ann.visit_mut_with(&mut child);
    }

    fn visit_mut_ts_construct_signature_decl(&mut self, decl: &mut TsConstructSignatureDecl) {
        if !self.handle_types {
            return;
        }
        self.in_type = true;
        let child_mark = Mark::fresh(self.mark);

        // Child folder
        let mut child = Resolver::new(
            child_mark,
            Scope::new(ScopeKind::Fn, Some(&self.current)),
            self.handle_types,
        );
        child.in_type = true;

        // order is important
        decl.type_params.visit_mut_with(&mut child);
        decl.params.visit_mut_with(&mut child);
        decl.type_ann.visit_mut_with(&mut child);
    }

    fn visit_mut_ts_constructor_type(&mut self, ty: &mut TsConstructorType) {
        if !self.handle_types {
            return;
        }

        self.in_type = true;
        let child_mark = Mark::fresh(self.mark);

        // Child folder
        let mut child = Resolver::new(
            child_mark,
            Scope::new(ScopeKind::Fn, Some(&self.current)),
            self.handle_types,
        );
        child.in_type = true;

        ty.type_params.visit_mut_with(&mut child);
        ty.params.visit_mut_with(&mut child);
        ty.type_ann.visit_mut_with(&mut child);
    }

    fn visit_mut_ts_enum_decl(&mut self, decl: &mut TsEnumDecl) {
        if !self.handle_types {
            return;
        }

        self.in_type = false;
        self.visit_mut_binding_ident(&mut decl.id, None);
        decl.members.visit_mut_with(self);
    }

    fn visit_mut_ts_fn_type(&mut self, ty: &mut TsFnType) {
        if !self.handle_types {
            return;
        }

        self.in_type = true;
        let child_mark = Mark::fresh(self.mark);

        // Child folder
        let mut child = Resolver::new(
            child_mark,
            Scope::new(ScopeKind::Fn, Some(&self.current)),
            self.handle_types,
        );
        child.in_type = true;

        ty.type_params.visit_mut_with(&mut child);
        ty.params.visit_mut_with(&mut child);
        ty.type_ann.visit_mut_with(&mut child);
    }

    fn visit_mut_ts_getter_signature(&mut self, n: &mut TsGetterSignature) {
        if n.computed {
            n.key.visit_mut_with(self);
        }

        n.type_ann.visit_mut_with(self);
    }

    fn visit_mut_ts_import_equals_decl(&mut self, n: &mut TsImportEqualsDecl) {
        if !self.handle_types {
            return;
        }

        self.in_type = true;
        self.visit_mut_binding_ident(&mut n.id, None);

        n.module_ref.visit_mut_with(self);
    }

    fn visit_mut_ts_interface_decl(&mut self, n: &mut TsInterfaceDecl) {
        if !self.handle_types {
            return;
        }

        self.in_type = true;
        self.visit_mut_binding_ident(&mut n.id, None);
        let child_mark = Mark::fresh(self.mark);
        // Child folder
        let mut child = Resolver::new(
            child_mark,
            Scope::new(ScopeKind::Fn, Some(&self.current)),
            self.handle_types,
        );
        child.in_type = true;

        n.type_params.visit_mut_with(&mut child);
        n.extends.visit_mut_with(&mut child);
        n.body.visit_mut_with(&mut child);
    }

    fn visit_mut_ts_method_signature(&mut self, n: &mut TsMethodSignature) {
        if !self.handle_types {
            return;
        }

        self.in_type = true;
        let child_mark = Mark::fresh(self.mark);

        // Child folder
        let mut child = Resolver::new(
            child_mark,
            Scope::new(ScopeKind::Fn, Some(&self.current)),
            self.handle_types,
        );
        child.in_type = true;

        n.type_params.visit_mut_with(&mut child);
        if n.computed {
            n.key.visit_mut_with(&mut child);
        }
        n.params.visit_mut_with(&mut child);
        n.type_ann.visit_mut_with(&mut child);
    }

    fn visit_mut_ts_module_decl(&mut self, decl: &mut TsModuleDecl) {
        match &mut decl.id {
            TsModuleName::Ident(i) => {
                self.visit_mut_binding_ident(i, None);
            }
            TsModuleName::Str(_) => {}
        }

        let child_mark = Mark::fresh(self.mark);

        let mut child_folder = Resolver::new(
            child_mark,
            Scope::new(ScopeKind::Block, Some(&self.current)),
            self.handle_types,
        );

        decl.body.visit_mut_children_with(&mut child_folder);
    }

    fn visit_mut_ts_namespace_decl(&mut self, n: &mut TsNamespaceDecl) {
        if !self.handle_types {
            return;
        }

        self.in_type = true;
        self.visit_mut_binding_ident(&mut n.id, None);

        n.body.visit_mut_with(self);
    }

    fn visit_mut_ts_param_prop_param(&mut self, n: &mut TsParamPropParam) {
        if !self.handle_types {
            return;
        }

        self.in_type = false;
        self.ident_type = IdentType::Binding;
        n.visit_mut_children_with(self)
    }

    fn visit_mut_ts_property_signature(&mut self, n: &mut TsPropertySignature) {
        if !self.handle_types {
            return;
        }

        self.in_type = true;
        if n.computed {
            n.key.visit_mut_with(self);
        }
        let child_mark = Mark::fresh(self.mark);
        // Child folder
        let mut child = Resolver::new(
            child_mark,
            Scope::new(ScopeKind::Fn, Some(&self.current)),
            self.handle_types,
        );
        child.in_type = true;

        n.type_params.visit_mut_with(&mut child);
        n.init.visit_mut_with(&mut child);
        n.params.visit_mut_with(&mut child);
        n.type_ann.visit_mut_with(&mut child);
    }

    fn visit_mut_ts_qualified_name(&mut self, n: &mut TsQualifiedName) {
        if !self.handle_types {
            return;
        }

        self.in_type = true;
        self.ident_type = IdentType::Ref;

        n.left.visit_mut_with(self)
    }

    fn visit_mut_ts_setter_signature(&mut self, n: &mut TsSetterSignature) {
        if n.computed {
            n.key.visit_mut_with(self);
        }

        n.param.visit_mut_with(self);
    }

    fn visit_mut_ts_tuple_element(&mut self, e: &mut TsTupleElement) {
        if !self.handle_types {
            return;
        }
        self.ident_type = IdentType::Ref;
        e.ty.visit_mut_with(self);
    }

    fn visit_mut_ts_type_alias_decl(&mut self, n: &mut TsTypeAliasDecl) {
        if !self.handle_types {
            return;
        }

        self.in_type = true;
        self.visit_mut_binding_ident(&mut n.id, None);
        let child_mark = Mark::fresh(self.mark);
        // Child folder
        let mut child = Resolver::new(
            child_mark,
            Scope::new(ScopeKind::Fn, Some(&self.current)),
            self.handle_types,
        );
        child.in_type = true;

        n.type_params.visit_mut_with(&mut child);
        n.type_ann.visit_mut_with(&mut child);
    }

    fn visit_mut_ts_type_param(&mut self, param: &mut TsTypeParam) {
        if !self.handle_types {
            return;
        }
        self.in_type = true;
        param.name.visit_mut_with(self);

        let ident_type = self.ident_type;
        param.default.visit_mut_with(self);
        param.constraint.visit_mut_with(self);
        self.ident_type = ident_type;
    }

    fn visit_mut_ts_type_params(&mut self, params: &mut Vec<TsTypeParam>) {
        for param in params.iter_mut() {
            self.in_type = true;
            param.name.visit_mut_with(self);
        }

        params.visit_mut_children_with(self);
    }

    fn visit_mut_var_decl(&mut self, decl: &mut VarDecl) {
        self.in_type = false;

        let old_hoist = self.hoist;

        self.hoist = VarDeclKind::Var == decl.kind;
        decl.decls.visit_mut_with(self);

        self.hoist = old_hoist;
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

/// The folder which handles var / function hoisting.
struct Hoister<'a, 'b> {
    resolver: &'a mut Resolver<'b>,
    kind: Option<VarDeclKind>,
    /// Hoister should not touch let / const in the block.
    in_block: bool,
}

impl VisitMut for Hoister<'_, '_> {
    noop_visit_mut_type!();

    fn visit_mut_fn_decl(&mut self, node: &mut FnDecl) {
        self.resolver.in_type = false;
        self.resolver
            .visit_mut_binding_ident(&mut node.ident, Some(VarDeclKind::Var));
    }

    #[inline]
    fn visit_mut_expr(&mut self, _: &mut Expr) {}

    #[inline]
    fn visit_mut_arrow_expr(&mut self, _: &mut ArrowExpr) {}

    #[inline]
    fn visit_mut_tagged_tpl(&mut self, _: &mut TaggedTpl) {}

    #[inline]
    fn visit_mut_tpl(&mut self, _: &mut Tpl) {}

    #[inline]
    fn visit_mut_function(&mut self, _: &mut Function) {}

    fn visit_mut_var_decl(&mut self, node: &mut VarDecl) {
        if self.in_block {
            match node.kind {
                VarDeclKind::Const | VarDeclKind::Let => return,
                _ => {}
            }
        }

        let old_kind = self.kind;
        self.kind = Some(node.kind);

        self.resolver.hoist = false;

        node.visit_mut_children_with(self);

        self.kind = old_kind;
    }

    #[inline]
    fn visit_mut_var_declarator(&mut self, node: &mut VarDeclarator) {
        node.name.visit_mut_with(self);
    }

    fn visit_mut_pat(&mut self, node: &mut Pat) {
        self.resolver.in_type = false;
        match node {
            Pat::Ident(i) => self.resolver.visit_mut_binding_ident(&mut i.id, self.kind),
            _ => node.visit_mut_children_with(self),
        }
    }

    fn visit_mut_class_decl(&mut self, node: &mut ClassDecl) {
        if self.in_block {
            return;
        }
        self.resolver.in_type = false;
        self.resolver
            .visit_mut_binding_ident(&mut node.ident, Some(VarDeclKind::Let));
    }

    #[inline]
    fn visit_mut_catch_clause(&mut self, _: &mut CatchClause) {}

    #[inline]
    fn visit_mut_pat_or_expr(&mut self, _: &mut PatOrExpr) {}

    #[inline]
    fn visit_mut_param(&mut self, _: &mut Param) {}

    #[inline]
    fn visit_mut_constructor(&mut self, _: &mut Constructor) {}

    fn visit_mut_var_decl_or_expr(&mut self, n: &mut VarDeclOrExpr) {
        match n {
            VarDeclOrExpr::VarDecl(VarDecl {
                kind: VarDeclKind::Let,
                ..
            })
            | VarDeclOrExpr::VarDecl(VarDecl {
                kind: VarDeclKind::Const,
                ..
            }) => {}
            _ => {
                n.visit_mut_children_with(self);
            }
        }
    }

    fn visit_mut_var_decl_or_pat(&mut self, n: &mut VarDeclOrPat) {
        match n {
            VarDeclOrPat::VarDecl(VarDecl {
                kind: VarDeclKind::Let,
                ..
            })
            | VarDeclOrPat::VarDecl(VarDecl {
                kind: VarDeclKind::Const,
                ..
            }) => {}
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

    fn visit_mut_block_stmt(&mut self, n: &mut BlockStmt) {
        let old_in_block = self.in_block;
        self.in_block = true;
        n.visit_mut_children_with(self);
        self.in_block = old_in_block;
    }

    fn visit_mut_export_default_decl(&mut self, node: &mut ExportDefaultDecl) {
        // Treat default exported functions and classes as declarations
        // even though they are parsed as expressions.
        match &mut node.decl {
            DefaultDecl::Fn(f) => {
                if let Some(id) = &mut f.ident {
                    self.resolver.in_type = false;
                    self.resolver
                        .visit_mut_binding_ident(id, Some(VarDeclKind::Var));
                }

                f.visit_mut_with(self)
            }
            DefaultDecl::Class(c) => {
                if let Some(id) = &mut c.ident {
                    self.resolver.in_type = false;
                    self.resolver
                        .visit_mut_binding_ident(id, Some(VarDeclKind::Let));
                }

                c.visit_mut_with(self)
            }
            _ => {
                node.visit_mut_children_with(self);
            }
        }
    }
}
