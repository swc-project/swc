use std::mem;

use swc_common::{util::take::Take, DUMMY_SP};
use swc_ecma_ast::*;
use swc_ecma_utils::{
    constructor::inject_after_super, default_constructor, is_literal, is_simple_pure_expr,
    private_ident, prop_name_to_member_prop, ExprFactory, ModuleItemLike, StmtLike,
};
use swc_ecma_visit::{as_folder, noop_visit_mut_type, Fold, VisitMut, VisitMutWith};

/// # What does this module do?
///
/// This module will transpile the class semantics
/// from `[[Define]]` to `[[Set]]`.
///
///
/// Note: class's native field is `[[Define]]` semantics.
///
/// # Why is it needed?
/// The getter/setter from the super class won't be triggered in `[[Define]]`
/// semantics.
///
/// Some decorators depend on super class getter/setter.
/// Therefore, scenarios like this will require `[[Set]]` semantics.
///
/// ## Example
///
/// ```JavaScript
/// class Foo {
///     a = 1;
///     #b = 2;
///     static c = 3;
///     static #d = 4;
/// }
/// ```
///
/// result:
///
/// ```JavaScript
/// class Foo {
///     #b;
///     static {
///         this.c = 3;
///     }
///     static #d = 4;
///     constructor() {
///         this.a = 1;
///         this.#b = 2;
///     }
/// }
/// ```
///
/// The variable `a` will be relocated to the constructor. Although the variable
/// `#b` is not influenced by `[[Define]]` or `[[Set]]` semantics, its execution
/// order is associated with variable `a`, thus its initialization is moved into
/// the constructor.
///
/// The static variable `c` is moved to the static block for `[[Set]]` semantic
/// conversion. Whereas, variable `#d` remains completely unaffected and
/// conserved in its original location.
///
/// Furthermore, for class props that have side effects, an extraction and
/// conversion will be performed.
///
/// For example,
///
/// ```JavaScript
/// class Foo {
///     [foo()] = 1;
/// }
/// ```
///
/// result:
///
/// ```JavaScript
/// let prop;
/// class Foo{
///     static {
///         prop = foo();
///     }
///     constructor() {
///         this[prop] = 1;
///     }
/// }
/// ```
pub fn class_fields_use_set(pure_getters: bool) -> impl Fold + VisitMut {
    as_folder(ClassFieldsUseSet { pure_getters })
}

#[derive(Debug)]
struct ClassFieldsUseSet {
    pure_getters: bool,
}

impl VisitMut for ClassFieldsUseSet {
    noop_visit_mut_type!();

    fn visit_mut_module_items(&mut self, n: &mut Vec<ModuleItem>) {
        self.visit_mut_stmts_like(n);
    }

    fn visit_mut_stmts(&mut self, n: &mut Vec<Stmt>) {
        self.visit_mut_stmts_like(n);
    }

    fn visit_mut_class(&mut self, n: &mut Class) {
        // visit inner classes first
        n.visit_mut_children_with(self);

        let mut fields_handler = FieldsHandler::default();
        n.body.visit_mut_with(&mut fields_handler);

        let FieldsHandler {
            constructor_inits,
            constructor_found,
            ..
        } = fields_handler;

        if constructor_inits.is_empty() {
            return;
        }

        let mut constructor_handler = ConstructorHandler {
            has_super: n.super_class.is_some(),
            constructor_inits,
            constructor_found,
        };
        n.body.visit_mut_with(&mut constructor_handler);
    }
}

impl ClassFieldsUseSet {
    fn visit_mut_stmts_like<T>(&mut self, n: &mut Vec<T>)
    where
        T: StmtLike
            + ModuleItemLike
            + VisitMutWith<Self>
            + VisitMutWith<ComputedFieldsHandler>
            + From<Stmt>,
    {
        let mut stmts = Vec::with_capacity(n.len());

        let mut computed_fields_handler = ComputedFieldsHandler {
            var_decls: Default::default(),
            static_init_blocks: Default::default(),
            pure_getters: self.pure_getters,
        };

        for mut stmt in n.drain(..) {
            stmt.visit_mut_with(&mut computed_fields_handler);

            let var_decls = computed_fields_handler.var_decls.take();

            if !var_decls.is_empty() {
                stmts.push(T::from(
                    VarDecl {
                        span: DUMMY_SP,
                        kind: VarDeclKind::Let,
                        declare: false,
                        decls: var_decls,
                    }
                    .into(),
                ))
            }

            stmt.visit_mut_with(self);

            stmts.push(stmt);
        }
        *n = stmts;
    }
}

