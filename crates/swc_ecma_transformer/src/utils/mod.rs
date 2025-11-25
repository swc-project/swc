use std::borrow::Cow;

use swc_atoms::Atom;
use swc_common::{Mark, SyntaxContext, DUMMY_SP};
use swc_ecma_ast::*;

pub(crate) fn normalize_module_export_name(module_export_name: &ModuleExportName) -> Cow<Atom> {
    match module_export_name {
        ModuleExportName::Ident(Ident { sym: name, .. }) => Cow::Borrowed(name),
        ModuleExportName::Str(Str { value: name, .. }) => {
            // Normally, the export name should be valid UTF-8. But it might also contain
            // unpaired surrogates.   Node would give an error in this case:
            // `SyntaxError: Invalid module export name: contains unpaired
            // surrogate`.  Here, we temporarily replace the unpaired surrogates
            // with U+FFFD REPLACEMENT CHARACTER by using Wtf8::to_string_lossy.
            Cow::Owned(Atom::from(name.to_string_lossy()))
        }
        #[cfg(swc_ast_unknown)]
        _ => panic!("unable to access unknown nodes"),
    }
}

/// Create a private identifier with the given name.
///
/// The identifier will have a unique syntax context to avoid conflicts.
pub(crate) fn create_private_ident(name: &str) -> Ident {
    let mark = Mark::new();
    let ctxt = SyntaxContext::empty().apply_mark(mark);
    Ident::new(name.into(), DUMMY_SP, ctxt)
}

/// Generate a temporary variable name based on an expression.
///
/// For example:
/// - `obj.prop` -> `_obj_prop`
/// - `obj[expr]` -> `_obj`
pub(crate) fn generate_temp_var_name(expr: &Expr) -> String {
    match expr {
        Expr::Ident(ident) => format!("_{}", ident.sym),
        Expr::Member(member) => {
            let obj_name = match &*member.obj {
                Expr::Ident(ident) => ident.sym.to_string(),
                _ => "ref".to_string(),
            };
            match &member.prop {
                MemberProp::Ident(prop) => format!("_{}_{}", obj_name, prop.sym),
                _ => format!("_{obj_name}"),
            }
        }
        _ => "_ref".to_string(),
    }
}
