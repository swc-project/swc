//! ES2018: Object Rest/Spread Properties
//!
//! This plugin transforms object rest and spread patterns.
//!
//! > This plugin is included in `preset-env`, in ES2018
//!
//! ## Example
//!
//! Input:
//! ```js
//! // Object spread
//! const obj = { ...source, prop: 'value' };
//!
//! // Object rest
//! const { x, y, ...rest } = obj;
//! ```
//!
//! Output:
//! ```js
//! // Object spread
//! const obj = _objectSpread({}, source, { prop: 'value' });
//!
//! // Object rest
//! const { x, y } = obj;
//! const rest = _objectWithoutProperties(obj, ["x", "y"]);
//! ```
//!
//! ## Implementation
//!
//! Implementation based on [@babel/plugin-transform-object-rest-spread](https://babel.dev/docs/babel-plugin-transform-object-rest-spread).
//!
//! ## References:
//!
//! * Babel plugin implementation: <https://github.com/babel/babel/tree/main/packages/babel-plugin-transform-object-rest-spread>
//! * Object rest/spread TC39 proposal: <https://github.com/tc39/proposal-object-rest-spread>

use swc_common::{util::take::Take, DUMMY_SP};
use swc_ecma_ast::*;
use swc_ecma_hooks::VisitMutHook;

use crate::{utils, TraverseCtx};

pub fn hook(config: Config) -> impl VisitMutHook<TraverseCtx> {
    ObjectRestSpreadPass::new(config)
}

#[derive(Default)]
struct ObjectRestSpreadPass {
    config: Config,
    cur_stmt_address: Option<*const Stmt>,
    /// Pending rest patterns that need to be processed
    pending_rest: Vec<PendingRest>,
    /// Pending variable declarations to inject at function body start
    pending_function_vars: Vec<VarDeclarator>,
    /// Track pending_rest length at different points for nested pattern
    /// detection
    pending_rest_stack: Vec<usize>,
}

struct PendingRest {
    /// The object pattern without rest
    props_pat: ObjectPat,
    /// Keys to exclude in helper call
    keys: Vec<PropName>,
    /// The rest binding pattern
    rest_pat: Pat,
    /// Temp identifier if nested
    temp: Option<Ident>,
}

impl ObjectRestSpreadPass {
    fn new(config: Config) -> Self {
        ObjectRestSpreadPass {
            config,
            cur_stmt_address: None,
            pending_rest: Vec::new(),
            pending_function_vars: Vec::new(),
            pending_rest_stack: Vec::new(),
        }
    }

    /// Transform object spread properties
    fn transform_object_spread(&mut self, expr: &mut Expr) {
        let Expr::Object(obj_lit) = expr else {
            return;
        };

        // Check if there are spread elements
        let has_spread = obj_lit
            .props
            .iter()
            .any(|p| matches!(p, PropOrSpread::Spread(..)));
        if !has_spread {
            return;
        }

        let helper_name = if self.config.set_property {
            "extends"
        } else {
            "objectSpread"
        };

        // Collect arguments for the helper call
        let mut args = Vec::new();
        let mut current_obj = ObjectLit {
            span: DUMMY_SP,
            props: Vec::new(),
        };
        let mut first = true;

        for prop in obj_lit.props.take() {
            match prop {
                PropOrSpread::Prop(p) => {
                    // Before spread element, may need to wrap
                    if !first && current_obj.props.is_empty() && !self.config.pure_getters {
                        // Need to call helper on accumulated args
                        if !args.is_empty() {
                            let call = create_helper_call(helper_name, args.take());
                            args.push(ExprOrSpread {
                                spread: None,
                                expr: Box::new(call),
                            });
                        }
                    }
                    current_obj.props.push(PropOrSpread::Prop(p));
                }
                PropOrSpread::Spread(SpreadElement { expr, .. }) => {
                    // Push accumulated object if not empty
                    if first || !current_obj.props.is_empty() {
                        args.push(ExprOrSpread {
                            spread: None,
                            expr: Box::new(Expr::Object(current_obj.take())),
                        });
                        if !first && !self.config.pure_getters {
                            let call = create_helper_call("objectSpreadProps", args.take());
                            args.push(ExprOrSpread {
                                spread: None,
                                expr: Box::new(call),
                            });
                        }
                        first = false;
                    }

                    // Add spread expression
                    args.push(ExprOrSpread { spread: None, expr });
                }
                #[cfg(swc_ast_unknown)]
                _ => unreachable!("unknown PropOrSpread variant"),
            }
        }

        // Push remaining object
        if !current_obj.props.is_empty() {
            let final_helper = if !self.config.pure_getters {
                "objectSpreadProps"
            } else {
                helper_name
            };
            args.push(ExprOrSpread {
                spread: None,
                expr: Box::new(Expr::Object(current_obj)),
            });
            *expr = create_helper_call(final_helper, args);
        } else if !args.is_empty() {
            *expr = create_helper_call(helper_name, args);
        }
    }

