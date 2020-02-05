use crate::{pass::Pass, util::undefined};
use smallvec::SmallVec;
use std::mem::replace;
use swc_common::{util::map::Map, Fold, FoldWith, Spanned, Visit, VisitWith, DUMMY_SP};
use swc_ecma_ast::*;
use swc_ecma_utils::{
    find_ids, ident::IdentLike, prepend, var::VarCollector, ExprFactory, Id, StmtLike,
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
pub fn block_scoping() -> impl Pass {
    BlockScoping::default()
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
    },
    Fn,
    Block,
}

#[derive(Default)]
struct BlockScoping {
    scope: ScopeStack,
    vars: Vec<VarDeclarator>,
}

impl BlockScoping {
    /// This methods remove [ScopeKind::Loop] and [ScopeKind::Fn], but not
    /// [ScopeKind::ForLetLoop]
    fn fold_with_scope<T>(&mut self, kind: ScopeKind, node: T) -> T
    where
        T: FoldWith<Self>,
    {
        let remove = match kind {
            ScopeKind::ForLetLoop { .. } => false,
            _ => true,
        };
        self.scope.push(kind);
        let node = node.fold_with(self);

        if remove {
            self.scope.pop();
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
            //
            if let Some(ScopeKind::ForLetLoop { args, used, .. }) = self.scope.pop() {
                if used.is_empty() {
                    return body;
                }

                let var_name = private_ident!("_loop");

                self.vars.push(VarDeclarator {
                    span: DUMMY_SP,
                    name: Pat::Ident(var_name.clone()),
                    init: Some(
                        box FnExpr {
                            ident: None,
                            function: Function {
                                span: DUMMY_SP,
                                params: args
                                    .iter()
                                    .map(|i| {
                                        Pat::Ident(Ident::new(i.0.clone(), DUMMY_SP.with_ctxt(i.1)))
                                    })
                                    .collect(),
                                decorators: Default::default(),
                                body: Some(match body {
                                    Stmt::Block(bs) => bs,
                                    _ => BlockStmt {
                                        span: DUMMY_SP,
                                        stmts: vec![body],
                                    },
                                }),
                                is_generator: false,
                                is_async: false,
                                type_params: None,
                                return_type: None,
                            },
                        }
                        .into(),
                    ),
                    definite: false,
                });

                return CallExpr {
                    span: DUMMY_SP,
                    callee: var_name.as_callee(),
                    args: args
                        .into_iter()
                        .map(|i| ExprOrSpread {
                            spread: None,
                            expr: box Expr::Ident(Ident::new(i.0, DUMMY_SP.with_ctxt(i.1))),
                        })
                        .collect(),
                    type_args: None,
                }
                .into_stmt();
            }

            body
        })
    }
}

impl Fold<DoWhileStmt> for BlockScoping {
    fn fold(&mut self, node: DoWhileStmt) -> DoWhileStmt {
        let body = self.fold_with_scope(ScopeKind::Loop, node.body);

        let test = node.test.fold_with(self);

        DoWhileStmt { body, test, ..node }
    }
}

impl Fold<WhileStmt> for BlockScoping {
    fn fold(&mut self, node: WhileStmt) -> WhileStmt {
        let body = self.fold_with_scope(ScopeKind::Loop, node.body);

        let test = node.test.fold_with(self);

        WhileStmt { body, test, ..node }
    }
}

