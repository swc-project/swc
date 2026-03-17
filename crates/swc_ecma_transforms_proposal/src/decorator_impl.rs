use std::{collections::VecDeque, iter::once, mem::take};

use rustc_hash::{FxHashMap, FxHashSet};
use swc_atoms::{atom, Atom};
use swc_common::{util::take::Take, Mark, Span, Spanned, SyntaxContext, DUMMY_SP};
use swc_ecma_ast::*;
use swc_ecma_transforms_base::{helper, helper_expr};
use swc_ecma_transforms_classes::super_field::SuperFieldAccessFolder;
use swc_ecma_utils::{
    alias_ident_for, constructor::inject_after_super, default_constructor_with_span,
    is_maybe_branch_directive, private_ident, prop_name_to_expr_value, quote_ident, replace_ident,
    stack_size::maybe_grow_default, ExprFactory, IdentRenamer,
};
use swc_ecma_visit::{
    noop_visit_mut_type, noop_visit_type, visit_mut_pass, Visit, VisitMut, VisitMutWith, VisitWith,
};

use crate::DecoratorVersion;

pub(crate) fn decorator_impl(version: DecoratorVersion) -> impl Pass {
    visit_mut_pass(DecoratorPass {
        version,
        ..Default::default()
    })
}

#[derive(Default)]
struct DecoratorPass {
    /// Variables without initializer.
    extra_vars: Vec<VarDeclarator>,

    extra_lets: Vec<VarDeclarator>,

    state: ClassState,

    /// Prepended before the class
    pre_class_inits: Vec<Box<Expr>>,

    rename_map: FxHashMap<Id, Id>,

    extra_exports: Vec<ExportSpecifier>,

    version: DecoratorVersion,

    /// Lexical class name for the currently visited class body.
    current_class_name: Option<Ident>,

    /// Alias used for class-name captures that originate from member decorators
    /// or computed keys in decorated class declarations.
    class_member_class_ref_alias: Option<Ident>,

    /// In module-mode exec tests, assignment to unresolved identifiers throws.
    /// Track them to preserve sloppy-mode behavior expected by Babel fixtures.
    implicit_globals: FxHashSet<Atom>,

    /// Stack of private names declared by currently visited classes.
    class_private_names: Vec<FxHashSet<Atom>>,
}

#[derive(Default)]
struct ClassState {
    private_id_index: u32,

    static_non_field_lhs: Vec<Ident>,
    proto_non_field_lhs: Vec<Ident>,
    static_field_lhs: Vec<Ident>,
    proto_field_lhs: Vec<Ident>,
    pending_instance_field_extra_inits: Vec<Box<Expr>>,

    /// If not empty, `initProto` should be injected to the constructor.
    init_proto: Option<Ident>,
    init_proto_args: Vec<Option<ExprOrSpread>>,

    init_static: Option<Ident>,
    init_static_args: Vec<Option<ExprOrSpread>>,

    /// Injected into static blocks.
    extra_stmts: Vec<Stmt>,

    /// Expressions that must run in class definition context
    /// (e.g. yield/await with private names, class binding captures).
    computed_key_inits: Vec<Box<Expr>>,

    class_lhs: Vec<Option<Pat>>,
    class_decorators: Vec<Option<ExprOrSpread>>,
    class_decorators_have_this: bool,
    instance_brand: Option<PrivateName>,

    super_class: Option<Ident>,
}

#[derive(Default)]
struct PrivateNameFinder {
    found: bool,
}

impl Visit for PrivateNameFinder {
    noop_visit_type!();

    fn visit_private_name(&mut self, _: &PrivateName) {
        self.found = true;
    }
}

#[derive(Default)]
struct YieldAwaitFinder {
    found: bool,
}

impl Visit for YieldAwaitFinder {
    noop_visit_type!();

    fn visit_yield_expr(&mut self, _: &YieldExpr) {
        self.found = true;
    }

    fn visit_await_expr(&mut self, _: &AwaitExpr) {
        self.found = true;
    }
}

struct InstancePrivateNameFinder<'a> {
    names: &'a FxHashSet<Atom>,
    found: bool,
}

impl Visit for InstancePrivateNameFinder<'_> {
    noop_visit_type!();

    fn visit_private_name(&mut self, n: &PrivateName) {
        if self.names.contains(&n.name) {
            self.found = true;
        }
    }
}

struct CurrentClassNameFinder {
    target: Id,
    found: bool,
}

impl Visit for CurrentClassNameFinder {
    noop_visit_type!();

    fn visit_ident(&mut self, n: &Ident) {
        if n.to_id() == self.target {
            self.found = true;
        }
    }
}

impl DecoratorPass {
    fn is_2023_11(&self) -> bool {
        matches!(self.version, DecoratorVersion::V202311)
    }

    fn maybe_to_property_key(&self, expr: Expr) -> Expr {
        if self.is_2023_11() {
            CallExpr {
                span: DUMMY_SP,
                callee: helper_expr!(to_property_key).as_callee(),
                args: vec![expr.as_arg()],
                ..Default::default()
            }
            .into()
        } else {
            expr
        }
    }

    fn expr_uses_private_name(&self, expr: &Expr) -> bool {
        let mut v = PrivateNameFinder::default();
        expr.visit_with(&mut v);
        v.found
    }

    fn expr_uses_current_class_private_name(&self, expr: &Expr) -> bool {
        let Some(names) = self.class_private_names.last() else {
            return false;
        };

        if names.is_empty() {
            return false;
        }

        let mut v = InstancePrivateNameFinder {
            names,
            found: false,
        };
        expr.visit_with(&mut v);
        v.found
    }

    fn expr_uses_yield_or_await(&self, expr: &Expr) -> bool {
        let mut v = YieldAwaitFinder::default();
        expr.visit_with(&mut v);
        v.found
    }

    fn expr_uses_current_class_name(&self, expr: &Expr) -> bool {
        let Some(class_name) = self.current_class_name.as_ref() else {
            return false;
        };

        let mut v = CurrentClassNameFinder {
            target: class_name.to_id(),
            found: false,
        };
        expr.visit_with(&mut v);
        v.found
    }

    fn should_queue_class_key_init(&self, expr: &Expr, allow_class_name_queue: bool) -> bool {
        if !self.is_2023_11() {
            return false;
        }

        let has_private_yield =
            self.expr_uses_private_name(expr) && self.expr_uses_yield_or_await(expr);
        if has_private_yield {
            return true;
        }

        allow_class_name_queue && self.expr_uses_current_class_name(expr)
    }

    fn queue_pre_class_init(&mut self, expr: Box<Expr>, prefer_class_key: bool) {
        if prefer_class_key {
            self.state.computed_key_inits.push(expr);
        } else {
            self.pre_class_inits.push(expr);
        }
    }

    fn take_computed_key_init_member(&mut self) -> Option<ClassMember> {
        if !self.is_2023_11() || self.state.computed_key_inits.is_empty() {
            return None;
        }

        let mut exprs = self.state.computed_key_inits.take();
        exprs.push(Box::new(
            Lit::Str(Str {
                span: DUMMY_SP,
                value: "_".into(),
                raw: None,
            })
            .into(),
        ));

        Some(ClassMember::Method(ClassMethod {
            span: DUMMY_SP,
            key: PropName::Computed(ComputedPropName {
                span: DUMMY_SP,
                expr: Expr::from_exprs(exprs),
            }),
            function: Box::new(Function {
                span: DUMMY_SP,
                params: Vec::new(),
                body: Some(BlockStmt {
                    span: DUMMY_SP,
                    stmts: Vec::new(),
                    ..Default::default()
                }),
                is_async: false,
                is_generator: false,
                decorators: Default::default(),
                ..Default::default()
            }),
            kind: MethodKind::Method,
            is_static: true,
            accessibility: Default::default(),
            is_abstract: false,
            is_optional: false,
            is_override: false,
        }))
    }

    fn collect_instance_private_names(&self, members: &[ClassMember]) -> FxHashSet<Atom> {
        let mut names = FxHashSet::default();

        for member in members {
            match member {
                ClassMember::PrivateProp(prop) if !prop.is_static => {
                    names.insert(prop.key.name.clone());
                }
                ClassMember::PrivateMethod(method) if !method.is_static => {
                    names.insert(method.key.name.clone());
                }
                ClassMember::AutoAccessor(accessor) if !accessor.is_static => {
                    if let Key::Private(name) = &accessor.key {
                        names.insert(name.name.clone());
                    }
                }
                _ => {}
            }
        }

        names
    }

    fn collect_class_private_names(&self, members: &[ClassMember]) -> FxHashSet<Atom> {
        let mut names = FxHashSet::default();

        for member in members {
            match member {
                ClassMember::PrivateProp(prop) => {
                    names.insert(prop.key.name.clone());
                }
                ClassMember::PrivateMethod(method) => {
                    names.insert(method.key.name.clone());
                }
                ClassMember::AutoAccessor(accessor) => {
                    if let Key::Private(name) = &accessor.key {
                        names.insert(name.name.clone());
                    }
                }
                _ => {}
            }
        }

        names
    }

    fn expr_uses_instance_private_names(
        &self,
        expr: &Expr,
        instance_private_names: &FxHashSet<Atom>,
    ) -> bool {
        if instance_private_names.is_empty() {
            return false;
        }

        let mut v = InstancePrivateNameFinder {
            names: instance_private_names,
            found: false,
        };
        expr.visit_with(&mut v);
        v.found
    }

    fn stmts_use_instance_private_names(
        &self,
        stmts: &[Stmt],
        instance_private_names: &FxHashSet<Atom>,
    ) -> bool {
        if instance_private_names.is_empty() {
            return false;
        }

        let mut v = InstancePrivateNameFinder {
            names: instance_private_names,
            found: false,
        };
        stmts.visit_with(&mut v);
        v.found
    }

    fn function_uses_instance_private_names(
        &self,
        function: &Function,
        instance_private_names: &FxHashSet<Atom>,
    ) -> bool {
        if instance_private_names.is_empty() {
            return false;
        }

        let mut v = InstancePrivateNameFinder {
            names: instance_private_names,
            found: false,
        };
        function.visit_with(&mut v);
        v.found
    }

    fn rewrite_super_for_moved_static_member(&self, function: &mut Function, class_name: &Ident) {
        let no_super_class = None;
        let mut folder = SuperFieldAccessFolder {
            class_name,
            constructor_this_mark: None,
            is_static: true,
            folding_constructor: false,
            in_nested_scope: false,
            in_injected_define_property_call: false,
            this_alias_mark: None,
            constant_super: false,
            super_class: &no_super_class,
            in_pat: false,
        };

        function.visit_mut_with(&mut folder);
    }

    fn current_class_ref_for_super(&self) -> Option<Ident> {
        let class_name = self.current_class_name.as_ref()?;

        if let Some((sym, ctxt)) = self.rename_map.get(&class_name.to_id()) {
            Some(Ident::new(sym.clone(), class_name.span, *ctxt))
        } else {
            Some(class_name.clone())
        }
    }

    fn active_class_ref_for_super(&self) -> Option<Ident> {
        if let Some(Some(Pat::Ident(binding))) = self.state.class_lhs.first() {
            return Some(binding.id.clone());
        }

        self.current_class_ref_for_super()
    }

    fn maybe_alias_current_class_name_expr(&self, expr: &mut Expr) {
        let (Some(class_name), Some(alias)) = (
            self.current_class_name.as_ref(),
            self.class_member_class_ref_alias.as_ref(),
        ) else {
            return;
        };

        replace_ident(expr, class_name.to_id(), alias);
    }

    fn is_unresolved_ident(&self, ident: &Ident) -> bool {
        matches!(ident.ctxt.as_u32(), 0 | 1)
    }

    fn global_this_member_expr(&self, sym: Atom, span: Span) -> MemberExpr {
        MemberExpr {
            span,
            obj: Ident::new("globalThis".into(), span, SyntaxContext::empty()).into(),
            prop: MemberProp::Ident(Ident::new(sym, span, SyntaxContext::empty()).into()),
        }
    }

    fn memoize_static_closure(
        &mut self,
        hint: &str,
        expr: Box<Expr>,
        assignments: &mut Vec<Stmt>,
    ) -> Ident {
        let id = private_ident!(format!("_{hint}"));
        self.extra_vars.push(VarDeclarator {
            span: DUMMY_SP,
            name: id.clone().into(),
            init: None,
            definite: false,
        });

        assignments.push(
            ExprStmt {
                span: DUMMY_SP,
                expr: AssignExpr {
                    span: DUMMY_SP,
                    op: op!("="),
                    left: id.clone().into(),
                    right: expr,
                }
                .into(),
            }
            .into(),
        );

        id
    }

