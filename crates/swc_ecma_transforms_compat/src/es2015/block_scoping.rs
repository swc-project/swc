use smallvec::SmallVec;
use std::mem::take;
use swc_atoms::js_word;
use swc_common::{collections::AHashMap, util::map::Map, Mark, Spanned, SyntaxContext, DUMMY_SP};
use swc_ecma_ast::*;
use swc_ecma_transforms_base::helper;
use swc_ecma_utils::{
    contains_arguments, contains_this_expr, find_ids, ident::IdentLike, prepend, private_ident,
    quote_ident, quote_str, undefined, var::VarCollector, ExprFactory, Id, StmtLike,
};
use swc_ecma_visit::{
    noop_fold_type, noop_visit_mut_type, noop_visit_type, Fold, FoldWith, Node, Visit, VisitMut,
    VisitMutWith, VisitWith,
};

///
///
/// TODO(kdy1): Optimization
///
/// ```js
/// let functions = [];
/// for (let i = 0; i < 10; i++) {
/// 	functions.push(function() {
///        let i = 1;
/// 		console.log(i);
/// 	});
/// }
/// ```
pub fn block_scoping() -> impl Fold {
    BlockScoping {
        scope: Default::default(),
        vars: vec![],
        var_decl_kind: VarDeclKind::Var,
    }
}

type ScopeStack = SmallVec<[ScopeKind; 8]>;

#[derive(Debug, PartialEq, Eq)]
enum ScopeKind {
    Loop,
    ForLetLoop {
        all: Vec<Id>,
        args: Vec<Id>,
        /// Produced by identifier reference and consumed by for-of/in loop.
        used: Vec<Id>,
        /// Map of original identifier to modified syntax context
        mutated: AHashMap<Id, SyntaxContext>,
    },
    Fn,
    Block,
}

struct BlockScoping {
    scope: ScopeStack,
    vars: Vec<VarDeclarator>,
    var_decl_kind: VarDeclKind,
}

impl BlockScoping {
    /// This methods remove [ScopeKind::Loop] and [ScopeKind::Fn], but not
    /// [ScopeKind::ForLetLoop]
    fn fold_with_scope<T>(&mut self, kind: ScopeKind, node: T) -> T
    where
        T: FoldWith<Self>,
    {
        let len = self.scope.len();

        let remove = match kind {
            ScopeKind::ForLetLoop { .. } => false,
            _ => true,
        };
        self.scope.push(kind);
        let node = node.fold_with(self);

        if remove {
            self.scope.truncate(len);
        }

        node
    }

    fn mark_as_used(&mut self, i: Id) {
        for (idx, scope) in self.scope.iter_mut().rev().enumerate() {
            match scope {
                ScopeKind::ForLetLoop { all, used, .. } => {
                    //
                    if all.contains(&i) {
                        if idx == 0 {
                            return;
                        }

                        used.push(i);
                        return;
                    }
                }
                _ => {}
            }
        }
    }

    fn in_loop_body(&self) -> bool {
        self.scope
            .last()
            .map(|scope| match scope {
                ScopeKind::ForLetLoop { .. } | ScopeKind::Loop => true,
                _ => false,
            })
            .unwrap_or(false)
    }