#[derive(Debug, Default)]
struct FieldsHandler {
    constructor_inits: Vec<Box<Expr>>,
    constructor_found: bool,
}

impl VisitMut for FieldsHandler {
    noop_visit_mut_type!();

    fn visit_mut_class(&mut self, _: &mut Class) {
        // skip inner classes
        // In fact, FieldsHandler does not visit children recursively.
        // We call FieldsHandler with the class.body as the only entry point.
        // The FieldsHandler actually operates in a iterative way.
    }

    fn visit_mut_class_member(&mut self, n: &mut ClassMember) {
        match n {
            ClassMember::Constructor(..) => self.constructor_found = true,
            ClassMember::ClassProp(ClassProp {
                ref span,
                ref is_static,
                key,
                value,
                ..
            }) => {
                if let Some(value) = value.take() {
                    let init_expr: Expr = AssignExpr {
                        span: *span,
                        op: op!("="),
                        left: MemberExpr {
                            span: DUMMY_SP,
                            obj: ThisExpr::dummy().into(),
                            prop: prop_name_to_member_prop(key.take()),
                        }
                        .into(),
                        right: value,
                    }
                    .into();

                    if *is_static {
                        *n = StaticBlock {
                            span: DUMMY_SP,
                            body: BlockStmt {
                                span: DUMMY_SP,
                                stmts: vec![init_expr.into_stmt()],
                            },
                        }
                        .into();

                        return;
                    } else {
                        self.constructor_inits.push(init_expr.into());
                    }
                }

                n.take();
            }
            ClassMember::PrivateProp(PrivateProp {
                ref span,
                is_static: false,
                key,
                value,
                ..
            }) => {
                if let Some(value) = value.take() {
                    let init_expr: Expr = AssignExpr {
                        span: *span,
                        op: op!("="),
                        left: MemberExpr {
                            span: DUMMY_SP,
                            obj: ThisExpr::dummy().into(),
                            prop: MemberProp::PrivateName(key.clone()),
                        }
                        .into(),
                        right: value,
                    }
                    .into();

                    self.constructor_inits.push(init_expr.into());
                }
            }
            _ => {}
        }
    }
}

#[derive(Debug, Default)]
struct ConstructorHandler {
    has_super: bool,
    constructor_inits: Vec<Box<Expr>>,
    constructor_found: bool,
}

impl VisitMut for ConstructorHandler {
    noop_visit_mut_type!();

    fn visit_mut_class(&mut self, _: &mut Class) {
        // skip inner classes
    }

    fn visit_mut_class_members(&mut self, n: &mut std::vec::Vec<ClassMember>) {
        if !self.constructor_found {
            let constructor = default_constructor(self.has_super);
            n.push(constructor.into());
        }
        n.visit_mut_children_with(self);
    }

    fn visit_mut_class_member(&mut self, n: &mut ClassMember) {
        if let ClassMember::Constructor(c) = n {
            inject_after_super(c, self.constructor_inits.take());
        }
    }
}

#[derive(Debug)]
struct ComputedFieldsHandler {
    var_decls: Vec<VarDeclarator>,
    static_init_blocks: Vec<Stmt>,
    pure_getters: bool,
}

impl VisitMut for ComputedFieldsHandler {
    noop_visit_mut_type!();

    fn visit_mut_class_prop(&mut self, n: &mut ClassProp) {
        match &mut n.key {
            PropName::Computed(ComputedPropName { expr, .. })
                if !is_literal(expr) && !is_simple_pure_expr(expr, self.pure_getters) =>
            {
                let ref_key = private_ident!("prop");
                let mut computed_expr = Box::new(Expr::Ident(ref_key.clone()));

                mem::swap(expr, &mut computed_expr);

                self.var_decls.push(VarDeclarator {
                    span: DUMMY_SP,
                    name: ref_key.clone().into(),
                    init: None,
                    definite: false,
                });

                self.static_init_blocks.push({
                    let assign_expr = computed_expr.make_assign_to(op!("="), ref_key.into());

                    assign_expr.into_stmt()
                });
            }
            _ => (),
        }
    }

    fn visit_mut_class_member(&mut self, n: &mut ClassMember) {
        if n.is_class_prop() {
            n.visit_mut_children_with(self);
        }
    }

    fn visit_mut_class_members(&mut self, n: &mut Vec<ClassMember>) {
        n.visit_mut_children_with(self);

        if !self.static_init_blocks.is_empty() {
            n.insert(
                0,
                StaticBlock {
                    span: DUMMY_SP,
                    body: BlockStmt {
                        span: DUMMY_SP,
                        stmts: self.static_init_blocks.take(),
                    },
                }
                .into(),
            );
        }
    }
}