    fn call_closure_with_this(&self, closure: Ident) -> Box<Expr> {
        Box::new(Expr::Call(CallExpr {
            span: DUMMY_SP,
            callee: MemberExpr {
                span: DUMMY_SP,
                obj: closure.into(),
                prop: MemberProp::Ident(quote_ident!("call")),
            }
            .as_callee(),
            args: vec![ThisExpr { span: DUMMY_SP }.as_arg()],
            ..Default::default()
        }))
    }

    fn maybe_wrap_static_initializer_with_closure(
        &mut self,
        value: Option<Box<Expr>>,
        class_name: &Ident,
        instance_private_names: &FxHashSet<Atom>,
        assignments: &mut Vec<Stmt>,
    ) -> Option<Box<Expr>> {
        let value = value?;

        if !self.expr_uses_instance_private_names(&value, instance_private_names) {
            return Some(value);
        }

        let mut closure_fn = Function {
            span: DUMMY_SP,
            params: Vec::new(),
            body: Some(BlockStmt {
                span: DUMMY_SP,
                stmts: vec![Stmt::Return(ReturnStmt {
                    span: DUMMY_SP,
                    arg: Some(value),
                })],
                ..Default::default()
            }),
            is_async: false,
            is_generator: false,
            decorators: Default::default(),
            ..Default::default()
        };
        self.rewrite_super_for_moved_static_member(&mut closure_fn, class_name);

        let closure = self.memoize_static_closure(
            "fieldValue",
            Box::new(Expr::Fn(FnExpr {
                ident: None,
                function: Box::new(closure_fn),
            })),
            assignments,
        );

        Some(self.call_closure_with_this(closure))
    }

    fn lhs_bucket_mut(&mut self, is_static: bool, is_field: bool) -> &mut Vec<Ident> {
        match (is_static, is_field) {
            (true, false) => &mut self.state.static_non_field_lhs,
            (false, false) => &mut self.state.proto_non_field_lhs,
            (true, true) => &mut self.state.static_field_lhs,
            (false, true) => &mut self.state.proto_field_lhs,
        }
    }

    fn push_lhs(&mut self, ident: Ident, is_static: bool, is_field: bool) {
        self.lhs_bucket_mut(is_static, is_field).push(ident);
    }

    fn prepend_pending_instance_field_extras(
        &mut self,
        value: Option<Box<Expr>>,
        is_static: bool,
    ) -> Option<Box<Expr>> {
        if !self.is_2023_11()
            || is_static
            || self.state.pending_instance_field_extra_inits.is_empty()
        {
            return value;
        }

        let exprs = self
            .state
            .pending_instance_field_extra_inits
            .take()
            .into_iter()
            .chain(once(value.unwrap_or_else(|| Expr::undefined(DUMMY_SP))))
            .collect();
        Some(Expr::from_exprs(exprs))
    }

    fn queue_pending_instance_field_extra(&mut self, expr: Box<Expr>, is_static: bool) {
        if self.is_2023_11() && !is_static {
            self.state.pending_instance_field_extra_inits.push(expr);
        }
    }

    fn preserve_side_effect_of_decorators(
        &mut self,
        decorators: Vec<Decorator>,
    ) -> Vec<Option<ExprOrSpread>> {
        decorators
            .into_iter()
            .map(|e| Some(self.preserve_side_effect_of_decorator(e.expr).as_arg()))
            .collect()
    }

    fn preserve_decorator_this_target(&mut self, target: Box<Expr>) -> Box<Expr> {
        if target.is_ident() || target.is_this() {
            return target;
        }

        let ident = private_ident!("_dec_this");
        self.extra_vars.push(VarDeclarator {
            span: DUMMY_SP,
            name: ident.clone().into(),
            init: None,
            definite: false,
        });
        self.pre_class_inits.push(
            AssignExpr {
                span: DUMMY_SP,
                op: op!("="),
                left: ident.clone().into(),
                right: target,
            }
            .into(),
        );

        ident.into()
    }

    fn preserve_side_effect_of_decorator_2023(
        &mut self,
        dec: Box<Expr>,
    ) -> (Option<ExprOrSpread>, ExprOrSpread) {
        if let Expr::Member(member) = *dec {
            let this_target = self.preserve_decorator_this_target(member.obj);
            let dec = MemberExpr {
                span: member.span,
                obj: this_target.clone(),
                prop: member.prop,
            };

            return (Some(this_target.as_arg()), dec.as_arg());
        }

        if self.expr_uses_private_name(&dec) && !self.expr_uses_yield_or_await(&dec) {
            return (None, dec.as_arg());
        }

        let dec = self.preserve_side_effect_of_decorator(dec);
        (None, dec.as_arg())
    }

    fn merge_decorators_for_member(
        &mut self,
        decorators: Vec<Decorator>,
    ) -> (Option<ExprOrSpread>, bool) {
        if !self.is_2023_11() {
            let decorators = self.preserve_side_effect_of_decorators(decorators);
            return (merge_decorators(decorators), false);
        }

        let mut has_this = false;
        let mut preserved = Vec::with_capacity(decorators.len());
        for decorator in decorators {
            let (dec_this, dec) = self.preserve_side_effect_of_decorator_2023(decorator.expr);
            has_this |= dec_this.is_some();
            preserved.push((dec_this, dec));
        }

        let merged = if has_this {
            let mut elems = Vec::with_capacity(preserved.len() * 2);
            for (dec_this, dec) in preserved {
                elems.push(Some(
                    dec_this.unwrap_or_else(|| Expr::undefined(DUMMY_SP).as_arg()),
                ));
                elems.push(Some(dec));
            }
            Some(
                ArrayLit {
                    span: DUMMY_SP,
                    elems,
                }
                .as_arg(),
            )
        } else {
            let decorators = preserved.into_iter().map(|(_, dec)| Some(dec)).collect();
            merge_decorators(decorators)
        };

        (merged, has_this)
    }

    fn preserve_side_effect_of_decorators_for_class(
        &mut self,
        decorators: Vec<Decorator>,
    ) -> (Vec<Option<ExprOrSpread>>, bool) {
        if !self.is_2023_11() {
            return (self.preserve_side_effect_of_decorators(decorators), false);
        }

        let mut has_this = false;
        let mut preserved = Vec::with_capacity(decorators.len());
        for decorator in decorators {
            let (dec_this, dec) = if let Expr::Member(member) = *decorator.expr {
                let this_target = self.preserve_decorator_this_target(member.obj);
                let dec = self.preserve_side_effect_of_decorator_with_options(
                    MemberExpr {
                        span: member.span,
                        obj: this_target.clone(),
                        prop: member.prop,
                    }
                    .into(),
                    false,
                );
                (Some(this_target.as_arg()), dec.as_arg())
            } else {
                (
                    None,
                    self.preserve_side_effect_of_decorator_with_options(decorator.expr, false)
                        .as_arg(),
                )
            };
            has_this |= dec_this.is_some();
            preserved.push((dec_this, dec));
        }

        let decorators = if has_this {
            let mut elems = Vec::with_capacity(preserved.len() * 2);
            for (dec_this, dec) in preserved {
                elems.push(Some(
                    dec_this.unwrap_or_else(|| Expr::undefined(DUMMY_SP).as_arg()),
                ));
                elems.push(Some(dec));
            }
            elems
        } else {
            preserved.into_iter().map(|(_, dec)| Some(dec)).collect()
        };

        (decorators, has_this)
    }

    fn with_this_flag(&self, kind: i32, decorators_have_this: bool) -> i32 {
        if self.is_2023_11() && decorators_have_this {
            kind | 16
        } else {
            kind
        }
    }

    fn method_kind_code(
        &self,
        is_static: bool,
        kind: MethodKind,
        decorators_have_this: bool,
    ) -> i32 {
        let base = if self.is_2023_11() {
            let kind = match kind {
                MethodKind::Method => 2,
                MethodKind::Setter => 4,
                MethodKind::Getter => 3,
                #[cfg(swc_ast_unknown)]
                _ => panic!("unable to access unknown nodes"),
            };
            if is_static {
                kind | 8
            } else {
                kind
            }
        } else {
            match (is_static, kind) {
                (true, MethodKind::Method) => 7,
                (false, MethodKind::Method) => 2,
                (true, MethodKind::Setter) => 9,
                (false, MethodKind::Setter) => 4,
                (true, MethodKind::Getter) => 8,
                (false, MethodKind::Getter) => 3,
                #[cfg(swc_ast_unknown)]
                _ => panic!("unable to access unknown nodes"),
            }
        };

        self.with_this_flag(base, decorators_have_this)
    }

    fn field_kind_code(&self, is_static: bool, decorators_have_this: bool) -> i32 {
        let kind = if self.is_2023_11() {
            if is_static {
                8
            } else {
                0
            }
        } else if is_static {
            5
        } else {
            0
        };

        self.with_this_flag(kind, decorators_have_this)
    }

    fn accessor_kind_code(&self, is_static: bool, decorators_have_this: bool) -> i32 {
        let kind = if self.is_2023_11() {
            if is_static {
                9
            } else {
                1
            }
        } else if is_static {
            6
        } else {
            1
        };

        self.with_this_flag(kind, decorators_have_this)
    }

    fn instance_brand_arg(&self) -> Option<ExprOrSpread> {
        let brand = self.state.instance_brand.as_ref()?;
        let arg = quote_ident!("o");

        Some(
            ArrowExpr {
                span: DUMMY_SP,
                params: vec![arg.clone().into()],
                body: Box::new(BlockStmtOrExpr::Expr(
                    BinExpr {
                        span: DUMMY_SP,
                        left: Expr::PrivateName(brand.clone()).into(),
                        op: op!("in"),
                        right: arg.into(),
                    }
                    .into(),
                )),
                is_async: false,
                is_generator: false,
                ..Default::default()
            }
            .as_arg(),
        )
    }

    fn int_arg(value: i32) -> ExprOrSpread {
        Lit::Num(Number {
            span: DUMMY_SP,
            value: value as _,
            raw: None,
        })
        .as_arg()
    }

    fn member_kind_value(dec: &Option<ExprOrSpread>) -> Option<i32> {
        let dec = dec.as_ref()?;
        let Expr::Array(arr) = dec.expr.as_ref() else {
            return None;
        };
        let kind = arr.elems.get(1)?.as_ref()?;
        let Expr::Lit(Lit::Num(kind)) = kind.expr.as_ref() else {
            return None;
        };
        Some(kind.value as i32)
    }

    fn is_2022_field_dec(dec: &Option<ExprOrSpread>) -> bool {
        Self::member_kind_value(dec)
            .map(|kind| kind.rem_euclid(5) == 0)
            .unwrap_or(false)
    }

    fn partition_2022_member_decs(
        args: Vec<Option<ExprOrSpread>>,
    ) -> (Vec<Option<ExprOrSpread>>, Vec<Option<ExprOrSpread>>) {
        let mut non_fields = Vec::with_capacity(args.len());
        let mut fields = Vec::new();

        for arg in args {
            if Self::is_2022_field_dec(&arg) {
                fields.push(arg);
            } else {
                non_fields.push(arg);
            }
        }

        (non_fields, fields)
    }

    fn field_init_call_expr(
        &self,
        init: &Ident,
        is_static: bool,
        value: Option<Box<Expr>>,
    ) -> Box<Expr> {
        let args: Vec<ExprOrSpread> = if self.is_2023_11() && is_static {
            value.into_iter().map(|v| v.as_arg()).collect()
        } else {
            once(ThisExpr { span: DUMMY_SP }.as_arg())
                .chain(value.into_iter().map(|v| v.as_arg()))
                .collect()
        };

        CallExpr {
            span: DUMMY_SP,
            callee: init.clone().as_callee(),
            args,
            ..Default::default()
        }
        .into()
    }

    fn extra_init_call_expr(&self, init_extra: &Ident, is_static: bool) -> Box<Expr> {
        let args = if self.is_2023_11() && is_static {
            Vec::new()
        } else {
            vec![ThisExpr { span: DUMMY_SP }.as_arg()]
        };

        CallExpr {
            span: DUMMY_SP,
            callee: init_extra.clone().as_callee(),
            args,
            ..Default::default()
        }
        .into()
    }

    fn wrap_init_with_extra(&self, init_expr: Box<Expr>, extra_expr: Box<Expr>) -> Box<Expr> {
        let value_ident = private_ident!("_value");

        CallExpr {
            span: DUMMY_SP,
            callee: ArrowExpr {
                span: DUMMY_SP,
                params: Vec::new(),
                body: BlockStmtOrExpr::BlockStmt(BlockStmt {
                    span: DUMMY_SP,
                    stmts: vec![
                        VarDecl {
                            span: DUMMY_SP,
                            kind: VarDeclKind::Const,
                            decls: vec![VarDeclarator {
                                span: DUMMY_SP,
                                name: value_ident.clone().into(),
                                init: Some(init_expr),
                                definite: false,
                            }],
                            declare: false,
                            ..Default::default()
                        }
                        .into(),
                        ExprStmt {
                            span: DUMMY_SP,
                            expr: extra_expr,
                        }
                        .into(),
                        ReturnStmt {
                            span: DUMMY_SP,
                            arg: Some(value_ident.into()),
                        }
                        .into(),
                    ],
                    ..Default::default()
                })
                .into(),
                is_async: false,
                is_generator: false,
                ..Default::default()
            }
            .as_callee(),
            args: Vec::new(),
            ..Default::default()
        }
        .into()
    }

