use crate::scope::{IdentType, ScopeKind};
use std::{cell::RefCell, collections::HashSet};
use swc_atoms::JsWord;
use swc_common::{Mark, SyntaxContext};
use swc_ecma_ast::*;
use swc_ecma_visit::{noop_fold_type, Fold, FoldWith};

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
/// It makes binding identifiers unique **with respect to symbol and syntax
/// context**.
///
///
/// # Panics
///
/// `top_level_mark` should not be root.
pub fn resolver_with_mark(top_level_mark: Mark) -> impl 'static + Fold {
    assert_ne!(
        top_level_mark,
        Mark::root(),
        "Marker provided to resolver should not be the root mark"
    );
    Resolver::new(top_level_mark, Scope::new(ScopeKind::Fn, None), None, false)
}

/// [resolver_with_mar] with typescript support enabled.
pub fn ts_resolver(top_level_mark: Mark) -> impl 'static + Fold {
    assert_ne!(
        top_level_mark,
        Mark::root(),
        "Marker provided to resolver should not be the root mark"
    );
    Resolver::new(top_level_mark, Scope::new(ScopeKind::Fn, None), None, true)
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
    cur_defining: Option<(JsWord, Mark)>,
    ident_type: IdentType,
    handle_types: bool,
    in_type: bool,
}

impl<'a> Resolver<'a> {
    fn new(
        mark: Mark,
        current: Scope<'a>,
        cur_defining: Option<(JsWord, Mark)>,
        handle_types: bool,
    ) -> Self {
        Resolver {
            hoist: false,
            mark,
            current,
            cur_defining,
            ident_type: IdentType::Ref,
            handle_types,
            in_type: false,
        }
    }

    /// Returns a [Mark] for an identifier reference.
    fn mark_for_ref(&self, sym: &JsWord) -> Option<Mark> {
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

        if let Some((ref c, mark)) = self.cur_defining {
            if *c == *sym {
                return Some(mark);
            }
        }

        None
    }

    fn fold_binding_ident(&mut self, ident: Ident) -> Ident {
        if cfg!(debug_assertions) && LOG {
            eprintln!("resolver: Binding {}{:?}", ident.sym, ident.span.ctxt());
        }

        if ident.span.ctxt() != SyntaxContext::empty() {
            return ident;
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
                return Ident {
                    span: ident.span.apply_mark(mark),
                    ..ident
                };
            }
        }

        let (should_insert, mark) = if let Some((ref cur, override_mark)) = self.cur_defining {
            if *cur != ident.sym {
                (true, self.mark)
            } else {
                (false, override_mark)
            }
        } else {
            (true, self.mark)
        };

        let mut mark = mark;

        if should_insert {
            if self.hoist {
                let mut cursor = Some(&self.current);

                while let Some(c) = cursor {
                    if c.kind == ScopeKind::Fn {
                        c.hoisted_symbols.borrow_mut().insert(ident.sym.clone());
                        break;
                    }
                    cursor = c.parent;
                    mark = mark.parent();
                }
            } else {
                self.current.declared_symbols.insert(ident.sym.clone());
            }
        }

        Ident {
            span: if mark == Mark::root() {
                ident.span
            } else {
                let span = ident.span.apply_mark(mark);
                if cfg!(debug_assertions) && LOG {
                    eprintln!("\t-> {:?}", span.ctxt());
                }
                span
            },
            sym: ident.sym,
            ..ident
        }
    }
}

macro_rules! typed {
    ($name:ident, $T:ty) => {
        fn $name(&mut self, node: $T) -> $T {
            if self.handle_types {
                self.in_type = true;
                node.fold_children_with(self)
            } else {
                node
            }
        }
    };
}

macro_rules! typed_ref {
    ($name:ident, $T:ty) => {
        fn $name(&mut self, node: $T) -> $T {
            if self.handle_types {
                self.ident_type = IdentType::Ref;
                self.in_type = true;
                node.fold_children_with(self)
            } else {
                node
            }
        }
    };
}

macro_rules! noop {
    ($name:ident, $T:ty) => {
        #[inline]
        fn $name(&mut self, node: $T) -> $T {
            node
        }
    };
}

