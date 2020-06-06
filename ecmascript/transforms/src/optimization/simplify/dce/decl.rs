use super::Dce;
use swc_common::{util::move_map::MoveMap, Fold, FoldWith, Spanned};
use swc_ecma_ast::*;
use swc_ecma_utils::{find_ids, ident::IdentLike};

impl Fold<FnDecl> for Dce<'_> {
    fn fold(&mut self, mut f: FnDecl) -> FnDecl {
        if self.is_marked(f.span()) {
            return f;
        }

        if self.marking_phase || self.included.contains(&f.ident.to_id()) {
            f.function.span = f.function.span.apply_mark(self.config.used_mark);
            f.function.body = self.fold_in_marking_phase(f.function.body);
        }

        f.fold_children(self)
    }
}

impl Fold<ClassDecl> for Dce<'_> {
    fn fold(&mut self, mut node: ClassDecl) -> ClassDecl {
        if self.is_marked(node.span()) {
            return node;
        }

        if self.marking_phase || self.included.contains(&node.ident.to_id()) {
            node.class.span = node.class.span.apply_mark(self.config.used_mark);
        }

        node.fold_children(self)
    }
}

impl Fold<VarDecl> for Dce<'_> {
    fn fold(&mut self, var: VarDecl) -> VarDecl {
        if self.is_marked(var.span) {
            return var;
        }

        let mut var: VarDecl = var.fold_children(self);

        if self.included.is_empty() {
            return var;
        }

        if self.decl_dropping_phase {
            var.decls = var.decls.move_flat_map(|decl| {
                if !self.should_include(&decl.name) {
                    return None;
                }

                Some(VarDeclarator {
                    init: self.fold_in_marking_phase(decl.init),
                    ..decl
                })
            });
        }

        if var.decls.is_empty() {
            return var;
        }

        return VarDecl {
            span: var.span.apply_mark(self.config.used_mark),
            ..var
        };
    }
}

preserve!(TsInterfaceDecl);
preserve!(TsTypeAliasDecl);
preserve!(TsEnumDecl);
preserve!(TsModuleDecl);
