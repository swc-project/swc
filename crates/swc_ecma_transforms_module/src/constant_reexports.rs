use rustc_hash::FxHashMap;
use swc_common::DUMMY_SP;
use swc_ecma_ast::*;
use swc_ecma_utils::{
    member_expr, private_ident, quote_ident, quote_str, ExprFactory, FunctionFactory,
};

use crate::{
    module_record::{ExportBinding, LocalExportEntries, ModuleRecordEntry, RequestedModules},
    module_ref_rewriter::ImportMap,
    util::{define_export_value, emit_export_assignment, prop_name, sort_export_bindings},
};

/// Tracks imported locals that are exported again and explicit names that a
/// star re-export must skip even before their assignments have run.
pub(crate) struct ConstantReexports {
    aliases: FxHashMap<Id, Vec<ExportBinding>>,
    explicit_names: Option<(Ident, ObjectLit)>,
    copy_star: Option<Ident>,
}

impl ConstantReexports {
    pub(crate) fn new(requests: &RequestedModules, local_exports: &mut LocalExportEntries) -> Self {
        let explicit_names = if requests
            .values()
            .any(|request| request.usage.has_star_export())
        {
            let mut names = local_exports
                .keys()
                .chain(requests.values().flat_map(|request| {
                    request
                        .entries
                        .iter()
                        .filter_map(ModuleRecordEntry::indirect_export_name)
                }))
                .collect::<Vec<_>>();
            names.sort_unstable();
            names.dedup();
            (!names.is_empty()).then(|| {
                let props = names
                    .into_iter()
                    .map(|name| {
                        // Prefix keys to keep `__proto__` an ordinary object
                        // literal property.
                        KeyValueProp {
                            key: prop_name(&format!("${name}"), Default::default()).into(),
                            value: true.into(),
                        }
                    })
                    .map(Prop::KeyValue)
                    .map(PropOrSpread::from)
                    .collect();
                (
                    private_ident!("_exportNames"),
                    ObjectLit {
                        span: DUMMY_SP,
                        props,
                    },
                )
            })
        } else {
            None
        };

        let mut aliases = FxHashMap::default();
        if !local_exports.is_empty() && !requests.is_empty() {
            for request in requests.values() {
                for id in request
                    .entries
                    .iter()
                    .filter_map(ModuleRecordEntry::import_local_name)
                {
                    aliases.insert(id.clone(), Vec::new());
                }
            }
            let mut live_exports = LocalExportEntries::with_capacity_and_hasher(
                local_exports.len(),
                Default::default(),
            );
            for (name, binding) in std::mem::take(local_exports) {
                if let Some(exports) = aliases.get_mut(&binding.local_id()) {
                    exports.push((name, binding));
                } else {
                    live_exports.insert(name, binding);
                }
            }
            *local_exports = live_exports;
        }

        Self {
            aliases,
            explicit_names,
            copy_star: None,
        }
    }

    pub(crate) fn take_aliases<'a>(
        &mut self,
        entries: impl Iterator<Item = &'a Id>,
    ) -> Vec<ExportBinding> {
        entries
            .filter_map(|id| self.aliases.remove(id))
            .flatten()
            .collect()
    }

    pub(crate) fn copy_star(&mut self, source: Expr, exports: Ident) -> Expr {
        self.copy_star
            .get_or_insert_with(|| private_ident!("_export_star"))
            .clone()
            .as_call(DUMMY_SP, vec![source.as_arg(), exports.as_arg()])
    }

    pub(crate) fn emit_star_header(self, kind: VarDeclKind, stmts: &mut Vec<Stmt>) {
        if let Some(copy_star) = self.copy_star {
            let names = self.explicit_names.as_ref().map(|(names, _)| names.clone());
            if let Some((names, props)) = self.explicit_names {
                stmts.push(props.into_var_decl(kind, names.into()).into());
            }
            stmts.push(star_function(names).into_fn_decl(copy_star).into());
        }
    }
}

