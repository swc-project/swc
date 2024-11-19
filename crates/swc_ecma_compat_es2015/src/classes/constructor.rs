use std::mem;

use swc_common::{util::take::Take, Span, Spanned, SyntaxContext, DUMMY_SP};
use swc_ecma_ast::*;
use swc_ecma_transforms_base::{helper, helper_expr};
use swc_ecma_transforms_classes::super_field::SuperFieldAccessFolder;
use swc_ecma_utils::{default_constructor_with_span, private_ident, quote_ident, ExprFactory};
use swc_ecma_visit::{noop_visit_mut_type, VisitMut, VisitMutWith};
use swc_trace_macro::swc_trace;
use tracing::debug;

use super::Config;

pub(super) fn fold_constructor(
    class_span: Span,
    constructor: Option<Constructor>,
    class_name: &Ident,
    class_super_name: &Option<Ident>,
    config: Config,
) -> FnDecl {
    let is_derived = class_super_name.is_some();
    let mut constructor =
        constructor.unwrap_or_else(|| default_constructor_with_span(is_derived, class_span));

    // Black magic to detect injected constructor.
    let is_constructor_default = constructor.span.is_dummy();
    if is_constructor_default {
        debug!("Dropping constructor parameters because the constructor is injected");
        constructor.params.take();
    }

    let params = constructor
        .params
        .take()
        .into_iter()
        .map(|p| p.param().expect("All TS params should be converted"))
        .collect();

    let mut stmts = vec![];

    if !config.no_class_calls {
        // _class_call_check(this, C)
        stmts.push(
            CallExpr {
                callee: helper!(class_call_check),
                args: vec![
                    Expr::This(ThisExpr { span: DUMMY_SP }).as_arg(),
                    class_name.clone().as_arg(),
                ],
                ..Default::default()
            }
            .into_stmt(),
        );
    }

    // handle super prop by default
    let mut has_super_prop = true;
    let mut this_mark = None;

    let mut body = constructor.body.take().unwrap();
    if let Some(class_super_name) = class_super_name {
        let is_last_super = (&*body.stmts).is_super_last_call();
        let is_last_return = body.stmts.last().map_or(false, Stmt::is_return_stmt);

        let mut constructor_folder = ConstructorFolder {
            class_key_init: vec![],
            class_name: class_name.clone(),
            class_super_name: class_super_name.clone(),
            in_arrow: false,
            in_nested_class: false,
            is_constructor_default,
            is_super_callable_constructor: config.super_is_callable_constructor,
            super_found: false,
            super_prop_found: false,
            this: None,
            this_ref_count: 0,
        };

        body.visit_mut_with(&mut constructor_folder);

        // disable SuperFieldAccessFolder if super prop is not used
        has_super_prop = constructor_folder.super_prop_found;

        // Optimize for last super call
        if is_last_super {
            if let Some(stmt) = body.stmts.last_mut() {
                if let Some(expr_stmt) = stmt.as_mut_expr() {
                    let span = expr_stmt.span;
                    match expr_stmt.expr.as_mut() {
                        Expr::Assign(assign) => {
                            let arg = if constructor_folder.this_ref_count == 1 {
                                constructor_folder.this_ref_count = 0;
                                assign.right.take()
                            } else {
                                assign.take().into()
                            };
                            *stmt = ReturnStmt {
                                span,
                                arg: arg.into(),
                            }
                            .into();
                        }
                        arg @ Expr::Seq(..) | arg @ Expr::Paren(..) => {
                            *stmt = ReturnStmt {
                                span,
                                arg: Some(Box::new(arg.take())),
                            }
                            .into();
                        }

                        _ => {}
                    }
                };
            }
        }

        if constructor_folder.this_ref_count > 0 || constructor_folder.super_prop_found {
            let this = constructor_folder
                .this
                .get_or_insert_with(|| private_ident!("_this"))
                .clone();

            this_mark = Some(this.ctxt.outer());

            let var = VarDeclarator {
                name: Pat::Ident(this.into()),
                span: DUMMY_SP,
                init: None,
                definite: false,
            };

            let var = VarDecl {
                decls: vec![var],
                ..Default::default()
            };

            stmts.push(var.into());
        }

        if !is_last_super && !is_last_return {
            let this = if constructor_folder.super_found {
                Expr::Ident(constructor_folder.this.unwrap())
            } else {
                let this = constructor_folder
                    .this
                    .map_or_else(|| Expr::undefined(DUMMY_SP).as_arg(), |this| this.as_arg());

                helper_expr!(assert_this_initialized).as_call(DUMMY_SP, vec![this])
            };

            let return_this = ReturnStmt {
                span: DUMMY_SP,
                arg: Some(this.into()),
            };
            body.stmts.push(return_this.into());
        }
    }

    if has_super_prop {
        let mut folder = SuperFieldAccessFolder {
            class_name,
            constructor_this_mark: this_mark,
            // constructor cannot be static
            is_static: false,
            folding_constructor: true,
            in_nested_scope: false,
            in_injected_define_property_call: false,
            this_alias_mark: None,
            constant_super: config.constant_super,
            super_class: class_super_name,
            in_pat: false,
        };

        body.visit_mut_with(&mut folder);

        if let Some(mark) = folder.this_alias_mark {
            stmts.push(
                VarDecl {
                    span: DUMMY_SP,
                    declare: false,
                    kind: VarDeclKind::Var,
                    decls: vec![VarDeclarator {
                        span: DUMMY_SP,
                        name: quote_ident!(SyntaxContext::empty().apply_mark(mark), "_this").into(),
                        init: Some(Box::new(Expr::This(ThisExpr { span: DUMMY_SP }))),
                        definite: false,
                    }],
                    ..Default::default()
                }
                .into(),
            )
        }
    }

    stmts.extend(body.stmts);

    let function = Function {
        params,
        body: Some(BlockStmt {
            stmts,
            ..Default::default()
        }),
        ..Default::default()
    };

    FnDecl {
        ident: class_name.clone(),
        declare: false,
        function: function.into(),
    }
}