    fn handle_vars(&mut self, body: Box<Stmt>) -> Box<Stmt> {
        body.map(|body| {
            {
                let mut v = FunctionFinder { found: false };
                body.visit_with(&Invalid { span: DUMMY_SP } as _, &mut v);
                if !v.found {
                    return body;
                }
            }

            //
            if let Some(ScopeKind::ForLetLoop {
                args,
                used,
                mutated,
                ..
            }) = self.scope.pop()
            {
                if used.is_empty() {
                    return body;
                }
                let this = if contains_this_expr(&body) {
                    let ident = private_ident!("_this");
                    self.vars.push(VarDeclarator {
                        span: DUMMY_SP,
                        name: Pat::Ident(ident.clone().into()),
                        init: Some(Box::new(Expr::This(ThisExpr { span: DUMMY_SP }))),
                        definite: false,
                    });
                    Some(ident)
                } else {
                    None
                };

                let arguments = if contains_arguments(&body) {
                    let ident = private_ident!("_arguments");
                    self.vars.push(VarDeclarator {
                        span: DUMMY_SP,
                        name: Pat::Ident(ident.clone().into()),
                        init: Some(Box::new(Expr::Ident(quote_ident!("arguments")))),
                        definite: false,
                    });
                    Some(ident)
                } else {
                    None
                };

                let mut flow_helper = FlowHelper {
                    all: &args,
                    has_continue: false,
                    has_break: false,
                    has_return: false,
                    mutated,
                    in_switch_case: false,
                };

                let mut body = match body.fold_with(&mut flow_helper) {
                    Stmt::Block(bs) => bs,
                    body => BlockStmt {
                        span: DUMMY_SP,
                        stmts: vec![body],
                    },
                };

                if !flow_helper.mutated.is_empty() || this.is_some() || arguments.is_some() {
                    let no_modification = flow_helper.mutated.is_empty();
                    let mut v = MutationHandler {
                        map: &mut flow_helper.mutated,
                        in_function: false,
                        this,
                        arguments,
                    };

                    // Modifies identifiers, and add reassignments to break / continue / return
                    body.visit_mut_with(&mut v);

                    if !no_modification {
                        if body
                            .stmts
                            .last()
                            .map(|s| match s {
                                Stmt::Return(..) => false,
                                _ => true,
                            })
                            .unwrap_or(true)
                        {
                            body.stmts.push(v.make_reassignment(None).into_stmt());
                        }
                    }
                }

                let var_name = private_ident!("_loop");

                self.vars.push(VarDeclarator {
                    span: DUMMY_SP,
                    name: Pat::Ident(var_name.clone().into()),
                    init: Some(Box::new(
                        FnExpr {
                            ident: None,
                            function: Function {
                                span: DUMMY_SP,
                                params: args
                                    .iter()
                                    .map(|i| {
                                        let ctxt =
                                            flow_helper.mutated.get(i).copied().unwrap_or(i.1);

                                        Param {
                                            span: DUMMY_SP,
                                            decorators: Default::default(),
                                            pat: Pat::Ident(
                                                Ident::new(i.0.clone(), DUMMY_SP.with_ctxt(ctxt))
                                                    .into(),
                                            ),
                                        }
                                    })
                                    .collect(),
                                decorators: Default::default(),
                                body: Some(body),
                                is_generator: false,
                                is_async: false,
                                type_params: None,
                                return_type: None,
                            },
                        }
                        .into(),
                    )),
                    definite: false,
                });

                let call = CallExpr {
                    span: DUMMY_SP,
                    callee: var_name.as_callee(),
                    args: args
                        .iter()
                        .cloned()
                        .map(|i| ExprOrSpread {
                            spread: None,
                            expr: Box::new(Expr::Ident(Ident::new(i.0, DUMMY_SP.with_ctxt(i.1)))),
                        })
                        .collect(),
                    type_args: None,
                };

                if flow_helper.has_return || flow_helper.has_continue || flow_helper.has_break {
                    let ret = private_ident!("_ret");

                    let mut stmts = vec![
                        // var _ret = _loop(i);
                        Stmt::Decl(Decl::Var(VarDecl {
                            span: DUMMY_SP,
                            kind: VarDeclKind::Var,
                            declare: false,
                            decls: vec![VarDeclarator {
                                span: DUMMY_SP,
                                name: Pat::Ident(ret.clone().into()),
                                init: Some(Box::new(call.into())),
                                definite: false,
                            }],
                        })),
                    ];

                    let use_switch = flow_helper.has_break && flow_helper.has_continue;

                    let check_ret = if flow_helper.has_return {
                        // if (_typeof(_ret) === "object") return _ret.v;
                        Some(
                            IfStmt {
                                span: DUMMY_SP,
                                test: Box::new(Expr::Bin(BinExpr {
                                    span: DUMMY_SP,
                                    op: BinaryOp::EqEqEq,
                                    left: {
                                        // _typeof(_ret)
                                        let callee = helper!(type_of, "typeof");

                                        Expr::Call(CallExpr {
                                            span: Default::default(),
                                            callee,
                                            args: vec![ExprOrSpread {
                                                spread: None,
                                                expr: Box::new(ret.clone().into()),
                                            }],
                                            type_args: None,
                                        })
                                        .into()
                                    },
                                    //"object"
                                    right: Expr::Lit(Lit::Str(Str {
                                        span: DUMMY_SP,
                                        value: js_word!("object"),
                                        has_escape: false,
                                        kind: Default::default(),
                                    }))
                                    .into(),
                                })),
                                cons: Box::new(Stmt::Return(ReturnStmt {
                                    span: DUMMY_SP,
                                    arg: Some(ret.clone().make_member(quote_ident!("v")).into()),
                                })),
                                alt: None,
                            }
                            .into(),
                        )
                    } else {
                        None
                    };

                    if use_switch {
                        let mut cases = vec![];

                        if flow_helper.has_break {
                            cases.push(
                                SwitchCase {
                                    span: DUMMY_SP,
                                    test: Some(Box::new(quote_str!("break").into())),
                                    // TODO: Handle labelled statements
                                    cons: vec![Stmt::Break(BreakStmt {
                                        span: DUMMY_SP,
                                        label: None,
                                    })],
                                }
                                .into(),
                            );
                        }

                        if flow_helper.has_continue {
                            cases.push(
                                SwitchCase {
                                    span: DUMMY_SP,
                                    test: Some(Box::new(quote_str!("continue").into())),
                                    // TODO: Handle labelled statements
                                    cons: vec![Stmt::Continue(ContinueStmt {
                                        span: DUMMY_SP,
                                        label: None,
                                    })],
                                }
                                .into(),
                            );
                        }

                        cases.extend(check_ret.map(|stmt| SwitchCase {
                            span: DUMMY_SP,
                            test: None,
                            cons: vec![stmt],
                        }));

                        stmts.push(
                            SwitchStmt {
                                span: DUMMY_SP,
                                discriminant: Box::new(ret.clone().into()),
                                cases,
                            }
                            .into(),
                        );
                    } else {
                        //
                        if flow_helper.has_break {
                            stmts.push(
                                IfStmt {
                                    span: DUMMY_SP,
                                    test: ret.clone().make_eq(quote_str!("break")).into(),
                                    // TODO: Handle labelled statements
                                    cons: Stmt::Break(BreakStmt {
                                        span: DUMMY_SP,
                                        label: None,
                                    })
                                    .into(),
                                    alt: None,
                                }
                                .into(),
                            );
                        }

                        if flow_helper.has_continue {
                            stmts.push(
                                IfStmt {
                                    span: DUMMY_SP,
                                    test: ret.clone().make_eq(quote_str!("continue")).into(),
                                    // TODO: Handle labelled statements
                                    cons: Stmt::Continue(ContinueStmt {
                                        span: DUMMY_SP,
                                        label: None,
                                    })
                                    .into(),
                                    alt: None,
                                }
                                .into(),
                            );
                        }

                        stmts.extend(check_ret);
                    }

                    return BlockStmt {
                        span: DUMMY_SP,
                        stmts,
                    }
                    .into();
                }

                return call.into_stmt();
            }

            body
        })
    }
}