    /// Process object rest in patterns
    fn handle_object_pat(&mut self, obj: &mut ObjectPat) {
        // Check if there's a rest element
        let has_rest = matches!(obj.props.last(), Some(ObjectPatProp::Rest(..)));

        if !has_rest {
            return;
        }

        let rest_arg = if let Some(ObjectPatProp::Rest(RestPat { arg, .. })) = obj.props.pop() {
            arg
        } else {
            return;
        };

        // Collect keys to exclude
        let keys: Vec<PropName> = obj
            .props
            .iter()
            .filter_map(|p| match p {
                ObjectPatProp::KeyValue(kv) => Some(kv.key.clone()),
                ObjectPatProp::Assign(a) => Some(PropName::Ident(IdentName::from(a.key.clone()))),
                ObjectPatProp::Rest(_) => None,
                #[cfg(swc_ast_unknown)]
                _ => unreachable!("unknown ObjectPatProp variant"),
            })
            .collect();

        self.pending_rest.push(PendingRest {
            props_pat: obj.clone(),
            keys,
            rest_pat: *rest_arg,
            temp: None,
        });
    }

    /// Flush pending rest patterns into variable declarations
    fn flush_pending_rest(&mut self, ctx: &mut TraverseCtx, source_expr: &Expr) {
        while let Some(pending) = self.pending_rest.pop() {
            // Create the keys array for _objectWithoutProperties
            let keys_array = ArrayLit {
                span: DUMMY_SP,
                elems: pending
                    .keys
                    .iter()
                    .map(|key| {
                        let expr = match key {
                            PropName::Ident(ident) => Expr::Lit(Lit::Str(Str {
                                span: DUMMY_SP,
                                value: ident.sym.clone().into(),
                                raw: None,
                            })),
                            PropName::Str(s) => Expr::Lit(Lit::Str(s.clone())),
                            PropName::Num(n) => Expr::Lit(Lit::Num(n.clone())),
                            PropName::Computed(c) => *c.expr.clone(),
                            PropName::BigInt(b) => Expr::Lit(Lit::BigInt(b.clone())),
                            #[cfg(swc_ast_unknown)]
                            _ => unreachable!("unknown PropName variant"),
                        };
                        Some(ExprOrSpread {
                            spread: None,
                            expr: Box::new(expr),
                        })
                    })
                    .collect(),
            };

            // Create the _object_without_properties call
            let helper_call = create_helper_call(
                "_object_without_properties",
                vec![
                    ExprOrSpread {
                        spread: None,
                        expr: Box::new(source_expr.clone()),
                    },
                    ExprOrSpread {
                        spread: None,
                        expr: Box::new(Expr::Array(keys_array)),
                    },
                ],
            );

            // Create variable declaration for rest
            if let Some(stmt_addr) = self.cur_stmt_address {
                ctx.statement_injector.insert_after(
                    stmt_addr,
                    Stmt::Decl(Decl::Var(Box::new(VarDecl {
                        span: DUMMY_SP,
                        kind: VarDeclKind::Const,
                        decls: vec![VarDeclarator {
                            span: DUMMY_SP,
                            name: pending.rest_pat,
                            init: Some(Box::new(helper_call)),
                            definite: false,
                        }],
                        ..Default::default()
                    }))),
                );
            }
        }
    }
}

impl VisitMutHook<TraverseCtx> for ObjectRestSpreadPass {
    fn enter_stmt(&mut self, stmt: &mut Stmt, _ctx: &mut TraverseCtx) {
        self.cur_stmt_address = Some(stmt as *const Stmt);
    }

    fn enter_decl(&mut self, _decl: &mut Decl, _ctx: &mut TraverseCtx) {}

