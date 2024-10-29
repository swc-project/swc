use swc_ecma_ast::{ExportAll, ImportDecl, NamedExport, Pass};
use swc_ecma_visit::{noop_visit_mut_type, visit_mut_pass, VisitMut};

#[deprecated(note = "Please use `import_assertions` instead")]
pub use self::import_attributes as import_assertions;

pub fn import_attributes() -> impl Pass {
    visit_mut_pass(ImportAssertions)
}

struct ImportAssertions;

impl VisitMut for ImportAssertions {
    noop_visit_mut_type!();

    fn visit_mut_import_decl(&mut self, n: &mut ImportDecl) {
        n.with = None;
    }

    fn visit_mut_export_all(&mut self, n: &mut ExportAll) {
        n.with = None;
    }

    fn visit_mut_named_export(&mut self, n: &mut NamedExport) {
        n.with = None;
    }
}
