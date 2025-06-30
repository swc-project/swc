use swc_ecma_ast::*;
use swc_ecma_visit::{noop_fold_type, Fold, FoldWith, fold_pass};
use swc_common::{DUMMY_SP, SyntaxContext};
use swc_ecma_utils::{quote_ident, ExprFactory};
use swc_ecma_transforms_base::enable_helper;

use crate::DecoratorVersion;

pub(crate) fn decorator_impl(version: DecoratorVersion) -> impl Pass {
    fold_pass(DecoratorTransform { version })
}

struct DecoratorTransform {
    version: DecoratorVersion,
}

impl DecoratorTransform {
    fn transform_class_with_decorators(&mut self, mut class: Class) -> (Class, Vec<Stmt>) {
        let mut has_decorators = !class.decorators.is_empty();
        let mut element_decs = Vec::new();
        let mut class_decs = Vec::new();
        let mut init_vars = Vec::new();
        let mut extra_stmts = Vec::new();
        let mut new_members = Vec::new();
        let mut fieldInitializerExpressions: Vec<Expr> = vec![];
        let mut staticFieldInitializerExpressions: Vec<Expr> = vec![];
        let mut accessor_counter = 0;

        // Process class decorators
        for decorator in &class.decorators {
            class_decs.push(decorator.expr.clone());
        }

        // Process class members
        for member in class.body.into_iter() {
            match member {
                ClassMember::ClassProp(mut prop) if !prop.decorators.is_empty() => {
                    has_decorators = true;
                    
                    let key_name = match &prop.key {
                        PropName::Ident(id) => id.sym.to_string(),
                        PropName::Str(s) => s.value.to_string(),
                        PropName::Computed(_) => "computedKey".to_string(),
                        _ => "field".to_string(),
                    };

                    let init_var = format!("_init_{}", key_name);
                    let init_id = Ident::new(init_var.as_str().into(), DUMMY_SP, Default::default());
                    init_vars.push(init_id.clone());

                    // Create element descriptor [decorator(s), kind, name]
                    let kind_value = if prop.is_static { 5.0 } else { 0.0 }; // STATIC + FIELD = 5, FIELD = 0
                    
                    // Handle multiple decorators
                    let decorator_expr = if prop.decorators.len() == 1 {
                        prop.decorators[0].expr.clone()
                    } else {
                        Box::new(Expr::Array(ArrayLit {
                            span: DUMMY_SP,
                            elems: prop.decorators.iter().map(|d| Some(d.expr.clone().as_arg())).collect(),
                        }))
                    };
                    
                    let element_desc = ArrayLit {
                        span: DUMMY_SP,
                        elems: vec![
                            Some(decorator_expr.as_arg()),
                            Some(Lit::Num(Number { span: DUMMY_SP, value: kind_value, raw: None }).as_arg()),
                            Some(match &prop.key {
                                PropName::Ident(id) => Expr::Lit(Lit::Str(Str {
                                    span: DUMMY_SP,
                                    value: id.sym.clone(),
                                    raw: None,
                                })),
                                PropName::Str(s) => Expr::Lit(Lit::Str(s.clone())),
                                PropName::Computed(computed) => *computed.expr.clone(),
                                _ => Expr::Lit(Lit::Str(Str {
                                    span: DUMMY_SP,
                                    value: "field".into(),
                                    raw: None,
                                }))
                            }.as_arg()),
                        ],
                    };
                    element_decs.push(element_desc.as_arg());

                    // Transform field to use initializer
                    prop.decorators.clear();
                    let original_value = prop.value.take();
                    
                    let mut init_args = vec![Expr::This(ThisExpr { span: DUMMY_SP }).as_arg()];
                    if let Some(value) = original_value {
                        init_args.push((*value).as_arg());
                    }
                    
                    prop.value = Some(Box::new(Expr::Call(CallExpr {
                        span: DUMMY_SP,
                        ctxt: Default::default(),
                        callee: init_id.as_callee(),
                        args: init_args,
                        type_args: None,
                    })));

                    new_members.push(ClassMember::ClassProp(prop));
                }
                ClassMember::PrivateProp(mut prop) if !prop.decorators.is_empty() => {
                    has_decorators = true;
                    
                    let key_name = prop.key.name.to_string();
                    let init_var = format!("_init_{}", key_name);
                    let init_id = Ident::new(init_var.as_str().into(), DUMMY_SP, Default::default());
                    init_vars.push(init_id.clone());

                    // Create getter function
                    let getter_fn = FnExpr {
                        ident: None,
                        function: Box::new(Function {
                            params: vec![],
                            decorators: vec![],
                            span: DUMMY_SP,
                            ctxt: Default::default(),
                            body: Some(BlockStmt {
                                span: DUMMY_SP,
                                ctxt: Default::default(),
                                stmts: vec![Stmt::Return(ReturnStmt {
                                    span: DUMMY_SP,
                                    arg: Some(Box::new(Expr::Member(MemberExpr {
                                        span: DUMMY_SP,
                                        obj: Box::new(Expr::This(ThisExpr { span: DUMMY_SP })),
                                        prop: MemberProp::PrivateName(prop.key.clone()),
                                    }))),
                                })],
                            }),
                            is_generator: false,
                            is_async: false,
                            type_params: None,
                            return_type: None,
                        }),
                    };

                    // Create setter function
                    let setter_fn = FnExpr {
                        ident: None,
                        function: Box::new(Function {
                            params: vec![Param {
                                span: DUMMY_SP,
                                decorators: vec![],
                                pat: Pat::Ident(BindingIdent {
                                    id: Ident::new("value".into(), DUMMY_SP, Default::default()),
                                    type_ann: None,
                                }),
                            }],
                            decorators: vec![],
                            span: DUMMY_SP,
                            ctxt: Default::default(),
                            body: Some(BlockStmt {
                                span: DUMMY_SP,
                                ctxt: Default::default(),
                                stmts: vec![Stmt::Expr(ExprStmt {
                                    span: DUMMY_SP,
                                    expr: Box::new(Expr::Assign(AssignExpr {
                                        span: DUMMY_SP,
                                        op: AssignOp::Assign,
                                        left: AssignTarget::Simple(SimpleAssignTarget::Member(MemberExpr {
                                            span: DUMMY_SP,
                                            obj: Box::new(Expr::This(ThisExpr { span: DUMMY_SP })),
                                            prop: MemberProp::PrivateName(prop.key.clone()),
                                        })),
                                        right: Box::new(Expr::Ident(Ident::new("value".into(), DUMMY_SP, Default::default()))),
                                    })),
                                })],
                            }),
                            is_generator: false,
                            is_async: false,
                            type_params: None,
                            return_type: None,
                        }),
                    };

                    // Create element descriptor [decorator(s), kind, name, getter, setter]
                    let kind_value = if prop.is_static { 5.0 } else { 0.0 }; // STATIC + FIELD = 5, FIELD = 0
                    
                    // Handle multiple decorators
                    let decorator_expr = if prop.decorators.len() == 1 {
                        prop.decorators[0].expr.clone()
                    } else {
                        Box::new(Expr::Array(ArrayLit {
                            span: DUMMY_SP,
                            elems: prop.decorators.iter().map(|d| Some(d.expr.clone().as_arg())).collect(),
                        }))
                    };
                    
                    let element_desc = ArrayLit {
                        span: DUMMY_SP,
                        elems: vec![
                            Some(decorator_expr.as_arg()),
                            Some(Lit::Num(Number { span: DUMMY_SP, value: kind_value, raw: None }).as_arg()),
                            Some(Expr::Lit(Lit::Str(Str {
                                span: DUMMY_SP,
                                value: prop.key.name.clone(),
                                raw: None,
                            })).as_arg()),
                            Some(getter_fn.as_arg()),
                            Some(setter_fn.as_arg()),
                        ],
                    };
                    element_decs.push(element_desc.as_arg());

                    // Transform field to use initializer
                    prop.decorators.clear();
                    let original_value = prop.value.take();
                    
                    let mut init_args = vec![Expr::This(ThisExpr { span: DUMMY_SP }).as_arg()];
                    if let Some(value) = original_value {
                        init_args.push((*value).as_arg());
                    }
                    
                    prop.value = Some(Box::new(Expr::Call(CallExpr {
                        span: DUMMY_SP,
                        ctxt: Default::default(),
                        callee: init_id.as_callee(),
                        args: init_args,
                        type_args: None,
                    })));

                    new_members.push(ClassMember::PrivateProp(prop));
                }
                ClassMember::AutoAccessor(accessor) if !accessor.decorators.is_empty() => {
                    has_decorators = true;
                    accessor_counter += 1;
                    
                    let key_name = match &accessor.key {
                        Key::Public(PropName::Ident(id)) => id.sym.to_string(),
                        Key::Public(PropName::Str(s)) => s.value.to_string(),
                        Key::Public(PropName::Computed(_)) => format!("computedKey{}", accessor_counter),
                        Key::Private(p) => p.name.to_string(),
                        _ => format!("accessor{}", accessor_counter),
                    };

                    let init_var = format!("_init_{}", key_name);
                    let init_id = Ident::new(init_var.as_str().into(), DUMMY_SP, Default::default());
                    let init_extra_var = format!("_init_extra_{}", key_name);
                    let init_extra_id = Ident::new(init_extra_var.as_str().into(), DUMMY_SP, Default::default());
                    init_vars.push(init_id.clone());
                    init_vars.push(init_extra_id.clone());

                    // Create private field name for storage
                    let private_key = if let Key::Private(p) = &accessor.key {
                        p.clone()
                    } else if let Key::Public(PropName::Ident(ident)) = &accessor.key {
                        PrivateName {
                            span: ident.span,
                            name: format!("__{}", ident.sym).into(),
                        }
                    } else {
                        // For computed keys, use the init variable name to ensure uniqueness
                        PrivateName {
                            span: accessor.span,
                            name: format!("__{}", key_name).into(),
                        }
                    };

                    // Create getter function
                    let getter_fn = if accessor.is_static {
                        // For static accessors in 2023-11
                        FnExpr {
                            ident: None,
                            function: Box::new(Function {
                                params: vec![],
                                decorators: vec![],
                                span: DUMMY_SP,
                                ctxt: Default::default(),
                                body: Some(BlockStmt {
                                    span: DUMMY_SP,
                                    ctxt: Default::default(),
                                    stmts: vec![Stmt::Return(ReturnStmt {
                                        span: DUMMY_SP,
                                        arg: Some(Box::new(Expr::Member(MemberExpr {
                                            span: DUMMY_SP,
                                            obj: Box::new(Expr::This(ThisExpr { span: DUMMY_SP })),
                                            prop: MemberProp::PrivateName(private_key.clone()),
                                        }))),
                                    })],
                                }),
                                is_generator: false,
                                is_async: false,
                                type_params: None,
                                return_type: None,
                            }),
                        }
                    } else {
                        // Instance accessor - arrow function with parameter
                        FnExpr {
                            ident: None,
                            function: Box::new(Function {
                                params: vec![Param {
                                    span: DUMMY_SP,
                                    decorators: vec![],
                                    pat: Pat::Ident(BindingIdent {
                                        id: Ident::new("o".into(), DUMMY_SP, Default::default()),
                                        type_ann: None,
                                    }),
                                }],
                                decorators: vec![],
                                span: DUMMY_SP,
                                ctxt: Default::default(),
                                body: Some(BlockStmt {
                                    span: DUMMY_SP,
                                    ctxt: Default::default(),
                                    stmts: vec![Stmt::Return(ReturnStmt {
                                        span: DUMMY_SP,
                                        arg: Some(Box::new(Expr::Member(MemberExpr {
                                            span: DUMMY_SP,
                                            obj: Box::new(Expr::Ident(Ident::new("o".into(), DUMMY_SP, Default::default()))),
                                            prop: MemberProp::PrivateName(private_key.clone()),
                                        }))),
                                    })],
                                }),
                                is_generator: false,
                                is_async: false,
                                type_params: None,
                                return_type: None,
                            }),
                        }
                    };

                    // Create setter function
                    let setter_fn = if accessor.is_static {
                        // For static accessors in 2023-11
                        FnExpr {
                            ident: None,
                            function: Box::new(Function {
                                params: vec![Param {
                                    span: DUMMY_SP,
                                    decorators: vec![],
                                    pat: Pat::Ident(BindingIdent {
                                        id: Ident::new("v".into(), DUMMY_SP, Default::default()),
                                        type_ann: None,
                                    }),
                                }],
                                decorators: vec![],
                                span: DUMMY_SP,
                                ctxt: Default::default(),
                                body: Some(BlockStmt {
                                    span: DUMMY_SP,
                                    ctxt: Default::default(),
                                    stmts: vec![Stmt::Expr(ExprStmt {
                                        span: DUMMY_SP,
                                        expr: Box::new(Expr::Assign(AssignExpr {
                                            span: DUMMY_SP,
                                            op: AssignOp::Assign,
                                            left: AssignTarget::Simple(SimpleAssignTarget::Member(MemberExpr {
                                                span: DUMMY_SP,
                                                obj: Box::new(Expr::This(ThisExpr { span: DUMMY_SP })),
                                                prop: MemberProp::PrivateName(private_key.clone()),
                                            })),
                                            right: Box::new(Expr::Ident(Ident::new("v".into(), DUMMY_SP, Default::default()))),
                                        })),
                                    })],
                                }),
                                is_generator: false,
                                is_async: false,
                                type_params: None,
                                return_type: None,
                            }),
                        }
                    } else {
                        // Instance accessor - arrow function with two parameters
                        FnExpr {
                            ident: None,
                            function: Box::new(Function {
                                params: vec![
                                    Param {
                                        span: DUMMY_SP,
                                        decorators: vec![],
                                        pat: Pat::Ident(BindingIdent {
                                            id: Ident::new("o".into(), DUMMY_SP, Default::default()),
                                            type_ann: None,
                                        }),
                                    },
                                    Param {
                                        span: DUMMY_SP,
                                        decorators: vec![],
                                        pat: Pat::Ident(BindingIdent {
                                            id: Ident::new("v".into(), DUMMY_SP, Default::default()),
                                            type_ann: None,
                                        }),
                                    }
                                ],
                                decorators: vec![],
                                span: DUMMY_SP,
                                ctxt: Default::default(),
                                body: Some(BlockStmt {
                                    span: DUMMY_SP,
                                    ctxt: Default::default(),
                                    stmts: vec![Stmt::Expr(ExprStmt {
                                        span: DUMMY_SP,
                                        expr: Box::new(Expr::Assign(AssignExpr {
                                            span: DUMMY_SP,
                                            op: AssignOp::Assign,
                                            left: AssignTarget::Simple(SimpleAssignTarget::Member(MemberExpr {
                                                span: DUMMY_SP,
                                                obj: Box::new(Expr::Ident(Ident::new("o".into(), DUMMY_SP, Default::default()))),
                                                prop: MemberProp::PrivateName(private_key.clone()),
                                            })),
                                            right: Box::new(Expr::Ident(Ident::new("v".into(), DUMMY_SP, Default::default()))),
                                        })),
                                    })],
                                }),
                                is_generator: false,
                                is_async: false,
                                type_params: None,
                                return_type: None,
                            }),
                        }
                    };

                    // Create element descriptor [decorator(s), kind, name, getter, setter]
                    let kind_value = if accessor.is_static { 9.0 } else { 1.0 }; // STATIC + ACCESSOR = 9, ACCESSOR = 1
                    
                    // Handle multiple decorators
                    let decorator_expr = if accessor.decorators.len() == 1 {
                        accessor.decorators[0].expr.clone()
                    } else {
                        Box::new(Expr::Array(ArrayLit {
                            span: DUMMY_SP,
                            elems: accessor.decorators.iter().map(|d| Some(d.expr.clone().as_arg())).collect(),
                        }))
                    };
                    
                    let element_desc = ArrayLit {
                        span: DUMMY_SP,
                        elems: vec![
                            Some(decorator_expr.as_arg()),
                            Some(Lit::Num(Number { span: DUMMY_SP, value: kind_value, raw: None }).as_arg()),
                            Some(match &accessor.key {
                                Key::Public(PropName::Ident(id)) => Expr::Lit(Lit::Str(Str {
                                    span: DUMMY_SP,
                                    value: id.sym.clone(),
                                    raw: None,
                                })),
                                Key::Public(PropName::Str(s)) => Expr::Lit(Lit::Str(s.clone())),
                                Key::Public(PropName::Computed(computed)) => *computed.expr.clone(),
                                Key::Private(p) => Expr::Lit(Lit::Str(Str {
                                    span: DUMMY_SP,
                                    value: p.name.clone(),
                                    raw: None,
                                })),
                                _ => Expr::Lit(Lit::Str(Str {
                                    span: DUMMY_SP,
                                    value: "accessor".into(),
                                    raw: None,
                                }))
                            }.as_arg()),
                            Some(getter_fn.as_arg()),
                            Some(setter_fn.as_arg()),
                        ],
                    };
                    element_decs.push(element_desc.as_arg());

                    // Transform to private field with initializer
                    let mut init_args = if accessor.is_static {
                        vec![]
                    } else {
                        vec![Expr::This(ThisExpr { span: DUMMY_SP }).as_arg()]
                    };
                    if let Some(value) = accessor.value {
                        init_args.push((*value).as_arg());
                    }
                    
                    let init_call = Expr::Call(CallExpr {
                        span: DUMMY_SP,
                        ctxt: Default::default(),
                        callee: init_id.as_callee(),
                        args: init_args,
                        type_args: None,
                    });

                    // Add private field - initialization will be handled through constructor/static block
                    new_members.push(ClassMember::PrivateProp(PrivateProp {
                        span: accessor.span,
                        ctxt: Default::default(),
                        key: private_key.clone(),
                        value: None, // No initializer - will be set via constructor
                        type_ann: None,
                        is_static: accessor.is_static,
                        decorators: Vec::new(),
                        accessibility: None,
                        is_optional: false,
                        is_override: false,
                        readonly: false,
                        definite: false,
                    }));

                    // Add getter and setter methods
                    let (get_id, set_id) = if let Key::Private(_) = &accessor.key {
                        let get_var = format!("_get_{}", key_name);
                        let set_var = format!("_set_{}", key_name);
                        let get_id = Ident::new(get_var.as_str().into(), DUMMY_SP, Default::default());
                        let set_id = Ident::new(set_var.as_str().into(), DUMMY_SP, Default::default());
                        init_vars.push(get_id.clone());
                        init_vars.push(set_id.clone());
                        (Some(get_id), Some(set_id))
                    } else {
                        (None, None)
                    };

                    match accessor.key {
                        Key::Public(key) => {
                            // Add getter
                            new_members.push(ClassMember::Method(ClassMethod {
                                span: accessor.span,
                                key: key.clone(),
                                function: Box::new(Function {
                                    params: Vec::new(),
                                    decorators: Vec::new(),
                                    span: accessor.span,
                                    ctxt: Default::default(),
                                    body: Some(BlockStmt {
                                        span: accessor.span,
                                        ctxt: Default::default(),
                                        stmts: vec![Stmt::Return(ReturnStmt {
                                            span: accessor.span,
                                            arg: Some(Box::new(Expr::Member(MemberExpr {
                                                span: accessor.span,
                                                obj: Box::new(Expr::This(ThisExpr { span: accessor.span })),
                                                prop: MemberProp::PrivateName(private_key.clone()),
                                            }))),
                                        })],
                                    }),
                                    is_generator: false,
                                    is_async: false,
                                    type_params: None,
                                    return_type: None,
                                }),
                                kind: MethodKind::Getter,
                                is_static: accessor.is_static,
                                accessibility: None,
                                is_abstract: false,
                                is_optional: false,
                                is_override: false,
                            }));
                            
                            // Add setter
                            new_members.push(ClassMember::Method(ClassMethod {
                                span: accessor.span,
                                key,
                                function: Box::new(Function {
                                    params: vec![Param {
                                        span: accessor.span,
                                        decorators: Vec::new(),
                                        pat: Pat::Ident(BindingIdent {
                                            id: Ident::new("v".into(), accessor.span, Default::default()),
                                            type_ann: None,
                                        }),
                                    }],
                                    decorators: Vec::new(),
                                    span: accessor.span,
                                    ctxt: Default::default(),
                                    body: Some(BlockStmt {
                                        span: accessor.span,
                                        ctxt: Default::default(),
                                        stmts: vec![Stmt::Expr(ExprStmt {
                                            span: accessor.span,
                                            expr: Box::new(Expr::Assign(AssignExpr {
                                                span: accessor.span,
                                                op: AssignOp::Assign,
                                                left: AssignTarget::Simple(SimpleAssignTarget::Member(MemberExpr {
                                                    span: accessor.span,
                                                    obj: Box::new(Expr::This(ThisExpr { span: accessor.span })),
                                                    prop: MemberProp::PrivateName(private_key.clone()),
                                                })),
                                                right: Box::new(Expr::Ident(Ident::new("v".into(), accessor.span, Default::default()))),
                                            })),
                                        })],
                                    }),
                                    is_generator: false,
                                    is_async: false,
                                    type_params: None,
                                    return_type: None,
                                }),
                                kind: MethodKind::Setter,
                                is_static: accessor.is_static,
                                accessibility: None,
                                is_abstract: false,
                                is_optional: false,
                                is_override: false,
                            }));
                        }
                        Key::Private(key) => {
                            // Add private getter
                            new_members.push(ClassMember::PrivateMethod(PrivateMethod {
                                span: accessor.span,
                                key: key.clone(),
                                function: Box::new(Function {
                                    params: Vec::new(),
                                    decorators: Vec::new(),
                                    span: accessor.span,
                                    ctxt: Default::default(),
                                    body: Some(BlockStmt {
                                        span: accessor.span,
                                        ctxt: Default::default(),
                                        stmts: vec![Stmt::Return(ReturnStmt {
                                            span: accessor.span,
                                            arg: Some(Box::new(Expr::Call(CallExpr {
                                                span: DUMMY_SP,
                                                ctxt: Default::default(),
                                                callee: get_id.unwrap().as_callee(),
                                                args: if accessor.is_static { vec![] } else { vec![Expr::This(ThisExpr { span: DUMMY_SP }).as_arg()] },
                                                type_args: None,
                                            }))),
                                        })],
                                    }),
                                    is_generator: false,
                                    is_async: false,
                                    type_params: None,
                                    return_type: None,
                                }),
                                kind: MethodKind::Getter,
                                is_static: accessor.is_static,
                                accessibility: None,
                                is_abstract: false,
                                is_optional: false,
                                is_override: false,
                            }));
                            
                            // Add private setter
                            new_members.push(ClassMember::PrivateMethod(PrivateMethod {
                                span: accessor.span,
                                key,
                                function: Box::new(Function {
                                    params: vec![Param {
                                        span: accessor.span,
                                        decorators: Vec::new(),
                                        pat: Pat::Ident(BindingIdent {
                                            id: Ident::new("v".into(), accessor.span, Default::default()),
                                            type_ann: None,
                                        }),
                                    }],
                                    decorators: Vec::new(),
                                    span: accessor.span,
                                    ctxt: Default::default(),
                                    body: Some(BlockStmt {
                                        span: accessor.span,
                                        ctxt: Default::default(),
                                        stmts: vec![Stmt::Expr(ExprStmt {
                                            span: accessor.span,
                                            expr: Box::new(Expr::Call(CallExpr {
                                                span: DUMMY_SP,
                                                ctxt: Default::default(),
                                                callee: set_id.unwrap().as_callee(),
                                                args: if accessor.is_static { 
                                                    vec![Expr::Ident(Ident::new("v".into(), DUMMY_SP, Default::default())).as_arg()] 
                                                } else { 
                                                    vec![
                                                        Expr::This(ThisExpr { span: DUMMY_SP }).as_arg(),
                                                        Expr::Ident(Ident::new("v".into(), DUMMY_SP, Default::default())).as_arg()
                                                    ] 
                                                },
                                                type_args: None,
                                            })),
                                        })],
                                    }),
                                    is_generator: false,
                                    is_async: false,
                                    type_params: None,
                                    return_type: None,
                                }),
                                kind: MethodKind::Setter,
                                is_static: accessor.is_static,
                                accessibility: None,
                                is_abstract: false,
                                is_optional: false,
                                is_override: false,
                            }));
                        }
                    }

                    // Add field initialization
                    if accessor.is_static {
                        staticFieldInitializerExpressions.push(Expr::Assign(AssignExpr {
                            span: DUMMY_SP,
                            op: AssignOp::Assign,
                            left: AssignTarget::Simple(SimpleAssignTarget::Member(MemberExpr {
                                span: DUMMY_SP,
                                obj: Box::new(Expr::This(ThisExpr { span: DUMMY_SP })),
                                prop: MemberProp::PrivateName(private_key.clone()),
                            })),
                            right: Box::new(init_call),
                        }));
                        staticFieldInitializerExpressions.push(Expr::Call(CallExpr {
                            span: DUMMY_SP,
                            ctxt: Default::default(),
                            callee: init_extra_id.as_callee(),
                            args: vec![],
                            type_args: None,
                        }));
                    } else {
                        fieldInitializerExpressions.push(Expr::Assign(AssignExpr {
                            span: DUMMY_SP,
                            op: AssignOp::Assign,
                            left: AssignTarget::Simple(SimpleAssignTarget::Member(MemberExpr {
                                span: DUMMY_SP,
                                obj: Box::new(Expr::This(ThisExpr { span: DUMMY_SP })),
                                prop: MemberProp::PrivateName(private_key.clone()),
                            })),
                            right: Box::new(init_call),
                        }));
                        fieldInitializerExpressions.push(Expr::Call(CallExpr {
                            span: DUMMY_SP,
                            ctxt: Default::default(),
                            callee: init_extra_id.as_callee(),
                            args: vec![Expr::This(ThisExpr { span: DUMMY_SP }).as_arg()],
                            type_args: None,
                        }));
                    }
                }
                ClassMember::AutoAccessor(accessor) => {
                    // Transform auto-accessor to getter/setter
                    new_members.extend(self.transform_auto_accessor(accessor));
                }
                _ => {
                    // Check for decorators on other members
                    match &member {
                        ClassMember::Method(method) if !method.function.decorators.is_empty() => {
                            has_decorators = true;
                        }
                        ClassMember::PrivateMethod(method) if !method.function.decorators.is_empty() => {
                            has_decorators = true;
                        }
                        ClassMember::PrivateProp(prop) if !prop.decorators.is_empty() => {
                            has_decorators = true;
                        }
                        _ => {}
                    }
                    new_members.push(member);
                }
            }
        }

        if !has_decorators {
            class.body = new_members;
            return (class, extra_stmts);
        }

        // Clear decorators from class
        class.decorators.clear();
        class.body = new_members;

        // Generate helper calls and variable declarations
        let helper_name = match self.version {
            DecoratorVersion::V202203 => {
                enable_helper!(apply_decs_2203_r);
                "_apply_decs_2203_r"
            }
            DecoratorVersion::V202311 => {
                enable_helper!(apply_decs_2311);
                "_apply_decs_2311"
            }
            _ => {
                enable_helper!(apply_decs_2203_r);
                "_apply_decs_2203_r"
            }
        };

        // Create variable declarations - only for initializer variables
        let has_class_decs = !class_decs.is_empty();
        
        if !init_vars.is_empty() {
            let var_decls: Vec<VarDeclarator> = init_vars.iter().map(|var| VarDeclarator {
                span: DUMMY_SP,
                name: var.clone().into(),
                init: None,
                definite: false,
            }).collect();

            extra_stmts.push(Stmt::Decl(Decl::Var(Box::new(VarDecl {
                span: DUMMY_SP,
                ctxt: Default::default(),
                kind: VarDeclKind::Var,
                declare: false,
                decls: var_decls,
            }))));
        }

        // Create apply_decs call
        let mut args = vec![Expr::This(ThisExpr { span: DUMMY_SP }).as_arg()];
        
        // Element decorators array (always present)
        args.push(ArrayLit {
            span: DUMMY_SP,
            elems: element_decs.into_iter().map(Some).collect(),
        }.as_arg());

        // Class decorators array (always present, empty if no class decorators)
        args.push(ArrayLit {
            span: DUMMY_SP,
            elems: if has_class_decs {
                class_decs.into_iter().map(|expr| Some(expr.as_arg())).collect()
            } else {
                vec![]
            },
        }.as_arg());

        let apply_call = CallExpr {
            span: DUMMY_SP,
            ctxt: Default::default(),
            callee: Ident::new(helper_name.into(), DUMMY_SP, Default::default()).as_callee(),
            args,
            type_args: None,
        };

        // Create destructuring assignment
        let mut props = Vec::new();
        
        if !init_vars.is_empty() {
            props.push(ObjectPatProp::KeyValue(KeyValuePatProp {
                key: PropName::Ident(quote_ident!("e")),
                value: Box::new(Pat::Array(ArrayPat {
                    span: DUMMY_SP,
                    elems: init_vars.iter().map(|v| Some(v.clone().into())).collect(),
                    optional: false,
                    type_ann: None,
                })),
            }));
        }

        if has_class_decs {
            props.push(ObjectPatProp::KeyValue(KeyValuePatProp {
                key: PropName::Ident(quote_ident!("c")),
                value: Box::new(Pat::Array(ArrayPat {
                    span: DUMMY_SP,
                    elems: vec![
                        Some(Pat::Ident(BindingIdent {
                            id: Ident::new("_C".into(), DUMMY_SP, Default::default()),
                            type_ann: None,
                        })),
                        Some(Pat::Ident(BindingIdent {
                            id: Ident::new("_initClass".into(), DUMMY_SP, Default::default()),
                            type_ann: None,
                        })),
                    ],
                    optional: false,
                    type_ann: None,
                })),
            }));
        }

        // Add static block with destructuring
        if !init_vars.is_empty() || has_class_decs {
            let destructuring_target = if !init_vars.is_empty() && has_class_decs {
                // Both element and class decorators: { e: [...], c: [...] } = _apply_decs_2203_r(...)
                AssignTarget::Pat(AssignTargetPat::Object(ObjectPat {
                    span: DUMMY_SP,
                    props,
                    optional: false,
                    type_ann: None,
                }))
            } else if !init_vars.is_empty() {
                // Only element decorators: [_init_a, _init_b] = _apply_decs_2203_r(...).e
                AssignTarget::Pat(AssignTargetPat::Array(ArrayPat {
                    span: DUMMY_SP,
                    elems: init_vars.iter().map(|v| Some(v.clone().into())).collect(),
                    optional: false,
                    type_ann: None,
                }))
            } else {
                // Only class decorators: [_C, _initClass] = _apply_decs_2203_r(...).c
                AssignTarget::Pat(AssignTargetPat::Array(ArrayPat {
                    span: DUMMY_SP,
                    elems: vec![
                        Some(Pat::Ident(BindingIdent {
                            id: Ident::new("_C".into(), DUMMY_SP, Default::default()),
                            type_ann: None,
                        })),
                        Some(Pat::Ident(BindingIdent {
                            id: Ident::new("_initClass".into(), DUMMY_SP, Default::default()),
                            type_ann: None,
                        })),
                    ],
                    optional: false,
                    type_ann: None,
                }))
            };

            let assign_expr = if !init_vars.is_empty() && !has_class_decs {
                // For element-only decorators, access .e property
                Box::new(Expr::Member(MemberExpr {
                    span: DUMMY_SP,
                    obj: Box::new(apply_call.into()),
                    prop: MemberProp::Ident(quote_ident!("e")),
                }))
            } else if init_vars.is_empty() && has_class_decs {
                // For class-only decorators, access .c property
                Box::new(Expr::Member(MemberExpr {
                    span: DUMMY_SP,
                    obj: Box::new(apply_call.into()),
                    prop: MemberProp::Ident(quote_ident!("c")),
                }))
            } else {
                // For both, use the full object
                Box::new(apply_call.into())
            };

            let static_block = ClassMember::StaticBlock(StaticBlock {
                span: DUMMY_SP,
                body: BlockStmt {
                    span: DUMMY_SP,
                    ctxt: Default::default(),
                    stmts: vec![Stmt::Expr(ExprStmt {
                        span: DUMMY_SP,
                        expr: Box::new(Expr::Assign(AssignExpr {
                            span: DUMMY_SP,
                            op: AssignOp::Assign,
                            left: destructuring_target,
                            right: assign_expr,
                        })),
                    })],
                },
            });
            class.body.insert(0, static_block);
        }

        // Add initClass call if needed
        if has_class_decs {
            class.body.push(ClassMember::StaticBlock(StaticBlock {
                span: DUMMY_SP,
                body: BlockStmt {
                    span: DUMMY_SP,
                    ctxt: Default::default(),
                    stmts: vec![Stmt::Expr(ExprStmt {
                        span: DUMMY_SP,
                        expr: Box::new(Expr::Call(CallExpr {
                            span: DUMMY_SP,
                            ctxt: Default::default(),
                            callee: Ident::new("_initClass".into(), DUMMY_SP, Default::default()).as_callee(),
                            args: vec![],
                            type_args: None,
                        })),
                    })],
                },
            }));
        }

        // Handle field initializer expressions
        if !fieldInitializerExpressions.is_empty() {
            // Find or create constructor
            let mut constructor_idx = None;
            for (idx, member) in class.body.iter().enumerate() {
                if let ClassMember::Constructor(_ctor) = member {
                    constructor_idx = Some(idx);
                    break;
                }
            }

            if let Some(idx) = constructor_idx {
                // Insert into existing constructor
                if let ClassMember::Constructor(ctor) = &mut class.body[idx] {
                    let init_stmts: Vec<Stmt> = fieldInitializerExpressions
                        .into_iter()
                        .map(|expr| Stmt::Expr(ExprStmt {
                            span: DUMMY_SP,
                            expr: Box::new(expr),
                        }))
                        .collect();
                    
                    // Insert after super() call if it exists
                    let mut super_idx = None;
                    for (stmt_idx, stmt) in ctor.body.as_mut().unwrap().stmts.iter().enumerate() {
                        if let Stmt::Expr(ExprStmt { expr, .. }) = stmt {
                            if let Expr::Call(CallExpr { callee, .. }) = &**expr {
                                if matches!(callee, Callee::Super(_)) {
                                    super_idx = Some(stmt_idx);
                                    break;
                                }
                            }
                        }
                    }
                    
                    if let Some(idx) = super_idx {
                        // Insert after super call
                        ctor.body.as_mut().unwrap().stmts.splice(idx + 1..idx + 1, init_stmts);
                    } else {
                        // No super call, insert at beginning
                        ctor.body.as_mut().unwrap().stmts.splice(0..0, init_stmts);
                    }
                }
            } else {
                // Create new constructor
                let has_super = class.super_class.is_some();
                let mut ctor_stmts = vec![];
                
                if has_super {
                    ctor_stmts.push(Stmt::Expr(ExprStmt {
                        span: DUMMY_SP,
                        expr: Box::new(Expr::Call(CallExpr {
                            span: DUMMY_SP,
                            ctxt: Default::default(),
                            callee: Callee::Super(Super { span: DUMMY_SP }),
                            args: vec![ExprOrSpread {
                                spread: Some(DUMMY_SP),
                                expr: Box::new(Expr::Ident(Ident::new("args".into(), DUMMY_SP, Default::default()))),
                            }],
                            type_args: None,
                        })),
                    }));
                }
                
                ctor_stmts.extend(fieldInitializerExpressions.into_iter().map(|expr| {
                    Stmt::Expr(ExprStmt {
                        span: DUMMY_SP,
                        expr: Box::new(expr),
                    })
                }));

                class.body.insert(0, ClassMember::Constructor(Constructor {
                    span: DUMMY_SP,
                    ctxt: Default::default(),
                    key: PropName::Ident(quote_ident!("constructor")),
                    params: vec![],
                    body: Some(BlockStmt {
                        span: DUMMY_SP,
                        ctxt: Default::default(),
                        stmts: ctor_stmts,
                    }),
                    accessibility: None,
                    is_optional: false,
                }));
            }
        }

        // Handle static field initializer expressions
        if !staticFieldInitializerExpressions.is_empty() {
            class.body.push(ClassMember::StaticBlock(StaticBlock {
                span: DUMMY_SP,
                body: BlockStmt {
                    span: DUMMY_SP,
                    ctxt: Default::default(),
                    stmts: staticFieldInitializerExpressions.into_iter().map(|expr| {
                        Stmt::Expr(ExprStmt {
                            span: DUMMY_SP,
                            expr: Box::new(expr),
                        })
                    }).collect(),
                },
            }));
        }

        (class, extra_stmts)
    }

