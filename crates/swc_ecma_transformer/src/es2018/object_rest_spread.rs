
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
    /// Pending variable declarations to inject
    pending_vars: Vec<VarDeclarator>,
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
            pending_vars: Vec::new(),
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
                        };
                        Some(ExprOrSpread {
                            spread: None,
                            expr: Box::new(expr),
                        })
                    })
                    .collect(),
            };

            // Create the _objectWithoutProperties call
            let helper_call = create_helper_call(
                "objectWithoutProperties",
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

    fn exit_stmt(&mut self, _stmt: &mut Stmt, _ctx: &mut TraverseCtx) {
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

    fn exit_var_declarator(&mut self, var_decl: &mut VarDeclarator, ctx: &mut TraverseCtx) {
        // If we have pending rest patterns, flush them
        if !self.pending_rest.is_empty() {
            if let Some(init) = &var_decl.init {
                self.flush_pending_rest(ctx, init);
            }
        }
    }

    fn exit_assign_pat_prop(&mut self, prop: &mut AssignPatProp, ctx: &mut TraverseCtx) {
        // Handle rest in assignment patterns
        if !self.pending_rest.is_empty() {
            if let Some(value) = &prop.value {
                self.flush_pending_rest(ctx, value);
            }
        }
    }

    fn exit_param(&mut self, _param: &mut Param, _ctx: &mut TraverseCtx) {
        // Handle rest in function parameters
        // For now, we'll need the function to provide the source
        // This is a simplified version - the full implementation would be more complex
        if !self.pending_rest.is_empty() {
            // In function parameters, we need to use the parameter name as source
            // This would require more context tracking
            self.pending_rest.clear();
        }
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
