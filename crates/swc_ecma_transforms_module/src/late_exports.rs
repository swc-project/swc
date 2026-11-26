use rustc_hash::FxHashMap;
use swc_ecma_ast::*;

use crate::{module_record::LocalExportEntries, util::emit_export_getter};

/// Installs getters after the declaration initializes its binding. Bindings
/// initialized during instantiation, including var and function declarations,
/// keep their early getters.
pub(crate) fn defer_lexical_exports(
    exports: Ident,
    body: &mut Vec<ModuleItem>,
    local_exports: &mut LocalExportEntries,
) {
    if local_exports.is_empty() {
        return;
    }

    let mut names_by_binding = FxHashMap::<Id, Vec<_>>::default();
    for (name, binding) in local_exports.iter() {
        names_by_binding
            .entry(binding.local_id())
            .or_default()
            .push(name.clone());
    }

    let mut lowered = Vec::with_capacity(body.len());
    for item in std::mem::take(body) {
        let names =
            lexical_binding(&item).and_then(|ident| names_by_binding.remove(&ident.to_id()));
        lowered.push(item);

        if let Some(mut names) = names {
            names.sort_unstable();
            for name in names {
                let binding = local_exports.remove(&name).unwrap();
                lowered.push(emit_export_getter(exports.clone(), (name, binding)).into());
            }
        }
    }
    *body = lowered;
}

fn lexical_binding(item: &ModuleItem) -> Option<&Ident> {
    let ModuleItem::Stmt(Stmt::Decl(decl)) = item else {
        return None;
    };
    match decl {
        Decl::Class(class) => Some(&class.ident),
        Decl::Var(var) if matches!(var.kind, VarDeclKind::Let | VarDeclKind::Const) => {
            // Another initializer in the same declaration can observe a
            // binding that was initialized earlier in it.
            let [decl] = var.decls.as_slice() else {
                return None;
            };
            decl.name.as_ident().map(|binding| &binding.id)
        }
        _ => None,
    }
}