    fn preserve_side_effect_of_decorator_with_options(
        &mut self,
        dec: Box<Expr>,
        allow_class_name_queue: bool,
    ) -> Box<Expr> {
        if dec.is_ident()
            || dec.is_arrow()
            || dec.is_fn_expr()
            || (!self.is_2023_11() && self.expr_uses_current_class_private_name(&dec))
        {
            return dec;
        }

        let prefer_class_key = self.should_queue_class_key_init(&dec, allow_class_name_queue);
        let ident = private_ident!("_dec");
        self.extra_vars.push(VarDeclarator {
            span: DUMMY_SP,
            name: ident.clone().into(),
            init: None,
            definite: false,
        });
        self.queue_pre_class_init(
            AssignExpr {
                span: DUMMY_SP,
                op: op!("="),
                left: ident.clone().into(),
                right: dec,
            }
            .into(),
            prefer_class_key,
        );

        ident.into()
    }

    fn preserve_side_effect_of_decorator(&mut self, dec: Box<Expr>) -> Box<Expr> {
        self.preserve_side_effect_of_decorator_with_options(dec, true)
    }

    /// Moves `cur_inits` to `extra_stmts`.
    fn consume_inits(&mut self) {
        if self.state.init_proto_args.is_empty()
            && self.state.init_static_args.is_empty()
            && self.state.init_proto.is_none()
            && self.state.init_static.is_none()
            && self.state.class_decorators.is_empty()
        {
            return;
        }

        let mut e_lhs = Vec::new();
        let mut combined_args = vec![ThisExpr { span: DUMMY_SP }.as_arg()];

        let lhs_iter = if self.is_2023_11() {
            self.state
                .static_non_field_lhs
                .drain(..)
                .chain(self.state.proto_non_field_lhs.drain(..))
                .chain(self.state.static_field_lhs.drain(..))
                .chain(self.state.proto_field_lhs.drain(..))
                .collect::<Vec<_>>()
                .into_iter()
        } else {
            self.state
                .static_non_field_lhs
                .drain(..)
                .chain(self.state.static_field_lhs.drain(..))
                .chain(self.state.proto_non_field_lhs.drain(..))
                .chain(self.state.proto_field_lhs.drain(..))
                .collect::<Vec<_>>()
                .into_iter()
        };

        for id in lhs_iter {
            e_lhs.push(Some(id.into()));
        }

        if let Some(init) = self.state.init_proto.clone() {
            self.extra_vars.push(VarDeclarator {
                span: DUMMY_SP,
                name: init.clone().into(),
                init: None,
                definite: false,
            });

            e_lhs.push(Some(init.into()));
        }

        if let Some(init) = self.state.init_static.clone() {
            self.extra_vars.push(VarDeclarator {
                span: DUMMY_SP,
                name: init.clone().into(),
                init: None,
                definite: false,
            });

            e_lhs.push(Some(init.into()));
        }

        let member_decs = if self.is_2023_11() {
            ArrayLit {
                span: DUMMY_SP,
                elems: self
                    .state
                    .init_static_args
                    .drain(..)
                    .chain(self.state.init_proto_args.drain(..))
                    .collect(),
            }
        } else {
            let (static_non_fields, static_fields) =
                Self::partition_2022_member_decs(self.state.init_static_args.take());
            let (proto_non_fields, proto_fields) =
                Self::partition_2022_member_decs(self.state.init_proto_args.take());

            ArrayLit {
                span: DUMMY_SP,
                elems: static_non_fields
                    .into_iter()
                    .chain(static_fields)
                    .chain(proto_non_fields)
                    .chain(proto_fields)
                    .collect(),
            }
        };
        let class_decs = ArrayLit {
            span: DUMMY_SP,
            elems: self.state.class_decorators.take(),
        };

        let callee = if self.is_2023_11() {
            helper!(apply_decs_2311)
        } else {
            helper!(apply_decs_2203_r)
        };

        if self.is_2023_11() {
            let class_decorators_have_this = self.state.class_decorators_have_this;
            let instance_brand = self.instance_brand_arg();
            let has_super_class = self.state.super_class.is_some();

            combined_args.push(class_decs.as_arg());
            combined_args.push(member_decs.as_arg());

            if class_decorators_have_this || instance_brand.is_some() || has_super_class {
                combined_args.push(Self::int_arg(class_decorators_have_this as i32));
            }

            if instance_brand.is_some() || has_super_class {
                combined_args
                    .push(instance_brand.unwrap_or_else(|| Expr::undefined(DUMMY_SP).as_arg()));
            }

            if let Some(super_class) = self.state.super_class.as_ref() {
                combined_args.push(super_class.clone().as_arg());
            }
        } else {
            combined_args.push(member_decs.as_arg());
            combined_args.push(class_decs.as_arg());

            if let Some(super_class) = self.state.super_class.as_ref() {
                combined_args.push(super_class.clone().as_arg());
            }
        }
        self.state.class_decorators_have_this = false;
        self.state.instance_brand = None;

        let e_pat = if e_lhs.is_empty() {
            None
        } else {
            Some(ObjectPatProp::KeyValue(KeyValuePatProp {
                key: PropName::Ident(atom!("e").into()),
                value: ArrayPat {
                    span: DUMMY_SP,
                    elems: e_lhs,
                    type_ann: Default::default(),
                    optional: false,
                }
                .into(),
            }))
        };

        let c_pat = if self.state.class_lhs.is_empty() {
            None
        } else {
            Some(ObjectPatProp::KeyValue(KeyValuePatProp {
                key: PropName::Ident(atom!("c").into()),
                value: ArrayPat {
                    span: DUMMY_SP,
                    elems: self.state.class_lhs.take(),
                    type_ann: Default::default(),
                    optional: false,
                }
                .into(),
            }))
        };

        let expr = AssignExpr {
            span: DUMMY_SP,
            op: op!("="),
            left: ObjectPat {
                span: DUMMY_SP,
                props: e_pat.into_iter().chain(c_pat).collect(),
                optional: false,
                type_ann: None,
            }
            .into(),
            right: Box::new(
                CallExpr {
                    span: DUMMY_SP,
                    callee,
                    args: combined_args,
                    ..Default::default()
                }
                .into(),
            ),
        }
        .into();

        self.state.extra_stmts.push(
            ExprStmt {
                span: DUMMY_SP,
                expr,
            }
            .into(),
        );

        if let Some(init) = self.state.init_static.take() {
            self.state.extra_stmts.push(
                ExprStmt {
                    span: DUMMY_SP,
                    expr: CallExpr {
                        span: DUMMY_SP,
                        callee: init.as_callee(),
                        args: vec![ThisExpr { span: DUMMY_SP }.as_arg()],
                        ..Default::default()
                    }
                    .into(),
                }
                .into(),
            );
        }
    }

    /// Returns (name, initilaizer_name)
    fn initializer_name(&mut self, name: &mut PropName, prefix: &str) -> (Box<Expr>, Ident) {
        match name {
            PropName::Ident(i) => (
                Lit::Str(Str {
                    span: i.span,
                    value: i.sym.clone().into(),
                    raw: None,
                })
                .into(),
                Ident::new(
                    format!("_{prefix}_{}", i.sym).into(),
                    i.span,
                    SyntaxContext::empty().apply_mark(Mark::new()),
                ),
            ),
            PropName::Computed(c) if c.expr.is_ident() => match &*c.expr {
                Expr::Ident(i) => (
                    i.clone().into(),
                    Ident::new(
                        format!("_{prefix}_{}", i.sym).into(),
                        i.span,
                        SyntaxContext::empty().apply_mark(Mark::new()),
                    ),
                ),
                _ => {
                    unreachable!()
                }
            },
            _ => {
                let key_ident = private_ident!(name.span(), "_computedKey");
                self.extra_vars.push(VarDeclarator {
                    span: DUMMY_SP,
                    name: key_ident.clone().into(),
                    init: None,
                    definite: false,
                });

                let mut key_expr = self.maybe_to_property_key(prop_name_to_expr_value(name.take()));
                self.maybe_alias_current_class_name_expr(&mut key_expr);
                let prefer_class_key = self.should_queue_class_key_init(&key_expr, true);

                self.queue_pre_class_init(
                    AssignExpr {
                        span: DUMMY_SP,
                        op: op!("="),
                        left: key_ident.clone().into(),
                        right: Box::new(key_expr),
                    }
                    .into(),
                    prefer_class_key,
                );
                *name = PropName::Computed(ComputedPropName {
                    span: DUMMY_SP,
                    expr: key_ident.clone().into(),
                });

                let init = Ident::new(
                    format!("_{prefix}_computedKey").into(),
                    key_ident.span,
                    SyntaxContext::empty().apply_mark(Mark::new()),
                );

                (key_ident.into(), init)
            }
        }
    }

