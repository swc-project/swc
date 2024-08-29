use std::{collections::VecDeque, iter::once, mem::take};

use rustc_hash::FxHashMap;
use swc_atoms::Atom;
use swc_common::{util::take::Take, Spanned, DUMMY_SP};
use swc_ecma_ast::*;
use swc_ecma_transforms_base::{helper, helper_expr};
use swc_ecma_utils::{
    alias_ident_for, constructor::inject_after_super, default_constructor,
    is_maybe_branch_directive, private_ident, prop_name_to_expr_value, quote_ident, replace_ident,
    stack_size::maybe_grow_default, ExprFactory, IdentRenamer,
};
use swc_ecma_visit::{noop_visit_mut_type, visit_mut_pass, VisitMut, VisitMutWith};

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
}

#[derive(Default)]
struct ClassState {
    class_name: Option<Ident>,
    private_id_index: u32,

    static_lhs: Vec<Ident>,
    proto_lhs: Vec<Ident>,

    /// If not empty, `initProto` should be injected to the constructor.
    init_proto: Option<Ident>,
    init_proto_args: Vec<Option<ExprOrSpread>>,
    is_init_proto_called: bool,

    /// `fieldInitializerExpressions` of babel
    field_init_exprs: Vec<Box<Expr>>,
    /// `staticFieldInitializerExpressions` of babel
    static_field_init_exprs: Vec<Box<Expr>>,

    init_static: Option<Ident>,
    init_static_args: Vec<Option<ExprOrSpread>>,

    /// Injected into static blocks.
    extra_stmts: Vec<Stmt>,

    class_locals: Vec<Option<Pat>>,
    class_decorators: Vec<Option<ExprOrSpread>>,

    super_class: Option<Ident>,

    set_class_name: Option<Ident>,
    maybe_private_brand_name: Option<PrivateName>,
    class_decorations_flag: u32,
}

fn flag(base: u32, is_static: bool, version: DecoratorVersion) -> f64 {
    if !is_static {
        return base as f64;
    }

    match version {
        DecoratorVersion::V202311 => (base + 8) as f64,

        _ => (base + 5) as f64,
    }
}

impl DecoratorPass {
    fn preserve_side_effect_of_decorators(
        &mut self,
        decorators: Vec<Decorator>,
    ) -> Vec<Option<ExprOrSpread>> {
        decorators
            .into_iter()
            .map(|e| Some(self.preserve_side_effect_of_decorator(e.expr).as_arg()))
            .collect()
    }