    fn exit_stmt(&mut self, stmt: &mut Stmt, _ctx: &mut TraverseCtx) {
        // If we have pending rest patterns and this is a VarDecl, add them as new
        // declarators
        if !self.pending_rest.is_empty() {
            if let Stmt::Decl(Decl::Var(var_decl)) = stmt {
                // Get the init expression from the last declarator
                let source_expr = match var_decl.decls.last().and_then(|d| d.init.as_ref()) {
                    Some(init) => init.as_ref().clone(),
                    None => {
                        self.cur_stmt_address = None;
                        return;
                    }
                };

                while let Some(pending) = self.pending_rest.pop() {
                    // Create the keys array for _objectWithoutProperties
                    let keys_array = ArrayLit {
                        span: DUMMY_SP,
                        elems: pending
                            .keys
                            .iter()
                            .map(|key| {
                                let expr = match key {
                                    PropName::Ident(ident) => Expr::Lit(Lit::Str(Str {
                                        span: DUMMY_SP,
                                        value: ident.sym.clone().into(),
                                        raw: None,
                                    })),
                                    PropName::Str(s) => Expr::Lit(Lit::Str(s.clone())),
                                    PropName::Num(n) => Expr::Lit(Lit::Num(n.clone())),
                                    PropName::Computed(c) => *c.expr.clone(),
                                    PropName::BigInt(b) => Expr::Lit(Lit::BigInt(b.clone())),
                                    #[cfg(swc_ast_unknown)]
                                    _ => unreachable!("unknown PropName variant"),
                                };
                                Some(ExprOrSpread {
                                    spread: None,
                                    expr: Box::new(expr),
                                })
                            })
                            .collect(),
                    };

                    // Create the _object_without_properties call
                    let helper_call = create_helper_call(
                        "_object_without_properties",
                        vec![
                            ExprOrSpread {
                                spread: None,
                                expr: Box::new(source_expr.clone()),
                            },
                            ExprOrSpread {
                                spread: None,
                                expr: Box::new(Expr::Array(keys_array)),
                            },
                        ],
                    );

                    // Add as a new declarator in the same VarDecl
                    var_decl.decls.push(VarDeclarator {
                        span: DUMMY_SP,
                        name: pending.rest_pat,
                        init: Some(Box::new(helper_call)),
                        definite: false,
                    });
                }
            }
        }

        self.cur_stmt_address = None;
    }

    fn enter_expr(&mut self, expr: &mut Expr, _ctx: &mut TraverseCtx) {
        // Transform object spread
        self.transform_object_spread(expr);
    }

    fn enter_pat(&mut self, pat: &mut Pat, _ctx: &mut TraverseCtx) {
        // Handle object rest patterns
        if let Pat::Object(obj) = pat {
            self.handle_object_pat(obj);
        }
    }

    fn enter_key_value_pat_prop(&mut self, _kv: &mut KeyValuePatProp, _ctx: &mut TraverseCtx) {
        // Track the current length before visiting the value pattern
        self.pending_rest_stack.push(self.pending_rest.len());
    }

    fn exit_key_value_pat_prop(&mut self, kv: &mut KeyValuePatProp, _ctx: &mut TraverseCtx) {
        // Check if the value pattern added any pending rest
        let prev_len = self.pending_rest_stack.pop().unwrap_or(0);

        if self.pending_rest.len() <= prev_len {
            return;
        }

        // The value pattern created a pending rest (nested pattern with rest)
        // We need to replace it with a temp identifier
        if let Some(pending) = self.pending_rest.last_mut() {
            if pending.temp.is_none() {
                let temp = utils::create_private_ident("_ref");
                pending.temp = Some(temp.clone());

                // Replace the value with temp, preserving default if it exists
                if let Pat::Assign(assign_pat) = kv.value.as_mut() {
                    // Keep the default value, just replace the pattern
                    assign_pat.left = Box::new(Pat::Ident(temp.into()));
                } else {
                    *kv.value = Pat::Ident(temp.into());
                }
            }
        }
    }

    fn enter_var_decl(&mut self, _var_decl: &mut VarDecl, _ctx: &mut TraverseCtx) {}

    fn exit_var_declarator(&mut self, var_decl: &mut VarDeclarator, _ctx: &mut TraverseCtx) {
        // Track the init expression for later use in exit_var_declarators
        // We don't flush here because we want to add to the same VarDecl
        if !self.pending_rest.is_empty() && var_decl.init.is_some() {
            // Just mark that this declarator has rest patterns to process
            // The actual flushing happens in exit_var_declarators
        }
    }