    fn ensure_constructor<'a>(&mut self, c: &'a mut Class) -> &'a mut Constructor {
        let mut insert_index = 0;
        for (i, member) in c.body.iter().enumerate() {
            if let ClassMember::Constructor(constructor) = member {
                // decorators occur before typescript's type strip, so skip ctor overloads
                if constructor.body.is_some() {
                    if let Some(ClassMember::Constructor(c)) = c.body.get_mut(i) {
                        return c;
                    } else {
                        unreachable!()
                    }
                } else {
                    insert_index = i + 1;
                }
            }
        }

        c.body.insert(
            insert_index,
            default_constructor_with_span(c.super_class.is_some(), c.span).into(),
        );

        if let Some(ClassMember::Constructor(c)) = c.body.get_mut(insert_index) {
            c
        } else {
            unreachable!()
        }
    }

    fn ensure_identity_constructor<'a>(&mut self, c: &'a mut Class) -> &'a mut Constructor {
        let mut insert_index = 0;
        for (i, member) in c.body.iter().enumerate() {
            if let ClassMember::Constructor(constructor) = member {
                // decorators occur before typescript's type strip, so skip ctor overloads
                if constructor.body.is_some() {
                    if let Some(ClassMember::Constructor(c)) = c.body.get_mut(i) {
                        return c;
                    } else {
                        unreachable!()
                    }
                } else {
                    insert_index = i + 1;
                }
            }
        }

        c.body.insert(
            insert_index,
            ClassMember::Constructor(Constructor {
                span: DUMMY_SP,
                key: PropName::Ident(atom!("constructor").into()),
                params: Vec::new(),
                body: Some(BlockStmt {
                    span: DUMMY_SP,
                    stmts: Vec::new(),
                    ..Default::default()
                }),
                ..Default::default()
            }),
        );

        if let Some(ClassMember::Constructor(c)) = c.body.get_mut(insert_index) {
            c
        } else {
            unreachable!()
        }
    }

    fn handle_super_class(&mut self, class: &mut Class) {
        if let Some(super_class) = class.super_class.take() {
            let id = alias_ident_for(&super_class, "_super");
            self.extra_vars.push(VarDeclarator {
                span: DUMMY_SP,
                name: id.clone().into(),
                init: None,
                definite: false,
            });

            if self.is_2023_11() {
                self.pre_class_inits.push(
                    AssignExpr {
                        span: DUMMY_SP,
                        op: AssignOp::Assign,
                        left: id.clone().into(),
                        right: super_class,
                    }
                    .into(),
                );
                class.super_class = Some(id.clone().into());
            } else {
                class.super_class = Some(
                    AssignExpr {
                        span: DUMMY_SP,
                        op: AssignOp::Assign,
                        left: id.clone().into(),
                        right: super_class,
                    }
                    .into(),
                );
            }

            self.state.super_class = Some(id);
        }
    }

    fn handle_class_expr(&mut self, class: &mut Class, ident: Option<&Ident>) -> Ident {
        debug_assert!(
            !class.decorators.is_empty(),
            "handle_class_decorator should be called only when decorators are present"
        );

        let init_class = private_ident!("_initClass");

        self.extra_vars.push(VarDeclarator {
            span: DUMMY_SP,
            name: init_class.clone().into(),
            init: None,
            definite: false,
        });

        let new_class_name = ident.as_ref().map_or_else(
            || private_ident!("_class"),
            |i| private_ident!(format!("_{}", i.sym)),
        );

        if let Some(ident) = ident {
            replace_ident(&mut class.body, ident.to_id(), &new_class_name);
        }

        self.state
            .class_lhs
            .push(Some(new_class_name.clone().into()));
        self.state.class_lhs.push(Some(init_class.clone().into()));

        self.extra_vars.push(VarDeclarator {
            span: DUMMY_SP,
            name: new_class_name.clone().into(),
            init: None,
            definite: false,
        });

        let (decorators, decorators_have_this) =
            self.preserve_side_effect_of_decorators_for_class(class.decorators.take());
        self.state.class_decorators.extend(decorators);
        self.state.class_decorators_have_this |= decorators_have_this;
        self.handle_super_class(class);

        {
            let call_stmt = CallExpr {
                span: DUMMY_SP,
                callee: init_class.as_callee(),
                args: Vec::new(),
                ..Default::default()
            }
            .into_stmt();

            class.body.push(ClassMember::StaticBlock(StaticBlock {
                span: DUMMY_SP,
                body: BlockStmt {
                    span: DUMMY_SP,
                    stmts: vec![call_stmt],
                    ..Default::default()
                },
            }));
        }

        new_class_name
    }

    // This function will call `visit` internally.
    fn handle_class_decl(&mut self, c: &mut ClassDecl) -> Stmt {
        let old_state = take(&mut self.state);
        let original_class_id = c.ident.to_id();

        let (decorators, decorators_have_this) =
            self.preserve_side_effect_of_decorators_for_class(c.class.decorators.take());

        let init_class = private_ident!("_initClass");

        self.extra_vars.push(VarDeclarator {
            span: DUMMY_SP,
            name: init_class.clone().into(),
            init: None,
            definite: false,
        });

        let preserved_class_name = c.ident.clone().into_private();
        let new_class_name = private_ident!(format!("_{}", c.ident.sym));
        let old_class_name = self.current_class_name.replace(c.ident.clone());
        let member_class_ref_alias = self
            .is_2023_11()
            .then(|| private_ident!(format!("_{}_member", c.ident.sym)));
        let old_member_class_ref_alias = std::mem::replace(
            &mut self.class_member_class_ref_alias,
            member_class_ref_alias.clone(),
        );

        self.extra_lets.push(VarDeclarator {
            span: DUMMY_SP,
            name: new_class_name.clone().into(),
            init: None,
            definite: false,
        });
        if let Some(member_class_ref_alias) = member_class_ref_alias.as_ref() {
            self.extra_lets.push(VarDeclarator {
                span: DUMMY_SP,
                name: member_class_ref_alias.clone().into(),
                init: None,
                definite: false,
            });
        }

        self.rename_map
            .insert(c.ident.to_id(), new_class_name.to_id());

        self.state
            .class_lhs
            .push(Some(new_class_name.clone().into()));
        self.state.class_lhs.push(Some(init_class.clone().into()));

        self.state.class_decorators.extend(decorators);
        self.state.class_decorators_have_this |= decorators_have_this;
        self.handle_super_class(&mut c.class);

        let mut body = c.class.body.take();

        let has_static_member = body.iter().any(|m| match m {
            ClassMember::Method(m) => m.is_static,
            ClassMember::PrivateMethod(m) => m.is_static,
            ClassMember::AutoAccessor(m) => m.is_static,
            ClassMember::ClassProp(ClassProp { is_static, .. })
            | ClassMember::PrivateProp(PrivateProp { is_static, .. }) => *is_static,
            ClassMember::StaticBlock(_) => true,
            _ => false,
        });

        if has_static_member {
            let mut last_static_block = None;

            self.process_decorators_of_class_members(&mut body);

            if let Some(member) = self.take_computed_key_init_member() {
                body.insert(0, member);
            }

            // Move static blocks into property initializers
            for m in body.iter_mut() {
                match m {
                    ClassMember::ClassProp(ClassProp {
                        is_static, value, ..
                    })
                    | ClassMember::PrivateProp(PrivateProp {
                        is_static, value, ..
                    }) => {
                        if !*is_static {
                            continue;
                        }

                        if let Some(last_static_block) = last_static_block.take() {
                            let static_iife = Box::new(Expr::Call(CallExpr {
                                span: DUMMY_SP,
                                callee: ArrowExpr {
                                    span: DUMMY_SP,
                                    params: Vec::new(),
                                    body: Box::new(BlockStmtOrExpr::BlockStmt(BlockStmt {
                                        span: DUMMY_SP,
                                        stmts: last_static_block,
                                        ..Default::default()
                                    })),
                                    is_async: false,
                                    is_generator: false,
                                    ..Default::default()
                                }
                                .as_callee(),
                                args: Vec::new(),
                                ..Default::default()
                            }));
                            let field_value =
                                value.take().unwrap_or_else(|| Expr::undefined(DUMMY_SP));
                            *value = Some(
                                SeqExpr {
                                    span: DUMMY_SP,
                                    exprs: vec![static_iife, field_value],
                                }
                                .into(),
                            );
                        }
                    }
                    ClassMember::StaticBlock(s) => match &mut last_static_block {
                        None => {
                            last_static_block = Some(s.body.stmts.take());
                        }
                        Some(v) => {
                            v.append(&mut s.body.stmts);
                        }
                    },
                    _ => {}
                }
            }

            // Drop static blocks
            body.retain(|m| !matches!(m, ClassMember::StaticBlock(..) | ClassMember::Empty(..)));

            for m in body.iter_mut() {
                match m {
                    ClassMember::ClassProp(..)
                    | ClassMember::PrivateProp(..)
                    | ClassMember::AutoAccessor(..) => {
                        replace_ident(m, c.ident.to_id(), &new_class_name);
                    }
                    ClassMember::Method(method) if method.is_static => {
                        replace_ident(method, c.ident.to_id(), &new_class_name);
                    }
                    ClassMember::PrivateMethod(method) if method.is_static => {
                        replace_ident(method, c.ident.to_id(), &new_class_name);
                    }

                    _ => {}
                }
            }

            let mut inner_class = ClassDecl {
                ident: c.ident.clone(),
                declare: Default::default(),
                class: Box::new(Class {
                    span: DUMMY_SP,
                    decorators: Vec::new(),
                    body,
                    super_class: c.class.super_class.take(),
                    ..Default::default()
                }),
            };

            inner_class.class.visit_mut_with(self);

            let instance_private_names =
                self.collect_instance_private_names(&inner_class.class.body);
            let mut static_closure_assignments = Vec::new();

            for m in inner_class.class.body.iter_mut() {
                let mut should_move = false;

                match m {
                    ClassMember::ClassProp(p) => {
                        if p.is_static {
                            p.value = self.maybe_wrap_static_initializer_with_closure(
                                p.value.take(),
                                &new_class_name,
                                &instance_private_names,
                                &mut static_closure_assignments,
                            );
                            should_move = true;
                            p.is_static = false;
                        }
                    }
                    ClassMember::PrivateProp(p) => {
                        if p.is_static {
                            p.value = self.maybe_wrap_static_initializer_with_closure(
                                p.value.take(),
                                &new_class_name,
                                &instance_private_names,
                                &mut static_closure_assignments,
                            );
                            should_move = true;
                            p.is_static = false;
                        }
                    }
                    ClassMember::PrivateMethod(p) => {
                        if p.is_static {
                            let has_instance_private_access = self
                                .function_uses_instance_private_names(
                                    &p.function,
                                    &instance_private_names,
                                );

                            if has_instance_private_access {
                                let mut delegated = (*p.function).clone();
                                self.rewrite_super_for_moved_static_member(
                                    &mut delegated,
                                    &new_class_name,
                                );

                                let delegate = self.memoize_static_closure(
                                    &p.key.name,
                                    Box::new(Expr::Fn(FnExpr {
                                        ident: None,
                                        function: Box::new(delegated),
                                    })),
                                    &mut static_closure_assignments,
                                );

                                let mut params = Vec::with_capacity(p.function.params.len());
                                let mut has_rest = false;
                                let mut rest_arg = None;
                                for (idx, param) in p.function.params.iter().enumerate() {
                                    if matches!(param.pat, Pat::Rest(..)) {
                                        has_rest = true;
                                        let arg = private_ident!("arg");
                                        rest_arg = Some(arg.clone());
                                        params.push(Param {
                                            span: DUMMY_SP,
                                            decorators: Default::default(),
                                            pat: Pat::Rest(RestPat {
                                                span: DUMMY_SP,
                                                dot3_token: DUMMY_SP,
                                                arg: Box::new(Pat::Ident(arg.into())),
                                                type_ann: None,
                                            }),
                                        });
                                    } else {
                                        params.push(Param {
                                            span: DUMMY_SP,
                                            decorators: Default::default(),
                                            pat: Pat::Ident(
                                                private_ident!(format!("_{idx}")).into(),
                                            ),
                                        });
                                    }
                                }

                                let forwarded_args = if has_rest {
                                    Expr::Ident(rest_arg.expect("rest argument should exist"))
                                } else {
                                    Expr::Ident(Ident::new(
                                        "arguments".into(),
                                        DUMMY_SP,
                                        SyntaxContext::empty(),
                                    ))
                                };

                                p.function.params = params;
                                p.function.body = Some(BlockStmt {
                                    span: DUMMY_SP,
                                    stmts: vec![Stmt::Return(ReturnStmt {
                                        span: DUMMY_SP,
                                        arg: Some(
                                            CallExpr {
                                                span: DUMMY_SP,
                                                callee: MemberExpr {
                                                    span: DUMMY_SP,
                                                    obj: delegate.into(),
                                                    prop: MemberProp::Ident(quote_ident!("apply")),
                                                }
                                                .as_callee(),
                                                args: vec![
                                                    ThisExpr { span: DUMMY_SP }.as_arg(),
                                                    forwarded_args.as_arg(),
                                                ],
                                                ..Default::default()
                                            }
                                            .into(),
                                        ),
                                    })],
                                    ..Default::default()
                                });
                            }

                            should_move = true;
                            p.is_static = false;
                        }
                    }

                    ClassMember::AutoAccessor(p) => {
                        if p.is_static {
                            p.value = self.maybe_wrap_static_initializer_with_closure(
                                p.value.take(),
                                &new_class_name,
                                &instance_private_names,
                                &mut static_closure_assignments,
                            );
                            should_move = true;
                            p.is_static = false;
                        }
                    }
                    _ => (),
                }

                if should_move {
                    c.class.body.push(m.take())
                }
            }

            let static_call = last_static_block.map(|last| {
                if self.stmts_use_instance_private_names(&last, &instance_private_names) {
                    let mut closure_fn = Function {
                        span: DUMMY_SP,
                        params: Vec::new(),
                        body: Some(BlockStmt {
                            span: DUMMY_SP,
                            stmts: last,
                            ..Default::default()
                        }),
                        is_async: false,
                        is_generator: false,
                        decorators: Default::default(),
                        ..Default::default()
                    };
                    self.rewrite_super_for_moved_static_member(&mut closure_fn, &new_class_name);

                    let closure = self.memoize_static_closure(
                        "staticBlock",
                        Box::new(Expr::Fn(FnExpr {
                            ident: None,
                            function: Box::new(closure_fn),
                        })),
                        &mut static_closure_assignments,
                    );

                    self.call_closure_with_this(closure)
                } else {
                    CallExpr {
                        span: DUMMY_SP,
                        callee: ArrowExpr {
                            span: DUMMY_SP,
                            params: Vec::new(),
                            body: Box::new(BlockStmtOrExpr::BlockStmt(BlockStmt {
                                span: DUMMY_SP,
                                stmts: last,
                                ..Default::default()
                            })),
                            is_async: false,
                            is_generator: false,
                            ..Default::default()
                        }
                        .as_callee(),
                        args: Vec::new(),
                        ..Default::default()
                    }
                    .into()
                }
            });

            if !static_closure_assignments.is_empty() {
                inner_class
                    .class
                    .body
                    .push(ClassMember::StaticBlock(StaticBlock {
                        span: DUMMY_SP,
                        body: BlockStmt {
                            span: DUMMY_SP,
                            stmts: static_closure_assignments,
                            ..Default::default()
                        },
                    }));
            }

            let inner_class_expr = Expr::Class(ClassExpr {
                ident: Some(inner_class.ident),
                class: inner_class.class,
            });
            c.class.body.insert(
                0,
                ClassMember::ClassProp(ClassProp {
                    span: DUMMY_SP,
                    key: PropName::Computed(ComputedPropName {
                        span: DUMMY_SP,
                        expr: Box::new(inner_class_expr),
                    }),
                    value: None,
                    type_ann: None,
                    is_static: true,
                    decorators: Default::default(),
                    accessibility: Default::default(),
                    is_abstract: false,
                    is_optional: false,
                    is_override: false,
                    readonly: false,
                    declare: false,
                    definite: false,
                }),
            );

            replace_ident(
                &mut c.class,
                original_class_id.clone(),
                &preserved_class_name,
            );

            {
                let constructor = self.ensure_identity_constructor(&mut c.class);

                let super_call = CallExpr {
                    span: DUMMY_SP,
                    callee: Callee::Super(Super { span: DUMMY_SP }),
                    args: vec![c.ident.clone().as_arg()],
                    ..Default::default()
                }
                .into();

                let init_class_call = CallExpr {
                    span: DUMMY_SP,
                    callee: init_class.as_callee(),
                    args: Vec::new(),
                    ..Default::default()
                }
                .into();
                let alias_assign = member_class_ref_alias
                    .clone()
                    .map(|member_class_ref_alias| {
                        AssignExpr {
                            span: DUMMY_SP,
                            op: op!("="),
                            left: member_class_ref_alias.into(),
                            right: new_class_name.clone().into(),
                        }
                        .into()
                    });

                constructor.body.as_mut().unwrap().stmts.insert(
                    0,
                    SeqExpr {
                        span: DUMMY_SP,
                        exprs: once(super_call)
                            .chain(static_call)
                            .chain(once(init_class_call))
                            .chain(alias_assign)
                            .collect(),
                    }
                    .into_stmt(),
                );
            }

            let class = Box::new(Class {
                span: DUMMY_SP,
                decorators: Vec::new(),
                body: c.class.body.take(),
                super_class: Some(Box::new(helper_expr!(identity))),
                ..Default::default()
            });

            self.state = old_state;
            self.current_class_name = old_class_name;
            self.class_member_class_ref_alias = old_member_class_ref_alias;

            return NewExpr {
                span: DUMMY_SP,
                callee: ClassExpr { ident: None, class }.into(),
                args: Some(Vec::new()),
                ..Default::default()
            }
            .into_stmt();
        }

        if has_static_member {
            for m in body.iter_mut() {
                match m {
                    ClassMember::ClassProp(prop) if prop.is_static => {
                        replace_ident(prop, c.ident.to_id(), &new_class_name);
                    }
                    ClassMember::PrivateProp(prop) if prop.is_static => {
                        replace_ident(prop, c.ident.to_id(), &new_class_name);
                    }
                    ClassMember::AutoAccessor(accessor) if accessor.is_static => {
                        replace_ident(accessor, c.ident.to_id(), &new_class_name);
                    }
                    ClassMember::Method(method) if method.is_static => {
                        replace_ident(method, c.ident.to_id(), &new_class_name);
                    }
                    ClassMember::PrivateMethod(method) if method.is_static => {
                        replace_ident(method, c.ident.to_id(), &new_class_name);
                    }
                    _ => {}
                }
            }
        }

        for m in body.iter_mut() {
            if let ClassMember::Constructor(..) = m {
                c.class.body.push(m.take());
            }
        }
        c.ident = preserved_class_name.clone();
        replace_ident(&mut c.class, original_class_id, &preserved_class_name);
        c.class.body.extend(body);
        c.class.visit_mut_with(self);
        let mut class_inits = vec![CallExpr {
            span: DUMMY_SP,
            callee: init_class.as_callee(),
            args: Vec::new(),
            ..Default::default()
        }
        .into_stmt()];

        if let Some(member_class_ref_alias) = member_class_ref_alias {
            class_inits.push(
                AssignExpr {
                    span: DUMMY_SP,
                    op: op!("="),
                    left: member_class_ref_alias.into(),
                    right: new_class_name.into(),
                }
                .into_stmt(),
            );
        }

        c.class.body.push(ClassMember::StaticBlock(StaticBlock {
            span: DUMMY_SP,
            body: BlockStmt {
                span: DUMMY_SP,
                stmts: class_inits,
                ..Default::default()
            },
        }));
        self.state = old_state;
        self.current_class_name = old_class_name;
        self.class_member_class_ref_alias = old_member_class_ref_alias;

        c.take().into()
    }

    fn process_decorators(&mut self, decorators: &mut [Decorator]) {
        decorators.iter_mut().for_each(|dec| {
            self.maybe_alias_current_class_name_expr(&mut dec.expr);

            let e = if self.is_2023_11()
                && (dec.expr.is_member()
                    || (self.expr_uses_private_name(&dec.expr)
                        && !self.expr_uses_yield_or_await(&dec.expr)))
            {
                dec.expr.take()
            } else {
                self.preserve_side_effect_of_decorator(dec.expr.take())
            };

            dec.expr = e;
        })
    }

    fn process_prop_name(&mut self, name: &mut PropName) {
        match name {
            PropName::Ident(..) => {}
            PropName::Computed(c) if c.expr.is_ident() => {}
            _ => {
                let ident = private_ident!("_computedKey");
                self.extra_vars.push(VarDeclarator {
                    span: DUMMY_SP,
                    name: ident.clone().into(),
                    init: None,
                    definite: false,
                });

                let mut key_expr = self.maybe_to_property_key(prop_name_to_expr_value(name.take()));
                self.maybe_alias_current_class_name_expr(&mut key_expr);
                let prefer_class_key = self.should_queue_class_key_init(&key_expr, true);

                self.queue_pre_class_init(
                    AssignExpr {
                        span: DUMMY_SP,
                        op: op!("="),
                        left: ident.clone().into(),
                        right: Box::new(key_expr),
                    }
                    .into(),
                    prefer_class_key,
                );
                *name = PropName::Computed(ComputedPropName {
                    span: DUMMY_SP,
                    expr: ident.into(),
                });
            }
        }
    }

    fn process_decorators_of_class_members(&mut self, members: &mut [ClassMember]) {
        for mut m in members {
            match &mut m {
                ClassMember::Method(m) if m.function.body.is_some() => {
                    self.process_decorators(&mut m.function.decorators);
                    self.process_prop_name(&mut m.key);
                }
                ClassMember::PrivateMethod(m) if m.function.body.is_some() => {
                    self.process_decorators(&mut m.function.decorators);
                }
                ClassMember::ClassProp(m) if !m.declare => {
                    self.process_decorators(&mut m.decorators);
                    self.process_prop_name(&mut m.key);
                }
                ClassMember::PrivateProp(m) => {
                    self.process_decorators(&mut m.decorators);
                }
                ClassMember::AutoAccessor(m) => {
                    self.process_decorators(&mut m.decorators);
                    if let Key::Public(key) = &mut m.key {
                        self.process_prop_name(key);
                    }
                }

                _ => {}
            }
        }
    }
}

