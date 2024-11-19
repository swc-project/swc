use std::{iter, mem::take};

use either::Either;
use serde::Deserialize;
use swc_common::{Spanned, DUMMY_SP};
use swc_ecma_ast::{Pass, *};
use swc_ecma_transforms_base::helper;
use swc_ecma_transforms_classes::super_field::SuperFieldAccessFolder;
use swc_ecma_utils::{
    alias_ident_for, constructor::inject_after_super, default_constructor_with_span, prepend_stmt,
    private_ident, prop_name_to_expr, prop_name_to_expr_value, quote_ident, quote_str, ExprFactory,
};
use swc_ecma_visit::{
    fold_pass, noop_fold_type, visit_mut_pass, Fold, FoldWith, Visit, VisitMutWith, VisitWith,
};

mod legacy;

/// ## Simple class decorator
///
/// ```js
/// 
/// @annotation
/// class MyClass { }
///
/// function annotation(target) {
///    target.annotated = true;
/// }
/// ```
///
/// ## Class decorator
///
/// ```js
/// @isTestable(true)
/// class MyClass { }
///
/// function isTestable(value) {
///    return function decorator(target) {
///       target.isTestable = value;
///    }
/// }
/// ```
///
/// ## Class method decorator
///
/// ```js
/// class C {
///   @enumerable(false)
///   method() { }
/// }
///
/// function enumerable(value) {
///   return function (target, key, descriptor) {
///      descriptor.enumerable = value;
///      return descriptor;
///   }
/// }
/// ```
pub fn decorators(c: Config) -> impl Pass {
    if c.legacy {
        Either::Left(visit_mut_pass(self::legacy::new(c.emit_metadata)))
    } else {
        if c.emit_metadata {
            unimplemented!("emitting decorator metadata while using new proposal")
        }
        Either::Right(fold_pass(Decorators {
            is_in_strict: false,
            vars: Default::default(),
        }))
    }
}

#[derive(Debug, Default, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Config {
    pub legacy: bool,
    #[serde(default)]
    pub emit_metadata: bool,

    pub use_define_for_class_fields: bool,
}

#[derive(Debug, Default)]
struct Decorators {
    is_in_strict: bool,

    vars: Vec<VarDeclarator>,
}

/// TODO: VisitMut
impl Fold for Decorators {
    noop_fold_type!();

    fn fold_decl(&mut self, decl: Decl) -> Decl {
        let decl = decl.fold_children_with(self);

        match decl {
            Decl::Class(ClassDecl {
                ident,
                declare: false,
                class,
            }) => {
                if !contains_decorator(&class) {
                    return ClassDecl {
                        ident,
                        declare: false,
                        class,
                    }
                    .into();
                }

                let decorate_call = Box::new(self.fold_class_inner(ident.clone(), class));

                VarDecl {
                    kind: VarDeclKind::Let,
                    decls: vec![VarDeclarator {
                        span: DUMMY_SP,
                        name: ident.into(),
                        definite: false,
                        init: Some(decorate_call),
                    }],
                    ..Default::default()
                }
                .into()
            }
            _ => decl,
        }
    }

    fn fold_expr(&mut self, expr: Expr) -> Expr {
        let expr = expr.fold_children_with(self);

        match expr {
            Expr::Class(ClassExpr { ident, class }) => {
                if !contains_decorator(&class) {
                    return ClassExpr { ident, class }.into();
                }

                self.fold_class_inner(
                    ident.unwrap_or_else(|| quote_ident!("_class").into()),
                    class,
                )
            }
            _ => expr,
        }
    }

    fn fold_module_decl(&mut self, decl: ModuleDecl) -> ModuleDecl {
        let decl = decl.fold_children_with(self);

        match decl {
            ModuleDecl::ExportDefaultDecl(ExportDefaultDecl {
                span,
                decl: DefaultDecl::Class(ClassExpr { ident, class }),
                ..
            }) => {
                let decorate_call = Box::new(self.fold_class_inner(
                    ident.unwrap_or_else(|| quote_ident!("_class").into()),
                    class,
                ));

                ExportDefaultExpr {
                    span,
                    expr: decorate_call,
                }
                .into()
            }
            _ => decl,
        }
    }