impl<'a> Fold for Resolver<'a> {
    noop!(fold_accessibility, Accessibility);
    noop!(fold_true_plus_minus, TruePlusMinus);
    noop!(fold_ts_call_signature_decl, TsCallSignatureDecl);
    noop!(fold_ts_keyword_type, TsKeywordType);
    noop!(fold_ts_keyword_type_kind, TsKeywordTypeKind);
    noop!(fold_ts_type_operator_op, TsTypeOperatorOp);
    noop!(fold_ts_enum_member_id, TsEnumMemberId);
    noop!(fold_ts_external_module_ref, TsExternalModuleRef);
    noop!(fold_ts_module_name, TsModuleName);
    noop!(fold_ts_this_type, TsThisType);

    typed_ref!(fold_ts_array_type, TsArrayType);
    typed_ref!(fold_ts_conditional_type, TsConditionalType);
    typed_ref!(fold_ts_entity_name, TsEntityName);
    typed_ref!(fold_ts_type_param_instantiation, TsTypeParamInstantiation);
    typed_ref!(fold_ts_type_query, TsTypeQuery);
    typed_ref!(fold_ts_type_query_expr, TsTypeQueryExpr);
    typed_ref!(fold_ts_type_operator, TsTypeOperator);
    typed_ref!(fold_ts_type_cast_expr, TsTypeCastExpr);
    typed_ref!(fold_ts_type, TsType);
    typed_ref!(fold_ts_type_ann, TsTypeAnn);
    typed_ref!(fold_ts_type_assertion, TsTypeAssertion);
    typed!(
        fold_ts_union_or_intersection_type,
        TsUnionOrIntersectionType
    );
    typed!(fold_ts_fn_or_constructor_type, TsFnOrConstructorType);
    typed_ref!(fold_ts_union_type, TsUnionType);
    typed_ref!(fold_ts_infer_type, TsInferType);
    typed_ref!(fold_ts_mapped_type, TsMappedType);
    typed_ref!(fold_ts_import_type, TsImportType);
    typed_ref!(fold_ts_tuple_type, TsTupleType);
    typed_ref!(fold_ts_intersection_type, TsIntersectionType);
    typed_ref!(fold_ts_type_ref, TsTypeRef);
    typed!(fold_ts_type_param_decl, TsTypeParamDecl);
    typed!(fold_ts_enum_member, TsEnumMember);
    typed!(fold_ts_fn_param, TsFnParam);
    typed!(fold_ts_indexed_access_type, TsIndexedAccessType);
    typed!(fold_ts_index_signature, TsIndexSignature);
    typed!(fold_ts_interface_body, TsInterfaceBody);
    typed!(fold_ts_module_ref, TsModuleRef);
    typed!(fold_ts_parenthesized_type, TsParenthesizedType);
    typed!(fold_ts_type_lit, TsTypeLit);
    typed!(fold_ts_type_element, TsTypeElement);
    typed!(fold_ts_module_decl, TsModuleDecl);
    typed!(fold_ts_signature_decl, TsSignatureDecl);
    typed!(fold_ts_module_block, TsModuleBlock);
    typed!(fold_ts_namespace_body, TsNamespaceBody);
    typed!(fold_ts_optional_type, TsOptionalType);

    fn fold_ts_tuple_element(&mut self, e: TsTupleElement) -> TsTupleElement {
        if !self.handle_types {
            return e;
        }
        self.ident_type = IdentType::Ref;
        TsTupleElement {
            ty: e.ty.fold_with(self),
            ..e
        }
    }

    fn fold_ts_type_param(&mut self, param: TsTypeParam) -> TsTypeParam {
        if !self.handle_types {
            return param;
        }
        self.in_type = true;
        TsTypeParam {
            name: self.fold_binding_ident(param.name),
            default: param.default.fold_with(self),
            constraint: param.constraint.fold_with(self),
            ..param
        }
    }

    fn fold_ts_construct_signature_decl(
        &mut self,
        decl: TsConstructSignatureDecl,
    ) -> TsConstructSignatureDecl {
        if !self.handle_types {
            return decl;
        }
        self.in_type = true;
        let child_mark = Mark::fresh(self.mark);

        // Child folder
        let mut child = Resolver::new(
            child_mark,
            Scope::new(ScopeKind::Fn, Some(&self.current)),
            None,
            self.handle_types,
        );
        child.in_type = true;

        TsConstructSignatureDecl {
            // order is important
            type_params: decl.type_params.fold_with(&mut child),
            params: decl.params.fold_with(&mut child),
            type_ann: decl.type_ann.fold_with(&mut child),
            ..decl
        }
    }