impl VisitMut for DecoratorPass {
    noop_visit_mut_type!();

    fn visit_mut_class_decl(&mut self, n: &mut ClassDecl) {
        let old_name = self.current_class_name.take();
        self.current_class_name = Some(n.ident.clone());
        n.class.visit_mut_with(self);
        self.current_class_name = old_name;
    }

    fn visit_mut_class_expr(&mut self, n: &mut ClassExpr) {
        let old_name = self.current_class_name.take();
        self.current_class_name = n.ident.clone();
        n.class.visit_mut_with(self);
        self.current_class_name = old_name;
    }

    fn visit_mut_class(&mut self, n: &mut Class) {
        let old_stmts = self.state.extra_stmts.take();
        let old_pending_instance = self.state.pending_instance_field_extra_inits.take();
        let old_computed_key_inits = self.state.computed_key_inits.take();
        self.class_private_names
            .push(self.collect_class_private_names(&n.body));

        n.visit_mut_children_with(self);

        if let Some(init_proto) = self.state.init_proto.clone() {
            let init_proto_expr = CallExpr {
                span: DUMMY_SP,
                callee: init_proto.clone().as_callee(),
                args: vec![ThisExpr { span: DUMMY_SP }.as_arg()],
                ..Default::default()
            };
            // _initProto must run AFTER super() but BEFORE field initialization.
            // For 2022-03, we avoid injecting into truly private field initializers
            // because addInitializer callbacks can attempt private access before brand
            // setup. We still allow private storage generated for public accessors to
            // preserve ordering.
            // If there are no suitable fields with initializers, inject into the
            // constructor.
            let mut proto_inited = false;

            if self.is_2023_11() {
                for member in n.body.iter_mut() {
                    match member {
                        ClassMember::ClassProp(prop) => {
                            if prop.is_static {
                                continue;
                            }
                            if let Some(value) = prop.value.take() {
                                prop.value = Some(Expr::from_exprs(vec![
                                    init_proto_expr.clone().into(),
                                    value,
                                ]));

                                proto_inited = true;
                                break;
                            }
                        }
                        ClassMember::PrivateProp(prop) => {
                            if prop.is_static {
                                continue;
                            }
                            if let Some(value) = prop.value.take() {
                                prop.value = Some(Expr::from_exprs(vec![
                                    init_proto_expr.clone().into(),
                                    value,
                                ]));

                                proto_inited = true;
                                break;
                            }
                        }
                        _ => {}
                    }
                }
            } else {
                let body_len = n.body.len();
                for i in 0..body_len {
                    let should_inject = match &n.body[i] {
                        ClassMember::ClassProp(prop) => !prop.is_static && prop.value.is_some(),
                        ClassMember::PrivateProp(prop) => {
                            !prop.is_static
                                && prop.value.is_some()
                                && i + 1 < body_len
                                && matches!(
                                    &n.body[i + 1],
                                    ClassMember::Method(m) if m.kind == MethodKind::Getter
                                )
                        }
                        _ => false,
                    };

                    if !should_inject {
                        continue;
                    }

                    match &mut n.body[i] {
                        ClassMember::ClassProp(prop) => {
                            if let Some(value) = prop.value.take() {
                                prop.value = Some(Expr::from_exprs(vec![
                                    init_proto_expr.clone().into(),
                                    value,
                                ]));
                                proto_inited = true;
                                break;
                            }
                        }
                        ClassMember::PrivateProp(prop) => {
                            if let Some(value) = prop.value.take() {
                                prop.value = Some(Expr::from_exprs(vec![
                                    init_proto_expr.clone().into(),
                                    value,
                                ]));
                                proto_inited = true;
                                break;
                            }
                        }
                        _ => {}
                    }
                }
            }

            if !proto_inited {
                let c = self.ensure_constructor(n);

                inject_after_super(c, vec![Box::new(init_proto_expr.into())])
            }
        }

        if self.is_2023_11() && !self.state.pending_instance_field_extra_inits.is_empty() {
            let pending_instance = self.state.pending_instance_field_extra_inits.take();
            let is_derived = n.super_class.is_some();
            let ctor = self.ensure_constructor(n);

            if is_derived {
                inject_after_super(ctor, pending_instance);
            } else {
                let mut stmts = pending_instance
                    .into_iter()
                    .map(|expr| {
                        Stmt::Expr(ExprStmt {
                            span: DUMMY_SP,
                            expr,
                        })
                    })
                    .collect::<Vec<_>>();
                stmts.append(&mut ctor.body.as_mut().unwrap().stmts);
                ctor.body.as_mut().unwrap().stmts = stmts;
            }
        }

        self.consume_inits();

        let computed_key_init_member = self.take_computed_key_init_member();
        let inserted_computed_key_init = computed_key_init_member.is_some();

        if let Some(member) = computed_key_init_member {
            n.body.insert(0, member);
        }

        if !self.state.extra_stmts.is_empty() {
            n.body.insert(
                if inserted_computed_key_init { 1 } else { 0 },
                ClassMember::StaticBlock(StaticBlock {
                    span: DUMMY_SP,
                    body: BlockStmt {
                        span: DUMMY_SP,
                        stmts: self.state.extra_stmts.take(),
                        ..Default::default()
                    },
                }),
            );
        }

        self.state.init_proto = None;

        self.state.extra_stmts = old_stmts;
        self.state.pending_instance_field_extra_inits = old_pending_instance;
        self.state.computed_key_inits = old_computed_key_inits;
        self.class_private_names.pop();
    }