    fn preserve_side_effect_of_decorator(&mut self, dec: Box<Expr>) -> Box<Expr> {
        if dec.is_ident() || dec.is_arrow() || dec.is_fn_expr() {
            return dec;
        }

        let ident = private_ident!("_dec");
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
                right: dec,
            }
            .into(),
        );

        ident.into()
    }

    fn create_set_function_name_call(&self, name: &Ident) -> Box<Expr> {
        CallExpr {
            span: DUMMY_SP,
            callee: helper!(set_function_name),
            args: vec![ThisExpr { span: DUMMY_SP }.as_arg(), name.clone().as_arg()],
            ..Default::default()
        }
        .into()
    }

    /// Moves `cur_inits` to `extra_stmts`.
    ///
    /// Similar to https://github.com/babel/babel/blob/440fe413330f19fdb2c5fa63ffab87e67383d12d/packages/babel-helper-create-class-features-plugin/src/decorators.ts#L2081
    fn consume_inits(&mut self) {
        if self.state.init_proto_args.is_empty()
            && self.state.init_static_args.is_empty()
            && self.state.init_proto.is_none()
            && self.state.init_static.is_none()
            && self.state.maybe_private_brand_name.is_none()
            && self.state.class_decorators.is_empty()
        {
            return;
        }
        let first_arg = match &self.state.set_class_name {
            Some(name) => self.create_set_function_name_call(name).as_arg(),
            _ => ThisExpr { span: DUMMY_SP }.as_arg(),
        };

        let mut element_locals = Vec::new();
        let mut combined_args = vec![first_arg];

        for id in self
            .state
            .static_lhs
            .drain(..)
            .chain(self.state.proto_lhs.drain(..))
        {
            element_locals.push(Some(id.into()));
        }

        if let Some(init) = self.state.init_proto.clone() {
            self.extra_vars.push(VarDeclarator {
                span: DUMMY_SP,
                name: init.clone().into(),
                init: None,
                definite: false,
            });

            element_locals.push(Some(init.into()));
        }

        if let Some(init) = self.state.init_static.clone() {
            self.extra_vars.push(VarDeclarator {
                span: DUMMY_SP,
                name: init.clone().into(),
                init: None,
                definite: false,
            });

            element_locals.push(Some(init.into()));
        }

        let element_decoration_arg = ArrayLit {
            span: DUMMY_SP,
            elems: self
                .state
                .init_static_args
                .drain(..)
                .chain(self.state.init_proto_args.drain(..))
                .collect(),
        }
        .as_arg();
        let class_decoration_arg = ArrayLit {
            span: DUMMY_SP,
            elems: self.state.class_decorators.take(),
        }
        .as_arg();
        // https://github.com/babel/babel/blob/440fe413330f19fdb2c5fa63ffab87e67383d12d/packages/babel-helper-create-class-features-plugin/src/decorators.ts#L2103-L2105
        match self.version {
            DecoratorVersion::V202311 => {
                combined_args.push(class_decoration_arg);
                combined_args.push(element_decoration_arg);
            }
            _ => {
                combined_args.push(element_decoration_arg);
                combined_args.push(class_decoration_arg);
            }
        }

        let class_locals = self.state.class_locals.take();

        let rhs: Box<Expr> = match self.version {
            DecoratorVersion::V202112 => todo!(),
            DecoratorVersion::V202203 => Box::new(
                CallExpr {
                    span: DUMMY_SP,
                    callee: helper!(apply_decs_2203_r),
                    args: combined_args,
                    ..Default::default()
                }
                .into(),
            ),
            DecoratorVersion::V202311 => {
                //

                if self.state.maybe_private_brand_name.is_some()
                    || self.state.super_class.is_some()
                    || self.state.class_decorations_flag != 0
                {
                    combined_args.push((self.state.class_decorations_flag as f64).as_arg());
                }

                if let Some(brand_name) = &self.state.maybe_private_brand_name {
                    combined_args
                        .push(self.create_private_brand_check_closure(brand_name).as_arg());
                } else if self.state.super_class.is_some() {
                    combined_args.push(Expr::undefined(DUMMY_SP).as_arg());
                }

                if let Some(super_class) = &self.state.super_class {
                    combined_args.push(super_class.clone().as_arg());
                }

                Box::new(
                    CallExpr {
                        span: DUMMY_SP,
                        callee: helper!(apply_decs_2311),
                        args: combined_args,
                        ..Default::default()
                    }
                    .into(),
                )
            }
        };

        // optimize `{ c: [classLocals] } = applyDecsHelper(...)` to
        // `[classLocals] = applyDecsHelper(...).c`

        let (lhs, rhs) = match (element_locals.is_empty(), class_locals.is_empty()) {
            (false, false) => {
                let element_locals = ObjectPatProp::KeyValue(KeyValuePatProp {
                    key: PropName::Ident("e".into()),
                    value: ArrayPat {
                        span: DUMMY_SP,
                        elems: element_locals,
                        type_ann: Default::default(),
                        optional: false,
                    }
                    .into(),
                });

                let class_locals = ObjectPatProp::KeyValue(KeyValuePatProp {
                    key: PropName::Ident("c".into()),
                    value: ArrayPat {
                        span: DUMMY_SP,
                        elems: class_locals,
                        type_ann: Default::default(),
                        optional: false,
                    }
                    .into(),
                });

                (
                    ObjectPat {
                        span: DUMMY_SP,
                        props: vec![element_locals, class_locals],
                        optional: false,
                        type_ann: None,
                    }
                    .into(),
                    rhs,
                )
            }
            (false, true) => (
                ArrayPat {
                    span: DUMMY_SP,
                    elems: element_locals,
                    type_ann: Default::default(),
                    optional: false,
                }
                .into(),
                rhs.make_member(quote_ident!("e")).into(),
            ),
            (true, false) => (
                ArrayPat {
                    span: DUMMY_SP,
                    elems: class_locals,
                    type_ann: Default::default(),
                    optional: false,
                }
                .into(),
                rhs.make_member(quote_ident!("c")).into(),
            ),
            (true, true) => unreachable!(),
        };

        let expr = AssignExpr {
            span: DUMMY_SP,
            op: op!("="),
            left: lhs,
            right: rhs,
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
                    value: i.sym.clone(),
                    raw: None,
                })
                .into(),
                Ident::new_private(format!("_{prefix}_{}", i.sym).into(), i.span),
            ),
            PropName::Computed(c) if c.expr.is_ident() => match &*c.expr {
                Expr::Ident(i) => (
                    i.clone().into(),
                    Ident::new_private(format!("_{prefix}_{}", i.sym).into(), i.span),
                ),
                _ => {
                    unreachable!()
                }
            },
            _ => {
                let value = prop_name_to_expr_value(match name {
                    PropName::Computed(c) => {
                        if c.expr.is_lit() {
                            name.clone()
                        } else {
                            name.take()
                        }
                    }
                    _ => name.clone(),
                });

                match value {
                    Expr::Lit(lit) => (
                        lit.clone().into(),
                        Ident::new_private(format!("_{prefix}_computedKey").into(), lit.span()),
                    ),
                    _ => {
                        let value = create_to_property_key(Box::new(value));

                        let key_ident = private_ident!("_computedKey");
                        self.extra_vars.push(VarDeclarator {
                            span: DUMMY_SP,
                            name: key_ident.clone().into(),
                            init: None,
                            definite: false,
                        });

                        self.pre_class_inits.push(
                            AssignExpr {
                                span: DUMMY_SP,
                                op: op!("="),
                                left: key_ident.clone().into(),
                                right: value,
                            }
                            .into(),
                        );
                        *name = PropName::Computed(ComputedPropName {
                            span: DUMMY_SP,
                            expr: key_ident.clone().into(),
                        });

                        let init = Ident::new_private(
                            format!("_{prefix}_computedKey").into(),
                            key_ident.span,
                        );

                        (key_ident.into(), init)
                    }
                }
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
            default_constructor(c.super_class.is_some()).into(),
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
                key: PropName::Ident("constructor".into()),
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

            class.super_class = Some(
                AssignExpr {
                    span: DUMMY_SP,
                    op: AssignOp::Assign,
                    left: id.clone().into(),
                    right: super_class,
                }
                .into(),
            );

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
            .class_locals
            .push(Some(new_class_name.clone().into()));
        self.state
            .class_locals
            .push(Some(init_class.clone().into()));

        self.extra_vars.push(VarDeclarator {
            span: DUMMY_SP,
            name: new_class_name.clone().into(),
            init: None,
            definite: false,
        });

        let decorators = self.preserve_side_effect_of_decorators(class.decorators.take());
        self.state.class_decorators.extend(decorators);
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
        self.state.class_name = Some(c.ident.clone());

        let decorators = self.preserve_side_effect_of_decorators(c.class.decorators.take());

        let init_class = private_ident!("_initClass");

        self.extra_vars.push(VarDeclarator {
            span: DUMMY_SP,
            name: init_class.clone().into(),
            init: None,
            definite: false,
        });

        let preserved_class_name = c.ident.clone().into_private();
        let new_class_name = private_ident!(format!("_{}", c.ident.sym));

        self.extra_lets.push(VarDeclarator {
            span: DUMMY_SP,
            name: new_class_name.clone().into(),
            init: None,
            definite: false,
        });

        self.rename_map
            .insert(c.ident.to_id(), new_class_name.to_id());

        self.state
            .class_locals
            .push(Some(new_class_name.clone().into()));
        self.state
            .class_locals
            .push(Some(init_class.clone().into()));

        self.state.class_decorators.extend(decorators);
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

            // Move static blocks into property initializers
            for m in body.iter_mut() {
                match m {
                    ClassMember::ClassProp(ClassProp { value, .. })
                    | ClassMember::PrivateProp(PrivateProp { value, .. }) => {
                        if let Some(value) = value {
                            if let Some(last_static_block) = last_static_block.take() {
                                **value = SeqExpr {
                                    span: DUMMY_SP,
                                    exprs: vec![
                                        Box::new(Expr::Call(CallExpr {
                                            span: DUMMY_SP,
                                            callee: ArrowExpr {
                                                span: DUMMY_SP,
                                                params: Vec::new(),
                                                body: Box::new(BlockStmtOrExpr::BlockStmt(
                                                    BlockStmt {
                                                        span: DUMMY_SP,
                                                        stmts: last_static_block,
                                                        ..Default::default()
                                                    },
                                                )),
                                                is_async: false,
                                                is_generator: false,
                                                ..Default::default()
                                            }
                                            .as_callee(),
                                            args: Vec::new(),
                                            ..Default::default()
                                        })),
                                        value.take(),
                                    ],
                                }
                                .into()
                            }
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

            for m in inner_class.class.body.iter_mut() {
                let mut should_move = false;

                match m {
                    ClassMember::PrivateProp(p) => {
                        if p.is_static {
                            should_move = true;
                            p.is_static = false;
                        }
                    }
                    ClassMember::PrivateMethod(p) => {
                        if p.is_static {
                            should_move = true;
                            p.is_static = false;
                        }
                    }

                    ClassMember::AutoAccessor(p) => {
                        if p.is_static {
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

            c.class.body.insert(
                0,
                ClassMember::StaticBlock(StaticBlock {
                    span: DUMMY_SP,
                    body: BlockStmt {
                        span: DUMMY_SP,
                        stmts: vec![Stmt::Decl(Decl::Class(inner_class))],
                        ..Default::default()
                    },
                }),
            );

            replace_ident(&mut c.class, c.ident.to_id(), &preserved_class_name);

            {
                let constructor = self.ensure_identity_constructor(&mut c.class);

                let super_call = CallExpr {
                    span: DUMMY_SP,
                    callee: Callee::Super(Super { span: DUMMY_SP }),
                    args: vec![c.ident.clone().as_arg()],
                    ..Default::default()
                }
                .into();
                let static_call = last_static_block.map(|last| {
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
                });

                let init_class_call = CallExpr {
                    span: DUMMY_SP,
                    callee: init_class.as_callee(),
                    args: Vec::new(),
                    ..Default::default()
                }
                .into();

                constructor.body.as_mut().unwrap().stmts.insert(
                    0,
                    SeqExpr {
                        span: DUMMY_SP,
                        exprs: once(super_call)
                            .chain(static_call)
                            .chain(once(init_class_call))
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

            return NewExpr {
                span: DUMMY_SP,
                callee: ClassExpr { ident: None, class }.into(),
                args: Some(Vec::new()),
                ..Default::default()
            }
            .into_stmt();
        }
        for m in body.iter_mut() {
            if let ClassMember::Constructor(..) = m {
                c.class.body.push(m.take());
            }
        }
        body.visit_mut_with(self);
        c.visit_mut_with(self);
        c.ident = preserved_class_name.clone();
        replace_ident(&mut c.class, c.ident.to_id(), &preserved_class_name);
        c.class.body.extend(body);
        c.class.body.push(ClassMember::StaticBlock(StaticBlock {
            span: DUMMY_SP,
            body: BlockStmt {
                span: DUMMY_SP,
                stmts: vec![CallExpr {
                    span: DUMMY_SP,
                    callee: init_class.as_callee(),
                    args: Vec::new(),
                    ..Default::default()
                }
                .into_stmt()],
                ..Default::default()
            },
        }));
        self.state = old_state;

        c.take().into()
    }

    fn process_decorators(&mut self, decorators: &mut [Decorator]) {
        decorators.iter_mut().for_each(|dec| {
            let e = self.preserve_side_effect_of_decorator(dec.expr.take());

            dec.expr = e;
        })
    }

    fn process_prop_name(&mut self, name: &mut PropName) {
        match name {
            PropName::Ident(..) | PropName::Num(..) | PropName::Str(..) | PropName::BigInt(..) => {}
            PropName::Computed(c) if c.expr.is_ident() || c.expr.is_lit() => {}
            _ => {
                let ident = private_ident!("_computedKey");
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
                        right: create_to_property_key(Box::new(prop_name_to_expr_value(
                            name.take(),
                        ))),
                    }
                    .into(),
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
                }

                _ => {}
            }
        }
    }

    fn create_private_brand_check_closure(&self, brand_name: &PrivateName) -> Box<Expr> {
        let param = private_ident!("_");
        ArrowExpr {
            params: vec![param.clone().into()],
            body: Box::new(BlockStmtOrExpr::Expr(
                BinExpr {
                    span: DUMMY_SP,
                    op: op!("in"),
                    left: brand_name.clone().into(),
                    right: param.clone().into(),
                }
                .into(),
            )),
            ..Default::default()
        }
        .into()
    }

    fn inject_init_extra_inner(&mut self, name: Atom, is_static: bool) {
        // https://github.com/babel/babel/blob/440fe413330f19fdb2c5fa63ffab87e67383d12d/packages/babel-helper-create-class-features-plugin/src/decorators.ts#L1631
        if let DecoratorVersion::V202311 = self.version {
        } else {
            return;
        }

        let init_extra_id = Ident::new_private(format!("_init_extra_{name}").into(), DUMMY_SP);

        self.extra_vars.push(VarDeclarator {
            span: DUMMY_SP,
            name: init_extra_id.clone().into(),
            init: None,
            definite: false,
        });

        let init_extra_call: Box<Expr> = CallExpr {
            callee: init_extra_id.clone().as_callee(),
            args: if is_static {
                vec![]
            } else {
                vec![ThisExpr { span: DUMMY_SP }.as_arg()]
            },
            ..Default::default()
        }
        .into();

        if is_static {
            self.state.static_lhs.push(init_extra_id.clone());
            self.state.static_field_init_exprs.push(init_extra_call);
        } else {
            self.state.proto_lhs.push(init_extra_id.clone());
            self.state.field_init_exprs.push(init_extra_call);
        }
    }
}

fn create_to_property_key(key: Box<Expr>) -> Box<Expr> {
    CallExpr {
        callee: helper!(to_property_key),
        args: vec![key.as_arg()],
        ..Default::default()
    }
    .into()
}

impl VisitMut for DecoratorPass {
    noop_visit_mut_type!();

    fn visit_mut_class(&mut self, n: &mut Class) {
        let old_stmts = self.state.extra_stmts.take();

        n.visit_mut_children_with(self);

        if (!self.state.is_init_proto_called && self.state.init_proto.is_some())
            || !self.state.field_init_exprs.is_empty()
        {
            let c = self.ensure_constructor(n);
            let mut exprs = vec![];

            if !self.state.is_init_proto_called {
                if let Some(init_proto) = self.state.init_proto.clone() {
                    exprs.push(Box::new(Expr::Call(CallExpr {
                        span: DUMMY_SP,
                        callee: init_proto.as_callee(),
                        args: vec![ThisExpr { span: DUMMY_SP }.as_arg()],
                        ..Default::default()
                    })));
                }
            }
            exprs.append(&mut self.state.field_init_exprs);
            inject_after_super(c, exprs)
        }

        self.consume_inits();

        if !self.state.extra_stmts.is_empty() {
            n.body.insert(
                0,
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

        if !self.state.static_field_init_exprs.is_empty() {
            n.body.push(ClassMember::StaticBlock(StaticBlock {
                span: DUMMY_SP,
                body: BlockStmt {
                    span: DUMMY_SP,
                    stmts: vec![
                        Expr::from_exprs(self.state.static_field_init_exprs.take()).into_stmt()
                    ],
                    ..Default::default()
                },
            }));
        }

        self.state.init_proto = None;
        self.state.is_init_proto_called = false;

        self.state.extra_stmts = old_stmts;
    }

    fn visit_mut_class_member(&mut self, n: &mut ClassMember) {
        n.visit_mut_children_with(self);

        if let ClassMember::PrivateMethod(p) = n {
            if p.function.decorators.is_empty() {
                return;
            }

            let decorators = self.preserve_side_effect_of_decorators(p.function.decorators.take());
            let dec = merge_decorators(decorators);

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
                self.state
                    .init_proto
                    .get_or_insert_with(|| private_ident!("_initProto"));
            }

            let caller = FnExpr {
                ident: None,
                function: p.function.clone(),
            };

            let arg = Some(
                ArrayLit {
                    span: DUMMY_SP,
                    elems: vec![
                        dec,
                        Some(
                            flag(
                                match p.kind {
                                    MethodKind::Method => 2,
                                    MethodKind::Setter => 4,
                                    MethodKind::Getter => 3,
                                },
                                p.is_static,
                                self.version,
                            )
                            .as_arg(),
                        ),
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

            if p.is_static {
                self.state.static_lhs.push(init.clone());
            } else {
                self.state.proto_lhs.push(init.clone());
            }

            match p.kind {
                MethodKind::Method => {
                    let call_stmt = ReturnStmt {
                        span: DUMMY_SP,
                        arg: Some(init.into()),
                    }
                    .into();

                    p.kind = MethodKind::Getter;
                    p.function.body = Some(BlockStmt {
                        span: DUMMY_SP,
                        stmts: vec![call_stmt],
                        ..Default::default()
                    });
                }
                MethodKind::Getter => {
                    let call_stmt = ReturnStmt {
                        span: DUMMY_SP,
                        arg: Some(
                            CallExpr {
                                span: DUMMY_SP,
                                callee: init.as_callee(),
                                args: vec![ThisExpr { span: DUMMY_SP }.as_arg()],
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
                    let call_stmt = ReturnStmt {
                        span: DUMMY_SP,
                        arg: Some(
                            CallExpr {
                                span: DUMMY_SP,
                                callee: init.as_callee(),
                                args: vec![
                                    ThisExpr { span: DUMMY_SP }.as_arg(),
                                    Ident::from(p.function.params[0].pat.as_ident().unwrap())
                                        .as_arg(),
                                ],
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
            }
        }
    }

    fn visit_mut_class_members(&mut self, members: &mut Vec<ClassMember>) {
        let mut new = Vec::with_capacity(members.len());

        self.process_decorators_of_class_members(members);

        for mut m in members.take() {
            match m {
                ClassMember::AutoAccessor(mut accessor) => {
                    let init_extra_name = match &accessor.key {
                        Key::Private(k) => k.name.clone(),
                        Key::Public(k) => prop_name_to_symbol(k),
                    };

                    accessor.value.visit_mut_with(self);

                    let name;
                    let init;
                    let field_name_like: Atom;
                    let private_field = PrivateProp {
                        span: DUMMY_SP,
                        key: match &mut accessor.key {
                            Key::Private(k) => {
                                name = Lit::Str(Str {
                                    span: DUMMY_SP,
                                    value: k.name.clone(),
                                    raw: None,
                                })
                                .into();
                                init = private_ident!(format!("_init_{}", k.name));
                                field_name_like = format!("{}", k.name).into();

                                self.state.private_id_index += 1;
                                PrivateName {
                                    span: k.span,
                                    name: format!("__{}_{}", k.name, self.state.private_id_index)
                                        .into(),
                                }
                            }
                            Key::Public(k) => {
                                (name, init) = self.initializer_name(k, "init");
                                field_name_like = format!("{}", init.sym)
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
                        },
                        value: {
                            let value = if accessor.decorators.is_empty() {
                                accessor.value
                            } else {
                                let init_proto =
                                    if self.state.is_init_proto_called || accessor.is_static {
                                        None
                                    } else {
                                        self.state.is_init_proto_called = true;

                                        let init_proto = self
                                            .state
                                            .init_proto
                                            .get_or_insert_with(|| private_ident!("_initProto"))
                                            .clone();

                                        Some(
                                            CallExpr {
                                                span: DUMMY_SP,
                                                callee: init_proto.clone().as_callee(),
                                                args: vec![ThisExpr { span: DUMMY_SP }.as_arg()],
                                                ..Default::default()
                                            }
                                            .into(),
                                        )
                                    };

                                let init_call = CallExpr {
                                    span: DUMMY_SP,
                                    callee: init.clone().as_callee(),
                                    args: match self.version {
                                        DecoratorVersion::V202311 => {
                                            if accessor.is_static {
                                                None
                                            } else {
                                                Some(ThisExpr { span: DUMMY_SP }.as_arg())
                                            }
                                        }
                                        _ => Some(ThisExpr { span: DUMMY_SP }.as_arg()),
                                    }
                                    .into_iter()
                                    .chain(accessor.value.take().map(|v| v.as_arg()))
                                    .collect(),
                                    ..Default::default()
                                }
                                .into();

                                Some(Expr::from_exprs(
                                    init_proto.into_iter().chain(once(init_call)).collect(),
                                ))
                            };

                            // Prepend `fieldInitializerExpressions` to the value.
                            // If value is `None`, we use `void 0` as the value.

                            let init_exprs = if accessor.is_static {
                                &mut self.state.static_field_init_exprs
                            } else {
                                &mut self.state.field_init_exprs
                            };

                            if !init_exprs.is_empty() || value.is_some() {
                                init_exprs.push(value.unwrap_or_else(|| Expr::undefined(DUMMY_SP)));
                            }

                            if init_exprs.is_empty() {
                                None
                            } else {
                                Some(Expr::from_exprs(init_exprs.take()))
                            }
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

                    // https://github.com/babel/babel/blob/440fe413330f19fdb2c5fa63ffab87e67383d12d/packages/babel-helper-create-class-features-plugin/src/decorators.ts#L210C2-L215C28
                    let this_arg: Box<Expr> = match self.version {
                        DecoratorVersion::V202311 => {
                            if accessor.is_static && self.state.class_name.is_some() {
                                self.state.class_name.clone().unwrap().into()
                            } else {
                                ThisExpr { span: DUMMY_SP }.into()
                            }
                        }

                        _ => ThisExpr { span: DUMMY_SP }.into(),
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
                                    obj: this_arg.clone(),
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
                        let param = private_ident!("v");

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
                                            obj: this_arg.clone(),
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
                        let decorators =
                            self.preserve_side_effect_of_decorators(accessor.decorators.take());
                        let dec = merge_decorators(decorators);

                        self.extra_vars.push(VarDeclarator {
                            span: accessor.span,
                            name: init.clone().into(),
                            init: None,
                            definite: false,
                        });

                        let (getter_var, setter_var) = match &accessor.key {
                            Key::Private(_) => (
                                Some(private_ident!(format!("_get_{}", field_name_like))),
                                Some(private_ident!(format!("_set_{}", field_name_like))),
                            ),
                            Key::Public(_) => Default::default(),
                        };

                        let initialize_init = {
                            ArrayLit {
                                span: DUMMY_SP,
                                elems: match &accessor.key {
                                    Key::Private(_) => {
                                        let data = vec![
                                            dec,
                                            Some(
                                                flag(1, accessor.is_static, self.version).as_arg(),
                                            ),
                                            Some(name.as_arg()),
                                            Some(
                                                FnExpr {
                                                    ident: None,
                                                    function: getter_function,
                                                }
                                                .as_arg(),
                                            ),
                                            Some(
                                                FnExpr {
                                                    ident: None,
                                                    function: setter_function,
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
                                                        args: vec![this_arg.clone().as_arg()],
                                                        ..Default::default()
                                                    }))),
                                                })],
                                                ..Default::default()
                                            }),
                                            is_generator: false,
                                            is_async: false,
                                            ..Default::default()
                                        });

                                        let param = private_ident!("v");

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
                                                        args: vec![
                                                            this_arg.clone().as_arg(),
                                                            param.as_arg(),
                                                        ],
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
                                            Some(
                                                flag(1, accessor.is_static, self.version).as_arg(),
                                            ),
                                            Some(name.as_arg()),
                                        ]
                                    }
                                },
                            }
                            .as_arg()
                        };

                        if accessor.is_static {
                            self.state.static_lhs.push(init);
                            self.state.init_static_args.push(Some(initialize_init));
                            self.state
                                .static_lhs
                                .extend(getter_var.into_iter().chain(setter_var));
                        } else {
                            self.state.proto_lhs.push(init);
                            self.state.init_proto_args.push(Some(initialize_init));
                            self.state
                                .proto_lhs
                                .extend(getter_var.into_iter().chain(setter_var));
                        }

                        self.inject_init_extra_inner(init_extra_name, accessor.is_static);

                        // https://github.com/babel/babel/blob/440fe413330f19fdb2c5fa63ffab87e67383d12d/packages/babel-helper-create-class-features-plugin/src/decorators.ts#L1130-L1143
                        match self.version {
                            DecoratorVersion::V202311 => {}
                            _ => {
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
                    }

                    continue;
                }

                ClassMember::Method(..) | ClassMember::PrivateMethod(..) => {
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

        let decorators = self.preserve_side_effect_of_decorators(n.function.decorators.take());
        let dec = merge_decorators(decorators);

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
                    Some(
                        flag(
                            match n.kind {
                                MethodKind::Method => 2,
                                MethodKind::Setter => 4,
                                MethodKind::Getter => 3,
                            },
                            n.is_static,
                            self.version,
                        )
                        .as_arg(),
                    ),
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
            return;
        }

        let init_extra_name = prop_name_to_symbol(&p.key);

        let decorators = self.preserve_side_effect_of_decorators(p.decorators.take());
        let dec = merge_decorators(decorators);

        let (name, init) = self.initializer_name(&mut p.key, "init");

        self.extra_vars.push(VarDeclarator {
            span: p.span,
            name: init.clone().into(),
            init: None,
            definite: false,
        });

        p.value = Some(
            CallExpr {
                span: DUMMY_SP,
                callee: init.clone().as_callee(),
                args: once(ThisExpr { span: DUMMY_SP }.as_arg())
                    .chain(p.value.take().map(|v| v.as_arg()))
                    .collect(),

                ..Default::default()
            }
            .into(),
        );

        let initialize_init = {
            Some(
                ArrayLit {
                    span: DUMMY_SP,
                    elems: vec![
                        dec,
                        Some(flag(0, p.is_static, self.version).as_arg()),
                        Some(name.as_arg()),
                    ],
                }
                .as_arg(),
            )
        };

        if p.is_static {
            self.state.static_lhs.push(init);
            self.state.init_static_args.push(initialize_init);
        } else {
            self.state.proto_lhs.push(init);
            self.state.init_proto_args.push(initialize_init);
        }

        self.inject_init_extra_inner(init_extra_name, p.is_static)
    }

    fn visit_mut_expr(&mut self, e: &mut Expr) {
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
                let new_stmt = self.handle_class_decl(c);

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
                let new_stmt = self.handle_class_decl(&mut class_decl);

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
        }

        if !self.extra_vars.is_empty() {
            let insert_pos = n
                .iter()
                .position(|module_item| match module_item {
                    ModuleItem::Stmt(stmt) => !is_maybe_branch_directive(stmt),
                    ModuleItem::ModuleDecl(_) => true,
                })
                .unwrap_or(0);
            insert_builder.push_front(
                insert_pos,
                VarDecl {
                    span: DUMMY_SP,
                    kind: VarDeclKind::Var,
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
            return;
        }

        let decorators = self.preserve_side_effect_of_decorators(p.decorators.take());
        let dec = merge_decorators(decorators);

        let init = private_ident!(format!("_init_{}", p.key.name));

        self.extra_vars.push(VarDeclarator {
            span: p.span,
            name: init.clone().into(),
            init: None,
            definite: false,
        });

        p.value = Some(
            CallExpr {
                span: DUMMY_SP,
                callee: init.clone().as_callee(),
                args: once(ThisExpr { span: DUMMY_SP }.as_arg())
                    .chain(p.value.take().map(|v| v.as_arg()))
                    .collect(),
                ..Default::default()
            }
            .into(),
        );

        let initialize_init = {
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
            let settter_arg = private_ident!("value");
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
                            right: Box::new(Expr::Ident(settter_arg.clone())),
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
                    pat: Pat::Ident(settter_arg.into()),
                }],
                ..Default::default()
            });

            ArrayLit {
                span: DUMMY_SP,
                elems: vec![
                    dec,
                    Some(flag(0, p.is_static, self.version).as_arg()),
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
            self.state.static_lhs.push(init);
            self.state.init_static_args.push(Some(initialize_init));
        } else {
            self.state.proto_lhs.push(init);
            self.state.init_proto_args.push(Some(initialize_init));
        }
    }

    fn visit_mut_stmt(&mut self, s: &mut Stmt) {
        match s {
            Stmt::Decl(Decl::Class(c)) if !c.class.decorators.is_empty() => {
                *s = self.handle_class_decl(c);
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
                    kind: VarDeclKind::Var,
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

fn prop_name_to_symbol(key: &PropName) -> Atom {
    match key {
        PropName::Ident(i) => i.sym.clone(),
        _ => "computedKey".into(),
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
