use swc_common::{Span, DUMMY_SP};
use swc_ecma_ast::*;
use swc_ecma_transforms_base::helper;
use swc_ecma_utils::{
    prop_name_to_expr, prop_name_to_expr_value, quote_ident, undefined, ExprFactory,
};

use super::Config;

pub(super) enum MemberInit {
    PubProp(PubProp),
    PrivProp(PrivProp),
    PrivMethod(PrivMethod),
    PrivAccessor(PrivAccessor),
}

pub(super) struct PubProp {
    pub span: Span,
    pub name: PropName,
    pub value: Box<Expr>,
}

pub(super) struct PrivProp {
    pub span: Span,
    pub name: Ident,
    pub value: Box<Expr>,
}

pub(super) struct PrivMethod {
    pub span: Span,
    pub name: Ident,
}

pub(super) struct PrivAccessor {
    pub span: Span,
    pub name: Ident,
    pub getter: Option<Ident>,
    pub setter: Option<Ident>,
}

pub(super) struct MemberInitRecord {
    c: Config,
    pub record: Vec<MemberInit>,
}

impl MemberInitRecord {
    pub fn new(c: Config) -> Self {
        Self {
            c,
            record: Vec::new(),
        }
    }

    pub fn push(&mut self, member: MemberInit) -> bool {
        // there shouldn't be many class field, so n^2 should be fine
        if let MemberInit::PrivAccessor(accessor) = member {
            if let Some(MemberInit::PrivAccessor(previous)) =
                self.record.iter_mut().find(|item| match item {
                    MemberInit::PrivAccessor(PrivAccessor { name, .. })
                        if name.sym == accessor.name.sym =>
                    {
                        true
                    }
                    _ => false,
                })
            {
                previous.getter = previous.getter.take().or(accessor.getter);
                previous.setter = previous.setter.take().or(accessor.setter);
                false
            } else {
                self.record.push(MemberInit::PrivAccessor(accessor));
                true
            }
        } else {
            self.record.push(member);
            true
        }
    }

    pub fn into_init(self) -> Vec<Box<Expr>> {
        self.record
            .into_iter()
            .map(|init| {
                match init {
                    MemberInit::PrivMethod(PrivMethod { span, name }) => Expr::Call(CallExpr {
                        span,
                        callee: helper!(class_private_method_init, "classPrivateMethodInit"),
                        args: vec![ThisExpr { span: DUMMY_SP }.as_arg(), name.as_arg()],
                        type_args: Default::default(),
                    }),
                    MemberInit::PrivProp(PrivProp { span, name, value }) => Expr::Call(CallExpr {
                        span,
                        callee: helper!(class_private_field_init, "classPrivateFieldInit"),
                        args: vec![
                            ThisExpr { span: DUMMY_SP }.as_arg(),
                            name.as_arg(),
                            get_value_desc(value),
                        ],
                        type_args: Default::default(),
                    }),
                    MemberInit::PrivAccessor(PrivAccessor {
                        span,
                        name,
                        getter,
                        setter,
                    }) => Expr::Call(CallExpr {
                        span,
                        callee: helper!(class_private_field_init, "classPrivateFieldInit"),
                        args: vec![
                            ThisExpr { span: DUMMY_SP }.as_arg(),
                            name.as_arg(),
                            get_accessor_desc(getter, setter),
                        ],
                        type_args: Default::default(),
                    }),
                    MemberInit::PubProp(PubProp { span, name, value }) => {
                        if self.c.set_public_fields {
                            let this = ThisExpr { span: DUMMY_SP };
                            Expr::Assign(AssignExpr {
                                span,
                                left: PatOrExpr::Expr(Box::new(match name {
                                    PropName::Ident(id) => this.make_member(id),
                                    _ => this.computed_member(prop_name_to_expr(name)),
                                })),
                                op: op!("="),
                                right: value,
                            })
                        } else {
                            Expr::Call(CallExpr {
                                span,
                                callee: helper!(define_property, "defineProperty"),
                                args: vec![
                                    ThisExpr { span: DUMMY_SP }.as_arg(),
                                    prop_name_to_expr_value(name).as_arg(),
                                    value.as_arg(),
                                ],
                                type_args: Default::default(),
                            })
                        }
                    }
                }
                .into()
            })
            .collect()
    }