    fn fold_module_items(&mut self, items: Vec<ModuleItem>) -> Vec<ModuleItem> {
        if !contains_decorator(&items) {
            return items;
        }

        let old_strict = self.is_in_strict;
        self.is_in_strict = true;

        let mut buf = Vec::with_capacity(items.len() + 4);
        items.into_iter().for_each(|item| {
            if !contains_decorator(&item) {
                buf.push(item);
                return;
            }

            macro_rules! handle_class {
                ($cls:expr, $ident:expr) => {{
                    let class = $cls;
                    let ident = $ident;
                    let decorate_call = Box::new(self.fold_class_inner(ident.clone(), class));

                    buf.push(
                        VarDecl {
                            span: DUMMY_SP,
                            kind: VarDeclKind::Let,
                            declare: false,
                            decls: vec![VarDeclarator {
                                span: DUMMY_SP,
                                name: ident.clone().into(),
                                init: Some(decorate_call),
                                definite: false,
                            }],
                            ..Default::default()
                        }
                        .into(),
                    );

                    // export { Foo as default }
                    buf.push(ModuleItem::ModuleDecl(ModuleDecl::ExportNamed(
                        NamedExport {
                            span: DUMMY_SP,
                            specifiers: vec![ExportNamedSpecifier {
                                span: DUMMY_SP,
                                orig: ModuleExportName::Ident(ident),
                                exported: Some(ModuleExportName::Ident(
                                    quote_ident!("default").into(),
                                )),
                                is_type_only: false,
                            }
                            .into()],
                            src: None,
                            type_only: false,
                            with: None,
                        },
                    )));
                }};
            }
            //
            match item {
                ModuleItem::ModuleDecl(ModuleDecl::ExportDefaultDecl(ExportDefaultDecl {
                    decl:
                        DefaultDecl::Class(ClassExpr {
                            ident: Some(ident),
                            class,
                        }),
                    ..
                })) => handle_class!(class, ident),
                ModuleItem::ModuleDecl(ModuleDecl::ExportDefaultExpr(ExportDefaultExpr {
                    span,
                    expr,
                    ..
                })) => match *expr {
                    Expr::Class(ClassExpr {
                        ident: Some(ident),
                        class,
                    }) => handle_class!(class, ident),

                    _ => {
                        let item: ModuleItem = ExportDefaultExpr { span, expr }.into();
                        buf.push(item.fold_with(self));
                    }
                },
                _ => {
                    buf.push(item.fold_with(self));
                }
            }
        });

        self.is_in_strict = old_strict;

        if !self.vars.is_empty() {
            prepend_stmt(
                &mut buf,
                VarDecl {
                    span: DUMMY_SP,
                    kind: VarDeclKind::Var,
                    declare: false,
                    decls: take(&mut self.vars),
                    ..Default::default()
                }
                .into(),
            )
        }

        buf
    }
}

