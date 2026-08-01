use indexmap::{IndexMap, IndexSet};
use swc_atoms::Atom;
use swc_common::{util::take::Take, Spanned, DUMMY_SP};
use swc_ecma_ast::*;
use swc_ecma_utils::{
    private_ident, prop_name_from_str, quote_ident, quote_str, ExprFactory, FunctionFactory,
};

use super::{
    ir::{DependencySlot, ExecuteStmt, ExportInit, ExportName, SetterOp, SystemModule},
    lower::{export_call, export_names_call},
    util::{export_object_init, member_expr_for, member_for_export, object_lit_prop_name},
};
use crate::{module_record::ImportAttributeRecord, path::Resolver, util::prop_name};

enum DirectReExport {
    Named(Atom),
    Namespace,
}

impl DirectReExport {
    fn into_value(self, namespace: Ident) -> Expr {
        match self {
            Self::Named(imported) => member_for_export(namespace, &imported),
            Self::Namespace => namespace.into(),
        }
    }
}

pub(super) fn emit(
    mut stmts: Vec<Stmt>,
    mut module: SystemModule,
    export_ident: Ident,
    context_ident: Ident,
    resolver: &Resolver,
) -> Vec<ExprOrSpread> {
    let deps = emit_dependency_array(&module.dependencies, resolver);
    let setters = emit_setters(&module.dependencies, &module, &export_ident);
    let metadata = emit_metadata_array(&module.dependencies);
    let initialized_exports = module.export_inits.take();
    let export_inits = emit_export_inits(&module, initialized_exports, &export_ident);

    emit_var_decl(&mut stmts, module.wrapper_vars.take());
    emit_export_setters(&mut stmts, &module, &export_ident);
    stmts.extend(
        module
            .wrapper_fns
            .take()
            .into_iter()
            .map(|f| Stmt::Decl(Decl::Fn(f))),
    );
    stmts.extend(module.wrapper_stmts.take());
    stmts.extend(export_inits);

    let execute: Expr = Function {
        body: Some(BlockStmt {
            stmts: module
                .execute_stmts
                .into_iter()
                .map(|execute_stmt| emit_execute_stmt(execute_stmt, &export_ident))
                .collect(),
            ..Default::default()
        }),
        is_async: module.async_execute,
        ..Default::default()
    }
    .into_fn_expr(None)
    .into();

    let register_body = ObjectLit {
        span: DUMMY_SP,
        props: vec![
            Prop::KeyValue(KeyValueProp {
                key: quote_ident!("setters").into(),
                value: setters.into(),
            })
            .into(),
            Prop::KeyValue(KeyValueProp {
                key: quote_ident!("execute").into(),
                value: execute.into(),
            })
            .into(),
        ],
    };

    stmts.push(
        ReturnStmt {
            span: DUMMY_SP,
            arg: Some(register_body.into()),
        }
        .into(),
    );

    let register = Function {
        params: vec![export_ident.into(), context_ident.into()],
        body: Some(BlockStmt {
            stmts,
            ..Default::default()
        }),
        ..Default::default()
    }
    .into_fn_expr(None);

    let mut args = vec![deps.as_arg(), register.as_arg()];
    if let Some(metadata) = metadata {
        args.push(metadata.as_arg());
    }

    args
}

fn emit_execute_stmt(stmt: ExecuteStmt, export_ident: &Ident) -> Stmt {
    match stmt {
        ExecuteStmt::Source(stmt) => stmt,
        ExecuteStmt::Assign { left, right } => AssignExpr {
            span: right.span(),
            op: op!("="),
            left,
            right,
        }
        .into_stmt(),
        ExecuteStmt::ExportAssign {
            exports,
            local,
            right,
        } => {
            let assign: Expr = AssignExpr {
                span: right.span(),
                op: op!("="),
                left: local.into(),
                right,
            }
            .into();
            export_call(export_ident, &exports, assign).into_stmt()
        }
        ExecuteStmt::ExportValue { export, value } => {
            export_call(export_ident, &[export], *value).into_stmt()
        }
        ExecuteStmt::ExportBatch { value } => export_ident
            .clone()
            .as_call(value.span(), vec![value.as_arg()])
            .into_stmt(),
        ExecuteStmt::ExportNames { exports, value } => {
            export_names_call(export_ident, &exports, value).into_stmt()
        }
    }
}

fn emit_dependency_array(deps: &[DependencySlot], resolver: &Resolver) -> Expr {
    ArrayLit {
        elems: deps
            .iter()
            .map(|dep| {
                let request = resolver.resolve(dep.request.clone());
                Some(
                    Str {
                        span: dep.span.0,
                        value: request.into(),
                        raw: None,
                    }
                    .as_arg(),
                )
            })
            .collect(),
        ..Default::default()
    }
    .into()
}

