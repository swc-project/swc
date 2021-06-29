use swc_atoms::js_word;
use swc_atoms::JsWord;
use swc_ecma_ast::*;
use swc_ecma_transforms_base::perf::Check;
use swc_ecma_transforms_macros::fast_path;
use swc_ecma_visit::{
    as_folder, noop_visit_mut_type, noop_visit_type, Fold, Node, Visit, VisitMut, VisitMutWith,
};

pub fn reserved_words() -> impl 'static + Fold + VisitMut {
    as_folder(EsReservedWord)
}

struct EsReservedWord;

#[fast_path(ShouldWork)]
impl VisitMut for EsReservedWord {
    noop_visit_mut_type!();

    fn visit_mut_export_specifier(&mut self, _n: &mut ExportSpecifier) {}

    fn visit_mut_meta_prop_expr(&mut self, _n: &mut MetaPropExpr) {}

    fn visit_mut_ident(&mut self, i: &mut Ident) {
        rename_ident(&mut i.sym, true);
    }

    fn visit_mut_import_named_specifier(&mut self, s: &mut ImportNamedSpecifier) {
        s.local.visit_mut_with(self);
    }

    fn visit_mut_member_expr(&mut self, e: &mut MemberExpr) {
        match &e.obj {
            ExprOrSuper::Super(_) => {}
            ExprOrSuper::Expr(obj) => match &**obj {
                Expr::Ident(Ident {
                    sym: js_word!("new"),
                    ..
                })
                | Expr::Ident(Ident {
                    sym: js_word!("import"),
                    ..
                }) => return,
                _ => {}
            },
        }
        e.obj.visit_mut_with(self);

        if e.computed {
            e.prop.visit_mut_with(self);
        }
    }

    fn visit_mut_prop_name(&mut self, _n: &mut PropName) {}
}

fn is_reserved(sym: &JsWord) -> bool {
    match *sym {
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
        | js_word!("yield") => true,

        _ => false,
    }
}

fn rename_ident(sym: &mut JsWord, _strict: bool) {
    // Es
    if is_reserved(&*sym) {
        let s = format!("_{}", sym).into();
        *sym = s;
    }
}
#[derive(Default)]
struct ShouldWork {
    found: bool,
}

impl Visit for ShouldWork {
    noop_visit_type!();

    fn visit_ident(&mut self, i: &Ident, _: &dyn Node) {
        if is_reserved(&i.sym) {
            self.found = true;
            return;
        }
    }
}

impl Check for ShouldWork {
    fn should_handle(&self) -> bool {
        self.found
    }
}