/// TODO: VisitMut
impl Fold for BlockScoping {
    noop_fold_type!();

    fn fold_arrow_expr(&mut self, f: ArrowExpr) -> ArrowExpr {
        ArrowExpr {
            params: f.params.fold_with(self),
            body: self.fold_with_scope(ScopeKind::Fn, f.body),
            ..f
        }
    }

    fn fold_block_stmt(&mut self, n: BlockStmt) -> BlockStmt {
        let vars = take(&mut self.vars);
        let n = n.fold_children_with(self);
        debug_assert_eq!(self.vars, vec![]);
        self.vars = vars;
        n
    }

    fn fold_constructor(&mut self, f: Constructor) -> Constructor {
        Constructor {
            key: f.key.fold_with(self),
            params: f.params.fold_with(self),
            body: self.fold_with_scope(ScopeKind::Fn, f.body),
            ..f
        }
    }

    fn fold_do_while_stmt(&mut self, node: DoWhileStmt) -> DoWhileStmt {
        let body = self.fold_with_scope(ScopeKind::Loop, node.body);

        let test = node.test.fold_with(self);

        DoWhileStmt { body, test, ..node }
    }

    fn fold_for_in_stmt(&mut self, node: ForInStmt) -> ForInStmt {
        let left = self.fold_with_scope(ScopeKind::Block, node.left);
        let mut vars = find_vars(&left);
        let args = vars.clone();

        let right = node.right.fold_with(self);

        find_infected(&mut vars, &node.body);

        let kind = if vars.is_empty() {
            ScopeKind::Loop
        } else {
            ScopeKind::ForLetLoop {
                all: vars,
                args,
                used: vec![],
                mutated: Default::default(),
            }
        };
        let body = self.fold_with_scope(kind, node.body);
        let body = self.handle_vars(body);

        ForInStmt {
            left,
            right,
            body,
            ..node
        }
    }