    fn fold_ts_constructor_type(&mut self, ty: TsConstructorType) -> TsConstructorType {
        if !self.handle_types {
            return ty;
        }

        self.in_type = true;
        let child_mark = Mark::fresh(self.mark);

        // Child folder
        let mut child = Resolver::new(
            child_mark,
            Scope::new(ScopeKind::Fn, Some(&self.current)),
            None,
            self.handle_types,
        );
        child.in_type = true;

        TsConstructorType {
            type_params: ty.type_params.fold_with(&mut child),
            params: ty.params.fold_with(&mut child),
            type_ann: ty.type_ann.fold_with(&mut child),
            ..ty
        }
    }

    fn fold_ts_enum_decl(&mut self, decl: TsEnumDecl) -> TsEnumDecl {
        if !self.handle_types {
            return decl;
        }

        self.in_type = false;
        let id = self.fold_binding_ident(decl.id);
        let members = decl.members.fold_with(self);

        TsEnumDecl {
            id,
            members,
            ..decl
        }
    }

    fn fold_ts_fn_type(&mut self, ty: TsFnType) -> TsFnType {
        if !self.handle_types {
            return ty;
        }

        self.in_type = true;
        let child_mark = Mark::fresh(self.mark);

        // Child folder
        let mut child = Resolver::new(
            child_mark,
            Scope::new(ScopeKind::Fn, Some(&self.current)),
            None,
            self.handle_types,
        );
        child.in_type = true;

        TsFnType {
            type_params: ty.type_params.fold_with(&mut child),
            params: ty.params.fold_with(&mut child),
            type_ann: ty.type_ann.fold_with(&mut child),
            ..ty
        }
    }

    fn fold_ts_method_signature(&mut self, n: TsMethodSignature) -> TsMethodSignature {
        if !self.handle_types {
            return n;
        }

        self.in_type = true;
        let child_mark = Mark::fresh(self.mark);

        // Child folder
        let mut child = Resolver::new(
            child_mark,
            Scope::new(ScopeKind::Fn, Some(&self.current)),
            None,
            self.handle_types,
        );
        child.in_type = true;

        TsMethodSignature {
            type_params: n.type_params.fold_with(&mut child),
            key: n.key.fold_with(&mut child),
            params: n.params.fold_with(&mut child),
            type_ann: n.type_ann.fold_with(&mut child),
            ..n
        }
    }

    fn fold_ts_interface_decl(&mut self, n: TsInterfaceDecl) -> TsInterfaceDecl {
        if !self.handle_types {
            return n;
        }

        self.in_type = true;
        let id = self.fold_binding_ident(n.id);
        let child_mark = Mark::fresh(self.mark);
        // Child folder
        let mut child = Resolver::new(
            child_mark,
            Scope::new(ScopeKind::Fn, Some(&self.current)),
            None,
            self.handle_types,
        );
        child.in_type = true;

        TsInterfaceDecl {
            id,
            type_params: n.type_params.fold_with(&mut child),
            extends: n.extends.fold_with(&mut child),
            body: n.body.fold_with(&mut child),
            ..n
        }
    }

    fn fold_ts_type_alias_decl(&mut self, n: TsTypeAliasDecl) -> TsTypeAliasDecl {
        if !self.handle_types {
            return n;
        }

        self.in_type = true;
        let id = self.fold_binding_ident(n.id);
        let child_mark = Mark::fresh(self.mark);
        // Child folder
        let mut child = Resolver::new(
            child_mark,
            Scope::new(ScopeKind::Fn, Some(&self.current)),
            None,
            self.handle_types,
        );
        child.in_type = true;

        TsTypeAliasDecl {
            id,
            type_params: n.type_params.fold_with(&mut child),
            type_ann: n.type_ann.fold_with(&mut child),
            ..n
        }
    }

