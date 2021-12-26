use swc_ecma_ast::{ExportAll, ImportDecl, NamedExport};
use swc_ecma_visit::{as_folder, noop_visit_mut_type, Fold, VisitMut};

pub fn import_assertions() -> impl Fold + VisitMut {
    as_folder(ImportAssertions)
}

struct ImportAssertions;

impl VisitMut for ImportAssertions {
    noop_visit_mut_type!();

    fn visit_mut_import_decl(&mut self, declaration: &mut ImportDecl) {
        declaration.asserts = None;
    }

    fn visit_mut_export_all(&mut self, declaration: &mut ExportAll) {
        declaration.asserts = None;
    }

    fn visit_mut_named_export(&mut self, declaration: &mut NamedExport) {
        declaration.asserts = None;
    }
}