pub(crate) fn emit_constant_reexports(
    mut reexports: Vec<ExportBinding>,
    exports: Ident,
    import_map: &ImportMap,
    lazy_namespace: Option<&Id>,
    stmts: &mut Vec<Stmt>,
    live_exports: &mut Vec<ExportBinding>,
) {
    sort_export_bindings(&mut reexports);
    for (name, binding) in reexports {
        if lazy_namespace.is_some_and(|namespace| {
            binding.local_id() == *namespace
                || import_map
                    .get(&binding.local_id())
                    .is_some_and(|(_, prop)| prop.is_none())
        }) {
            // Reading a lazy namespace export is what triggers its require.
            live_exports.push((name, binding));
            continue;
        }
        stmts.push(emit_export_assignment(exports.clone(), name, binding));
    }
}

/// Copies the enumerable own exports of a dependency before returning it for
/// any import-interop wrapper. Explicit exports and prior stars take priority.
fn star_function(explicit_names: Option<Ident>) -> Function {
    let from = private_ident!("from");
    let to = private_ident!("to");
    let key = private_ident!("key");
    let same_key = |name: &str| BinExpr {
        span: DUMMY_SP,
        op: op!("==="),
        left: Box::new(key.clone().into()),
        right: Box::new(quote_str!(name).into()),
    };
    let has_own = |obj: Ident, key: Expr| {
        member_expr!(
            Default::default(),
            DUMMY_SP,
            Object.prototype.hasOwnProperty.call
        )
        .as_call(DUMMY_SP, vec![obj.as_arg(), key.as_arg()])
    };
    let or = |left: Expr, right: Expr| -> Expr {
        BinExpr {
            span: DUMMY_SP,
            op: op!("||"),
            left: Box::new(left),
            right: Box::new(right),
        }
        .into()
    };
    let mut skip = or(same_key("default").into(), same_key("__esModule").into());
    if let Some(names) = explicit_names {
        let prefixed_key = BinExpr {
            span: DUMMY_SP,
            op: BinaryOp::Add,
            left: Box::new(quote_str!("$").into()),
            right: Box::new(key.clone().into()),
        };
        skip = or(skip, has_own(names, prefixed_key.into()));
    }
    skip = or(skip, has_own(to.clone(), key.clone().into()));

    let computed = || {
        MemberProp::Computed(ComputedPropName {
            span: DUMMY_SP,
            expr: Box::new(key.clone().into()),
        })
    };
    let prop = |obj: Ident| MemberExpr {
        span: DUMMY_SP,
        obj: Box::new(obj.into()),
        prop: computed(),
    };
    let copy = IfStmt {
        span: DUMMY_SP,
        test: Box::new(same_key("__proto__").into()),
        cons: Box::new(define_export_value(
            to.clone(),
            key.clone().into(),
            prop(from.clone()).into(),
        )),
        alt: Some(Box::new(
            prop(from.clone())
                .make_assign_to(op!("="), prop(to.clone()).into())
                .into_stmt(),
        )),
    };
    let callback = Function {
        params: vec![key.into()],
        body: Some(FunctionBody {
            span: DUMMY_SP,
            stmts: vec![
                IfStmt {
                    span: DUMMY_SP,
                    test: Box::new(skip),
                    cons: Box::new(
                        ReturnStmt {
                            span: DUMMY_SP,
                            arg: None,
                        }
                        .into(),
                    ),
                    alt: None,
                }
                .into(),
                copy.into(),
            ],
        }),
        ..Default::default()
    };
    let copy_keys = member_expr!(Default::default(), DUMMY_SP, Object.keys)
        .as_call(DUMMY_SP, vec![from.clone().as_arg()])
        .make_member(quote_ident!("forEach"))
        .as_call(
            DUMMY_SP,
            vec![Expr::from(callback.into_fn_expr(None)).as_arg()],
        );
    Function {
        params: vec![from.clone().into(), to.into()],
        body: Some(FunctionBody {
            span: DUMMY_SP,
            stmts: vec![copy_keys.into_stmt(), from.into_return_stmt().into()],
        }),
        ..Default::default()
    }
}
