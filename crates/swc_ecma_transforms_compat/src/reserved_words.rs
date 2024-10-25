use swc_atoms::JsWord;
use swc_ecma_ast::*;
use swc_ecma_transforms_base::perf::Parallel;
use swc_ecma_visit::{
    noop_visit_mut_type, visit_mut_obj_and_computed, visit_mut_pass, VisitMut, VisitMutWith,
};

pub fn reserved_words() -> impl 'static + Pass + VisitMut {
    visit_mut_pass(EsReservedWord)
}

#[derive(Clone, Copy)]
struct EsReservedWord;

impl Parallel for EsReservedWord {
    fn create(&self) -> Self {
        *self
    }

    fn merge(&mut self, _: Self) {}
}

impl VisitMut for EsReservedWord {
    noop_visit_mut_type!(fail);

    visit_mut_obj_and_computed!();

    fn visit_mut_export_specifier(&mut self, _n: &mut ExportSpecifier) {}

    fn visit_mut_ident(&mut self, i: &mut Ident) {
        rename_ident(&mut i.sym, true);
    }

    fn visit_mut_import_named_specifier(&mut self, s: &mut ImportNamedSpecifier) {
        s.local.visit_mut_with(self);
    }

    fn visit_mut_private_name(&mut self, _: &mut PrivateName) {}

    fn visit_mut_prop_name(&mut self, _n: &mut PropName) {}
}

fn is_reserved(sym: &str) -> bool {
    matches!(
        sym,
        "enum"
            | "implements"
            | "package"
            | "protected"
            | "interface"
            | "private"
            | "public"
            | "await"
            | "break"
            | "case"
            | "catch"
            | "class"
            | "const"
            | "continue"
            | "debugger"
            | "default"
            | "delete"
            | "do"
            | "else"
            | "export"
            | "extends"
            | "finally"
            | "for"
            | "function"
            | "if"
            | "in"
            | "instanceof"
            | "new"
            | "return"
            | "super"
            | "switch"
            | "this"
            | "throw"
            | "try"
            | "typeof"
            | "var"
            | "void"
            | "while"
            | "with"
            | "yield"
    )
}

fn rename_ident(sym: &mut JsWord, _strict: bool) {
    // Es
    if is_reserved(&*sym) {
        let s = format!("_{}", sym).into();
        *sym = s;
    }
}