    fn fold_ts_import_equals_decl(&mut self, n: TsImportEqualsDecl) -> TsImportEqualsDecl {
        if !self.handle_types {
            return n;
        }

        self.in_type = true;
        let id = self.fold_binding_ident(n.id);

        TsImportEqualsDecl {
            id,
            module_ref: n.module_ref.fold_with(self),
            ..n
        }
    }

    fn fold_ts_namespace_decl(&mut self, n: TsNamespaceDecl) -> TsNamespaceDecl {
        if !self.handle_types {
            return n;
        }

        self.in_type = true;
        let id = self.fold_binding_ident(n.id);

        TsNamespaceDecl {
            id,
            body: n.body.fold_with(self),
            ..n
        }
    }

    // WIP

    typed!(fold_ts_namespace_export_decl, TsNamespaceExportDecl);
    typed!(fold_ts_param_prop, TsParamProp);
    typed!(fold_ts_param_prop_param, TsParamPropParam);
    typed!(fold_ts_property_signature, TsPropertySignature);
    typed!(fold_ts_qualified_name, TsQualifiedName);
    typed!(fold_ts_rest_type, TsRestType);
    typed!(fold_ts_this_type_or_ident, TsThisTypeOrIdent);
    typed!(fold_ts_type_predicate, TsTypePredicate);

    track_ident!();

    fn fold_arrow_expr(&mut self, e: ArrowExpr) -> ArrowExpr {
        let child_mark = Mark::fresh(self.mark);

        // Child folder
        let mut folder = Resolver::new(
            child_mark,
            Scope::new(ScopeKind::Fn, Some(&self.current)),
            self.cur_defining.take(),
            self.handle_types,
        );

        let old_hoist = self.hoist;
        let old = folder.ident_type;
        folder.ident_type = IdentType::Binding;
        self.hoist = false;
        let params = e.params.fold_with(&mut folder);
        folder.ident_type = old;
        self.hoist = old_hoist;

        let body = e.body.fold_with(&mut folder);

        self.cur_defining = folder.cur_defining;

        ArrowExpr { params, body, ..e }
    }

    fn fold_block_stmt(&mut self, block: BlockStmt) -> BlockStmt {
        let child_mark = Mark::fresh(self.mark);

        let mut child_folder = Resolver::new(
            child_mark,
            Scope::new(ScopeKind::Block, Some(&self.current)),
            self.cur_defining.take(),
            self.handle_types,
        );

        let block = block.fold_children_with(&mut child_folder);
        self.cur_defining = child_folder.cur_defining;
        block
    }

    /// Handle body of the arrow functions
    fn fold_block_stmt_or_expr(&mut self, node: BlockStmtOrExpr) -> BlockStmtOrExpr {
        match node {
            BlockStmtOrExpr::BlockStmt(block) => block.fold_children_with(self).into(),
            BlockStmtOrExpr::Expr(e) => e.fold_with(self).into(),
        }
    }

    fn fold_catch_clause(&mut self, c: CatchClause) -> CatchClause {
        let child_mark = Mark::fresh(self.mark);

        // Child folder
        let mut folder = Resolver::new(
            child_mark,
            Scope::new(ScopeKind::Fn, Some(&self.current)),
            self.cur_defining.take(),
            self.handle_types,
        );

        folder.ident_type = IdentType::Binding;
        let param = c.param.fold_with(&mut folder);
        folder.ident_type = IdentType::Ref;

        let body = c.body.fold_with(&mut folder);

        self.cur_defining = folder.cur_defining;

        CatchClause { param, body, ..c }
    }

    fn fold_class_method(&mut self, m: ClassMethod) -> ClassMethod {
        let key = m.key.fold_with(self);

        let function = {
            let child_mark = Mark::fresh(self.mark);

            // Child folder
            let mut child = Resolver::new(
                child_mark,
                Scope::new(ScopeKind::Fn, Some(&self.current)),
                None,
                self.handle_types,
            );

            m.function.fold_with(&mut child)
        };

        ClassMethod { key, function, ..m }
    }

    fn fold_class_prop(&mut self, p: ClassProp) -> ClassProp {
        let decorators = p.decorators.fold_with(self);

        let old = self.ident_type;
        self.ident_type = IdentType::Binding;
        let key = p.key.fold_with(self);
        self.ident_type = old;

        let old = self.ident_type;
        self.ident_type = IdentType::Ref;
        let value = p.value.fold_with(self);
        self.ident_type = old;

        ClassProp {
            decorators,
            key,
            value,
            ..p
        }
    }