    fn fold_for_of_stmt(&mut self, node: ForOfStmt) -> ForOfStmt {
        let left = self.fold_with_scope(ScopeKind::Block, node.left);
        let mut vars = find_vars(&left);
        let args = vars.clone();

        let right = node.right.fold_with(self);

        find_infected(&mut vars, &node.body);

        let kind = if vars.is_empty() {
            ScopeKind::Loop
        } else {
            ScopeKind::ForLetLoop {
                all: vars,
                args,
                used: vec![],
                mutated: Default::default(),
            }
        };
        let body = self.fold_with_scope(kind, node.body);
        let body = self.handle_vars(body);

        ForOfStmt {
            left,
            right,
            body,
            ..node
        }
    }

    fn fold_for_stmt(&mut self, node: ForStmt) -> ForStmt {
        let init = node.init.fold_with(self);

        let mut vars = find_vars(&init);
        let args = vars.clone();

        let test = node.test.fold_with(self);
        let update = node.update.fold_with(self);

        find_infected(&mut vars, &node.body);

        let kind = if vars.is_empty() {
            ScopeKind::Loop
        } else {
            ScopeKind::ForLetLoop {
                all: vars,
                args,
                used: vec![],
                mutated: Default::default(),
            }
        };
        let body = self.fold_with_scope(kind, node.body);
        let body = self.handle_vars(body);

        ForStmt {
            init,
            test,
            update,
            body,
            ..node
        }
    }

    fn fold_function(&mut self, f: Function) -> Function {
        Function {
            params: f.params.fold_with(self),
            decorators: f.decorators.fold_with(self),
            body: self.fold_with_scope(ScopeKind::Fn, f.body),
            ..f
        }
    }

    fn fold_getter_prop(&mut self, f: GetterProp) -> GetterProp {
        GetterProp {
            key: f.key.fold_with(self),
            body: self.fold_with_scope(ScopeKind::Fn, f.body),
            ..f
        }
    }

    fn fold_ident(&mut self, node: Ident) -> Ident {
        let id = node.to_id();
        self.mark_as_used(id);

        node
    }

    fn fold_module_items(&mut self, n: Vec<ModuleItem>) -> Vec<ModuleItem> {
        self.fold_stmt_likes(n)
    }

    fn fold_setter_prop(&mut self, f: SetterProp) -> SetterProp {
        SetterProp {
            key: f.key.fold_with(self),
            param: f.param.fold_with(self),
            body: self.fold_with_scope(ScopeKind::Fn, f.body),
            ..f
        }
    }

    fn fold_stmts(&mut self, n: Vec<Stmt>) -> Vec<Stmt> {
        self.fold_stmt_likes(n)
    }

    fn fold_var_decl(&mut self, var: VarDecl) -> VarDecl {
        let old = self.var_decl_kind;
        self.var_decl_kind = var.kind;
        let var = var.fold_children_with(self);

        self.var_decl_kind = old;

        VarDecl {
            kind: VarDeclKind::Var,
            ..var
        }
    }

    fn fold_var_declarator(&mut self, var: VarDeclarator) -> VarDeclarator {
        let var = var.fold_children_with(self);

        let init = if self.in_loop_body() && var.init.is_none() {
            if self.var_decl_kind == VarDeclKind::Var {
                None
            } else {
                Some(undefined(var.span()))
            }
        } else {
            var.init
        };

        VarDeclarator { init, ..var }
    }

    fn fold_while_stmt(&mut self, node: WhileStmt) -> WhileStmt {
        let body = self.fold_with_scope(ScopeKind::Loop, node.body);

        let test = node.test.fold_with(self);

        WhileStmt { body, test, ..node }
    }
}

impl BlockScoping {
    fn fold_stmt_likes<T>(&mut self, stmts: Vec<T>) -> Vec<T>
    where
        T: StmtLike,
        Vec<T>: FoldWith<Self>,
    {
        let mut stmts = stmts.fold_children_with(self);

        if !self.vars.is_empty() {
            prepend(
                &mut stmts,
                T::from_stmt(Stmt::Decl(Decl::Var(VarDecl {
                    span: DUMMY_SP,
                    kind: VarDeclKind::Var,
                    declare: false,
                    decls: take(&mut self.vars),
                }))),
            );
        }
        stmts
    }
}

fn find_vars<T>(node: &T) -> Vec<Id>
where
    T: for<'any> VisitWith<VarCollector<'any>>,
{
    let mut vars = vec![];
    let mut v = VarCollector { to: &mut vars };
    node.visit_with(&Invalid { span: DUMMY_SP } as _, &mut v);

    vars
}