impl Fold<ForStmt> for BlockScoping {
    fn fold(&mut self, node: ForStmt) -> ForStmt {
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
}

impl Fold<ForOfStmt> for BlockScoping {
    fn fold(&mut self, node: ForOfStmt) -> ForOfStmt {
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
}

impl Fold<ForInStmt> for BlockScoping {
    fn fold(&mut self, node: ForInStmt) -> ForInStmt {
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
}

impl Fold<Function> for BlockScoping {
    fn fold(&mut self, f: Function) -> Function {
        Function {
            params: f.params.fold_with(self),
            decorators: f.decorators.fold_with(self),
            body: self.fold_with_scope(ScopeKind::Fn, f.body),
            ..f
        }
    }
}

impl Fold<ArrowExpr> for BlockScoping {
    fn fold(&mut self, f: ArrowExpr) -> ArrowExpr {
        ArrowExpr {
            params: f.params.fold_with(self),
            body: self.fold_with_scope(ScopeKind::Fn, f.body),
            ..f
        }
    }
}

impl Fold<Constructor> for BlockScoping {
    fn fold(&mut self, f: Constructor) -> Constructor {
        Constructor {
            key: f.key.fold_with(self),
            params: f.params.fold_with(self),
            body: self.fold_with_scope(ScopeKind::Fn, f.body),
            ..f
        }
    }
}

impl Fold<GetterProp> for BlockScoping {
    fn fold(&mut self, f: GetterProp) -> GetterProp {
        GetterProp {
            key: f.key.fold_with(self),
            body: self.fold_with_scope(ScopeKind::Fn, f.body),
            ..f
        }
    }
}

impl Fold<SetterProp> for BlockScoping {
    fn fold(&mut self, f: SetterProp) -> SetterProp {
        SetterProp {
            key: f.key.fold_with(self),
            param: f.param.fold_with(self),
            body: self.fold_with_scope(ScopeKind::Fn, f.body),
            ..f
        }
    }
}

impl Fold<VarDecl> for BlockScoping {
    fn fold(&mut self, var: VarDecl) -> VarDecl {
        let var = var.fold_children(self);

        VarDecl {
            kind: VarDeclKind::Var,
            ..var
        }
    }
}

impl Fold<VarDeclarator> for BlockScoping {
    fn fold(&mut self, var: VarDeclarator) -> VarDeclarator {
        let var = var.fold_children(self);

        let init = if self.in_loop_body() && var.init.is_none() {
            Some(undefined(var.span()))
        } else {
            var.init
        };

        VarDeclarator { init, ..var }
    }
}

impl Fold<Ident> for BlockScoping {
    fn fold(&mut self, node: Ident) -> Ident {
        let id = node.to_id();
        self.mark_as_used(id);

        node
    }
}

impl<T> Fold<Vec<T>> for BlockScoping
where
    T: StmtLike,
    Vec<T>: FoldWith<Self>,
{
    fn fold(&mut self, stmts: Vec<T>) -> Vec<T> {
        let mut stmts = stmts.fold_children(self);

        if !self.vars.is_empty() {
            prepend(
                &mut stmts,
                T::from_stmt(Stmt::Decl(Decl::Var(VarDecl {
                    span: DUMMY_SP,
                    kind: VarDeclKind::Var,
                    declare: false,
                    decls: replace(&mut self.vars, Default::default()),
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
    node.visit_with(&mut v);

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
    node.visit_with(&mut v);
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

impl Visit<VarDeclarator> for InfectionFinder<'_> {
    fn visit(&mut self, node: &VarDeclarator) {
        let old = self.found;
        self.found = false;

        node.init.visit_with(self);

        if self.found {
            let ids = find_ids(&node.name);
            self.vars.extend(ids);
        }

        self.found = old;
    }
}

impl Visit<AssignExpr> for InfectionFinder<'_> {
    fn visit(&mut self, node: &AssignExpr) {
        let old = self.found;
        self.found = false;

        node.right.visit_with(self);

        if self.found {
            let ids = find_ids(&node.left);
            self.vars.extend(ids);
        }

        self.found = old;
    }
}

impl Visit<MemberExpr> for InfectionFinder<'_> {
    fn visit(&mut self, e: &MemberExpr) {
        if self.found {
            return;
        }

        e.obj.visit_with(self);

        if e.computed {
            e.prop.visit_with(self);
        }
    }
}

impl Visit<Ident> for InfectionFinder<'_> {
    fn visit(&mut self, i: &Ident) {
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
}

#[cfg(test)]
mod tests {
    use super::block_scoping;
    use crate::compat::es2015::for_of::for_of;
    use swc_common::chain;

    test!(
        ::swc_ecma_parser::Syntax::default(),
        |_| block_scoping(),
        for_loop,
        "for (const key in obj) {
            const bar = obj[key];

            let qux;
            let fog;

            if (Array.isArray(bar)) {
            qux = bar[0];
            fog = bar[1];
            } else {
            qux = bar;
            }

            baz(key, qux, fog);
        }",
        "for (var key in obj) {
            var bar = obj[key];

            var qux = void 0;
            var fog = void 0;

            if (Array.isArray(bar)) {
            qux = bar[0];
            fog = bar[1];
            } else {
            qux = bar;
            }

            baz(key, qux, fog);
        }"
    );

    test!(
        ::swc_ecma_parser::Syntax::default(),
        |_| block_scoping(),
        for_let_loop,
        "let functions = [];
for (let i = 0; i < 10; i++) {
	functions.push(function() {
		console.log(i);
	});
}
functions[0]();
functions[7]();",
        "
var _loop = function(i) {
    functions.push(function() {
        console.log(i);
    });
};
var functions = [];
for(var i = 0; i < 10; i++)_loop(i);
functions[0]();
functions[7]();
"
    );

    test_exec!(
        ::swc_ecma_parser::Syntax::default(),
        |_| block_scoping(),
        for_let_loop_exec,
        "let functions = [];
for (let i = 0; i < 10; i++) {
	functions.push(function() {
		return i;
	});
}
expect(functions[0]()).toBe(0);
expect(functions[7]()).toBe(7);
"
    );

    test_exec!(
        ::swc_ecma_parser::Syntax::default(),
        |_| block_scoping(),
        for_let_of_exec,
        "let functions = [];
for (let i of [1, 3, 5, 7, 9]) {
	functions.push(function() {
		return i;
	});
}
expect(functions[0]()).toBe(1);
expect(functions[1]()).toBe(3);
"
    );

    test_exec!(
        ::swc_ecma_parser::Syntax::default(),
        |_| chain!(for_of(Default::default()), block_scoping()),
        issue_609_1,
        "let functions = [];
for (let i of [1, 3, 5, 7, 9]) {
	functions.push(function() {
		return i;
	});
}
expect(functions[0]()).toBe(1);
expect(functions[1]()).toBe(3);
"
    );
}