    pub fn into_init_static(self, class_ident: Ident) -> Vec<Stmt> {
        self.record
            .into_iter()
            .map(|value| match value {
                MemberInit::PubProp(PubProp { span, name, value }) => Stmt::Expr(ExprStmt {
                    span,
                    expr: (if self.c.set_public_fields {
                        let class = class_ident.clone();
                        Expr::Assign(AssignExpr {
                            span,
                            left: PatOrExpr::Expr(Box::new(match name {
                                PropName::Ident(id) => class.make_member(id),
                                _ => class.computed_member(prop_name_to_expr(name)),
                            })),
                            op: op!("="),
                            right: value,
                        })
                    } else {
                        Expr::Call(CallExpr {
                            span,
                            callee: helper!(define_property, "defineProperty"),
                            args: vec![
                                class_ident.clone().as_arg(),
                                prop_name_to_expr_value(name).as_arg(),
                                value.as_arg(),
                            ],
                            type_args: Default::default(),
                        })
                    })
                    .into(),
                }),
                MemberInit::PrivProp(PrivProp { span, name, value }) => {
                    Stmt::Decl(Decl::Var(VarDecl {
                        span,
                        kind: VarDeclKind::Var,
                        decls: vec![VarDeclarator {
                            span,
                            name: name.into(),
                            init: Some(
                                Expr::Object(ObjectLit {
                                    span,
                                    props: vec![
                                        PropOrSpread::Prop(Box::new(Prop::KeyValue(
                                            KeyValueProp {
                                                key: PropName::Ident(quote_ident!("writable")),
                                                value: true.into(),
                                            },
                                        ))),
                                        PropOrSpread::Prop(Box::new(Prop::KeyValue(
                                            KeyValueProp {
                                                key: PropName::Ident(quote_ident!("value")),
                                                value,
                                            },
                                        ))),
                                    ],
                                })
                                .into(),
                            ),
                            definite: false,
                        }],
                        declare: false,
                    }))
                }
                MemberInit::PrivAccessor(PrivAccessor {
                    span,
                    name,
                    getter,
                    setter,
                }) => Stmt::Decl(Decl::Var(VarDecl {
                    span,
                    kind: VarDeclKind::Var,
                    decls: vec![VarDeclarator {
                        span,
                        name: name.into(),
                        init: Some(
                            Expr::Object(ObjectLit {
                                span,
                                props: vec![
                                    PropOrSpread::Prop(Box::new(Prop::KeyValue(KeyValueProp {
                                        key: PropName::Ident(quote_ident!("get")),
                                        value: getter
                                            .map(|id| Box::new(id.into()))
                                            .unwrap_or_else(|| undefined(DUMMY_SP)),
                                    }))),
                                    PropOrSpread::Prop(Box::new(Prop::KeyValue(KeyValueProp {
                                        key: PropName::Ident(quote_ident!("set")),
                                        value: setter
                                            .map(|id| Box::new(id.into()))
                                            .unwrap_or_else(|| undefined(DUMMY_SP)),
                                    }))),
                                ],
                            })
                            .into(),
                        ),
                        definite: false,
                    }],
                    declare: false,
                })),
                MemberInit::PrivMethod(_) => unreachable!(),
            })
            .collect()
    }
}

fn get_value_desc(value: Box<Expr>) -> ExprOrSpread {
    ObjectLit {
        span: DUMMY_SP,
        props: vec![
            // writeable: true
            PropOrSpread::Prop(Box::new(Prop::KeyValue(KeyValueProp {
                key: PropName::Ident(quote_ident!("writable")),
                value: true.into(),
            }))),
            // value: value,
            PropOrSpread::Prop(Box::new(Prop::KeyValue(KeyValueProp {
                key: PropName::Ident(quote_ident!("value")),
                value,
            }))),
        ],
    }
    .as_arg()
}

fn get_accessor_desc(getter: Option<Ident>, setter: Option<Ident>) -> ExprOrSpread {
    ObjectLit {
        span: DUMMY_SP,
        props: vec![
            PropOrSpread::Prop(Box::new(Prop::KeyValue(KeyValueProp {
                key: PropName::Ident(quote_ident!("get")),
                value: getter
                    .map(|id| Box::new(id.into()))
                    .unwrap_or_else(|| undefined(DUMMY_SP)),
            }))),
            PropOrSpread::Prop(Box::new(Prop::KeyValue(KeyValueProp {
                key: PropName::Ident(quote_ident!("set")),
                value: setter
                    .map(|id| Box::new(id.into()))
                    .unwrap_or_else(|| undefined(DUMMY_SP)),
            }))),
        ],
    }
    .as_arg()
}
