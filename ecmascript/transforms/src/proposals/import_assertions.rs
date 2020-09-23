use swc_ecma_ast::ImportDecl;
use swc_ecma_visit::{as_folder, noop_visit_mut_type, Fold, VisitMut};

pub fn import_assertions() -> impl Fold {
    as_folder(ImportAssertions)
}
struct ImportAssertions;

impl VisitMut for ImportAssertions {
    noop_visit_mut_type!();

    fn visit_mut_import_decl(&mut self, n: &mut ImportDecl) {
        n.asserts = None;
    }
}