    fn fold_constructor(&mut self, c: Constructor) -> Constructor {
        let old = self.ident_type;
        self.ident_type = IdentType::Binding;
        let params = c.params.fold_with(self);
        self.ident_type = old;

        let body = c.body.fold_with(self);
        let key = c.key.fold_with(self);

        Constructor {
            params,
            body,
            key,
            ..c
        }
    }

    fn fold_expr(&mut self, expr: Expr) -> Expr {
        let expr = validate!(expr);

        let old = self.ident_type;
        self.ident_type = IdentType::Ref;
        let expr = match expr {
            // Leftmost one of a member expression should be resolved.
            Expr::Member(me) => {
                if me.computed {
                    Expr::Member(MemberExpr {
                        obj: me.obj.fold_with(self),
                        prop: me.prop.fold_with(self),
                        ..me
                    })
                } else {
                    Expr::Member(MemberExpr {
                        obj: me.obj.fold_with(self),
                        ..me
                    })
                }
            }
            _ => expr.fold_children_with(self),
        };
        self.ident_type = old;

        expr
    }

    fn fold_fn_decl(&mut self, node: FnDecl) -> FnDecl {
        // We don't fold this as Hoister handles this.
        let ident = node.ident;

        let function = {
            let child_mark = Mark::fresh(self.mark);

            // Child folder
            let mut folder = Resolver::new(
                child_mark,
                Scope::new(ScopeKind::Fn, Some(&self.current)),
                None,
                self.handle_types,
            );

            folder.cur_defining = Some((ident.sym.clone(), ident.span.ctxt().remove_mark()));

            node.function.fold_with(&mut folder)
        };

        FnDecl {
            ident,
            function,
            ..node
        }
    }

    fn fold_fn_expr(&mut self, e: FnExpr) -> FnExpr {
        let ident = if let Some(ident) = e.ident {
            Some(self.fold_binding_ident(ident))
        } else {
            None
        };

        let child_mark = Mark::fresh(self.mark);

        // Child folder
        let mut folder = Resolver::new(
            child_mark,
            Scope::new(ScopeKind::Fn, Some(&self.current)),
            self.cur_defining.take(),
            self.handle_types,
        );
        let function = e.function.fold_with(&mut folder);

        self.cur_defining = folder.cur_defining;

        FnExpr { ident, function }
    }

    fn fold_function(&mut self, mut f: Function) -> Function {
        self.ident_type = IdentType::Ref;
        f.decorators = f.decorators.fold_with(self);

        self.ident_type = IdentType::Binding;
        f.params = f.params.fold_with(self);

        self.ident_type = IdentType::Ref;
        f.body = f.body.map(|stmt| stmt.fold_children_with(self));

        f
    }

    fn fold_ident(&mut self, i: Ident) -> Ident {
        match self.ident_type {
            IdentType::Binding => self.fold_binding_ident(i),
            IdentType::Ref => {
                let Ident { span, sym, .. } = i;

                if cfg!(debug_assertions) && LOG {
                    eprintln!("resolver: IdentRef {}{:?}", sym, i.span.ctxt());
                }

                if span.ctxt() != SyntaxContext::empty() {
                    return Ident { sym, ..i };
                }

                if let Some(mark) = self.mark_for_ref(&sym) {
                    let span = span.apply_mark(mark);

                    if cfg!(debug_assertions) && LOG {
                        eprintln!("\t -> {:?}", span.ctxt());
                    }
                    Ident { sym, span, ..i }
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

                    // Support hoisting
                    self.fold_binding_ident(Ident { sym, span, ..i })
                }
            }
            IdentType::Label => {
                // We currently does not touch labels
                i
            }
        }
    }

    fn fold_import_named_specifier(&mut self, s: ImportNamedSpecifier) -> ImportNamedSpecifier {
        let old = self.ident_type;
        self.ident_type = IdentType::Ref;
        let local = s.local.fold_with(self);
        self.ident_type = old;

        ImportNamedSpecifier { local, ..s }
    }

