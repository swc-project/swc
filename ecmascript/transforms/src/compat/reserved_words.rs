use crate::pass::Pass;
use swc_atoms::JsWord;
use swc_common::{Fold, FoldWith};
use swc_ecma_ast::*;

pub fn reserved_words() -> impl 'static + Pass {
    EsReservedWord {}
}

struct EsReservedWord {}

noop_fold_type!(EsReservedWord);

impl Fold<MemberExpr> for EsReservedWord {
    fn fold(&mut self, e: MemberExpr) -> MemberExpr {
        if e.computed {
            MemberExpr {
                obj: e.obj.fold_with(self),
                prop: e.prop.fold_with(self),
                ..e
            }
        } else {
            MemberExpr {
                obj: e.obj.fold_with(self),
                ..e
            }
        }
    }
}

macro_rules! noop {
    ($T:tt) => {
        impl Fold<$T> for EsReservedWords {
            fn fold(&mut self, node: $T) -> $T {
                node
            }
        }
    };
}

noop!(PropName);
noop!(ExportSpecifier);

impl Fold<ImportNamedSpecifier> for EsReservedWord {
    fn fold(&mut self, s: ImportNamedSpecifier) -> ImportNamedSpecifier {
        if s.imported.is_some() {
            ImportNamedSpecifier {
                local: s.local.fold_with(self),
                ..s
            }
        } else {
            ImportNamedSpecifier {
                imported: s.imported.fold_with(self),
                ..s
            }
        }
    }
}

impl Fold<Ident> for EsReservedWord {
    fn fold(&mut self, i: Ident) -> Ident {
        let sym = rename_ident(i.sym, true);

        Ident { sym, ..i }
    }
}

fn rename_ident(sym: JsWord, _strict: bool) -> JsWord {
    // Es

    match &*sym {
        "enum" | "implements" | "package" | "protected" | "interface" | "private" | "public"
        | "await" | "break" | "case" | "catch" | "class" | "const" | "continue" | "debugger"
        | "default" | "delete" | "do" | "else" | "export" | "extends" | "finally" | "for"
        | "function" | "if" | "in" | "instanceof" | "new" | "return" | "super" | "switch"
        | "this" | "throw" | "try" | "typeof" | "var" | "void" | "while" | "with" | "yield" => {
            format!("_{}", sym).into()
        }

        _ => sym,
    }
}
