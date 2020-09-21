use swc_common::{util::move_map::MoveMap, DUMMY_SP};
use swc_ecma_ast::*;
use swc_ecma_visit::{Fold, FoldWith};

/// Handles
///
/// ```ts
/// 
/// foo();
/// bar();
/// bar() {}
/// ```
#[derive(Debug, Default)]
pub(crate) struct RealImplRemover {
    last_ambient_fn_name: Option<Ident>,
}

impl Fold for RealImplRemover {
    fn fold_stmt(&mut self, mut node: Stmt) -> Stmt {
        node = node.fold_children_with(self);

        match node {
            Stmt::Decl(Decl::Fn(ref decl)) => {
                if decl.function.body.is_none() {
                    self.last_ambient_fn_name = Some(decl.ident.clone());
                } else {
                    let name = self.last_ambient_fn_name.take();
                    if let Some(prev_name) = name {
                        if prev_name.sym == decl.ident.sym {
                            return Stmt::Empty(EmptyStmt { span: DUMMY_SP });
                        }
                    }
                }
            }
            _ => {}
        }

        node
    }

    fn fold_class_members(&mut self, members: Vec<ClassMember>) -> Vec<ClassMember> {
        let mut last_ambient = None;

        members.move_flat_map(|member| match member {
            ClassMember::Method(m) => match m.key {
                PropName::Ident(ref i) => {
                    if m.function.body.is_none() {
                        last_ambient = Some(i.sym.clone());
                        return Some(ClassMember::Method(m));
                    }

                    if let Some(prev_name) = last_ambient.take() {
                        if prev_name == i.sym {
                            return None;
                        }
                    }
                    return Some(ClassMember::Method(m));
                }
                _ => return Some(ClassMember::Method(m)),
            },
            _ => Some(member),
        })
    }

    #[inline]
    fn fold_ts_module_decl(&mut self, node: TsModuleDecl) -> TsModuleDecl {
        node
    }
}