    fn exit_var_decl(&mut self, var_decl: &mut VarDecl, _ctx: &mut TraverseCtx) {
        // If we have pending rest patterns, add them as new declarators
        if self.pending_rest.is_empty() {
            return;
        }

        // Get the init expression from the last declarator
        let source_expr = match var_decl.decls.last().and_then(|d| d.init.as_ref()) {
            Some(init) => init.as_ref().clone(),
            None => {
                return;
            }
        };

        while let Some(pending) = self.pending_rest.pop() {
            // Create the keys array for _objectWithoutProperties
            let keys_array = ArrayLit {
                span: DUMMY_SP,
                elems: pending
                    .keys
                    .iter()
                    .map(|key| {
                        let expr = match key {
                            PropName::Ident(ident) => Expr::Lit(Lit::Str(Str {
                                span: DUMMY_SP,
                                value: ident.sym.clone().into(),
                                raw: None,
                            })),
                            PropName::Str(s) => Expr::Lit(Lit::Str(s.clone())),
                            PropName::Num(n) => Expr::Lit(Lit::Num(n.clone())),
                            PropName::Computed(c) => *c.expr.clone(),
                            PropName::BigInt(b) => Expr::Lit(Lit::BigInt(b.clone())),
                            #[cfg(swc_ast_unknown)]
                            _ => unreachable!("unknown PropName variant"),
                        };
                        Some(ExprOrSpread {
                            spread: None,
                            expr: Box::new(expr),
                        })
                    })
                    .collect(),
            };

            // Create the _object_without_properties call
            let helper_call = create_helper_call(
                "_object_without_properties",
                vec![
                    ExprOrSpread {
                        spread: None,
                        expr: Box::new(source_expr.clone()),
                    },
                    ExprOrSpread {
                        spread: None,
                        expr: Box::new(Expr::Array(keys_array)),
                    },
                ],
            );

            // Add as a new declarator in the same VarDecl
            var_decl.decls.push(VarDeclarator {
                span: DUMMY_SP,
                name: pending.rest_pat,
                init: Some(Box::new(helper_call)),
                definite: false,
            });
        }
    }

    fn exit_var_declarators(
        &mut self,
        declarators: &mut Vec<VarDeclarator>,
        _ctx: &mut TraverseCtx,
    ) {
        // If we have pending rest patterns, add them as new declarators
        if self.pending_rest.is_empty() {
            return;
        }

        // Get the init expression from the last declarator (the one we just processed)
        let source_expr = match declarators.last().and_then(|d| d.init.as_ref()) {
            Some(init) => init.as_ref().clone(),
            None => {
                return;
            }
        };

        while let Some(pending) = self.pending_rest.pop() {
            // Create the keys array for _objectWithoutProperties
            let keys_array = ArrayLit {
                span: DUMMY_SP,
                elems: pending
                    .keys
                    .iter()
                    .map(|key| {
                        let expr = match key {
                            PropName::Ident(ident) => Expr::Lit(Lit::Str(Str {
                                span: DUMMY_SP,
                                value: ident.sym.clone().into(),
                                raw: None,
                            })),
                            PropName::Str(s) => Expr::Lit(Lit::Str(s.clone())),
                            PropName::Num(n) => Expr::Lit(Lit::Num(n.clone())),
                            PropName::Computed(c) => *c.expr.clone(),
                            PropName::BigInt(b) => Expr::Lit(Lit::BigInt(b.clone())),
                            #[cfg(swc_ast_unknown)]
                            _ => unreachable!("unknown PropName variant"),
                        };
                        Some(ExprOrSpread {
                            spread: None,
                            expr: Box::new(expr),
                        })
                    })
                    .collect(),
            };

            // Create the _object_without_properties call
            let helper_call = create_helper_call(
                "_object_without_properties",
                vec![
                    ExprOrSpread {
                        spread: None,
                        expr: Box::new(source_expr.clone()),
                    },
                    ExprOrSpread {
                        spread: None,
                        expr: Box::new(Expr::Array(keys_array)),
                    },
                ],
            );

            // Add as a new declarator in the same VarDecl
            declarators.push(VarDeclarator {
                span: DUMMY_SP,
                name: pending.rest_pat,
                init: Some(Box::new(helper_call)),
                definite: false,
            });
        }
    }

    fn exit_assign_pat_prop(&mut self, _prop: &mut AssignPatProp, _ctx: &mut TraverseCtx) {
        // Assignment patterns with rest are handled via exit_var_declarators
    }

    fn exit_assign_expr(&mut self, assign: &mut AssignExpr, ctx: &mut TraverseCtx) {
        // Handle rest in assignment expressions like ({ x, ...rest } = obj)
        // These need statement injection since they're not in a VarDecl
        if !self.pending_rest.is_empty() {
            self.flush_pending_rest(ctx, &assign.right);
        }
    }