fn find_infected<T>(ids: &mut Vec<Id>, node: &T)
where
    T: for<'any> VisitWith<InfectionFinder<'any>>,
{
    let mut v = InfectionFinder {
        vars: ids,
        found: false,
    };
    node.visit_with(&Invalid { span: DUMMY_SP } as _, &mut v);
}

/// In the code below,
///
/// ```js
/// let i = _step.value
/// ```
///
/// `i` is infected by `_step`.
struct InfectionFinder<'a> {
    vars: &'a mut Vec<Id>,
    found: bool,
}

impl Visit for InfectionFinder<'_> {
    noop_visit_type!();

    fn visit_assign_expr(&mut self, node: &AssignExpr, _: &dyn Node) {
        let old = self.found;
        self.found = false;

        node.right.visit_with(node as _, self);

        if self.found {
            let ids = find_ids(&node.left);
            self.vars.extend(ids);
        }

        self.found = old;
    }

    fn visit_ident(&mut self, i: &Ident, _: &dyn Node) {
        if self.found {
            return;
        }

        for ident in &*self.vars {
            if i.span.ctxt() == ident.1 && i.sym == ident.0 {
                self.found = true;
                break;
            }
        }
    }

    fn visit_member_expr(&mut self, e: &MemberExpr, _: &dyn Node) {
        if self.found {
            return;
        }

        e.obj.visit_with(e as _, self);

        if e.computed {
            e.prop.visit_with(e as _, self);
        }
    }

    fn visit_var_declarator(&mut self, node: &VarDeclarator, _: &dyn Node) {
        let old = self.found;
        self.found = false;

        node.init.visit_with(node as _, self);

        if self.found {
            let ids = find_ids(&node.name);
            self.vars.extend(ids);
        }

        self.found = old;
    }
}

#[derive(Debug)]
struct FlowHelper<'a> {
    has_continue: bool,
    has_break: bool,
    has_return: bool,
    all: &'a Vec<Id>,
    mutated: AHashMap<Id, SyntaxContext>,
    in_switch_case: bool,
}

impl<'a> FlowHelper<'a> {
    fn check(&mut self, i: Id) {
        if self.all.contains(&i) {
            self.mutated.insert(
                i,
                SyntaxContext::empty().apply_mark(Mark::fresh(Mark::root())),
            );
        }
    }
}

/// TODO: VisitMut
impl Fold for FlowHelper<'_> {
    noop_fold_type!();

    /// noop
    fn fold_arrow_expr(&mut self, f: ArrowExpr) -> ArrowExpr {
        f
    }

    fn fold_assign_expr(&mut self, n: AssignExpr) -> AssignExpr {
        match &n.left {
            PatOrExpr::Expr(e) => match &**e {
                Expr::Ident(i) => {
                    self.check(i.to_id());
                }
                _ => {}
            },
            PatOrExpr::Pat(p) => {
                let ids: Vec<Id> = find_ids(p);

                for id in ids {
                    self.check(id);
                }
            }
        }

        n.fold_children_with(self)
    }

    /// noop
    fn fold_function(&mut self, f: Function) -> Function {
        f
    }

    fn fold_stmt(&mut self, node: Stmt) -> Stmt {
        let span = node.span();

        match node {
            Stmt::Continue(..) => {
                self.has_continue = true;
                return Stmt::Return(ReturnStmt {
                    span,
                    arg: Some(
                        Expr::Lit(Lit::Str(Str {
                            span,
                            value: "continue".into(),
                            has_escape: false,
                            kind: Default::default(),
                        }))
                        .into(),
                    ),
                });
            }
            Stmt::Break(..) => {
                if self.in_switch_case {
                    return node;
                }
                self.has_break = true;
                return Stmt::Return(ReturnStmt {
                    span,
                    arg: Some(Box::new(Expr::Lit(Lit::Str(Str {
                        span,
                        value: "break".into(),
                        has_escape: false,
                        kind: Default::default(),
                    })))),
                });
            }
            Stmt::Return(s) => {
                self.has_return = true;
                let s: ReturnStmt = s.fold_with(self);

                return Stmt::Return(ReturnStmt {
                    span,
                    arg: Some(Box::new(Expr::Object(ObjectLit {
                        span,
                        props: vec![PropOrSpread::Prop(Box::new(Prop::KeyValue(KeyValueProp {
                            key: PropName::Ident(Ident::new("v".into(), DUMMY_SP)),
                            value: s.arg.unwrap_or_else(|| {
                                Box::new(Expr::Unary(UnaryExpr {
                                    span: DUMMY_SP,
                                    op: UnaryOp::Void,
                                    arg: undefined(DUMMY_SP),
                                }))
                            }),
                        })))],
                    }))),
                });
            }
            _ => node.fold_children_with(self),
        }
    }

    fn fold_switch_case(&mut self, n: SwitchCase) -> SwitchCase {
        let old = self.in_switch_case;
        self.in_switch_case = true;

        let n = n.fold_children_with(self);

        self.in_switch_case = old;

        n
    }

    fn fold_update_expr(&mut self, n: UpdateExpr) -> UpdateExpr {
        match *n.arg {
            Expr::Ident(ref i) => self.check(i.to_id()),
            _ => {}
        }

        n.fold_children_with(self)
    }
}

