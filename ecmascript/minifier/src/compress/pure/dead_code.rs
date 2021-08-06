use super::Pure;
use swc_atoms::js_word;
use swc_ecma_ast::*;
use swc_ecma_transforms_base::ext::MapWithMut;
use swc_ecma_utils::StmtLike;

/// Methods related to option `dead_code`.
impl Pure<'_> {
    pub(super) fn drop_useless_blocks<T>(&mut self, stmts: &mut Vec<T>)
    where
        T: StmtLike,
    {
        fn is_inliable(b: &BlockStmt) -> bool {
            b.stmts.iter().all(|s| match s {
                Stmt::Decl(Decl::Fn(FnDecl {
                    ident:
                        Ident {
                            sym: js_word!("undefined"),
                            ..
                        },
                    ..
                })) => false,

                Stmt::Decl(
                    Decl::Var(VarDecl {
                        kind: VarDeclKind::Var,
                        ..
                    })
                    | Decl::Fn(..),
                ) => true,
                Stmt::Decl(..) => false,
                _ => true,
            })
        }

        if stmts.iter().all(|stmt| match stmt.as_stmt() {
            Some(Stmt::Block(b)) if is_inliable(b) => false,
            _ => true,
        }) {
            return;
        }

        self.changed = true;
        log::debug!("Dropping useless block");

        let mut new = vec![];
        for stmt in stmts.take() {
            match stmt.try_into_stmt() {
                Ok(v) => match v {
                    Stmt::Block(v) if is_inliable(&v) => {
                        new.extend(v.stmts.into_iter().map(T::from_stmt));
                    }
                    _ => new.push(T::from_stmt(v)),
                },
                Err(v) => {
                    new.push(v);
                }
            }
        }

        *stmts = new;
    }

    pub(super) fn drop_unused_stmt_at_end_of_fn(&mut self, s: &mut Stmt) {
        match s {
            Stmt::Return(r) => match r.arg.as_deref_mut() {
                Some(Expr::Unary(UnaryExpr {
                    span,
                    op: op!("void"),
                    arg,
                })) => {
                    log::debug!("unused: Removing `return void` in end of a function");
                    self.changed = true;
                    *s = Stmt::Expr(ExprStmt {
                        span: *span,
                        expr: arg.take(),
                    });
                    return;
                }
                _ => {}
            },
            _ => {}
        }
    }
}
