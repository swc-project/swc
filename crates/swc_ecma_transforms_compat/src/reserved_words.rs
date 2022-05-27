use swc_atoms::{js_word, JsWord};
use swc_ecma_ast::*;
use swc_ecma_visit::{
    as_folder, noop_visit_mut_type, visit_mut_obj_and_computed, Fold, VisitMut, VisitMutWith,
};

pub fn reserved_words() -> impl 'static + Fold + VisitMut {
    as_folder(EsReservedWord)
}

#[derive(Clone, Copy)]
struct EsReservedWord;

impl VisitMut for EsReservedWord {
    noop_visit_mut_type!();

    visit_mut_obj_and_computed!();

    fn visit_mut_export_specifier(&mut self, _n: &mut ExportSpecifier) {}

    fn visit_mut_ident(&mut self, i: &mut Ident) {
        rename_ident(&mut i.sym, true);
    }

    fn visit_mut_import_named_specifier(&mut self, s: &mut ImportNamedSpecifier) {
        s.local.visit_mut_with(self);
    }

    fn visit_mut_prop_name(&mut self, _n: &mut PropName) {}
}

fn is_reserved(sym: &JsWord) -> bool {
    matches!(
        *sym,
        js_word!("enum")
            | js_word!("implements")
            | js_word!("package")
            | js_word!("protected")
            | js_word!("interface")
            | js_word!("private")
            | js_word!("public")
            | js_word!("await")
            | js_word!("break")
            | js_word!("case")
            | js_word!("catch")
            | js_word!("class")
            | js_word!("const")
            | js_word!("continue")
            | js_word!("debugger")
            | js_word!("default")
            | js_word!("delete")
            | js_word!("do")
            | js_word!("else")
            | js_word!("export")
            | js_word!("extends")
            | js_word!("finally")
            | js_word!("for")
            | js_word!("function")
            | js_word!("if")
            | js_word!("in")
            | js_word!("instanceof")
            | js_word!("new")
            | js_word!("return")
            | js_word!("super")
            | js_word!("switch")
            | js_word!("this")
            | js_word!("throw")
            | js_word!("try")
            | js_word!("typeof")
            | js_word!("var")
            | js_word!("void")
            | js_word!("while")
            | js_word!("with")
            | js_word!("yield")
    )
}

fn rename_ident(sym: &mut JsWord, _strict: bool) {
    // Es
    if is_reserved(&*sym) {
        let s = format!("_{}", sym).into();
        *sym = s;
    }
}