fn emit_metadata_array(deps: &[DependencySlot]) -> Option<Expr> {
    if !deps.iter().any(|dep| !dep.attributes.is_empty()) {
        return None;
    }

    let array = ArrayLit {
        elems: deps.iter().map(emit_metadata_element).collect(),
        ..Default::default()
    };

    Some(array.into())
}

fn emit_metadata_element(dep: &DependencySlot) -> Option<ExprOrSpread> {
    let metadata = ObjectLit {
        props: emit_metadata_props(&dep.attributes),
        ..Default::default()
    };

    Some(metadata.as_arg())
}

fn emit_metadata_props(attributes: &[ImportAttributeRecord]) -> Vec<PropOrSpread> {
    if attributes.is_empty() {
        return Vec::new();
    }

    let assert_prop = Prop::KeyValue(KeyValueProp {
        key: quote_ident!("assert").into(),
        value: emit_import_attributes(attributes).into(),
    });

    vec![assert_prop.into()]
}

fn emit_import_attributes(attributes: &[ImportAttributeRecord]) -> ObjectLit {
    ObjectLit {
        props: attributes
            .iter()
            .map(|attribute| {
                Prop::KeyValue(KeyValueProp {
                    key: prop_name_from_str(DUMMY_SP, attribute.key()),
                    value: attribute.value().clone().into(),
                })
                .into()
            })
            .collect(),
        ..Default::default()
    }
}

fn emit_setters(deps: &[DependencySlot], module: &SystemModule, export_ident: &Ident) -> Expr {
    ArrayLit {
        elems: deps
            .iter()
            .map(|dep| Some(emit_setter(dep, module, export_ident).as_arg()))
            .collect(),
        ..Default::default()
    }
    .into()
}

fn emit_setter(dep: &DependencySlot, module: &SystemModule, export_ident: &Ident) -> Expr {
    let needs_namespace = !dep.setter_ops.is_empty();
    let mut stmts = Vec::new();
    let mut direct_reexports = Vec::new();
    let mut has_star = false;

    for op in &dep.setter_ops {
        match op {
            SetterOp::Import { local, imported } => {
                let value = imported.as_ref().map_or_else(
                    || dep.namespace.clone().into(),
                    |name| member_for_export(dep.namespace.clone(), name),
                );
                stmts.push(
                    value
                        .make_assign_to(op!("="), local.clone().into())
                        .into_stmt(),
                );
                if let Some(exports) = module.exports.exports_for(&local.to_id()) {
                    stmts.push(export_names_call(export_ident, exports, local.clone()).into_stmt());
                }
            }
            SetterOp::ReExport { export, imported } => {
                direct_reexports.push((export.clone(), DirectReExport::Named(imported.clone())));
            }
            SetterOp::ReExportNamespace { export } => {
                direct_reexports.push((export.clone(), DirectReExport::Namespace));
            }
            SetterOp::StarExport => {
                has_star = true;
            }
        }
    }

    if has_star {
        let export_obj = private_ident!("exportObj");
        stmts.push(
            export_object_init()
                .into_var_decl(VarDeclKind::Var, export_obj.clone().into())
                .into(),
        );
        stmts.push(emit_star_loop(export_obj.clone(), dep.namespace.clone()));
        for (export, imported) in direct_reexports {
            stmts.push(
                imported
                    .into_value(dep.namespace.clone())
                    .make_assign_to(
                        op!("="),
                        member_expr_for(export_obj.clone(), &export.name, export.span).into(),
                    )
                    .into_stmt(),
            );
        }
        stmts.push(
            export_ident
                .clone()
                .as_call(DUMMY_SP, vec![export_obj.as_arg()])
                .into_stmt(),
        );
    } else if !direct_reexports.is_empty() {
        let exports = direct_reexports
            .into_iter()
            .map(|(export, imported)| (export, imported.into_value(dep.namespace.clone())))
            .collect::<Vec<_>>();
        stmts.push(export_values_call(export_ident, exports).into_stmt());
    }

    Function {
        params: if needs_namespace {
            vec![dep.namespace.clone().into()]
        } else {
            Default::default()
        },
        body: Some(BlockStmt {
            stmts,
            ..Default::default()
        }),
        ..Default::default()
    }
    .into_fn_expr(None)
    .into()
}

fn emit_star_loop(export_obj: Ident, namespace: Ident) -> Stmt {
    let key = quote_ident!("key");
    let test = key
        .clone()
        .make_bin(op!("!=="), quote_str!("default"))
        .make_bin(
            op!("&&"),
            key.clone().make_bin(op!("!=="), quote_str!("__esModule")),
        );
    let assign = namespace
        .clone()
        .computed_member(key.clone())
        .make_assign_to(op!("="), export_obj.computed_member(key.clone()).into())
        .into_stmt();

    ForInStmt {
        span: DUMMY_SP,
        left: VarDecl {
            decls: vec![VarDeclarator {
                span: DUMMY_SP,
                name: key.clone().into(),
                init: None,
                definite: false,
            }],
            ..Default::default()
        }
        .into(),
        right: namespace.into(),
        body: IfStmt {
            span: DUMMY_SP,
            test: test.into(),
            cons: assign.into(),
            alt: None,
        }
        .into(),
    }
    .into()
}