    fn exit_function(&mut self, func: &mut Function, _ctx: &mut TraverseCtx) {
        if self.pending_function_vars.is_empty() {
            return;
        }

        // Inject variable declarations at the start of function body
        if let Some(body) = &mut func.body {
            let var_stmt = Stmt::Decl(Decl::Var(Box::new(VarDecl {
                span: DUMMY_SP,
                kind: VarDeclKind::Const,
                decls: self.pending_function_vars.drain(..).collect(),
                ..Default::default()
            })));
            body.stmts.insert(0, var_stmt);
        }
    }

    fn enter_param(&mut self, _param: &mut Param, _ctx: &mut TraverseCtx) {
        // For parameters, we need to track and handle them differently
        // Store the current param pattern to potentially replace it
        // This is handled in visit_mut_key_value_pat_prop for nested patterns
    }

    fn exit_param(&mut self, param: &mut Param, _ctx: &mut TraverseCtx) {
        // If we have pending rest patterns from this parameter
        if self.pending_rest.is_empty() {
            return;
        }

        // Replace parameter with temp identifier and create destructuring statements
        let temp_ident = utils::create_private_ident("_param");

        // Extract default value if param is AssignPat
        let (_destructure_pat, default_value) = match &mut param.pat {
            Pat::Assign(AssignPat { left, right, .. }) => (left.take(), Some(right.take())),
            pat => (Box::new(pat.take()), None),
        };

        // For nested patterns that already have temps, we need to destructure them
        // first Process in reverse order (last pending rest was innermost)
        while let Some(pending) = self.pending_rest.pop() {
            let source_expr = if let Some(temp) = &pending.temp {
                Expr::Ident(temp.clone())
            } else {
                Expr::Ident(temp_ident.clone())
            };

            // First, if this pending has props_pat (not empty), create destructuring for it
            if !pending.props_pat.props.is_empty() {
                self.pending_function_vars.push(VarDeclarator {
                    span: DUMMY_SP,
                    name: Pat::Object(pending.props_pat.clone()),
                    init: Some(Box::new(source_expr.clone())),
                    definite: false,
                });
            }

            // Create the keys array for _objectWithoutProperties
            let keys_array = ArrayLit {
                span: DUMMY_SP,
                elems: pending
                    .keys
                    .iter()
                    .map(|key| {
                        let expr = match key {
                            PropName::Ident(ident) => Expr::Lit(Lit::Str(Str {
                                span: DUMMY_SP,
                                value: ident.sym.clone().into(),
                                raw: None,
                            })),
                            PropName::Str(s) => Expr::Lit(Lit::Str(s.clone())),
                            PropName::Num(n) => Expr::Lit(Lit::Num(n.clone())),
                            PropName::Computed(c) => *c.expr.clone(),
                            PropName::BigInt(b) => Expr::Lit(Lit::BigInt(b.clone())),
                            #[cfg(swc_ast_unknown)]
                            _ => unreachable!("unknown PropName variant"),
                        };
                        Some(ExprOrSpread {
                            spread: None,
                            expr: Box::new(expr),
                        })
                    })
                    .collect(),
            };

            // Create the _object_without_properties call
            let helper_call = create_helper_call(
                "_object_without_properties",
                vec![
                    ExprOrSpread {
                        spread: None,
                        expr: Box::new(source_expr),
                    },
                    ExprOrSpread {
                        spread: None,
                        expr: Box::new(Expr::Array(keys_array)),
                    },
                ],
            );

            self.pending_function_vars.push(VarDeclarator {
                span: DUMMY_SP,
                name: pending.rest_pat,
                init: Some(Box::new(helper_call)),
                definite: false,
            });
        }

        // Replace param pattern with temp (and default if it exists)
        param.pat = if let Some(default) = default_value {
            Pat::Assign(AssignPat {
                span: DUMMY_SP,
                left: Box::new(Pat::Ident(temp_ident.into())),
                right: default,
            })
        } else {
            Pat::Ident(temp_ident.into())
        };
    }
}

/// Create a helper function call
fn create_helper_call(name: &str, args: Vec<ExprOrSpread>) -> Expr {
    Expr::Call(CallExpr {
        span: DUMMY_SP,
        callee: Callee::Expr(Box::new(Expr::Ident(utils::create_private_ident(name)))),
        args,
        ..Default::default()
    })
}

#[derive(Debug, Clone, Copy, Default)]
pub struct Config {
    pub no_symbol: bool,
    pub set_property: bool,
    pub pure_getters: bool,
}
