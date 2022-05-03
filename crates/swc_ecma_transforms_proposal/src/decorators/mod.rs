use std::{iter, mem::take};

use either::Either;
use serde::Deserialize;
use swc_common::{Spanned, DUMMY_SP};
use swc_ecma_ast::*;
use swc_ecma_transforms_base::helper;
use swc_ecma_transforms_classes::super_field::SuperFieldAccessFolder;
use swc_ecma_utils::{
    alias_ident_for, constructor::inject_after_super, default_constructor, prepend, private_ident,
    prop_name_to_expr, prop_name_to_expr_value, quote_ident, quote_str, undefined, ExprFactory,
    IdentExt,
};
use swc_ecma_visit::{as_folder, noop_fold_type, Fold, FoldWith, Visit, VisitWith};

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
pub fn decorators(c: Config) -> impl Fold {
    if c.legacy {
        Either::Left(as_folder(self::legacy::new(
            c.emit_metadata,
            c.use_define_for_class_fields,
        )))
    } else {
        if c.emit_metadata {
            unimplemented!("emitting decorator metadata while using new proposal")
        }
        Either::Right(Decorators {
            is_in_strict: false,
            vars: Default::default(),
        })
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
                    return Decl::Class(ClassDecl {
                        ident,
                        declare: false,
                        class,
                    });
                }

                let decorate_call = Box::new(self.fold_class_inner(ident.clone(), class));

                Decl::Var(VarDecl {
                    span: DUMMY_SP,
                    kind: VarDeclKind::Let,
                    declare: false,
                    decls: vec![VarDeclarator {
                        span: DUMMY_SP,
                        name: ident.into(),
                        definite: false,
                        init: Some(decorate_call),
                    }],
                })
            }
            _ => decl,
        }
    }

    fn fold_expr(&mut self, expr: Expr) -> Expr {
        let expr = expr.fold_children_with(self);

        match expr {
            Expr::Class(ClassExpr { ident, class }) => {
                if !contains_decorator(&class) {
                    return Expr::Class(ClassExpr { ident, class });
                }

                self.fold_class_inner(ident.unwrap_or_else(|| quote_ident!("_class")), class)
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
                let decorate_call = Box::new(
                    self.fold_class_inner(ident.unwrap_or_else(|| quote_ident!("_class")), class),
                );

                ModuleDecl::ExportDefaultExpr(ExportDefaultExpr {
                    span,
                    expr: decorate_call,
                })
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

                    buf.push(ModuleItem::Stmt(Stmt::Decl(Decl::Var(VarDecl {
                        span: DUMMY_SP,
                        kind: VarDeclKind::Let,
                        declare: false,
                        decls: vec![VarDeclarator {
                            span: DUMMY_SP,
                            name: ident.clone().into(),
                            init: Some(decorate_call),
                            definite: false,
                        }],
                    }))));

                    // export { Foo as default }
                    buf.push(ModuleItem::ModuleDecl(ModuleDecl::ExportNamed(
                        NamedExport {
                            span: DUMMY_SP,
                            specifiers: vec![ExportNamedSpecifier {
                                span: DUMMY_SP,
                                orig: ModuleExportName::Ident(ident),
                                exported: Some(ModuleExportName::Ident(quote_ident!("default"))),
                                is_type_only: false,
                            }
                            .into()],
                            src: None,
                            type_only: false,
                            asserts: None,
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
                        let item = ModuleItem::ModuleDecl(ModuleDecl::ExportDefaultExpr(
                            ExportDefaultExpr { span, expr },
                        ));
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
            prepend(
                &mut buf,
                ModuleItem::Stmt(Stmt::Decl(Decl::Var(VarDecl {
                    span: DUMMY_SP,
                    kind: VarDeclKind::Var,
                    declare: false,
                    decls: take(&mut self.vars),
                }))),
            )
        }

        buf
    }
}

impl Decorators {
    fn fold_class_inner(&mut self, ident: Ident, mut class: Class) -> Expr {
        let initialize = private_ident!("_initialize");
        let super_class_ident = class
            .super_class
            .as_ref()
            .map(|expr| alias_ident_for(expr, "_super"));
        let super_class_expr = class.super_class;
        class.super_class = super_class_ident.clone().map(|i| Box::new(Expr::Ident(i)));

        let constructor = {
            let initialize_call = Box::new(Expr::Call(CallExpr {
                span: DUMMY_SP,
                callee: initialize.clone().as_callee(),
                args: vec![ThisExpr { span: DUMMY_SP }.as_arg()],
                type_args: Default::default(),
            }));

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
                    let mut c = default_constructor(super_class_ident.is_some());

                    c.body
                        .as_mut()
                        .unwrap()
                        .stmts
                        .push(initialize_call.into_stmt());

                    ClassMember::Constructor(c)
                }
            }
        };

        let mut vars = vec![];

        macro_rules! fold_method {
            ($method:expr, $fn_name:expr, $key_prop_value:expr) => {{
                let fn_name = $fn_name;
                let method = $method;
                let mut folder = swc_ecma_visit::as_folder(SuperFieldAccessFolder {
                    class_name: &ident,
                    vars: &mut vars,
                    constructor_this_mark: None,
                    is_static: method.is_static,
                    folding_constructor: false,
                    in_nested_scope: false,
                    in_injected_define_property_call: false,
                    this_alias_mark: None,
                    // TODO: loose mode
                    constant_super: false,
                    super_class: &None,
                });

                let method = method.fold_with(&mut folder);

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
                                        ident: fn_name.map(IdentExt::private),
                                        function: Function {
                                            decorators: vec![],
                                            ..method.function
                                        },
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
                            PropName::Str(ref s) => Some(Ident::new(s.value.clone(), s.span)),
                            _ => None,
                        };
                        let key_prop_value = Box::new(prop_name_to_expr_value(method.key.clone()));

                        fold_method!(method, fn_name, key_prop_value)
                    }
                    ClassMember::PrivateMethod(method) => {
                        let fn_name = Ident::new(
                            format!("_{}", method.key.id.sym).into(),
                            method.key.id.span,
                        );
                        let key_prop_value = Box::new(Expr::Lit(Lit::Str(Str {
                            span: method.key.id.span,
                            raw: None,
                            value: method.key.id.sym.clone(),
                        })));
                        fold_method!(method, Some(fn_name), key_prop_value)
                    }
                    ClassMember::ClassProp(prop) => {
                        let prop_span = prop.span();
                        let key_prop_value = match prop.key {
                            PropName::Ident(i) => Box::new(Expr::Lit(Lit::Str(Str {
                                span: i.span,
                                raw: None,
                                value: i.sym,
                            }))),
                            _ => prop_name_to_expr(prop.key).into(),
                        };
                        //
                        Some(
                            ObjectLit {
                                span: prop_span,
                                props: iter::once(PropOrSpread::Prop(Box::new(Prop::KeyValue(
                                    KeyValueProp {
                                        key: PropName::Ident(quote_ident!("kind")),
                                        value: Box::new(Expr::Lit(Lit::Str(quote_str!("field")))),
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
                                                value: Box::new(Expr::Array(ArrayLit {
                                                    span: DUMMY_SP,
                                                    elems: prop
                                                        .decorators
                                                        .into_iter()
                                                        .map(|dec| dec.expr.as_arg())
                                                        .map(Some)
                                                        .collect(),
                                                })),
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
                                            decorators: vec![],
                                            params: vec![],

                                            body: Some(BlockStmt {
                                                span: DUMMY_SP,
                                                stmts: vec![Stmt::Return(ReturnStmt {
                                                    span: DUMMY_SP,
                                                    arg: Some(value),
                                                })],
                                            }),

                                            type_params: Default::default(),
                                            return_type: Default::default(),
                                        },
                                    }),
                                    _ => Prop::KeyValue(KeyValueProp {
                                        key: PropName::Ident(quote_ident!("value")),
                                        value: undefined(DUMMY_SP),
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

        self.vars.extend(vars);

        Expr::Call(make_decorate_call(
            class.decorators,
            iter::once({
                // function(_initialize) {}
                FnExpr {
                    ident: None,
                    function: Function {
                        span: DUMMY_SP,

                        params: iter::once(Pat::Ident(initialize.into()))
                            .chain(super_class_ident.map(Pat::from))
                            .map(|pat| Param {
                                span: DUMMY_SP,
                                decorators: vec![],
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
                            .chain(iter::once(Stmt::Decl(Decl::Class(ClassDecl {
                                ident: ident.clone(),
                                class: Class {
                                    decorators: Default::default(),
                                    body: vec![constructor],
                                    ..class
                                },
                                declare: false,
                            }))))
                            .chain(iter::once(Stmt::Return(ReturnStmt {
                                span: DUMMY_SP,
                                arg: Some(Box::new(Expr::Object(ObjectLit {
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
                                }))),
                            })))
                            .collect(),
                        }),

                        return_type: Default::default(),
                        type_params: Default::default(),
                    },
                }
                .as_arg()
            })
            .chain(super_class_expr.map(|e| e.as_arg())),
        ))
    }
}

fn make_decorate_call(
    decorators: Vec<Decorator>,
    args: impl Iterator<Item = ExprOrSpread>,
) -> CallExpr {
    CallExpr {
        span: DUMMY_SP,
        callee: helper!(decorate, "decorate"),
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
        type_args: Default::default(),
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