    fn fold_method_prop(&mut self, m: MethodProp) -> MethodProp {
        let key = m.key.fold_with(self);

        let function = {
            let child_mark = Mark::fresh(self.mark);

            // Child folder
            let mut child = Resolver::new(
                child_mark,
                Scope::new(ScopeKind::Fn, Some(&self.current)),
                None,
                self.handle_types,
            );

            m.function.fold_with(&mut child)
        };

        MethodProp { key, function, ..m }
    }

    fn fold_object_lit(&mut self, o: ObjectLit) -> ObjectLit {
        let child_mark = Mark::fresh(self.mark);

        let mut child_folder = Resolver::new(
            child_mark,
            Scope::new(ScopeKind::Block, Some(&self.current)),
            self.cur_defining.take(),
            self.handle_types,
        );

        let o = o.fold_children_with(&mut child_folder);
        self.cur_defining = child_folder.cur_defining;
        o
    }

    fn fold_pat(&mut self, p: Pat) -> Pat {
        let old = self.cur_defining.take();
        let p = p.fold_children_with(self);

        self.cur_defining = old;
        p
    }

    fn fold_var_decl(&mut self, decl: VarDecl) -> VarDecl {
        let old_hoist = self.hoist;

        self.hoist = VarDeclKind::Var == decl.kind;
        let decls = decl.decls.fold_with(self);

        self.hoist = old_hoist;

        VarDecl { decls, ..decl }
    }

    fn fold_var_declarator(&mut self, decl: VarDeclarator) -> VarDeclarator {
        // order is important

        let old_defining = self.cur_defining.take();

        let old_type = self.ident_type;
        self.ident_type = IdentType::Binding;
        let name = decl.name.fold_with(self);
        self.ident_type = old_type;

        let cur_name = match name {
            Pat::Ident(Ident { ref sym, .. }) => Some((sym.clone(), self.mark)),
            _ => None,
        };

        self.cur_defining = cur_name;
        let init = decl.init.fold_children_with(self);
        self.cur_defining = old_defining;

        VarDeclarator { name, init, ..decl }
    }

    fn fold_module_items(&mut self, stmts: Vec<ModuleItem>) -> Vec<ModuleItem> {
        let stmts = validate!(stmts);

        if self.current.kind != ScopeKind::Fn {
            return stmts.fold_children_with(self);
        }

        // Phase 1: Handle hoisting
        let stmts = {
            let mut hoister = Hoister { resolver: self };
            stmts.fold_children_with(&mut hoister)
        };

        // Phase 2.
        stmts.fold_children_with(self)
    }

    fn fold_stmts(&mut self, stmts: Vec<Stmt>) -> Vec<Stmt> {
        // Phase 1: Handle hoisting
        let stmts = {
            let mut hoister = Hoister { resolver: self };
            stmts.fold_children_with(&mut hoister)
        };

        // Phase 2.
        stmts.fold_children_with(self)
    }
}

/// The folder which handles var / function hoisting.
struct Hoister<'a, 'b> {
    resolver: &'a mut Resolver<'b>,
}

impl Fold for Hoister<'_, '_> {
    noop_fold_type!();

    fn fold_fn_decl(&mut self, node: FnDecl) -> FnDecl {
        let ident = self.resolver.fold_binding_ident(node.ident);

        FnDecl { ident, ..node }
    }

    fn fold_arrow_expr(&mut self, node: ArrowExpr) -> ArrowExpr {
        node
    }

    fn fold_function(&mut self, node: Function) -> Function {
        node
    }

    fn fold_var_decl(&mut self, node: VarDecl) -> VarDecl {
        if node.kind != VarDeclKind::Var {
            return node;
        }
        self.resolver.hoist = false;

        node.fold_children_with(self)
    }

    fn fold_var_declarator(&mut self, node: VarDeclarator) -> VarDeclarator {
        VarDeclarator {
            name: node.name.fold_with(self),
            ..node
        }
    }

    fn fold_pat(&mut self, node: Pat) -> Pat {
        match node {
            Pat::Ident(i) => Pat::Ident(self.resolver.fold_binding_ident(i)),
            _ => node.fold_children_with(self),
        }
    }

    #[inline(always)]
    fn fold_pat_or_expr(&mut self, node: PatOrExpr) -> PatOrExpr {
        node
    }
}