    fn transform_auto_accessor(&mut self, accessor: AutoAccessor) -> Vec<ClassMember> {
        let key = match &accessor.key {
            Key::Public(prop_name) => prop_name.clone(),
            Key::Private(private_name) => PropName::Ident(private_name.name.clone().into()),
        };
        
        let is_static = accessor.is_static;
        let value = accessor.value.clone();
        
        // Create private field name
        let private_key = if let PropName::Ident(ident) = &key {
            PrivateName {
                span: ident.span,
                name: format!("__{}", ident.sym).into(),
            }
        } else {
            PrivateName {
                span: accessor.span,
                name: "__accessor".into(),
            }
        };
        
        let mut members = Vec::new();
        
        // Add private field
        members.push(ClassMember::PrivateProp(PrivateProp {
            span: accessor.span,
            ctxt: SyntaxContext::empty(),
            key: private_key.clone(),
            value,
            type_ann: None,
            is_static,
            decorators: Vec::new(),
            accessibility: None,
            is_optional: false,
            is_override: false,
            readonly: false,
            definite: false,
        }));
        
        // Add getter
        members.push(ClassMember::Method(ClassMethod {
            span: accessor.span,
            key: key.clone(),
            function: Box::new(Function {
                params: Vec::new(),
                decorators: Vec::new(),
                span: accessor.span,
                ctxt: SyntaxContext::empty(),
                body: Some(BlockStmt {
                    span: accessor.span,
                    ctxt: SyntaxContext::empty(),
                    stmts: vec![Stmt::Return(ReturnStmt {
                        span: accessor.span,
                        arg: Some(Box::new(Expr::Member(MemberExpr {
                            span: accessor.span,
                            obj: Box::new(Expr::This(ThisExpr { span: accessor.span })),
                            prop: MemberProp::PrivateName(private_key.clone()),
                        }))),
                    })],
                }),
                is_generator: false,
                is_async: false,
                type_params: None,
                return_type: None,
            }),
            kind: MethodKind::Getter,
            is_static,
            accessibility: None,
            is_abstract: false,
            is_optional: false,
            is_override: false,
        }));
        
        // Add setter
        members.push(ClassMember::Method(ClassMethod {
            span: accessor.span,
            key: key.clone(),
            function: Box::new(Function {
                params: vec![Param {
                    span: accessor.span,
                    decorators: Vec::new(),
                    pat: Pat::Ident(BindingIdent {
                        id: Ident::new("value".into(), accessor.span, SyntaxContext::empty()),
                        type_ann: None,
                    }),
                }],
                decorators: Vec::new(),
                span: accessor.span,
                ctxt: SyntaxContext::empty(),
                body: Some(BlockStmt {
                    span: accessor.span,
                    ctxt: SyntaxContext::empty(),
                    stmts: vec![Stmt::Expr(ExprStmt {
                        span: accessor.span,
                        expr: Box::new(Expr::Assign(AssignExpr {
                            span: accessor.span,
                            op: AssignOp::Assign,
                            left: AssignTarget::Simple(SimpleAssignTarget::Member(MemberExpr {
                                span: accessor.span,
                                obj: Box::new(Expr::This(ThisExpr { span: accessor.span })),
                                prop: MemberProp::PrivateName(private_key),
                            })),
                            right: Box::new(Expr::Ident(Ident::new("value".into(), accessor.span, SyntaxContext::empty()))),
                        })),
                    })],
                }),
                is_generator: false,
                is_async: false,
                type_params: None,
                return_type: None,
            }),
            kind: MethodKind::Setter,
            is_static,
            accessibility: None,
            is_abstract: false,
            is_optional: false,
            is_override: false,
        }));
        
        members
    }
}