    fn visit_mut_class_member(&mut self, n: &mut ClassMember) {
        n.visit_mut_children_with(self);

        if let ClassMember::PrivateMethod(p) = n {
            if p.function.decorators.is_empty() {
                return;
            }

            let (dec, decorators_have_this) =
                self.merge_decorators_for_member(p.function.decorators.take());

            let init = private_ident!(format!("_call_{}", p.key.name));

            self.extra_vars.push(VarDeclarator {
                span: p.span,
                name: init.clone().into(),
                init: None,
                definite: false,
            });

            if p.is_static {
                self.state
                    .init_static
                    .get_or_insert_with(|| private_ident!("_initStatic"));
            } else {
                if self.is_2023_11() {
                    self.state
                        .instance_brand
                        .get_or_insert_with(|| p.key.clone());
                }
                self.state
                    .init_proto
                    .get_or_insert_with(|| private_ident!("_initProto"));
            }

            let mut caller_fn = (*p.function).clone();
            if self.is_2023_11() && p.is_static {
                if let Some(class_name) = self.active_class_ref_for_super() {
                    self.rewrite_super_for_moved_static_member(&mut caller_fn, &class_name);
                }
            }

            let caller = FnExpr {
                ident: None,
                function: Box::new(caller_fn),
            };

            let arg = Some(
                ArrayLit {
                    span: DUMMY_SP,
                    elems: vec![
                        dec,
                        Some(Self::int_arg(self.method_kind_code(
                            p.is_static,
                            p.kind,
                            decorators_have_this,
                        ))),
                        Some(p.key.name.clone().as_arg()),
                        Some(caller.as_arg()),
                    ],
                }
                .as_arg(),
            );
            if p.is_static {
                self.state.init_static_args.push(arg);
            } else {
                self.state.init_proto_args.push(arg);
            }

            self.push_lhs(init.clone(), p.is_static, false);

            match p.kind {
                MethodKind::Method => {
                    let call_stmt = ReturnStmt {
                        span: DUMMY_SP,
                        arg: Some(init.into()),
                    }
                    .into();

                    p.kind = MethodKind::Getter;
                    p.function.is_async = false;
                    p.function.is_generator = false;
                    p.function.body = Some(BlockStmt {
                        span: DUMMY_SP,
                        stmts: vec![call_stmt],
                        ..Default::default()
                    });
                }
                MethodKind::Getter => {
                    let args = vec![ThisExpr { span: DUMMY_SP }.as_arg()];
                    let call_stmt = ReturnStmt {
                        span: DUMMY_SP,
                        arg: Some(
                            CallExpr {
                                span: DUMMY_SP,
                                callee: init.as_callee(),
                                args,
                                ..Default::default()
                            }
                            .into(),
                        ),
                    }
                    .into();

                    p.function.body = Some(BlockStmt {
                        span: DUMMY_SP,
                        stmts: vec![call_stmt],
                        ..Default::default()
                    });
                }
                MethodKind::Setter => {
                    let value_arg =
                        Ident::from(p.function.params[0].pat.as_ident().unwrap()).as_arg();
                    let args = vec![ThisExpr { span: DUMMY_SP }.as_arg(), value_arg];
                    let call_stmt = ReturnStmt {
                        span: DUMMY_SP,
                        arg: Some(
                            CallExpr {
                                span: DUMMY_SP,
                                callee: init.as_callee(),
                                args,
                                ..Default::default()
                            }
                            .into(),
                        ),
                    }
                    .into();

                    p.function.body = Some(BlockStmt {
                        span: DUMMY_SP,
                        stmts: vec![call_stmt],
                        ..Default::default()
                    });
                }
                #[cfg(swc_ast_unknown)]
                _ => panic!("unable to access unknown nodes"),
            }
        }
    }

    fn visit_mut_class_members(&mut self, members: &mut Vec<ClassMember>) {
        let mut new = Vec::with_capacity(members.len());

        self.process_decorators_of_class_members(members);

        for mut m in members.take() {
            match m {
                ClassMember::AutoAccessor(mut accessor) => {
                    accessor.value.visit_mut_with(self);

                    let name;
                    let init;
                    let init_extra;
                    let field_name_like: Atom;
                    let private_field = PrivateProp {
                        span: DUMMY_SP,
                        key: match &mut accessor.key {
                            Key::Private(k) => {
                                name = Lit::Str(Str {
                                    span: DUMMY_SP,
                                    value: k.name.clone().into(),
                                    raw: None,
                                })
                                .into();
                                init = private_ident!(format!("_init_{}", k.name));
                                init_extra = self
                                    .is_2023_11()
                                    .then(|| private_ident!(format!("_init_extra_{}", init.sym)));
                                field_name_like = format!("__{}", k.name).into();

                                self.state.private_id_index += 1;
                                PrivateName {
                                    span: k.span,
                                    name: format!("__{}_{}", k.name, self.state.private_id_index)
                                        .into(),
                                }
                            }
                            Key::Public(k) => {
                                (name, init) = self.initializer_name(k, "init");
                                init_extra = self
                                    .is_2023_11()
                                    .then(|| private_ident!(format!("_init_extra_{}", init.sym)));
                                field_name_like = format!("__{}", init.sym)
                                    .replacen("init", "private", 1)
                                    .into();

                                self.state.private_id_index += 1;

                                PrivateName {
                                    span: init.span,
                                    name: format!(
                                        "{field_name_like}_{}",
                                        self.state.private_id_index
                                    )
                                    .into(),
                                }
                            }
                            #[cfg(swc_ast_unknown)]
                            _ => panic!("unable to access unknown nodes"),
                        },
                        value: if accessor.decorators.is_empty() {
                            self.prepend_pending_instance_field_extras(
                                accessor.value,
                                accessor.is_static,
                            )
                        } else {
                            let init_call = self.field_init_call_expr(
                                &init,
                                accessor.is_static,
                                accessor.value.take(),
                            );
                            let init_call = self
                                .prepend_pending_instance_field_extras(
                                    Some(init_call),
                                    accessor.is_static,
                                )
                                .unwrap();
                            Some(if let Some(init_extra) = &init_extra {
                                self.wrap_init_with_extra(
                                    init_call,
                                    self.extra_init_call_expr(init_extra, accessor.is_static),
                                )
                            } else {
                                init_call
                            })
                        },
                        type_ann: None,
                        is_static: accessor.is_static,
                        decorators: Default::default(),
                        accessibility: Default::default(),
                        is_optional: false,
                        is_override: false,
                        readonly: false,
                        definite: false,
                        ctxt: Default::default(),
                    };

                    let storage_obj: Box<Expr> =
                        if accessor.is_static && matches!(accessor.key, Key::Public(_)) {
                            self.current_class_name
                                .as_ref()
                                .map(|class_name| class_name.clone().into())
                                .unwrap_or_else(|| ThisExpr { span: DUMMY_SP }.into())
                        } else {
                            ThisExpr { span: DUMMY_SP }.into()
                        };

                    let mut getter_function = Box::new(Function {
                        params: Default::default(),
                        decorators: Default::default(),
                        span: DUMMY_SP,
                        body: Some(BlockStmt {
                            span: DUMMY_SP,
                            stmts: vec![Stmt::Return(ReturnStmt {
                                span: DUMMY_SP,
                                arg: Some(Box::new(Expr::Member(MemberExpr {
                                    span: DUMMY_SP,
                                    obj: storage_obj.clone(),
                                    prop: MemberProp::PrivateName(private_field.key.clone()),
                                }))),
                            })],
                            ..Default::default()
                        }),
                        is_generator: false,
                        is_async: false,
                        ..Default::default()
                    });
                    let mut setter_function = {
                        let param = private_ident!("_v");

                        Box::new(Function {
                            params: vec![Param {
                                span: DUMMY_SP,
                                decorators: Default::default(),
                                pat: param.clone().into(),
                            }],
                            decorators: Default::default(),
                            span: DUMMY_SP,
                            body: Some(BlockStmt {
                                span: DUMMY_SP,
                                stmts: vec![Stmt::Expr(ExprStmt {
                                    span: DUMMY_SP,
                                    expr: Box::new(Expr::Assign(AssignExpr {
                                        span: DUMMY_SP,
                                        op: op!("="),
                                        left: MemberExpr {
                                            span: DUMMY_SP,
                                            obj: storage_obj,
                                            prop: MemberProp::PrivateName(
                                                private_field.key.clone(),
                                            ),
                                        }
                                        .into(),
                                        right: param.clone().into(),
                                    })),
                                })],
                                ..Default::default()
                            }),
                            is_generator: false,
                            is_async: false,
                            ..Default::default()
                        })
                    };

                    if !accessor.decorators.is_empty() {
                        let (dec, decorators_have_this) =
                            self.merge_decorators_for_member(accessor.decorators.take());

                        if self.is_2023_11() && !accessor.is_static {
                            if let Key::Private(key) = &accessor.key {
                                self.state.instance_brand.get_or_insert_with(|| key.clone());
                            }
                        }

                        self.extra_vars.push(VarDeclarator {
                            span: accessor.span,
                            name: init.clone().into(),
                            init: None,
                            definite: false,
                        });
                        if let Some(init_extra) = &init_extra {
                            self.extra_vars.push(VarDeclarator {
                                span: accessor.span,
                                name: init_extra.clone().into(),
                                init: None,
                                definite: false,
                            });
                        }

                        let (getter_var, setter_var) = match &accessor.key {
                            Key::Private(_) => (
                                Some(private_ident!(format!("_get_{}", field_name_like))),
                                Some(private_ident!(format!("_set_{}", field_name_like))),
                            ),
                            Key::Public(_) => Default::default(),
                            #[cfg(swc_ast_unknown)]
                            _ => panic!("unable to access unknown nodes"),
                        };

                        let initialize_init = {
                            ArrayLit {
                                span: DUMMY_SP,
                                elems: match &accessor.key {
                                    Key::Private(_) => {
                                        let private_slot_getter = if self.is_2023_11() {
                                            let receiver = private_ident!("_this");
                                            Box::new(Function {
                                                span: DUMMY_SP,
                                                body: Some(BlockStmt {
                                                    span: DUMMY_SP,
                                                    stmts: vec![Stmt::Return(ReturnStmt {
                                                        span: DUMMY_SP,
                                                        arg: Some(
                                                            MemberExpr {
                                                                span: DUMMY_SP,
                                                                obj: receiver.clone().into(),
                                                                prop: MemberProp::PrivateName(
                                                                    private_field.key.clone(),
                                                                ),
                                                            }
                                                            .into(),
                                                        ),
                                                    })],
                                                    ..Default::default()
                                                }),
                                                is_async: false,
                                                is_generator: false,
                                                decorators: Default::default(),
                                                params: vec![Param {
                                                    span: DUMMY_SP,
                                                    decorators: Default::default(),
                                                    pat: Pat::Ident(receiver.into()),
                                                }],
                                                ..Default::default()
                                            })
                                        } else {
                                            getter_function.clone()
                                        };
                                        let private_slot_setter = if self.is_2023_11() {
                                            let receiver = private_ident!("_this");
                                            let setter_arg = private_ident!("_v");
                                            Box::new(Function {
                                                span: DUMMY_SP,
                                                body: Some(BlockStmt {
                                                    span: DUMMY_SP,
                                                    stmts: vec![Stmt::Expr(ExprStmt {
                                                        span: DUMMY_SP,
                                                        expr: Box::new(Expr::Assign(AssignExpr {
                                                            span: DUMMY_SP,
                                                            op: op!("="),
                                                            left: MemberExpr {
                                                                span: DUMMY_SP,
                                                                obj: receiver.clone().into(),
                                                                prop: MemberProp::PrivateName(
                                                                    private_field.key.clone(),
                                                                ),
                                                            }
                                                            .into(),
                                                            right: Box::new(Expr::Ident(
                                                                setter_arg.clone(),
                                                            )),
                                                        })),
                                                    })],
                                                    ..Default::default()
                                                }),
                                                is_async: false,
                                                is_generator: false,
                                                decorators: Default::default(),
                                                params: vec![
                                                    Param {
                                                        span: DUMMY_SP,
                                                        decorators: Default::default(),
                                                        pat: Pat::Ident(receiver.into()),
                                                    },
                                                    Param {
                                                        span: DUMMY_SP,
                                                        decorators: Default::default(),
                                                        pat: Pat::Ident(setter_arg.into()),
                                                    },
                                                ],
                                                ..Default::default()
                                            })
                                        } else {
                                            setter_function.clone()
                                        };
                                        let data = vec![
                                            dec,
                                            Some(Self::int_arg(self.accessor_kind_code(
                                                accessor.is_static,
                                                decorators_have_this,
                                            ))),
                                            Some(name.as_arg()),
                                            Some(
                                                FnExpr {
                                                    ident: None,
                                                    function: private_slot_getter,
                                                }
                                                .as_arg(),
                                            ),
                                            Some(
                                                FnExpr {
                                                    ident: None,
                                                    function: private_slot_setter,
                                                }
                                                .as_arg(),
                                            ),
                                        ];

                                        self.extra_vars.push(VarDeclarator {
                                            span: DUMMY_SP,
                                            name: getter_var.clone().unwrap().into(),
                                            init: None,
                                            definite: false,
                                        });
                                        self.extra_vars.push(VarDeclarator {
                                            span: DUMMY_SP,
                                            name: setter_var.clone().unwrap().into(),
                                            init: None,
                                            definite: false,
                                        });

                                        getter_function = Box::new(Function {
                                            params: Vec::new(),
                                            span: DUMMY_SP,
                                            body: Some(BlockStmt {
                                                span: DUMMY_SP,
                                                stmts: vec![Stmt::Return(ReturnStmt {
                                                    span: DUMMY_SP,
                                                    arg: Some(Box::new(Expr::Call(CallExpr {
                                                        span: DUMMY_SP,
                                                        callee: getter_var
                                                            .clone()
                                                            .unwrap()
                                                            .as_callee(),
                                                        args: if self.is_2023_11()
                                                            && accessor.is_static
                                                        {
                                                            Vec::new()
                                                        } else {
                                                            vec![ThisExpr { span: DUMMY_SP }
                                                                .as_arg()]
                                                        },
                                                        ..Default::default()
                                                    }))),
                                                })],
                                                ..Default::default()
                                            }),
                                            is_generator: false,
                                            is_async: false,
                                            ..Default::default()
                                        });

                                        let param = private_ident!("_v");

                                        setter_function = Box::new(Function {
                                            params: vec![Param {
                                                span: DUMMY_SP,
                                                decorators: Default::default(),
                                                pat: param.clone().into(),
                                            }],
                                            decorators: Default::default(),
                                            span: DUMMY_SP,
                                            body: Some(BlockStmt {
                                                span: DUMMY_SP,
                                                stmts: vec![Stmt::Expr(ExprStmt {
                                                    span: DUMMY_SP,
                                                    expr: Box::new(Expr::Call(CallExpr {
                                                        span: DUMMY_SP,
                                                        callee: setter_var
                                                            .clone()
                                                            .unwrap()
                                                            .as_callee(),
                                                        args: if self.is_2023_11()
                                                            && accessor.is_static
                                                        {
                                                            vec![param.as_arg()]
                                                        } else {
                                                            vec![
                                                                ThisExpr { span: DUMMY_SP }
                                                                    .as_arg(),
                                                                param.as_arg(),
                                                            ]
                                                        },
                                                        ..Default::default()
                                                    })),
                                                })],
                                                ..Default::default()
                                            }),
                                            is_generator: false,
                                            is_async: false,
                                            ..Default::default()
                                        });

                                        data
                                    }
                                    Key::Public(_) => {
                                        vec![
                                            dec,
                                            Some(Self::int_arg(self.accessor_kind_code(
                                                accessor.is_static,
                                                decorators_have_this,
                                            ))),
                                            Some(name.as_arg()),
                                        ]
                                    }
                                    #[cfg(swc_ast_unknown)]
                                    _ => panic!("unable to access unknown nodes"),
                                },
                            }
                            .as_arg()
                        };

                        if accessor.is_static {
                            self.push_lhs(init, true, false);
                            for ident in getter_var.into_iter().chain(setter_var) {
                                self.push_lhs(ident, true, false);
                            }
                            if let Some(init_extra) = init_extra {
                                self.push_lhs(init_extra, true, false);
                            }
                            self.state.init_static_args.push(Some(initialize_init));
                        } else {
                            self.push_lhs(init, false, false);
                            for ident in getter_var.into_iter().chain(setter_var) {
                                self.push_lhs(ident, false, false);
                            }
                            if let Some(init_extra) = init_extra {
                                self.push_lhs(init_extra, false, false);
                            }
                            self.state.init_proto_args.push(Some(initialize_init));
                        }

                        if !self.is_2023_11() {
                            if accessor.is_static {
                                self.state
                                    .init_static
                                    .get_or_insert_with(|| private_ident!("_initStatic"));
                            } else {
                                self.state
                                    .init_proto
                                    .get_or_insert_with(|| private_ident!("_initProto"));
                            }
                        }
                    }

                    match accessor.key {
                        Key::Private(key) => {
                            let getter = PrivateMethod {
                                span: DUMMY_SP,
                                key: key.clone(),
                                function: getter_function,
                                kind: MethodKind::Getter,
                                is_static: accessor.is_static,
                                accessibility: None,
                                is_abstract: false,
                                is_optional: false,
                                is_override: false,
                            };
                            let setter = PrivateMethod {
                                span: DUMMY_SP,
                                key: key.clone(),
                                function: setter_function,
                                kind: MethodKind::Setter,
                                is_static: accessor.is_static,
                                accessibility: None,
                                is_abstract: false,
                                is_optional: false,
                                is_override: false,
                            };

                            new.push(ClassMember::PrivateProp(private_field));
                            new.push(ClassMember::PrivateMethod(getter));
                            new.push(ClassMember::PrivateMethod(setter));
                        }
                        Key::Public(key) => {
                            let getter = ClassMethod {
                                span: DUMMY_SP,
                                key: key.clone(),
                                function: getter_function,
                                kind: MethodKind::Getter,
                                is_static: accessor.is_static,
                                accessibility: None,
                                is_abstract: false,
                                is_optional: false,
                                is_override: false,
                            };
                            let setter = ClassMethod {
                                span: DUMMY_SP,
                                key: key.clone(),
                                function: setter_function,
                                kind: MethodKind::Setter,
                                is_static: accessor.is_static,
                                accessibility: None,
                                is_abstract: false,
                                is_optional: false,
                                is_override: false,
                            };

                            new.push(ClassMember::PrivateProp(private_field));
                            new.push(ClassMember::Method(getter));
                            new.push(ClassMember::Method(setter));
                        }
                        #[cfg(swc_ast_unknown)]
                        _ => panic!("unable to access unknown nodes"),
                    }

                    continue;
                }

                ClassMember::Method(..) | ClassMember::PrivateMethod(..) => {
                    m.visit_mut_with(self);
                }
                ClassMember::ClassProp(..) | ClassMember::PrivateProp(..) => {
                    m.visit_mut_with(self);
                }

                _ => {}
            }

            new.push(m);
        }

        for mut m in new.take() {
            match m {
                ClassMember::Method(..)
                | ClassMember::PrivateMethod(..)
                | ClassMember::ClassProp(..)
                | ClassMember::PrivateProp(..)
                | ClassMember::AutoAccessor(..) => {}

                _ => {
                    if !m.span().is_dummy() {
                        m.visit_mut_with(self);
                    }
                }
            }

            new.push(m);
        }

        *members = new;
    }