struct ConstructorFolder {
    class_key_init: Vec<Stmt>,
    class_name: Ident,
    class_super_name: Ident,

    in_arrow: bool,
    in_nested_class: bool,

    is_constructor_default: bool,
    is_super_callable_constructor: bool,

    // super_found will be inherited from parent scope
    // but it should be reset when exiting from the conditional scope
    // e.g. if/while/for/try
    super_found: bool,
    super_prop_found: bool,

    this: Option<Ident>,
    this_ref_count: usize,
}

#[swc_trace]
impl VisitMut for ConstructorFolder {
    noop_visit_mut_type!(fail);

    fn visit_mut_constructor(&mut self, _: &mut Constructor) {
        // skip
    }

    fn visit_mut_function(&mut self, _: &mut Function) {
        // skip
    }

    fn visit_mut_getter_prop(&mut self, _: &mut GetterProp) {
        // skip
    }

    fn visit_mut_setter_prop(&mut self, _: &mut SetterProp) {
        // skip
    }

    fn visit_mut_if_stmt(&mut self, node: &mut IfStmt) {
        node.test.visit_mut_with(self);
        let super_found = self.super_found;
        node.cons.visit_mut_with(self);
        node.alt.visit_mut_with(self);
        self.super_found = super_found;
    }

    fn visit_mut_while_stmt(&mut self, node: &mut WhileStmt) {
        node.test.visit_mut_with(self);
        let super_found = self.super_found;
        node.body.visit_mut_with(self);
        self.super_found = super_found;
    }

    fn visit_mut_do_while_stmt(&mut self, node: &mut DoWhileStmt) {
        node.test.visit_mut_with(self);
        let super_found = self.super_found;
        node.body.visit_mut_with(self);
        self.super_found = super_found;
    }

    fn visit_mut_for_stmt(&mut self, node: &mut ForStmt) {
        node.init.visit_mut_with(self);
        node.test.visit_mut_with(self);
        let super_found = self.super_found;
        node.body.visit_mut_with(self);
        node.update.visit_mut_with(self);
        self.super_found = super_found;
    }

