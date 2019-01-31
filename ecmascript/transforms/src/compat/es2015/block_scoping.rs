use crate::pass::Pass;
use ast::*;
use swc_common::{Fold, FoldWith};

pub fn block_scoping() -> impl Pass + Clone + Copy {
    BlockScoping
}

#[derive(Clone, Copy)]
struct BlockScoping;
pass_clone!(BlockScoping);

impl Fold<VarDecl> for BlockScoping {
    fn fold(&mut self, var: VarDecl) -> VarDecl {
        let var = var.fold_children(self);

        VarDecl {
            kind: VarDeclKind::Var,
            ..var
        }
    }
}