    fn visit_mut_class_method(&mut self, n: &mut ClassMethod) {
        // method without body is TypeScript's method declaration.
        if n.function.body.is_none() {
            return;
        }

        n.visit_mut_children_with(self);

        if n.function.decorators.is_empty() {
            return;
        }

        let (dec, decorators_have_this) =
            self.merge_decorators_for_member(n.function.decorators.take());

        let (name, _init) = self.initializer_name(&mut n.key, "call");

        if n.is_static {
            self.state
                .init_static
                .get_or_insert_with(|| private_ident!("_initStatic"));
        } else {
            self.state
                .init_proto
                .get_or_insert_with(|| private_ident!("_initProto"));
        }

        let arg = Some(
            ArrayLit {
                span: DUMMY_SP,
                elems: vec![
                    dec,
                    Some(Self::int_arg(self.method_kind_code(
                        n.is_static,
                        n.kind,
                        decorators_have_this,
                    ))),
                    Some(name.as_arg()),
                ],
            }
            .as_arg(),
        );
        if n.is_static {
            self.state.init_static_args.push(arg);
        } else {
            self.state.init_proto_args.push(arg);
        }
    }

    fn visit_mut_class_prop(&mut self, p: &mut ClassProp) {
        if p.declare {
            return;
        }

        p.visit_mut_children_with(self);

        if p.decorators.is_empty() {
            p.value = self.prepend_pending_instance_field_extras(p.value.take(), p.is_static);
            return;
        }

        let (dec, decorators_have_this) = self.merge_decorators_for_member(p.decorators.take());

        let (name, init) = self.initializer_name(&mut p.key, "init");
        let init_extra = self
            .is_2023_11()
            .then(|| private_ident!(format!("_init_extra_{}", init.sym)));

        self.extra_vars.push(VarDeclarator {
            span: p.span,
            name: init.clone().into(),
            init: None,
            definite: false,
        });
        if let Some(init_extra) = &init_extra {
            self.extra_vars.push(VarDeclarator {
                span: p.span,
                name: init_extra.clone().into(),
                init: None,
                definite: false,
            });
        }

        let field_init_expr = self
            .prepend_pending_instance_field_extras(
                Some(self.field_init_call_expr(&init, p.is_static, p.value.take())),
                p.is_static,
            )
            .unwrap();
        p.value = Some(if self.is_2023_11() && !p.is_static {
            if let Some(init_extra) = &init_extra {
                self.queue_pending_instance_field_extra(
                    self.extra_init_call_expr(init_extra, p.is_static),
                    p.is_static,
                );
            }
            field_init_expr
        } else if let Some(init_extra) = &init_extra {
            self.wrap_init_with_extra(
                field_init_expr,
                self.extra_init_call_expr(init_extra, p.is_static),
            )
        } else {
            field_init_expr
        });

        let initialize_init = {
            Some(
                ArrayLit {
                    span: DUMMY_SP,
                    elems: vec![
                        dec,
                        Some(Self::int_arg(
                            self.field_kind_code(p.is_static, decorators_have_this),
                        )),
                        Some(name.as_arg()),
                    ],
                }
                .as_arg(),
            )
        };

        if p.is_static {
            self.push_lhs(init, true, true);
            if let Some(init_extra) = init_extra {
                self.push_lhs(init_extra, true, true);
            }
            self.state.init_static_args.push(initialize_init);
            if !self.is_2023_11() {
                self.state
                    .init_static
                    .get_or_insert_with(|| private_ident!("_initStatic"));
            }
        } else {
            self.push_lhs(init, false, true);
            if let Some(init_extra) = init_extra {
                self.push_lhs(init_extra, false, true);
            }
            self.state.init_proto_args.push(initialize_init);
            if !self.is_2023_11() {
                self.state
                    .init_proto
                    .get_or_insert_with(|| private_ident!("_initProto"));
            }
        }
    }

    fn visit_mut_expr(&mut self, e: &mut Expr) {
        if let Expr::Assign(assign) = e {
            assign.left.visit_mut_with(self);
            assign.right.visit_mut_with(self);

            if self.is_2023_11() && assign.op == op!("=") {
                if let AssignTarget::Simple(SimpleAssignTarget::Ident(binding)) = &assign.left {
                    let id = &binding.id;
                    if self.is_unresolved_ident(id) {
                        self.implicit_globals.insert(id.sym.clone());
                        assign.left = AssignTarget::Simple(SimpleAssignTarget::Member(
                            self.global_this_member_expr(id.sym.clone(), id.span),
                        ));
                    }
                }
            }

            return;
        }

        if let Expr::Ident(ident) = e {
            if self.is_2023_11()
                && self.is_unresolved_ident(ident)
                && self.implicit_globals.contains(&ident.sym)
            {
                *e = self
                    .global_this_member_expr(ident.sym.clone(), ident.span)
                    .into();
            }
            return;
        }

        if let Expr::Class(c) = e {
            if !c.class.decorators.is_empty() {
                let new = self.handle_class_expr(&mut c.class, c.ident.as_ref());

                c.visit_mut_with(self);

                *e = SeqExpr {
                    span: DUMMY_SP,
                    exprs: vec![Box::new(e.take()), Box::new(Expr::Ident(new))],
                }
                .into();

                return;
            }
        }

        maybe_grow_default(|| e.visit_mut_children_with(self));
    }

    fn visit_mut_module_item(&mut self, s: &mut ModuleItem) {
        match s {
            ModuleItem::ModuleDecl(ModuleDecl::ExportDecl(ExportDecl {
                span,
                decl: Decl::Class(c),
            })) if !c.class.decorators.is_empty() => {
                let ident = c.ident.clone();
                let span = *span;
                let old_name = self.current_class_name.take();
                self.current_class_name = Some(c.ident.clone());
                let new_stmt = self.handle_class_decl(c);
                self.current_class_name = old_name;

                *s = new_stmt.into();
                self.extra_exports
                    .push(ExportSpecifier::Named(ExportNamedSpecifier {
                        span,
                        orig: ModuleExportName::Ident(ident),
                        exported: None,
                        is_type_only: false,
                    }));
            }
            ModuleItem::ModuleDecl(ModuleDecl::ExportDefaultDecl(ExportDefaultDecl {
                span,
                decl: DefaultDecl::Class(c),
            })) if !c.class.decorators.is_empty() => {
                let ident = c
                    .ident
                    .get_or_insert_with(|| private_ident!("_default"))
                    .clone();

                let mut class_decl = c.take().as_class_decl().unwrap();
                let old_name = self.current_class_name.take();
                self.current_class_name = Some(class_decl.ident.clone());
                let new_stmt = self.handle_class_decl(&mut class_decl);
                self.current_class_name = old_name;

                self.extra_exports
                    .push(ExportSpecifier::Named(ExportNamedSpecifier {
                        span: *span,
                        orig: ModuleExportName::Ident(ident),
                        exported: Some(quote_ident!("default").into()),
                        is_type_only: false,
                    }));

                *s = new_stmt.into();
            }
            _ => {
                s.visit_mut_children_with(self);
            }
        }
    }