    fn visit_mut_for_of_stmt(&mut self, node: &mut ForOfStmt) {
        node.left.visit_mut_with(self);
        node.right.visit_mut_with(self);
        let super_found = self.super_found;
        node.body.visit_mut_with(self);
        self.super_found = super_found;
    }

    fn visit_mut_for_in_stmt(&mut self, node: &mut ForInStmt) {
        node.left.visit_mut_with(self);
        node.right.visit_mut_with(self);
        let super_found = self.super_found;
        node.body.visit_mut_with(self);
        self.super_found = super_found;
    }

    fn visit_mut_cond_expr(&mut self, node: &mut CondExpr) {
        node.test.visit_mut_with(self);
        let super_found = self.super_found;
        node.cons.visit_mut_with(self);
        node.alt.visit_mut_with(self);
        self.super_found = super_found;
    }

    fn visit_mut_switch_stmt(&mut self, node: &mut SwitchStmt) {
        node.discriminant.visit_mut_with(self);
        let super_found = self.super_found;
        node.cases.visit_mut_with(self);
        self.super_found = super_found;
    }

    fn visit_mut_try_stmt(&mut self, node: &mut TryStmt) {
        let super_found = self.super_found;
        node.block.visit_mut_with(self);
        node.handler.visit_mut_with(self);
        self.super_found = super_found;
        node.finalizer.visit_mut_with(self);
    }

    fn visit_mut_labeled_stmt(&mut self, node: &mut LabeledStmt) {
        if node.body.is_block() {
            let super_found = self.super_found;
            node.body.visit_mut_with(self);
            self.super_found = super_found;
        } else {
            node.body.visit_mut_with(self);
        }
    }

    fn visit_mut_bin_expr(&mut self, node: &mut BinExpr) {
        match node.op {
            op!("&&") | op!("||") => {
                node.left.visit_mut_with(self);
                let super_found = self.super_found;
                node.right.visit_mut_with(self);
                self.super_found = super_found;
            }
            _ => {
                node.visit_mut_children_with(self);
            }
        }
    }

    fn visit_mut_class(&mut self, node: &mut Class) {
        let in_nested_class = mem::replace(&mut self.in_nested_class, true);
        node.visit_mut_children_with(self);
        self.in_nested_class = in_nested_class;
    }

    fn visit_mut_arrow_expr(&mut self, node: &mut ArrowExpr) {
        let in_arrow = mem::replace(&mut self.in_arrow, true);
        let super_found = self.super_found;
        node.visit_mut_children_with(self);
        self.super_found = super_found;
        self.in_arrow = in_arrow;
    }

    fn visit_mut_stmts(&mut self, node: &mut Vec<Stmt>) {
        for mut stmt in node.take().drain(..) {
            stmt.visit_mut_with(self);
            let class_key_init = self.class_key_init.take();
            if !class_key_init.is_empty() {
                node.extend(class_key_init);
            }
            node.push(stmt);
        }
    }

    fn visit_mut_expr(&mut self, node: &mut Expr) {
        if node.is_this() {
            if !self.super_found {
                *node = helper_expr!(assert_this_initialized)
                    .as_call(DUMMY_SP, vec![self.get_this().clone().as_arg()]);
            } else {
                *node = self.get_this().clone().into();
            }
            return;
        }

        node.visit_mut_children_with(self);

        if self.transform_super_call(node) {
            self.super_found = true;

            let this = self.get_this().clone();
            let assign_expr = node.take().make_assign_to(op!("="), this.clone().into());

            if self.in_nested_class {
                self.class_key_init.push(assign_expr.into_stmt());
                *node = this.into();
            } else {
                *node = assign_expr;
            }
        }
    }

    fn visit_mut_return_stmt(&mut self, node: &mut ReturnStmt) {
        node.visit_mut_children_with(self);

        if !self.in_arrow {
            let arg = node.arg.take().map(ExprFactory::as_arg);
            let mut args = vec![self.get_this().clone().as_arg()];
            args.extend(arg);
            node.arg = Some(
                helper_expr!(possible_constructor_return)
                    .as_call(DUMMY_SP, args)
                    .into(),
            );
        }
    }

