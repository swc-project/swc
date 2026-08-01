use indexmap::IndexMap;
use swc_ecma_ast::*;

use super::{ir::ExportName, util::export_setter_member};

/// Rewrites assignment patterns so writes to exported locals flow through
/// setter properties. The setter body updates the local binding and calls
/// `_export`, which keeps destructuring evaluation order compatible with live
/// bindings.
pub(super) fn replace_exported_pat(
    pat: &mut Pat,
    exports: &IndexMap<Id, Vec<ExportName>>,
    export_setters: &Ident,
) -> bool {
    match pat {
        Pat::Ident(binding) => {
            if exports.contains_key(&binding.id.to_id()) {
                *pat = export_setter_member(export_setters, &binding.id);
                true
            } else {
                false
            }
        }
        Pat::Array(array) => {
            let mut changed = false;
            for pat in array.elems.iter_mut().flatten() {
                changed |= replace_exported_pat(pat, exports, export_setters);
            }
            changed
        }
        Pat::Rest(rest) => replace_exported_pat(&mut rest.arg, exports, export_setters),
        Pat::Object(object) => {
            let mut changed = false;
            for prop in &mut object.props {
                changed |= match prop {
                    ObjectPatProp::KeyValue(key_value) => {
                        replace_exported_pat(&mut key_value.value, exports, export_setters)
                    }
                    ObjectPatProp::Assign(assign) => {
                        if exports.contains_key(&assign.key.id.to_id()) {
                            let member = export_setter_member(export_setters, &assign.key.id);
                            let value = if let Some(default) = assign.value.take() {
                                Pat::Assign(AssignPat {
                                    span: assign.span,
                                    left: member.into(),
                                    right: default,
                                })
                            } else {
                                member
                            };
                            *prop = ObjectPatProp::KeyValue(KeyValuePatProp {
                                key: PropName::Ident(assign.key.id.clone().into()),
                                value: value.into(),
                            });
                            true
                        } else {
                            false
                        }
                    }
                    ObjectPatProp::Rest(rest) => {
                        replace_exported_pat(&mut rest.arg, exports, export_setters)
                    }
                    #[cfg(swc_ast_unknown)]
                    _ => false,
                };
            }
            changed
        }
        Pat::Assign(assign) => replace_exported_pat(&mut assign.left, exports, export_setters),
        Pat::Invalid(_) | Pat::Expr(_) => false,
        #[cfg(swc_ast_unknown)]
        _ => false,
    }
}
