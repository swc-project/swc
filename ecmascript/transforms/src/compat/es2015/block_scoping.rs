use crate::{pass::Pass, util::undefined};
use ast::*;
use swc_common::{Fold, FoldWith, Spanned};

pub fn block_scoping() -> impl Pass {
    BlockScoping {
        in_loop_body: false,
    }
}

struct BlockScoping {
    in_loop_body: bool,
}

impl Fold<DoWhileStmt> for BlockScoping {
    fn fold(&mut self, node: DoWhileStmt) -> DoWhileStmt {
        let body = node
            .body
            .fold_with(&mut BlockScoping { in_loop_body: true });

        let test = node.test.fold_with(self);

        DoWhileStmt { body, test, ..node }
    }
}

impl Fold<WhileStmt> for BlockScoping {
    fn fold(&mut self, node: WhileStmt) -> WhileStmt {
        let body = node
            .body
            .fold_with(&mut BlockScoping { in_loop_body: true });

        let test = node.test.fold_with(&mut BlockScoping {
            in_loop_body: false,
        });

        WhileStmt { body, test, ..node }
    }
}

impl Fold<ForStmt> for BlockScoping {
    fn fold(&mut self, node: ForStmt) -> ForStmt {
        let body = node
            .body
            .fold_with(&mut BlockScoping { in_loop_body: true });

        let init = node.init.fold_with(&mut BlockScoping {
            in_loop_body: false,
        });
        let test = node.test.fold_with(&mut BlockScoping {
            in_loop_body: false,
        });
        let update = node.update.fold_with(&mut BlockScoping {
            in_loop_body: false,
        });

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
        let body = node
            .body
            .fold_with(&mut BlockScoping { in_loop_body: true });

        let left = node.left.fold_with(&mut BlockScoping {
            in_loop_body: false,
        });
        let right = node.right.fold_with(&mut BlockScoping {
            in_loop_body: false,
        });

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
        let body = node
            .body
            .fold_with(&mut BlockScoping { in_loop_body: true });

        let left = node.left.fold_with(&mut BlockScoping {
            in_loop_body: false,
        });
        let right = node.right.fold_with(&mut BlockScoping {
            in_loop_body: false,
        });

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
        let f = f.fold_children(&mut BlockScoping {
            in_loop_body: false,
        });

        f
    }
}

impl Fold<ArrowExpr> for BlockScoping {
    fn fold(&mut self, f: ArrowExpr) -> ArrowExpr {
        let f = f.fold_children(&mut BlockScoping {
            in_loop_body: false,
        });

        f
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

        let init = if self.in_loop_body && var.init.is_none() {
            Some(undefined(var.span()))
        } else {
            var.init
        };

        VarDeclarator { init, ..var }
    }
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