    fn visit_mut_super_prop(&mut self, node: &mut SuperProp) {
        self.super_prop_found = true;

        node.visit_mut_children_with(self);
    }
}

#[swc_trace]
impl ConstructorFolder {
    fn get_this(&mut self) -> &Ident {
        self.this_ref_count += 1;
        self.this.get_or_insert_with(|| private_ident!("_this"))
    }

    fn transform_super_call(&self, node: &mut Expr) -> bool {
        let Expr::Call(call_expr) = node else {
            return false;
        };

        let CallExpr {
            callee: callee @ Callee::Super(..),
            args: origin_args,
            ..
        } = call_expr
        else {
            return false;
        };

        if self.is_super_callable_constructor {
            if self.is_constructor_default || is_spread_arguements(origin_args) {
                *callee = self
                    .class_super_name
                    .clone()
                    .make_member(quote_ident!("apply"))
                    .as_callee();

                let mut arguments = quote_ident!("arguments");

                if let Some(e) = origin_args.first() {
                    arguments.span = e.expr.span()
                }

                *origin_args = vec![ThisExpr { span: DUMMY_SP }.as_arg(), arguments.as_arg()];
            } else {
                *callee = self
                    .class_super_name
                    .clone()
                    .make_member(quote_ident!("call"))
                    .as_callee();
                origin_args.insert(0, ThisExpr { span: DUMMY_SP }.as_arg());
            }

            *node = BinExpr {
                span: DUMMY_SP,
                left: Box::new(node.take()),
                op: op!("||"),
                right: Box::new(Expr::This(ThisExpr { span: DUMMY_SP })),
            }
            .into();

            return true;
        }

        *callee = helper!(call_super);

        let mut args = vec![
            ThisExpr { span: DUMMY_SP }.as_arg(),
            self.class_name.clone().as_arg(),
        ];

        if self.is_constructor_default || is_spread_arguements(origin_args) {
            // super(...arguments)
            // _call_super(this, _super_class_name, ...arguments)

            let mut arguments = quote_ident!("arguments");

            if let Some(e) = origin_args.first() {
                arguments.span = e.expr.span()
            }

            args.push(arguments.as_arg())
        } else if !origin_args.is_empty() {
            // super(a, b)
            // _call_super(this, _super_class_name, [a, b])

            let array = ArrayLit {
                elems: origin_args.take().into_iter().map(Some).collect(),
                ..Default::default()
            };

            args.push(array.as_arg());
        }

        *origin_args = args;

        true
    }
}

// ...arguments
fn is_spread_arguements(args: &[ExprOrSpread]) -> bool {
    if args.len() != 1 {
        return false;
    }

    let arg = &args[0];

    if arg.spread.is_none() {
        return false;
    }

    arg.expr
        .as_ident()
        .filter(|ident| ident.sym == *"arguments")
        .is_some()
}

trait SuperLastCall {
    fn is_super_last_call(&self) -> bool;
}

impl SuperLastCall for &[Stmt] {
    fn is_super_last_call(&self) -> bool {
        self.iter()
            .rev()
            .find(|s| !s.is_empty())
            .map_or(false, |s| s.is_super_last_call())
    }
}

impl SuperLastCall for &Stmt {
    fn is_super_last_call(&self) -> bool {
        match self {
            Stmt::Expr(ExprStmt { expr, .. }) => (&**expr).is_super_last_call(),
            Stmt::Return(ReturnStmt { arg: Some(arg), .. }) => (&**arg).is_super_last_call(),
            _ => false,
        }
    }
}

impl SuperLastCall for &Expr {
    fn is_super_last_call(&self) -> bool {
        match self {
            Expr::Call(CallExpr {
                callee: Callee::Super(..),
                ..
            }) => true,
            Expr::Paren(ParenExpr { expr, .. }) => (&**expr).is_super_last_call(),
            Expr::Seq(SeqExpr { exprs, .. }) => {
                exprs.last().map_or(false, |e| (&**e).is_super_last_call())
            }
            _ => false,
        }
    }
}