impl Fold for DecoratorTransform {
    noop_fold_type!();

    fn fold_class(&mut self, class: Class) -> Class {
        // Check if class has decorators or decorated members
        let has_decorators = !class.decorators.is_empty() || 
            class.body.iter().any(|member| match member {
                ClassMember::Method(method) => !method.function.decorators.is_empty(),
                ClassMember::PrivateMethod(method) => !method.function.decorators.is_empty(),
                ClassMember::ClassProp(prop) => !prop.decorators.is_empty(),
                ClassMember::PrivateProp(prop) => !prop.decorators.is_empty(),
                ClassMember::AutoAccessor(accessor) => !accessor.decorators.is_empty(),
                _ => false,
            });

        let has_auto_accessors = class.body.iter().any(|member| matches!(member, ClassMember::AutoAccessor(_)));

        if has_decorators {
            let (transformed_class, _extra_stmts) = self.transform_class_with_decorators(class);
            transformed_class
        } else if has_auto_accessors {
            // Handle auto-accessors even without decorators
            let mut new_members = Vec::new();
            for member in class.body {
                match member {
                    ClassMember::AutoAccessor(accessor) => {
                        new_members.extend(self.transform_auto_accessor(accessor));
                    }
                    _ => {
                        new_members.push(member);
                    }
                }
            }
            Class {
                body: new_members,
                ..class
            }
        } else {
            class
        }
    }

