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

macro_rules! impl_loop {
    ($T:path) => {
        impl Fold<$T> for BlockScoping {
            fn fold(&mut self, node: $T) -> $T {
                let body = node.body.fold_with(&mut BlockScoping{
                    in_loop_body: true
                });

                $T { body , ..node }
            }
        }
    };

    ($T:path,) => {
        impl_loop!($T);
    };

    ($T:path, $($rest:tt)*) => {
        impl_loop!($T);
        impl_loop!($($rest)*);
    }
}
impl_loop!(DoWhileStmt, WhileStmt, ForStmt, ForOfStmt, ForInStmt);

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
        "for (const key in obj) {
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