fn emit_var_decl(stmts: &mut Vec<Stmt>, mut vars: Vec<Ident>) {
    vars.sort_unstable_by(|a, b| a.sym.cmp(&b.sym));
    let mut seen: IndexSet<Id> = IndexSet::default();
    let decls = vars
        .into_iter()
        .filter(|ident| seen.insert(ident.to_id()))
        .map(|ident| VarDeclarator {
            span: ident.span,
            name: ident.into(),
            init: None,
            definite: false,
        })
        .collect::<Vec<_>>();

    if !decls.is_empty() {
        stmts.push(
            VarDecl {
                kind: VarDeclKind::Var,
                decls,
                ..Default::default()
            }
            .into(),
        );
    }
}

fn emit_export_setters(stmts: &mut Vec<Stmt>, module: &SystemModule, export_ident: &Ident) {
    if !module.needs_export_setters {
        return;
    }

    let setters = module
        .exports
        .local_exports
        .iter()
        .filter(|(_, exports)| !exports.is_empty())
        .map(|((sym, ctxt), exports)| {
            let local = Ident::new(sym.clone(), DUMMY_SP, *ctxt);
            let value = private_ident!("_value");
            Prop::Setter(SetterProp {
                key: prop_name(sym, Default::default()).into(),
                this_param: None,
                param: Pat::Ident(BindingIdent {
                    id: value.clone(),
                    type_ann: None,
                })
                .into(),
                body: Some(BlockStmt {
                    stmts: vec![
                        value
                            .make_assign_to(op!("="), local.clone().into())
                            .into_stmt(),
                        export_names_call(export_ident, exports, local).into_stmt(),
                    ],
                    ..Default::default()
                }),
                span: DUMMY_SP,
            })
            .into()
        })
        .collect::<Vec<_>>();

    if setters.is_empty() {
        return;
    }

    stmts.push(
        ObjectLit {
            props: setters,
            ..Default::default()
        }
        .into_var_decl(VarDeclKind::Var, module.export_setters.clone().into())
        .into(),
    );
}

fn emit_export_inits(
    module: &SystemModule,
    initialized_exports: Vec<ExportInit>,
    export_ident: &Ident,
) -> Vec<Stmt> {
    let mut announced = Vec::new();
    let mut seen: IndexSet<Atom> = IndexSet::default();
    for export in &module.exports.announced {
        if seen.insert(export.name.clone()) {
            announced.push(export.clone());
        }
    }

    if announced.is_empty() {
        return Default::default();
    }

    let mut initial_values = module
        .wrapper_fns
        .iter()
        .filter_map(|fn_decl| {
            module
                .exports
                .exports_for(&fn_decl.ident.to_id())
                .map(|exports| (fn_decl.ident.clone(), exports))
        })
        .flat_map(|(ident, exports)| {
            exports
                .iter()
                .map(move |export| (export.name.clone(), ident.clone()))
        })
        .map(|(export, ident)| (export, Expr::from(ident)))
        .collect::<IndexMap<_, _>>();
    for ExportInit { export, value } in initialized_exports {
        initial_values.insert(export.name, *value);
    }

    let props = announced
        .into_iter()
        .map(|export| {
            let value = initial_values
                .shift_remove(&export.name)
                .unwrap_or_else(|| *Expr::undefined(DUMMY_SP));
            (export, value)
        })
        .collect::<Vec<_>>();

    vec![export_values_call(export_ident, props).into_stmt()]
}

fn export_values_call(export_ident: &Ident, exports: Vec<(ExportName, Expr)>) -> Expr {
    if exports.len() == 1 {
        let (export, value) = exports.into_iter().next().unwrap();
        return export_ident.clone().as_call(
            value.span(),
            vec![
                Str {
                    span: export.span.0,
                    value: export.name.into(),
                    raw: None,
                }
                .as_arg(),
                value.as_arg(),
            ],
        );
    }

    let props = exports
        .into_iter()
        .map(|(export, value)| {
            Prop::KeyValue(KeyValueProp {
                key: object_lit_prop_name(&export.name, export.span),
                value: value.into(),
            })
            .into()
        })
        .collect();

    export_ident.clone().as_call(
        DUMMY_SP,
        vec![ObjectLit {
            props,
            ..Default::default()
        }
        .as_arg()],
    )
}