    fn visit_mut_module_items(&mut self, n: &mut Vec<ModuleItem>) {
        let extra_vars = self.extra_vars.take();
        let extra_lets = self.extra_lets.take();
        let pre_class_inits = self.pre_class_inits.take();
        let extra_exports = self.extra_exports.take();

        let mut insert_builder = InsertPassBuilder::new();

        for (index, n) in n.iter_mut().enumerate() {
            n.visit_mut_with(self);
            if !self.pre_class_inits.is_empty() {
                insert_builder.push_back(
                    index,
                    ExprStmt {
                        span: DUMMY_SP,
                        expr: Expr::from_exprs(self.pre_class_inits.take()),
                    }
                    .into(),
                );
            }
            if !self.extra_lets.is_empty() {
                insert_builder.push_back(
                    index,
                    VarDecl {
                        span: DUMMY_SP,
                        kind: VarDeclKind::Let,
                        decls: self.extra_lets.take(),
                        declare: false,
                        ..Default::default()
                    }
                    .into(),
                );
            }
        }

        if !self.extra_vars.is_empty() {
            let insert_pos = n
                .iter()
                .position(|module_item| match module_item {
                    ModuleItem::Stmt(stmt) => !is_maybe_branch_directive(stmt),
                    ModuleItem::ModuleDecl(_) => true,
                    #[cfg(swc_ast_unknown)]
                    _ => panic!("unable to access unknown nodes"),
                })
                .unwrap_or(0);
            insert_builder.push_front(
                insert_pos,
                VarDecl {
                    span: DUMMY_SP,
                    kind: if self.is_2023_11() {
                        VarDeclKind::Let
                    } else {
                        VarDeclKind::Var
                    },
                    decls: self.extra_vars.take(),
                    declare: false,
                    ..Default::default()
                }
                .into(),
            );
        }

        if !self.extra_exports.is_empty() {
            insert_builder.push_back(
                n.len() + 1,
                NamedExport {
                    span: DUMMY_SP,
                    specifiers: self.extra_exports.take(),
                    src: None,
                    type_only: false,
                    with: None,
                }
                .into(),
            );
        }

        *n = insert_builder.build(n.take());

        if !self.rename_map.is_empty() {
            n.visit_mut_with(&mut IdentRenamer::new(&self.rename_map));
        }

        self.extra_vars = extra_vars;
        self.extra_lets = extra_lets;
        self.pre_class_inits = pre_class_inits;
        self.extra_exports = extra_exports;
    }

    fn visit_mut_private_prop(&mut self, p: &mut PrivateProp) {
        p.visit_mut_children_with(self);

        if p.decorators.is_empty() {
            p.value = self.prepend_pending_instance_field_extras(p.value.take(), p.is_static);
            return;
        }

        let (dec, decorators_have_this) = self.merge_decorators_for_member(p.decorators.take());

        let init = private_ident!(format!("_init_{}", p.key.name));
        let init_extra = self
            .is_2023_11()
            .then(|| private_ident!(format!("_init_extra_{}", p.key.name)));

        self.extra_vars.push(VarDeclarator {
            span: p.span,
            name: init.clone().into(),
            init: None,
            definite: false,
        });
        if let Some(init_extra) = &init_extra {
            self.extra_vars.push(VarDeclarator {
                span: p.span,
                name: init_extra.clone().into(),
                init: None,
                definite: false,
            });
        }

        let field_init_expr = self
            .prepend_pending_instance_field_extras(
                Some(self.field_init_call_expr(&init, p.is_static, p.value.take())),
                p.is_static,
            )
            .unwrap();
        p.value = Some(if self.is_2023_11() && !p.is_static {
            if let Some(init_extra) = &init_extra {
                self.queue_pending_instance_field_extra(
                    self.extra_init_call_expr(init_extra, p.is_static),
                    p.is_static,
                );
            }
            field_init_expr
        } else if let Some(init_extra) = &init_extra {
            self.wrap_init_with_extra(
                field_init_expr,
                self.extra_init_call_expr(init_extra, p.is_static),
            )
        } else {
            field_init_expr
        });

        let initialize_init = {
            let (getter, setter) = if self.is_2023_11() {
                let receiver = private_ident!("_this");
                let getter_receiver = receiver.clone();
                let setter_arg = private_ident!("value");

                let getter = Box::new(Function {
                    span: DUMMY_SP,
                    body: Some(BlockStmt {
                        span: DUMMY_SP,
                        stmts: vec![Stmt::Return(ReturnStmt {
                            span: DUMMY_SP,
                            arg: Some(
                                MemberExpr {
                                    span: DUMMY_SP,
                                    obj: receiver.clone().into(),
                                    prop: MemberProp::PrivateName(p.key.clone()),
                                }
                                .into(),
                            ),
                        })],
                        ..Default::default()
                    }),
                    is_async: false,
                    is_generator: false,
                    decorators: Default::default(),
                    params: vec![Param {
                        span: DUMMY_SP,
                        decorators: Default::default(),
                        pat: Pat::Ident(getter_receiver.into()),
                    }],
                    ..Default::default()
                });

                let setter = Box::new(Function {
                    span: DUMMY_SP,
                    body: Some(BlockStmt {
                        span: DUMMY_SP,
                        stmts: vec![Stmt::Expr(ExprStmt {
                            span: DUMMY_SP,
                            expr: Box::new(Expr::Assign(AssignExpr {
                                span: DUMMY_SP,
                                op: op!("="),
                                left: MemberExpr {
                                    span: DUMMY_SP,
                                    obj: receiver.clone().into(),
                                    prop: MemberProp::PrivateName(p.key.clone()),
                                }
                                .into(),
                                right: Box::new(Expr::Ident(setter_arg.clone())),
                            })),
                        })],
                        ..Default::default()
                    }),
                    is_async: false,
                    is_generator: false,
                    decorators: Default::default(),
                    params: vec![
                        Param {
                            span: DUMMY_SP,
                            decorators: Default::default(),
                            pat: Pat::Ident(receiver.into()),
                        },
                        Param {
                            span: DUMMY_SP,
                            decorators: Default::default(),
                            pat: Pat::Ident(setter_arg.into()),
                        },
                    ],
                    ..Default::default()
                });

                (getter, setter)
            } else {
                let access_expr = MemberExpr {
                    span: DUMMY_SP,
                    obj: ThisExpr { span: DUMMY_SP }.into(),
                    prop: MemberProp::PrivateName(p.key.clone()),
                };

                let getter = Box::new(Function {
                    span: DUMMY_SP,
                    body: Some(BlockStmt {
                        span: DUMMY_SP,
                        stmts: vec![Stmt::Return(ReturnStmt {
                            span: DUMMY_SP,
                            arg: Some(access_expr.clone().into()),
                        })],
                        ..Default::default()
                    }),
                    is_async: false,
                    is_generator: false,
                    ..Default::default()
                });
                let setter_arg = private_ident!("value");
                let setter = Box::new(Function {
                    span: DUMMY_SP,
                    body: Some(BlockStmt {
                        span: DUMMY_SP,
                        stmts: vec![Stmt::Expr(ExprStmt {
                            span: DUMMY_SP,
                            expr: Box::new(Expr::Assign(AssignExpr {
                                span: DUMMY_SP,
                                op: op!("="),
                                left: access_expr.into(),
                                right: Box::new(Expr::Ident(setter_arg.clone())),
                            })),
                        })],
                        ..Default::default()
                    }),
                    is_async: false,
                    is_generator: false,
                    decorators: Default::default(),
                    params: vec![Param {
                        span: DUMMY_SP,
                        decorators: Default::default(),
                        pat: Pat::Ident(setter_arg.into()),
                    }],
                    ..Default::default()
                });

                (getter, setter)
            };

            ArrayLit {
                span: DUMMY_SP,
                elems: vec![
                    dec,
                    Some(Self::int_arg(
                        self.field_kind_code(p.is_static, decorators_have_this),
                    )),
                    Some((&*p.key.name).as_arg()),
                    Some(
                        FnExpr {
                            ident: None,
                            function: getter,
                        }
                        .as_arg(),
                    ),
                    Some(
                        FnExpr {
                            ident: None,
                            function: setter,
                        }
                        .as_arg(),
                    ),
                ],
            }
            .as_arg()
        };

        if p.is_static {
            self.push_lhs(init, true, true);
            if let Some(init_extra) = init_extra {
                self.push_lhs(init_extra, true, true);
            }
            self.state.init_static_args.push(Some(initialize_init));
            if !self.is_2023_11() {
                self.state
                    .init_static
                    .get_or_insert_with(|| private_ident!("_initStatic"));
            }
        } else {
            if self.is_2023_11() {
                self.state
                    .instance_brand
                    .get_or_insert_with(|| p.key.clone());
            }
            self.push_lhs(init, false, true);
            if let Some(init_extra) = init_extra {
                self.push_lhs(init_extra, false, true);
            }
            self.state.init_proto_args.push(Some(initialize_init));
            if !self.is_2023_11() {
                self.state
                    .init_proto
                    .get_or_insert_with(|| private_ident!("_initProto"));
            }
        }
    }

    fn visit_mut_stmt(&mut self, s: &mut Stmt) {
        match s {
            Stmt::Decl(Decl::Class(c)) if !c.class.decorators.is_empty() => {
                let old_name = self.current_class_name.take();
                self.current_class_name = Some(c.ident.clone());
                *s = self.handle_class_decl(c);
                self.current_class_name = old_name;
            }
            _ => {
                s.visit_mut_children_with(self);
            }
        }
    }

    fn visit_mut_stmts(&mut self, n: &mut Vec<Stmt>) {
        let old_state = take(&mut self.state);
        let old_pre_class_inits = self.pre_class_inits.take();
        let old_extra_lets = self.extra_lets.take();
        let old_extra_vars = self.extra_vars.take();

        let mut insert_builder = InsertPassBuilder::new();
        for (index, n) in n.iter_mut().enumerate() {
            n.visit_mut_with(self);
            if !self.pre_class_inits.is_empty() {
                insert_builder.push_back(
                    index,
                    ExprStmt {
                        span: DUMMY_SP,
                        expr: Expr::from_exprs(self.pre_class_inits.take()),
                    }
                    .into(),
                );
            }
            if !self.extra_lets.is_empty() {
                insert_builder.push_back(
                    index,
                    VarDecl {
                        span: DUMMY_SP,
                        kind: VarDeclKind::Let,
                        decls: self.extra_lets.take(),
                        declare: false,
                        ..Default::default()
                    }
                    .into(),
                );
            }
        }

        if !self.extra_vars.is_empty() {
            let insert_pos = n
                .iter()
                .position(|stmt| !is_maybe_branch_directive(stmt))
                .unwrap_or(0);
            insert_builder.push_front(
                insert_pos,
                VarDecl {
                    span: DUMMY_SP,
                    kind: if self.is_2023_11() {
                        VarDeclKind::Let
                    } else {
                        VarDeclKind::Var
                    },
                    decls: self.extra_vars.take(),
                    declare: false,
                    ..Default::default()
                }
                .into(),
            );
        }

        *n = insert_builder.build(n.take());

        self.extra_vars = old_extra_vars;
        self.extra_lets = old_extra_lets;
        self.pre_class_inits = old_pre_class_inits;
        self.state = old_state;
    }
}

/// Inserts into a vector on `build()` setting the correct
/// capacity. This is useful in scenarios where you're iterating
/// a vector to insert and all the inserts are in the order of
/// the iteration.
struct InsertPassBuilder<T> {
    inserts: VecDeque<(usize, T)>,
}

impl<T> InsertPassBuilder<T> {
    pub fn new() -> Self {
        Self {
            inserts: Default::default(),
        }
    }

    pub fn push_front(&mut self, index: usize, item: T) {
        if cfg!(debug_assertions) {
            if let Some(past) = self.inserts.front() {
                debug_assert!(past.0 >= index, "{} {}", past.0, index);
            }
        }
        self.inserts.push_front((index, item));
    }

    pub fn push_back(&mut self, index: usize, item: T) {
        if cfg!(debug_assertions) {
            if let Some(past) = self.inserts.back() {
                debug_assert!(past.0 <= index, "{} {}", past.0, index);
            }
        }
        self.inserts.push_back((index, item));
    }

    pub fn build(mut self, original: Vec<T>) -> Vec<T> {
        let capacity = original.len() + self.inserts.len();
        let mut new = Vec::with_capacity(capacity);
        for (index, item) in original.into_iter().enumerate() {
            while self
                .inserts
                .front()
                .map(|(item_index, _)| *item_index == index)
                .unwrap_or(false)
            {
                new.push(self.inserts.pop_front().unwrap().1);
            }
            new.push(item);
        }
        new.extend(self.inserts.into_iter().map(|v| v.1));

        debug_assert!(new.len() == capacity, "len: {} / {}", new.len(), capacity);
        new
    }
}

fn merge_decorators(decorators: Vec<Option<ExprOrSpread>>) -> Option<ExprOrSpread> {
    if decorators.len() == 1 {
        return decorators.into_iter().next().unwrap();
    }

    Some(
        ArrayLit {
            span: DUMMY_SP,
            elems: decorators,
        }
        .as_arg(),
    )
}