struct MutationHandler<'a> {
    map: &'a mut AHashMap<Id, SyntaxContext>,
    in_function: bool,
    this: Option<Ident>,
    arguments: Option<Ident>,
}

impl MutationHandler<'_> {
    fn make_reassignment(&self, orig: Option<Box<Expr>>) -> Expr {
        if self.map.is_empty() {
            return *orig.unwrap_or_else(|| undefined(DUMMY_SP));
        }

        let mut exprs = Vec::with_capacity(self.map.len() + 1);

        for (id, ctxt) in &*self.map {
            exprs.push(Box::new(Expr::Assign(AssignExpr {
                span: DUMMY_SP,
                left: PatOrExpr::Pat(Box::new(Pat::Ident(
                    Ident::new(id.0.clone(), DUMMY_SP.with_ctxt(id.1)).into(),
                ))),
                op: op!("="),
                right: Box::new(Expr::Ident(Ident::new(
                    id.0.clone(),
                    DUMMY_SP.with_ctxt(*ctxt),
                ))),
            })));
        }
        exprs.push(orig.unwrap_or(undefined(DUMMY_SP)));

        Expr::Seq(SeqExpr {
            span: DUMMY_SP,
            exprs,
        })
    }
}

impl VisitMut for MutationHandler<'_> {
    noop_visit_mut_type!();

    fn visit_mut_ident(&mut self, n: &mut Ident) {
        if let Some(&ctxt) = self.map.get(&n.to_id()) {
            n.span = n.span.with_ctxt(ctxt)
        }
    }

    fn visit_mut_expr(&mut self, n: &mut Expr) {
        n.visit_mut_children_with(self);

        match n {
            Expr::This(this) => {
                if let Some(remapped) = &self.this {
                    *n = Expr::Ident(Ident::new(
                        remapped.sym.clone(),
                        this.span.with_ctxt(remapped.span.ctxt),
                    ))
                }
            }
            Expr::Ident(id) if id.sym == js_word!("arguments") => {
                if let Some(arguments) = &self.arguments {
                    *n = Expr::Ident(arguments.clone())
                }
            }
            _ => {}
        }
    }

    fn visit_mut_arrow_expr(&mut self, n: &mut ArrowExpr) {
        let old = self.in_function;
        self.in_function = true;

        n.visit_mut_children_with(self);

        self.in_function = old;
    }

    fn visit_mut_function(&mut self, n: &mut Function) {
        let old = self.in_function;
        let arguments = self.arguments.take();
        self.in_function = true;

        n.visit_mut_children_with(self);

        self.in_function = old;
        self.arguments = arguments;
    }

    fn visit_mut_return_stmt(&mut self, n: &mut ReturnStmt) {
        n.visit_mut_children_with(self);
        if self.in_function || self.map.is_empty() {
            return;
        }

        let val = n.arg.take();

        n.arg = Some(Box::new(self.make_reassignment(val)))
    }

    /// Don't recurse into member expression prop if not computed
    fn visit_mut_member_expr(&mut self, m: &mut MemberExpr) {
        m.obj.visit_mut_with(self);
        match &*m.prop {
            Expr::Ident(_) if !m.computed => {}
            _ => m.prop.visit_mut_with(self),
        }
    }
}

#[derive(Debug)]
struct FunctionFinder {
    found: bool,
}

impl Visit for FunctionFinder {
    noop_visit_type!();

    fn visit_arrow_expr(&mut self, _: &ArrowExpr, _: &dyn Node) {
        self.found = true;
    }

    fn visit_function(&mut self, _: &Function, _: &dyn Node) {
        self.found = true
    }
}