    fn fold_module(&mut self, module: Module) -> Module {
        let mut new_body = Vec::new();
        let mut extra_stmts = Vec::new();

        for item in module.body {
            match item {
                ModuleItem::Stmt(Stmt::Decl(Decl::Class(ClassDecl {
                    ident,
                    declare: false,
                    class,
                }))) => {
                    let has_decorators = !class.decorators.is_empty() || 
                        class.body.iter().any(|member| match member {
                            ClassMember::Method(method) => !method.function.decorators.is_empty(),
                            ClassMember::PrivateMethod(method) => !method.function.decorators.is_empty(),
                            ClassMember::ClassProp(prop) => !prop.decorators.is_empty(),
                            ClassMember::PrivateProp(prop) => !prop.decorators.is_empty(),
                            ClassMember::AutoAccessor(accessor) => !accessor.decorators.is_empty(),
                            _ => false,
                        });

                    if has_decorators {
                        let (transformed_class, mut stmts) = self.transform_class_with_decorators(*class);
                        extra_stmts.append(&mut stmts);
                        new_body.push(ModuleItem::Stmt(Stmt::Decl(Decl::Class(ClassDecl {
                            ident,
                            declare: false,
                            class: Box::new(transformed_class),
                        }))));
                    } else {
                        let transformed_class = self.fold_class(*class);
                        new_body.push(ModuleItem::Stmt(Stmt::Decl(Decl::Class(ClassDecl {
                            ident,
                            declare: false,
                            class: Box::new(transformed_class),
                        }))));
                    }
                }
                _ => {
                    new_body.push(item.fold_with(self));
                }
            }
        }

        // Add extra statements at the beginning
        for stmt in extra_stmts.into_iter().rev() {
            new_body.insert(0, ModuleItem::Stmt(stmt));
        }

        Module {
            body: new_body,
            ..module
        }
    }
}