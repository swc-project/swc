use swc_ecma_ast::*;
use swc_ecma_visit::{noop_fold_type, Fold, FoldWith, fold_pass};
use swc_common::{DUMMY_SP, SyntaxContext};
use swc_ecma_utils::{quote_ident, ExprFactory};
use swc_ecma_transforms_base::enable_helper;

use crate::DecoratorVersion;

// Decorator kind constants matching Babel's implementation
const FIELD: f64 = 0.0;
const ACCESSOR: f64 = 1.0;
const METHOD: f64 = 2.0;
const GETTER: f64 = 3.0;
const SETTER: f64 = 4.0;

const STATIC_OLD_VERSION: f64 = 5.0; // Before 2023-05
const STATIC: f64 = 8.0; // 1 << 3
const DECORATORS_HAVE_THIS: f64 = 16.0; // 1 << 4

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
        let mut field_initializer_expressions: Vec<Expr> = vec![];
        let mut static_field_initializer_expressions: Vec<Expr> = vec![];
        let mut accessor_counter = 0;
        let mut proto_init_local: Option<Ident> = None;
        let mut static_init_local: Option<Ident> = None;

        // Process class decorators
        for decorator in &class.decorators {
            class_decs.push(decorator.expr.clone());
        }

        // Collect and sort members first according to Babel's ordering
        let mut members_to_process: Vec<(ClassMember, usize)> = class.body.into_iter().enumerate().map(|(idx, member)| (member, idx)).collect();
        
        // Sort according to Babel's decorator application order:
        // 1. static non-fields (accessors, methods, getters, setters)
        // 2. instance non-fields (accessors, methods, getters, setters) 
        // 3. static fields
        // 4. instance fields
        members_to_process.sort_by_key(|(member, original_idx)| {
            let is_static = match member {
                ClassMember::Method(m) => m.is_static,
                ClassMember::PrivateMethod(m) => m.is_static,
                ClassMember::ClassProp(p) => p.is_static,
                ClassMember::PrivateProp(p) => p.is_static,
                ClassMember::AutoAccessor(a) => a.is_static,
                _ => false,
            };
            
            let is_field = matches!(member, 
                ClassMember::ClassProp(_) | 
                ClassMember::PrivateProp(_)
            );
            
            let has_decorators = match member {
                ClassMember::Method(m) => !m.function.decorators.is_empty(),
                ClassMember::PrivateMethod(m) => !m.function.decorators.is_empty(),
                ClassMember::ClassProp(p) => !p.decorators.is_empty(),
                ClassMember::PrivateProp(p) => !p.decorators.is_empty(),
                ClassMember::AutoAccessor(a) => !a.decorators.is_empty(),
                _ => false,
            };
            
            if !has_decorators {
                return (4, *original_idx); // Non-decorated members keep original order
            }
            
            match (is_static, is_field) {
                (true, false) => (0, *original_idx),   // static non-fields
                (false, false) => (1, *original_idx),  // instance non-fields
                (true, true) => (2, *original_idx),    // static fields
                (false, true) => (3, *original_idx),   // instance fields
            }
        });

        // Process class members in sorted order
        for (member, _) in members_to_process {
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
                    let kind_value = if prop.is_static { 
                        if static_init_local.is_none() {
                            static_init_local = Some(Ident::new("_initStatic".into(), DUMMY_SP, Default::default()));
                        }
                        match self.version {
                            DecoratorVersion::V202311 => STATIC + FIELD,
                            _ => STATIC_OLD_VERSION
                        }
                    } else { 
                        FIELD 
                    };
                    
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
                    
                    let mut init_args = if prop.is_static && self.version != DecoratorVersion::V202311 {
                        // For static fields in 2022-03, don't pass 'this'
                        vec![]
                    } else {
                        vec![Expr::This(ThisExpr { span: DUMMY_SP }).as_arg()]
                    };
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
                    let kind_value = if prop.is_static { 
                        if static_init_local.is_none() {
                            static_init_local = Some(Ident::new("_initStatic".into(), DUMMY_SP, Default::default()));
                        }
                        match self.version {
                            DecoratorVersion::V202311 => STATIC + FIELD,
                            _ => STATIC_OLD_VERSION
                        }
                    } else { 
                        FIELD 
                    };
                    
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
                            Some(Expr::Fn(getter_fn).as_arg()),
                            Some(Expr::Fn(setter_fn).as_arg()),
                        ],
                    };
                    element_decs.push(element_desc.as_arg());

                    // Transform field to use initializer
                    prop.decorators.clear();
                    let original_value = prop.value.take();
                    
                    let mut init_args = if prop.is_static && self.version != DecoratorVersion::V202311 {
                        // For static private fields in 2022-03, don't pass 'this'
                        vec![]
                    } else {
                        vec![Expr::This(ThisExpr { span: DUMMY_SP }).as_arg()]
                    };
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

                    // For auto accessors, we need init, get, set, and init_extra variables in Babel order
                    // Babel order: [init, get, set, init_extra] due to splice(-1, 0, get, set)
                    let init_var = format!("_init_{}", key_name);
                    let init_id = Ident::new(init_var.as_str().into(), DUMMY_SP, Default::default());
                    init_vars.push(init_id.clone());
                    
                    let get_var = format!("_get_{}", key_name);
                    let get_id = Ident::new(get_var.as_str().into(), DUMMY_SP, Default::default());
                    init_vars.push(get_id.clone());
                    
                    let set_var = format!("_set_{}", key_name);
                    let set_id = Ident::new(set_var.as_str().into(), DUMMY_SP, Default::default());
                    init_vars.push(set_id.clone());
                    
                    // Only add init_extra for 2023-11 version (comes last)
                    let init_extra_id = if self.version == DecoratorVersion::V202311 {
                        let init_extra_var = format!("_init_extra_{}", key_name);
                        let id = Ident::new(init_extra_var.as_str().into(), DUMMY_SP, Default::default());
                        init_vars.push(id.clone());
                        Some(id)
                    } else {
                        None
                    };

                    // Create private field name for storage - for private accessors, use a capital letter version
                    let private_key = match &accessor.key {
                        Key::Private(p) => PrivateName {
                            span: p.span,
                            name: p.name.to_uppercase().into(),
                        },
                        Key::Public(PropName::Ident(ident)) => PrivateName {
                            span: ident.span,
                            name: format!("__{}", ident.sym).into(),
                        },
                        _ => PrivateName {
                            span: accessor.span,
                            name: format!("__{}", key_name).into(),
                        }
                    };

                    // Create getter function expression
                    let getter_expr = if let Key::Private(_) = &accessor.key {
                        // For private accessors, use version-specific patterns
                        if accessor.is_static && self.version == DecoratorVersion::V202203 {
                            // For static private accessors in 2022-03: function() { return this.#A; }
                            Expr::Fn(FnExpr {
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
                            })
                        } else {
                            // For 2023-11 or instance private accessors: o => o.#A
                            Expr::Arrow(ArrowExpr {
                                span: DUMMY_SP,
                                ctxt: Default::default(),
                                params: vec![Pat::Ident(BindingIdent {
                                    id: Ident::new("o".into(), DUMMY_SP, Default::default()),
                                    type_ann: None,
                                })],
                                body: Box::new(BlockStmtOrExpr::Expr(Box::new(Expr::Member(MemberExpr {
                                    span: DUMMY_SP,
                                    obj: Box::new(Expr::Ident(Ident::new("o".into(), DUMMY_SP, Default::default()))),
                                    prop: MemberProp::PrivateName(private_key.clone()),
                                })))),
                                is_async: false,
                                is_generator: false,
                                type_params: None,
                                return_type: None,
                            })
                        }
                    } else {
                        // For public accessors, use different patterns for static vs instance
                        if accessor.is_static {
                            // For static public accessors: () => TargetClass.#__field
                            Expr::Arrow(ArrowExpr {
                                span: DUMMY_SP,
                                ctxt: Default::default(),
                                params: vec![], // No parameters for static
                                body: Box::new(BlockStmtOrExpr::Expr(Box::new(Expr::Member(MemberExpr {
                                    span: DUMMY_SP,
                                    obj: Box::new(Expr::This(ThisExpr { span: DUMMY_SP })), // 'this' refers to the class
                                    prop: MemberProp::PrivateName(private_key.clone()),
                                })))),
                                is_async: false,
                                is_generator: false,
                                type_params: None,
                                return_type: None,
                            })
                        } else {
                            // For instance public accessors: o => o.#__field
                            Expr::Arrow(ArrowExpr {
                                span: DUMMY_SP,
                                ctxt: Default::default(),
                                params: vec![Pat::Ident(BindingIdent {
                                    id: Ident::new("o".into(), DUMMY_SP, Default::default()),
                                    type_ann: None,
                                })],
                                body: Box::new(BlockStmtOrExpr::Expr(Box::new(Expr::Member(MemberExpr {
                                    span: DUMMY_SP,
                                    obj: Box::new(Expr::Ident(Ident::new("o".into(), DUMMY_SP, Default::default()))),
                                    prop: MemberProp::PrivateName(private_key.clone()),
                                })))),
                                is_async: false,
                                is_generator: false,
                                type_params: None,
                                return_type: None,
                            })
                        }
                    };

                    // Create setter function expression
                    let setter_expr = if let Key::Private(_) = &accessor.key {
                        // For private accessors, use version-specific patterns
                        if accessor.is_static && self.version == DecoratorVersion::V202203 {
                            // For static private accessors in 2022-03: function(value) { this.#A = value; }
                            Expr::Fn(FnExpr {
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
                                                    prop: MemberProp::PrivateName(private_key.clone()),
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
                            })
                        } else {
                            // For 2023-11 or instance private accessors: (o, v) => o.#A = v
                            Expr::Arrow(ArrowExpr {
                                span: DUMMY_SP,
                                ctxt: Default::default(),
                                params: vec![
                                    Pat::Ident(BindingIdent {
                                        id: Ident::new("o".into(), DUMMY_SP, Default::default()),
                                        type_ann: None,
                                    }),
                                    Pat::Ident(BindingIdent {
                                        id: Ident::new("v".into(), DUMMY_SP, Default::default()),
                                        type_ann: None,
                                    })
                                ],
                                body: Box::new(BlockStmtOrExpr::Expr(Box::new(Expr::Assign(AssignExpr {
                                    span: DUMMY_SP,
                                    op: AssignOp::Assign,
                                    left: AssignTarget::Simple(SimpleAssignTarget::Member(MemberExpr {
                                        span: DUMMY_SP,
                                        obj: Box::new(Expr::Ident(Ident::new("o".into(), DUMMY_SP, Default::default()))),
                                        prop: MemberProp::PrivateName(private_key.clone()),
                                    })),
                                    right: Box::new(Expr::Ident(Ident::new("v".into(), DUMMY_SP, Default::default()))),
                                })))),
                                is_async: false,
                                is_generator: false,
                                type_params: None,
                                return_type: None,
                            })
                        }
                    } else {
                        // For public accessors, use different patterns for static vs instance
                        if accessor.is_static {
                            // For static public accessors: (v) => TargetClass.#__field = v
                            Expr::Arrow(ArrowExpr {
                                span: DUMMY_SP,
                                ctxt: Default::default(),
                                params: vec![Pat::Ident(BindingIdent {
                                    id: Ident::new("v".into(), DUMMY_SP, Default::default()),
                                    type_ann: None,
                                })], // Only value parameter for static
                                body: Box::new(BlockStmtOrExpr::Expr(Box::new(Expr::Assign(AssignExpr {
                                    span: DUMMY_SP,
                                    op: AssignOp::Assign,
                                    left: AssignTarget::Simple(SimpleAssignTarget::Member(MemberExpr {
                                        span: DUMMY_SP,
                                        obj: Box::new(Expr::This(ThisExpr { span: DUMMY_SP })), // 'this' refers to the class
                                        prop: MemberProp::PrivateName(private_key.clone()),
                                    })),
                                    right: Box::new(Expr::Ident(Ident::new("v".into(), DUMMY_SP, Default::default()))),
                                })))),
                                is_async: false,
                                is_generator: false,
                                type_params: None,
                                return_type: None,
                            })
                        } else {
                            // For instance public accessors: (o, v) => o.#__field = v
                            Expr::Arrow(ArrowExpr {
                                span: DUMMY_SP,
                                ctxt: Default::default(),
                                params: vec![
                                    Pat::Ident(BindingIdent {
                                        id: Ident::new("o".into(), DUMMY_SP, Default::default()),
                                        type_ann: None,
                                    }),
                                    Pat::Ident(BindingIdent {
                                        id: Ident::new("v".into(), DUMMY_SP, Default::default()),
                                        type_ann: None,
                                    })
                                ],
                                body: Box::new(BlockStmtOrExpr::Expr(Box::new(Expr::Assign(AssignExpr {
                                    span: DUMMY_SP,
                                    op: AssignOp::Assign,
                                    left: AssignTarget::Simple(SimpleAssignTarget::Member(MemberExpr {
                                        span: DUMMY_SP,
                                        obj: Box::new(Expr::Ident(Ident::new("o".into(), DUMMY_SP, Default::default()))),
                                        prop: MemberProp::PrivateName(private_key.clone()),
                                    })),
                                    right: Box::new(Expr::Ident(Ident::new("v".into(), DUMMY_SP, Default::default()))),
                                })))),
                                is_async: false,
                                is_generator: false,
                                type_params: None,
                                return_type: None,
                            })
                        }
                    };

                    // Create element descriptor for all versions
                    let kind_value = if accessor.is_static { 
                        match self.version {
                            DecoratorVersion::V202311 => STATIC + ACCESSOR,
                            _ => STATIC_OLD_VERSION + ACCESSOR
                        }
                    } else { 
                        ACCESSOR 
                    };
                    
                    // Handle multiple decorators
                    let decorator_expr = if accessor.decorators.len() == 1 {
                        accessor.decorators[0].expr.clone()
                    } else {
                        Box::new(Expr::Array(ArrayLit {
                            span: DUMMY_SP,
                            elems: accessor.decorators.iter().map(|d| Some(d.expr.clone().as_arg())).collect(),
                        }))
                    };
                    
                    let mut desc_elems = vec![
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
                    ];
                    
                    // For auto accessors, always add getter and setter functions
                    desc_elems.push(Some(getter_expr.as_arg()));
                    desc_elems.push(Some(setter_expr.as_arg()));
                    
                    let element_desc = ArrayLit {
                        span: DUMMY_SP,
                        elems: desc_elems,
                    };
                    element_decs.push(element_desc.as_arg());

                    // Transform to private field with initializer
                    let mut init_args = if accessor.is_static && self.version == DecoratorVersion::V202311 {
                        // For static accessors in 2023-11, don't pass 'this'
                        vec![]
                    } else {
                        // For instance accessors or static in 2022-03, pass 'this'
                        vec![Expr::This(ThisExpr { span: DUMMY_SP }).as_arg()]
                    };
                    if let Some(value) = accessor.value {
                        init_args.push((*value).as_arg());
                    } else if accessor.is_static && self.version == DecoratorVersion::V202311 {
                        // For static accessors in 2023-11, always pass 0 as default value
                        init_args.push(Expr::Lit(Lit::Num(Number { span: DUMMY_SP, value: 0.0, raw: None })).as_arg());
                    }
                    
                    // Static auto accessors don't need _initStatic in 2023-11
                    // (they handle initialization through their own init/get/set functions)
                    
                    let init_call = Expr::Call(CallExpr {
                        span: DUMMY_SP,
                        ctxt: Default::default(),
                        callee: init_id.as_callee(),
                        args: init_args,
                        type_args: None,
                    });

                    // Add private field for storage (always use different name from original accessor)
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

                    // Get the already created get/set identifiers
                    let get_id_ref = &get_id;
                    let set_id_ref = &set_id;

                    match accessor.key {
                        Key::Public(key) => {
                            // Add getter
                            // Create the getter arguments based on version and static status
                            let getter_args = if accessor.is_static && self.version == DecoratorVersion::V202311 {
                                // For static accessors in 2023-11, no args
                                vec![]
                            } else {
                                // For instance accessors or static in 2022-03, pass 'this'
                                vec![Expr::This(ThisExpr { span: accessor.span }).as_arg()]
                            };
                            
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
                                            arg: Some(Box::new(Expr::Call(CallExpr {
                                                span: accessor.span,
                                                ctxt: Default::default(),
                                                callee: get_id_ref.clone().as_callee(),
                                                args: getter_args,
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
                            
                            // Add setter
                            // Create the setter arguments based on version and static status
                            let setter_args = if accessor.is_static && self.version == DecoratorVersion::V202311 {
                                // For static accessors in 2023-11, only the value
                                vec![Expr::Ident(Ident::new("v".into(), accessor.span, Default::default())).as_arg()]
                            } else {
                                // For instance accessors or static in 2022-03, pass 'this' and value
                                vec![
                                    Expr::This(ThisExpr { span: accessor.span }).as_arg(),
                                    Expr::Ident(Ident::new("v".into(), accessor.span, Default::default())).as_arg()
                                ]
                            };
                            
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
                                            expr: Box::new(Expr::Call(CallExpr {
                                                span: accessor.span,
                                                ctxt: Default::default(),
                                                callee: set_id_ref.clone().as_callee(),
                                                args: setter_args,
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
                        Key::Private(key) => {
                            // Add private getter
                            // Create the getter arguments for private accessors
                            let private_getter_args = if accessor.is_static && self.version == DecoratorVersion::V202311 {
                                // For static private accessors in 2023-11, no args
                                vec![]
                            } else {
                                // For instance private accessors or static in 2022-03, pass 'this'
                                vec![Expr::This(ThisExpr { span: accessor.span }).as_arg()]
                            };
                            
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
                                                callee: get_id_ref.clone().as_callee(),
                                                args: private_getter_args,
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
                            // Create the setter arguments for private accessors
                            let private_setter_args = if accessor.is_static && self.version == DecoratorVersion::V202311 {
                                // For static private accessors in 2023-11, only the value
                                vec![Expr::Ident(Ident::new("v".into(), accessor.span, Default::default())).as_arg()]
                            } else {
                                // For instance private accessors or static in 2022-03, pass 'this' and value
                                vec![
                                    Expr::This(ThisExpr { span: accessor.span }).as_arg(),
                                    Expr::Ident(Ident::new("v".into(), accessor.span, Default::default())).as_arg()
                                ]
                            };
                            
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
                                                callee: set_id_ref.clone().as_callee(),
                                                args: private_setter_args,
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

                    // Add field initialization - separate init and init_extra calls
                    if accessor.is_static {
                        // For static accessors, fix initialization to use correct class reference
                        let static_init_call = if self.version == DecoratorVersion::V202311 {
                            // For 2023-11, static init should reference the class, not 'this'
                            init_call
                        } else {
                            // For 2022-03, use 'this'
                            init_call
                        };
                        
                        static_field_initializer_expressions.push(Expr::Assign(AssignExpr {
                            span: DUMMY_SP,
                            op: AssignOp::Assign,
                            left: AssignTarget::Simple(SimpleAssignTarget::Member(MemberExpr {
                                span: DUMMY_SP,
                                obj: Box::new(Expr::This(ThisExpr { span: DUMMY_SP })),
                                prop: MemberProp::PrivateName(private_key.clone()),
                            })),
                            right: Box::new(static_init_call),
                        }));
                        // For 2023-11, add init_extra call to static block
                        if let Some(ref extra_id) = init_extra_id {
                            static_field_initializer_expressions.push(Expr::Call(CallExpr {
                                span: DUMMY_SP,
                                ctxt: Default::default(),
                                callee: extra_id.clone().as_callee(),
                                args: vec![],
                                type_args: None,
                            }));
                        }
                    } else {
                        field_initializer_expressions.push(Expr::Assign(AssignExpr {
                            span: DUMMY_SP,
                            op: AssignOp::Assign,
                            left: AssignTarget::Simple(SimpleAssignTarget::Member(MemberExpr {
                                span: DUMMY_SP,
                                obj: Box::new(Expr::This(ThisExpr { span: DUMMY_SP })),
                                prop: MemberProp::PrivateName(private_key.clone()),
                            })),
                            right: Box::new(init_call),
                        }));
                        // For 2023-11, add init_extra call to constructor
                        if let Some(ref extra_id) = init_extra_id {
                            field_initializer_expressions.push(Expr::Call(CallExpr {
                                span: DUMMY_SP,
                                ctxt: Default::default(),
                                callee: extra_id.clone().as_callee(),
                                args: vec![Expr::This(ThisExpr { span: DUMMY_SP }).as_arg()],
                                type_args: None,
                            }));
                        }
                    }
                }
                ClassMember::Method(mut method) if !method.function.decorators.is_empty() => {
                    has_decorators = true;
                    
                    let base_kind = match method.kind {
                        MethodKind::Method => METHOD,
                        MethodKind::Getter => GETTER,
                        MethodKind::Setter => SETTER,
                    };
                    
                    let kind_value = if method.is_static { 
                        match self.version {
                            DecoratorVersion::V202311 => STATIC + base_kind,
                            _ => STATIC_OLD_VERSION + base_kind
                        }
                    } else { 
                        base_kind
                    };
                    
                    // Handle multiple decorators
                    let decorator_expr = if method.function.decorators.len() == 1 {
                        method.function.decorators[0].expr.clone()
                    } else {
                        Box::new(Expr::Array(ArrayLit {
                            span: DUMMY_SP,
                            elems: method.function.decorators.iter().map(|d| Some(d.expr.clone().as_arg())).collect(),
                        }))
                    };
                    
                    let element_desc = ArrayLit {
                        span: DUMMY_SP,
                        elems: vec![
                            Some(decorator_expr.as_arg()),
                            Some(Lit::Num(Number { span: DUMMY_SP, value: kind_value, raw: None }).as_arg()),
                            Some(match &method.key {
                                PropName::Ident(id) => Expr::Lit(Lit::Str(Str {
                                    span: DUMMY_SP,
                                    value: id.sym.clone(),
                                    raw: None,
                                })),
                                PropName::Str(s) => Expr::Lit(Lit::Str(s.clone())),
                                PropName::Computed(computed) => *computed.expr.clone(),
                                _ => Expr::Lit(Lit::Str(Str {
                                    span: DUMMY_SP,
                                    value: "method".into(),
                                    raw: None,
                                }))
                            }.as_arg()),
                        ],
                    };
                    element_decs.push(element_desc.as_arg());

                    // For instance methods, add protoInit call
                    if !method.is_static {
                        if proto_init_local.is_none() {
                            proto_init_local = Some(Ident::new("_initProto".into(), DUMMY_SP, Default::default()));
                        }
                    } else {
                        if static_init_local.is_none() {
                            static_init_local = Some(Ident::new("_initStatic".into(), DUMMY_SP, Default::default()));
                        }
                    }

                    // Clear decorators from method
                    method.function.decorators.clear();

                    new_members.push(ClassMember::Method(method));
                }
                ClassMember::PrivateMethod(mut method) if !method.function.decorators.is_empty() => {
                    has_decorators = true;

                    // Create element descriptor [decorator(s), kind, name]
                    let base_kind = match method.kind {
                        MethodKind::Method => METHOD,
                        MethodKind::Getter => GETTER,
                        MethodKind::Setter => SETTER,
                    };
                    
                    let kind_value = if method.is_static { 
                        match self.version {
                            DecoratorVersion::V202311 => STATIC + base_kind,
                            _ => STATIC_OLD_VERSION + base_kind
                        }
                    } else { 
                        base_kind
                    };
                    
                    // Handle multiple decorators
                    let decorator_expr = if method.function.decorators.len() == 1 {
                        method.function.decorators[0].expr.clone()
                    } else {
                        Box::new(Expr::Array(ArrayLit {
                            span: DUMMY_SP,
                            elems: method.function.decorators.iter().map(|d| Some(d.expr.clone().as_arg())).collect(),
                        }))
                    };
                    
                    let element_desc = ArrayLit {
                        span: DUMMY_SP,
                        elems: vec![
                            Some(decorator_expr.as_arg()),
                            Some(Lit::Num(Number { span: DUMMY_SP, value: kind_value, raw: None }).as_arg()),
                            Some(Expr::Lit(Lit::Str(Str {
                                span: DUMMY_SP,
                                value: method.key.name.clone(),
                                raw: None,
                            })).as_arg()),
                        ],
                    };
                    element_decs.push(element_desc.as_arg());

                    // For instance methods, add protoInit call
                    if !method.is_static {
                        if proto_init_local.is_none() {
                            proto_init_local = Some(Ident::new("_initProto".into(), DUMMY_SP, Default::default()));
                        }
                    } else {
                        if static_init_local.is_none() {
                            static_init_local = Some(Ident::new("_initStatic".into(), DUMMY_SP, Default::default()));
                        }
                    }

                    // Clear decorators from method
                    method.function.decorators.clear();

                    new_members.push(ClassMember::PrivateMethod(method));
                }
                ClassMember::AutoAccessor(accessor) => {
                    // Transform auto-accessor to getter/setter
                    new_members.extend(self.transform_auto_accessor(accessor));
                }
                _ => {
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

        // Create variable declarations - build the list of all variables that need to be declared
        let has_class_decs = !class_decs.is_empty();
        let mut all_var_decls = Vec::new();

        // Add _initClass and _initProto if needed
        if has_class_decs {
            all_var_decls.push(VarDeclarator {
                span: DUMMY_SP,
                name: Ident::new("_initClass".into(), DUMMY_SP, Default::default()).into(),
                init: None,
                definite: false,
            });
        }
        if let Some(proto_init) = &proto_init_local {
            all_var_decls.push(VarDeclarator {
                span: DUMMY_SP,
                name: proto_init.clone().into(),
                init: None,
                definite: false,
            });
        }
        if let Some(static_init) = &static_init_local {
            all_var_decls.push(VarDeclarator {
                span: DUMMY_SP,
                name: static_init.clone().into(),
                init: None,
                definite: false,
            });
        }

        // Add init_vars (field initializers)
        for var in &init_vars {
            all_var_decls.push(VarDeclarator {
                span: DUMMY_SP,
                name: var.clone().into(),
                init: None,
                definite: false,
            });
        }

        // Declare all variables with var at the top level
        if !all_var_decls.is_empty() {
            extra_stmts.push(Stmt::Decl(Decl::Var(Box::new(VarDecl {
                span: DUMMY_SP,
                ctxt: Default::default(),
                kind: VarDeclKind::Var, // Use var for 2022-03 compatibility 
                declare: false,
                decls: all_var_decls,
            }))));
        }

        // Declare class variables separately with let
        if has_class_decs {
            extra_stmts.push(Stmt::Decl(Decl::Var(Box::new(VarDecl {
                span: DUMMY_SP,
                ctxt: Default::default(),
                kind: VarDeclKind::Let,
                declare: false,
                decls: vec![VarDeclarator {
                    span: DUMMY_SP,
                    name: Ident::new("_C".into(), DUMMY_SP, Default::default()).into(),
                    init: None,
                    definite: false,
                }],
            }))));
        }

        // Create apply_decs call - first argument is always 'this'
        let mut args = vec![Expr::This(ThisExpr { span: DUMMY_SP }).as_arg()];
        
        // Element decorators array (second parameter for both versions)
        args.push(ArrayLit {
            span: DUMMY_SP,
            elems: element_decs.into_iter().map(Some).collect(),
        }.as_arg());
        
        // Class decorators array (third parameter for both versions)
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
        
        // Build element decorators list (init_vars + proto_init_local + static_init_local)
        let mut element_vars = init_vars.clone();
        if let Some(proto_init) = &proto_init_local {
            element_vars.push(proto_init.clone());
        }
        if let Some(static_init) = &static_init_local {
            element_vars.push(static_init.clone());
        }
        
        if !element_vars.is_empty() {
            props.push(ObjectPatProp::KeyValue(KeyValuePatProp {
                key: PropName::Ident(quote_ident!("e")),
                value: Box::new(Pat::Array(ArrayPat {
                    span: DUMMY_SP,
                    elems: element_vars.iter().map(|v| Some(v.clone().into())).collect(),
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
        if !element_vars.is_empty() || has_class_decs {
            let destructuring_target = if !element_vars.is_empty() && has_class_decs {
                // Both element and class decorators: { e: [...], c: [...] } = _apply_decs_2203_r(...)
                AssignTarget::Pat(AssignTargetPat::Object(ObjectPat {
                    span: DUMMY_SP,
                    props,
                    optional: false,
                    type_ann: None,
                }))
            } else if !element_vars.is_empty() {
                // Only element decorators: [_init_a, _init_b] = _apply_decs_2203_r(...).e
                AssignTarget::Pat(AssignTargetPat::Array(ArrayPat {
                    span: DUMMY_SP,
                    elems: element_vars.iter().map(|v| Some(v.clone().into())).collect(),
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

            let assign_expr = if !element_vars.is_empty() && !has_class_decs {
                // For element-only decorators, access .e property
                Box::new(Expr::Member(MemberExpr {
                    span: DUMMY_SP,
                    obj: Box::new(apply_call.into()),
                    prop: MemberProp::Ident(quote_ident!("e")),
                }))
            } else if element_vars.is_empty() && has_class_decs {
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
            // Insert the static block at the beginning of the class
            class.body.insert(0, static_block);
        }

        // Add initClass call if needed
        if has_class_decs {
            // For 2023-11, class decorators return an init function that should be called
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

        // Add protoInit call to constructor if needed
        if let Some(proto_init) = &proto_init_local {
            // Find or create constructor
            let mut constructor_idx = None;
            for (idx, member) in class.body.iter().enumerate() {
                if let ClassMember::Constructor(_ctor) = member {
                    constructor_idx = Some(idx);
                    break;
                }
            }

            let proto_init_call = Stmt::Expr(ExprStmt {
                span: DUMMY_SP,
                expr: Box::new(Expr::Call(CallExpr {
                    span: DUMMY_SP,
                    ctxt: Default::default(),
                    callee: proto_init.clone().as_callee(),
                    args: vec![Expr::This(ThisExpr { span: DUMMY_SP }).as_arg()],
                    type_args: None,
                })),
            });

            if let Some(idx) = constructor_idx {
                // Insert into existing constructor
                if let ClassMember::Constructor(ctor) = &mut class.body[idx] {
                    // Insert at beginning of constructor (or after super call if it exists)
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
                        ctor.body.as_mut().unwrap().stmts.insert(idx + 1, proto_init_call);
                    } else {
                        // No super call, insert at beginning
                        ctor.body.as_mut().unwrap().stmts.insert(0, proto_init_call);
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
                
                ctor_stmts.push(proto_init_call);

                class.body.insert(0, ClassMember::Constructor(Constructor {
                    span: DUMMY_SP,
                    ctxt: Default::default(),
                    key: PropName::Ident(quote_ident!("constructor")),
                    params: if has_super { 
                        vec![ParamOrTsParamProp::Param(Param {
                            span: DUMMY_SP,
                            decorators: vec![],
                            pat: Pat::Rest(RestPat {
                                span: DUMMY_SP,
                                arg: Box::new(Pat::Ident(BindingIdent {
                                    id: Ident::new("args".into(), DUMMY_SP, Default::default()),
                                    type_ann: None,
                                })),
                                type_ann: None,
                                dot3_token: DUMMY_SP,
                            }),
                        })]
                    } else { 
                        vec![] 
                    },
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

        // Handle field initializer expressions
        if !field_initializer_expressions.is_empty() {
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
                    let init_stmts: Vec<Stmt> = field_initializer_expressions
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
                
                ctor_stmts.extend(field_initializer_expressions.into_iter().map(|expr| {
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
        if !static_field_initializer_expressions.is_empty() {
            class.body.push(ClassMember::StaticBlock(StaticBlock {
                span: DUMMY_SP,
                body: BlockStmt {
                    span: DUMMY_SP,
                    ctxt: Default::default(),
                    stmts: static_field_initializer_expressions.into_iter().map(|expr| {
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

    fn fold_block_stmt(&mut self, block: BlockStmt) -> BlockStmt {
        let mut new_stmts = Vec::new();
        
        for stmt in block.stmts {
            match stmt {
                Stmt::Decl(Decl::Class(ClassDecl { ident, declare: false, class })) => {
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
                        // For class declarations with decorators, expand into variable declarations + class
                        let (transformed_class, extra_stmts) = self.transform_class_with_decorators(*class);
                        
                        // Add variable declarations first
                        new_stmts.extend(extra_stmts);
                        
                        // Then add the transformed class
                        new_stmts.push(Stmt::Decl(Decl::Class(ClassDecl {
                            ident,
                            declare: false,
                            class: Box::new(transformed_class),
                        })));
                    } else {
                        new_stmts.push(Stmt::Decl(Decl::Class(ClassDecl {
                            ident,
                            declare: false,
                            class: Box::new(self.fold_class(*class)),
                        })));
                    }
                }
                _ => {
                    new_stmts.push(stmt.fold_with(self));
                }
            }
        }
        
        BlockStmt {
            stmts: new_stmts,
            ..block
        }
    }

    fn fold_expr(&mut self, expr: Expr) -> Expr {
        match expr {
            Expr::Class(ClassExpr { ident, class }) => {
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
                    let (transformed_class, extra_stmts) = self.transform_class_with_decorators(*class);
                    
                    // For class expressions with decorators, we need to wrap them in an IIFE
                    // that declares the variables and then returns the class
                    let mut iife_stmts = extra_stmts;
                    
                    // Add the class expression as the return value
                    iife_stmts.push(Stmt::Return(ReturnStmt {
                        span: DUMMY_SP,
                        arg: Some(Box::new(Expr::Class(ClassExpr {
                            ident,
                            class: Box::new(transformed_class),
                        }))),
                    }));
                    
                    // Create IIFE
                    Expr::Call(CallExpr {
                        span: DUMMY_SP,
                        ctxt: Default::default(),
                        callee: Expr::Paren(ParenExpr {
                            span: DUMMY_SP,
                            expr: Box::new(Expr::Fn(FnExpr {
                                ident: None,
                                function: Box::new(Function {
                                    params: vec![],
                                    decorators: vec![],
                                    span: DUMMY_SP,
                                    ctxt: Default::default(),
                                    body: Some(BlockStmt {
                                        span: DUMMY_SP,
                                        ctxt: Default::default(),
                                        stmts: iife_stmts,
                                    }),
                                    is_generator: false,
                                    is_async: false,
                                    type_params: None,
                                    return_type: None,
                                }),
                            })),
                        }).as_callee(),
                        args: vec![],
                        type_args: None,
                    })
                } else {
                    Expr::Class(ClassExpr {
                        ident,
                        class: Box::new(self.fold_class(*class)),
                    })
                }
            }
            _ => expr.fold_children_with(self)
        }
    }

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
            // For classes handled here, they should have been caught by fold_expr for expressions
            // or fold_module for declarations. This is a fallback.
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