impl Decorators {
    #[allow(clippy::boxed_local)]
    fn fold_class_inner(&mut self, ident: Ident, mut class: Box<Class>) -> Expr {
        let initialize = private_ident!("_initialize");
        let super_class_ident = class
            .super_class
            .as_ref()
            .map(|expr| alias_ident_for(expr, "_super"));
        let super_class_expr = class.super_class;
        class.super_class = super_class_ident.clone().map(|i| i.into());

        let constructor = {
            let initialize_call = CallExpr {
                span: DUMMY_SP,
                callee: initialize.clone().as_callee(),
                args: vec![ThisExpr { span: DUMMY_SP }.as_arg()],
                ..Default::default()
            }
            .into();

            // Inject initialize
            let pos = class.body.iter().position(|member| {
                matches!(
                    *member,
                    ClassMember::Constructor(Constructor { body: Some(..), .. })
                )
            });

            match pos {
                Some(pos) => {
                    let mut c = match class.body.remove(pos) {
                        ClassMember::Constructor(c) => c,
                        _ => unreachable!(),
                    };
                    inject_after_super(&mut c, vec![initialize_call]);

                    ClassMember::Constructor(c)
                }
                None => {
                    let mut c =
                        default_constructor_with_span(super_class_ident.is_some(), class.span);

                    c.body
                        .as_mut()
                        .unwrap()
                        .stmts
                        .push(initialize_call.into_stmt());

                    ClassMember::Constructor(c)
                }
            }
        };

        macro_rules! fold_method {
            ($method:expr, $fn_name:expr, $key_prop_value:expr) => {{
                let fn_name = $fn_name;
                let mut method = $method;
                let mut folder = SuperFieldAccessFolder {
                    class_name: &ident,
                    constructor_this_mark: None,
                    is_static: method.is_static,
                    folding_constructor: false,
                    in_nested_scope: false,
                    in_injected_define_property_call: false,
                    this_alias_mark: None,
                    // TODO: loose mode
                    constant_super: false,
                    super_class: &None,
                    in_pat: false,
                };

                method.visit_mut_with(&mut folder);

                //   kind: "method",
                //   key: getKeyJ(),
                //   value: function () {
                //     return 2;
                //   }
                Some(
                    ObjectLit {
                        span: DUMMY_SP,
                        props: iter::once(PropOrSpread::Prop(Box::new(Prop::KeyValue(
                            KeyValueProp {
                                key: PropName::Ident(quote_ident!("kind")),
                                value: Box::new(Expr::Lit(Lit::Str(quote_str!(
                                    match method.kind {
                                        MethodKind::Method => "method",
                                        MethodKind::Getter => "get",
                                        MethodKind::Setter => "set",
                                    }
                                )))),
                            },
                        ))))
                        .chain(if method.is_static {
                            Some(PropOrSpread::Prop(Box::new(Prop::KeyValue(KeyValueProp {
                                key: PropName::Ident(quote_ident!("static")),
                                value: true.into(),
                            }))))
                        } else {
                            None
                        })
                        .chain({
                            //
                            if method.function.decorators.is_empty() {
                                None
                            } else {
                                Some(PropOrSpread::Prop(Box::new(Prop::KeyValue(KeyValueProp {
                                    key: PropName::Ident(quote_ident!("decorators")),
                                    value: Box::new(Expr::Array(ArrayLit {
                                        span: DUMMY_SP,
                                        elems: method
                                            .function
                                            .decorators
                                            .into_iter()
                                            .map(|dec| dec.expr.as_arg())
                                            .map(Some)
                                            .collect(),
                                    })),
                                }))))
                            }
                        })
                        .chain(iter::once(PropOrSpread::Prop(Box::new(Prop::KeyValue(
                            KeyValueProp {
                                key: PropName::Ident(quote_ident!("key")),
                                value: $key_prop_value,
                            },
                        )))))
                        .chain(iter::once(PropOrSpread::Prop(Box::new(Prop::KeyValue(
                            KeyValueProp {
                                key: PropName::Ident(quote_ident!("value")),
                                value: Box::new(
                                    FnExpr {
                                        ident: fn_name.map(Ident::from).map(Ident::into_private),
                                        function: Function {
                                            decorators: Vec::new(),
                                            ..*method.function
                                        }
                                        .into(),
                                    }
                                    .into(),
                                ),
                            },
                        )))))
                        .collect(),
                    }
                    .as_arg(),
                )
            }};
        }

        let descriptors = class
            .body
            .into_iter()
            .filter_map(|member| {
                //
                match member {
                    ClassMember::Constructor(_) => unreachable!("multiple constructor?"),
                    ClassMember::TsIndexSignature(_) => None,
                    ClassMember::Method(method) => {
                        let fn_name = match method.key {
                            PropName::Ident(ref i) => Some(i.clone()),
                            PropName::Str(ref s) => Some(IdentName::new(s.value.clone(), s.span)),
                            _ => None,
                        };
                        let key_prop_value = Box::new(prop_name_to_expr_value(method.key.clone()));

                        fold_method!(method, fn_name, key_prop_value)
                    }
                    ClassMember::PrivateMethod(method) => {
                        let fn_name = Ident::new_no_ctxt(
                            format!("_{}", method.key.name).into(),
                            method.key.span,
                        );
                        let key_prop_value = Lit::Str(Str {
                            span: method.key.span,
                            raw: None,
                            value: method.key.name.clone(),
                        })
                        .into();
                        fold_method!(method, Some(fn_name), key_prop_value)
                    }
                    ClassMember::ClassProp(prop) => {
                        let prop_span = prop.span();
                        let key_prop_value = match prop.key {
                            PropName::Ident(i) => Lit::Str(Str {
                                span: i.span,
                                raw: None,
                                value: i.sym,
                            })
                            .into(),
                            _ => prop_name_to_expr(prop.key).into(),
                        };
                        //
                        Some(
                            ObjectLit {
                                span: prop_span,
                                props: iter::once(PropOrSpread::Prop(Box::new(Prop::KeyValue(
                                    KeyValueProp {
                                        key: PropName::Ident(quote_ident!("kind")),
                                        value: Lit::Str(quote_str!("field")).into(),
                                    },
                                ))))
                                .chain(if prop.is_static {
                                    Some(PropOrSpread::Prop(Box::new(Prop::KeyValue(
                                        KeyValueProp {
                                            key: PropName::Ident(quote_ident!("static")),
                                            value: true.into(),
                                        },
                                    ))))
                                } else {
                                    None
                                })
                                .chain({
                                    //
                                    if prop.decorators.is_empty() {
                                        None
                                    } else {
                                        Some(PropOrSpread::Prop(Box::new(Prop::KeyValue(
                                            KeyValueProp {
                                                key: PropName::Ident(quote_ident!("decorators")),
                                                value: ArrayLit {
                                                    span: DUMMY_SP,
                                                    elems: prop
                                                        .decorators
                                                        .into_iter()
                                                        .map(|dec| dec.expr.as_arg())
                                                        .map(Some)
                                                        .collect(),
                                                }
                                                .into(),
                                            },
                                        ))))
                                    }
                                })
                                .chain(iter::once(PropOrSpread::Prop(Box::new(Prop::KeyValue(
                                    KeyValueProp {
                                        key: PropName::Ident(quote_ident!("key")),
                                        value: key_prop_value,
                                    },
                                )))))
                                .chain(iter::once(PropOrSpread::Prop(Box::new(match prop.value {
                                    Some(value) => Prop::Method(MethodProp {
                                        key: PropName::Ident(quote_ident!("value")),
                                        function: Function {
                                            span: DUMMY_SP,
                                            is_async: false,
                                            is_generator: false,
                                            decorators: Vec::new(),
                                            params: Vec::new(),

                                            body: Some(BlockStmt {
                                                span: DUMMY_SP,
                                                stmts: vec![Stmt::Return(ReturnStmt {
                                                    span: DUMMY_SP,
                                                    arg: Some(value),
                                                })],
                                                ..Default::default()
                                            }),
                                            ..Default::default()
                                        }
                                        .into(),
                                    }),
                                    _ => Prop::KeyValue(KeyValueProp {
                                        key: PropName::Ident(quote_ident!("value")),
                                        value: Expr::undefined(DUMMY_SP),
                                    }),
                                }))))
                                .collect(),
                            }
                            .as_arg(),
                        )
                    }
                    _ => unimplemented!("ClassMember::{:?}", member,),
                }
            })
            .map(Some)
            .collect();

        make_decorate_call(
            class.decorators,
            iter::once({
                // function(_initialize) {}
                Function {
                    span: DUMMY_SP,

                    params: iter::once(initialize.into())
                        .chain(super_class_ident.map(Pat::from))
                        .map(|pat| Param {
                            span: DUMMY_SP,
                            decorators: Vec::new(),
                            pat,
                        })
                        .collect(),

                    decorators: Default::default(),
                    is_async: false,
                    is_generator: false,

                    body: Some(BlockStmt {
                        span: DUMMY_SP,
                        stmts: if !self.is_in_strict {
                            // 'use strict';
                            Some(Lit::Str(quote_str!("use strict")).into_stmt())
                        } else {
                            None
                        }
                        .into_iter()
                        .chain(iter::once(
                            ClassDecl {
                                ident: ident.clone(),
                                class: Class {
                                    decorators: Default::default(),
                                    body: vec![constructor],
                                    ..*class
                                }
                                .into(),
                                declare: false,
                            }
                            .into(),
                        ))
                        .chain(iter::once(
                            ReturnStmt {
                                span: DUMMY_SP,
                                arg: Some(
                                    ObjectLit {
                                        span: DUMMY_SP,
                                        props: vec![
                                            PropOrSpread::Prop(Box::new(Prop::KeyValue(
                                                KeyValueProp {
                                                    key: PropName::Ident(quote_ident!("F")),
                                                    value: Box::new(Expr::Ident(ident)),
                                                },
                                            ))),
                                            PropOrSpread::Prop(Box::new(Prop::KeyValue(
                                                KeyValueProp {
                                                    key: PropName::Ident(quote_ident!("d")),
                                                    value: Box::new(Expr::Array(ArrayLit {
                                                        span: DUMMY_SP,
                                                        elems: descriptors,
                                                    })),
                                                },
                                            ))),
                                        ],
                                    }
                                    .into(),
                                ),
                            }
                            .into(),
                        ))
                        .collect(),
                        ..Default::default()
                    }),
                    ..Default::default()
                }
                .as_arg()
            })
            .chain(super_class_expr.map(|e| e.as_arg())),
        )
        .into()
    }
}

fn make_decorate_call(
    decorators: Vec<Decorator>,
    args: impl Iterator<Item = ExprOrSpread>,
) -> CallExpr {
    CallExpr {
        span: DUMMY_SP,
        callee: helper!(decorate),
        args: iter::once(
            ArrayLit {
                span: DUMMY_SP,
                elems: decorators
                    .into_iter()
                    .map(|dec| Some(dec.expr.as_arg()))
                    .collect(),
            }
            .as_arg(),
        )
        .chain(args)
        .collect(),
        ..Default::default()
    }
}

struct DecoratorFinder {
    found: bool,
}
impl Visit for DecoratorFinder {
    fn visit_decorator(&mut self, _: &Decorator) {
        self.found = true
    }
}

fn contains_decorator<N>(node: &N) -> bool
where
    N: VisitWith<DecoratorFinder>,
{
    let mut v = DecoratorFinder { found: false };
    node.visit_with(&mut v);
    v.found
}
