use std::borrow::Cow;

use swc_atoms::Atom;
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
