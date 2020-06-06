use super::Dce;
use swc_common::{Fold, FoldWith, Spanned};
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

        let var: VarDecl = var.fold_children(self);

        if self.included.is_empty() {
            return if self.should_include(&var) {
                VarDecl {
                    span: var.span.apply_mark(self.config.used_mark),
                    ..var
                }
            } else {
                var
            };
        }

        let ids: Vec<Ident> = find_ids(&var.decls);

        for i in ids {
            for i1 in &self.included {
                if i1.0 == i.sym && i1.1 == i.span.ctxt() {
                    return VarDecl {
                        span: var.span.apply_mark(self.config.used_mark),
                        ..var
                    };
                }
            }
        }

        var
    }
}

preserve!(TsInterfaceDecl);
preserve!(TsTypeAliasDecl);
preserve!(TsEnumDecl);
preserve!(TsModuleDecl);
