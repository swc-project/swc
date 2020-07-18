use super::Dce;
use swc_common::{util::move_map::MoveMap, Fold, FoldWith, Spanned};
use swc_ecma_ast::*;
use swc_ecma_utils::ident::IdentLike;

impl Fold<FnDecl> for Dce<'_> {
    fn fold(&mut self, mut f: FnDecl) -> FnDecl {
        if self.is_marked(f.span()) {
            return f;
        }

        if self.marking_phase || self.included.contains(&f.ident.to_id()) {
            f.function.span = f.function.span.apply_mark(self.config.used_mark);
            f.function.body = self.fold_in_marking_phase(f.function.body);
        }

        f.fold_children_with(self)
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

        node.fold_children_with(self)
    }
}

impl Fold<VarDecl> for Dce<'_> {
    fn fold(&mut self, mut var: VarDecl) -> VarDecl {
        if self.is_marked(var.span) {
            return var;
        }

        log::trace!("VarDecl");
        var = var.fold_children_with(self);

        var.decls = var.decls.move_flat_map(|decl| {
            if self.is_marked(decl.span()) {
                return Some(decl);
            }

            if !self.should_include(&decl.name) {
                if self.decl_dropping_phase {
                    return None;
                }
                return Some(decl);
            }

            Some(VarDeclarator {
                span: decl.span.apply_mark(self.config.used_mark),
                init: self.fold_in_marking_phase(decl.init),
                name: self.fold_in_marking_phase(decl.name),
                ..decl
            })
        });

        if var.decls.is_empty() || !self.decl_dropping_phase {
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
