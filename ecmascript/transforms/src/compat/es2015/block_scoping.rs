use crate::{pass::Pass, util::undefined};
use ast::*;
use smallvec::SmallVec;
use std::mem::replace;
use swc_common::{Fold, FoldWith, Spanned, VisitWith, DUMMY_SP};
use utils::{prepend, var::VarCollector, Id, IdentFinder, UsageFinder};

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
    ForLetLoop(Vec<Id>),
    Fn,
}

#[derive(Default)]
struct BlockScoping {
    scope: ScopeStack,
    vars: Vec<VarDeclarator>,
}

impl BlockScoping {
    fn fold_with_scope<T>(&mut self, kind: ScopeKind, node: T) -> T
    where
        T: FoldWith<Self>,
    {
        self.scope.push(kind);
        let node = node.fold_with(self);
        let last = self.scope.pop();
        debug_assert_eq!(Some(kind), last);

        node
    }

    fn in_loop_body(&self) -> bool {
        self.scope.iter().any(|scope| match scope {
            ScopeKind::ForLetLoop(..) | ScopeKind::Loop => true,
            _ => false,
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
        let test = node.test.fold_with(self);
        let update = node.update.fold_with(self);

        let body = self.fold_with_scope(ScopeKind::Loop, node.body);

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
        let left = node.left.fold_with(self);
        let vars = find_vars(&node.left);

        let right = node.right.fold_with(self);

        let kind = if vars.is_empty() {
            ScopeKind::Loop
        } else {
            ScopeKind::ForLetLoop(vars)
        };
        let body = self.fold_with_scope(kind, node.body);

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
        let left = node.left.fold_with(self);
        let vars = find_vars(&node.left);

        let right = node.right.fold_with(self);

        let kind = if vars.is_empty() {
            ScopeKind::Loop
        } else {
            ScopeKind::ForLetLoop(vars)
        };
        let body = self.fold_with_scope(kind, node.body);

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

impl Fold<Module> for BlockScoping {
    fn fold(&mut self, node: Module) -> Module {
        let mut module: Module = node.fold_children(self);

        prepend(
            &mut module.body,
            ModuleItem::Stmt(Stmt::Decl(Decl::Var(VarDecl {
                span: DUMMY_SP,
                kind: VarDeclKind::Var,
                declare: false,
                decls: replace(&mut self.vars, Default::default()),
            }))),
        );

        validate!(module)
    }
}

impl Fold<Script> for BlockScoping {
    fn fold(&mut self, node: Script) -> Script {
        let mut script: Script = node.fold_children(self);

        prepend(
            &mut script.body,
            Stmt::Decl(Decl::Var(VarDecl {
                span: DUMMY_SP,
                kind: VarDeclKind::Var,
                declare: false,
                decls: replace(&mut self.vars, Default::default()),
            })),
        );

        validate!(script)
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

#[cfg(test)]
mod tests {
    use super::block_scoping;

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
}
